using ChatApp.Repositories;
using Domain.DTOs;
using Domain.Enums;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Domain.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services
{
    public class GroupChatService : IGroupChatService
    {
        private readonly IGroupChatRepository _repo;
        private readonly IUserRepository _userRepo;

        public GroupChatService(
            IGroupChatRepository repo,
            IUserRepository userRepo
        )
        {
            _repo = repo;
            _userRepo = userRepo;
        }

        // 🔥 USED BY SIGNALR
        public async Task<GroupMessageDto> SendGroupMessageAsync(
            Guid groupId,
            Guid senderId,
            string message
        )
        {
            // 1️⃣ Save message (entity)
            var savedMessage = await _repo.AddMessageAsync(
                groupId,
                senderId,
                message
            );

            // 2️⃣ Get sender info
            var user = await _userRepo.GetUserByIdAsync(senderId);

            // 3️⃣ Return DTO (NO Id because entity doesn't have it yet)
            return new GroupMessageDto
            {
                GroupId = groupId,
                SenderId = senderId,
                SenderName = user?.UserName ?? "Unknown",
                MessageText = savedMessage.MessageText,
                SentAt = savedMessage.SentAt
            };
        }

        // 🔥 USED BY API CONTROLLER
        public async Task<IEnumerable<GroupMessageDto>> GetGroupMessagesAsync(Guid groupId)
        {
            var messages = await _repo.GetGroupMessagesAsync(groupId);

            var result = new List<GroupMessageDto>();

            foreach (var m in messages)
            {
                var user = await _userRepo.GetUserByIdAsync(m.SenderId);

                result.Add(new GroupMessageDto
                {
                    GroupId = m.GroupId,
                    SenderId = m.SenderId,
                    SenderName = user?.UserName ?? "Unknown",
                    MessageText = m.MessageText,
                    SentAt = m.SentAt
                });
            }

            return result;
        }

        public async Task AddMemberAsync(Guid groupId, Guid userId, int role)
        {
            var member = new GroupMember
            {
                GroupMemberId = Guid.NewGuid(),
                GroupId = groupId,
                UserId = userId,
                Role = GroupRoleEnum.Member,
                JoinedAt = DateTime.UtcNow
            };

            await _repo.AddMemberAsync(member);
        }

        public async Task MarkGroupMessageSeenAsync(Guid messageId, Guid userId)
        {
            // 1️⃣ Check if already seen
            var alreadySeen = await _repo
                .HasUserSeenMessageAsync(messageId, userId);

            if (alreadySeen)
                return;

            // 2️⃣ Add seen record
            var seen = new GroupMessageSeen
            {
                Id = Guid.NewGuid(),
                GroupMessageId = messageId,
                UserId = userId,
                SeenAt = DateTime.UtcNow
            };

            await _repo.AddMessageSeenAsync(seen);
        }


    }
}
