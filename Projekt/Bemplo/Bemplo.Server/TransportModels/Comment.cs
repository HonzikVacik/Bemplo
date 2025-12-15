using Bemplo.Server.Models;

namespace Bemplo.Server.TransportModels
{
    public class Comment
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public byte Percentage { get; set; }
        public string Content { get; set; }
        public string EvaluatorName { get; set; }
    }
}
