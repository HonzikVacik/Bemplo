using Bemplo.Server.Models;

namespace Bemplo.Server.IServices
{
    public interface IAccountSer
    {
        public Task<string?> SetDescription(Account account, string description);
    }
}
