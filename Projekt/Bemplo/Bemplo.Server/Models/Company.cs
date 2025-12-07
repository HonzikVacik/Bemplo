namespace Bemplo.Server.Models
{
    public class Company
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public DateTime Founded_At { get; set; }
        public bool IsDeleted { get; set; }
    }
}
