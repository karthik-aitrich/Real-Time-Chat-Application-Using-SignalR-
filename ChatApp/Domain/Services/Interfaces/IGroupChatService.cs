using Domain.DTOs;
using Domain.Models;

namespace Domain.Services.Interfaces
{
    public interface IGroupChatService
    {
        Task<GroupMessageDto> SendGroupMessageAsync(Guid groupId, Guid senderId, string message);
        Task<IEnumerable<GroupMessageDto>> GetGroupMessagesAsync(Guid groupId);
        Task AddMemberAsync(Guid groupId, Guid userId, int role);
    }
}
