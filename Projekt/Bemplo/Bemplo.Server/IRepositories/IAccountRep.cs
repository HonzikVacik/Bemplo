using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface IAccountRep
    {
        public Task<Account?> GetAccountById(int id);
        public Task<string?> SetDescription(Account account, string description);
        public Task<string?> SetAddress(Account account, string country, string city, string region, string address);
        public Task<string?> SetEmailAddress(Account account, string email);
    }
}
