using Bemplo.Server.Models;
using System.Diagnostics.Metrics;
using System.Text.RegularExpressions;
using static Bemplo.Server.Models.Enums;

namespace Bemplo.Server
{
    public static class ValidityControl
    {
        public static string? CheckNewAccount(ApplicationDbContext _context, byte accountType, string name, string surname, byte sexType, DateTime date, string email, string password, string country, string region, string city, string address, string description, bool agreeWithPrivacyPolicy)
        {
            if (!IsValidEmail(email))
                return "Neplatné údaje o účtu";
            if (!IsEmailUnique(_context, email))
                  return "Účet s tímto emailem již existuje.";
            if (!IsValidAccountType(accountType))
                return "Neplatný typ účtu";
            else if (!IsValidName(name, accountType))
                return "Neplatné jméno";
            else if (!IsValidSurname(surname, accountType))
                return "Neplatné příjmení";
            else if (!IsValidSexType(sexType))
                return "Neplatný SexType";
            else if (!IsValidDate(date))
                return "Neplatný datum";
            else if (!IsValidPassword(password))
                return "Neplatné heslo";
            else if (!IsValidLocation(accountType, country, region, city, address))
                return "Neplatná adresa";
            else if (!IsValidDescription(description))
                return "Neplatný popis";
            else if (!IsValidPrivacyPolicyAgreement(agreeWithPrivacyPolicy))
                return "Neplatné podmínky používání";
            if (IsValidAccountType(accountType) &&
                   IsValidName(name, accountType) &&
                   IsValidSurname(surname, accountType) &&
                   IsValidSexType(sexType) &&
                   IsValidDate(date) &&
                   IsValidPassword(password) &&
                   IsValidLocation(accountType, country, region, city, address) &&
                   IsValidDescription(description) &&
                   IsValidPrivacyPolicyAgreement(agreeWithPrivacyPolicy))
                return null;
            else
                return "Neplatné údaje o účtu.-" + agreeWithPrivacyPolicy + "-";
        }

        private static bool IsValidAccountType(byte accountType)
        {
            return Enum.IsDefined(typeof(Enums.AccountType), (int)accountType);
        }

        private static bool IsValidName(string name, byte accountType)
        {
            return !string.IsNullOrEmpty(name) && !string.IsNullOrWhiteSpace(name) && (name.Length <= 50 || name.Length <= 200 && accountType == ((byte)Enums.AccountType.Company));
        }

        private static bool IsValidSurname(string surname, byte accountType)
        {
            return !string.IsNullOrEmpty(surname) && !string.IsNullOrWhiteSpace(surname) && surname.Length <= 50 || accountType == ((byte)Enums.AccountType.Company);
        }

        private static bool IsValidSexType(byte sexType)
        {
            return Enum.IsDefined(typeof(Enums.SexType), (int)sexType);
        }

        private static bool IsValidDate(DateTime date)
        {
            return date <= DateTime.Now;
        }

        public static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                if (addr.Address == email)
                {
                    string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
                    if (Regex.IsMatch(email, pattern))
                        return true;
                    else
                        return false;
                }
                else return false;
            }
            catch
            {
                return false;
            }
        }

        private static bool IsValidPassword(string password)
        {
            string pattern = @"(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z\d])";
            if (!string.IsNullOrEmpty(password))
            {
                if (Regex.IsMatch(password, pattern) && password.Length >= 8)
                    return true;
            }
            return false;
        }

        public static bool IsValidLocation(byte accountType, string country, string region, string city, string address)
        {
            bool validAddress = false;
            try
            {
                validAddress = (Enums.AccountType)accountType == Enums.AccountType.Company && !string.IsNullOrEmpty(address) || (Enums.AccountType)accountType == Enums.AccountType.User;
            }
            catch
            {
                validAddress = false;
            }
            return !string.IsNullOrEmpty(country) && !string.IsNullOrWhiteSpace(country) && country.Length <= 50 &&
                   !string.IsNullOrEmpty(region) && !string.IsNullOrWhiteSpace(region) && region.Length <= 50 &&
                   !string.IsNullOrEmpty(city) && !string.IsNullOrWhiteSpace(city) && city.Length <= 50 &&
                   !string.IsNullOrEmpty(address) && !string.IsNullOrWhiteSpace(address) && address.Length <= 100;
        }

        public static bool IsValidDescription(string description)
        {
            return (!string.IsNullOrEmpty(description) && description.Length <= 5000);
        }

        private static bool IsValidPrivacyPolicyAgreement(bool agreeWithPrivacyPolicy)
        {
            return agreeWithPrivacyPolicy;
        }

        public static bool IsEmailUnique(ApplicationDbContext _context, string email)
        {
            var existingAccount = _context.Accounts.FirstOrDefault(a => a.Email == email);
            return existingAccount == null;
        }

        public static string? IsChatMessageValid(string message)
        {
            if(string.IsNullOrEmpty(message) || string.IsNullOrWhiteSpace(message))
            {
                return "Nelze odeslat prázdnou zprávu";
            }
            if(message.Length > 5000)
            {
                return "Zpráva je moc dlouhá (maximálně 5000 znaků)";
            }
            return null;
        }

        public static string? IsCommentValid(string comment)
        {
            if (string.IsNullOrEmpty(comment) || string.IsNullOrWhiteSpace(comment))
            {
                return "Nelze potvrdit prázdné komentář";
            }
            if (comment.Length > 5000)
            {
                return "Komentář je moc dlouhý (maximálně 5000 znaků)";
            }
            return null;
        }

        public static string? IsStarCountValid(byte starCount)
        {
            if(starCount > 5 || starCount < 1)
            {
                return "Neplatný StarCount";
            }
            return null;
        }
    }
}
