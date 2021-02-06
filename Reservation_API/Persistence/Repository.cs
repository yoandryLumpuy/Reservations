
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Reservation_API.Core.Model;
using Reservation_API.DataTransferObjects;
using Reservation_API.Core;

namespace Reservation_API.Persistence
{
    public class Repository : IRepository
    {
        private readonly ReservationDbContext _reservationDbContext;
        private readonly UserManager<User> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public Repository(ReservationDbContext reservationDbContext, UserManager<User> userManager,
                  IUnitOfWork unitOfWork)
        {
            _reservationDbContext = reservationDbContext;
            _userManager = userManager;
            _unitOfWork = unitOfWork;
        }  

        public async Task<User> GetUserAsync(int id)
        {
            return await _userManager.FindByIdAsync(id.ToString());
        } 
        public async Task<Reservation> GetReservationAsync(int id)
        {
            return await _reservationDbContext.Reservations.SingleOrDefaultAsync(res => res.Id == id);
        }
         
        public async Task<PaginationResult<Contact>> GetContactsAsync(QueryObject queryObject)
        {
            var query = _reservationDbContext.Contacts.AsQueryable();

            var dictionary = new Dictionary<string, Expression<Func<Contact, object>>>(){               
                ["ContactName"] = contact => contact.Name,
                ["Phone"] = contact => contact.Phone,
                ["BirthDate"] = contact => contact.BirthDate,
                ["ContactType"] = contact => contact.ContactType.Name
            };

            if (dictionary.ContainsKey(queryObject.SortBy))
            {
                query = queryObject.IsSortAscending                 
                        ? query.OrderBy(res => dictionary[queryObject.SortBy]) 
                        : query.OrderByDescending(res => dictionary[queryObject.SortBy]);            
            }    

            return await PaginationResult<Contact>.CreateAsync(query, queryObject.Page, queryObject.PageSize);
        }

        public async Task<Contact> GetOrCreateContactByNameAsync(ContactForModificationsDto contactForModificationsDto)
        {
            var contact = await _reservationDbContext.Contacts.SingleOrDefaultAsync(contact => 
                  string.Compare(contact.Name, contactForModificationsDto.ContactName, StringComparison.OrdinalIgnoreCase) == 0);
            if (contact != null)  return contact;

            contact = new Contact{
                Name = contactForModificationsDto.ContactName,
                BirthDate = contactForModificationsDto.BirthDate.Value,
                Phone = contactForModificationsDto.Phone,
                ContactTypeId = contactForModificationsDto.ContactTypeId.Value
            };
            
            await _reservationDbContext.Contacts.AddAsync(contact);
            await _unitOfWork.CompleteAsync();                  
            return contact;
        }

        public async Task<PaginationResult<Reservation>> GetReservationsAsync(QueryObject queryObject)
        {
            var query = _reservationDbContext.Reservations.AsQueryable();

            if (queryObject.UserId.HasValue)
            {
                query = query.Where(res => res.CreatedByUserId == queryObject.UserId.Value);
            }

            var dictionary = new Dictionary<string, Expression<Func<Reservation, object>>>(){
                ["CreatedDateTime"] = reservation => reservation.CreatedDateTime,
                ["ContactName"] = reservation => reservation.Contact.Name
            };

            if (dictionary.ContainsKey(queryObject.SortBy))
            {
                query = queryObject.IsSortAscending                 
                        ? query.OrderBy(res => dictionary[queryObject.SortBy]) 
                        : query.OrderByDescending(res => dictionary[queryObject.SortBy]);            
            }            

            return await PaginationResult<Reservation>.CreateAsync(query, queryObject.Page, queryObject.PageSize);
        }

        public async Task<bool> YouLikeReservationAsync(int userId, int reservationId)
        {            
            return await _reservationDbContext.UserLikesReservations.AnyAsync(userLikes =>
                            userLikes.UserId == userId && userLikes.ReservationId == reservationId);
        }

        public async Task<Reservation> ModifyFavoritesAsync(int userId, int reservationId)
        {
            try
            {
                var favorite = await _reservationDbContext.UserLikesReservations
                    .FirstOrDefaultAsync(userLikesReserv => userLikesReserv.UserId == userId && userLikesReserv.ReservationId == reservationId);

                if (favorite == null)
                    await _reservationDbContext.UserLikesReservations.AddAsync(new UserLikesReservation()
                    {
                        UserId = userId,
                        ReservationId = reservationId
                    });
                else
                    _reservationDbContext.UserLikesReservations.Remove(favorite);
                
                await _unitOfWork.CompleteAsync();
                return await GetReservationAsync(reservationId);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<Reservation> CreateReservationAsync(int invokingUserId, ReservationForModificationsDto reservationForModificationsDto)
        {
            var contact = this.GetOrCreateContactByNameAsync(new ContactForModificationsDto{
                ContactName = reservationForModificationsDto.ContactName,
                Phone = reservationForModificationsDto.Phone,
                BirthDate = reservationForModificationsDto.BirthDate,
                ContactTypeId = reservationForModificationsDto.ContactTypeId
            });

            var reservation = new Reservation{
                ContactId = contact.Id,
                CreatedByUserId = invokingUserId,
                CreatedDateTime = DateTime.Now
            };
            
            await _reservationDbContext.Reservations.AddAsync(reservation);
            await _unitOfWork.CompleteAsync();
            return reservation;
        }
    }
}
