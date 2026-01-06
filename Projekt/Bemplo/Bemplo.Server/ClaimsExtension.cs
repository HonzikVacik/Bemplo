using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace Bemplo.Server
{
    public static class ClaimsExtensions
    {
        public static async Task<Account?> GetAccountAsync(this ClaimsPrincipal user, ApplicationDbContext context)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(email))
            {
                return null;
            }

            return await context.Accounts.FirstOrDefaultAsync(a => a.Email == email && a.IsDeleted == false);
        }
    }
}
