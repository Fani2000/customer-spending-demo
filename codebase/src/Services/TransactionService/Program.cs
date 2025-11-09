using CustomerSpendingDashboard.Services.Transaction.GraphQL;
using CustomerSpendingDashboard.Services.Transaction.Services;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ITransactionService, TransactionService>();

builder.AddGraphQL()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

// Expose Prometheus metrics endpoint
app.UseMetricServer(); // Exposes /metrics endpoint
app.UseHttpMetrics();  // Tracks HTTP metrics

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
