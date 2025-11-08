using CustomerSpendingDashboard.Services.Customer.Models;
using CustomerSpendingDashboard.Services.Customer.Services;

namespace CustomerSpendingDashboard.Services.Customer.GraphQL;

public class Mutation
{
    public CustomerProfile CreateCustomer(
        string name,
        string email,
        string accountType = "standard",
        string currency = "ZAR",
        [Service] ICustomerService customerService = null!)
    {
        return customerService.CreateCustomer(name, email, accountType, currency);
    }

    public CustomerProfile UpdateCustomer(
        string customerId,
        string? name = null,
        string? email = null,
        string? accountType = null,
        [Service] ICustomerService customerService = null!)
    {
        return customerService.UpdateCustomer(customerId, name, email, accountType);
    }

    public bool DeleteCustomer(
        string customerId,
        [Service] ICustomerService customerService = null!)
    {
        return customerService.DeleteCustomer(customerId);
    }
}
