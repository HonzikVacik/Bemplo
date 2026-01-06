using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.IRepositories;
using Bemplo.Server.TransportModels;

namespace Bemplo.Server.Services
{
    public class ChatSer : IChatSer
    {
        private readonly IChatRep _chatRep;
        private readonly IAccountRep _accountRep;
        private readonly IChatConnectionRep _chatConnectionRep;

        public ChatSer(IChatRep chatRep, IAccountRep accountRep, IChatConnectionRep chatConnectionRep)
        {
            _chatRep = chatRep;
            _accountRep = accountRep;
            _chatConnectionRep = chatConnectionRep;
        }
        public async Task<(ChatList[]?, string?)> GetChatList(Account account)
        {
            return await _chatRep.GetChatList(account);
        }

        public async Task<(Message[]?, string?)> GetMessages(Account account, int ContactId, int lastMessageId)
        {
            Account? contactAcc = await _accountRep.GetAccountById(ContactId);
            if (contactAcc == null)
            {
                return (null, "Kontakt neexistuje");
            }

            (ChatConnection? chatConnection, string? error) item = await _chatConnectionRep.GetChatConnection(account.Id, ContactId);

            if (item.error != null)
            {
                return (null, item.error);
            }
            if (item.chatConnection == null)
            {
                return (null, "Něco se nepovedlo");
            }

            return await _chatRep.GetMessages(account, item.chatConnection, lastMessageId, 30);
        }

        public async Task<string?> SendMessage(Account account, int ContactId, string message)
        {
            Account? contactAcc = await _accountRep.GetAccountById(ContactId);
            if(contactAcc == null)
            {
                return "Kontakt neexistuje";
            }

            string? messageError = ValidityControl.IsChatMessageValid(message);
            if (messageError != null)
            {
                return messageError;
            }

            (ChatConnection? chatConnection, string? error) item = await _chatConnectionRep.GetChatConnection(account.Id, ContactId);

            if (item.error != null)
            {
                return item.error;
            }
            if (item.chatConnection == null)
            {
                return "Něco se nepovedlo";
            }
            return await _chatRep.SendMessage(account, item.chatConnection, message);
        }

        public async Task<string?> SetLock(Account account, int ContactId, bool locked)
        {
            Account? contactAcc = await _accountRep.GetAccountById(ContactId);
            if (contactAcc == null)
            {
                return "Kontakt neexistuje";
            }

            (ChatConnection? chatConnection, string? error) item = await _chatConnectionRep.GetChatConnection(account.Id, ContactId);

            if (item.error != null)
            {
                return item.error;
            }
            if (item.chatConnection == null)
            {
                return "Něco se nepovedlo";
            }

            return await _chatRep.SetLock(account, item.chatConnection, locked);
        }
    }
}
