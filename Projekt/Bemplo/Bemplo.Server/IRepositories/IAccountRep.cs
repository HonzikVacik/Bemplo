using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface IAccountRep
    {
        public Task<Account?> GetAccountById(int id);
    }
}
