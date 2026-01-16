using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Domain.Enums;

using System.ComponentModel.DataAnnotations;

public class UserStatus
{
    [Key]
    public Guid UserId { get; set; }

    public int Status { get; set; }
    public DateTime LastActive { get; set; }
}

