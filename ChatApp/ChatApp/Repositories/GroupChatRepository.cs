using ChatApp.Data;
using Domain.Models;
using Domain.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Repositories
{
    public class GroupChatRepository : IGroupChatRepository
    {
        private readonly ChatDbContext _context;

        public GroupChatRepository(ChatDbContext context)
        {
            _context = context;
        }

        public async Task SaveGroupMessageAsync(GroupMessage message)
        {
            _context.GroupMessages.Add(message);
            await _context.SaveChangesAsync();
        }

        public async Task<List<GroupMessage>> GetGroupMessagesAsync(Guid groupId)
        {
            return await _context.GroupMessages
                .Where(m => m.GroupId == groupId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task AddMemberAsync(GroupMember member)
        {
            _context.GroupMembers.Add(member);
            await _context.SaveChangesAsync();
        }

        public async Task<List<GroupMember>> GetGroupMembersAsync(Guid groupId)
        {
            return await _context.GroupMembers
                .Where(g => g.GroupId == groupId)
                .ToListAsync();
        }
    }
}
