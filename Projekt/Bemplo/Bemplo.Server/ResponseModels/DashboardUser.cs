using Bemplo.Server.TransportModels;

namespace Bemplo.Server.ResponseModels
{
    public class DashboardUser : Dashboard
    {
        public string Preference { get; set; }
        public string Request { get; set; }
        public Experience[] Experiences { get; set; }

        //TODO: Add WorkingRelationship
    }
}
