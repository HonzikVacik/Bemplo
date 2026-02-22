using Bemplo.Server.TransportModels;

namespace Bemplo.Server.ResponseModels
{
    public class Comments
    {
        public string userName { get; set; }
        public ExperienceToComment[] experiences { get; set; }
        public Comment[] comments { get; set; }
    }
}
