namespace Bemplo.Server.Models
{
    public class Offer_Preference_Request
    {
        public int Id { get; set; }
        public Enums.ExperienceType ExperienceType { get; set; }
        public Account Account { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
