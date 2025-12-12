using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IRepositories
{
    public interface IChatRep
    {
        public Task<(ChatList[]?, string?)> GetChatList(Account account);
    }
}
