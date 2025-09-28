namespace Bemplo.Server.Models
{
    public class PrivacyPolicy
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PolicyText { get; set; } = string.Empty;
        public DateTime EffectiveDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
