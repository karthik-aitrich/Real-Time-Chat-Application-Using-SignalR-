using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class CreateGroupDto
    {
        public string Name { get; set; } = string.Empty;
        public List<Guid> MemberIds { get; set; } = new();
    }

}
