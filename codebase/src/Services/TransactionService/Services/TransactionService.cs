using CustomerSpendingDashboard.Services.Transaction.Models;
using TransactionModel = CustomerSpendingDashboard.Services.Transaction.Models.Transaction;

namespace CustomerSpendingDashboard.Services.Transaction.Services;

public class TransactionService : ITransactionService
{
    private readonly List<TransactionModel> _transactions;
    private readonly Dictionary<string, List<SpendingGoal>> _goals;

    public TransactionService()
    {
        _transactions = GenerateTransactions();
        _goals = new Dictionary<string, List<SpendingGoal>>();
    }

    private List<TransactionModel> GenerateTransactions()
    {
        var transactions = new List<TransactionModel>();
        var random = new Random(42); // Seed for consistency
        var baseDate = new DateTime(2024, 9, 16, 14, 30, 0, DateTimeKind.Utc);

        // Category configurations from Problems file
        var categories = new[]
        {
            new { Name = "Groceries", Color = "#FF6B6B", Icon = "shopping-cart", Merchants = new[] { "Pick n Pay", "Woolworths", "Checkers", "Spar", "Food Lover's Market" } },
            new { Name = "Entertainment", Color = "#4ECDC4", Icon = "film", Merchants = new[] { "Netflix", "Showmax", "Spotify", "Steam", "PlayStation Store" } },
            new { Name = "Transportation", Color = "#45B7D1", Icon = "car", Merchants = new[] { "Uber", "Bolt", "Petrol Station", "MyCiti Bus", "Gautrain" } },
            new { Name = "Dining", Color = "#F7DC6F", Icon = "utensils", Merchants = new[] { "McDonald's", "KFC", "Nando's", "Spur", "Ocean Basket" } },
            new { Name = "Shopping", Color = "#BB8FCE", Icon = "shopping-bag", Merchants = new[] { "Takealot", "Amazon", "Mr Price", "Woolworths", "Foschini" } },
            new { Name = "Utilities", Color = "#85C1E9", Icon = "zap", Merchants = new[] { "Eskom", "City of Cape Town", "Vodacom", "MTN", "Telkom" } }
        };

        var paymentMethods = new[] { "Credit Card", "Debit Card", "Debit Order", "Bank Transfer", "Cash" };

        // Generate 1250 transactions over the past year
        for (int i = 0; i < 1250; i++)
        {
            var daysAgo = random.Next(0, 365);
            var transactionDate = baseDate.AddDays(-daysAgo).AddHours(-random.Next(0, 24)).AddMinutes(-random.Next(0, 60));
            
            var category = categories[random.Next(categories.Length)];
            var merchant = category.Merchants[random.Next(category.Merchants.Length)];
            
            // Amount ranges by category
            var amount = category.Name switch
            {
                "Groceries" => (decimal)(random.Next(50, 500) + random.NextDouble() * 100),
                "Entertainment" => (decimal)(random.Next(50, 300) + random.NextDouble() * 50),
                "Transportation" => (decimal)(random.Next(20, 200) + random.NextDouble() * 50),
                "Dining" => (decimal)(random.Next(30, 250) + random.NextDouble() * 50),
                "Shopping" => (decimal)(random.Next(100, 1000) + random.NextDouble() * 200),
                "Utilities" => (decimal)(random.Next(200, 800) + random.NextDouble() * 100),
                _ => (decimal)(random.Next(50, 300) + random.NextDouble() * 50)
            };

            transactions.Add(new TransactionModel
            {
                Id = $"txn_{100000 + i}",
                Date = transactionDate,
                Merchant = merchant,
                Category = category.Name,
                Amount = Math.Round(amount, 2),
                Description = $"{category.Name} - {merchant}",
                PaymentMethod = paymentMethods[random.Next(paymentMethods.Length)],
                Icon = category.Icon,
                CategoryColor = category.Color
            });
        }

        // Add the specific transactions from Problems file at the top
        transactions.Insert(0, new TransactionModel
        {
            Id = "txn_123456",
            Date = new DateTime(2024, 9, 16, 14, 30, 0, DateTimeKind.Utc),
            Merchant = "Pick n Pay",
            Category = "Groceries",
            Amount = 245.80m,
            Description = "Weekly groceries",
            PaymentMethod = "Credit Card",
            Icon = "shopping-cart",
            CategoryColor = "#FF6B6B"
        });

        transactions.Insert(1, new TransactionModel
        {
            Id = "txn_123457",
            Date = new DateTime(2024, 9, 15, 10, 15, 0, DateTimeKind.Utc),
            Merchant = "Netflix",
            Category = "Entertainment",
            Amount = 199.00m,
            Description = "Monthly subscription",
            PaymentMethod = "Debit Order",
            Icon = "film",
            CategoryColor = "#4ECDC4"
        });

        return transactions.OrderByDescending(t => t.Date).ToList();
    }

    public TransactionList GetTransactions(string customerId, int limit, int offset, string? category, DateTime? startDate, DateTime? endDate, string sortBy)
    {
        var filtered = _transactions.AsEnumerable();

        if (!string.IsNullOrEmpty(category))
        {
            filtered = filtered.Where(t => t.Category == category);
        }

        if (startDate.HasValue)
        {
            filtered = filtered.Where(t => t.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            filtered = filtered.Where(t => t.Date <= endDate.Value);
        }

        filtered = sortBy switch
        {
            "date_asc" => filtered.OrderBy(t => t.Date),
            "amount_desc" => filtered.OrderByDescending(t => t.Amount),
            "amount_asc" => filtered.OrderBy(t => t.Amount),
            _ => filtered.OrderByDescending(t => t.Date)
        };

        var total = filtered.Count();
        var transactions = filtered.Skip(offset).Take(limit).ToList();

        return new TransactionList
        {
            Transactions = transactions,
            Pagination = new PaginationInfo
            {
                Total = total,
                Limit = limit,
                Offset = offset,
                HasMore = offset + limit < total
            }
        };
    }

    public SpendingGoals GetSpendingGoals(string customerId)
    {
        // Return default goals if none exist for this customer
        if (!_goals.TryGetValue(customerId, out var customerGoals) || customerGoals.Count == 0)
        {
            return new SpendingGoals
            {
                Goals = new List<SpendingGoal>
                {
                    new()
                    {
                        Id = "goal_001",
                        Category = "Entertainment",
                        MonthlyBudget = 1000.00m,
                        CurrentSpent = 650.30m,
                        PercentageUsed = 65.03m,
                        DaysRemaining = 12,
                        Status = "on_track"
                    },
                    new()
                    {
                        Id = "goal_002",
                        Category = "Groceries",
                        MonthlyBudget = 1500.00m,
                        CurrentSpent = 1450.80m,
                        PercentageUsed = 96.72m,
                        DaysRemaining = 12,
                        Status = "warning"
                    }
                }
            };
        }

        return new SpendingGoals { Goals = customerGoals };
    }

    public TransactionModel CreateTransaction(string customerId, DateTime date, string merchant, string category, decimal amount, string description, string paymentMethod)
    {
        var categoryConfig = GetCategoryConfig(category);
        var transaction = new TransactionModel
        {
            Id = $"txn_{Guid.NewGuid():N}",
            Date = date,
            Merchant = merchant,
            Category = category,
            Amount = amount,
            Description = description,
            PaymentMethod = paymentMethod,
            Icon = categoryConfig.Icon,
            CategoryColor = categoryConfig.Color
        };

        _transactions.Insert(0, transaction);
        return transaction;
    }

    public TransactionModel UpdateTransaction(string transactionId, DateTime? date, string? merchant, string? category, decimal? amount, string? description, string? paymentMethod)
    {
        var transaction = _transactions.FirstOrDefault(t => t.Id == transactionId);
        if (transaction == null)
        {
            throw new System.Collections.Generic.KeyNotFoundException($"Transaction with ID {transactionId} not found");
        }

        if (date.HasValue)
        {
            transaction.Date = date.Value;
        }

        if (!string.IsNullOrWhiteSpace(merchant))
        {
            transaction.Merchant = merchant;
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            transaction.Category = category;
            var categoryConfig = GetCategoryConfig(category);
            transaction.Icon = categoryConfig.Icon;
            transaction.CategoryColor = categoryConfig.Color;
        }

        if (amount.HasValue)
        {
            transaction.Amount = amount.Value;
        }

        if (!string.IsNullOrWhiteSpace(description))
        {
            transaction.Description = description;
        }

        if (!string.IsNullOrWhiteSpace(paymentMethod))
        {
            transaction.PaymentMethod = paymentMethod;
        }

        return transaction;
    }

    public bool DeleteTransaction(string transactionId)
    {
        var transaction = _transactions.FirstOrDefault(t => t.Id == transactionId);
        if (transaction == null)
        {
            return false;
        }

        return _transactions.Remove(transaction);
    }

    public SpendingGoal CreateSpendingGoal(string customerId, string category, decimal monthlyBudget)
    {
        if (!_goals.TryGetValue(customerId, out var customerGoals))
        {
            customerGoals = new List<SpendingGoal>();
            _goals[customerId] = customerGoals;
        }

        // Check if goal already exists for this category
        var existingGoal = customerGoals.FirstOrDefault(g => g.Category == category);
        if (existingGoal != null)
        {
            throw new InvalidOperationException($"Spending goal for category '{category}' already exists for this customer");
        }

        var goal = new SpendingGoal
        {
            Id = $"goal_{Guid.NewGuid():N}",
            Category = category,
            MonthlyBudget = monthlyBudget,
            CurrentSpent = 0m,
            PercentageUsed = 0m,
            DaysRemaining = DateTime.DaysInMonth(DateTime.UtcNow.Year, DateTime.UtcNow.Month) - DateTime.UtcNow.Day,
            Status = "on_track"
        };

        customerGoals.Add(goal);
        return goal;
    }

    public SpendingGoal UpdateSpendingGoal(string goalId, decimal? monthlyBudget)
    {
        SpendingGoal? goal = null;
        foreach (var goals in _goals.Values)
        {
            goal = goals.FirstOrDefault(g => g.Id == goalId);
            if (goal != null) break;
        }

        if (goal == null)
        {
            throw new System.Collections.Generic.KeyNotFoundException($"Spending goal with ID {goalId} not found");
        }

        if (monthlyBudget.HasValue)
        {
            goal.MonthlyBudget = monthlyBudget.Value;
            goal.PercentageUsed = goal.CurrentSpent / goal.MonthlyBudget * 100;
            goal.Status = goal.PercentageUsed >= 100 ? "exceeded" : goal.PercentageUsed >= 80 ? "warning" : "on_track";
        }

        return goal;
    }

    public bool DeleteSpendingGoal(string goalId)
    {
        foreach (var goals in _goals.Values)
        {
            var goal = goals.FirstOrDefault(g => g.Id == goalId);
            if (goal != null)
            {
                return goals.Remove(goal);
            }
        }

        return false;
    }

    private (string Icon, string Color) GetCategoryConfig(string category)
    {
        return category switch
        {
            "Groceries" => ("shopping-cart", "#FF6B6B"),
            "Entertainment" => ("film", "#4ECDC4"),
            "Transportation" => ("car", "#45B7D1"),
            "Dining" => ("utensils", "#F7DC6F"),
            "Shopping" => ("shopping-bag", "#BB8FCE"),
            "Utilities" => ("zap", "#85C1E9"),
            _ => ("tag", "#95A5A6")
        };
    }

    public Filters GetFilters(string customerId)
    {
        return new Filters
        {
            Categories = new List<CategoryFilter>
            {
                new() { Name = "Groceries", Color = "#FF6B6B", Icon = "shopping-cart" },
                new() { Name = "Entertainment", Color = "#4ECDC4", Icon = "film" },
                new() { Name = "Transportation", Color = "#45B7D1", Icon = "car" },
                new() { Name = "Dining", Color = "#F7DC6F", Icon = "utensils" },
                new() { Name = "Shopping", Color = "#BB8FCE", Icon = "shopping-bag" },
                new() { Name = "Utilities", Color = "#85C1E9", Icon = "zap" }
            },
            DateRangePresets = new List<DateRangePreset>
            {
                new() { Label = "Last 7 days", Value = "7d" },
                new() { Label = "Last 30 days", Value = "30d" },
                new() { Label = "Last 90 days", Value = "90d" },
                new() { Label = "Last year", Value = "1y" }
            }
        };
    }
}

