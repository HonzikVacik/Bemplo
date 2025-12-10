using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
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
    }
}
