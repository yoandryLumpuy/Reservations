
using System;
using System.Collections.Generic;

namespace Reservation_API.Core.Model{
    public class Reservation
    {    
        public int Id { get; set; }

        public Contact Contact {get; set;}
        public int ContactId {get; set;}

        public User CreatedByUser { get; set; }
        public int CreatedByUserId { get; set; }

        public DateTime CreatedDateTime { get; set; }
        
        public ICollection<UserLikesReservation> UserLikesReservation { get; set; }

        public Reservation(){
            UserLikesReservation = new List<UserLikesReservation>();
        }
    }
}
