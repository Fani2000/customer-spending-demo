import { Link } from 'react-router-dom'
import { ArrowRight, Receipt, Target } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { useSpendingSummary, useSpendingByCategory, useSpendingTrends } from '../hooks/useCustomerData'
import KPICards from './KPICards'
import CategoryChart from './CategoryChart'
import TrendsChart from './TrendsChart'
import SpendingGoalsCard from './SpendingGoalsCard'

const Dashboard = () => {
  const { customerId } = useApp()
  const { data: summary, isLoading: summaryLoading } = useSpendingSummary(customerId)
  const { data: categories, isLoading: categoriesLoading } = useSpendingByCategory(customerId)
  const { data: trends, isLoading: trendsLoading } = useSpendingTrends(customerId)

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Get a quick snapshot of your spending and financial health</p>
      </div>

      {/* KPI Cards */}
      <KPICards summary={summary} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Link
          to="/transactions"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-500 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">View All Transactions</h3>
              </div>
              <p className="text-gray-600">Browse, search, and manage all your transactions</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/goals"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-green-500 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Manage Goals</h3>
              </div>
              <p className="text-gray-600">Set and track your spending goals by category</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Charts and Goals Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <CategoryChart data={categories} loading={categoriesLoading} />
            <TrendsChart data={trends} loading={trendsLoading} />
          </div>
        </div>
        <div>
          <SpendingGoalsCard customerId={customerId} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

