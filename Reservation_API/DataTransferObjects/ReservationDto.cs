using System;
using System.Collections.Generic;
using Reservation_API.Core.Model;

namespace Reservation_API.DataTransferObjects
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public DateTime CreatedDateTime { get; set; }     
        public ContactDto Contact {get; set;}
        public UserForListDto CreatedByUser { get; set; }
        public bool YouLikeIt { get; set; }
        public int Ranking { get; set; }
    }
}
