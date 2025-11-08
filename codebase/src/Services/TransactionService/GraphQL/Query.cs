using CustomerSpendingDashboard.Services.Transaction.Models;
using CustomerSpendingDashboard.Services.Transaction.Services;

namespace CustomerSpendingDashboard.Services.Transaction.GraphQL;

public class Query
{
    public TransactionList GetTransactions(
        string customerId,
        int limit = 20,
        int offset = 0,
        string? category = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        string sortBy = "date_desc",
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.GetTransactions(customerId, limit, offset, category, startDate, endDate, sortBy);
    }

    public SpendingGoals GetSpendingGoals(
        string customerId,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.GetSpendingGoals(customerId);
    }

    public Filters GetFilters(
        string customerId,
        [Service] ITransactionService transactionService = null!)
    {
        return transactionService.GetFilters(customerId);
    }
}

