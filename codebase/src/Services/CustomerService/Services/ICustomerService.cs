using CustomerSpendingDashboard.Services.Customer.Models;

namespace CustomerSpendingDashboard.Services.Customer.Services;

public interface ICustomerService
{
    CustomerProfile GetCustomerProfile(string customerId);
    CustomerProfile CreateCustomer(string name, string email, string accountType, string currency);
    CustomerProfile UpdateCustomer(string customerId, string? name, string? email, string? accountType);
    bool DeleteCustomer(string customerId);
}

