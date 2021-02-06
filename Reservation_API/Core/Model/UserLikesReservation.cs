
namespace Reservation_API.Core.Model
{
    public class UserLikesReservation
    {
        public virtual User User { get; set; }
        public  int UserId { get; set; }
        public virtual Reservation Reservation{ get; set; }
        public int ReservationId { get; set; }
    }
}
