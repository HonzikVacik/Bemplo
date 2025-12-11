using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Controllers
{
    public class ProfileController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IProfileSer _profileSer;
        private readonly IAccountSer _accountSer;

        public ProfileController(ApplicationDbContext context, IProfileSer profileSer, IAccountSer accountSer)
        {
            _context = context;
            _profileSer = profileSer;
            _accountSer = accountSer;
        }

        [HttpGet("GetDashboard")]
        [Authorize]
        public async Task<IActionResult> GetDashboard()
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Načtení profilu
            var result = await _profileSer.GetProfile(account);

            if (result == null)
            {
                return NotFound("Uživatel nenalezen");
            }

            return Ok(result);
        }

        [HttpPut("Description")]
        [Authorize]
        public async Task<IActionResult> SetDescription(string description)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            string? result = await _accountSer.SetDescription(account, description);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }
    }
}
