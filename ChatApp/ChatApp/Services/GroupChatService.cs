using Domain.Enums;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Domain.Services.Interfaces;

namespace ChatApp.Services
{
    public class GroupChatService : IGroupChatService
    {
        private readonly IGroupChatRepository _repo;

        public GroupChatService(IGroupChatRepository repo)
        {
            _repo = repo;
        }

        public async Task SendGroupMessageAsync(Guid groupId, Guid senderId, string message)
        {
            var msg = new GroupMessage
            {
                GroupMessageId = Guid.NewGuid(),
                GroupId = groupId,
                SenderId = senderId,
                MessageText = message,
                SentAt = DateTime.UtcNow
            };

            await _repo.SaveGroupMessageAsync(msg);
        }

        public async Task<List<GroupMessage>> GetGroupMessagesAsync(Guid groupId)
        {
            return await _repo.GetGroupMessagesAsync(groupId);
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
    }
}
