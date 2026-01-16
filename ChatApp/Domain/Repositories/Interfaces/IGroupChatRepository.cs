using Domain.Models;

namespace Domain.Repositories.Interfaces
{
    public interface IGroupChatRepository
    {
        Task SaveGroupMessageAsync(GroupMessage message);
        Task<List<GroupMessage>> GetGroupMessagesAsync(Guid groupId);
        Task AddMemberAsync(GroupMember member);
        Task<List<GroupMember>> GetGroupMembersAsync(Guid groupId);
    }
}
