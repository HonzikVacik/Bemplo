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
