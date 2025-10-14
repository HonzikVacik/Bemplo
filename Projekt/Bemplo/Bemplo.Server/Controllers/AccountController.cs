using Bemplo.Server.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

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
        public IActionResult Register(byte accountType, string name, string surname, byte sexType, DateTime date, string email, string password, string country, string region, string city, string address, string description, bool agreeWithPrivacyPolicy)
        {
            if (!ValidityControl.CheckNewAccount(accountType, name, surname, sexType, date, email, password, country, region, city, address, description, agreeWithPrivacyPolicy))
                return BadRequest("Neplatné údaje o účtu.");

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
                Password = password,
                Country = country,
                Region = region,
                City = city,
                Address = address,
                Description = description,
                Created_At = DateTime.Now.ToUniversalTime(),
                Salt = salt
            };

            _context.Accounts.Add(accountTemp);
            _context.SaveChangesAsync();

            Account registerAccount = _context.Accounts.FirstOrDefault(accountTemp);
            if (registerAccount == null)
                return Conflict("Někde nastala chyba.");

            if (registerAccount.AccountType == Enums.AccountType.User)
            {
                User userTemp = new User()
                {
                    Account = registerAccount,
                    Date_of_Birth = date
                };
                _context.Users.Add(userTemp);
                _context.SaveChangesAsync();
            }
            else if (registerAccount.AccountType == Enums.AccountType.Company)
            {
                Company companyTemp = new Company()
                {
                    Account = registerAccount,
                    Founded_At = date
                };
                _context.Companies.Add(companyTemp);
                _context.SaveChangesAsync();
            }
            else
            {
                return Conflict("Někde nastala chyba.");
            }

            return Ok("Účet byl úspěšně vytvořen");
        }
    }
}
