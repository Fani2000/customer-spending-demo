using CustomerSpendingDashboard.Services.Customer.GraphQL;
using CustomerSpendingDashboard.Services.Customer.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ICustomerService, CustomerService>();

builder.AddGraphQL()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddTypeExtension<CustomerProfileExtensions>();

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
