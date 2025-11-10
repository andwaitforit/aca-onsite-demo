# Banking App Deployment Guide

## Overview

This application is now deployed as a **single Docker container** that serves both the React frontend and the Node.js API. This simplifies deployment, especially for homelab environments.

## Architecture

- **Single Container**: One Docker image containing both frontend and backend
- **Single Port**: Everything runs on port `3001`
- **Node.js Serves All**: Express server handles both API routes and static React files
- **No Inter-Container Networking**: No need to configure container-to-container communication

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# 1. Download the docker-compose file
curl -O https://raw.githubusercontent.com/andwaitforit/mabl-bank-demo/main/docker-compose.ghcr.yml

# 2. Start the application
docker-compose -f docker-compose.ghcr.yml up -d

# 3. Access the app
# Frontend: http://localhost:3001
# API: http://localhost:3001/api/stocks
```

### Option 2: Using Docker Run

```bash
docker run -d \
  --name banking-app \
  -p 3001:3001 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  ghcr.io/andwaitforit/mabl-bank-demo:latest
```

### Option 3: Container Management UI (Portainer, etc.)

**Image:** `ghcr.io/andwaitforit/mabl-bank-demo:latest`

**Port Mapping:**
- Container Port: `3001`
- Host Port: `3001` (or your preferred port, e.g., `8080`)

**Environment Variables:**
- `NODE_ENV=production` (required)
- `PORT=3001` (optional, defaults to 3001)

**Access:**
- If mapped to port 8080: `http://your-server-ip:8080`
- Frontend loads automatically at root `/`
- API available at `/api/*`

## URLs and Routes

Once deployed on port 3001:

| What | URL |
|------|-----|
| **Frontend** | `http://localhost:3001/` |
| **API - All Stocks** | `http://localhost:3001/api/stocks` |
| **API - Single Stock** | `http://localhost:3001/api/stocks/SWANSON` |
| **API - Batch Stocks** | `http://localhost:3001/api/stocks/batch/SWANSON,JJ,GRIZ` |

## Using with Reverse Proxy

If using Nginx Proxy Manager, Traefik, or similar:

**Domain Example:** `banking.homelab.local`

**Configuration:**
- Point domain to container on port `3001`
- No special routing needed - server handles everything automatically
- Frontend served at `/`
- API routes at `/api/*`

Example Nginx config:
```nginx
server {
    listen 80;
    server_name banking.homelab.local;

    location / {
        proxy_pass http://banking-app:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Health Check

The container includes a built-in health check:

```bash
# Check if container is healthy
docker ps

# View health check logs
docker inspect banking-app | grep -A 10 Health
```

Health check endpoint: `http://localhost:3001/api/stocks`

## Updating the Application

```bash
# Pull latest image
docker pull ghcr.io/andwaitforit/mabl-bank-demo:latest

# Restart container (Docker Compose)
docker-compose -f docker-compose.ghcr.yml up -d

# Or restart manually
docker stop banking-app
docker rm banking-app
docker run -d --name banking-app -p 3001:3001 ghcr.io/andwaitforit/mabl-bank-demo:latest
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs banking-app

# Verify port is available
netstat -tulpn | grep 3001
```

### Can't access the app
- Verify container is running: `docker ps`
- Check firewall rules allow port 3001
- Ensure no other service is using port 3001

### API not responding
```bash
# Test API directly
curl http://localhost:3001/api/stocks

# Should return JSON with stock data
```

### Frontend loads but no data
- Check browser console for errors
- API is at `/api/stocks` (relative path)
- Ensure container is healthy: `docker ps`

## Development vs Production

**Development (separate servers):**
- Frontend: `npm start` on port 3000
- API: `npm run server` on port 3001
- Frontend proxies to API

**Production (Docker):**
- Single server on port 3001
- Node.js serves built React app
- API routes at `/api/*`
- Frontend at `/`

## System Requirements

- Docker Engine 20.10+
- 512MB RAM minimum
- Port 3001 available
- Internet access (to pull image)

## Support

For issues or questions:
- Repository: https://github.com/andwaitforit/mabl-bank-demo
- Documentation: See `docs/` folder

