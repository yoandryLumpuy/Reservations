using AutoMapper;
using Reservation_API.Core.Model;
using Reservation_API.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Reservation_API.Extensions;
using Reservation_API.Persistence;
using Reservation_API.Core;
using System.Collections.Generic;

namespace Reservation_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly IMapper _mapper;

        public ContactsController(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpPost]        
        [Authorize(Policy = Constants.PolicyNameAdmin)]
        public async Task<IActionResult> PostContact([FromBody] ContactForModificationsDto contactForModificationsDto)

        {
            var invokingUserId = int.Parse(User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier).Value); 
            
            var contact = await _repository.CreateOrUpdateContactByNameAsync(contactForModificationsDto);
                        
            var contactDto = _mapper.Map<Contact, ContactDto>(contact);

            return Ok(contactDto);
        }
        
        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpGet(Name = "GetContacts")]
        public async Task<IActionResult> GetContacts([FromQuery]QueryObject queryObject)
        {
            var invokingUserId = int.Parse(User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier).Value);
            var contactsFromDbContext =  await _repository.GetContactsAsync(queryObject);
            var mapping = _mapper.Map<PaginationResult<Contact>, PaginationResult<ContactDto>>(contactsFromDbContext);
            return Ok(mapping);
        } 
        
        [HttpGet("{contactId}", Name = "GetContact")]
        [Authorize(Policy = Constants.PolicyNameAdmin)]
        public async Task<IActionResult> GetContact(int contactId)
        {
            var invokingUserId = int.Parse(User.FindFirst(claim => claim.Type == ClaimTypes.NameIdentifier).Value);
            var contactFromDbContext =  await _repository.GetContactAsync(contactId);
            if (contactFromDbContext == null) return BadRequest($"The Contact #{contactId} doesn't exist!");

            var mapping = _mapper.Map<Contact, ContactDto>(contactFromDbContext);
            return Ok(mapping);
        }  

        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpGet("all", Name = "GetAllContacts")]
        public async Task<IActionResult> GetAllContacts()
        {
            var contactsFromDbContext =  await _repository.GetAllContactsAsync();
            var mapping = _mapper.Map<List<Contact>, List<ContactDto>>(contactsFromDbContext);
            return Ok(mapping);
        }  

        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpGet("contacttypes", Name = "GetAllContactTypes")]
        public async Task<IActionResult> GetAllContactTypes()
        {
            var contactTypesFromDbContext =  await _repository.GetAllContactTypesAsync();
            var mapping = _mapper.Map<List<ContactType>, List<ContactTypeDto>>(contactTypesFromDbContext);
            return Ok(mapping);
        }

        [Authorize(Policy = Constants.PolicyNameAdmin)]
        [HttpDelete("{contactId}", Name = "DeleteContact")]
        public async Task<IActionResult> DeleteContact(int contactId)
        {
            var successfullyDeleted =  await _repository.DeleteContactAsync(contactId);
            if (!successfullyDeleted) return BadRequest("Contact not found!");
            
            return Ok(contactId);
        }
    }
}