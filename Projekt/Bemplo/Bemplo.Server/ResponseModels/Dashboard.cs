using Bemplo.Server.TransportModels;

namespace Bemplo.Server.ResponseModels
{
    public abstract class Dashboard
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Offer { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public string Region { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public Contact[] Contacts { get; set; }
        public bool AgreeWithPolicy { get; set; }

        //TODO: Add Pictures
    }
}
