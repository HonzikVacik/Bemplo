using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.RequestModels;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace Bemplo.Server.Services
{
    public class PhotoSer : IPhotoSer
    {
        private readonly ApplicationDbContext _context;

        public PhotoSer(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Picture>> UpdatePhotos(Account account, PhotoGalleryRequest request)
        {
            var finalPhotoCollection = new List<Picture>();
            int fileIndex = 0;

            if (request.PhotoUrls != null)
            {
                for (int i = 0; i < request.PhotoUrls.Length; i++)
                {
                    string urlItem = request.PhotoUrls[i];

                    // A) NOVÁ FOTKA (blob)
                    if (urlItem.StartsWith("blob:") && request.NewFiles != null && fileIndex < request.NewFiles.Count)
                    {
                        var file = request.NewFiles[fileIndex];
                        using (var memoryStream = new MemoryStream())
                        {
                            await file.CopyToAsync(memoryStream);
                            finalPhotoCollection.Add(new Picture
                            {
                                ImageData = memoryStream.ToArray(),
                                ContentType = file.ContentType,
                                Order = i,
                                Account = account
                                // Id je 0
                            });
                        }
                        fileIndex++;
                    }
                    // B) EXISTUJÍCÍ FOTKA (URL z API)
                    else
                    {
                        var segments = urlItem.Split('/');
                        if (int.TryParse(segments.Last(), out int photoId))
                        {
                            // Ověří, že fotka patří uživateli
                            var existingPhoto = await _context.Pictures
                                .FirstOrDefaultAsync(p => p.Id == photoId && p.Account.Id == account.Id);

                            if (existingPhoto != null)
                            {
                                existingPhoto.Order = i;
                                finalPhotoCollection.Add(existingPhoto);
                            }
                        }
                    }
                }
            }

            // a) Načte všechny aktuální fotky tohoto uživatele
            var allUserPhotos = await _context.Pictures
                .Where(p => p.Account.Id == account.Id)
                .ToListAsync();

            // b) Získá seznam id, která potřebuji zachovat (ignoruje nová Id=0)
            var idsToKeep = finalPhotoCollection
                .Select(p => p.Id)
                .Where(id => id != 0)
                .ToList();

            // c) Smaže ty, co nejsou v seznamu k zachování
            var photosToDelete = allUserPhotos
                .Where(p => !idsToKeep.Contains(p.Id))
                .ToList();

            foreach(Picture photoToDelete in photosToDelete)
            {
                photoToDelete.IsDeleted = true;
            }

            _context.Pictures.UpdateRange(photosToDelete);

            // přidá nové fotky
            foreach (var photo in finalPhotoCollection.Where(p => p.Id == 0))
            {
                _context.Pictures.Add(photo);
            }

            await _context.SaveChangesAsync();

            return finalPhotoCollection;
        }
    }
}
