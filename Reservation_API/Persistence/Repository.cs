
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
using AutoMapper;

namespace Reservation_API.Persistence
{
    public class Repository : IRepository
    {
        private readonly ReservationDbContext _reservationDbContext;
        private readonly UserManager<User> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public Repository(ReservationDbContext reservationDbContext, UserManager<User> userManager,
                  IUnitOfWork unitOfWork, IMapper mapper)
        {
            _reservationDbContext = reservationDbContext;
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }  

        public async Task<User> GetUserAsync(int id)
        {
            return await _userManager.FindByIdAsync(id.ToString());
        } 
        public async Task<Reservation> GetReservationAsync(int id)
        {
            return await _reservationDbContext.Reservations
                      .Include(res => res.CreatedByUser)
                      .Include(res => res.Contact).ThenInclude(c => c.ContactType)
                      .SingleOrDefaultAsync(res => res.Id == id);
        }

        public async Task<Contact> GetContactAsync(int id)
        {            
            return await _reservationDbContext.Contacts
                    .Include(contact => contact.ContactType)
                    .SingleOrDefaultAsync(contact => contact.Id == id);
        }
         
        public async Task<PaginationResult<Contact>> GetContactsAsync(QueryObject queryObject)
        {
            var query = _reservationDbContext.Contacts
                            .Include(c => c.ContactType).AsQueryable();

            var dictionary = new Dictionary<string, Expression<Func<Contact, object>>>(){               
                ["ContactName"] = contact => contact.Name,
                ["Phone"] = contact => contact.Phone,
                ["BirthDate"] = contact => contact.BirthDate,
                ["ContactType"] = contact => contact.ContactType.Name
            };

            if (queryObject?.SortBy != null && dictionary.ContainsKey(queryObject.SortBy))
            {
                query = queryObject.IsSortAscending                 
                        ? query.OrderBy(dictionary[queryObject.SortBy]) 
                        : query.OrderByDescending(dictionary[queryObject.SortBy]);            
            }     

            return await PaginationResult<Contact>.CreateAsync(query, queryObject.Page, queryObject.PageSize);
        }

        public async Task<Contact> GetOrCreateContactByNameAsync(ContactForModificationsDto contactForModificationsDto)
        {
            var contact = await _reservationDbContext.Contacts
                .Include(c => c.ContactType)
                .SingleOrDefaultAsync( 
                    contact => contact.Name.ToLower() == contactForModificationsDto.ContactName.ToLower());

            if (contact != null)  return contact;

            contact = _mapper.Map<ContactForModificationsDto, Contact>(contactForModificationsDto);
            
            await _reservationDbContext.Contacts.AddAsync(contact);            
            await _unitOfWork.CompleteAsync();                               
            return await GetContactAsync(contact.Id);
        }

        public async Task<PaginationResult<Reservation>> GetReservationsAsync(QueryObject queryObject)
        {
            var query = _reservationDbContext.Reservations
                            .Include(res => res.CreatedByUser)
                            .Include(res => res.Contact).ThenInclude(c => c.ContactType)
                            .AsQueryable();

            if (queryObject.UserId.HasValue)
            {
                query = query.Where(res => res.CreatedByUserId == queryObject.UserId.Value);
            }

            var dictionary = new Dictionary<string, Expression<Func<Reservation, object>>>(){
                ["CreatedDateTime"] = reservation => reservation.CreatedDateTime,
                ["ContactName"] = reservation => reservation.Contact.Name
            };

            if (queryObject?.SortBy != null && dictionary.ContainsKey(queryObject.SortBy))
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
            var contact = await this.GetOrCreateContactByNameAsync(
                _mapper.Map<ReservationForModificationsDto, ContactForModificationsDto>(reservationForModificationsDto));

            var reservation = new Reservation{
                ContactId = contact.Id,
                CreatedByUserId = invokingUserId,
                CreatedDateTime = DateTime.Now                
            };
            
            await _reservationDbContext.Reservations.AddAsync(reservation);
            await _unitOfWork.CompleteAsync();
            return await GetReservationAsync(reservation.Id);
        }        
    }
}
