using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ChatMessageDto
    {
        public Guid MessageId { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string MessageText { get; set; }
        public DateTime SentAt { get; set; }

        // 🔥 THIS
        public string Status { get; set; }  // "Sent" | "Delivered" | "Read"
    }

}
