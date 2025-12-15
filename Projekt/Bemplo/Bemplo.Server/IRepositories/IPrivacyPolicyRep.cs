using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface IPrivacyPolicyRep
    {
        public Task<ResponseModels.PrivacyPolicy?> GetPrivacyPolicy();
        public Task<string?> AgreeWithPrivacyPolicy(Account account);
    }
}
