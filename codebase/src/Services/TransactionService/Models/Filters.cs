namespace CustomerSpendingDashboard.Services.Transaction.Models;

public class Filters
{
    public List<CategoryFilter> Categories { get; set; } = new();
    public List<DateRangePreset> DateRangePresets { get; set; } = new();
}

public class CategoryFilter
{
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

public class DateRangePreset
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

