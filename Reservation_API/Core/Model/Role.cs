using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Reservation_API.Core.Model
{
    public class Role : IdentityRole<int>
    {
        public ICollection<UserRole> UserRoles{ get; set; }

        public Role(){
            UserRoles = new List<UserRole>();
        }
    }
}
