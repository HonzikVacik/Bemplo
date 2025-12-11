using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.Repositories;
using Microsoft.IdentityModel.Tokens;
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

        public async Task<string?> SetContact(Account account, string email, TransportModels.Contact[] contacts)
        {
            if (!ValidityControl.IsValidEmail(email))
            {
                return "Neplatný formát emailu";
            }
            if(!ValidityControl.IsEmailUnique(_context, email))
            {
                return "Účet s tímto emailem již existuje.";
            }
            foreach (TransportModels.Contact contact in contacts)
            {
                if (string.IsNullOrEmpty(contact.Content) || string.IsNullOrWhiteSpace(contact.Content))
                {
                    return "Kontakt nesmí být prázdný nebo obsahovat pouze neviditelné znaky.";
                }
            }

            string? result = await contactRep.SetContacts(account, contacts);

            if (result != null)
            {
                return result;
            }
            return await accountRep.SetEmailAddress(account, email);
        }
    }
}
