using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IServices
{
    public interface IChatSer
    {
        public Task<(ChatList[]?, string?)> GetChatList(Account account);
    }
}
