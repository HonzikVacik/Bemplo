namespace Bemplo.Server.RequestModels
{
    public class PhotoGalleryRequest
    {
        public string[] PhotoUrls { get; set; }
        public List<IFormFile>? NewFiles { get; set; }
    }
}
