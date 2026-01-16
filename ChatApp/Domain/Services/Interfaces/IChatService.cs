using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Domain.Services.Interfaces
{
    public interface IChatService
    {
        Task SendMessageAsync(Guid senderId, Guid receiverId, string message);
        Task<List<Message>> GetChatHistoryAsync(Guid user1, Guid user2);



        Task MarkAsDelivered(Guid messageId);
        Task MarkAsSeen(Guid messageId);



    }
}

