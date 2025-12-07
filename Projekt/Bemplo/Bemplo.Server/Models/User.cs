namespace Bemplo.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public DateTime Date_of_Birth { get; set; }
        public bool IsDeleted { get; set; }

    }
}
