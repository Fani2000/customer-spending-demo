using CustomerSpendingDashboard.Services.Spending.GraphQL;
using CustomerSpendingDashboard.Services.Spending.Services;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ISpendingService, SpendingService>();

builder.AddGraphQL()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

// Expose Prometheus metrics endpoint
app.UseMetricServer(); // Exposes /metrics endpoint
app.UseHttpMetrics();  // Tracks HTTP metrics

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
