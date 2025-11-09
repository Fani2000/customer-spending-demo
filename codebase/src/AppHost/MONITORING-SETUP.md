# Monitoring Setup for Aspire (Local Development)

This document explains how monitoring (Prometheus and Grafana) is configured for local Aspire development vs Docker Compose.

## Configuration Overview

### Local Aspire Development
- **Services**: Run as processes on `localhost` with dynamic ports assigned by Aspire
- **Prometheus**: Runs in a Docker container, accesses services via `host.docker.internal`
- **Grafana**: Runs in a Docker container, accesses Prometheus via `host.docker.internal:9090`
- **Configuration File**: `codebase/src/AppHost/prometheus.yml`

### Docker Compose
- **Services**: Run in Docker containers with fixed service names
- **Prometheus**: Runs in a Docker container, accesses services via Docker service names (e.g., `gateway:8080`)
- **Grafana**: Runs in a Docker container, accesses Prometheus via `prometheus:9090`
- **Configuration File**: `codebase/devops/docker/monitoring/prometheus/prometheus.yml`

## Important: Dynamic Ports in Aspire

When running locally with Aspire, services are assigned **dynamic ports** by Aspire. The ports in `prometheus.yml` are initial estimates and may need to be updated.

### How to Find Actual Ports

1. **Start the Aspire AppHost**:
   ```bash
   cd codebase/src/AppHost
   dotnet run
   ```

2. **Open Aspire Dashboard**: Usually at `http://localhost:15016` (check console output)

3. **Find Service Ports**: In the Aspire Dashboard, click on each service to see its assigned port

4. **Update Prometheus Config**: Edit `codebase/src/AppHost/prometheus.yml` and update the ports:
   ```yaml
   - job_name: 'gateway'
     static_configs:
       - targets: ['host.docker.internal:5098']  # Replace 5098 with actual port
   ```

## Current Configuration

### Prometheus Targets (Local Aspire)
- Gateway: `host.docker.internal:5098` (check Aspire Dashboard for actual port)
- Customer Service: `host.docker.internal:5001` (check Aspire Dashboard for actual port)
- Spending Service: `host.docker.internal:5002` (check Aspire Dashboard for actual port)
- Transaction Service: `host.docker.internal:5003` (check Aspire Dashboard for actual port)

### Grafana Datasource (Local Aspire)
- Prometheus URL: `http://host.docker.internal:9090`

## Access Points

### Local Aspire Development
- **Aspire Dashboard**: `http://localhost:15016` (or port shown in console)
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000` (check Aspire Dashboard for actual port)

### Docker Compose
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3001`

## Troubleshooting

### Prometheus Can't Scrape Services

**Problem**: Prometheus shows services as "DOWN" in targets

**Solution**:
1. Check Aspire Dashboard for actual service ports
2. Update `prometheus.yml` with correct ports
3. Restart Prometheus container (or restart AppHost)

### Grafana Can't Connect to Prometheus

**Problem**: Grafana shows "Data source is not working"

**Solution**:
1. Verify Prometheus is accessible: `http://localhost:9090`
2. Check Grafana datasource config: `codebase/src/AppHost/grafana/provisioning/datasources/prometheus.yml`
3. Ensure it uses `http://host.docker.internal:9090` for local Aspire

### Services Not Exposing Metrics

**Problem**: No metrics appear in Prometheus

**Solution**:
1. Verify services have Prometheus metrics enabled
2. Check `/metrics` endpoint: `http://localhost:<service-port>/metrics`
3. Ensure `prometheus-net.AspNetCore` package is installed
4. Verify `UseMetricServer()` and `UseHttpMetrics()` are called in `Program.cs`

## Differences: Local vs Docker

| Aspect | Local Aspire | Docker Compose |
|--------|-------------|----------------|
| Service Access | `host.docker.internal:<port>` | `<service-name>:8080` |
| Prometheus URL (Grafana) | `host.docker.internal:9090` | `prometheus:9090` |
| Port Assignment | Dynamic (check Aspire Dashboard) | Fixed (see docker-compose.yml) |
| Configuration File | `AppHost/prometheus.yml` | `devops/docker/monitoring/prometheus/prometheus.yml` |

## Next Steps

1. **Run Aspire AppHost**: `dotnet run` from `AppHost` directory
2. **Check Ports**: Open Aspire Dashboard and note service ports
3. **Update Config**: Edit `prometheus.yml` with actual ports if needed
4. **Access Monitoring**: 
   - Prometheus: http://localhost:9090
   - Grafana: Check Aspire Dashboard for port (typically 3000)

For Docker Compose setup, see: `codebase/devops/docker/MONITORING.md`

