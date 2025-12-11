using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.Repositories;
using System.Diagnostics.Metrics;
using System.Net;

namespace Bemplo.Server.Services
{
    public class ContactSer : IContactSer
    {
        private readonly ApplicationDbContext _context;
        private readonly IContactRep contactRep;
        private readonly IAccountRep accountRep;

        public ContactSer(ApplicationDbContext applicationDbContext, IContactRep _contactRep, IAccountRep _accountRep)
        {
            _context = applicationDbContext;
            this.contactRep = _contactRep;
            this.accountRep = _accountRep;
        }

        public async Task<string?> SetContact(Account account, string email)
        {
            if (!ValidityControl.IsValidEmail(email))
            {
                return "Neplatný formát emailu";
            }
            if(!ValidityControl.IsEmailUnique(_context, email))
            {
                return "Účet s tímto emailem již existuje.";
            }

            //TODO: dodělat kontakty
           
            return await accountRep.SetEmailAddress(account, email);
        }
    }
}
