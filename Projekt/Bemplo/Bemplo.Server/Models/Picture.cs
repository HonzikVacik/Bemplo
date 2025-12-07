namespace Bemplo.Server.Models
{
    public class Picture
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public string FileName { get; set; } = string.Empty;
        public byte[] ImageData { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public long Size { get; set; }
        public bool IsDeleted { get; set; }
    }
}
