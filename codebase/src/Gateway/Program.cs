var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("Fusion");

// Configure CORS to allow frontend requests from configuration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000", "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services
    .AddFusionGatewayServer()
    .ConfigureFromFile("gateway.fgp")
    .ModifyFusionOptions(x => x.AllowQueryPlan = true);

var app = builder.Build();

// Enable CORS before other middleware
app.UseCors();

// Enable WebSockets for GraphQL subscriptions
app.UseWebSockets();

app.MapGraphQL();

app.Run();