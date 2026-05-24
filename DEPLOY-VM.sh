#!/bin/bash
# HealthAI Production Deployment Script
# Run this on Oracle Cloud Ubuntu VM (paste in terminal)

echo "============================================"
echo "  HealthAI Production Setup Starting..."
echo "============================================"

# 1. Install Docker
echo "[1/6] Installing Docker..."
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. Install K3s (Lightweight Kubernetes)
echo "[2/6] Installing K3s..."
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
echo "export KUBECONFIG=/etc/rancher/k3s/k3s.yaml" >> ~/.bashrc

# Wait for K3s to be ready
echo "Waiting for K3s to start..."
sleep 15

# 3. Clone project
echo "[3/6] Cloning project..."
git clone https://github.com/artisingh3106/healthcare-dashboard.git || true
cd healthcare-dashboard 2>/dev/null || cd /tmp

# 4. Create namespace
echo "[4/6] Creating Kubernetes namespace..."
kubectl create namespace healthcare --dry-run=client -o yaml | kubectl apply -f -

# 5. Create MySQL secret
echo "[5/6] Creating secrets..."
kubectl create secret generic mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=root \
  --namespace=healthcare \
  --dry-run=client -o yaml | kubectl apply -f -

# 6. Apply all K8s manifests
echo "[6/6] Deploying all services..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql-init-configmap.yaml
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/monitoring/prometheus.yaml
kubectl apply -f k8s/monitoring/grafana.yaml

echo ""
echo "============================================"
echo "  Waiting for pods to start (2 min)..."
echo "============================================"
sleep 120

echo ""
echo "=== POD STATUS ==="
kubectl get pods -n healthcare

echo ""
echo "=== SERVICES ==="
kubectl get svc -n healthcare

echo ""
echo "============================================"
echo "  DEPLOYMENT COMPLETE!"
echo "  Access your app at: http://$(curl -s ifconfig.me)"
echo "============================================"
