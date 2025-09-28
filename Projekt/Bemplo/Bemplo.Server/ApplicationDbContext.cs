using Bemplo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Bemplo.Server
{
    public class ApplicationDbContext : DbContext
    {
        //Add-Migration InitialMigration -c ApplicationDbContext -o Migrations
        //Update-Database

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Offer_Preference_Request> Offer_Preference_Requests { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<ChatConnection> ChatConnections { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Review> Rewiews { get; set; }
        public DbSet<WorkingRelationship> WorkingRelationships { get; set; }
        public DbSet<WorkingPeriod> WorkingPeriods { get; set; }
        public DbSet<KeyWord> KeyWords { get; set; }
        public DbSet<Picture> Pictures { get; set; }
        public DbSet<PrivacyPolicy> PrivacyPolicies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Enums>().HasNoKey();

            modelBuilder.Entity<ChatConnection>()
                .HasKey(pt => new { pt.Account_ID_1, pt.Account_ID_2 });

            modelBuilder.Entity<ChatConnection>()
                .HasOne(pt => pt.Account_1)
                .WithMany()
                .HasForeignKey(pt => pt.Account_ID_1);

            modelBuilder.Entity<ChatConnection>()
                .HasOne(pt => pt.Account_2)
                .WithMany()
                .HasForeignKey(pt => pt.Account_ID_2);
        }
    }
}
