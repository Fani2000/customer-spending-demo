import SpendingGoalsCard from '../components/SpendingGoalsCard'
import { useApp } from '../contexts/AppContext'

const GoalsPage = () => {
  const { customerId } = useApp()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Spending Goals</h1>
        <p className="text-gray-600">Set and track your monthly spending goals by category</p>
      </div>

      <div className="max-w-4xl">
        <SpendingGoalsCard customerId={customerId} />
      </div>
    </div>
  )
}

export default GoalsPage

