using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Data
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ChatGroup> ChatGroups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<UserStatus> UserStatuses { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public DbSet<GroupMessageSeen> GroupMessageSeens { get; set; }

        //public DbSet<group>
        public DbSet<GroupMessage> GroupMessages { get; set; }
    }
}
