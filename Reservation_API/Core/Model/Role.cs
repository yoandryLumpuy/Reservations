using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Reservation_API.Core.Model
{
    public class Role : IdentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles{ get; set; }

        public Role(){
            UserRoles = new List<UserRole>();
        }
    }
}
