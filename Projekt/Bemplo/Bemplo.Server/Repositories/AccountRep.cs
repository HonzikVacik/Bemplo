using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Bemplo.Server.ResponseModels;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class AccountRep : IAccountRep
    {
        private readonly ApplicationDbContext _context;

        public AccountRep(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Account?> GetAccountById(int id)
        {
            return await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id && a.IsDeleted == false);
        }

        public async Task<SearchModel[]> SearchAccounts(string searchString)
        {
            Account[] accounts = await _context.Accounts.Where(a => a.Name.Trim().ToLower().Contains(searchString) || a.Surname.Trim().ToLower().Contains(searchString)).ToArrayAsync();
            return accounts.Select(a => new SearchModel { Id = a.Id, Name = a.Name + " " + a.Surname, Description = a.Description }).ToArray();
        }

        public async Task<string?> SetAddress(Account account, string country, string city, string region, string address)
        {
            try
            {
                Account? acc = await _context.Accounts.Where(a => a.Id == account.Id && a.IsDeleted == false).FirstOrDefaultAsync();
                if (acc == null)
                {
                    return "Uživatel nenalezen";
                }
                acc.Country = country;
                acc.Region = region;
                acc.City = city;
                acc.Address = address;
                _context.Update(acc);
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }

        public async Task<string?> SetDescription(Account account, string description)
        {
            try
            {
                Account? acc = await _context.Accounts.Where(a => a.Id == account.Id && a.IsDeleted == false).FirstOrDefaultAsync();
                if(acc == null)
                {
                    return "Uživatel nenalezen";
                }
                acc.Description = description;
                _context.Update(acc);
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }

        public async Task<string?> SetEmailAddress(Account account, string email)
        {
            try
            {
                Account? acc = await _context.Accounts.Where(a => a.Id == account.Id && a.IsDeleted == false).FirstOrDefaultAsync();
                if (acc == null)
                {
                    return "Uživatel nenalezen";
                }
                acc.Email = email;
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
