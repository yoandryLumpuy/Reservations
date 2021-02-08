
using System;
using System.Collections.Generic;
using Reservation_API.Core.Model;

public class Contact
{    
    public int Id { get; set; }
    public string Name { get; set; }
    
    public string Phone { get; set; }

    public DateTime BirthDate { get; set; }

    public ContactType ContactType { get; set; }
    public int ContactTypeId { get; set; }

    public ICollection<Reservation> Reservations { get; set; }

    public Contact(){
        Reservations = new List<Reservation>();
    }
}