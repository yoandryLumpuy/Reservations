using System;
using System.ComponentModel.DataAnnotations;

namespace Reservation_API.DataTransferObjects
{
    public class ReservationForModificationsDto
    {
        public int Id { get; set; }

        [Required]
        public string ContactName { get; set; }
        
        public string Phone { get; set; }

        [Required]
        public DateTime BirthDate { get; set; }

        [Required]
        public int ContactTypeId { get; set; }  

        public string Description { get; set; } 
    }
}
