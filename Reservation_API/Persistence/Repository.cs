
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
using Reservation_API.Extensions;

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
            return await _reservationDbContext.Reservations.EagerLoadRelatedObjects()
                      .SingleOrDefaultAsync(res => res.Id == id);
        }

        public async Task<Contact> GetContactAsync(int id, bool forElimination = false)
        {   
            if (forElimination)
                return await _reservationDbContext.Contacts.EagerLoadRelatedObjectsForCascadeElimination()
                        .SingleOrDefaultAsync(contact => contact.Id == id);

            return await _reservationDbContext.Contacts.EagerLoadRelatedObjects()
                    .SingleOrDefaultAsync(contact => contact.Id == id);
        }
         
        public async Task<PaginationResult<Contact>> GetContactsAsync(QueryObject queryObject)
        {
            var query = _reservationDbContext.Contacts.EagerLoadRelatedObjects().AsQueryable();

            var dictionary = new Dictionary<string, Expression<Func<Contact, object>>>(){               
                [Constants.SortByContactName] = contact => contact.Name,
                [Constants.SortByPhone] = contact => contact.Phone,
                [Constants.SortByBirthDate] = contact => contact.BirthDate,
                [Constants.SortByContactType] = contact => contact.ContactType.Name
            };

            if (queryObject?.SortBy != null && dictionary.ContainsKey(queryObject.SortBy))
            {
                query = queryObject.IsSortAscending                 
                        ? query.OrderBy(dictionary[queryObject.SortBy]) 
                        : query.OrderByDescending(dictionary[queryObject.SortBy]);            
            }     

            return await PaginationResult<Contact>.CreateAsync(query, queryObject.Page, queryObject.PageSize);
        }

        public async Task<Contact> CreateOrUpdateContactByNameAsync(int invokingUserId, ContactForModificationsDto contactForModificationsDto)
        {
            var contact = await _reservationDbContext.Contacts.EagerLoadRelatedObjects()
                .SingleOrDefaultAsync( 
                    contact => contact.Name.ToLower() == contactForModificationsDto.ContactName.ToLower());

            var toAdd = contact == null;

            //trying to modify contact and invokingUserId is the creator of this contact then modify properties
            //if not then use the contact without modifying its properties.
            if (!toAdd && invokingUserId == contact.CreatedByUserId)  
                _mapper.Map<ContactForModificationsDto, Contact>(contactForModificationsDto, contact);
            else if (toAdd) 
                contact = _mapper.Map<ContactForModificationsDto, Contact>(contactForModificationsDto);

            if (toAdd) {
                contact.CreatedByUserId = invokingUserId;
                await _reservationDbContext.Contacts.AddAsync(contact);            
            }
            await _unitOfWork.CompleteAsync();                               
            return await GetContactAsync(contact.Id);
        }

        public async Task<PaginationResult<Reservation>> GetReservationsAsync(QueryObject queryObject)
        {
            var query = _reservationDbContext.Reservations.EagerLoadRelatedObjects()
                            .AsQueryable();

            if (queryObject.UserId.HasValue)
            {
                query = query.Where(res => res.CreatedByUserId == queryObject.UserId.Value);
            }

            var dictionary = new Dictionary<string, Expression<Func<Reservation, object>>>(){
                [Constants.SortByCreatedDateTime] = reservation => reservation.CreatedDateTime,
                [Constants.SortByContactName] = reservation => reservation.Contact.Name,
                [Constants.SortByRanking] = reservation => reservation.UserLikesReservation.Count()
            };

            if (queryObject?.SortBy != null && dictionary.ContainsKey(queryObject.SortBy))
            {
                query = queryObject.IsSortAscending                 
                        ? query.OrderBy(dictionary[queryObject.SortBy]) 
                        : query.OrderByDescending(dictionary[queryObject.SortBy]);            
            }            

            return await PaginationResult<Reservation>.CreateAsync(query, queryObject.Page, queryObject.PageSize);
        }

        public bool YouLikeReservationAsync(int userId, int reservationId)
        {            
            return _reservationDbContext.UserLikesReservations.Any(userLikes =>
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
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<Reservation> CreateOrUpdateReservationAsync(int invokingUserId, ReservationForModificationsDto reservationForModificationsDto)
        {
            var contact = await this.CreateOrUpdateContactByNameAsync(invokingUserId,
                _mapper.Map<ReservationForModificationsDto, ContactForModificationsDto>(reservationForModificationsDto));

            var toAdd = reservationForModificationsDto.Id == 0;

            Reservation reservation;
            if (toAdd)
                reservation = new Reservation{
                    ContactId = contact.Id,
                    CreatedByUserId = invokingUserId,
                    CreatedDateTime = DateTime.Now                
                };
            else {
                reservation = await this.GetReservationAsync(reservationForModificationsDto.Id);
                reservation.ContactId = contact.Id;
                reservation.CreatedDateTime = DateTime.Now;
            }                
            
            if (toAdd) await _reservationDbContext.Reservations.AddAsync(reservation);
            await _unitOfWork.CompleteAsync();
            return await GetReservationAsync(reservation.Id);
        }

        public async Task<List<Contact>> GetAllContactsAsync()
        {
            var allContacts = await _reservationDbContext.Contacts
                .EagerLoadRelatedObjects()
                .OrderBy(c => c.Name)
                .ToListAsync();

            return allContacts;
        }

        public async Task<List<ContactType>> GetAllContactTypesAsync()
        {
            return await _reservationDbContext.ContactTypes.ToListAsync();
        }

        public async Task<ResultDeleteContact> DeleteContactAsync(int invokingUserId, int contactId)
        {
            var contact = await GetContactAsync(contactId, forElimination: true);            
            if (contact != null) {  
                if (invokingUserId != contact.CreatedByUser.Id)
                    return ResultDeleteContact.NotAuthorized;

                foreach(var r in contact.Reservations){
                   var userLikes 
                        = await _reservationDbContext.UserLikesReservations
                           .Where(uLr => uLr.ReservationId == r.Id).ToListAsync(); 
                   _reservationDbContext.UserLikesReservations.RemoveRange(userLikes);
                }              
                _reservationDbContext.Contacts.Remove(contact);
                await _unitOfWork.CompleteAsync();                
                return ResultDeleteContact.Successful;
            }

            return ResultDeleteContact.NotFound;
        }

        public async Task<Contact> GetContactByNameAsync(string contactName)
        {
            return await _reservationDbContext.Contacts.EagerLoadRelatedObjects()
                            .FirstOrDefaultAsync(contact => contact.Name.ToLower() == contactName.ToLower());
        }
    }
}
