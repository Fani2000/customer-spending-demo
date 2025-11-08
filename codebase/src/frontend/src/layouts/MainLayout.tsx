import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, Target } from 'lucide-react'
import CustomerProfileCard from '../components/CustomerProfileCard'
import { useApp } from '../contexts/AppContext'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation()
  const { customerId } = useApp()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Goals', href: '/goals', icon: Target },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Sidebar Navigation - 20% width */}
      <aside className="w-[20%] bg-white shadow-lg flex-shrink-0 flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Spending Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your finances</p>
        </div>

        {/* Profile Card */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <CustomerProfileCard customerId={customerId} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content - 80% width */}
      <main className="flex-1 w-[80%] overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}

export default MainLayout

