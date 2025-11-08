import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TrendsChartProps {
  data?: any
  loading?: boolean
}

const TrendsChart = ({ data, loading }: TrendsChartProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">Loading chart...</div>
      </div>
    )
  }

  if (!data?.trends) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Monthly Spending Trends</h2>
        <div className="text-center text-gray-500">No data available</div>
      </div>
    )
  }

  const chartData = data.trends.map((trend: any) => ({
    month: trend.month,
    totalSpent: trend.totalSpent,
    transactionCount: trend.transactionCount,
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Monthly Spending Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalSpent" stroke="#8884d8" name="Total Spent (ZAR)" />
          <Line type="monotone" dataKey="transactionCount" stroke="#82ca9d" name="Transactions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendsChart

