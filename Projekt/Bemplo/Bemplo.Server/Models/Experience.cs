namespace Bemplo.Server.Models
{
    public class Experience
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public string Content { get; set; } = string.Empty;
        public byte Percentage { get; set; }
    }
}
