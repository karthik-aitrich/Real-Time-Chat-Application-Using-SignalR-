using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Domain.Enums;

using System.ComponentModel.DataAnnotations;

public class GroupMember
{
    [Key]
    public Guid GroupMemberId { get; set; }

    public Guid GroupId { get; set; }
    public Guid UserId { get; set; }
    public GroupRoleEnum Role { get; set; }
    public DateTime JoinedAt { get; set; }
}


