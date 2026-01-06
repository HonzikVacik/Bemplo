using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class ChatConnectionRep : IChatConnectionRep
    {
        private readonly ApplicationDbContext _context;

        public ChatConnectionRep(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<(ChatConnection?, string?)> GetChatConnection(int AccId1, int AccId2)
        {
            try
            {
                ChatConnection? chatConnection = await _context.ChatConnections.Where(chc => ((chc.Account_ID_1 == AccId1 && chc.Account_ID_2 == AccId2) || (chc.Account_ID_1 == AccId2 && chc.Account_ID_2 == AccId1)) && chc.Account_1_Agree == true && chc.Account_2_Agree == true).FirstOrDefaultAsync();
                if (chatConnection == null)
                {
                    return (null, "Kontakt neexistuje nebo je zablokovaný");
                }
                else
                {
                    return (chatConnection, null);
                }
            }
            catch (Exception ex)
            {
                return (null, "Něco se nepovedlo");
            }
        }
    }
}
