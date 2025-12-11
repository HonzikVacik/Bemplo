using Bemplo.Server.IServices;
using Bemplo.Server.Models;
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
        private readonly IOffer_Preference_RequestSer _offer_Preference_RequestSer;

        public ProfileController(ApplicationDbContext context, IProfileSer profileSer, IAccountSer accountSer, IOffer_Preference_RequestSer offer_Preference_RequestSer)
        {
            _context = context;
            _profileSer = profileSer;
            _accountSer = accountSer;
            _offer_Preference_RequestSer = offer_Preference_RequestSer;
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

            //Nastavení popisu
            string? result = await _accountSer.SetDescription(account, description);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }

        [HttpPut("Offer")]
        [Authorize]
        public async Task<IActionResult> SetOffer(string value)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Nastavení nabídky
            string? result = await _offer_Preference_RequestSer.SetOffer(account, value);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }

        public async Task<IActionResult> SetAddress(string country, string region, string city, string address)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Nastavení adresy
            string? result = await _accountSer.SetAddress(account, country, region, city, address);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }
    }
}
