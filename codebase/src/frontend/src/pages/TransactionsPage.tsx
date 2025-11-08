import TransactionsList from '../components/TransactionsList'
import { useApp } from '../contexts/AppContext'

const TransactionsPage = () => {
  const { customerId } = useApp()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">View and manage all your transactions</p>
      </div>

      <TransactionsList customerId={customerId} />
    </div>
  )
}

export default TransactionsPage

