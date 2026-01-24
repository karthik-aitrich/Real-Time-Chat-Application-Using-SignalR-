using ChatApp.Services;
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



        public async Task SendGroupMessage(Guid groupId, Guid senderId, string message)
        {
            // 🔥 Let SERVICE handle everything
            var dto = await _groupChatService.SendGroupMessageAsync(
                groupId,
                senderId,
                message
            );

            // 🔥 Broadcast SAME DTO to group
            await Clients.Group(groupId.ToString())
                .SendAsync("ReceiveGroupMessage", dto);
        }




        public async Task SendMessage(Guid senderId, Guid receiverId, string message)
        {
            // 1️⃣ Save message & get it back
            var savedMessage = await _chatService.SendMessageAsync(
                senderId,
                receiverId,
                message
            );

            // 2️⃣ Send to receiver
            await Clients.User(receiverId.ToString())
                .SendAsync("ReceiveMessage", savedMessage);

            // 3️⃣ Send to sender (IMPORTANT)
            await Clients.User(senderId.ToString())
                .SendAsync("ReceiveMessage", savedMessage);

            // 4️⃣ Mark as delivered
            savedMessage.Status = MessageStatusEnum.Delivered;
            await _chatService.MarkAsDelivered(savedMessage.MessageId);
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
            var userIdClaim = Context.User?.FindFirst("userId")?.Value;
            return Guid.TryParse(userIdClaim, out var id) ? id : Guid.Empty;
        }


        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (userId != Guid.Empty)
            {
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
                await _userService.SetUserOfflineAsync(userId);

                await Clients.All.SendAsync("UserStatusChanged", new
                {
                    UserId = userId,
                    IsOnline = false
                });
            }

            await base.OnDisconnectedAsync(exception);
        }


        public async Task MessageSeen(Guid messageId, Guid senderId)
        {
            await _chatService.MarkAsSeen(messageId);

            await Clients.User(senderId.ToString())
                .SendAsync("MessageSeen", messageId);
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
