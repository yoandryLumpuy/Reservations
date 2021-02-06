using System.Threading.Tasks;
using Reservation_API.Core.Model;
using Reservation_API.DataTransferObjects;

namespace Reservation_API.Persistence
{
    public interface IRepository
    {
        Task<User> GetUserAsync(int id);
        Task<Reservation> GetReservationAsync(int id);
        Task<PaginationResult<Reservation>> GetReservationsAsync(QueryObject queryObject);
        Task<Reservation> CreateReservationAsync(int invokingUserId, ReservationForModificationsDto reservationForModificationsDto);
        Task<Contact> GetOrCreateContactByNameAsync(ContactForModificationsDto contactForModificationsDto);
        Task<PaginationResult<Contact>> GetContactsAsync(QueryObject queryObject);
        Task<bool> YouLikeReservationAsync(int userId, int reservationId);
        Task<Reservation> ModifyFavoritesAsync(int userId, int reservationId);
    }
}
