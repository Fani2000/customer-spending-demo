using CustomerSpendingDashboard.Services.Customer.GraphQL;
using CustomerSpendingDashboard.Services.Customer.Services;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ICustomerService, CustomerService>();

builder.AddGraphQL()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddTypeExtension<CustomerProfileExtensions>();

var app = builder.Build();

// Expose Prometheus metrics endpoint
app.UseMetricServer(); // Exposes /metrics endpoint
app.UseHttpMetrics();  // Tracks HTTP metrics

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
