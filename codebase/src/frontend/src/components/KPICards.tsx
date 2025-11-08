import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, CreditCard } from 'lucide-react'

interface KPICardsProps {
  summary?: any
}

const KPICards = ({ summary }: KPICardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary ? formatCurrency(summary.totalSpent) : '—'}
            </p>
            {summary?.comparedToPrevious && (
              <p className="text-xs text-gray-500 mt-2">
                {summary.comparedToPrevious.spentChange > 0 ? '+' : ''}
                {summary.comparedToPrevious.spentChange.toFixed(1)}% vs previous period
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Transactions</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary?.transactionCount ?? '—'}
            </p>
            {summary?.comparedToPrevious && (
              <p className="text-xs text-gray-500 mt-2">
                {summary.comparedToPrevious.transactionChange > 0 ? '+' : ''}
                {summary.comparedToPrevious.transactionChange.toFixed(1)}% vs previous period
              </p>
            )}
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <ShoppingCart className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Avg Transaction</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary ? formatCurrency(summary.averageTransaction) : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-2">Per transaction</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Top Category</p>
            <p className="text-2xl font-bold text-gray-900 capitalize">
              {summary?.topCategory ?? '—'}
            </p>
            {summary?.comparedToPrevious?.spentChange && (
              <div className="flex items-center gap-1 mt-2">
                {summary.comparedToPrevious.spentChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className={`text-xs font-medium ${summary.comparedToPrevious.spentChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.abs(summary.comparedToPrevious.spentChange).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-orange-100 rounded-lg">
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default KPICards

