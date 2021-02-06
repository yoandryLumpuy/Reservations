using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Reservation_API.Core.Model;
using Reservation_API.EntityConfigurations;

namespace Reservation_API.Persistence
{
    public class ReservationDbContext : IdentityDbContext<User, Role,int, IdentityUserClaim<int>,UserRole,IdentityUserLogin<int>,IdentityRoleClaim<int>,IdentityUserToken<int>>
    {   
        public DbSet<Contact> Contacts { get; set; }   
        public DbSet<ContactType> ContactTypes { get; set; }    
        public DbSet<Reservation> Reservations { get; set; }    
        public DbSet<UserLikesReservation> UserLikesReservations { get; set; }  
        
        public ReservationDbContext(DbContextOptions<ReservationDbContext> options) : base(options)
        { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new ContactTypeConfiguration());
            builder.ApplyConfiguration(new ContactConfiguration());
            builder.ApplyConfiguration(new UserRoleConfiguration());
            builder.ApplyConfiguration(new ReservationConfiguration());
            builder.ApplyConfiguration(new UserLikesReservationConfiguration());
        }
    }
}
