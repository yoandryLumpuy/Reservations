using System.Linq;
using AutoMapper;
using Reservation_API.Core.Model;
using Reservation_API.DataTransferObjects;

namespace Reservation_API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //from Dtos to Domain Model 
            CreateMap<UserForListDto, User>();

            //from Domain Model to Dtos
            CreateMap<Contact, ContactDto>();
            CreateMap<ContactType, ContactTypeDto>();            

            CreateMap<User, UserForListDto>()
                .ForMember(userDto => userDto.Roles, 
                    memberOptions => memberOptions.MapFrom(user => user.UserRoles.Select(userRole => userRole.Role.Name).ToArray()));            
            CreateMap<Reservation, ReservationDto>()                                
                .ForMember(dto => dto.YouLikeIt, opt => opt.Ignore());
            CreateMap(typeof(PaginationResult<>), typeof(PaginationResult<>));            
        }
    }
}
