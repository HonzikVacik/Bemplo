namespace Bemplo.Server.RequestModels
{
    public class AccountRequest
    {
        public byte accountType { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public byte sexType { get; set; }
        public DateTime date { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string country { get; set; }
        public string region { get; set; }
        public string city { get; set; }
        public string address { get; set; }
        public string description { get; set; }
        public bool agreeWithPrivacyPolicy { get; set; }
    }
}
