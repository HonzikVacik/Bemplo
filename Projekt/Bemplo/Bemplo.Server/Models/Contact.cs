namespace Bemplo.Server.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
