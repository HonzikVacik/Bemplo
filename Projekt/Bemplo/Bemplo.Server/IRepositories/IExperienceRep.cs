using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IRepositories
{
    public interface IExperienceRep
    {
        public Task<Models.Experience?> GetExperienceById(int experienceId);
        public Task<Models.Experience[]> GetExperiencesById(int experienceId);
        public Task<TransportModels.Experience[]> GetExperienceByAccount(Models.Account account);
        public Task<string?> SetExperienceToAccount(Account account, SetExperience[] setExperiences);
    }
}
