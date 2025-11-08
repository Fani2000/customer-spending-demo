import { useState } from 'react'
import { User, Edit2 } from 'lucide-react'
import { useCustomerProfile } from '../hooks/useCustomerData'
import CustomerEditModal from './CustomerEditModal'

interface CustomerProfileCardProps {
  customerId: string
}

const CustomerProfileCard = ({ customerId }: CustomerProfileCardProps) => {
  const { data: profile, isLoading } = useCustomerProfile(customerId)
  const [showEditModal, setShowEditModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md p-4 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{profile?.name}</h2>
              <p className="text-blue-100 text-sm mt-0.5">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            title="Edit profile"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white border-opacity-20">
        <div>
          <p className="text-xs text-blue-200">Member Since</p>
          <p className="text-sm font-semibold">{profile ? formatDate(profile.joinDate) : '—'}</p>
        </div>
        <div>
          <p className="text-xs text-blue-200">Account</p>
          <p className="text-sm font-semibold capitalize">{profile?.accountType || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-blue-200">Total Spent</p>
          <p className="text-sm font-semibold">{profile ? formatCurrency(profile.totalSpent) : '—'}</p>
        </div>
        </div>
      </div>

      {profile && (
        <CustomerEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          customerId={customerId}
          customer={{
            name: profile.name,
            email: profile.email,
            accountType: profile.accountType,
          }}
        />
      )}
    </>
  )
}

export default CustomerProfileCard

