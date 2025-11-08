using CustomerSpendingDashboard.Services.Transaction.Models;
using TransactionModel = CustomerSpendingDashboard.Services.Transaction.Models.Transaction;

namespace CustomerSpendingDashboard.Services.Transaction.Services;

public interface ITransactionService
{
    TransactionList GetTransactions(string customerId, int limit, int offset, string? category, DateTime? startDate, DateTime? endDate, string sortBy);
    SpendingGoals GetSpendingGoals(string customerId);
    Filters GetFilters(string customerId);
    
    // Transaction mutations
    TransactionModel CreateTransaction(string customerId, DateTime date, string merchant, string category, decimal amount, string description, string paymentMethod);
    TransactionModel UpdateTransaction(string transactionId, DateTime? date, string? merchant, string? category, decimal? amount, string? description, string? paymentMethod);
    bool DeleteTransaction(string transactionId);
    
    // Spending Goal mutations
    SpendingGoal CreateSpendingGoal(string customerId, string category, decimal monthlyBudget);
    SpendingGoal UpdateSpendingGoal(string goalId, decimal? monthlyBudget);
    bool DeleteSpendingGoal(string goalId);
}

