using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace Bemplo.Server.Repositories
{
    public class PrivacyPolicyRep : IPrivacyPolicyRep
    {
        private readonly ApplicationDbContext _context;

        public PrivacyPolicyRep(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<string?> AgreeWithPrivacyPolicy(Account account)
        {
            Account? acc = await _context.Accounts.Where(a => a.Id == account.Id && a.IsDeleted == false).FirstOrDefaultAsync();
            if (acc == null)
            {
                return "Uživatel nenalezen";
            }

            try
            {
                acc.AgreeWithPolicy = true;
                _context.Accounts.Update(acc);
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }

        public async Task<ResponseModels.PrivacyPolicy?> GetPrivacyPolicy()
        {
            PrivacyPolicy? privacyPolicy = await _context.PrivacyPolicies.LastOrDefaultAsync();
            if (privacyPolicy == null)
            {
                return null;
            }
            else
                return new ResponseModels.PrivacyPolicy()
                {
                    CreatedAt = privacyPolicy.CreatedAt,
                    EffectiveDate = privacyPolicy.EffectiveDate,
                    ExpirationDate = privacyPolicy.ExpirationDate,
                    PolicyText = privacyPolicy.PolicyText
                };
        }
    }
}
