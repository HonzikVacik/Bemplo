using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.IRepositories;

namespace Bemplo.Server.Services
{
    public class AccountSer : IAccountSer
    {
        private readonly IAccountRep _accountRep;

        public AccountSer(IAccountRep accountRep)
        {
            _accountRep = accountRep;
        }

        public async Task<string?> SetAddress(Account account, string country, string city, string region, string address)
        {
            if (!ValidityControl.IsValidLocation((byte)account.AccountType, country, region,city, address))
            {
                return "Neplatný formát adresy";
            }

            return await _accountRep.SetAddress(account, country, city, region, address);
        }

        public async Task<string?> SetDescription(Account account, string description)
        {
            if (!ValidityControl.IsValidDescription(description))
            {
                return "Popis nesmí být prázdný a zároveň musí být kratší než 5000 znaků";
            }

            return await _accountRep.SetDescription(account, description);
        }
    }
}
