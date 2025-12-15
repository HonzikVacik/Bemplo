using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Models;

namespace Bemplo.Server.Services
{
    public class CommentSer : ICommentSer
    {
        private readonly ICommentRep _commentRep;
        private readonly IExperienceRep _experienceRep;

        public CommentSer(ICommentRep commentRep, IExperienceRep experienceRep)
        {
            _commentRep = commentRep;
            _experienceRep = experienceRep;
        }
        public async Task<string?> PostComment(Account account, int ExperienceId, string Comment, byte StarCount)
        {
            Experience? experience = await _experienceRep.GetExperienceById(ExperienceId);
            if (experience == null)
            {
                return "Zkušenost s id " + ExperienceId + " neexistuje";
            }

            string? commentError = ValidityControl.IsCommentValid(Comment);
            if (commentError != null)
            {
                return commentError;
            }

            string? starCountError = ValidityControl.IsStarCountValid(StarCount);
            if (starCountError != null)
            {
                return starCountError;
            }

            return await _commentRep.PostComment(account, experience, Comment, StarCount);
        }
    }
}
