using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Bemplo.Server.RequestModels;
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
        private readonly IAccountRep _accountRep;

        public AccountController(ApplicationDbContext context, IAccountRep accountRep)
        {
            _context = context;
            _accountRep = accountRep;
        }

        [HttpGet("IsLoggedIn")]
        [Authorize]
        public async Task<IActionResult> IsLoggedIn()
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] AccountRequest accountRequest)
        {
            Account accountTemp = new Account();
            try
            {
                string? error = await ValidityControl.CheckNewAccount(_context, accountRequest.accountType, accountRequest.name, accountRequest.surname, accountRequest.sexType, accountRequest.date, accountRequest.email, accountRequest.password, accountRequest.country, accountRequest.region, accountRequest.city, accountRequest.address, accountRequest.description, accountRequest.agreeWithPrivacyPolicy);
                if (error != null)
                    return BadRequest(error);

                byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
                string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                    password: accountRequest.password!,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA256,
                    iterationCount: 100000,
                    numBytesRequested: 256 / 8));

                accountTemp = new Account()
                {
                    AccountType = (Enums.AccountType)accountRequest.accountType,
                    Name = accountRequest.name,
                    Surname = accountRequest.surname,
                    SexType = (Enums.SexType)accountRequest.sexType,
                    Email = ValidityControl.GetEmailAddress(accountRequest.email),
                    Password = hashedPassword,
                    Country = accountRequest.country,
                    Region = accountRequest.region,
                    City = accountRequest.city,
                    Address = accountRequest.address,
                    Description = accountRequest.description,
                    Created_At = DateTime.Now.ToUniversalTime(),
                    Salt = salt
                };

                _context.Accounts.Add(accountTemp);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return Conflict("Někde nastala chyba");
            }

            Account? registerAccount = await _context.Accounts.Where(a => a.Email == accountTemp.Email).FirstOrDefaultAsync();
            if (registerAccount == null)
                return Conflict("Někde nastala chyba.");

            if (registerAccount.AccountType == Enums.AccountType.User)
            {
                try
                {
                    User userTemp = new User()
                    {
                        Account = registerAccount,
                        Date_of_Birth = accountRequest.date.Date.ToUniversalTime()
                    };
                    _context.Users.Add(userTemp);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Conflict("Někde nastala chyba");
                }
            }
            else if (registerAccount.AccountType == Enums.AccountType.Company)
            {
                try
                {
                    Company companyTemp = new Company()
                    {
                        Account = registerAccount,
                        Founded_At = accountRequest.date.Date.ToUniversalTime()
                    };
                    _context.Companies.Add(companyTemp);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Conflict("Někde nastala chyba");
                }
            }
            else
            {
                return Conflict("Někde nastala chyba.");
            }

            try
            {
                Offer_Preference_Request newOffer = new Offer_Preference_Request()
                {
                    Account = registerAccount,
                    Content = "",
                    ExperienceType = Enums.ExperienceType.Offer,
                    IsDeleted = false
                };
                _context.Offer_Preference_Requests.Add(newOffer);

                if(registerAccount.AccountType == Enums.AccountType.User)
                {
                    Offer_Preference_Request newPreference = new Offer_Preference_Request()
                    {
                        Account = registerAccount,
                        Content = "",
                        ExperienceType = Enums.ExperienceType.Preference,
                        IsDeleted = false
                    };
                    _context.Offer_Preference_Requests.Add(newPreference);

                    Offer_Preference_Request newRequest = new Offer_Preference_Request()
                    {
                        Account = registerAccount,
                        Content = "",
                        ExperienceType = Enums.ExperienceType.Request,
                        IsDeleted = false
                    };
                    _context.Offer_Preference_Requests.Add(newRequest);
                }

                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                return Conflict("Někde nastala chyba.");
            }

            return Ok("Účet byl úspěšně vytvořen");
        }

        [HttpGet("GetAccountType")]
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

        [HttpGet("SearchAccounts")]
        public async Task<IActionResult> SearchAccounts([FromQuery] string searchString, string? name, string? address, int skip, int take)
        {
            Account? account = await User.GetAccountAsync(_context);

            return Ok(await _accountRep.SearchAccounts(searchString.Trim().ToLower(), account, name, address, skip, take));
        }

        [HttpGet("DiscoverAccounts")]
        public async Task<IActionResult> DiscoverAccounts(int skip, int take)
        {
            Account? account = await User.GetAccountAsync(_context);

            return Ok(await _accountRep.DiscoverAccounts(skip, take));
        }

        /*[HttpGet("Nastav")]
        //[Authorize]
        public async Task<IActionResult> Nastav()
        {
            Account a = await _context.Accounts.FindAsync(7);
            Account b = await _context.Accounts.FindAsync(0);

            ChatConnection ch = new ChatConnection()
            {
                Account_1 = a,
                Account_2 = b,
                Account_1_Agree = true,
                Account_2_Agree = true,
                Account_ID_1 = a.Id,
                Account_ID_2 = b.Id
            };
            _context.ChatConnections.Add(ch);
            await _context.SaveChangesAsync();

            return Ok("Hotovo");
        }*/



        // Pouze pro plnění ukázkovými databáze daty

        [HttpPost("InsertDatabase")]
        public async Task<IActionResult> RegisterMultiple([FromBody] IEnumerable<AccountRequest> accountRequests)
        {
            if (accountRequests == null || !accountRequests.Any())
                return BadRequest("Seznam účtů nesmí být prázdný.");

            // Použijeme transakci, aby se buď uložilo všechno, nebo nic
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var request in accountRequests)
                {
                    // 1. Validace
                    string? error = await ValidityControl.CheckNewAccount(
                        _context, request.accountType, request.name, request.surname, request.sexType,
                        request.date, request.email, request.password, request.country, request.region,
                        request.city, request.address, request.description, request.agreeWithPrivacyPolicy);

                    if (error != null)
                        return BadRequest($"Chyba u emailu {request.email}: {error}");

                    // 2. Hashování hesla
                    byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
                    string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                        password: request.password!,
                        salt: salt,
                        prf: KeyDerivationPrf.HMACSHA256,
                        iterationCount: 100000,
                        numBytesRequested: 256 / 8));

                    // 3. Vytvoření Account entity
                    var newAccount = new Account()
                    {
                        AccountType = (Enums.AccountType)request.accountType,
                        Name = request.name,
                        Surname = request.surname,
                        SexType = (Enums.SexType)request.sexType,
                        Email = ValidityControl.GetEmailAddress(request.email),
                        Password = hashedPassword,
                        Country = request.country,
                        Region = request.region,
                        City = request.city,
                        Address = request.address,
                        Description = request.description,
                        Created_At = DateTime.UtcNow,
                        Salt = salt
                    };

                    _context.Accounts.Add(newAccount);
                    // Musíme uložit teď, abychom získali ID pro navázané entity (User/Company)
                    await _context.SaveChangesAsync();

                    // 4. Vytvoření specifické entity (User / Company)
                    if (newAccount.AccountType == Enums.AccountType.User)
                    {
                        _context.Users.Add(new User { Account = newAccount, Date_of_Birth = request.date.Date.ToUniversalTime() });
                    }
                    else if (newAccount.AccountType == Enums.AccountType.Company)
                    {
                        _context.Companies.Add(new Company { Account = newAccount, Founded_At = request.date.Date.ToUniversalTime() });
                    }
                    else
                    {
                        throw new Exception("Neznámý typ účtu.");
                    }

                    // 5. Offer / Preference / Request
                    _context.Offer_Preference_Requests.Add(new Offer_Preference_Request
                    {
                        Account = newAccount,
                        Content = "",
                        ExperienceType = Enums.ExperienceType.Offer,
                        IsDeleted = false
                    });

                    if (newAccount.AccountType == Enums.AccountType.User)
                    {
                        _context.Offer_Preference_Requests.Add(new Offer_Preference_Request { Account = newAccount, Content = "", ExperienceType = Enums.ExperienceType.Preference, IsDeleted = false });
                        _context.Offer_Preference_Requests.Add(new Offer_Preference_Request { Account = newAccount, Content = "", ExperienceType = Enums.ExperienceType.Request, IsDeleted = false });
                    }

                    await _context.SaveChangesAsync();
                }

                // Pokud vše proběhlo v pořádku, potvrdíme transakci
                await transaction.CommitAsync();
                return Ok("Všechny účty byly úspěšně vytvořeny.");
            }
            catch (Exception ex)
            {
                // V případě jakékoliv chyby se změny vrátí zpět (Rollback)
                await transaction.RollbackAsync();
                return Conflict("Při hromadné registraci nastala chyba. Žádná data nebyla uložena.");
            }
        }
    }
}
