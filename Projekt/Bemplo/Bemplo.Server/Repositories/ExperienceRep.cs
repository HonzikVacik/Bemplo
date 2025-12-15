using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class ExperienceRep : IExperienceRep
    {
        private readonly ApplicationDbContext _context;
        private readonly IReviewRep _reviewRep;
        public ExperienceRep(ApplicationDbContext context, IReviewRep reviewRep)
        {
            _context = context;
            _reviewRep = reviewRep;
        }
        public async Task<TransportModels.Experience[]> GetExperienceByAccount(Account account)
        {
            List<TransportModels.Experience> resultExperiences = new List<TransportModels.Experience>();
            Models.Experience[]? experiences = await _context.Experiences.Where(e => e.Account == account).ToArrayAsync();
            if (experiences == null)
            {
                return resultExperiences.ToArray();
            }
            else
            {
                foreach (Models.Experience experience in experiences)
                {
                    TransportModels.Experience e = new TransportModels.Experience();
                    e.Id = experience.Id;
                    e.Content = experience.Content;
                    e.Percentage = experience.Percentage;
                    e.ReviewPercentage = await _reviewRep.GetAveragePercentageForExperience(experience);
                    resultExperiences.Add(e);
                }
                return resultExperiences.ToArray();
            }
        }

        public async Task<Experience?> GetExperienceById(int experienceId)
        {
            return await _context.Experiences.Where(e => e.Id == experienceId).FirstOrDefaultAsync();
        }

        public async Task<Experience[]> GetExperiencesById(int experienceId)
        {
            List<Experience> experiences = new List<Experience>();

            Experience? lastExperience = await _context.Experiences.Where(e => e.Id == experienceId).FirstOrDefaultAsync();
            if (lastExperience == null)
            {
                return experiences.ToArray();
            }
            experiences.Add(lastExperience);
            while (lastExperience != null)
            {
                Experience? nextExperience = await _context.Experiences.Where(e => e.OldExperience == lastExperience).FirstOrDefaultAsync();
                lastExperience = nextExperience;
                if (nextExperience != null)
                {
                    experiences.Add(nextExperience);
                }
            }
            return experiences.ToArray();
        }
    }
}
