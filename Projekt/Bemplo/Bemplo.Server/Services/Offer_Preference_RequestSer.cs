using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Models;

namespace Bemplo.Server.Services
{
    public class Offer_Preference_RequestSer : IOffer_Preference_RequestSer
    {
        private readonly IOffer_Preference_RequestRep _offer_Preference_RequestRep;

        public Offer_Preference_RequestSer(IOffer_Preference_RequestRep offer_Preference_RequestRep)
        {
            _offer_Preference_RequestRep = offer_Preference_RequestRep;
        }

        public async Task<string?> SetOffer(Account account, string value)
        {
            return await _offer_Preference_RequestRep.SetOffer(account, value);
        }
    }
}
