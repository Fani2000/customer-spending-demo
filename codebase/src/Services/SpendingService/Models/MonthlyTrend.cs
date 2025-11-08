namespace CustomerSpendingDashboard.Services.Spending.Models;

public class MonthlyTrend
{
    public string Month { get; set; } = string.Empty;
    public decimal TotalSpent { get; set; }
    public int TransactionCount { get; set; }
    public decimal AverageTransaction { get; set; }
}

public class SpendingTrends
{
    public List<MonthlyTrend> Trends { get; set; } = new();
}

