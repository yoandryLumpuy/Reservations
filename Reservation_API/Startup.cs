using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Reservation_API.Core;
using Reservation_API.Mapping;
using Reservation_API.Persistence;
using Reservation_API.Core.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Reservation_API.Extensions;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;

namespace Reservation_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddDbContext<ReservationDbContext>(dbContextOptionsBuilder =>
            {
                dbContextOptionsBuilder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                    // .ReplaceService<IQueryTranslationPostprocessorFactory, SqlServer2008QueryTranslationPostprocessorFactory>();
            });

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IRepository, Repository>();

            var mapperConfiguration = new MapperConfiguration(options => { options.AddProfile(new MappingProfile()); });
            var mapper = mapperConfiguration.CreateMapper();
            services.AddSingleton(mapper);

            var identityBuilder = services.AddIdentityCore<User>(identityOptions =>
            {
                identityOptions.Password = new PasswordOptions()
                {
                    RequireDigit = true,
                    RequireNonAlphanumeric = true,
                    RequiredLength = 8,
                    RequireUppercase = true
                };
            });
            identityBuilder = new IdentityBuilder(identityBuilder.UserType, typeof(Role), identityBuilder.Services);
            identityBuilder.AddEntityFrameworkStores<ReservationDbContext>();
            identityBuilder.AddRoleValidator<RoleValidator<Role>>();
            identityBuilder.AddRoleManager<RoleManager<Role>>();
            identityBuilder.AddUserManager<UserManager<User>>();
            identityBuilder.AddSignInManager<SignInManager<User>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = 
                            new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:SecurityKey").Value))
                    };
                });   
           
            services.AddMvc(mvcOptions =>
            {
                var authorizationPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                mvcOptions.Filters.Add(new AuthorizeFilter(authorizationPolicy));
            });            

            //add policies
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Constants.PolicyNameAdmin, policyBuilder => { policyBuilder.RequireRole(Constants.RoleNameAdmin); });
            });

            // services.AddSwaggerGen(swagger =>  
            // {  
            //     //This is to generate the Default UI of Swagger Documentation    
            //     swagger.SwaggerDoc("v1", new OpenApiInfo  
            //     {  
            //         Version = "v1",  
            //         Title = "ASP.NET 5 Web API",  
            //         Description = "Authentication and Authorization in ASP.NET 5 with JWT and Swagger"  
            //     });  
            //     // To Enable authorization using Swagger (JWT)    
            //     swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()  
            //     {  
            //         Name = "Authorization",  
            //         Type = SecuritySchemeType.ApiKey,  
            //         Scheme = "Bearer",  
            //         BearerFormat = "JWT",  
            //         In = ParameterLocation.Header,  
            //         Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",  
            //     });  
            //     swagger.AddSecurityRequirement(new OpenApiSecurityRequirement  
            //     {  
            //         {  
            //               new OpenApiSecurityScheme  
            //                 {  
            //                     Reference = new OpenApiReference  
            //                     {  
            //                         Type = ReferenceType.SecurityScheme,  
            //                         Id = "Bearer"  
            //                     }  
            //                 },  
            //                 new string[] {}  
  
            //         }  
            //     });  
            // });              
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();                
            }

            // app.UseSwagger();  
            // app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ASP.NET 5 Web API v1"));    

            //app.UseHttpsRedirection();
            app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseRouting();  

            app.UseAuthentication();          
            app.UseAuthorization();

            app.UseDefaultFiles();
            app.UseStaticFiles();            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
