#!/bin/bash
# Healthcare Dashboard — Full Deploy Script
# Usage: bash deploy.sh [docker|k8s|all]

MODE=${1:-docker}

echo "=== Healthcare Dashboard Deploy: $MODE ==="

if [ "$MODE" = "docker" ] || [ "$MODE" = "all" ]; then
  echo ""
  echo "── Phase 3: Docker ─────────────────────────"
  docker-compose down --remove-orphans
  docker-compose build --no-cache
  docker-compose up -d
  echo "✓ Docker: http://localhost"
  echo "✓ API:    http://localhost:5000/api/health"
fi

if [ "$MODE" = "k8s" ] || [ "$MODE" = "all" ]; then
  echo ""
  echo "── Phase 4: Kubernetes ──────────────────────"

  # Build images into local registry (K3s/minikube)
  docker build -t healthcare-backend:latest ./backend
  docker build -t healthcare-frontend:latest -f Dockerfile.frontend .

  kubectl apply -f k8s/namespace.yaml
  kubectl apply -f k8s/mysql.yaml
  echo "Waiting for MySQL..."
  kubectl wait --for=condition=ready pod -l app=mysql -n healthcare --timeout=120s
  kubectl apply -f k8s/backend.yaml
  kubectl apply -f k8s/frontend.yaml
  kubectl apply -f k8s/ingress.yaml

  echo ""
  echo "── Phase 5: Monitoring ──────────────────────"
  kubectl apply -f k8s/monitoring/prometheus.yaml
  kubectl apply -f k8s/monitoring/grafana.yaml
  kubectl apply -f k8s/monitoring/loki.yaml

  echo ""
  echo "── Phase 6: Security ────────────────────────"
  kubectl apply -f k8s/security/rbac.yaml
  kubectl apply -f k8s/security/network-policy.yaml

  echo ""
  echo "✓ All pods:"
  kubectl get pods -n healthcare
  echo ""
  echo "✓ Grafana: kubectl port-forward svc/grafana 3000:3000 -n healthcare"
  echo "✓ Prometheus: kubectl port-forward svc/prometheus 9090:9090 -n healthcare"
fi
