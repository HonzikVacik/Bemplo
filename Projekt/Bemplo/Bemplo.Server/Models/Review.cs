namespace Bemplo.Server.Models
{
    public class Review
    {
        public int Id { get; set; }
        public Experience Experience { get; set; }
        public DateTime Timestamp { get; set; }
        public byte Percentage { get; set; }
        public string Content { get; set; } = string.Empty;
        public Account Evaluator_Account { get; set; }
    }
}
