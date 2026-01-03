using Bemplo.Server.Models;
using Bemplo.Server.RequestModels;

namespace Bemplo.Server.IServices
{
    public interface IPhotoSer
    {
        public Task<List<Picture>> UpdatePhotos(Account account, PhotoGalleryRequest request);
    }
}
