using ChatApp.Data;
using Domain.DTOs;
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

        public async Task<GroupMessage> AddMessageAsync(Guid groupId, Guid senderId, string message)
        {
            var entity = new GroupMessage
            {
                GroupId = groupId,
                SenderId = senderId,
                MessageText = message,
                SentAt = DateTime.UtcNow
            };

            _context.GroupMessages.Add(entity);
            await _context.SaveChangesAsync();

            return entity;
        }


        public async Task<bool> HasUserSeenMessageAsync(Guid messageId, Guid userId)
        {
            return await _context.GroupMessageSeens
                .AnyAsync(x =>
                    x.GroupMessageId == messageId &&
                    x.UserId == userId
                );
        }

        public async Task AddMessageSeenAsync(GroupMessageSeen seen)
        {
            _context.GroupMessageSeens.Add(seen);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<GroupMessage>> GetGroupMessagesAsync(Guid groupId)
        {
            return await _context.GroupMessages
                .Where(m => m.GroupId == groupId)
                .OrderBy(m => m.SentAt)   // 🔥 CRITICAL
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
