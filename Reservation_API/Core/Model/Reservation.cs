
using System;
using System.Collections.Generic;

namespace Reservation_API.Core.Model{
    public class Reservation
    {    
        public int Id { get; set; }

        public virtual Contact Contact {get; set;}
        public int ContactId {get; set;}

        public virtual User CreatedByUser { get; set; }
        public int CreatedByUserId { get; set; }

        public DateTime CreatedDateTime { get; set; }
        
        public virtual ICollection<UserLikesReservation> UserLikesReservation { get; set; }
    }
}
