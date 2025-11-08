import { useState } from 'react'
import { Plus, Edit2, Trash2, Target } from 'lucide-react'
import { useSpendingGoals } from '../hooks/useCustomerData'
import {
  useCreateSpendingGoal,
  useUpdateSpendingGoal,
  useDeleteSpendingGoal,
} from '../hooks/useMutations'

interface SpendingGoalsCardProps {
  customerId: string
}

const categories = ['Groceries', 'Entertainment', 'Transportation', 'Dining', 'Shopping', 'Utilities']

const SpendingGoalsCard = ({ customerId }: SpendingGoalsCardProps) => {
  const { data, isLoading } = useSpendingGoals(customerId)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [newBudget, setNewBudget] = useState('')

  const createMutation = useCreateSpendingGoal()
  const updateMutation = useUpdateSpendingGoal()
  const deleteMutation = useDeleteSpendingGoal()

  const handleCreate = async (category: string, budget: number) => {
    try {
      await createMutation.mutateAsync({ customerId, category, monthlyBudget: budget })
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const handleUpdate = async (goalId: string) => {
    try {
      await updateMutation.mutateAsync({ goalId, monthlyBudget: parseFloat(newBudget) })
      setEditingGoal(null)
      setNewBudget('')
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleDelete = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this spending goal?')) {
      try {
        await deleteMutation.mutateAsync(goalId)
      } catch (error) {
        console.error('Error deleting goal:', error)
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'exceeded':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">Loading goals...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Spending Goals</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Goal
        </button>
      </div>

      {showCreateModal && (
        <CreateGoalModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          existingCategories={data?.goals?.map((g: any) => g.category) || []}
        />
      )}

      <div className="space-y-4">
        {data?.goals?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No spending goals set. Create one to track your budget!
          </div>
        ) : (
          data?.goals?.map((goal: any) => (
            <div
              key={goal.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{goal.category}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        goal.status
                      )}`}
                    >
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>

                  {editingGoal === goal.id ? (
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="number"
                        step="0.01"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="New budget"
                      />
                      <button
                        onClick={() => handleUpdate(goal.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingGoal(null)
                          setNewBudget('')
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <span className="text-sm text-gray-600">Budget: </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(goal.monthlyBudget)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Spent: </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(goal.currentSpent)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">
                            {goal.percentageUsed.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              goal.percentageUsed >= 100
                                ? 'bg-red-500'
                                : goal.percentageUsed >= 80
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(goal.percentageUsed, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        {goal.daysRemaining} days remaining this month
                      </div>
                    </>
                  )}
                </div>

                {editingGoal !== goal.id && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingGoal(goal.id)
                        setNewBudget(goal.monthlyBudget.toString())
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const CreateGoalModal = ({
  onClose,
  onCreate,
  existingCategories,
}: {
  onClose: () => void
  onCreate: (category: string, budget: number) => void
  existingCategories: string[]
}) => {
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')

  const availableCategories = categories.filter((cat) => !existingCategories.includes(cat))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (category && budget) {
      onCreate(category, parseFloat(budget))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Create Spending Goal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget (ZAR)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SpendingGoalsCard

