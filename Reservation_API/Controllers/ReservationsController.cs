using AutoMapper;
using Reservation_API.Core;
using Reservation_API.Core.Model;
using Reservation_API.DataTransferObjects;
using Reservation_API.Extensions;
using Reservation_API.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Reservation_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReservationsController(IRepository repository, 
            IUnitOfWork unitOfWork, IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpPost]        
        public async Task<IActionResult> PostReservation([FromBody]ReservationForModificationsDto reservationForModificationsDto)

        {
            var invokingUserId = int.Parse(User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier).Value);

            //trying to update an existing reservation            
            if (reservationForModificationsDto.Id != 0) {
                var res = await _repository.GetReservationAsync(reservationForModificationsDto.Id);
                if (res == null) return BadRequest("The reservation you're trying to update doesn't exist");
                if (res.CreatedByUserId != invokingUserId) 
                    return BadRequest("You're not the owner of this reservation, so you can't modify it!");
            }
            
            var reservation = await _repository.CreateOrUpdateReservationAsync(invokingUserId, reservationForModificationsDto);
                        
            var reservationDto = _mapper.Map<Reservation, ReservationDto>(reservation, 
                opt => opt.AfterMap((source, target) =>
                {
                    target.YouLikeIt = _repository.YouLikeReservationAsync(invokingUserId, target.Id);
                }));

            return Ok(reservationDto);
        }
              
        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpGet(Name = "GetReservations")]
        public async Task<IActionResult> GetReservations([FromQuery]QueryObject queryObject)
        {
            var invokingUserId = int.Parse(User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier).Value);
            var reservationsFromDbContext =  await _repository.GetReservationsAsync(queryObject);
            var mapping = _mapper.Map<PaginationResult<Reservation>, PaginationResult<ReservationDto>>(reservationsFromDbContext, 
                opt => opt.AfterMap((source, target) =>
                {
                    target.Items.ForEach(
                        reservationDto =>
                        {
                            reservationDto.YouLikeIt = _repository.YouLikeReservationAsync(invokingUserId, reservationDto.Id);                            
                        }
                    );
                }));
            return Ok(mapping);
        }        
                
        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpGet("{reservationId}", Name = "GetReservation")]
        public async Task<IActionResult> GetReservation(int reservationId)
        {
            var invokingUserId = int.Parse(User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier).Value);
            var reservationFromDbContext =  await _repository.GetReservationAsync(reservationId);
            if (reservationFromDbContext == null)  return BadRequest($"The reservation {reservationId} doesn't exist");

            var mapping = _mapper.Map<Reservation, ReservationDto>(reservationFromDbContext, 
                opt => opt.AfterMap((source, target) =>
                {
                    target.YouLikeIt =  _repository.YouLikeReservationAsync(invokingUserId, target.Id);
                }));
            return Ok(mapping);
        }       

        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpPost("{reservationId}/favorite", Name = "ModifyFavorites")]
        public async Task<IActionResult> ModifyFavorites(int reservationId)
        {
            var invokingUserId = int.Parse(User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier).Value);
            
            var reservation = await _repository.GetReservationAsync(reservationId);
            if (reservation == null) return BadRequest("Reservation doesn't exist!");
            
            var pic = await _repository.ModifyFavoritesAsync(invokingUserId, reservationId);
            if (pic == null) return BadRequest("Something went wrong when modifying favorites!.");

            var pictureDto = _mapper.Map<Reservation, ReservationDto>(pic,
                opt => opt.AfterMap((source, target) =>
                {
                    target.YouLikeIt = _repository.YouLikeReservationAsync(invokingUserId, target.Id);
                }));

            return Ok(pictureDto);
        }        
    }
}