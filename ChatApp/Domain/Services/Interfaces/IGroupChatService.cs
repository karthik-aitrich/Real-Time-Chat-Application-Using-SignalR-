using Domain.Models;

namespace Domain.Services.Interfaces
{
    public interface IGroupChatService
    {
        Task SendGroupMessageAsync(Guid groupId, Guid senderId, string message);
        Task<List<GroupMessage>> GetGroupMessagesAsync(Guid groupId);
        Task AddMemberAsync(Guid groupId, Guid userId, int role);
    }
}
