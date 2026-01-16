using ChatApp.Data;
using Domain.Repositories.Interfaces;
using Domain.Models;
using Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    public class ChatController : BaseAPIController<ChatController>
    {
        private readonly ChatDbContext _context;
        private readonly IChatService _chatService;
        private readonly IChatRepository _chatRepo;

        public ChatController(ChatDbContext context, IChatService chatService, IChatRepository chatRepo)
        {
            _context = context;
            _chatRepo = chatRepo;
            _chatService = chatService;


        }

        // GET: api/v1/chat/history/{user1}/{user2}
        [Authorize]
        [HttpGet("history/{user1}/{user2}")]
        public IActionResult GetChatHistory(Guid user1, Guid user2)
        {
            var messages = _context.Messages
                .Where(m =>
                    (m.SenderId == user1 && m.ReceiverId == user2) ||
                    (m.SenderId == user2 && m.ReceiverId == user1))
                .OrderBy(m => m.SentAt)
                .Select(m => new
                {
                    m.MessageId,
                    m.SenderId,
                    m.ReceiverId,
                    m.MessageText,
                    m.SentAt
                })
                .ToList();

            return Ok(messages);
        }

        [HttpPost("messages/seen/{messageId}")]
        public async Task<IActionResult> MarkSeen(Guid messageId)
        {
            await _chatService.MarkAsSeen(messageId);
            return Ok();
        }

    }
}
