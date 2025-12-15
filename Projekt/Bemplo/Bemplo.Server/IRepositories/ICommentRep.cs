using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.IRepositories
{
    public interface ICommentRep
    {
        public Task<string?> PostComment(Account account, Models.Experience experience, string Comment, byte StarCount);
        public Task<Comment[]> GetCommentsByExperience(Models.Experience[] experience);
    }
}
