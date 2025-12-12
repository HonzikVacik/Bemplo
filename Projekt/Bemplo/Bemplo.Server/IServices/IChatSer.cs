using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IServices
{
    public interface IChatSer
    {
        public Task<(ChatList[]?, string?)> GetChatList(Account account);
        public Task<string?> SendMessage(Account account, int ContactId, string message);
    }
}
