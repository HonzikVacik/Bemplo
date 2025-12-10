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

        public ProfileController(ApplicationDbContext context, IProfileSer profileSer)
        {
            _context = context;
            _profileSer = profileSer;
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

            var result = await _profileSer.GetProfile(account);

            if (result == null)
            {
                return NotFound("Uživatel nenalezen");
            }

            return Ok(result);
        }
    }
}
