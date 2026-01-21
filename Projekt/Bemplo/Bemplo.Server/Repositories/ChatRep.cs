using Bemplo.Server.IRepositories;
using Bemplo.Server.Models;
using Bemplo.Server.TransportModels;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server.Repositories
{
    public class ChatRep : IChatRep
    {
        private readonly ApplicationDbContext _context;

        public ChatRep(ApplicationDbContext context)
        {
            _context = context; 
        }
        public async Task<(ChatList[]?, string?)> GetChatList(Account account)
        {
            try
            {
                int userId = account.Id;

                //Najde všechny ChatConnections, kde je account
                var query = _context.ChatConnections
                    .Where(c => c.Account_ID_1 == userId || c.Account_ID_2 == userId)
                    .Select(conn => new
                    {
                        Connection = conn,
                        //Najde všechny druhé kontakty
                        OtherAccount = (conn.Account_ID_1 == userId) ? conn.Account_2 : conn.Account_1,

                        //Získá poslední zprávu pro danou connection
                        LastChat = _context.Chats
                            .Where(chat => chat.Chat_Connection == conn)
                            .OrderByDescending(chat => chat.Timestamp)
                            .FirstOrDefault()
                    });

                List<ChatListWithDateTime> result = await query
                    .Select(x => new ChatListWithDateTime
                    {
                        ContactId = x.OtherAccount.Id,
                        Name = x.OtherAccount.AccountType == 0 ? x.OtherAccount.Name + " " + x.OtherAccount.Surname : x.OtherAccount.Name,
                        LastMessage = x.LastChat != null ? x.LastChat.Content : string.Empty,
                        LastMessageDateTime = x.LastChat != null ? x.LastChat.Timestamp : DateTime.MinValue
                    })
                    //Seřadí zprávy tak, aby konverzace s nejnovější zprávou byla nahoře
                    .OrderByDescending(x => x.LastMessageDateTime)
                    .ToListAsync();

                return (result.ToArray(), null);
            }
            catch (Exception ex)
            {
                return (null, "Něco se nepovedlo");
            }
        }

        public async Task<(Message[]?, string?)> GetMessages(Account account, ChatConnection chatConnection, int lastMessageId, int count)
        {
            try
            {
                DateTime? timestamp = await _context.Chats.Where(ch => ch.Id == lastMessageId).Select(ch => ch.Timestamp).FirstOrDefaultAsync();
                if (timestamp == null)
                {
                    return (new Message[0], null);
                }
                Message[] messages = await _context.Chats.Where(ch => ch.Chat_Connection == chatConnection).OrderByDescending(ch => ch.Timestamp).Where(ch => ch.Timestamp > timestamp).Take(count).Select(x => new Message() { Id = x.Id, Content = x.Content, Owned = x.SenderId == account.Id, Timestamp = x.Timestamp }).ToArrayAsync();
                return (messages, null);
            }
            catch (Exception ex)
            {
                return (null, "Něco se nepovedlo");
            }
        }

        public async Task<string?> SendMessage(Account account, ChatConnection chatConnection, string message)
        {
            try
            {
                Chat chat = new Chat()
                {
                    Chat_Connection = chatConnection,
                    SenderId = account.Id,
                    Content = message,
                    Timestamp = DateTime.Now.ToUniversalTime()
                };
                _context.Chats.Add(chat);
                await _context.SaveChangesAsync();
                return null;
            }
            catch (Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }

        public async Task<string?> SetLock(Account account, ChatConnection chatConnection, bool locked)
        {
            try
            {
                ChatConnection? chatConnection1 = await _context.ChatConnections.Where(chc => chc == chatConnection).FirstOrDefaultAsync();
                if (chatConnection1 == null)
                {
                    return "Kontakt neexistuje";
                }
                
                if(chatConnection.Account_ID_1 == account.Id)
                {
                    chatConnection1.Account_1_Agree = locked;
                }
                else if(chatConnection1.Account_ID_2 == account.Id)
                {
                    chatConnection1.Account_2_Agree = locked;
                }
                else
                {
                    return "Něco se nepovedlo";
                }
                
                _context.Update(chatConnection1);
                await _context.SaveChangesAsync();
                
                return null;
            }
            catch(Exception ex)
            {
                return "Něco se nepovedlo";
            }
        }
    }
}
