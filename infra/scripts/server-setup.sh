#!/bin/bash
# Run once on a fresh 20i Cloud Server (Ubuntu 22.04 / 24.04)
# Usage: bash server-setup.sh <deploy-path> <github-repo-url>
# Example: bash server-setup.sh /var/www/shynlegal https://github.com/youruser/shynlegal.git

set -euo pipefail

DEPLOY_PATH="${1:-/var/www/shynlegal}"
REPO_URL="${2:-}"
DOMAIN="shynlegal.co.uk"

echo "═══════════════════════════════════════════"
echo "  SHYN Legal — 20i VPS Setup"
echo "═══════════════════════════════════════════"

# ── System update ──────────────────────────────────────
apt-get update && apt-get upgrade -y

# ── Docker ─────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker "$USER"
  systemctl enable docker
  systemctl start docker
fi

# ── Docker Compose plugin ──────────────────────────────
if ! docker compose version &>/dev/null; then
  apt-get install -y docker-compose-plugin
fi

# ── Git ────────────────────────────────────────────────
apt-get install -y git curl wget

# ── Clone repo ────────────────────────────────────────
mkdir -p "$(dirname "$DEPLOY_PATH")"
if [ -d "$DEPLOY_PATH/.git" ]; then
  echo "Repo already cloned — pulling latest..."
  cd "$DEPLOY_PATH" && git pull origin main
else
  if [ -z "$REPO_URL" ]; then
    echo "ERROR: No repo URL provided. Pass it as the second argument."
    exit 1
  fi
  git clone "$REPO_URL" "$DEPLOY_PATH"
  cd "$DEPLOY_PATH"
fi

# ── Firewall ───────────────────────────────────────────
if command -v ufw &>/dev/null; then
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
fi

# ── Pull Ollama model ──────────────────────────────────
echo "Pulling Ollama llama3 model (this may take a while)..."
docker compose -f "$DEPLOY_PATH/docker-compose.prod.yml" up -d ollama || true
sleep 10
docker exec shyn-ollama ollama pull llama3 || echo "Ollama model pull failed — retry manually after startup"

# ── SSL — Let's Encrypt (initial) ────────────────────
echo ""
echo "To issue SSL certificates run:"
echo "  docker run --rm -v certbot-certs:/etc/letsencrypt -v certbot-www:/var/www/certbot \\"
echo "    certbot/certbot certonly --webroot -w /var/www/certbot \\"
echo "    -d $DOMAIN -d www.$DOMAIN -d admin.$DOMAIN \\"
echo "    --email info@$DOMAIN --agree-tos --non-interactive"
echo ""

echo "═══════════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Copy .env.example → .env and fill in secrets"
echo "  2. Add GitHub Actions secrets (see README)"
echo "  3. Run: docker compose -f docker-compose.prod.yml up -d"
echo "  4. Issue SSL certs (command above)"
echo "═══════════════════════════════════════════"
