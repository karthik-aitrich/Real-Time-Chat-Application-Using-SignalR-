using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class GroupMessageSeen
{
    public Guid Id { get; set; }
    public Guid GroupMessageId { get; set; }
    public Guid UserId { get; set; }
    public DateTime SeenAt { get; set; }
}
}
