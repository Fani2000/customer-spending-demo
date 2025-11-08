# Deployment Plan — Docker to AKS (Azure)

This document visualizes the **deployment evolution** from Docker to Azure-managed services and finally to **Kubernetes (AKS)** using Mermaid diagrams. It focuses on infrastructure, CI/CD flow, runtime topology, **Helm chart structure**, and **Kubernetes networking design** for the **Customer Spending Insights** dashboard.

---

## 1. Phase 1 — Local Docker Setup

```mermaid
flowchart TB
  subgraph Local Environment
    F[Frontend Container React/Nginx] -->|API calls| B[Backend Container Node/Express]
    B --> D[(PostgreSQL Container)]
  end
```

**Notes:**

* Local development uses Docker Compose.
* Simplified single host deployment.
* Ideal for debugging, integration testing, and local development.

---

## 2. Phase 2 — Docker with Azure Services

```mermaid
flowchart LR
  subgraph Azure Cloud
    subgraph Managed Services
      DB[(Azure PostgreSQL Flexible Server)]
      R[(Azure Cache for Redis)]
      KV[(Azure Key Vault)]
      AI[(Azure Application Insights)]
    end

    subgraph Container Hosting
      FE[Azure App Service - Frontend Container]
      BE[Azure App Service - Backend Container]
      ACR[(Azure Container Registry)]
    end
  end

  Dev[Developer Workstation] -->|Push Docker Image| ACR
  FE -->|API Calls| BE
  BE -->|DB Connection| DB
  BE -->|Cache Calls| R
  BE -->|Secrets Fetch| KV
  BE -->|Telemetry| AI
```

**Highlights:**

* Each service runs as a container in **Azure App Service for Containers**.
* Azure-managed PostgreSQL handles persistence.
* Secrets stored securely in **Key Vault**.
* Observability via **Application Insights**.
* Images pushed to **Azure Container Registry (ACR)**.

---

## 3. Phase 3 — Transition to AKS (Azure Kubernetes Service)

```mermaid
flowchart LR
  Dev[CI/CD Pipeline] -->|Push Docker Images| ACR[(Azure Container Registry)]
  ACR --> AKSCluster[Azure Kubernetes Service AKS]

  subgraph AKSCluster
    subgraph Namespace: spendings
      FE[Deployment: Frontend Pods] -->|HTTP| BE[Deployment: Backend Pods]
      BE --> DBProxy[(DB Connection via Private Endpoint)]
      FE -->|Ingress Rule /app.example.com| ING[Ingress Controller NGINX]
    end
  end

  BE --> Redis[(Azure Cache for Redis)]
  BE --> KV[(Azure Key Vault CSI Mount)]
  BE --> PG[(Azure PostgreSQL Flexible Server)]
  AKSCluster -->|Logs & Metrics| AM[Azure Monitor for Containers]
```

**Highlights:**

* Frontend and backend are separate Deployments managed by Kubernetes.
* Ingress Controller (NGINX or AGIC) routes traffic to the correct service.
* **Secrets** pulled dynamically from **Key Vault** using CSI Driver.
* Telemetry and metrics go to **Azure Monitor**.
* PostgreSQL remains external but accessed privately via VNet/Private Link.

---

## 4. CI/CD Workflow Visualization

```mermaid
flowchart LR
  subgraph GitHub Actions / Azure Pipelines
    A[Commit to Main] --> B[Build & Test]
    B --> C[Build Docker Images]
    C --> D[Push to ACR]
    D --> E[Deploy to AKS via Helm]
  end

  E --> AKS[(AKS Cluster)]
  AKS --> Mon[Azure Monitor]
```

**Steps:**

1. Code pushed to main triggers CI pipeline.
2. CI builds & tests code, then builds Docker images.
3. Images pushed to Azure Container Registry.
4. CD deploys new version using **Helm** or `kubectl apply`.
5. Observability via Azure Monitor and Application Insights.

---

## 5. AKS Internal Topology (Detailed)

```mermaid
graph TD
  subgraph Azure Virtual Network
    subgraph AKS Namespace: spendings
      Ingress[Ingress Controller] --> FEsvc[Service: Frontend]
      FEsvc --> FEpods[Frontend Pods]
      Ingress --> BEsvc[Service: Backend]
      BEsvc --> BEpods[Backend Pods]
      BEpods --> PG[(PostgreSQL - Private Endpoint)]
      BEpods --> Redis[(Azure Redis Cache)]
      BEpods --> KV[(Azure Key Vault CSI Driver)]
    end
  end

  FEpods --> User[End User Browser]
  BEpods -->|Telemetry| AppInsights[(Azure Application Insights)]
  AKSNamespace[(Azure Namespace 'spendings')] -->|Monitoring| AM[Azure Monitor for Containers]
```

**Details:**

* Kubernetes handles replication, autoscaling (HPA), and service discovery.
* All outbound calls to managed Azure services are private and secured.
* Ingress provides HTTPS with Cert-Manager and Let's Encrypt.

---

## 6. Helm Chart Structure

```mermaid
graph TD
  subgraph Helm Chart: spendings
    values[values.yaml] --> templates
    Chart[Chart.yaml] --> templates
    subgraph templates
      deploy_backend[deployment-backend.yaml]
      svc_backend[service-backend.yaml]
      deploy_frontend[deployment-frontend.yaml]
      svc_frontend[service-frontend.yaml]
      ingress[ingress.yaml]
      configmap[configmap.yaml]
      secrets[secret.yaml]
    end
  end
```

**Explanation:**

* **Chart.yaml**: metadata (name, version, dependencies).
* **values.yaml**: default configs (replicas, image tags, URLs).
* **templates/**: YAML manifests rendered during deployment.
* Supports easy upgrades with `helm upgrade --install`.

---

## 7. Kubernetes Networking & Communication

```mermaid
flowchart LR
  subgraph Cluster
    Ingress[Ingress Controller] --> SvcFE[Service Frontend]
    SvcFE --> PodFE[Frontend Pods]
    Ingress --> SvcBE[Service Backend]
    SvcBE --> PodBE[Backend Pods]
  end

  PodFE -->|HTTP /api| SvcBE
  PodBE -->|TCP 5432| PG[(Azure PostgreSQL)]
  PodBE -->|6379| Redis[(Azure Redis Cache)]

  subgraph Security Layers
    NS[Network Policies]
    TLS[TLS Certificates via Cert-Manager]
  end

  SecurityLayers[Policies] -.-> SvcBE
  TLS -.-> Ingress
```

**Key points:**

* Each Service abstracts Pods behind stable endpoints.
* Ingress manages external routing & SSL termination.
* Network Policies enforce isolation between Pods.
* Backend Pods communicate with external Azure services through private endpoints.

---

## 8. Observability & Scaling

```mermaid
flowchart TB
  subgraph Monitoring Stack
    AppInsights[(Application Insights)] --> Dash[Dashboards & Alerts]
    AM[Azure Monitor for Containers] --> Dash
    Logs[Log Analytics Workspace] --> Dash
  end

  HPA[Horizontal Pod Autoscaler] --> AKSCluster[AKS Pods]
  Dash --> DevOps[DevOps Team]
```

**Notes:**

* Real-time metrics and alerts via Azure Monitor.
* HPA scales Pods automatically by CPU or request rate.
* Unified dashboards for app health, latency, and throughput.

---

## 9. Evolution Path Summary

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant Local as Local Docker
  participant Azure as Azure Services
  participant AKS as AKS Cluster

  Dev->>Local: docker compose up
  Local->>Azure: Push image to ACR
  Azure->>Azure: Run in App Service Containers
  Azure->>AKS: Migrate containers to Kubernetes Deployments
  AKS-->>Dev: Scalable, Observable, Modular Deployment
```

**Transition Strategy:**

1. **Start small** — Docker Compose for local testing.
2. **Move to Azure App Service** — run containers with minimal ops overhead.
3. **Gradually migrate to AKS** — as scaling and modularity demand grow.
4. **Automate pipelines** — build, deploy, and monitor continuously.

---

## 10. Phase Summary Table

| Phase | Infrastructure                     | Description             | Key Benefits                                 |
| ----- | ---------------------------------- | ----------------------- | -------------------------------------------- |
| 1     | **Docker Compose**                 | Local containers        | Fast iteration, isolated dev environment     |
| 2     | **Azure App Services + ACR**       | Containers in Azure     | Easy hosting, integrated monitoring          |
| 3     | **Azure Kubernetes Service (AKS)** | Orchestrated containers | Scalable, fault-tolerant, modular deployment |

---

**End of Document**
