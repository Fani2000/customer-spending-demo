#!/bin/bash
# Script to generate gateway.docker.fgp file for Docker Compose
# Based on HotChocolate Fusion documentation: https://chillicream.com/docs/fusion/v15/quick-start

set -e

echo "=========================================="
echo "Generating gateway.docker.fgp for Docker"
echo "=========================================="

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../src" && pwd)"

# Check if Fusion CLI is installed
if ! command -v fusion &> /dev/null; then
    echo "Installing HotChocolate Fusion CLI tool..."
    dotnet tool install -g HotChocolate.Fusion.CommandLine
    echo "Fusion CLI installed successfully!"
fi

echo ""
echo "Step 1: Exporting schemas from services..."
echo "----------------------------------------"

# Export schemas from each service
SERVICES=("CustomerService" "SpendingService" "TransactionService")

for SERVICE in "${SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/Services/$SERVICE"
    echo "Exporting schema from $SERVICE..."
    
    if [ -d "$SERVICE_DIR" ]; then
        cd "$SERVICE_DIR"
        # Export schema (this requires the service to be buildable)
        dotnet run --no-build -- schema export --output schema.graphql 2>/dev/null || \
        dotnet build > /dev/null 2>&1 && dotnet run -- schema export --output schema.graphql || \
        echo "Warning: Could not export schema from $SERVICE. Make sure the service builds successfully."
    else
        echo "Warning: Service directory not found: $SERVICE_DIR"
    fi
done

echo ""
echo "Step 2: Packing subgraphs..."
echo "----------------------------------------"

# Pack each subgraph
for SERVICE in "${SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/Services/$SERVICE"
    echo "Packing $SERVICE subgraph..."
    
    if [ -d "$SERVICE_DIR" ]; then
        cd "$SERVICE_DIR"
        if [ -f "subgraph-config.json" ] && [ -f "schema.graphql" ]; then
            fusion subgraph pack
            echo "✓ $SERVICE packed successfully"
        else
            echo "Warning: Missing subgraph-config.json or schema.graphql in $SERVICE"
        fi
    fi
done

echo ""
echo "Step 3: Composing gateway schema..."
echo "----------------------------------------"

# Compose the gateway
GATEWAY_DIR="$PROJECT_ROOT/Gateway"
cd "$GATEWAY_DIR"

# Remove existing gateway.docker.fgp if it exists
if [ -f "gateway.docker.fgp" ]; then
    rm "gateway.docker.fgp"
    echo "Removed existing gateway.docker.fgp"
fi

# Compose each subgraph into the gateway package
for SERVICE in "${SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/Services/$SERVICE"
    echo "Adding $SERVICE to gateway..."
    
    if [ -d "$SERVICE_DIR" ]; then
        fusion compose -p gateway.docker.fgp -s "$SERVICE_DIR"
        echo "✓ $SERVICE added to gateway"
    fi
done

echo ""
echo "=========================================="
if [ -f "$GATEWAY_DIR/gateway.docker.fgp" ]; then
    echo "✓ Gateway configuration generated successfully!"
    echo "  File: $GATEWAY_DIR/gateway.docker.fgp"
    echo ""
    echo "The gateway will automatically use this file when running in Docker."
else
    echo "✗ Failed to generate gateway.docker.fgp"
    echo "  Please check the errors above and ensure:"
    echo "  1. All services have subgraph-config.json files"
    echo "  2. All services can export their schemas"
    echo "  3. Fusion CLI tool is installed"
    exit 1
fi
echo "=========================================="
