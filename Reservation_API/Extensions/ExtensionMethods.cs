using System.Collections.Generic;
using System.Linq;
using Reservation_API.Extensions;
using Microsoft.AspNetCore.Identity;
using Reservation_API.Core.Model;
using Reservation_API.Persistence;

namespace Reservation_API.Extensions
{
    public class ExtensionMethods
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
    }
}
