using CustomerSpendingDashboard.Services.Spending.GraphQL;
using CustomerSpendingDashboard.Services.Spending.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ISpendingService, SpendingService>();

builder.AddGraphQL()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
