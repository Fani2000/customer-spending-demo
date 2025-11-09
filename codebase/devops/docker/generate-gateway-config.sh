#!/bin/bash
# Script to generate gateway.docker.fgp file for Docker Compose
# Based on HotChocolate Fusion documentation: https://chillicream.com/docs/fusion/v15/quick-start

set -e

# Cleanup function to restore original configs on exit
cleanup() {
    echo ""
    echo "Cleaning up..."
    SERVICES=("CustomerService" "SpendingService" "TransactionService")
    PROJECT_ROOT="$(cd "$(dirname "$0")/../../src" && pwd)"
    
    for SERVICE in "${SERVICES[@]}"; do
        SERVICE_DIR="$PROJECT_ROOT/Services/$SERVICE"
        if [ -f "$SERVICE_DIR/subgraph-config.json.backup" ]; then
            mv "$SERVICE_DIR/subgraph-config.json.backup" "$SERVICE_DIR/subgraph-config.json"
            echo "✓ Restored $SERVICE subgraph-config.json"
        fi
    done
}

# Register cleanup function
trap cleanup EXIT

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
echo "Step 2: Updating subgraph-config.json for Docker..."
echo "----------------------------------------"

# Backup and update subgraph-config.json files for Docker
declare -A SERVICE_NAMES
SERVICE_NAMES["CustomerService"]="customer-service"
SERVICE_NAMES["SpendingService"]="spending-service"
SERVICE_NAMES["TransactionService"]="transaction-service"

# Backup original configs and update for Docker
for SERVICE in "${SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/Services/$SERVICE"
    if [ -d "$SERVICE_DIR" ] && [ -f "$SERVICE_DIR/subgraph-config.json" ]; then
        # Backup original config
        cp "$SERVICE_DIR/subgraph-config.json" "$SERVICE_DIR/subgraph-config.json.backup"
        
        # Update with Docker service name
        SERVICE_NAME="${SERVICE_NAMES[$SERVICE]}"
        cat > "$SERVICE_DIR/subgraph-config.json" <<EOF
{
  "subgraph": "$SERVICE",
  "http": {
    "baseAddress": "http://$SERVICE_NAME:8080/graphql"
  }
}
EOF
        echo "✓ Updated $SERVICE subgraph-config.json for Docker"
    fi
done

echo ""
echo "Step 3: Packing subgraphs..."
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
echo "Step 4: Composing gateway schema..."
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
echo "Step 5: Restoring original subgraph-config.json files..."
echo "----------------------------------------"

# Restore original configs (cleanup will also run via trap, but we do it explicitly here)
SERVICES=("CustomerService" "SpendingService" "TransactionService")
for SERVICE in "${SERVICES[@]}"; do
    SERVICE_DIR="$PROJECT_ROOT/Services/$SERVICE"
    if [ -f "$SERVICE_DIR/subgraph-config.json.backup" ]; then
        mv "$SERVICE_DIR/subgraph-config.json.backup" "$SERVICE_DIR/subgraph-config.json"
        echo "✓ Restored $SERVICE subgraph-config.json"
    fi
done

# Disable cleanup trap since we've already restored
trap - EXIT

echo ""
echo "=========================================="
if [ -f "$GATEWAY_DIR/gateway.docker.fgp" ]; then
    echo "✓ Gateway configuration generated successfully!"
    echo "  File: $GATEWAY_DIR/gateway.docker.fgp"
    echo ""
    echo "The gateway will automatically use this file when running in Docker."
    echo ""
    echo "Note: subgraph-config.json files have been restored to localhost for local development."
else
    echo "✗ Failed to generate gateway.docker.fgp"
    echo "  Please check the errors above and ensure:"
    echo "  1. All services have subgraph-config.json files"
    echo "  2. All services can export their schemas"
    echo "  3. Fusion CLI tool is installed"
    exit 1
fi
echo "=========================================="
