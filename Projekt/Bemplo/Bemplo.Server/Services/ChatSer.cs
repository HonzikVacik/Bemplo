using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.IRepositories;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.Services
{
    public class ChatSer : IChatSer
    {
        private readonly IChatRep _chatRep;

        public ChatSer(IChatRep chatRep)
        {
            _chatRep = chatRep;
        }
        public async Task<(ChatList[]?, string?)> GetChatList(Account account)
        {
            return await _chatRep.GetChatList(account);
        }
    }
}
