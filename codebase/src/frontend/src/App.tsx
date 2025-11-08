import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import MainLayout from './layouts/MainLayout'
import Dashboard from './components/Dashboard'
import TransactionsPage from './pages/TransactionsPage'
import GoalsPage from './pages/GoalsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App

