using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.ResponseModels;
using Bemplo.Server.TransportModels;

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

        public async Task<(Comments?, string?)> GetCommentsByExperience(int experienceId)
        {
            Models.Experience[] experiences = await _experienceRep.GetExperiencesById(experienceId);
            if (experiences.Length == 0)
            {
                return (null, "Něco se nepovedlo");
            }
            TransportModels.Comment[] comments = await _commentRep.GetCommentsByExperience(experiences);

            ExperienceToComment[] experienceToComment = experiences.Select(e => new ExperienceToComment { Content = e.Content, Percentage = e.Percentage, Timestamp = e.Timestamp }).ToArray();

            Comments result = new Comments() { comments = comments, experiences = experienceToComment};
            return (result, null);
        }

        public async Task<string?> PostComment(Account account, int ExperienceId, string Comment, byte StarCount)
        {
            Models.Experience? experience = await _experienceRep.GetExperienceById(ExperienceId);
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
