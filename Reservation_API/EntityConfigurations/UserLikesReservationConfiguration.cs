using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservation_API.Core.Model;

namespace Reservation_API.EntityConfigurations
{
    public class UserLikesReservationConfiguration: IEntityTypeConfiguration<UserLikesReservation>
    {     
        public UserLikesReservationConfiguration(){}
        
        public void Configure(EntityTypeBuilder<UserLikesReservation> builder)
        {
            builder.HasKey(uLr => new { uLr.UserId, uLr.ReservationId });

            builder.HasOne(uLr => uLr.Reservation)
                .WithMany(reservation => reservation.UserLikesReservation)
                .HasForeignKey(uLr => uLr.ReservationId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(uLr => uLr.User)
                .WithMany(user => user.UserLikesReservation)
                .HasForeignKey(uLr => uLr.UserId)
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }    
}