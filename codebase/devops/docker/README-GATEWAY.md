# Gateway Configuration for Docker

The HotChocolate Fusion Gateway requires a `gateway.fgp` file to connect to subgraph services. When running in Docker Compose, the gateway needs to reference services by their Docker service names, not `localhost`.

## Problem

The default `gateway.fgp` file likely contains `localhost` references that don't work in Docker containers. Services in Docker communicate using service names (e.g., `customer-service`, `spending-service`).

## Solution

The Gateway has been updated to:
1. **Auto-detect Docker configuration**: It will look for `gateway.docker.fgp` first
2. **Use environment variables**: You can override service URLs via environment variables
3. **Fallback to default**: If no Docker-specific file exists, it uses the default `gateway.fgp`

## Quick Fix

### Option 1: Generate Docker-specific gateway.fgp

1. Copy the existing `gateway.fgp` file:
   ```bash
   cp codebase/src/Gateway/gateway.fgp codebase/src/Gateway/gateway.docker.fgp
   ```

2. Edit `gateway.docker.fgp` (if it's a text file) or regenerate it with Docker service names:
   - `http://customer-service:8080/graphql`
   - `http://spending-service:8080/graphql`
   - `http://transaction-service:8080/graphql`

### Option 2: Use Environment Variables

The Gateway now supports environment variables to override service URLs:

```yaml
# In docker-compose.yml
gateway:
  environment:
    - CUSTOMER_SERVICE_URL=http://customer-service:8080/graphql
    - SPENDING_SERVICE_URL=http://spending-service:8080/graphql
    - TRANSACTION_SERVICE_URL=http://transaction-service:8080/graphql
```

### Option 3: Regenerate gateway.fgp with Docker Service Names (Recommended)

Follow the [official Fusion documentation](https://chillicream.com/docs/fusion/v15/quick-start) to properly generate the gateway configuration:

**Prerequisites:**
```bash
dotnet tool install -g HotChocolate.Fusion.CommandLine
```

**Step 1: Export Schemas**
```bash
# From each service directory
cd codebase/src/Services/CustomerService
dotnet run -- schema export --output schema.graphql

cd codebase/src/Services/SpendingService
dotnet run -- schema export --output schema.graphql

cd codebase/src/Services/TransactionService
dotnet run -- schema export --output schema.graphql
```

**Step 2: Pack Subgraphs**
```bash
# From each service directory
fusion subgraph pack
```

**Step 3: Compose Gateway**
```bash
cd codebase/src/Gateway
fusion compose -p gateway.docker.fgp -s ../Services/CustomerService
fusion compose -p gateway.docker.fgp -s ../Services/SpendingService
fusion compose -p gateway.docker.fgp -s ../Services/TransactionService
```

**Or use the automated script:**
```bash
cd codebase/devops/docker
./generate-gateway-config.sh
```

## Verification

After starting Docker Compose, check the gateway logs:

```bash
docker-compose logs gateway
```

The gateway should successfully connect to all three services. If you see connection errors, verify:
1. All services are healthy: `docker-compose ps`
2. Services are on the same network: `docker network inspect <network-name>`
3. Service names match exactly (case-sensitive)

## Troubleshooting

### Gateway fails to start
- Check if `gateway.fgp` or `gateway.docker.fgp` exists
- Verify the file is copied into the Docker image (check Dockerfile)

### Gateway can't connect to services
- Ensure services are healthy before gateway starts
- Verify service names in gateway configuration match Docker service names exactly
- Check network connectivity: `docker-compose exec gateway curl http://customer-service:8080/graphql`

### Services not found
- Verify all services are on the same Docker network (`app-network`)
- Check service names in `docker-compose.yml` match the gateway configuration

