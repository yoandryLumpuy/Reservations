using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reservation_API.Core.Model;

namespace Reservation_API.EntityConfigurations
{
    public class ContactTypeConfiguration: IEntityTypeConfiguration<ContactType>
    {     
        public ContactTypeConfiguration(){}
        public void Configure(EntityTypeBuilder<ContactType> builder)
        {
            builder.Property(contactType => contactType.Name)
                .HasMaxLength(255)
                .IsRequired();
        }
    }    
}