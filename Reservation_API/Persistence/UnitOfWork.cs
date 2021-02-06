using System.Threading.Tasks;
using Reservation_API.Core;

namespace Reservation_API.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ReservationDbContext context;

        public UnitOfWork(ReservationDbContext context)
        {
            this.context = context;
        }

        public async Task CompleteAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}
