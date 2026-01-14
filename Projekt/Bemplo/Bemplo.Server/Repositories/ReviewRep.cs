using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class ReviewRep : IReviewRep
    {
        private readonly ApplicationDbContext _context;

        public ReviewRep(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<double?> GetAveragePercentageForExperience(Experience experience)
        {
            int experienceId = 0;

            if(experience.OriginalExperienceId != null)
                experienceId = experience.OriginalExperienceId.Value;
            else
                experienceId = experience.Id;

            double? finalAverage = null;

            Review[]? reviews = await _context.Rewiews
                .Where(r => r.Experience.Id == experienceId || r.Experience.OriginalExperienceId == experienceId)
                .ToArrayAsync();

            if (reviews.Count() != 0)
                finalAverage = reviews.Average(r => r.Percentage);

            return finalAverage;
        }
    }
}
