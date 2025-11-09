# Monitoring Setup

This document describes the monitoring setup for the Customer Spending Dashboard application using Prometheus and Grafana.

## Overview

The monitoring stack includes:
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards

## Access Points

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin` (change in production!)

## Prometheus Configuration

Prometheus is configured to scrape metrics from:
- Gateway service (`/metrics` endpoint)
- Customer Service (`/metrics` endpoint)
- Spending Service (`/metrics` endpoint)
- Transaction Service (`/metrics` endpoint)
- Prometheus itself

Configuration file: `monitoring/prometheus/prometheus.yml`

### Metrics Endpoints

All .NET services expose Prometheus metrics at `/metrics` endpoint. Ensure your services have Prometheus metrics enabled:

```csharp
// In Program.cs
builder.Services.AddPrometheusMetrics();
app.UseMetricServer(); // Exposes /metrics endpoint
```

## Grafana Dashboards

Pre-configured dashboards are available:

1. **Customer Spending Dashboard - Overview**
   - Request rates
   - Response times (p95, p99)
   - Error rates
   - CPU and memory usage
   - Active connections

2. **Customer Spending Dashboard - Services**
   - Per-service metrics
   - Gateway-specific metrics
   - Backend services metrics
   - Service health status

### Adding Custom Dashboards

1. Access Grafana at http://localhost:3001
2. Login with admin/admin
3. Go to Dashboards → Import
4. Create or import dashboard JSON
5. Save to `/var/lib/grafana/dashboards` for persistence

## Key Metrics

### Application Metrics

- `http_requests_received_total`: Total HTTP requests
- `http_request_duration_seconds`: Request duration histogram
- `http_requests_received_total{status_code=~"5.."}`: Error rate

### System Metrics

- `process_cpu_seconds_total`: CPU usage
- `process_working_set_bytes`: Memory usage
- `process_open_handles`: Open file handles

### GraphQL Metrics (if available)

- `hotchocolate_*`: HotChocolate GraphQL metrics
- Query execution times
- Query complexity
- Error rates

## Prometheus Retention

- **Development**: 48 hours
- **Production**: 30 days (720h)

## Grafana Data Persistence

Grafana dashboards and configuration are persisted in a Docker volume:
- Volume: `grafana_data`
- Location: `/var/lib/grafana`

## Troubleshooting

### Prometheus not scraping metrics

1. Check if services expose `/metrics` endpoint:
   ```bash
   curl http://localhost:5000/metrics  # Gateway
   curl http://localhost:5001/metrics  # Customer Service
   ```

2. Verify Prometheus targets:
   - Go to http://localhost:9090/targets
   - Check if all targets are "UP"

3. Check Prometheus logs:
   ```bash
   docker-compose logs prometheus
   ```

### Grafana not showing data

1. Verify Prometheus datasource:
   - Go to Grafana → Configuration → Data Sources
   - Test the Prometheus connection

2. Check datasource URL:
   - Should be: `http://prometheus:9090` (internal Docker network)

3. Verify metrics exist in Prometheus:
   - Go to http://localhost:9090
   - Query: `up` to see available targets

### Services not exposing metrics

Ensure your .NET services have Prometheus metrics enabled. Add to `Program.cs`:

```csharp
using Prometheus;

// Add metrics
builder.Services.AddPrometheusMetrics();

var app = builder.Build();

// Expose metrics endpoint
app.UseMetricServer();
app.UseHttpMetrics();
```

## Production Considerations

1. **Change Grafana Admin Password**: Update in `docker-compose.yml` or use secrets
2. **Increase Retention**: Adjust `storage.tsdb.retention.time` in Prometheus config
3. **Resource Limits**: Monitor Prometheus and Grafana resource usage
4. **Backup**: Regularly backup Grafana dashboards and Prometheus data
5. **Alerting**: Configure Prometheus Alertmanager for production alerts

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [.NET Prometheus Metrics](https://github.com/prometheus-net/prometheus-net)

