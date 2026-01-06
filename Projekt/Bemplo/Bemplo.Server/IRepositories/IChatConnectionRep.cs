using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface IChatConnectionRep
    {
        public Task<(ChatConnection?, string?)> GetChatConnection(int AccId1, int AccId2);
    }
}
