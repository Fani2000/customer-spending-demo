var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .AddDatabase("customerdb");

// Customer Service - GraphQL subgraph for customer profiles
var customerService = builder.AddProject<Projects.CustomerSpendingDashboard_Services_Customer>("CustomerService")
    .WaitFor(postgres)
    .WithReference(postgres)
    .WithEnvironment("ASPIRE_RESOURCE_DISPLAY_NAME", "Customer Service")
    .WithEnvironment("ASPIRE_ENDPOINT_HIDE", "true");

// Spending Service - GraphQL subgraph for spending analytics
var spendingService = builder.AddProject<Projects.CustomerSpendingDashboard_Services_Spending>("SpendingService")
    .WaitFor(postgres)
    .WithReference(postgres)
    .WithEnvironment("ASPIRE_RESOURCE_DISPLAY_NAME", "Spending Service")
    .WithEnvironment("ASPIRE_ENDPOINT_HIDE", "true");

// Transaction Service - GraphQL subgraph for transactions and goals
var transactionService = builder.AddProject<Projects.CustomerSpendingDashboard_Services_Transaction>("TransactionService")
    .WaitFor(postgres)
    .WithReference(postgres)
    .WithEnvironment("ASPIRE_RESOURCE_DISPLAY_NAME", "Transaction Service")
    .WithEnvironment("ASPIRE_ENDPOINT_HIDE", "true");

// GraphQL Gateway - Aggregates all services using Fusion with Aspire integration
builder
    .AddFusionGateway<Projects.Gateway>("GraphQLGateway")
    .WithSubgraph(customerService)
    .WithSubgraph(spendingService)
    .WithSubgraph(transactionService);

// Important: Use 'Compose' before 'Run' to enable build-time composition
builder.Build().Compose().Run();
