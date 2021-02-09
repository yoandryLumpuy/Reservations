
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Reservation_API.EntityConfigurations
{
    public class ContactConfiguration: IEntityTypeConfiguration<Contact>
    {     
        public ContactConfiguration(){}
        public void Configure(EntityTypeBuilder<Contact> builder)
        {
            builder.Property(contact => contact.Name)
              .IsRequired()
              .HasMaxLength(255);

            builder.Property(contact => contact.BirthDate)
                .IsRequired();

            builder.HasOne(cont => cont.ContactType)
                .WithMany(contType => contType.Contacts)
                .HasForeignKey(cont => cont.ContactTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }    
}