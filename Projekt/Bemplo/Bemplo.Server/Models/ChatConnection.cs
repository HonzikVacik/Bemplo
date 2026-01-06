namespace Bemplo.Server.Models
{
    public class ChatConnection
    {
        public int Account_ID_1 { get; set; }
        public Account Account_1 { get; set; }
        public int Account_ID_2 { get; set; }
        public Account Account_2 { get; set; }
        public bool Account_1_Agree { get; set; }
        public bool Account_2_Agree { get; set; }
    }
}
