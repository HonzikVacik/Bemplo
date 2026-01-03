using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.RequestModels;
using Bemplo.Server.TransportModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.Net;

namespace Bemplo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IProfileSer _profileSer;
        private readonly IAccountSer _accountSer;
        private readonly IOffer_Preference_RequestSer _offer_Preference_RequestSer;
        private readonly IContactSer _contactSer;
        private readonly IPhotoSer _photoSer;
        private readonly IExperienceRep _experienceRep;

        public ProfileController(ApplicationDbContext context, IProfileSer profileSer, IAccountSer accountSer, IOffer_Preference_RequestSer offer_Preference_RequestSer, IContactSer contactSer, IPhotoSer photoSer, IExperienceRep experienceRep)
        {
            _context = context;
            _profileSer = profileSer;
            _accountSer = accountSer;
            _offer_Preference_RequestSer = offer_Preference_RequestSer;
            _contactSer = contactSer;
            _photoSer = photoSer;
            _experienceRep = experienceRep;
        }

        [HttpGet]
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
        public async Task<IActionResult> SetDescription([FromBody] DescriptionRequest request)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Nastavení popisu
            string? result = await _accountSer.SetDescription(account, request.Description);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }

        [HttpPut("Offer")]
        [Authorize]
        public async Task<IActionResult> SetOffer([FromBody] OfferRequest request)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Nastavení nabídky
            string? result = await _offer_Preference_RequestSer.SetOffer(account, request.Offer);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }

        [HttpPut("Experience")]
        [Authorize]
        public async Task<IActionResult> SetExperience(SetExperience[] setExperiences)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Nastavení nabídky
            string? result = await _experienceRep.SetExperienceToAccount(account, setExperiences);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }

        [HttpPut("Preference")]
        [Authorize]
        public async Task<IActionResult> SetPreference([FromBody] PreferenceRequest request)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Nastavení preferencí
            string? result = await _offer_Preference_RequestSer.SetPreference(account, request.Preference);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }

        [HttpPut("Request")]
        [Authorize]
        public async Task<IActionResult> SetRequest([FromBody] RequestRequest request)
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            //Nastavení požadavků
            string? result = await _offer_Preference_RequestSer.SetRequest(account, request.Request);

            if (result != null)
            {
                return Conflict(result);
            }

            return Ok();
        }

        [HttpPut("PhotoGallery")]
        [Authorize]
        public async Task<IActionResult> SetPictures([FromForm] PhotoGalleryRequest request)
        {
            // Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return Unauthorized("Uživatel nenalezen.");
            }

            var finalPhotoCollection = await _photoSer.UpdatePhotos(account, request);

            var resultUrls = finalPhotoCollection
                .OrderBy(p => p.Order)
                .Select(p => $"/api/Profile/Photo/{p.Id}")
                .ToList();

            return Ok(resultUrls);
        }

        [HttpGet("Photo/{id}")]
        [AllowAnonymous] // Obvykle chceme, aby profilovky viděli i ostatní (záleží na vás)
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _context.Pictures.FindAsync(id);

            if (photo == null)
            {
                return NotFound();
            }

            // Vrátí soubor přímo z paměti
            return File(photo.ImageData, photo.ContentType);
        }
    }
}
