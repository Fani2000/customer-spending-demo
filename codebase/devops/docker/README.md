# Docker Compose Setup

This directory contains the Docker Compose configuration for running the Customer Spending Dashboard application locally.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- At least 4GB of available RAM
- Ports 3000, 5000, 5001, 5002, 5003, and 5432 available

## Quick Start

1. **Generate Gateway Configuration (First Time Only)**
   
   Before building Docker images, ensure the gateway configuration file exists:
   ```bash
   cd codebase/devops/docker
   ./generate-gateway-config.sh
   ```
   
   This creates `gateway.docker.fgp` in the Gateway directory. If the script fails, see the [Gateway Configuration](#gateway-cannot-connect-to-services--fusion-gateway-generation-fails) section below.

2. Navigate to this directory:
   ```bash
   cd codebase/devops/docker
   ```

3. Build and start all services:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - GraphQL Gateway: http://localhost:5000/graphql
   - Customer Service: http://localhost:5001/graphql
   - Spending Service: http://localhost:5002/graphql
   - Transaction Service: http://localhost:5003/graphql

## Services

The Docker Compose setup includes:

- **postgres**: PostgreSQL 16 database
- **customer-service**: Customer profile GraphQL service
- **spending-service**: Spending analytics GraphQL service
- **transaction-service**: Transaction and goals GraphQL service
- **gateway**: HotChocolate Fusion Gateway
- **frontend**: React frontend application

## Building Individual Services

To build a specific service:

```bash
# Build Gateway
docker-compose build gateway

# Build Frontend
docker-compose build frontend
```

## Running in Detached Mode

To run services in the background:

```bash
docker-compose up -d
```

## Viewing Logs

View logs from all services:
```bash
docker-compose logs -f
```

View logs from a specific service:
```bash
docker-compose logs -f gateway
docker-compose logs -f frontend
```

## Stopping Services

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes (this will delete the database):
```bash
docker-compose down -v
```

## Troubleshooting

### Services not starting

1. Check if ports are already in use
2. Check service logs: `docker-compose logs [service-name]`

### Gateway cannot connect to services / Fusion Gateway generation fails

The gateway uses the `gateway.fgp` file for service configuration. The default file may contain `localhost` references that don't work in Docker.

**Solution:**

The Gateway has been updated to automatically look for `gateway.docker.fgp` first. To generate a Docker-specific gateway configuration, follow the [official Fusion documentation](https://chillicream.com/docs/fusion/v15/quick-start):

**Prerequisites:**

1. Install the Fusion CLI tool:
   ```bash
   dotnet tool install -g HotChocolate.Fusion.CommandLine
   ```

**Step 1: Update Subgraph Configuration Files**

The `subgraph-config.json` files in each service have been updated to use Docker service names:
- `codebase/src/Services/CustomerService/subgraph-config.json` → `http://customer-service:8080/graphql`
- `codebase/src/Services/SpendingService/subgraph-config.json` → `http://spending-service:8080/graphql`
- `codebase/src/Services/TransactionService/subgraph-config.json` → `http://transaction-service:8080/graphql`

**Step 2: Export Schemas from Each Service**

Navigate to each service directory and export the schema:

```bash
# Customer Service
cd codebase/src/Services/CustomerService
dotnet run -- schema export --output schema.graphql

# Spending Service
cd codebase/src/Services/SpendingService
dotnet run -- schema export --output schema.graphql

# Transaction Service
cd codebase/src/Services/TransactionService
dotnet run -- schema export --output schema.graphql
```

**Step 3: Pack Each Subgraph**

Package each service into a Fusion subgraph package (`.fsp` file):

```bash
# From each service directory
cd codebase/src/Services/CustomerService
fusion subgraph pack

cd codebase/src/Services/SpendingService
fusion subgraph pack

cd codebase/src/Services/TransactionService
fusion subgraph pack
```

This creates `.fsp` files containing the schema and configuration for each subgraph.

**Step 4: Compose the Gateway Schema**

Navigate to the Gateway directory and compose all subgraphs into a gateway package:

```bash
cd codebase/src/Gateway

# Compose all subgraphs into gateway.docker.fgp
fusion compose -p gateway.docker.fgp -s ../Services/CustomerService
fusion compose -p gateway.docker.fgp -s ../Services/SpendingService
fusion compose -p gateway.docker.fgp -s ../Services/TransactionService
```

This merges all schemas into a single `gateway.docker.fgp` file that the gateway will automatically use in Docker.

**Quick Script:**

Alternatively, use the provided script:
```bash
cd codebase/devops/docker
./generate-gateway-config.sh
```

**Verification:**

After starting Docker Compose, check the gateway logs:
```bash
docker-compose logs gateway
```

The gateway should successfully connect to all services. If you see connection errors:
- Verify all services are healthy: `docker-compose ps`
- Check service names match exactly (case-sensitive)
- Ensure all services are on the same network

### Frontend cannot connect to Gateway

- Ensure the gateway is running and healthy
- Check that CORS is properly configured in the gateway
- Verify the nginx proxy configuration in `frontend/nginx.conf`

## Note

The build context is set to `../../src` to reference the source code directory. Make sure you're running docker-compose from the `codebase/devops/docker` directory.

