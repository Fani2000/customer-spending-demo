namespace CustomerSpendingDashboard.Services.Transaction.Models;

public class Transaction
{
    public string Id { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Merchant { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string CategoryColor { get; set; } = string.Empty;
}

public class TransactionList
{
    public List<Transaction> Transactions { get; set; } = new();
    public PaginationInfo Pagination { get; set; } = new();
}

public class PaginationInfo
{
    public int Total { get; set; }
    public int Limit { get; set; }
    public int Offset { get; set; }
    public bool HasMore { get; set; }
}

