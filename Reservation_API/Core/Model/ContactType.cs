using System.Collections.Generic;

public class ContactType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Contact> Contacts { get; set; }

    public ContactType(){
        Contacts = new List<Contact>();
    }
}