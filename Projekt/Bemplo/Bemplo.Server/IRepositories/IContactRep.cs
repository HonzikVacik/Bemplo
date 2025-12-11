using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface IContactRep
    {
        public Task<TransportModels.Contact[]> GetAllContacByAccount(Account Account);
        public Task<string?> SetContacts(Account account, TransportModels.Contact[] contacts);
    }
}
