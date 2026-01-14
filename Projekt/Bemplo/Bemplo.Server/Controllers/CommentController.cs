using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.RequestModels;
using Bemplo.Server.ResponseModels;
using Bemplo.Server.Services;
using Bemplo.Server.TransportModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ICommentSer _commentSer;

        public CommentController(ApplicationDbContext context, ICommentSer commentSer)
        {
            _context = context;
            _commentSer = commentSer;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostComment([FromBody] CommentRequest commentRequest)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            string? error = await _commentSer.PostComment(account, commentRequest.ExperienceId, commentRequest.Comment, commentRequest.StarCount);
            
            if (error != null)
            {
                return Conflict(error);
            }

            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetComments(int UserId, int ExperienceId)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            (Comments? comments, string? error) item = await _commentSer.GetCommentsByExperience(UserId, ExperienceId);

            if (item.error != null)
            {
                return Conflict(item.error);
            }

            return Ok(item.comments);
        }
    }
}
