using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using CRMSocial.Models;
using Microsoft.AspNetCore.OData;
using Microsoft.OData.ModelBuilder;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using Microsoft.OData.Edm;
using System.Text.Json;
using Microsoft.Extensions.FileProviders;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using Microsoft.Extensions.Options;
using CRMSocial.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var modelBuilder = new ODataConventionModelBuilder();
//retrieve FraseSegreta from appsettings

var secret = builder.Configuration["FraseToken"];

// Aggiungi servizi per l'autenticazione JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            // Configura altre propriet� se necessario, come ValidateLifetime, ClockSkew, etc.
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers().AddOData(options =>
{
    options.AddRouteComponents("odata", GetEdmModel())
           .Select()   // Abilita $select
           .Filter()   // Abilita $filter
           .OrderBy()  // Abilita $orderby
           .Expand()   // Abilita $expand
           .Count()    // Abilita $count
           .SetMaxTop(10000); // Imposta un massimo per $top per prevenire richieste eccessivamente grandi
}).AddJsonOptions(options =>
{
    // Configure JSON to use camelCase property names
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddSwaggerGen(c =>
{
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

builder.Services.AddODataQueryFilter();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<CRMSocialContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Configura la cultura italiana
var supportedCultures = new[] { new CultureInfo("it-IT") };
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new RequestCulture("it-IT");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(); // Per la cartella wwwroot di default

// Aggiungi questo per la tua cartella www personalizzata
app.UseStaticFiles();

// Middleware per servire file statici dalla cartella www personalizzata
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "wwwroot/img")),
    RequestPath = "/img"
});


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseODataRouteDebug();

app.MapControllers();

app.MapFallbackToFile("/index.html");

var locOptions = app.Services.GetService<IOptions<RequestLocalizationOptions>>();
app.UseRequestLocalization(locOptions.Value);

app.Run();

IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EntitySet<Contatti>("Contatti");
    builder.EntitySet<ContattiAttivita>("ContattiAttivita");
    builder.EnableLowerCamelCase();
    // Aggiungi altre entit� all'EDM qui se necessario
    return builder.GetEdmModel();
}

