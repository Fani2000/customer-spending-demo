import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  customerId: string
  setCustomerId: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customerId, setCustomerId] = useState<string>('12345')

  return (
    <AppContext.Provider value={{ customerId, setCustomerId }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

