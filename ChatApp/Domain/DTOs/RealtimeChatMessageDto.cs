using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class RealtimeChatMessageDto
    {
        public Guid MessageId { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }

        public string SenderName { get; set; }   // 🔥 UI needs this
        public string MessageText { get; set; }
        public DateTime SentAt { get; set; }
    }

}
