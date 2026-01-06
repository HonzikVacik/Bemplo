using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.ResponseModels;
using Bemplo.Server.Services;
using Bemplo.Server.TransportModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Controllers
{
    public class CommentController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ICommentSer _commentSer;

        public CommentController(ICommentSer commentSer, ApplicationDbContext context)
        {
            _commentSer = commentSer;
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostComment(int ExperienceId, string Comment, byte StarCount)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            string? error = await _commentSer.PostComment(account, ExperienceId, Comment, StarCount);
            
            if (error != null)
            {
                return Conflict(error);
            }

            return Ok();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GetComments(int ExperienceId)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            (Comments? comments, string? error) item = await _commentSer.GetCommentsByExperience(ExperienceId);

            if (item.error != null)
            {
                return Conflict(item.error);
            }

            return Ok(item.comments);
        }
    }
}
