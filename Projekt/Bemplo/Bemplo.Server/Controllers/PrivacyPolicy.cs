using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bemplo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrivacyPolicy : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IPrivacyPolicyRep _privacyPolicyRep;

        public PrivacyPolicy(ApplicationDbContext context, IPrivacyPolicyRep privacyPolicyRep)
        {
            _context = context;
            _privacyPolicyRep = privacyPolicyRep;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPrivacyPolicy()
        {
            ResponseModels.PrivacyPolicy? privacyPolicy = await _privacyPolicyRep.GetPrivacyPolicy();
            if (privacyPolicy == null)
            {
                return NotFound("Něco se nepovedlo");
            }
            else
                return Ok(privacyPolicy);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AgreeWithPrivacyPolicy()
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            string? error = await _privacyPolicyRep.AgreeWithPrivacyPolicy(account);
            if (error != null)
            {
                return Conflict(error);
            }

            return Ok();
        }
    }
}
