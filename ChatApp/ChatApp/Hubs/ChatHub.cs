using System.Security.Claims;
using ChatApp.Services;
using ChatApp.SignalR;
using Domain.DTOs;
using Domain.Enums;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly IGroupChatService _groupChatService;
        private readonly IUserService _userService;

        public ChatHub(IChatService chatService, IGroupChatService groupChatService, IUserService userService)
        {
            _chatService = chatService;
            _groupChatService = groupChatService;
            _userService = userService;
        }



        public async Task SendGroupMessage(Guid groupId, string message)
        {
            var senderId = GetUserId();
            if (senderId == Guid.Empty)
                throw new HubException("Invalid user");

            var dto = await _groupChatService.SendGroupMessageAsync(
                groupId,
                senderId,
                message
            );

            await Clients.Group(groupId.ToString())
                .SendAsync("ReceiveGroupMessage", dto);
        }




        public async Task SendMessage(Guid senderId, Guid receiverId, string message)
        {
            var savedMessage =
                await _chatService.SendMessageAsync(senderId, receiverId, message);

            // 🔥 lightweight, safe, clean
            var sender = await _userService.GetUserBasicAsync(senderId);

            var realtimeDto = new RealtimeChatMessageDto
            {
                MessageId = savedMessage.MessageId,
                SenderId = savedMessage.SenderId,
                ReceiverId = savedMessage.ReceiverId,
                SenderName = sender?.UserName ?? "Unknown",
                MessageText = savedMessage.MessageText,
                SentAt = savedMessage.SentAt
            };

            // Sender always gets it
            await Clients.User(senderId.ToString())
                .SendAsync("ReceiveMessage", realtimeDto);

            // Receiver only if online
            if (UserConnectionManager.IsOnline(receiverId))
            {
                await Clients.User(receiverId.ToString())
                    .SendAsync("ReceiveMessage", realtimeDto);

                await _chatService.MarkAsDelivered(savedMessage.MessageId);

                await Clients.User(senderId.ToString())
                    .SendAsync("MessageStatusUpdated", new
                    {
                        messageId = savedMessage.MessageId,
                        status = "Delivered"
                    });
            }
        }






        public async Task JoinGroup(Guid groupId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
        }

        public async Task GroupMessageSeen(Guid messageId, Guid groupId)
        {
            var userId = GetUserId();
            if (userId == Guid.Empty) return;

            await _groupChatService.MarkGroupMessageSeenAsync(messageId, userId);

            await Clients.Group(groupId.ToString())
                .SendAsync("GroupMessageSeen", new
                {
                    MessageId = messageId,
                    UserId = userId
                });
        }

        public async Task LeaveGroup(Guid groupId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId.ToString());
        }

        private Guid GetUserId()
        {
            var claim = Context.User?
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return Guid.TryParse(claim, out var id)
                ? id
                : Guid.Empty;
        }


        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();

            if (userId != Guid.Empty)
            {
                UserConnectionManager.Add(userId, Context.ConnectionId);
                // 🔥 STEP 2: send existing online users to the newly connected client
                var onlineUsers = UserConnectionManager.GetOnlineUsers();

                await Clients.Caller.SendAsync("OnlineUsers", onlineUsers);


                await _userService.SetUserOnlineAsync(userId);

                await Clients.All.SendAsync("UserStatusChanged", new
                {
                    UserId = userId,
                    IsOnline = true
                });
            }

            await base.OnConnectedAsync();
        }



        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();

            if (userId != Guid.Empty)
            {
                UserConnectionManager.Remove(userId, Context.ConnectionId);

                // ✅ ONLY mark offline if NO connections remain
                if (!UserConnectionManager.IsOnline(userId))
                {
                    await _userService.SetUserOfflineAsync(userId);

                    await Clients.All.SendAsync("UserStatusChanged", new
                    {
                        UserId = userId,
                        IsOnline = false
                    });
                }
            }

            await base.OnDisconnectedAsync(exception);
        }




        public async Task MessageSeen(Guid messageId, Guid senderId)
        {
            await _chatService.MarkAsSeen(messageId);

            await Clients.User(senderId.ToString())
                .SendAsync("MessageSeen", new
                {
                    messageId = messageId,
                    status = "Read"
                });
        }



        public async Task UserTyping(Guid senderId, Guid receiverId)
        {
            await Clients.User(receiverId.ToString())
                .SendAsync("UserTyping", senderId);
        }

        public async Task UserStoppedTyping(Guid senderId, Guid receiverId)
        {
            await Clients.User(receiverId.ToString())
                .SendAsync("UserStoppedTyping", senderId);
        }




    }
}
