    using System;
    using System.Collections.Generic;

    namespace ChatApp.SignalR
    {
    public static class UserConnectionManager
    {
        private static readonly Dictionary<Guid, HashSet<string>> _connections = new();
        private static readonly object _lock = new();

        public static void Add(Guid userId, string connectionId)
        {
            lock (_lock)
            {
                if (!_connections.TryGetValue(userId, out var connections))
                {
                    connections = new HashSet<string>();
                    _connections[userId] = connections;
                }

                connections.Add(connectionId);
            }
        }

        public static void Remove(Guid userId, string connectionId)
        {
            lock (_lock)
            {
                if (!_connections.TryGetValue(userId, out var connections))
                    return;

                connections.Remove(connectionId);

                if (connections.Count == 0)
                    _connections.Remove(userId);
            }
        }

        public static bool IsOnline(Guid userId)
        {
            lock (_lock)
            {
                return _connections.ContainsKey(userId);
            }
        }

        public static int ConnectionCount(Guid userId)
        {
            lock (_lock)
            {
                return _connections.TryGetValue(userId, out var connections)
                    ? connections.Count
                    : 0;
            }
        }
        public static IEnumerable<Guid> GetOnlineUsers()
        {
            lock (_lock)
            {
                return _connections.Keys.ToList();
            }
        }

    }


}


