using Bemplo.Server.Models;
using Bemplo.Server.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IChatSer _chatSer;

        public ChatController(ApplicationDbContext context, IChatSer chatSer)
        {
            _context = context;
            _chatSer = chatSer;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetList()
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            //Načtení seznamu
            (ChatList[]? chatlists, string? error) result = await _chatSer.GetChatList(account);

            //Kontrola chyb
            if (result.error != null)
            {
                return Conflict(result.error);
            }
            else if (result.chatlists == null)
            {
                return Conflict("Něco se nepovedlo");
            }
            else
            {
                return Ok(result.chatlists);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SendMessage(int ContactId, string Message)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            string? error = await _chatSer.SendMessage(account, ContactId, Message);

            if (error != null)
            {
                return Conflict(error);
            }

            return Ok();
        }
    }
}
