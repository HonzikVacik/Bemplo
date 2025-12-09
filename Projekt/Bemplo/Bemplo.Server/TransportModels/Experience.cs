namespace Bemplo.Server.TransportModels
{
    public interface Experience
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public byte Percentage { get; set; }
        public byte ReviewPercentage { get; set; }
    }
}
