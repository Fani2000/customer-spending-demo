using Prometheus;

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

// Get subgraph URLs from environment or configuration
// Default to Docker service names for containerized environments
var customerServiceUrl = builder.Configuration["Subgraphs:CustomerService"] 
    ?? Environment.GetEnvironmentVariable("CUSTOMER_SERVICE_URL") 
    ?? "http://customer-service:8080/graphql";
    
var spendingServiceUrl = builder.Configuration["Subgraphs:SpendingService"] 
    ?? Environment.GetEnvironmentVariable("SPENDING_SERVICE_URL") 
    ?? "http://spending-service:8080/graphql";
    
var transactionServiceUrl = builder.Configuration["Subgraphs:TransactionService"] 
    ?? Environment.GetEnvironmentVariable("TRANSACTION_SERVICE_URL") 
    ?? "http://transaction-service:8080/graphql";

// Check if we should use file-based configuration (for local development)
var useFileConfig = builder.Configuration.GetValue<bool>("Gateway:UseFileConfig", false);
var gatewayFile = builder.Configuration["Gateway:ConfigFile"] ?? "gateway.fgp";

// For Docker, try to use a Docker-specific gateway file first
var dockerGatewayFile = "gateway.docker.fgp";
var actualGatewayFile = File.Exists(dockerGatewayFile) ? dockerGatewayFile : gatewayFile;

var fusionBuilder = builder.Services.AddFusionGatewayServer();

if (useFileConfig && File.Exists(actualGatewayFile))
{
    // Use file-based configuration
    fusionBuilder.ConfigureFromFile(actualGatewayFile);
}
else if (File.Exists(actualGatewayFile))
{
    // Auto-detect: use Docker-specific file if available, otherwise use default
    fusionBuilder.ConfigureFromFile(actualGatewayFile);
}
else
{
    // Fallback: try to use the default gateway.fgp file
    // If it doesn't exist, the gateway will fail to start
    // This is expected - the .fgp file should be generated or provided
    if (File.Exists(gatewayFile))
    {
        fusionBuilder.ConfigureFromFile(gatewayFile);
    }
    else
    {
        throw new InvalidOperationException(
            $"Gateway configuration file not found. Expected '{gatewayFile}' or '{dockerGatewayFile}'. " +
            "Please ensure the gateway.fgp file exists or set Gateway:UseFileConfig=false to use code-based configuration.");
    }
}

fusionBuilder.ModifyFusionOptions(x => x.AllowQueryPlan = true);

var app = builder.Build();

// Expose Prometheus metrics endpoint (before other middleware for accurate metrics)
app.UseMetricServer(); // Exposes /metrics endpoint
app.UseHttpMetrics();  // Tracks HTTP metrics

// Enable CORS before other middleware
app.UseCors();

// Enable WebSockets for GraphQL subscriptions
app.UseWebSockets();

app.MapGraphQL();

app.Run();