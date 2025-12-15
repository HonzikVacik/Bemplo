using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IRepositories
{
    public interface IExperienceRep
    {
        public Task<Models.Experience?> GetExperienceById(int experienceId);
        public Task<Experience[]> GetExperienceByAccount(Models.Account account);
    }
}
