
namespace Reservation_API.Persistence
{
    public class Repository : IRepository
    {
        private readonly ReservationDbContext _reservationDbContext;       

        public Repository(ReservationDbContext reservationDbContext)
        {
            _reservationDbContext = reservationDbContext;
        }       
    }
}
