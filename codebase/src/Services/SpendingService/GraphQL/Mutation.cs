using CustomerSpendingDashboard.Services.Spending.Models;
using CustomerSpendingDashboard.Services.Spending.Services;

namespace CustomerSpendingDashboard.Services.Spending.GraphQL;

public class Mutation
{
    // Spending-related mutations - update category metadata for spending analytics
    public bool UpdateSpendingCategory(
        string customerId,
        string categoryName,
        string? newName = null,
        string? color = null,
        string? icon = null,
        [Service] ISpendingService spendingService = null!)
    {
        // Update category metadata for spending analytics
        return spendingService.UpdateSpendingCategory(customerId, categoryName, newName, color, icon);
    }
}

