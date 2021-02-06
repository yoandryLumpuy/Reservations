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

namespace Galeria_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration config, UserManager<User> userManager,
                              RoleManager<Role> roleManager,
                              SignInManager<User> signInManager, IMapper mapper)
        {
            _config = config;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByNameAsync(userForLoginDto.UserName);

            if (user == null)
                return BadRequest("The user doesn't exist !");

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if (!signInResult.Succeeded) return Unauthorized("Wrong password!. Try again.");

            var userToListDto = _mapper.Map<UserForListDto>(user);
            return Ok(new
            {
                Token = await GenerateTokenAsync(user),
                User = userToListDto
            });

        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody]UserForLoginDto userForLoginDto)
        {
            var userApp = _mapper.Map<User>(userForLoginDto);
            var identityResult = await _userManager.CreateAsync(userApp, userForLoginDto.Password);

            if (identityResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(userApp, Constants.RoleNameAdmin);
                var userToReturn = _mapper.Map<UserForListDto>(userApp);
                return Ok(userToReturn);
            }

            return BadRequest(identityResult.Errors);
        }

        public async Task<string> GenerateTokenAsync(User user)
        {
            var userRoles =  await _userManager.GetRolesAsync(user);
            var securityTokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName) 
                }.Concat(userRoles.Select(role => new Claim(ClaimTypes.Role, role)))),

                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    key:new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:SecurityKey").Value)), 
                    algorithm: SecurityAlgorithms.HmacSha512Signature)

            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(securityTokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}