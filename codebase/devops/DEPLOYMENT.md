# Deployment Guide

This guide covers deployment options for the Customer Spending Dashboard application.

## Deployment Options

### 1. Docker Compose (Local Development)

For local development and testing, use Docker Compose.

**Location**: `codebase/devops/docker/`

**Quick Start**:
```bash
cd codebase/devops/docker
docker-compose up --build
```

See [docker/README.md](./docker/README.md) for detailed instructions.

### 2. Kubernetes with Helm (Production)

For production deployments, use Helm charts to deploy to Kubernetes.

**Location**: `codebase/devops/helm/customer-spending-dashboard/`

**Quick Start**:

**Development**:
```bash
cd codebase/devops/helm/customer-spending-dashboard
helm install customer-spending-dashboard . \
  --namespace customer-spending-dev \
  --create-namespace \
  -f values-dev.yaml
```

**Production**:
```bash
cd codebase/devops/helm/customer-spending-dashboard
helm install customer-spending-dashboard . \
  --namespace customer-spending-prod \
  --create-namespace \
  -f values-prod.yaml
```

See [helm/customer-spending-dashboard/README.md](./helm/customer-spending-dashboard/README.md) for detailed instructions.

## Environment Configurations

### Development Environment

- **Replicas**: 1 per service (minimal resources)
- **Autoscaling**: Disabled
- **Database**: In-cluster PostgreSQL
- **Ingress**: HTTP only
- **Resources**: Lower limits for cost savings

### Production Environment

- **Replicas**: 3+ per service (high availability)
- **Autoscaling**: Enabled (3-10 replicas)
- **Database**: Managed PostgreSQL (Azure Database recommended)
- **Ingress**: HTTPS with TLS certificates
- **Resources**: Higher limits for performance
- **Monitoring**: ServiceMonitor enabled
- **Network Policies**: Enabled for security

## Prerequisites

### Docker Compose
- Docker Desktop or Docker Engine
- Docker Compose
- 4GB+ RAM available

### Kubernetes/Helm
- Kubernetes cluster (1.24+)
- Helm 3.8+
- kubectl configured
- Container registry with images
- (Optional) cert-manager for TLS
- (Optional) Prometheus for monitoring

## Building Docker Images

Before deploying to Kubernetes, build and push images to your container registry:

```bash
# Build images
cd codebase/src
docker build -t your-registry/customer-spending-gateway:latest -f Gateway/Dockerfile .
docker build -t your-registry/customer-spending-customer-service:latest -f Services/CustomerService/Dockerfile .
docker build -t your-registry/customer-spending-spending-service:latest -f Services/SpendingService/Dockerfile .
docker build -t your-registry/customer-spending-transaction-service:latest -f Services/TransactionService/Dockerfile .
docker build -t your-registry/customer-spending-frontend:latest -f frontend/Dockerfile ./frontend

# Push images
docker push your-registry/customer-spending-gateway:latest
docker push your-registry/customer-spending-customer-service:latest
docker push your-registry/customer-spending-spending-service:latest
docker push your-registry/customer-spending-transaction-service:latest
docker push your-registry/customer-spending-frontend:latest
```

## Configuration

### Environment Variables

Key environment variables to configure:

- `ASPNETCORE_ENVIRONMENT`: `Development` or `Production`
- `ConnectionStrings__DefaultConnection`: PostgreSQL connection string
- `Cors__AllowedOrigins`: Frontend origins for CORS
- `VITE_GRAPHQL_ENDPOINT`: GraphQL endpoint URL (frontend)

### Secrets Management

For production, use external secret management:

- **Azure Key Vault**: Recommended for Azure deployments
- **Kubernetes Secrets**: For simple deployments
- **External Secrets Operator**: For GitOps workflows

## Monitoring

### Health Checks

All services include:
- Liveness probes
- Readiness probes
- Health check endpoints

### Metrics

Enable ServiceMonitor for Prometheus:
```yaml
serviceMonitor:
  enabled: true
```

### Logging

- Structured logging via ASP.NET Core
- Log aggregation via Application Insights or similar

## Scaling

### Horizontal Pod Autoscaling

Configured in `values.yaml`:
```yaml
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

### Manual Scaling

```bash
kubectl scale deployment customer-spending-dashboard-gateway --replicas=5 -n customer-spending-prod
```

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n customer-spending-prod
```

### View Logs
```bash
kubectl logs -f deployment/customer-spending-dashboard-gateway -n customer-spending-prod
```

### Describe Resources
```bash
kubectl describe deployment customer-spending-dashboard-gateway -n customer-spending-prod
```

### Port Forward for Testing
```bash
kubectl port-forward svc/customer-spending-dashboard-gateway 5000:8080 -n customer-spending-prod
```

## Upgrading

### Docker Compose
```bash
cd codebase/devops/docker
docker-compose pull
docker-compose up -d
```

### Helm
```bash
helm upgrade customer-spending-dashboard ./helm/customer-spending-dashboard \
  --namespace customer-spending-prod \
  -f ./helm/customer-spending-dashboard/values-prod.yaml
```

## Rollback

### Helm Rollback
```bash
helm rollback customer-spending-dashboard -n customer-spending-prod
```

## Best Practices

1. **Use Specific Image Tags**: Avoid `latest` in production
2. **Managed Database**: Use Azure Database for PostgreSQL in production
3. **Secrets Management**: Never commit secrets to Git
4. **Resource Limits**: Set appropriate requests and limits
5. **Monitoring**: Enable comprehensive monitoring
6. **Backup**: Configure regular database backups
7. **Security**: Enable network policies and use TLS
8. **CI/CD**: Automate deployments via pipelines

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Helm Documentation](https://helm.sh/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)

