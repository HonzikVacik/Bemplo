using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface IOffer_Preference_RequestRep
    {
        public Task<string> GetLastOfferByAccount(Account account);
        public Task<string> GetLastPreferenceByAccount(Account account);
        public Task<string> GetLastReuestByAccount(Account account);
        public Task<string?> SetOffer(Account account, string value);
        public Task<string?> SetPreference(Account account, string value);
        public Task<string?> SetRequest(Account account, string value);
    }
}
