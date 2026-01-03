using Bemplo.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Bemplo.Server.IRepositories
{
    public interface IPhotoRep
    {
        public Task<List<Picture>?> GetPhoto(int accountId);
        public Task<string[]> SetPhoto(int accountId);
    }
}
