using System;
using System.ComponentModel.DataAnnotations;

namespace Reservation_API.DataTransferObjects
{
    public class ContactForModificationsDto
    {        
        [Required]
        public string ContactName { get; set; }
        
        public string Phone { get; set; }

        public DateTime BirthDate { get; set; }

        public int ContactTypeId { get; set; } 
    }
}