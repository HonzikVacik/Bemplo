using Bemplo.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Bemplo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Register(byte accountType, string name, string surname, byte sexType, DateTime date, string email, string password, string country, string region, string city, string address, string description, bool agreeWithPrivacyPolicy)
        {
            string? error = ValidityControl.CheckNewAccount(_context, accountType, name, surname, sexType, date, email, password, country, region, city, address, description, agreeWithPrivacyPolicy);
            if (error != null)
                return BadRequest(error);

            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            Account accountTemp = new Account()
            {
                AccountType = (Enums.AccountType)accountType,
                Name = name,
                Surname = surname,
                SexType = (Enums.SexType)sexType,
                Email = email,
                Password = hashedPassword,
                Country = country,
                Region = region,
                City = city,
                Address = address,
                Description = description,
                Created_At = DateTime.Now.ToUniversalTime(),
                Salt = salt
            };

            _context.Accounts.Add(accountTemp);
            await _context.SaveChangesAsync();

            Account? registerAccount = await _context.Accounts.Where(a => a.Email == accountTemp.Email).FirstOrDefaultAsync();
            if (registerAccount == null)
                return Conflict("Někde nastala chyba.");

            if (registerAccount.AccountType == Enums.AccountType.User)
            {
                User userTemp = new User()
                {
                    Account = registerAccount,
                    Date_of_Birth = date.Date.ToUniversalTime()
                };
                _context.Users.Add(userTemp);
                await _context.SaveChangesAsync();
            }
            else if (registerAccount.AccountType == Enums.AccountType.Company)
            {
                Company companyTemp = new Company()
                {
                    Account = registerAccount,
                    Founded_At = date.Date.ToUniversalTime()
                };
                _context.Companies.Add(companyTemp);
                await _context.SaveChangesAsync();
            }
            else
            {
                return Conflict("Někde nastala chyba.");
            }

            return Ok("Účet byl úspěšně vytvořen");
        }

        [HttpPost("GetAccountType")]
        [Authorize]
        public async Task<IActionResult> IsCommonAccount()
        {
            //Načtení uživatele
            Account? account = await User.GetAccountAsync(_context);

            if (account == null)
            {
                return NotFound("Uživatel nenalezen.");
            }

            return Ok(account.AccountType == Enums.AccountType.User);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllAccounts()
        {
            var accounts = await _context.Accounts.ToListAsync();
            return Ok(accounts);
        }
    }
}
