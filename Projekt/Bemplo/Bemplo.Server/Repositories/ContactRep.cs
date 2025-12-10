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
            Contact[]? contact = await _context.Contacts.Where(c => c.Account == Account).ToArrayAsync();

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
    }
}
