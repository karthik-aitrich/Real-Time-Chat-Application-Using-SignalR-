using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

public class GroupMessage
{
    [Key]
    public Guid GroupMessageId { get; set; }

    public Guid GroupId { get; set; }
    public Guid SenderId { get; set; }
    public string MessageText { get; set; } = null!;
    public DateTime SentAt { get; set; }
}

