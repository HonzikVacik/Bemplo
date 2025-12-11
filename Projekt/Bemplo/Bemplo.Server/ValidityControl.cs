using Bemplo.Server.Models;
using System.Diagnostics.Metrics;
using System.Text.RegularExpressions;

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
            if (IsValidAccountType(accountType) &&
                       IsValidName(name) &&
                       IsValidSurname(surname) &&
                       IsValidSexType(sexType) &&
                       IsValidDate(date) &&
                       IsValidPassword(password) &&
                       IsValidLocation(accountType, country, region, city, address) &&
                       IsValidDescription(description) &&
                       IsValidPrivacyPolicyAgreement(agreeWithPrivacyPolicy))
                return null;
            else
                return "Neplatné údaje o účtu.";
        }

        private static bool IsValidAccountType(byte accountType)
        {
            return Enum.IsDefined(typeof(Enums.AccountType), (int)accountType);
        }

        private static bool IsValidName(string name)
        {
            return !string.IsNullOrEmpty(name) && !string.IsNullOrWhiteSpace(name) && name.Length <= 50;
        }

        private static bool IsValidSurname(string surname)
        {
            return !string.IsNullOrEmpty(surname) && !string.IsNullOrWhiteSpace(surname) && surname.Length <= 50;
        }

        private static bool IsValidSexType(byte sexType)
        {
            return Enum.IsDefined(typeof(Enums.SexType), (int)sexType);
        }

        private static bool IsValidDate(DateTime date)
        {
            return date <= DateTime.Now;
        }

        private static bool IsValidEmail(string email)
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

        private static bool IsEmailUnique(ApplicationDbContext _context, string email)
        {
            var existingAccount = _context.Accounts.FirstOrDefault(a => a.Email == email);
            return existingAccount == null;
        }
    }
}
