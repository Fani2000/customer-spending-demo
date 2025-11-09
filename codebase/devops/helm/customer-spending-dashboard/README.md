# Customer Spending Dashboard Helm Chart

This Helm chart deploys the Customer Spending Dashboard microservices application to Kubernetes.

## Prerequisites

- Kubernetes 1.24+
- Helm 3.8+
- kubectl configured to access your Kubernetes cluster
- Container registry with application images

## Installation

### Development Environment

```bash
# Install with development values
helm install customer-spending-dashboard . \
  --namespace customer-spending-dev \
  --create-namespace \
  -f values-dev.yaml
```

### Production Environment

```bash
# Install with production values
helm install customer-spending-dashboard . \
  --namespace customer-spending-prod \
  --create-namespace \
  -f values-prod.yaml
```

## Configuration

The chart supports multiple configuration files:

- `values.yaml` - Default values
- `values-dev.yaml` - Development environment overrides
- `values-prod.yaml` - Production environment overrides

### Key Configuration Options

#### Image Registry

Set the image registry in `values.yaml` or override via command line:

```bash
helm install customer-spending-dashboard . \
  --set global.imageRegistry=acr.azurecr.io
```

#### Database Connection

For production, configure the database connection string:

```bash
helm install customer-spending-dashboard . \
  --set configMap.database.connectionString="Host=your-db-host;Port=5432;Database=customerdb;Username=user;Password=pass"
```

#### Secrets

Secrets should be managed via external secret management (e.g., Azure Key Vault):

```bash
# Create secret manually
kubectl create secret generic customer-spending-dashboard-secrets \
  --from-literal=postgres-password='your-password' \
  -n customer-spending-prod
```

## Upgrading

```bash
# Upgrade with new values
helm upgrade customer-spending-dashboard . \
  --namespace customer-spending-prod \
  -f values-prod.yaml
```

## Uninstalling

```bash
helm uninstall customer-spending-dashboard \
  --namespace customer-spending-prod
```

## Components

The chart deploys the following components:

- **PostgreSQL**: Database (can be disabled if using managed database)
- **Customer Service**: GraphQL service for customer profiles
- **Spending Service**: GraphQL service for spending analytics
- **Transaction Service**: GraphQL service for transactions and goals
- **Gateway**: HotChocolate Fusion Gateway
- **Frontend**: React frontend application
- **Ingress**: NGINX ingress controller configuration
- **HPA**: Horizontal Pod Autoscalers for all services
- **PDB**: Pod Disruption Budgets for high availability

## Service Endpoints

After installation, services are available at:

- **Frontend**: Configured via Ingress
- **GraphQL Gateway**: `/graphql` endpoint via Ingress
- **Backend Services**: Internal ClusterIP services

## Scaling

All services support horizontal pod autoscaling. Configure in `values.yaml`:

```yaml
customerService:
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
```

## Monitoring

Enable ServiceMonitor for Prometheus:

```yaml
serviceMonitor:
  enabled: true
```

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n customer-spending-prod
```

### View Logs

```bash
# Gateway logs
kubectl logs -f deployment/customer-spending-dashboard-gateway -n customer-spending-prod

# Customer Service logs
kubectl logs -f deployment/customer-spending-dashboard-customer-service -n customer-spending-prod
```

### Check Service Endpoints

```bash
kubectl get svc -n customer-spending-prod
```

### Describe Pod for Issues

```bash
kubectl describe pod <pod-name> -n customer-spending-prod
```

## Production Considerations

1. **Use Managed Database**: Disable PostgreSQL in Helm chart and use Azure Database for PostgreSQL
2. **Image Tags**: Use specific version tags instead of `latest`
3. **Secrets Management**: Use Azure Key Vault or similar for secrets
4. **Resource Limits**: Adjust based on actual usage patterns
5. **Monitoring**: Enable ServiceMonitor and configure alerts
6. **Backup**: Configure database backups
7. **SSL/TLS**: Configure proper TLS certificates via cert-manager
8. **Network Policies**: Enable network policies for security

## Values Reference

See `values.yaml` for all available configuration options.

