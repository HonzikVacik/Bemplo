namespace Bemplo.Server.TransportModels
{
    public class Message
    {
        public int Id { get; set; }
        public bool Owned { get; set; }
        public DateTime Timestamp { get; set; }
        public string Content { get; set; }
    }
}
