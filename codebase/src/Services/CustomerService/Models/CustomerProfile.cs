namespace CustomerSpendingDashboard.Services.Customer.Models;

public class CustomerProfile
{
    public string CustomerId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime JoinDate { get; set; }
    public string AccountType { get; set; } = string.Empty;
    public decimal TotalSpent { get; set; }
    public string Currency { get; set; } = "ZAR";
}

