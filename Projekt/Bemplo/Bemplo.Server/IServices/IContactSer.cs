using Bemplo.Server.Models;

namespace Bemplo.Server.IServices
{
    public interface IContactSer
    {
        public Task<string?> SetContact(Account account, string email);
    }
}
