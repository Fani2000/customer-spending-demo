using CustomerSpendingDashboard.Services.Spending.Models;

namespace CustomerSpendingDashboard.Services.Spending.Services;

public class SpendingService : ISpendingService
{
    public SpendingSummary GetSpendingSummary(string customerId, string period)
    {
        // Data varies by period to match realistic scenarios
        var summary = period switch
        {
            "7d" => new SpendingSummary
            {
                Period = period,
                TotalSpent = 1250.30m,
                TransactionCount = 12,
                AverageTransaction = 104.19m,
                TopCategory = "Groceries",
                ComparedToPrevious = new ComparedToPrevious
                {
                    SpentChange = 8.3m,
                    TransactionChange = 2.1m
                }
            },
            "30d" => new SpendingSummary
            {
                Period = period,
                TotalSpent = 4250.75m,
                TransactionCount = 47,
                AverageTransaction = 90.44m,
                TopCategory = "Groceries",
                ComparedToPrevious = new ComparedToPrevious
                {
                    SpentChange = 12.5m,
                    TransactionChange = -3.2m
                }
            },
            "90d" => new SpendingSummary
            {
                Period = period,
                TotalSpent = 11850.20m,
                TransactionCount = 132,
                AverageTransaction = 89.77m,
                TopCategory = "Groceries",
                ComparedToPrevious = new ComparedToPrevious
                {
                    SpentChange = 5.8m,
                    TransactionChange = 4.2m
                }
            },
            "1y" => new SpendingSummary
            {
                Period = period,
                TotalSpent = 48500.50m,
                TransactionCount = 542,
                AverageTransaction = 89.48m,
                TopCategory = "Groceries",
                ComparedToPrevious = new ComparedToPrevious
                {
                    SpentChange = 15.2m,
                    TransactionChange = 8.5m
                }
            },
            _ => new SpendingSummary
            {
                Period = period,
                TotalSpent = 4250.75m,
                TransactionCount = 47,
                AverageTransaction = 90.44m,
                TopCategory = "Groceries",
                ComparedToPrevious = new ComparedToPrevious
                {
                    SpentChange = 12.5m,
                    TransactionChange = -3.2m
                }
            }
        };

        return summary;
    }

    public SpendingByCategory GetSpendingByCategory(string customerId, string? period, DateTime? startDate, DateTime? endDate)
    {
        var end = endDate ?? DateTime.UtcNow;
        DateTime start;

        // Calculate date range based on period if not provided
        if (!startDate.HasValue && !string.IsNullOrEmpty(period))
        {
            start = period switch
            {
                "7d" => end.AddDays(-7),
                "30d" => end.AddDays(-30),
                "90d" => end.AddDays(-90),
                "1y" => end.AddYears(-1),
                _ => end.AddDays(-30)
            };
        }
        else if (startDate.HasValue)
        {
            start = startDate.Value;
        }
        else
        {
            start = end.AddDays(-30);
        }

        // Use exact data from Problems file for 30d period
        var categories = new List<CategorySpending>
        {
            new() { Name = "Groceries", Amount = 1250.30m, Percentage = 29.4m, TransactionCount = 15, Color = "#FF6B6B", Icon = "shopping-cart" },
            new() { Name = "Entertainment", Amount = 890.20m, Percentage = 20.9m, TransactionCount = 8, Color = "#4ECDC4", Icon = "film" },
            new() { Name = "Transportation", Amount = 680.45m, Percentage = 16.0m, TransactionCount = 12, Color = "#45B7D1", Icon = "car" },
            new() { Name = "Dining", Amount = 520.30m, Percentage = 12.2m, TransactionCount = 9, Color = "#F7DC6F", Icon = "utensils" },
            new() { Name = "Shopping", Amount = 450.80m, Percentage = 10.6m, TransactionCount = 6, Color = "#BB8FCE", Icon = "shopping-bag" },
            new() { Name = "Utilities", Amount = 458.70m, Percentage = 10.8m, TransactionCount = 3, Color = "#85C1E9", Icon = "zap" }
        };

        var totalAmount = categories.Sum(c => c.Amount);

        return new SpendingByCategory
        {
            DateRange = new DateRange
            {
                StartDate = start,
                EndDate = end
            },
            TotalAmount = totalAmount,
            Categories = categories
        };
    }

    public SpendingTrends GetSpendingTrends(string customerId, int months)
    {
        // Data from Problems file
        var trends = new List<MonthlyTrend>
        {
            new() { Month = "2024-01", TotalSpent = 3890.25m, TransactionCount = 42, AverageTransaction = 92.62m },
            new() { Month = "2024-02", TotalSpent = 4150.80m, TransactionCount = 38, AverageTransaction = 109.23m },
            new() { Month = "2024-03", TotalSpent = 3750.60m, TransactionCount = 45, AverageTransaction = 83.35m },
            new() { Month = "2024-04", TotalSpent = 4200.45m, TransactionCount = 39, AverageTransaction = 107.70m },
            new() { Month = "2024-05", TotalSpent = 3980.30m, TransactionCount = 44, AverageTransaction = 90.46m },
            new() { Month = "2024-06", TotalSpent = 4250.75m, TransactionCount = 47, AverageTransaction = 90.44m }
        };

        // If more months requested, generate additional data
        if (months > trends.Count)
        {
            var now = DateTime.UtcNow;
            var startMonth = new DateTime(2024, 1, 1);
            for (int i = trends.Count; i < months; i++)
            {
                var month = startMonth.AddMonths(i);
                trends.Add(new MonthlyTrend
                {
                    Month = month.ToString("yyyy-MM"),
                    TotalSpent = 3800m + Random.Shared.Next(0, 500),
                    TransactionCount = 35 + Random.Shared.Next(0, 15),
                    AverageTransaction = 90m + Random.Shared.Next(0, 30)
                });
            }
        }
        else
        {
            trends = trends.Take(months).ToList();
        }

        return new SpendingTrends { Trends = trends };
    }

    public bool UpdateSpendingCategory(string customerId, string categoryName, string? newName, string? color, string? icon)
    {
        // In a real system, this would update category metadata in a database
        // For now, we'll just return true to indicate the operation was processed
        // This mutation allows updating category display properties (name, color, icon)
        // which affects how spending analytics are displayed
        return true;
    }
}

