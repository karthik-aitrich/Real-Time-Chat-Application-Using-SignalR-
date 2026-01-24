using Domain.DTOs;
using Domain.Models;

namespace Domain.Repositories.Interfaces
{
    public interface IGroupChatRepository
    {
        //Task SaveGroupMessageAsync(GroupMessage message);
        Task<GroupMessage> AddMessageAsync(Guid groupId, Guid senderId, string message);
        Task<bool> HasUserSeenMessageAsync(Guid messageId, Guid userId);
        Task AddMessageSeenAsync(GroupMessageSeen seen);

        Task<IEnumerable<GroupMessage>> GetGroupMessagesAsync(Guid groupId);

        Task AddMemberAsync(GroupMember member);
        Task<List<GroupMember>> GetGroupMembersAsync(Guid groupId);
    }
}
