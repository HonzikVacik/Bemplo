using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Drawing;
using System.Reflection.Metadata;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

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

        [HttpGet("GetPdf")]
        public async Task<IActionResult> DownloadPdf()
        {
            ResponseModels.PrivacyPolicy? privacyPolicy = await _privacyPolicyRep.GetPrivacyPolicy();
            if (privacyPolicy == null)
            {
                return NotFound("Něco se nepovedlo");
            }

            string[] policyContent = privacyPolicy.PolicyText.Split("\n"); 

            QuestPDF.Settings.License = LicenseType.Community;

            var pdfData = Microsoft.AspNetCore.Html.HtmlString.Empty;

            byte[] pdfBytes = QuestPDF.Fluent.Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(1, Unit.Centimetre);
                    page.PageColor(Colors.White);

                    page.Header().Text("Zásady ochrany osobních údajů").AlignCenter().FontSize(25).ExtraBold().FontColor(Colors.Blue.Medium);

                    page.Content().PaddingVertical(10).AlignLeft().Column(col =>
                    {
                        foreach(string row in policyContent)
                        {
                            if (Regex.IsMatch(row, @"^\d+\."))
                                col.Item().Text(row).Bold().FontColor(Colors.Blue.Medium);
                            else
                                col.Item().Text(row);
                        }
                        col.Item().Text($"");
                        col.Item().Text(text =>
                        {
                            text.Span("Platné od: ").Bold();
                            text.Span($"{((DateTime) privacyPolicy.EffectiveDate).ToLocalTime():d}"); // :d zformátuje datum krátce
                        });
                        col.Item().Text(text =>
                        {
                            text.Span("Platné do: ").Bold();
                            text.Span($"{((DateTime) privacyPolicy.ExpirationDate).ToLocalTime():d}"); // :d zformátuje datum krátce
                        });
                        col.Item().Text($"");
                        col.Item().Text(text =>
                        {
                            text.Span("Generováno: ").Bold();
                            text.Span($"{DateTime.Now}");
                        });
                    });
                });
            }).GeneratePdf();

            return File(pdfBytes, "application/pdf", "privacy_policy.pdf");
        }
    }
}
