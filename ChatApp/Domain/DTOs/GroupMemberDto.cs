using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Domain.DTOs
{
    public class GroupMemberDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public GroupRoleEnum Role { get; set; }
        public DateTime JoinedAt { get; set; }
    }

}
