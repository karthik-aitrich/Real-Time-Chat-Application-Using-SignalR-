using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ChangeRoleDto
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public int Role { get; set; }
    }

}
