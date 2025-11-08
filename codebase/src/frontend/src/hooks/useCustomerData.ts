import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '../services/graphqlClient'
import {
  GET_CUSTOMER_PROFILE,
  GET_SPENDING_SUMMARY,
  GET_SPENDING_BY_CATEGORY,
  GET_SPENDING_TRENDS,
  GET_TRANSACTIONS,
  GET_SPENDING_GOALS,
} from '../services/queries'

export const useCustomerProfile = (customerId: string) => {
  return useQuery({
    queryKey: ['customerProfile', customerId],
    queryFn: async () => {
      const data = await graphqlClient.request(GET_CUSTOMER_PROFILE, { customerId }) as any
      return data.customerProfile
    },
  })
}

export const useSpendingSummary = (customerId: string, period: string = '30d') => {
  return useQuery({
    queryKey: ['spendingSummary', customerId, period],
    queryFn: async () => {
      const data = await graphqlClient.request(GET_SPENDING_SUMMARY, { customerId, period }) as any
      return data.spendingSummary
    },
  })
}

export const useSpendingByCategory = (customerId: string, period?: string, startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ['spendingByCategory', customerId, period, startDate, endDate],
    queryFn: async () => {
      const data = await graphqlClient.request(GET_SPENDING_BY_CATEGORY, {
        customerId,
        period,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }) as any
      return data.spendingByCategory
    },
  })
}

export const useSpendingTrends = (customerId: string, months: number = 12) => {
  return useQuery({
    queryKey: ['spendingTrends', customerId, months],
    queryFn: async () => {
      const data = await graphqlClient.request(GET_SPENDING_TRENDS, { customerId, months }) as any
      return data.spendingTrends
    },
  })
}

export const useTransactions = (
  customerId: string,
  limit: number = 20,
  offset: number = 0,
  category?: string,
  startDate?: Date,
  endDate?: Date,
  sortBy: string = 'date_desc'
) => {
  return useQuery({
    queryKey: ['transactions', customerId, limit, offset, category, startDate, endDate, sortBy],
    queryFn: async () => {
      const data = await graphqlClient.request(GET_TRANSACTIONS, {
        customerId,
        limit,
        offset,
        category,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        sortBy,
      }) as any
      return data.transactions
    },
  })
}

export const useSpendingGoals = (customerId: string) => {
  return useQuery({
    queryKey: ['spendingGoals', customerId],
    queryFn: async () => {
      const data = await graphqlClient.request(GET_SPENDING_GOALS, { customerId }) as any
      return data.spendingGoals
    },
  })
}

