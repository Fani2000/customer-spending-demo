namespace CustomerSpendingDashboard.Services.Spending.Models;

public class CategorySpending
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
    public int TransactionCount { get; set; }
    public string Color { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

public class SpendingByCategory
{
    public DateRange DateRange { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public List<CategorySpending> Categories { get; set; } = new();
}

public class DateRange
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

