using CustomerSpendingDashboard.Services.Transaction.Models;
using CustomerSpendingDashboard.Services.Transaction.Services;
using TransactionModel = CustomerSpendingDashboard.Services.Transaction.Models.Transaction;

namespace CustomerSpendingDashboard.Services.Transaction.GraphQL;

public class Mutation
{
    // Transaction mutations
    public TransactionModel CreateTransaction(
        string customerId,
        DateTime date,
        string merchant,
        string category,
        decimal amount,
        string description,
        string paymentMethod,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.CreateTransaction(customerId, date, merchant, category, amount, description, paymentMethod);
    }

    public TransactionModel UpdateTransaction(
        string transactionId,
        DateTime? date = null,
        string? merchant = null,
        string? category = null,
        decimal? amount = null,
        string? description = null,
        string? paymentMethod = null,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.UpdateTransaction(transactionId, date, merchant, category, amount, description, paymentMethod);
    }

    public bool DeleteTransaction(
        string transactionId,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.DeleteTransaction(transactionId);
    }

    // Spending Goal mutations
    public SpendingGoal CreateSpendingGoal(
        string customerId,
        string category,
        decimal monthlyBudget,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.CreateSpendingGoal(customerId, category, monthlyBudget);
    }

    public SpendingGoal UpdateSpendingGoal(
        string goalId,
        decimal? monthlyBudget = null,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.UpdateSpendingGoal(goalId, monthlyBudget);
    }

    public bool DeleteSpendingGoal(
        string goalId,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.DeleteSpendingGoal(goalId);
    }
}

