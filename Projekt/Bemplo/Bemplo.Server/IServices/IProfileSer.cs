using Bemplo.Server.Models;
using Bemplo.Server.ResponseModels;
using Microsoft.VisualBasic;

namespace Bemplo.Server.IServices
{
    public interface IProfileSer
    {
        public Task<object> GetProfile(Account Account);
        public Task<object?> GetProfileById(int Id);
    }
}
