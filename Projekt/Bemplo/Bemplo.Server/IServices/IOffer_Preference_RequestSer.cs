using Bemplo.Server.Models;

namespace Bemplo.Server.IServices
{
    public interface IOffer_Preference_RequestSer
    {
        public Task<string?> SetOffer(Account account, string value);
    }
}
