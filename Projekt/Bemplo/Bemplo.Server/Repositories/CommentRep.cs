using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class CommentRep : ICommentRep
    {
        private readonly ApplicationDbContext _context;

        public CommentRep(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TransportModels.Comment[]> GetCommentsByExperience(Experience[] experience)
        {
            Review[] reviews = await _context.Rewiews.Include(r => r.Evaluator_Account).Where(r => experience.Contains(r.Experience)).ToArrayAsync();
            return reviews.Select(r => new TransportModels.Comment { Id = r.Id, Content = r.Content, EvaluatorName = r.Evaluator_Account.AccountType == 0 ? r.Evaluator_Account.Name + " " + r.Evaluator_Account.Surname : r.Evaluator_Account.Name, Percentage = r.Percentage, Timestamp = r.Timestamp }).ToArray(); 
        }

        public async Task<string?> PostComment(Account account, Experience experience, string Comment, byte StarCount)
        {
            try
            {
                Review review = new Review()
                {
                    Experience = experience,
                    Content = Comment,
                    Evaluator_Account = account,
                    Percentage = StarCount,
                    Timestamp = DateTime.Now.ToUniversalTime()
                };
                _context.Rewiews.Add(review);
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
