namespace CustomerSpendingDashboard.Services.Transaction.Models;

public class SpendingGoal
{
    public string Id { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal MonthlyBudget { get; set; }
    public decimal CurrentSpent { get; set; }
    public decimal PercentageUsed { get; set; }
    public int DaysRemaining { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class SpendingGoals
{
    public List<SpendingGoal> Goals { get; set; } = new();
}

