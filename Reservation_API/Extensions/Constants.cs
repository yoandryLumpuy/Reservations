namespace Reservation_API.Extensions
{
    public class Constants
    {        
        //roles
        public const string RoleNameAdmin = "Admin";     

        //policies
        public const string PolicyNameAdmin = "PolicyAdmin";   

        public const string SortByContactName = "ContactName";
        public const string SortByPhone = "Phone";
        public const string SortByBirthDate = "BirthDate";
        public const string SortByContactType = "ContactType";
        public const string SortByCreatedDateTime = "CreatedDateTime";
        public const string SortByRanking = "Ranking";
    }

    public enum ResultDeleteContact {Successful = 0, NotFound = 1, NotAuthorized = 2};
}
