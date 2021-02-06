using System.Threading.Tasks;

namespace Reservation_API.Core
{
    public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}
