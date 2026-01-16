using ChatApp.Data;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ChatDbContext _context;

        public GroupRepository(ChatDbContext context)
        {
            _context = context;
        }

        public async Task CreateGroupAsync(ChatGroup group)
        {
            _context.ChatGroups.Add(group);
            await _context.SaveChangesAsync();
        }

        public async Task AddMemberAsync(GroupMember member)
        {
            _context.GroupMembers.Add(member);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ChatGroup>> GetUserGroupsAsync(Guid userId)
        {
            return await _context.GroupMembers
                .Where(m => m.UserId == userId)
                .Join(
                    _context.ChatGroups,
                    m => m.GroupId,
                    g => g.GroupId,
                    (m, g) => g
                )
                .ToListAsync();
        }
    }
}
