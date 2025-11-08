import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useMutations'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  transaction?: {
    id: string
    date: string
    merchant: string
    category: string
    amount: number
    description: string
    paymentMethod: string
  }
}

const categories = ['Groceries', 'Entertainment', 'Transportation', 'Dining', 'Shopping', 'Utilities']
const paymentMethods = ['Credit Card', 'Debit Card', 'Debit Order', 'Bank Transfer', 'Cash']

const TransactionModal = ({ isOpen, onClose, customerId, transaction }: TransactionModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    merchant: '',
    category: '',
    amount: '',
    description: '',
    paymentMethod: '',
  })

  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: new Date(transaction.date).toISOString().slice(0, 16),
        merchant: transaction.merchant,
        category: transaction.category,
        amount: transaction.amount.toString(),
        description: transaction.description,
        paymentMethod: transaction.paymentMethod,
      })
    } else {
      setFormData({
        date: new Date().toISOString().slice(0, 16),
        merchant: '',
        category: '',
        amount: '',
        description: '',
        paymentMethod: '',
      })
    }
  }, [transaction, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (transaction) {
        await updateMutation.mutateAsync({
          transactionId: transaction.id,
          date: formData.date,
          merchant: formData.merchant || undefined,
          category: formData.category || undefined,
          amount: formData.amount ? parseFloat(formData.amount) : undefined,
          description: formData.description || undefined,
          paymentMethod: formData.paymentMethod || undefined,
        })
      } else {
        await createMutation.mutateAsync({
          customerId,
          date: formData.date,
          merchant: formData.merchant,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
          paymentMethod: formData.paymentMethod,
        })
      }
      onClose()
    } catch (error) {
      console.error('Error submitting transaction:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                required={!transaction}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merchant
              </label>
              <input
                type="text"
                required={!transaction}
                value={formData.merchant}
                onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Pick n Pay"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                required={!transaction}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (ZAR)
              </label>
              <input
                type="number"
                step="0.01"
                required={!transaction}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                required={!transaction}
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required={!transaction}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter transaction description..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : transaction
                ? 'Update Transaction'
                : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal

