using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class ContactRep : IContactRep
    {
        private readonly ApplicationDbContext _context;

        public ContactRep(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<TransportModels.Contact[]> GetAllContacByAccount(Account Account)
        {
            List<TransportModels.Contact> resultContact = new List<TransportModels.Contact>();
            Contact[]? contact = await _context.Contacts.Where(c => c.Account == Account && c.IsDeleted == false).ToArrayAsync();

            if (contact == null)
                return resultContact.ToArray();
            else
            {
                foreach (var contactItem in contact)
                {
                    TransportModels.Contact c = new TransportModels.Contact();
                    c.Id = contactItem.Id;
                    c.Content = contactItem.Content;
                    resultContact.Add(c);
                }

                return resultContact.ToArray();
            }
        }

        public async Task<string?> SetContacts(Account account, TransportModels.Contact[] contacts)
        {
            try
            {
                Account? acc = await _context.Accounts.Where(a => a.Id == account.Id && a.IsDeleted == false).FirstOrDefaultAsync();
                if (acc == null)
                {
                    return "Uživatel nenalezen";
                }

                foreach (TransportModels.Contact contact in contacts)
                {
                    if (contact.Id == -1)
                    {
                        Models.Contact c = new Models.Contact();
                        c.Account = account;
                        c.Content = contact.Content;
                        c.IsDeleted = false;
                        _context.Contacts.Add(c);
                    }
                    else
                    {
                        Models.Contact? c = await _context.Contacts.Where(c => c.Account == account && c.IsDeleted == false && c.Id == contact.Id).FirstOrDefaultAsync();
                        if(c == null)
                        {
                            return "Kontakt " + contact.Content + " neexistuje";
                        }
                        else
                        {
                            c.Content = contact.Content;
                            _context.Update(contact);
                        }
                    }
                }

                _context.Update(acc);
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
