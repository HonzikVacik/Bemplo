namespace Bemplo.Server.ResponseModels
{
    public class PrivacyPolicy
    {
        public DateTime CreatedAt { get; set; }
        public string PolicyText { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
