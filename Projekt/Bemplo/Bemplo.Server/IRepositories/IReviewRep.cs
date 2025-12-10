using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface IReviewRep
    {
        public Task<double?> GetAveragePercentageForExperience(Experience experience);
    }
}
