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

        public async Task<string?> CreateChatConnection(int AccountId, int ContactId)
        {
            ChatConnection? chatConnection = await _context.ChatConnections.Where(chc => ((chc.Account_ID_1 == AccountId && chc.Account_ID_2 == ContactId) || (chc.Account_ID_1 == ContactId && chc.Account_ID_2 == AccountId))).FirstOrDefaultAsync();
            if (chatConnection == null)
            {
                try
                {
                    Account acc1 = await _context.Accounts.FindAsync(AccountId);
                    Account acc2 = await _context.Accounts.FindAsync(ContactId);

                    if (acc1 == null || acc2 == null)
                    {
                        return "Zadaný kontak neexistuje";
                    }

                    ChatConnection ch = new ChatConnection()
                    {
                        Account_1 = acc1,
                        Account_2 = acc2,
                        Account_1_Agree = true,
                        Account_2_Agree = true,
                        Account_ID_1 = AccountId,
                        Account_ID_2 = ContactId,
                    };

                    _context.ChatConnections.Add(ch);
                    await _context.SaveChangesAsync();

                    return null;
                }
                catch (Exception ex)
                {
                    return "Něco se nepovedlo";
                }
            }
            else
            {
                return null;
            }
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
