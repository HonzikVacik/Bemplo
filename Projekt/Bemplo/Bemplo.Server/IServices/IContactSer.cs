using Bemplo.Server.Models;

namespace Bemplo.Server.IServices
{
    public interface IContactSer
    {
        public Task<TransportModels.Contact[]> GetAllContacByAccount(Account Account);
        public Task<string?> SetContact(Account account, string email, TransportModels.Contact[] contacts);
        public Task<string?> UpdateContacts(Account account, TransportModels.Contact[] contacts);
    }
}
