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
            Models.Experience[]? experiences = await _context.Experiences.Where(e => e.Account == account && e.IsOld == false).OrderBy(e => e.OriginalExperienceId).ToArrayAsync();
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

            Experience? lastExperience = await _context.Experiences.Where(e => e.Id == experienceId && e.IsOld == false).FirstOrDefaultAsync();
            if (lastExperience == null)
            {
                return experiences.ToArray();
            }
            experiences.Add(lastExperience);
            
            /*while (lastExperience != null)
            {
                Experience? nextExperience = await _context.Experiences.Where(e => e.OldExperience == lastExperience).FirstOrDefaultAsync();
                lastExperience = nextExperience;
                if (nextExperience != null)
                {
                    experiences.Add(nextExperience);
                }
            }*/
            
            if(lastExperience.OriginalExperienceId != null)
            {
                Experience? originalExperience = await _context.Experiences.Where(e => e.Id == lastExperience.OriginalExperienceId).FirstOrDefaultAsync();
                if(originalExperience != null)
                {
                    Experience[]? experiences1 = await _context.Experiences.Where(e => e.IsOld == true && e.OriginalExperienceId == originalExperience.Id).ToArrayAsync();
                    experiences.AddRange(experiences1);
                    experiences.Add(originalExperience);
                }
            }
            
            return experiences.OrderByDescending(e => e.Timestamp).ToArray();
        }

        public async Task<string?> SetExperienceToAccount(Account account, TransportModels.SetExperience[] setExperiences)
        {
            List<Experience> experiencesUpdate = new List<Experience>();
            List<Experience> experiencesAdd = new List<Experience>();
            string? error = null;

            foreach (TransportModels.SetExperience setExperience in setExperiences)
            {
                // A) Nová zkušenost
                if (setExperience.Id == 0)
                {
                    Experience experience = new Experience()
                    {
                        Account = account,
                        Content = setExperience.Content,
                        Percentage = setExperience.Percentage,
                        IsOld = false,
                        OriginalExperienceId = null,
                        Timestamp = DateTime.Now.ToUniversalTime()
                    };
                    experiencesAdd.Add(experience);
                }
                else
                {
                    // B) Existující zkušenost
                    Experience? oldExperience = await _context.Experiences
                        .Where(e => e.Account == account && e.Id == setExperience.Id && e.IsOld == false)
                        .FirstOrDefaultAsync();

                    if (oldExperience == null)
                    {
                        error = "Zkušenost s id " + setExperience.Id + " neexistuje";
                        break;
                    }
                    else
                    {
                        if (oldExperience.Content == setExperience.Content &&
                            oldExperience.Percentage == setExperience.Percentage)
                        {
                            continue;
                        }

                        oldExperience.IsOld = true;
                        experiencesUpdate.Add(oldExperience);

                        int? originalExperienceId = oldExperience.OriginalExperienceId;
                        if (originalExperienceId == null)
                        {
                            originalExperienceId = oldExperience.Id;
                        }

                        // Vytvoří updatovanou kopii
                        Experience experience = new Experience()
                        {
                            Account = account,
                            Content = setExperience.Content,
                            Percentage = setExperience.Percentage,
                            IsOld = false,
                            OriginalExperienceId = originalExperienceId,
                            Timestamp = DateTime.Now.ToUniversalTime()
                        };
                        experiencesAdd.Add(experience);
                    }
                }
                if (error != null)
                {
                    return error;
                }
            }

            try
            {
                _context.Experiences.UpdateRange(experiencesUpdate);
                _context.Experiences.AddRange(experiencesAdd);
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }
    }
}
