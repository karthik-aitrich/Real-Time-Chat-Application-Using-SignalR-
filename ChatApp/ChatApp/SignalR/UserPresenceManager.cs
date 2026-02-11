using System.Collections.Concurrent;

namespace ChatApp.SignalR
{
    public static class UserPresenceManager
    {
        private static readonly ConcurrentDictionary<Guid, DateTime> _heartbeats = new();
        private static readonly TimeSpan Timeout = TimeSpan.FromSeconds(30);

        public static void Heartbeat(Guid userId)
        {
            _heartbeats[userId] = DateTime.UtcNow;
        }

        public static void Remove(Guid userId)
        {
            _heartbeats.TryRemove(userId, out _);
        }

        public static bool IsOnline(Guid userId)
        {
            Cleanup();
            return _heartbeats.ContainsKey(userId);
        }

        public static List<Guid> GetOnlineUsers()
        {
            Cleanup();
            return _heartbeats.Keys.ToList();
        }

        private static void Cleanup()
        {
            var now = DateTime.UtcNow;

            foreach (var kv in _heartbeats)
            {
                if (now - kv.Value > Timeout)
                    _heartbeats.TryRemove(kv.Key, out _);
            }
        }
    }

}
