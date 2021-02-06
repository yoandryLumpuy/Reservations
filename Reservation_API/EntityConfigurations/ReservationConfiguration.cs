using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservation_API.Core.Model;

namespace Reservation_API.EntityConfigurations
{
    public class ReservationConfiguration: IEntityTypeConfiguration<Reservation>
    {     
        public ReservationConfiguration(){}
        public void Configure(EntityTypeBuilder<Reservation> builder)
        {
            builder.HasOne(reservation => reservation.CreatedByUser)
            .WithMany(user => user.Reservations)
            .HasForeignKey(reservation => reservation.CreatedByUserId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(reservation => reservation.Contact)
                .WithMany(contact => contact.Reservations)
                .HasForeignKey(reservation => reservation.CreatedByUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(res => res.CreatedDateTime)
                .IsRequired(); 
        }
    }    
}