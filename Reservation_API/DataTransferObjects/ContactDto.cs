using System;

namespace Reservation_API.DataTransferObjects{
    public class ContactDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        
        public string Phone { get; set; }

        public DateTime BirthDate { get; set; }

        public ContactTypeDto ContactType { get; set; }    
        public UserForListDto CreatedByUser { get; set; }
    }
}