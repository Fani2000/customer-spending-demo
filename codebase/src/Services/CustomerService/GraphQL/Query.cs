using CustomerSpendingDashboard.Services.Customer.Models;
using CustomerSpendingDashboard.Services.Customer.Services;

namespace CustomerSpendingDashboard.Services.Customer.GraphQL;

public class Query
{
    public CustomerProfile GetCustomerProfile(string customerId, [Service] ICustomerService customerService)
    {
        return customerService.GetCustomerProfile(customerId);
    }
}

