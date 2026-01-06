using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace Bemplo.Server.Repositories
{
    public class PhotoRep : IPhotoRep
    {
        private readonly ApplicationDbContext _context;

        public PhotoRep(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Picture>?> GetPhoto(int accountId)
        {
            var allUserPhotos = await _context.Pictures
                .Where(p => p.Account.Id == accountId && p.IsDeleted == false)
                .ToListAsync();

            return allUserPhotos;
        }

        public async Task<string[]> SetPhoto(int accountId)
        {
            List<Picture>? pictures = await GetPhoto(accountId);
            if (pictures != null)
            {
                return pictures
                    .OrderBy(p => p.Order)
                    .Select(p => $"/api/Profile/Photo/{p.Id}")
                    .ToArray();
            }
            else
            {
                return new string[0];
            }
        }
    }
}
