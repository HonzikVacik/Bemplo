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
        private readonly IAccountRep _accountRep;

        public CommentSer(ICommentRep commentRep, IExperienceRep experienceRep, IAccountRep accountRep)
        {
            _commentRep = commentRep;
            _experienceRep = experienceRep;
            _accountRep = accountRep;
        }

        public async Task<(Comments?, string?)> GetCommentsByExperience(int userId, int experienceId)
        {
            Models.Experience[] experiences = await _experienceRep.GetExperiencesById(experienceId);
            if (experiences.Length == 0)
            {
                return (null, "Něco se nepovedlo");
            }
            TransportModels.Comment[] comments = await _commentRep.GetCommentsByExperience(experiences);

            ExperienceToComment[] experienceToComment = experiences.Select(e => new ExperienceToComment { Content = e.Content, Percentage = e.Percentage, Timestamp = e.Timestamp }).ToArray();

            Comments result = new Comments() { comments = comments, experiences = experienceToComment};

            Account? acc = await _accountRep.GetAccountById(userId);

            if(acc == null)
            {
                return (null, "Uživatel neexistuje");
            }

            result.userName = acc.Name + " " + acc.Surname;

            return (result, null);
        }

        public async Task<string?> PostComment(Account account, int ExperienceId, string Comment, byte StarCount)
        {
            Models.Experience? experience = await _experienceRep.GetExperienceById(ExperienceId);
            if (experience == null)
            {
                return "Zkušenost s id " + ExperienceId + " neexistuje";
            }
            
            if (experience.Account == account)
            {
                return "Nemůžete vytvořit komentář sám sobě.";
            }

            if(experience.OriginalExperienceId != null)
            {
                experience = await _experienceRep.GetExperienceById((int)experience.OriginalExperienceId);
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
