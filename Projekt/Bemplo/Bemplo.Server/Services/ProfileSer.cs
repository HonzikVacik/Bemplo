using Bemplo.Server.IServices;
using Bemplo.Server.Models;
using Bemplo.Server.IRepositories;
using Bemplo.Server.ResponseModels;

namespace Bemplo.Server.Services
{
    public class ProfileSer : IProfileSer
    {
        private readonly IAccountRep _accountRep;
        private readonly IContactRep _contactRep;
        private readonly IExperienceRep _experienceRep;
        private readonly IOffer_Preference_RequestRep _offer_Preference_RequestRep;
        private readonly IPhotoRep _photoRep;

        public ProfileSer(IAccountRep accountRep, IOffer_Preference_RequestRep offer_Preference_RequestRep, IExperienceRep experienceRep, IContactRep contactRep, IPhotoRep photoRep)
        {
            _accountRep = accountRep;
            _offer_Preference_RequestRep = offer_Preference_RequestRep;
            _experienceRep = experienceRep;
            _contactRep = contactRep;
            _photoRep = photoRep;
        }

        public async Task<object> GetProfile(Account Account)
        {
            if(Account.AccountType == Enums.AccountType.Company)
            {
                return await GetDashboardCompany(Account);
            }
            else
            {
                return await GetDashboardUser(Account);
            }
        }

        public async Task<object?> GetProfileById(int Id)
        {
            Account? account = await _accountRep.GetAccountById(Id);

            if (account == null)
            {
                return default;
            }

            return await GetProfile(account);
        }

        private async Task<DashboardCompany> GetDashboardCompany(Account Account)
        {
            DashboardCompany dc = new DashboardCompany();
            dc.Id = Account.Id;
            dc.Name = Account.Name + " " + Account.Surname;
            dc.Description = Account.Description;
            dc.Offer = await _offer_Preference_RequestRep.GetLastOfferByAccount(Account);
            dc.Email = Account.Email;
            dc.Country = Account.Country;
            dc.Region = Account.Region;
            dc.City = Account.City;
            dc.Address = Account.Address;
            dc.Contacts = await _contactRep.GetAllContacByAccount(Account);
            dc.AgreeWithPolicy = Account.AgreeWithPolicy;
            dc.Photos = await _photoRep.SetPhoto(Account.Id);
            return dc;
        }
        private async Task<DashboardUser> GetDashboardUser(Account Account)
        {
            DashboardUser du = new DashboardUser();
            du.Id = Account.Id;
            du.Name = Account.Name + " " + Account.Surname;
            du.Description = Account.Description;
            du.Offer = await _offer_Preference_RequestRep.GetLastOfferByAccount(Account);
            du.Email = Account.Email;
            du.Country = Account.Country;
            du.Region = Account.Region;
            du.City = Account.City;
            du.Address = Account.Address;
            du.Contacts = await _contactRep.GetAllContacByAccount(Account);
            du.AgreeWithPolicy = Account.AgreeWithPolicy;
            du.Photos = await _photoRep.SetPhoto(Account.Id);
            du.Preference = await _offer_Preference_RequestRep.GetLastPreferenceByAccount(Account);
            du.Request = await _offer_Preference_RequestRep.GetLastReuestByAccount(Account);
            du.Experiences = await _experienceRep.GetExperienceByAccount(Account);
            //WorkingRelationship
            return du;
        }
    }
}
