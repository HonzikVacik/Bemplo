namespace Bemplo.Server.Models
{
    public class KeyWord
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public string Word { get; set; } = string.Empty;
    }
}
