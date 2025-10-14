using Bemplo.Server.Models;

namespace Bemplo.Server
{
    public static class ValidityControl
    {
        public static bool CheckNewAccount(byte accountType, string name, string surname, byte sexType, DateTime date, string email, string password, string country, string region, string city, string address, string description, bool agreeWithPrivacyPolicy)
        {
            return IsValidAccountType(accountType) &&
                       IsValidName(name) &&
                       IsValidSurname(surname) &&
                       IsValidSexType(sexType) &&
                       IsValidDate(date) &&
                       IsValidEmail(email) &&
                       IsValidPassword(password) &&
                       IsValidLocation(accountType, country, region, city, address) &&
                       IsValidDescription(description) &&
                       IsValidPrivacyPolicyAgreement(agreeWithPrivacyPolicy);
        }

        private static bool IsValidAccountType(byte accountType)
        {
            return Enum.IsDefined(typeof(Enums.AccountType), accountType);
        }

        private static bool IsValidName(string name)
        {
            return !string.IsNullOrEmpty(name) && name.Length <= 50;
        }

        private static bool IsValidSurname(string surname)
        {
            return !string.IsNullOrEmpty(surname) && surname.Length <= 50;
        }

        private static bool IsValidSexType(byte sexType)
        {
            return Enum.IsDefined(typeof(Enums.SexType), sexType);
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
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private static bool IsValidPassword(string password)
        {
            return !string.IsNullOrEmpty(password) && password.Length >= 8;
        }

        private static bool IsValidLocation(byte accountType, string country, string region, string city, string address)
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
            return !string.IsNullOrEmpty(country) && country.Length <= 50 &&
                   !string.IsNullOrEmpty(region) && region.Length <= 50 &&
                   !string.IsNullOrEmpty(city) && city.Length <= 50 &&
                   !string.IsNullOrEmpty(address) && address.Length <= 100;
        }

        private static bool IsValidDescription(string description)
        {
            return description.Length <= 5000;
        }

        private static bool IsValidPrivacyPolicyAgreement(bool agreeWithPrivacyPolicy)
        {
            return agreeWithPrivacyPolicy;
        }
    }
}
