using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IRepositories
{
    public interface IExperienceRep
    {
        public Task<Experience[]> GetExperienceByAccount(Models.Account account);
    }
}
