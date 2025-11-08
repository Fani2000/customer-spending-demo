import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../services/graphqlClient'
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  CREATE_SPENDING_GOAL,
  UPDATE_SPENDING_GOAL,
  DELETE_SPENDING_GOAL,
  UPDATE_CUSTOMER,
} from '../services/queries'

// Transaction Mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables: {
      customerId: string
      date: string
      merchant: string
      category: string
      amount: number
      description: string
      paymentMethod: string
    }) => {
      const data = await graphqlClient.request(CREATE_TRANSACTION, {
        ...variables,
        date: new Date(variables.date).toISOString(),
      }) as any
      return data.createTransaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['spendingSummary'] })
      queryClient.invalidateQueries({ queryKey: ['spendingByCategory'] })
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables: {
      transactionId: string
      date?: string
      merchant?: string
      category?: string
      amount?: number
      description?: string
      paymentMethod?: string
    }) => {
      const data = await graphqlClient.request(UPDATE_TRANSACTION, {
        ...variables,
        date: variables.date ? new Date(variables.date).toISOString() : undefined,
      }) as any
      return data.updateTransaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['spendingSummary'] })
      queryClient.invalidateQueries({ queryKey: ['spendingByCategory'] })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (transactionId: string) => {
      const data = await graphqlClient.request(DELETE_TRANSACTION, { transactionId }) as any
      return data.deleteTransaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['spendingSummary'] })
      queryClient.invalidateQueries({ queryKey: ['spendingByCategory'] })
    },
  })
}

// Spending Goal Mutations
export const useCreateSpendingGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables: { customerId: string; category: string; monthlyBudget: number }) => {
      const data = await graphqlClient.request(CREATE_SPENDING_GOAL, variables) as any
      return data.createSpendingGoal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spendingGoals'] })
    },
  })
}

export const useUpdateSpendingGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables: { goalId: string; monthlyBudget?: number }) => {
      const data = await graphqlClient.request(UPDATE_SPENDING_GOAL, variables) as any
      return data.updateSpendingGoal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spendingGoals'] })
    },
  })
}

export const useDeleteSpendingGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (goalId: string) => {
      const data = await graphqlClient.request(DELETE_SPENDING_GOAL, { goalId }) as any
      return data.deleteSpendingGoal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spendingGoals'] })
    },
  })
}

// Customer Mutations
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables: {
      customerId: string
      name?: string
      email?: string
      accountType?: string
    }) => {
      const data = await graphqlClient.request(UPDATE_CUSTOMER, variables) as any
      return data.updateCustomer
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile', variables.customerId] })
    },
  })
}

