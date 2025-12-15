using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;

namespace Bemplo.Server.Repositories
{
    public class CommentRep : ICommentRep
    {
        private readonly ApplicationDbContext _context;

        public CommentRep(ApplicationDbContext context)
        {
            _context = context;
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
