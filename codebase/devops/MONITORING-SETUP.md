# Monitoring Setup Guide

This guide explains how to enable and configure monitoring for the Customer Spending Dashboard application using Prometheus and Grafana.

## Overview

The monitoring stack provides:
- **Metrics Collection**: Prometheus scrapes metrics from all services
- **Visualization**: Grafana dashboards for metrics visualization
- **Alerting**: (Optional) Prometheus Alertmanager for alerts

## Docker Compose Setup

### Quick Start

Monitoring is automatically included when using the convenience script:

```bash
cd codebase/devops/docker
./start.sh
```

This starts:
- Prometheus on http://localhost:9090
- Grafana on http://localhost:3001 (admin/admin)

### Manual Setup

Monitoring services are included in `docker-compose.yml`. They start automatically with:

```bash
docker-compose up -d
```

## Kubernetes/Helm Setup

### Enable Monitoring

Monitoring is enabled by default in the Helm chart. To disable:

```yaml
prometheus:
  enabled: false

grafana:
  enabled: false
```

### Access Monitoring Services

Use port forwarding to access Prometheus and Grafana:

```bash
# Prometheus
kubectl port-forward svc/customer-spending-dashboard-prometheus 9090:9090 -n customer-spending-prod

# Grafana
kubectl port-forward svc/customer-spending-dashboard-grafana 3001:3000 -n customer-spending-prod
```

## Enabling Metrics in .NET Services

To expose Prometheus metrics from your .NET services, add the following to each service's `Program.cs`:

### Option 1: Using prometheus-net (Recommended)

1. Add the NuGet package:
   ```xml
   <PackageReference Include="prometheus-net.AspNetCore" Version="8.2.1" />
   ```

2. Update `Program.cs`:
   ```csharp
   using Prometheus;

   var builder = WebApplication.CreateBuilder(args);
   
   // Add Prometheus metrics
   builder.Services.AddPrometheusMetrics();
   
   // ... existing code ...
   
   var app = builder.Build();
   
   // Expose metrics endpoint
   app.UseMetricServer(); // Exposes /metrics endpoint
   app.UseHttpMetrics();  // Tracks HTTP metrics
   
   // ... rest of middleware ...
   
   app.Run();
   ```

### Option 2: Using HotChocolate Diagnostics

HotChocolate already includes diagnostics. Ensure it's enabled:

```csharp
builder.Services
    .AddGraphQL()
    .AddDiagnostics()  // Enable diagnostics
    // ... rest of configuration
```

## Available Metrics

Once metrics are enabled, services expose:

### HTTP Metrics
- `http_requests_received_total`: Total HTTP requests
- `http_request_duration_seconds`: Request duration histogram
- `http_requests_received_total{status_code=~"5.."}`: Error rate

### System Metrics
- `process_cpu_seconds_total`: CPU usage
- `process_working_set_bytes`: Memory usage
- `process_open_handles`: Open file handles

### GraphQL Metrics (HotChocolate)
- `hotchocolate_*`: Various GraphQL operation metrics
- Query execution times
- Query complexity
- Error rates

## Grafana Dashboards

### Pre-configured Dashboards

1. **Customer Spending Dashboard - Overview**
   - Overall system metrics
   - Request rates and response times
   - Error rates
   - Resource usage

2. **Customer Spending Dashboard - Services**
   - Per-service metrics
   - Gateway-specific metrics
   - Backend service health

### Creating Custom Dashboards

1. Access Grafana at http://localhost:3001
2. Login with admin/admin
3. Go to Dashboards → New Dashboard
4. Add panels with Prometheus queries
5. Save dashboard

### Example Queries

**Request Rate:**
```promql
rate(http_requests_received_total[5m])
```

**Response Time (p95):**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Error Rate:**
```promql
rate(http_requests_received_total{status_code=~"5.."}[5m])
```

**CPU Usage:**
```promql
rate(process_cpu_seconds_total[5m]) * 100
```

**Memory Usage:**
```promql
process_working_set_bytes / 1024 / 1024
```

## Prometheus Configuration

### Scrape Configuration

Prometheus is configured to scrape metrics from:
- Gateway: `gateway:8080/metrics`
- Customer Service: `customer-service:8080/metrics`
- Spending Service: `spending-service:8080/metrics`
- Transaction Service: `transaction-service:8080/metrics`

### Retention

- **Development**: 48 hours
- **Production**: 30 days (720h)

Configure in `values.yaml` or `values-prod.yaml`:

```yaml
prometheus:
  retention:
    time: "720h"  # 30 days
```

## ServiceMonitor (Kubernetes)

For Kubernetes deployments with Prometheus Operator, enable ServiceMonitor:

```yaml
serviceMonitor:
  enabled: true
```

This creates ServiceMonitor resources that Prometheus Operator automatically discovers.

## Troubleshooting

### Services not exposing metrics

1. Verify metrics endpoint is accessible:
   ```bash
   curl http://localhost:5000/metrics  # Gateway
   curl http://localhost:5001/metrics  # Customer Service
   ```

2. Check if Prometheus metrics package is installed
3. Verify `UseMetricServer()` is called in `Program.cs`

### Prometheus not scraping

1. Check Prometheus targets: http://localhost:9090/targets
2. Verify service names match in `prometheus.yml`
3. Check network connectivity between Prometheus and services
4. Review Prometheus logs: `docker-compose logs prometheus`

### Grafana not showing data

1. Verify Prometheus datasource:
   - Go to Configuration → Data Sources
   - Test connection to Prometheus
2. Check datasource URL (should be `http://prometheus:9090` in Docker)
3. Verify metrics exist in Prometheus:
   - Query: `up` in Prometheus UI
   - Should show all services as "UP"

## Production Considerations

1. **Change Grafana Admin Password**: Use secrets management
2. **Enable Authentication**: Configure OAuth or LDAP for Grafana
3. **Increase Retention**: Adjust based on storage capacity
4. **Resource Limits**: Monitor Prometheus and Grafana resource usage
5. **Backup**: Regularly backup Grafana dashboards and Prometheus data
6. **Alerting**: Configure Prometheus Alertmanager for production alerts
7. **TLS**: Use HTTPS for Prometheus and Grafana in production
8. **Network Policies**: Restrict access to monitoring services

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prometheus-net Documentation](https://github.com/prometheus-net/prometheus-net)
- [HotChocolate Diagnostics](https://chillicream.com/docs/hotchocolate/v13/server/diagnostics)

