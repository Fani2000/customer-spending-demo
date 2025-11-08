using CustomerSpendingDashboard.Services.Spending.Models;

namespace CustomerSpendingDashboard.Services.Spending.Services;

public interface ISpendingService
{
    SpendingSummary GetSpendingSummary(string customerId, string period);
    SpendingByCategory GetSpendingByCategory(string customerId, string? period, DateTime? startDate, DateTime? endDate);
    SpendingTrends GetSpendingTrends(string customerId, int months);
    
    // Spending-related mutations
    bool UpdateSpendingCategory(string customerId, string categoryName, string? newName, string? color, string? icon);
}

