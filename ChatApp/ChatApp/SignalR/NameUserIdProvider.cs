using Microsoft.AspNetCore.SignalR;

namespace ChatApp.SignalR
{
    public class NameUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User?
                .FindFirst("userId")?
                .Value;
        }
    }
}
