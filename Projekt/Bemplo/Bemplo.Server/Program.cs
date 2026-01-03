
using Bemplo.Server.IRepositories;
using Bemplo.Server.IServices;
using Bemplo.Server.Repositories;
using Bemplo.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace Bemplo.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(setup =>
            {
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

                setup.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });
            });

            // Configure JWT settings
            var jwtSettings = new JwtSettings();
            builder.Configuration.GetSection("JwtSettings").Bind(jwtSettings);
            builder.Services.AddSingleton(jwtSettings);

            // Configure JWT authentization
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
                        ClockSkew = TimeSpan.Zero
                    };

                });

            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IAccountRep, AccountRep>();
            builder.Services.AddScoped<IContactRep, ContactRep>();
            builder.Services.AddScoped<IExperienceRep, ExperienceRep>();
            builder.Services.AddScoped<IOffer_Preference_RequestRep, Offer_Preference_RequestRep>();
            builder.Services.AddScoped<IReviewRep, ReviewRep>();
            builder.Services.AddScoped<IChatRep, ChatRep>();
            builder.Services.AddScoped<IChatConnectionRep,  ChatConnectionRep>();
            builder.Services.AddScoped<IPhotoRep, PhotoRep>();

            builder.Services.AddScoped<IAccountSer, AccountSer>();
            builder.Services.AddScoped<IContactSer, ContactSer>();
            builder.Services.AddScoped<IOffer_Preference_RequestSer, Offer_Preference_RequestSer>();
            builder.Services.AddScoped<IProfileSer, ProfileSer>();
            builder.Services.AddScoped<IChatSer, ChatSer>();

            // Configure Cors
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                        .WithOrigins("http://127.0.0.1:8000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            builder.Services.AddAuthorization();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
