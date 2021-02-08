
namespace Reservation_API.Core.Model
{
    public class UserLikesReservation
    {
        public User User { get; set; }
        public  int UserId { get; set; }
        public Reservation Reservation{ get; set; }
        public int ReservationId { get; set; }
    }
}
