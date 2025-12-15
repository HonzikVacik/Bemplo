using Bemplo.Server.Models;

namespace Bemplo.Server.IRepositories
{
    public interface ICommentRep
    {
        public Task<string?> PostComment(Account account, Experience experience, string Comment, byte StarCount);
    }
}
