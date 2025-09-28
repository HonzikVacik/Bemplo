namespace Bemplo.Server.Models
{
    public class Account
    {
        public int Id { get; set; }
        public Enums.AccountType AccountType { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public Enums.SexType SexType { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Created_At { get; set; }
        public byte[] Salt { get; set; }
    }
}
