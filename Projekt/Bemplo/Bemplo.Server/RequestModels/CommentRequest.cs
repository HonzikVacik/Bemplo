namespace Bemplo.Server.RequestModels
{
    public class CommentRequest
    {
        public int ExperienceId { get; set; }
        public string Comment { get; set; } = string.Empty;
        public byte StarCount { get; set; }
    }
}
