using Bemplo.Server.Models;
using Bemplo.Server.ResponseModels;

namespace Bemplo.Server.IServices
{
    public interface ICommentSer
    {
        public Task<string?> PostComment(Account account, int ExperienceId, string Comment, byte StarCount);
        public Task<(Comments?, string?)> GetCommentsByExperience(int experienceId);
    }
}
