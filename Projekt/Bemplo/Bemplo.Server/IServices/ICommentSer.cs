using Bemplo.Server.Models;

namespace Bemplo.Server.IServices
{
    public interface ICommentSer
    {
        public Task<string?> PostComment(Account account, int ExperienceId, string Comment, byte StarCount);
    }
}
