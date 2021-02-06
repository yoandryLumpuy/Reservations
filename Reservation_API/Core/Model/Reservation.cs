
using System.Collections.Generic;
using Reservation_API.Core.Model;

public class Reservation
{    
    public int Id { get; set; }

    public Contact Contact {get; set;}
    public int ContactId {get; set;}

    public virtual User CreatedByUser { get; set; }
    public int CreatedByUserId { get; set; }
    
    public virtual ICollection<UserLikesReservation> UserLikesReservation { get; set; }
}