using CustomerSpendingDashboard.Services.Customer.Models;

namespace CustomerSpendingDashboard.Services.Customer.Services;

public class CustomerService : ICustomerService
{
    private readonly Dictionary<string, CustomerProfile> _customers = new()
    {
        {
            "12345",
            new CustomerProfile
            {
                CustomerId = "12345",
                Name = "John Doe",
                Email = "john.doe@email.com",
                JoinDate = new DateTime(2023, 1, 15),
                AccountType = "premium",
                TotalSpent = 15420.50m,
                Currency = "ZAR"
            }
        }
    };

    public CustomerProfile GetCustomerProfile(string customerId)
    {
        return _customers.TryGetValue(customerId, out var customer)
            ? customer
            : throw new System.Collections.Generic.KeyNotFoundException($"Customer with ID {customerId} not found");
    }

    public CustomerProfile CreateCustomer(string name, string email, string accountType, string currency)
    {
        var customerId = Guid.NewGuid().ToString();
        var customer = new CustomerProfile
        {
            CustomerId = customerId,
            Name = name,
            Email = email,
            JoinDate = DateTime.UtcNow,
            AccountType = accountType,
            TotalSpent = 0m,
            Currency = currency
        };

        _customers[customerId] = customer;
        return customer;
    }

    public CustomerProfile UpdateCustomer(string customerId, string? name, string? email, string? accountType)
    {
        if (!_customers.TryGetValue(customerId, out var customer))
        {
            throw new System.Collections.Generic.KeyNotFoundException($"Customer with ID {customerId} not found");
        }

        if (!string.IsNullOrWhiteSpace(name))
        {
            customer.Name = name;
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            customer.Email = email;
        }

        if (!string.IsNullOrWhiteSpace(accountType))
        {
            customer.AccountType = accountType;
        }

        return customer;
    }

    public bool DeleteCustomer(string customerId)
    {
        return _customers.Remove(customerId);
    }
}

