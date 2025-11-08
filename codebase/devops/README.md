# DevOps Documentation — Customer Spending Dashboard

This document provides comprehensive DevOps documentation including architecture diagrams, deployment strategies, CI/CD pipelines, and operational guidelines for the Customer Spending Dashboard.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [System Architecture Diagram](#system-architecture-diagram)
3. [Service Interaction Flow](#service-interaction-flow)
4. [Technology Stack](#technology-stack)
5. [Infrastructure Components](#infrastructure-components)
6. [Deployment Architecture](#deployment-architecture)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Environment Configuration](#environment-configuration)
9. [Monitoring & Observability](#monitoring--observability)
10. [Scaling Strategy](#scaling-strategy)
11. [Security Considerations](#security-considerations)
12. [Disaster Recovery](#disaster-recovery)

---

## High-Level Architecture

The Customer Spending Dashboard is built using a **microservices architecture** with **.NET Aspire** orchestration, **HotChocolate Fusion Gateway** for GraphQL aggregation, and a **React frontend**.

### Architecture Overview

```mermaid
flowchart TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile App]
    end

    subgraph "Frontend Layer"
        React[React SPA<br/>Tailwind CSS<br/>React Query<br/>Recharts]
    end

    subgraph ".NET Aspire Orchestration"
        AppHost[AppHost<br/>Service Discovery<br/>Configuration<br/>Health Checks]
    end

    subgraph "API Gateway Layer"
        Gateway[HotChocolate<br/>Fusion Gateway<br/>GraphQL Endpoint<br/>Schema Composition]
    end

    subgraph "Backend Services"
        CustomerService[Customer Service<br/>GraphQL Subgraph<br/>Customer Profiles]
        SpendingService[Spending Service<br/>GraphQL Subgraph<br/>Analytics & Summaries]
        TransactionService[Transaction Service<br/>GraphQL Subgraph<br/>Transactions & Goals]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Customer Database)]
    end

    Browser --> React
    Mobile --> React
    React -->|HTTPS/GraphQL| Gateway
    Gateway -->|GraphQL Queries| CustomerService
    Gateway -->|GraphQL Queries| SpendingService
    Gateway -->|GraphQL Queries| TransactionService
    CustomerService --> PostgreSQL
    SpendingService --> PostgreSQL
    TransactionService --> PostgreSQL
    AppHost -.->|Orchestrates| Gateway
    AppHost -.->|Orchestrates| CustomerService
    AppHost -.->|Orchestrates| SpendingService
    AppHost -.->|Orchestrates| TransactionService
    AppHost -.->|Manages| PostgreSQL
```

---

## System Architecture Diagram

### Detailed Component Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        FE[React Frontend<br/>Port: 3000/5173]
        FE_COMP[Components<br/>Dashboard, Charts, Tables]
        FE_HOOKS[React Query Hooks<br/>Data Fetching & Mutations]
    end

    subgraph "API Gateway Layer"
        GATEWAY[HotChocolate Fusion Gateway<br/>Port: 5098<br/>/graphql endpoint]
        FUSION[Fusion Composition<br/>Schema Merging & Routing]
        CORS[CORS Middleware<br/>Allowed Origins Config]
    end

    subgraph ".NET Aspire AppHost"
        APPHOST[AppHost Orchestrator<br/>Service Discovery<br/>Configuration Management]
        HEALTH[Health Checks<br/>Service Monitoring]
    end

    subgraph "Microservices Layer"
        CS[Customer Service<br/>GraphQL Subgraph<br/>Port: Dynamic]
        SS[Spending Service<br/>GraphQL Subgraph<br/>Port: Dynamic]
        TS[Transaction Service<br/>GraphQL Subgraph<br/>Port: Dynamic]
    end

    subgraph "Data Persistence"
        PG[(PostgreSQL<br/>Port: 5432<br/>Database: customerdb)]
        SCHEMA[Database Schema<br/>Customers, Transactions,<br/>Goals, Categories]
    end

    subgraph "Development Tools"
        ASPIRE_DASH[Aspire Dashboard<br/>Service Visualization<br/>Logs & Metrics]
    end

    FE -->|GraphQL Queries/Mutations| GATEWAY
    GATEWAY -->|Schema Composition| FUSION
    FUSION -->|Route Queries| CS
    FUSION -->|Route Queries| SS
    FUSION -->|Route Queries| TS
    CS -->|EF Core/Npgsql| PG
    SS -->|EF Core/Npgsql| PG
    TS -->|EF Core/Npgsql| PG
    APPHOST -.->|Orchestrates| GATEWAY
    APPHOST -.->|Orchestrates| CS
    APPHOST -.->|Orchestrates| SS
    APPHOST -.->|Orchestrates| TS
    APPHOST -.->|Manages| PG
    APPHOST -->|Visualization| ASPIRE_DASH
```

---

## Service Interaction Flow

### Request Flow Diagram

```mermaid
sequenceDiagram
    participant User as User Browser
    participant React as React Frontend
    participant Gateway as Fusion Gateway
    participant CS as Customer Service
    participant SS as Spending Service
    participant TS as Transaction Service
    participant DB as PostgreSQL

    User->>React: Load Dashboard
    React->>Gateway: GraphQL Query: customerProfile, spendingSummary, spendingByCategory
    Gateway->>Gateway: Parse Query & Compose Execution Plan
    
    par Parallel Service Calls
        Gateway->>CS: Query: customerProfile(customerId)
        CS->>DB: SELECT customer data
        DB-->>CS: Customer Profile
        CS-->>Gateway: CustomerProfile
    and
        Gateway->>SS: Query: spendingSummary(customerId, period)
        SS->>DB: Aggregate spending data
        DB-->>SS: Spending Summary
        SS-->>Gateway: SpendingSummary
    and
        Gateway->>SS: Query: spendingByCategory(customerId)
        SS->>DB: GROUP BY category
        DB-->>SS: Category Spending
        SS-->>Gateway: SpendingByCategory
    end
    
    Gateway->>Gateway: Merge Results
    Gateway-->>React: Unified GraphQL Response
    React->>React: Update UI (Charts, KPIs, Tables)
    React-->>User: Render Dashboard
```

### Mutation Flow Diagram

```mermaid
sequenceDiagram
    participant User as User Browser
    participant React as React Frontend
    participant Gateway as Fusion Gateway
    participant TS as Transaction Service
    participant DB as PostgreSQL
    participant ReactQuery as React Query

    User->>React: Create Transaction (Form Submit)
    React->>Gateway: Mutation: createTransaction(...)
    Gateway->>TS: Route Mutation
    TS->>DB: INSERT transaction
    DB-->>TS: Transaction Created
    TS-->>Gateway: Transaction Object
    Gateway-->>React: Mutation Response
    React->>ReactQuery: Invalidate Queries
    ReactQuery->>Gateway: Refetch: transactions, spendingSummary
    Gateway-->>ReactQuery: Updated Data
    React-->>User: UI Updated
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) + Context API
- **Charts**: Recharts
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **HTTP Client**: graphql-request

### Backend
- **Orchestration**: .NET Aspire
- **API Gateway**: HotChocolate Fusion Gateway
- **GraphQL**: HotChocolate GraphQL Server
- **Framework**: .NET 8.0 / .NET 9.0
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core (if implemented)

### Infrastructure
- **Container Runtime**: Docker
- **Orchestration**: Kubernetes (for production)
- **Service Discovery**: .NET Aspire Service Discovery
- **Configuration**: appsettings.json, Environment Variables

---

## Infrastructure Components

### Component Breakdown

```mermaid
graph LR
    subgraph "Compute"
        A1[AppHost Container]
        A2[Gateway Container]
        A3[Customer Service Container]
        A4[Spending Service Container]
        A5[Transaction Service Container]
        A6[React Frontend Container]
    end

    subgraph "Data"
        B1[(PostgreSQL Container)]
        B2[(Redis Cache - Optional)]
    end

    subgraph "Networking"
        C1[Internal Network]
        C2[Load Balancer]
        C3[Ingress Controller]
    end

    subgraph "Monitoring"
        D1[Aspire Dashboard]
        D2[Application Insights]
        D3[Log Aggregation]
    end

    A1 --> A2
    A1 --> A3
    A1 --> A4
    A1 --> A5
    A2 --> A3
    A2 --> A4
    A2 --> A5
    A3 --> B1
    A4 --> B1
    A5 --> B1
    C2 --> A6
    A6 --> A2
    A1 --> D1
```

---

## Deployment Architecture

### Development Environment

```mermaid
flowchart TB
    subgraph "Developer Machine"
        IDE[IDE / Code Editor]
        DOCKER[Docker Desktop]
    end

    subgraph "Local Containers"
        APPHOST[AppHost<br/>localhost:15000]
        GATEWAY[Gateway<br/>localhost:5098]
        SERVICES[Backend Services<br/>Dynamic Ports]
        POSTGRES[PostgreSQL<br/>localhost:5432]
        FRONTEND[React Dev Server<br/>localhost:3000]
    end

    IDE -->|dotnet run| APPHOST
    APPHOST -->|Orchestrates| GATEWAY
    APPHOST -->|Orchestrates| SERVICES
    APPHOST -->|Manages| POSTGRES
    FRONTEND -->|GraphQL| GATEWAY
    SERVICES --> POSTGRES
```

### Production Environment (Azure Kubernetes Service)

```mermaid
flowchart TB
    subgraph "Azure Cloud"
        subgraph "AKS Cluster"
            subgraph "Namespace: customer-spending"
                INGRESS[Ingress Controller<br/>NGINX/AGIC]
                
                subgraph "Frontend Deployment"
                    FE_PODS[Frontend Pods<br/>React SPA]
                end
                
                subgraph "Gateway Deployment"
                    GW_PODS[Gateway Pods<br/>Fusion Gateway]
                end
                
                subgraph "Services Deployments"
                    CS_PODS[Customer Service Pods]
                    SS_PODS[Spending Service Pods]
                    TS_PODS[Transaction Service Pods]
                end
            end
        end

        subgraph "Managed Services"
            POSTGRES_AZ[(Azure PostgreSQL<br/>Flexible Server)]
            REDIS_AZ[(Azure Cache<br/>for Redis)]
            KV[Azure Key Vault<br/>Secrets Management]
            AI[Application Insights<br/>Monitoring]
        end

        subgraph "Container Registry"
            ACR[(Azure Container<br/>Registry)]
        end
    end

    USER[End Users] -->|HTTPS| INGRESS
    INGRESS --> FE_PODS
    FE_PODS -->|GraphQL| GW_PODS
    GW_PODS --> CS_PODS
    GW_PODS --> SS_PODS
    GW_PODS --> TS_PODS
    CS_PODS --> POSTGRES_AZ
    SS_PODS --> POSTGRES_AZ
    TS_PODS --> POSTGRES_AZ
    CS_PODS --> REDIS_AZ
    SS_PODS --> REDIS_AZ
    TS_PODS --> REDIS_AZ
    CS_PODS --> KV
    SS_PODS --> KV
    TS_PODS --> KV
    CS_PODS --> AI
    SS_PODS --> AI
    TS_PODS --> AI
    ACR -->|Pull Images| FE_PODS
    ACR -->|Pull Images| GW_PODS
    ACR -->|Pull Images| CS_PODS
    ACR -->|Pull Images| SS_PODS
    ACR -->|Pull Images| TS_PODS
```

---

## CI/CD Pipeline

### Continuous Integration & Deployment Flow

```mermaid
flowchart LR
    subgraph "Source Control"
        GIT[Git Repository<br/>GitHub/Azure DevOps]
    end

    subgraph "CI Pipeline"
        BUILD[Build & Test<br/>dotnet build<br/>npm test]
        LINT[Code Quality<br/>ESLint, SonarQube]
        SECURITY[Security Scan<br/>Snyk, OWASP]
    end

    subgraph "Container Build"
        DOCKER_BUILD[Docker Build<br/>Multi-stage Builds]
        IMAGE_TAG[Image Tagging<br/>Version + Git SHA]
    end

    subgraph "Container Registry"
        ACR_PUSH[Push to ACR<br/>Azure Container Registry]
    end

    subgraph "CD Pipeline"
        DEPLOY_DEV[Deploy to Dev<br/>AKS Dev Namespace]
        TEST_E2E[E2E Tests<br/>Playwright/Cypress]
        DEPLOY_PROD[Deploy to Prod<br/>AKS Prod Namespace<br/>Blue/Green Strategy]
    end

    subgraph "Monitoring"
        HEALTH_CHECK[Health Checks<br/>Service Validation]
        ROLLBACK[Auto Rollback<br/>On Failure]
    end

    GIT -->|Push/PR| BUILD
    BUILD --> LINT
    LINT --> SECURITY
    SECURITY --> DOCKER_BUILD
    DOCKER_BUILD --> IMAGE_TAG
    IMAGE_TAG --> ACR_PUSH
    ACR_PUSH --> DEPLOY_DEV
    DEPLOY_DEV --> TEST_E2E
    TEST_E2E --> DEPLOY_PROD
    DEPLOY_PROD --> HEALTH_CHECK
    HEALTH_CHECK -->|Failure| ROLLBACK
    HEALTH_CHECK -->|Success| MONITOR[Monitor Production]
```

### Pipeline Stages

1. **Build Stage**
   - Restore NuGet packages
   - Build .NET projects
   - Run unit tests
   - Build React frontend
   - Run frontend tests

2. **Container Stage**
   - Build Docker images for each service
   - Tag images with version and commit SHA
   - Scan images for vulnerabilities

3. **Deploy to Dev**
   - Deploy to AKS development namespace
   - Run integration tests
   - Validate service health

4. **Deploy to Production**
   - Manual approval gate
   - Blue/Green deployment strategy
   - Health checks and smoke tests
   - Automatic rollback on failure

---

## Environment Configuration

### Configuration Management

```mermaid
graph TB
    subgraph "Configuration Sources"
        ENV_VARS[Environment Variables]
        APPSETTINGS[appsettings.json]
        KEY_VAULT[Azure Key Vault]
        ASPIRE_CONFIG[Aspire Configuration]
    end

    subgraph "Services"
        GATEWAY_CONFIG[Gateway Config<br/>CORS Origins<br/>GraphQL Settings]
        SERVICE_CONFIG[Service Configs<br/>DB Connection Strings<br/>Feature Flags]
        FRONTEND_CONFIG[Frontend Config<br/>GraphQL Endpoint<br/>API Keys]
    end

    ENV_VARS --> GATEWAY_CONFIG
    APPSETTINGS --> GATEWAY_CONFIG
    KEY_VAULT --> SERVICE_CONFIG
    ASPIRE_CONFIG --> SERVICE_CONFIG
    ENV_VARS --> FRONTEND_CONFIG
```

### Environment Variables

**Gateway**
- `Cors:AllowedOrigins` - Frontend origins
- `ASPNETCORE_ENVIRONMENT` - Environment name

**Services**
- `ConnectionStrings:DefaultConnection` - PostgreSQL connection string
- `ASPNETCORE_ENVIRONMENT` - Environment name

**Frontend**
- `VITE_GRAPHQL_ENDPOINT` - Gateway GraphQL endpoint URL

---

## Monitoring & Observability

### Observability Stack

```mermaid
flowchart TB
    subgraph "Application Layer"
        SERVICES[Backend Services]
        GATEWAY[Gateway]
        FRONTEND[Frontend]
    end

    subgraph "Telemetry Collection"
        OTEL[OpenTelemetry<br/>Distributed Tracing]
        METRICS[Prometheus Metrics<br/>Custom Metrics]
        LOGS[Structured Logging<br/>Serilog/NLog]
    end

    subgraph "Observability Platform"
        ASPIRE_DASH[Aspire Dashboard<br/>Service Health<br/>Logs & Metrics]
        APP_INSIGHTS[Application Insights<br/>Performance Monitoring]
        LOG_ANALYTICS[Log Analytics<br/>Centralized Logging]
    end

    subgraph "Alerting"
        ALERTS[Alert Rules<br/>SLO Violations<br/>Error Rates]
        NOTIFICATIONS[Notifications<br/>Email, Slack, PagerDuty]
    end

    SERVICES --> OTEL
    GATEWAY --> OTEL
    SERVICES --> METRICS
    GATEWAY --> METRICS
    SERVICES --> LOGS
    GATEWAY --> LOGS
    OTEL --> APP_INSIGHTS
    METRICS --> APP_INSIGHTS
    LOGS --> LOG_ANALYTICS
    APP_INSIGHTS --> ALERTS
    LOG_ANALYTICS --> ALERTS
    ALERTS --> NOTIFICATIONS
    SERVICES --> ASPIRE_DASH
    GATEWAY --> ASPIRE_DASH
```

### Key Metrics

- **Service Health**: HTTP status codes, response times
- **GraphQL Performance**: Query execution time, error rates
- **Database Performance**: Connection pool usage, query latency
- **Frontend Performance**: Page load times, API call durations
- **Resource Usage**: CPU, memory, network I/O

---

## Scaling Strategy

### Horizontal Scaling

```mermaid
flowchart LR
    subgraph "Load Balancer"
        LB[Ingress Controller<br/>NGINX/AGIC]
    end

    subgraph "Gateway Replicas"
        GW1[Gateway Pod 1]
        GW2[Gateway Pod 2]
        GW3[Gateway Pod N]
    end

    subgraph "Service Replicas"
        CS1[Customer Service Pod 1]
        CS2[Customer Service Pod 2]
        SS1[Spending Service Pod 1]
        SS2[Spending Service Pod 2]
        TS1[Transaction Service Pod 1]
        TS2[Transaction Service Pod 2]
    end

    subgraph "Database"
        PG_MASTER[(PostgreSQL<br/>Primary)]
        PG_REPLICA[(PostgreSQL<br/>Read Replicas)]
    end

    LB --> GW1
    LB --> GW2
    LB --> GW3
    GW1 --> CS1
    GW1 --> CS2
    GW2 --> SS1
    GW2 --> SS2
    GW3 --> TS1
    GW3 --> TS2
    CS1 --> PG_MASTER
    CS2 --> PG_REPLICA
    SS1 --> PG_MASTER
    SS2 --> PG_REPLICA
    TS1 --> PG_MASTER
    TS2 --> PG_REPLICA
```

### Auto-Scaling Configuration

- **Horizontal Pod Autoscaler (HPA)**: Scale based on CPU/memory usage
- **Vertical Pod Autoscaler (VPA)**: Adjust resource requests/limits
- **Database Scaling**: Read replicas for query-heavy workloads

---

## Security Considerations

### Security Architecture

```mermaid
flowchart TB
    subgraph "Security Layers"
        WAF[Web Application Firewall<br/>DDoS Protection]
        TLS[TLS/SSL Termination<br/>Certificate Management]
        AUTH[Authentication<br/>JWT/OAuth2]
        RBAC[Role-Based Access Control]
    end

    subgraph "Network Security"
        NSG[Network Security Groups<br/>Firewall Rules]
        PE[Private Endpoints<br/>Database Access]
        VPN[VPN/ExpressRoute<br/>Secure Connectivity]
    end

    subgraph "Data Security"
        ENCRYPTION[Encryption at Rest<br/>Database Encryption]
        ENCRYPTION_TRANSIT[Encryption in Transit<br/>TLS 1.3]
        SECRETS[Secrets Management<br/>Key Vault]
    end

    WAF --> TLS
    TLS --> AUTH
    AUTH --> RBAC
    NSG --> PE
    PE --> VPN
    ENCRYPTION --> SECRETS
    ENCRYPTION_TRANSIT --> SECRETS
```

### Security Best Practices

1. **Authentication & Authorization**
   - JWT tokens for API authentication
   - OAuth2 for external identity providers
   - Role-based access control (RBAC)

2. **Network Security**
   - Private endpoints for database access
   - Network policies in Kubernetes
   - Firewall rules restricting access

3. **Data Protection**
   - Encryption at rest (database)
   - Encryption in transit (TLS 1.3)
   - Secrets stored in Azure Key Vault

4. **Application Security**
   - Input validation and sanitization
   - GraphQL query depth limiting
   - Rate limiting on API endpoints
   - CORS configuration

---

## Disaster Recovery

### Backup & Recovery Strategy

```mermaid
flowchart TB
    subgraph "Backup Strategy"
        DB_BACKUP[Database Backups<br/>Daily Full<br/>Hourly Incremental]
        CONFIG_BACKUP[Configuration Backups<br/>Infrastructure as Code]
        IMAGE_BACKUP[Container Image Backups<br/>ACR Geo-Replication]
    end

    subgraph "Recovery Procedures"
        RTO[RTO: 4 hours<br/>Recovery Time Objective]
        RPO[RPO: 1 hour<br/>Recovery Point Objective]
        FAILOVER[Automated Failover<br/>Secondary Region]
    end

    subgraph "Disaster Scenarios"
        REGION_FAILURE[Region Failure]
        DB_CORRUPTION[Database Corruption]
        SERVICE_FAILURE[Service Failure]
    end

    DB_BACKUP --> RPO
    CONFIG_BACKUP --> RTO
    IMAGE_BACKUP --> FAILOVER
    REGION_FAILURE --> FAILOVER
    DB_CORRUPTION --> DB_BACKUP
    SERVICE_FAILURE --> FAILOVER
```

### Recovery Procedures

1. **Database Recovery**
   - Point-in-time recovery (PITR)
   - Automated backups to geo-redundant storage
   - Regular restore testing

2. **Service Recovery**
   - Multi-region deployment
   - Automated failover mechanisms
   - Health check-based routing

3. **Data Recovery**
   - Regular backup validation
   - Disaster recovery drills
   - Documentation of recovery procedures

---

## Quick Reference

### Service Endpoints

- **Frontend**: `http://localhost:3000` (dev) / `https://app.example.com` (prod)
- **GraphQL Gateway**: `http://localhost:5098/graphql`
- **Aspire Dashboard**: `http://localhost:15000`
- **PostgreSQL**: `localhost:5432`

### Key Commands

```bash
# Start all services (AppHost)
cd codebase/src/AppHost
dotnet run

# Start frontend
cd codebase/src/frontend
npm install
npm run dev

# Build Docker images
docker-compose build

# Deploy to AKS
helm upgrade --install customer-spending ./helm-chart
```

---

## Additional Resources

- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
- [HotChocolate Fusion Documentation](https://chillicream.com/docs/hotchocolate/v13/federation/fusion/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Azure Kubernetes Service Documentation](https://learn.microsoft.com/en-us/azure/aks/)

---

**Last Updated**: 2025-01-XX
**Maintained By**: DevOps Team

