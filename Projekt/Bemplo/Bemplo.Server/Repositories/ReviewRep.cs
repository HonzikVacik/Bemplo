using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;

namespace Bemplo.Server.Repositories
{
    public class ReviewRep : IReviewRep
    {
        private readonly ApplicationDbContext _context;
        public async Task<double?> GetAveragePercentageForExperience(Experience experience)
        {
            var query = _context.Rewiews
                .Where(e => e.Experience == experience)
                .GroupBy(e => e.Evaluator_Account.Id)
                .Select(g => g.OrderByDescending(x => x.Timestamp).Select(x => (double?)x.Percentage).FirstOrDefault());

            double? finalAverage = query.Average() ?? null;
            return finalAverage;
        }
    }
}
