using System.Threading.Tasks;
using Reservation_API.Core.Model;
using Reservation_API.DataTransferObjects;

namespace Reservation_API.Persistence
{
    public interface IRepository
    {
        Task<User> GetUserAsync(int id);


        //working with Reservations
        Task<Reservation> GetReservationAsync(int id);
        Task<PaginationResult<Reservation>> GetReservationsAsync(QueryObject queryObject);
        Task<Reservation> CreateReservationAsync(int invokingUserId, ReservationForModificationsDto reservationForModificationsDto);
        Task<bool> YouLikeReservationAsync(int userId, int reservationId);
        Task<Reservation> ModifyFavoritesAsync(int userId, int reservationId);



        //working with Contacts
        Task<Contact> GetOrCreateContactByNameAsync(ContactForModificationsDto contactForModificationsDto);
        Task<Contact> GetContactAsync(int id);
        Task<PaginationResult<Contact>> GetContactsAsync(QueryObject queryObject);
    }
}
