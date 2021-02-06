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
            services.AddDbContext<ReservationDbContext>(dbContextOptionsBuilder =>
            {
                dbContextOptionsBuilder.UseLazyLoadingProxies(); 
                dbContextOptionsBuilder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
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

            // services.AddMvc().AddJsonOptions(o => 
            // {
            //     o.JsonSerializerOptions..ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            // });;

            // services.AddAuthorization(options =>
            // {
            //     options.AddPolicy(Constants.PolicyNameAdmin, policyBuilder => { policyBuilder.RequireRole(Constants.RoleNameAdmin); });
            //     options.AddPolicy(Constants.PolicyNameOnlyWatch, policyBuilder => { policyBuilder.RequireRole(Constants.RoleNameAdmin, Constants.RoleNameNormalUser, Constants.RoleNamePainter); });
            //     options.AddPolicy(Constants.PolicyNameUploadingDownloading, policyBuilder => { policyBuilder.RequireRole(Constants.RoleNameAdmin, Constants.RoleNamePainter); });
            // });

            services.AddControllers(mvcOptions =>
                {
                    var authorizationPolicy = 
                        new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();

                    mvcOptions.Filters.Add(new AuthorizeFilter(authorizationPolicy));
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Reservation_API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Reservation_API v1"));
            }

            //app.UseHttpsRedirection();
            app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseRouting();

            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}