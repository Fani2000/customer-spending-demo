#!/bin/bash
# Convenience script to generate gateway configuration and start Docker Compose
# Usage: ./start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "Customer Spending Dashboard - Docker Setup"
echo "=========================================="
echo ""

# Check if gateway configuration exists
GATEWAY_CONFIG="../../src/Gateway/gateway.docker.fgp"
if [ ! -f "$GATEWAY_CONFIG" ]; then
    echo "Gateway configuration not found. Generating..."
    echo ""
    
    if [ -f "./generate-gateway-config.sh" ]; then
        chmod +x ./generate-gateway-config.sh
        ./generate-gateway-config.sh
    else
        echo "Error: generate-gateway-config.sh not found!"
        echo "Please run: cd codebase/devops/docker && ./generate-gateway-config.sh"
        exit 1
    fi
    
    if [ ! -f "$GATEWAY_CONFIG" ]; then
        echo ""
        echo "Warning: Gateway configuration generation may have failed."
        echo "The gateway may not start correctly. Continuing anyway..."
        echo ""
    else
        echo "✓ Gateway configuration generated successfully!"
        echo ""
    fi
else
    echo "✓ Gateway configuration found: $GATEWAY_CONFIG"
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "Starting Docker Compose services..."
echo ""

# Start services in detached mode with build
docker-compose up -d --build

echo ""
echo "=========================================="
echo "Services are starting..."
echo "=========================================="
echo ""
echo "Waiting for services to be healthy..."
sleep 5

# Check service status
echo ""
echo "Service Status:"
docker-compose ps

echo ""
echo "=========================================="
echo "Access Points:"
echo "=========================================="
echo "Frontend:              http://localhost:3000"
echo "GraphQL Gateway:       http://localhost:5000/graphql"
echo "Customer Service:      http://localhost:5001/graphql"
echo "Spending Service:      http://localhost:5002/graphql"
echo "Transaction Service:   http://localhost:5003/graphql"
echo "PostgreSQL:            localhost:5432"
echo "Prometheus:            http://localhost:9090"
echo "Grafana:               http://localhost:3001 (admin/admin)"
echo ""
echo "View logs:             docker-compose logs -f [service-name]"
echo "Stop services:         docker-compose down"
echo "=========================================="

