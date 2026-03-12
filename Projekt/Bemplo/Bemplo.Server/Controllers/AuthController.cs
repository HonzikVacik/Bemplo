using Bemplo.Server.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bemplo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public AuthController(ApplicationDbContext context, JwtSettings jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings;
        }

        [HttpPost("token")]
        public async Task<IActionResult> GenerateToken(string email, string password)
        {
            //Kontrola, jestli není řetězec prázdný
            if (string.IsNullOrEmpty(email))
                return Unauthorized("Neplatný email.");
            if (string.IsNullOrEmpty(password))
                return Unauthorized("Neplatné uživatelské heslo.");


            //Kontrola databáze

            //Kontrola existence user
            Account[] accounts = await _context.Accounts.Where(e => e.Email == ValidityControl.GetEmailAddress(email)).ToArrayAsync();
            if (accounts.Length == 0)
                return Unauthorized("Neplatný email nebo uživatelské heslo.");

            //Kontrola správného hesla
            var account = accounts[0];
            byte[] salt = account.Salt;
            string hashedNow = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password!,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8));

            if (hashedNow != account.Password)
                return Unauthorized("Neplatný email nebo uživatelské heslo.");

            //Vrácení tokenu

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, "testuser"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, account.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(_jwtSettings.ExpiryMinutes),
                signingCredentials: creds
            );

            return Ok(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}
