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

        public async Task<string?> SetOffer(Account account, string value)
        {
            try
            {
                Offer_Preference_Request? offer = await _context.Offer_Preference_Requests.Include(o => o.Account).Where(o => o.Account.Id == account.Id && o.ExperienceType == Enums.ExperienceType.Offer && o.IsDeleted == false).FirstOrDefaultAsync();
                if (offer == null)
                {
                    Offer_Preference_Request newOffer = new Offer_Preference_Request()
                    {
                        Account = account,
                        Content = value,
                        ExperienceType = Enums.ExperienceType.Offer,
                        IsDeleted = false
                    };
                    _context.Offer_Preference_Requests.Add(newOffer);
                }
                else
                {
                    offer.Content = value;
                    _context.Update(offer);
                }
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }

        public async Task<string?> SetPreference(Account account, string value)
        {
            try
            {
                Offer_Preference_Request? offer = await _context.Offer_Preference_Requests.Include(o => o.Account).Where(o => o.Account.Id == account.Id && o.ExperienceType == Enums.ExperienceType.Preference && o.IsDeleted == false).FirstOrDefaultAsync();
                if (offer == null)
                {
                    return "Preference nenalezena";
                }
                offer.Content = value;
                _context.Update(offer);
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }

        public async Task<string?> SetRequest(Account account, string value)
        {
            try
            {
                Offer_Preference_Request? offer = await _context.Offer_Preference_Requests.Include(o => o.Account).Where(o => o.Account.Id == account.Id && o.ExperienceType == Enums.ExperienceType.Request && o.IsDeleted == false).FirstOrDefaultAsync();
                if (offer == null)
                {
                    return "Požadavek nenalezen";
                }
                offer.Content = value;
                _context.Update(offer);
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
