using Bemplo.Server.Models;

namespace Bemplo.Server.IServices
{
    public interface IOffer_Preference_RequestSer
    {
        public Task<string?> SetOffer(Account account, string value);
        public Task<string?> SetPreference(Account account, string value);
        public Task<string?> SetRequest(Account account, string value);
    }
}
