# Customer Spending Dashboard

A .NET Aspire application with HotChocolate Fusion Gateway, backend services, and React frontend.

## Architecture

- **AppHost**: .NET Aspire orchestration host
- **Gateway**: HotChocolate Fusion Gateway that aggregates GraphQL schemas from backend services
- **CustomerService**: GraphQL service for customer profile data
- **SpendingService**: GraphQL service for spending analytics and summaries
- **TransactionService**: GraphQL service for transactions and spending goals
- **Frontend**: React application with Tailwind CSS, React Query, and Recharts

## Prerequisites

- .NET 8.0 SDK or later
- Node.js 18+ and npm
- Docker (for PostgreSQL container)

## Getting Started

### Backend Services

1. Navigate to the AppHost directory:
   ```bash
   cd AppHost
   ```

2. Run the Aspire host:
   ```bash
   dotnet run
   ```

   This will start all backend services and the Gateway.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Project Structure

```
codebase/src/
├── AppHost/              # Aspire orchestration host
├── Gateway/              # HotChocolate Fusion Gateway
├── Services/
│   ├── CustomerService/  # Customer profile service
│   ├── SpendingService/  # Spending analytics service
│   └── TransactionService/ # Transaction service
└── frontend/             # React frontend application
```

## API Endpoints

The Gateway exposes a unified GraphQL endpoint at `/graphql` that aggregates queries from all backend services:

- `customerProfile(customerId: String!)`: Get customer profile
- `spendingSummary(customerId: String!, period: String!)`: Get spending summary
- `spendingByCategory(customerId: String!, ...)`: Get spending by category
- `spendingTrends(customerId: String!, months: Int!)`: Get monthly spending trends
- `transactions(customerId: String!, ...)`: Get transactions with filtering
- `spendingGoals(customerId: String!)`: Get spending goals

## Technologies

- **Backend**: .NET 8, HotChocolate GraphQL, .NET Aspire
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Query, Recharts
- **GraphQL**: HotChocolate Fusion Gateway

## Development

The services use mock data for demonstration purposes. In production, you would connect to a real database and implement proper data access layers.

