namespace Bemplo.Server.Models
{
    public class Enums
    {
        public enum AccountType
        {
            [RoleCesky("Uživatel")] User,
            [RoleCesky("Společnost")] Company
        }

        public enum SexType
        {
            [RoleCesky("Muž")] Man,
            [RoleCesky("Žena")] Woman,
            [RoleCesky("Jiné")] Other
        }

        public enum ExperienceType
        {
            [RoleCesky("Nabídka")] Offer,
            [RoleCesky("Preference")] Preference,
            [RoleCesky("Požadavek")] Request
        }
    }
}
