using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IServices
{
    public interface IChatSer
    {
        public Task<(ChatList[]?, string?)> GetChatList(Account account);
        public Task<string?> SendMessage(Account account, int ContactId, string message);
        public Task<(Message[]?, string?)> GetMessages(Account account, int ContactId, int lastMessageId);
        public Task<string?> SetLock(Account account, int ContactId, bool locked);
        public Task<string?> CreateChatConnection(int AccountId, int ContactId);
    }
}
