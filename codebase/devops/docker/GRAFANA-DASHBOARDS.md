# Accessing Grafana Dashboards in Docker Compose

This guide explains how to access and view the pre-configured Grafana dashboards when running the application with Docker Compose.

## Quick Access Steps

### 1. Access Grafana
1. Open your web browser
2. Navigate to: **http://localhost:3001**
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin`

### 2. View Dashboards

#### Option A: Browse Dashboards (Recommended)
1. After logging in, click on the **☰ (Menu)** icon in the top-left corner
2. Navigate to **Dashboards** → **Browse**
3. You should see:
   - **Customer Spending Dashboard - Overview**
   - **Customer Spending Dashboard - Services**
4. Click on any dashboard to view it

#### Option B: Search Dashboards
1. Click on the **Search** icon (magnifying glass) in the left sidebar
2. Type "Customer Spending" in the search box
3. Select the dashboard you want to view

#### Option C: Direct URL
- Overview Dashboard: http://localhost:3001/d/customer-spending-dashboard-overview
- Services Dashboard: http://localhost:3001/d/customer-spending-dashboard-services

## Troubleshooting: Dashboards Not Showing

If the dashboards are not visible, follow these steps:

### Step 1: Verify Dashboard Files Exist
```bash
# Check if dashboard files are present
ls -la codebase/devops/docker/monitoring/grafana/dashboards/
```

You should see:
- `customer-spending-overview.json`
- `customer-spending-services.json`

### Step 2: Check Grafana Logs
```bash
# View Grafana container logs
docker-compose logs grafana
```

Look for any errors related to dashboard provisioning. Common issues:
- File permission errors
- JSON parsing errors
- Path not found errors

### Step 3: Verify Volume Mounts
```bash
# Check if volumes are mounted correctly
docker exec grafana ls -la /var/lib/grafana/dashboards
```

You should see the JSON files listed.

### Step 4: Check Provisioning Configuration
```bash
# Verify provisioning config is correct
docker exec grafana cat /etc/grafana/provisioning/dashboards/dashboard.yml
```

### Step 5: Restart Grafana
If dashboards still don't appear:
```bash
# Restart Grafana container
docker-compose restart grafana

# Wait a few seconds, then check logs
docker-compose logs grafana | tail -20
```

### Step 6: Manual Import (If Auto-Provisioning Fails)

If automatic provisioning doesn't work, you can manually import the dashboards:

1. **Access Grafana**: http://localhost:3001
2. **Login**: admin/admin
3. **Go to**: Dashboards → Import
4. **Import Dashboard**:
   - Click **Upload JSON file**
   - Navigate to: `codebase/devops/docker/monitoring/grafana/dashboards/`
   - Select `customer-spending-overview.json`
   - Click **Load**
   - Select **Prometheus** as the datasource
   - Click **Import**
5. **Repeat** for `customer-spending-services.json`

### Step 7: Verify Prometheus Connection

Before dashboards can show data, ensure Prometheus is connected:

1. In Grafana, go to **Configuration** → **Data Sources**
2. Click on **Prometheus**
3. Click **Test** - it should show "Data source is working"
4. If it fails, check:
   - Prometheus is running: `docker-compose ps prometheus`
   - Prometheus is accessible: http://localhost:9090
   - Network connectivity between Grafana and Prometheus

## Dashboard Details

### Customer Spending Dashboard - Overview
This dashboard provides:
- **HTTP Request Rate**: Requests per second across all services
- **HTTP Response Time**: p95 and p99 latency metrics
- **HTTP Error Rate**: 5xx error rates
- **Active HTTP Requests**: Current active requests
- **CPU Usage**: CPU utilization per service
- **Memory Usage**: Memory consumption per service
- **Service Health Status**: Up/Down status for all services

### Customer Spending Dashboard - Services
This dashboard provides:
- **Gateway Metrics**: Request rate and response times for the Gateway
- **Backend Services Metrics**: Combined metrics for Customer, Spending, and Transaction services
- **Error Rate by Service**: Error rates broken down by service
- **Service Health Status**: Individual health status for each service

## Expected Behavior

Once everything is working correctly:
1. Dashboards should appear automatically in the **Browse** section
2. Dashboards should refresh every 30 seconds
3. Metrics should start appearing once services are generating traffic
4. If no data appears, wait a few minutes for Prometheus to collect metrics

## Common Issues and Solutions

### Issue: "No data" in dashboards
**Solution**: 
- Ensure services are running and generating traffic
- Check Prometheus targets: http://localhost:9090/targets
- Verify services expose `/metrics` endpoint
- Wait a few minutes for metrics to accumulate

### Issue: "Datasource not found"
**Solution**:
- Check datasource provisioning: `docker exec grafana cat /etc/grafana/provisioning/datasources/prometheus.yml`
- Restart Grafana: `docker-compose restart grafana`
- Manually add Prometheus datasource if needed

### Issue: Dashboards don't appear after restart
**Solution**:
- Check file permissions on dashboard JSON files
- Verify volume mounts in docker-compose.yml
- Check Grafana logs for provisioning errors
- Try manual import as a workaround

## Verification Commands

Run these commands to verify everything is set up correctly:

```bash
# Check all services are running
docker-compose ps

# Check Grafana is running
docker-compose ps grafana

# Check Prometheus is running
docker-compose ps prometheus

# View Grafana logs
docker-compose logs grafana

# Check dashboard files in container
docker exec grafana ls -la /var/lib/grafana/dashboards/

# Check provisioning config
docker exec grafana cat /etc/grafana/provisioning/dashboards/dashboard.yml

# Test Prometheus connectivity from Grafana
docker exec grafana wget -qO- http://prometheus:9090/api/v1/status/config
```

## Next Steps

Once dashboards are visible:
1. **Explore Metrics**: Click through different panels to see detailed metrics
2. **Customize Dashboards**: Edit dashboards to add more panels or modify queries
3. **Set Up Alerts**: Configure alerting rules in Prometheus or Grafana
4. **Create Custom Dashboards**: Build additional dashboards for specific use cases

For more information, see [MONITORING.md](./MONITORING.md).

