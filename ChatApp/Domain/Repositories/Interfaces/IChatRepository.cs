using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.Repositories.Interfaces
{
    public interface IChatRepository
    {
        Task SaveMessageAsync(Message message);
        Task<List<Message>> GetChatHistoryAsync(Guid user1, Guid user2);

        Task<Message?> GetByIdAsync(Guid messageId);
        Task UpdateAsync(Message message);
    }
}
