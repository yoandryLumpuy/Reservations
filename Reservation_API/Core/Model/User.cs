using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Reservation_API.Core.Model
{
    public class User : IdentityUser<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
        public virtual ICollection<Reservation> Reservations { get; set; }
        public virtual ICollection<UserLikesReservation> UserLikesReservation { get; set; }
        
    }
}
