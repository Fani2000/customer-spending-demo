using CustomerSpendingDashboard.Services.Spending.Models;
using CustomerSpendingDashboard.Services.Spending.Services;

namespace CustomerSpendingDashboard.Services.Spending.GraphQL;

public class Query
{
    public SpendingSummary GetSpendingSummary(
        string customerId,
        string period = "30d",
        [Service] ISpendingService spendingService = null!)
    {
        return spendingService.GetSpendingSummary(customerId, period);
    }

    public SpendingByCategory GetSpendingByCategory(
        string customerId,
        string? period = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        [Service] ISpendingService spendingService = null!)
    {
        return spendingService.GetSpendingByCategory(customerId, period, startDate, endDate);
    }

    public SpendingTrends GetSpendingTrends(
        string customerId,
        int months = 12,
        [Service] ISpendingService spendingService = null!)
    {
        return spendingService.GetSpendingTrends(customerId, months);
    }
}

