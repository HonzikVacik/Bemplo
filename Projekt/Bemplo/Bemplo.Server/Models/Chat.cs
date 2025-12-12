namespace Bemplo.Server.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public ChatConnection Chat_Connection { get; set; }
        public int SenderId { get; set; }
        public DateTime Timestamp { get; set; }
        public string Content { get; set; } = string.Empty;
        public ICollection<ChatConnection> Chat_Connections { get; set; }
    }
}
