using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class User
    {
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public bool IsOnline { get; set; }
        public DateTime LastSeen { get; set; }

        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }

    }
}

