namespace CustomerSpendingDashboard.Services.Spending.Models;

public class SpendingSummary
{
    public string Period { get; set; } = string.Empty;
    public decimal TotalSpent { get; set; }
    public int TransactionCount { get; set; }
    public decimal AverageTransaction { get; set; }
    public string TopCategory { get; set; } = string.Empty;
    public ComparedToPrevious ComparedToPrevious { get; set; } = new();
}

public class ComparedToPrevious
{
    public decimal SpentChange { get; set; }
    public decimal TransactionChange { get; set; }
}

