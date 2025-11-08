using CustomerSpendingDashboard.Services.Transaction.GraphQL;
using CustomerSpendingDashboard.Services.Transaction.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ITransactionService, TransactionService>();

builder.AddGraphQL()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
