using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Reservation_API.Core.Model;

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
            
            //ContactType Entity
            builder.Entity<ContactType>()
                .Property(contactType => contactType.Name)
                .IsRequired();
            
            //Contact Entity
            builder.Entity<Contact>()
                .HasOne(cont => cont.ContactType)
                .WithMany(contType => contType.Contacts)
                .HasForeignKey(cont => cont.ContactTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            //UserRole Entity
            builder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});
                // userRole (* <-> 1) User
                userRole.HasOne(ur => ur.User)
                    .WithMany(user => user.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
                // userRole (* <-> 1) Role
                userRole.HasOne(ur => ur.Role)
                    .WithMany(role => role.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
            });

            //Reservation Entity
            builder.Entity<Reservation>()
                .HasOne(reservation => reservation.CreatedByUser)
                .WithMany(user => user.Reservations)
                .HasForeignKey(reservation => reservation.CreatedByUserId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Reservation>()
                .HasOne(reservation => reservation.Contact)
                .WithMany(contact => contact.Reservations)
                .HasForeignKey(reservation => reservation.CreatedByUserId)
                .OnDelete(DeleteBehavior.Cascade);


            //UserLikesPicture
            builder.Entity<UserLikesReservation>(userLikesReservation =>
            {
                userLikesReservation.HasKey(uLr => new { uLr.UserId, uLr.ReservationId });

                userLikesReservation
                    .HasOne(uLr => uLr.Reservation)
                    .WithMany(reservation => reservation.UserLikesReservation)
                    .HasForeignKey(uLr => uLr.ReservationId)
                    .OnDelete(DeleteBehavior.Cascade);

                userLikesReservation
                    .HasOne(uLr => uLr.User)
                    .WithMany(user => user.UserLikesReservation)
                    .HasForeignKey(uLr => uLr.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
