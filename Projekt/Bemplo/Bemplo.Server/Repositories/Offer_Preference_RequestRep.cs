using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class Offer_Preference_RequestRep : IOffer_Preference_RequestRep
    {
        private readonly ApplicationDbContext _context;

        public Offer_Preference_RequestRep(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> GetLastOfferByAccount(Account account)
        {
            Offer_Preference_Request? opr = await _context.Offer_Preference_Requests.Where(opr => opr.ExperienceType == Enums.ExperienceType.Offer && opr.Account == account).OrderBy(o => o.Id).LastOrDefaultAsync();
            if (opr == null)
            {
                return "";
            }
            else
            {
                return opr.Content;
            }
        }

        public async Task<string> GetLastPreferenceByAccount(Account account)
        {
            Offer_Preference_Request? opr = await _context.Offer_Preference_Requests.Where(opr => opr.ExperienceType == Enums.ExperienceType.Preference && opr.Account == account).OrderBy(p => p.Id).LastOrDefaultAsync();
            if (opr == null)
            {
                return "";
            }
            else
            {
                return opr.Content;
            }
        }

        public async Task<string> GetLastReuestByAccount(Account account)
        {
            Offer_Preference_Request? opr = await _context.Offer_Preference_Requests.Where(opr => opr.ExperienceType == Enums.ExperienceType.Request && opr.Account == account).OrderBy(r => r.Id).LastOrDefaultAsync();
            if (opr == null)
            {
                return "";
            }
            else
            {
                return opr.Content;
            }
        }
    }
}
