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
            searchString = searchString.ToLower();
            string[] searchParams = searchString.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            List<Account> accounts = new List<Account>();

            //Name
            foreach(string param in searchParams)
            {
                Account[] accs = await _context.Accounts.Where(a => a.Name.Trim().ToLower().Contains(param)).ToArrayAsync();
                accounts.AddRange(accs);
            }

            //Surname
            foreach (string param in searchParams)
            {
                Account[] accs = await _context.Accounts.Where(a => a.Surname.Trim().ToLower().Contains(param) && a.IsDeleted == false).ToArrayAsync();
                accounts.AddRange(accs);
            }

            //Description
            foreach (string param in searchParams)
            {
                Account[] accs = await _context.Accounts.Where(a => a.Description.Trim().ToLower().Contains(param) && a.IsDeleted == false).ToArrayAsync();
                accounts.AddRange(accs);
            }

            //Country
            foreach (string param in searchParams)
            {
                Account[] accs = await _context.Accounts.Where(a => a.Country.Trim().ToLower().Contains(param) && a.IsDeleted == false).ToArrayAsync();
                accounts.AddRange(accs);
            }

            //Region
            foreach (string param in searchParams)
            {
                Account[] accs = await _context.Accounts.Where(a => a.Region.Trim().ToLower().Contains(param) && a.IsDeleted == false).ToArrayAsync();
                accounts.AddRange(accs);
            }

            //City
            foreach (string param in searchParams)
            {
                Account[] accs = await _context.Accounts.Where(a => a.City.Trim().ToLower().Contains(param) && a.IsDeleted == false).ToArrayAsync();
                accounts.AddRange(accs);
            }

            accounts = accounts.Distinct().ToList();


            return accounts.Select(a => new SearchModel { Id = a.Id, Name = a.AccountType == 0 ? $"{a.Name} {a.Surname}" : a.Name, Description = a.Description }).ToArray();
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
