using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics.Metrics;
using System.Net;

namespace Bemplo.Server.Services
{
    public class ContactSer : IContactSer
    {
        private readonly ApplicationDbContext _context;
        private readonly IContactRep _contactRep;
        private readonly IAccountRep _accountRep;

        public ContactSer(ApplicationDbContext applicationDbContext, IContactRep contactRep, IAccountRep accountRep)
        {
            _context = applicationDbContext;
            _contactRep = contactRep;
            _accountRep = accountRep;
        }

        public async Task<TransportModels.Contact[]> GetAllContacByAccount(Account Account)
        {
            return await _contactRep.GetAllContacByAccount(Account);
        }

        public async Task<string?> SetContact(Account account, string email, TransportModels.Contact[] contacts)
        {
            /*if (!ValidityControl.IsValidEmail(email))
            {
                return "Neplatný formát emailu";
            }
            if(!ValidityControl.IsEmailUnique(_context, email))
            {
                return "Účet s tímto emailem již existuje.";
            }*/
            foreach (TransportModels.Contact contact in contacts)
            {
                if (string.IsNullOrEmpty(contact.Content) || string.IsNullOrWhiteSpace(contact.Content))
                {
                    return "Kontakt nesmí být prázdný nebo obsahovat pouze neviditelné znaky.";
                }
            }

            string? result = await _contactRep.SetContacts(account, contacts);

            /*if (result != null)
            {
                return result;
            }
            return await accountRep.SetEmailAddress(account, email);*/

            return result;
        }

        public async Task<string?> UpdateContacts(Account account, TransportModels.Contact[] contacts)
        {
            try
            {
                var existingContacts = await _context.Contacts
                   .Where(c => c.Account.Id == account.Id && c.IsDeleted == false)
                   .ToListAsync();

                foreach (var reqItem in contacts)
                {
                    if (string.IsNullOrWhiteSpace(reqItem.Content)) continue; // Přeskočit prázdné

                    if (reqItem.Id == 0)
                    {
                        // A) INSERT - Nový kontakt
                        var newContact = new Bemplo.Server.Models.Contact
                        {
                            Content = reqItem.Content,
                            Account = account
                        };
                        _context.Contacts.Add(newContact);
                    }
                    else
                    {
                        // B) UPDATE - Existující kontakt
                        var contactToUpdate = existingContacts.FirstOrDefault(c => c.Id == reqItem.Id);
                        if (contactToUpdate != null)
                        {
                            contactToUpdate.Content = reqItem.Content;
                        }
                    }
                }

                var requestIds = contacts
                    .Where(r => r.Id != 0)
                    .Select(r => r.Id)
                    .ToList();

                var contactsToDelete = existingContacts
                    .Where(c => !requestIds.Contains(c.Id))
                    .ToList();

                foreach (Models.Contact contact in contactsToDelete)
                {
                    contact.IsDeleted = true;
                }

                if (contactsToDelete.Count > 0)
                {
                    _context.Contacts.UpdateRange(contactsToDelete);
                }

                await _context.SaveChangesAsync();

                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }
    }
}
