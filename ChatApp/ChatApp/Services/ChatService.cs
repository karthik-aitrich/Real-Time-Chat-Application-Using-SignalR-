using Domain.Repositories.Interfaces;
using Domain.Enums;
using Domain.Models;
using Domain.Services.Interfaces;

namespace ChatApp.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;

        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public async Task<Message> SendMessageAsync( Guid senderId,Guid receiverId,string message)
        {
            var msg = new Message
            {
                MessageId = Guid.NewGuid(),
                SenderId = senderId,
                ReceiverId = receiverId,
                MessageText = message,
                SentAt = DateTime.UtcNow,
                Status = MessageStatusEnum.Sent
            };

            await _chatRepository.SaveMessageAsync(msg);

            return msg; // 🔥 THIS IS THE KEY
        }


        public async Task<List<Message>> GetChatHistoryAsync(Guid user1, Guid user2)
        {
            return await _chatRepository.GetChatHistoryAsync(user1, user2);
        }

        public async Task MarkAsDelivered(Guid messageId)
        {
            var msg = await _chatRepository.GetByIdAsync(messageId);
            if (msg != null && msg.Status == MessageStatusEnum.Sent)
            {
                msg.Status = MessageStatusEnum.Delivered;
                await _chatRepository.UpdateAsync(msg);
            }
        }

        public async Task MarkAsSeen(Guid messageId)
        {
            var msg = await _chatRepository.GetByIdAsync(messageId);
            if (msg != null)
            {
                msg.Status = MessageStatusEnum.Read;
                await _chatRepository.UpdateAsync(msg);
            }
        }

    }
}
