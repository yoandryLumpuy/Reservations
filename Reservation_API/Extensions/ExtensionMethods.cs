using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Reservation_API.Core.Model;
using Reservation_API.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Reservation_API.Extensions
{
    public static class ExtensionMethods
    {
        public static void SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager,
            ReservationDbContext reservationDbContext)
        {
            if (userManager.Users.Any()) return;

            var contactTypes = new List<ContactType>(){
               new ContactType{Name = "ContactType #1"},     
               new ContactType{Name = "ContactType #2"},
               new ContactType{Name = "ContactType #3"},
            };
            reservationDbContext.ContactTypes.AddRange(contactTypes);
            reservationDbContext.SaveChangesAsync().Wait();

            var roles = new List<Role>()
            {
                new Role(){Name = Constants.RoleNameAdmin}
            };

            roles.ForEach(role => roleManager.CreateAsync(role).Wait()); 

            var adminUser = new User(){UserName = "admin"};
            userManager.CreateAsync(adminUser, "Password*123").Wait();
            userManager.AddToRoleAsync(adminUser, Constants.RoleNameAdmin).Wait();
        }

        public static IIncludableQueryable<Contact, object> EagerLoadRelatedObjects(this DbSet<Contact> dbSetContacts, bool includeRelated = true){
            if (includeRelated)
               return dbSetContacts.Include(c => c.ContactType)
                         .Include(c => c.CreatedByUser);

            return dbSetContacts.Include(c => c);             
        } 

        public static IIncludableQueryable<Reservation, object> EagerLoadRelatedObjects(this DbSet<Reservation> dbSetReservations, bool includeRelated = true){
            if (includeRelated)
               return dbSetReservations
                        .Include(res => res.CreatedByUser)
                        .Include(res => res.Contact).ThenInclude(c => c.ContactType)
                        .Include(res => res.Contact).ThenInclude(c => c.CreatedByUser)
                        .Include(res => res.UserLikesReservation);

            return dbSetReservations.Include(r => r);             
        }
    }
}
