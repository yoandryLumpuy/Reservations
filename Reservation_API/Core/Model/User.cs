using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Reservation_API.Core.Model
{
    public class User : IdentityUser<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<UserLikesReservation> UserLikesReservation { get; set; }

        public User(){
            UserRoles = new List<UserRole>();
            Reservations = new List<Reservation>();
            UserLikesReservation = new List<UserLikesReservation>();
        }
        
    }
}
