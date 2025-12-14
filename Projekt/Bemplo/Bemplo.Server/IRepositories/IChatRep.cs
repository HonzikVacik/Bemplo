using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IRepositories
{
    public interface IChatRep
    {
        public Task<(ChatList[]?, string?)> GetChatList(Account account);
        public Task<string?> SendMessage(Account account, ChatConnection chatConnection, string message);
        public Task<(Message[]?, string?)> GetMessages(Account account, ChatConnection chatConnection, int lastMessageId, int count);
        public Task<string?> SetLock(Account account, ChatConnection chatConnection, bool locked);
    }
}
