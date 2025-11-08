import { gql } from 'graphql-request'

export const GET_CUSTOMER_PROFILE = gql`
  query GetCustomerProfile($customerId: String!) {
    customerProfile(customerId: $customerId) {
      customerId
      name
      email
      joinDate
      accountType
      totalSpent
      currency
    }
  }
`

export const GET_SPENDING_SUMMARY = gql`
  query GetSpendingSummary($customerId: String!, $period: String!) {
    spendingSummary(customerId: $customerId, period: $period) {
      period
      totalSpent
      transactionCount
      averageTransaction
      topCategory
      comparedToPrevious {
        spentChange
        transactionChange
      }
    }
  }
`

export const GET_SPENDING_BY_CATEGORY = gql`
  query GetSpendingByCategory($customerId: String!, $period: String, $startDate: DateTime, $endDate: DateTime) {
    spendingByCategory(customerId: $customerId, period: $period, startDate: $startDate, endDate: $endDate) {
      dateRange {
        startDate
        endDate
      }
      totalAmount
      categories {
        name
        amount
        percentage
        transactionCount
        color
        icon
      }
    }
  }
`

export const GET_SPENDING_TRENDS = gql`
  query GetSpendingTrends($customerId: String!, $months: Int!) {
    spendingTrends(customerId: $customerId, months: $months) {
      trends {
        month
        totalSpent
        transactionCount
        averageTransaction
      }
    }
  }
`

export const GET_TRANSACTIONS = gql`
  query GetTransactions($customerId: String!, $limit: Int!, $offset: Int!, $category: String, $startDate: DateTime, $endDate: DateTime, $sortBy: String!) {
    transactions(customerId: $customerId, limit: $limit, offset: $offset, category: $category, startDate: $startDate, endDate: $endDate, sortBy: $sortBy) {
      transactions {
        id
        date
        merchant
        category
        amount
        description
        paymentMethod
        icon
        categoryColor
      }
      pagination {
        total
        limit
        offset
        hasMore
      }
    }
  }
`

export const GET_SPENDING_GOALS = gql`
  query GetSpendingGoals($customerId: String!) {
    spendingGoals(customerId: $customerId) {
      goals {
        id
        category
        monthlyBudget
        currentSpent
        percentageUsed
        daysRemaining
        status
      }
    }
  }
`

// Mutations
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $customerId: String!
    $date: DateTime!
    $merchant: String!
    $category: String!
    $amount: Decimal!
    $description: String!
    $paymentMethod: String!
  ) {
    createTransaction(
      customerId: $customerId
      date: $date
      merchant: $merchant
      category: $category
      amount: $amount
      description: $description
      paymentMethod: $paymentMethod
    ) {
      id
      date
      merchant
      category
      amount
      description
      paymentMethod
      icon
      categoryColor
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction(
    $transactionId: String!
    $date: DateTime
    $merchant: String
    $category: String
    $amount: Decimal
    $description: String
    $paymentMethod: String
  ) {
    updateTransaction(
      transactionId: $transactionId
      date: $date
      merchant: $merchant
      category: $category
      amount: $amount
      description: $description
      paymentMethod: $paymentMethod
    ) {
      id
      date
      merchant
      category
      amount
      description
      paymentMethod
      icon
      categoryColor
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: String!) {
    deleteTransaction(transactionId: $transactionId)
  }
`

export const CREATE_SPENDING_GOAL = gql`
  mutation CreateSpendingGoal($customerId: String!, $category: String!, $monthlyBudget: Decimal!) {
    createSpendingGoal(customerId: $customerId, category: $category, monthlyBudget: $monthlyBudget) {
      id
      category
      monthlyBudget
      currentSpent
      percentageUsed
      daysRemaining
      status
    }
  }
`

export const UPDATE_SPENDING_GOAL = gql`
  mutation UpdateSpendingGoal($goalId: String!, $monthlyBudget: Decimal) {
    updateSpendingGoal(goalId: $goalId, monthlyBudget: $monthlyBudget) {
      id
      category
      monthlyBudget
      currentSpent
      percentageUsed
      daysRemaining
      status
    }
  }
`

export const DELETE_SPENDING_GOAL = gql`
  mutation DeleteSpendingGoal($goalId: String!) {
    deleteSpendingGoal(goalId: $goalId)
  }
`

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($customerId: String!, $name: String, $email: String, $accountType: String) {
    updateCustomer(customerId: $customerId, name: $name, email: $email, accountType: $accountType) {
      customerId
      name
      email
      accountType
      joinDate
      totalSpent
      currency
    }
  }
`

