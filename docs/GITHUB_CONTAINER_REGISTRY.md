# GitHub Container Registry (GHCR) Setup

This document explains how the Banking App automatically publishes Docker images to GitHub Container Registry.

## 🐳 Overview

The repository is configured to automatically build and publish Docker images to GHCR whenever code is pushed to the `main` branch or when version tags are created.

## 📦 Published Images

### Image Names

The following images are automatically published:

1. **Combined Image** (Frontend + API):
   ```
   ghcr.io/andwaitforit/mabl-bank-demo:latest
   ```

2. **Frontend Only**:
   ```
   ghcr.io/andwaitforit/mabl-bank-demo-frontend:latest
   ```

3. **API Only**:
   ```
   ghcr.io/andwaitforit/mabl-bank-demo-api:latest
   ```

## 🏷️ Image Tags

Images are tagged with multiple versions:

| Tag Pattern | Description | Example |
|------------|-------------|---------|
| `latest` | Latest build from main branch | `ghcr.io/.../mabl-bank-demo:latest` |
| `main` | Main branch builds | `ghcr.io/.../mabl-bank-demo:main` |
| `v1.2.3` | Semantic version tags | `ghcr.io/.../mabl-bank-demo:v1.2.3` |
| `1.2` | Major.minor version | `ghcr.io/.../mabl-bank-demo:1.2` |
| `main-abc123` | Branch with commit SHA | `ghcr.io/.../mabl-bank-demo:main-abc123` |

## 🚀 Automatic Publishing

### Triggers

Images are automatically built and published when:

1. **Push to main branch**
   ```bash
   git push origin main
   ```
   → Publishes with `latest` and `main` tags

2. **Version tag created**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   → Publishes with `v1.0.0`, `1.0`, and `latest` tags

3. **Manual workflow dispatch**
   - Go to GitHub Actions
   - Select "Docker Image CI/CD" workflow
   - Click "Run workflow"

### GitHub Actions Workflows

**File**: `.github/workflows/docker-publish.yml`

This workflow:
- ✅ Builds both Frontend and API images
- ✅ Pushes to GitHub Container Registry
- ✅ Uses Docker layer caching for faster builds
- ✅ Creates build attestations for security
- ✅ Runs on every push to main

**File**: `.github/workflows/docker-publish-single.yml`

This workflow:
- ✅ Builds combined image (Frontend only)
- ✅ Simpler single-image approach
- ✅ Good for quick deployments

## 📥 Pulling Images

### Public Access (Recommended)

Make your packages public in GitHub settings, then anyone can pull:

```bash
# Pull the latest combined image
docker pull ghcr.io/andwaitforit/mabl-bank-demo:latest

# Pull specific version
docker pull ghcr.io/andwaitforit/mabl-bank-demo:v1.0.0

# Pull frontend only
docker pull ghcr.io/andwaitforit/mabl-bank-demo-frontend:latest

# Pull API only
docker pull ghcr.io/andwaitforit/mabl-bank-demo-api:latest
```

### Private Access (Authentication Required)

If packages are private:

1. **Create a Personal Access Token (PAT)**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select scope: `read:packages`
   - Copy the token

2. **Login to GHCR**
   ```bash
   echo $YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
   ```

3. **Pull images**
   ```bash
   docker pull ghcr.io/andwaitforit/mabl-bank-demo:latest
   ```

## 🏃 Running the Images

### Option 1: Combined Image (Frontend only)

```bash
# Pull and run
docker pull ghcr.io/andwaitforit/mabl-bank-demo:latest
docker run -p 3000:80 ghcr.io/andwaitforit/mabl-bank-demo:latest

# Access at http://localhost:3000
```

### Option 2: Separate Frontend and API

```bash
# Create a network
docker network create banking-app-network

# Run API
docker pull ghcr.io/andwaitforit/mabl-bank-demo-api:latest
docker run -d \
  --name banking-api \
  --network banking-app-network \
  -p 3001:3001 \
  ghcr.io/andwaitforit/mabl-bank-demo-api:latest

# Run Frontend
docker pull ghcr.io/andwaitforit/mabl-bank-demo-frontend:latest
docker run -d \
  --name banking-frontend \
  --network banking-app-network \
  -p 3000:80 \
  ghcr.io/andwaitforit/mabl-bank-demo-frontend:latest

# Access at http://localhost:3000
```

### Option 3: Using Docker Compose with GHCR

Create a `docker-compose.ghcr.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: ghcr.io/andwaitforit/mabl-bank-demo-frontend:latest
    ports:
      - "3000:80"
    depends_on:
      - api

  api:
    image: ghcr.io/andwaitforit/mabl-bank-demo-api:latest
    ports:
      - "3001:3001"
```

Run:
```bash
docker-compose -f docker-compose.ghcr.yml up
```

## 🔒 Making Packages Public

To allow anyone to pull your images without authentication:

1. Go to your GitHub repository
2. Click on "Packages" (right side)
3. Click on your package (e.g., `mabl-bank-demo`)
4. Click "Package settings"
5. Scroll to "Danger Zone"
6. Click "Change visibility"
7. Select "Public"
8. Type the repository name to confirm

## 📋 Viewing Published Images

### On GitHub

1. Go to your repository: https://github.com/andwaitforit/mabl-bank-demo
2. Click "Packages" on the right sidebar
3. See all published versions

### Using Docker

```bash
# List all tags for an image (requires authentication)
curl -H "Authorization: Bearer $YOUR_PAT" \
  https://ghcr.io/v2/andwaitforit/mabl-bank-demo/tags/list
```

## 🏷️ Creating Version Tags

To publish a specific version:

```bash
# Tag your release
git tag v1.0.0

# Push the tag
git push origin v1.0.0

# GitHub Actions will automatically:
# - Build the images
# - Tag them as v1.0.0, 1.0, and latest
# - Push to GHCR
```

## 🔍 Checking Build Status

### GitHub Actions

1. Go to your repository
2. Click "Actions" tab
3. See the "Docker Image CI/CD" workflows
4. Click on any run to see logs

### Build Badges

Add to your README.md:

```markdown
![Docker Build](https://github.com/andwaitforit/mabl-bank-demo/actions/workflows/docker-publish.yml/badge.svg)
```

## 🛠️ Troubleshooting

### Build Fails

**Problem**: GitHub Actions workflow fails

**Solutions**:
1. Check the Actions tab for error logs
2. Verify Dockerfile syntax: `docker build -f Dockerfile .`
3. Ensure all dependencies are available
4. Check disk space in Actions runner

### Cannot Pull Image

**Problem**: `unauthorized: authentication required`

**Solutions**:
1. Check if package is public (see "Making Packages Public")
2. Verify you're logged in: `docker login ghcr.io`
3. Ensure PAT has `read:packages` scope
4. Check package visibility settings

### Image Not Found

**Problem**: `manifest unknown: manifest unknown`

**Solutions**:
1. Verify the image name is correct
2. Check that the build workflow completed successfully
3. Ensure the tag exists: check GitHub Packages
4. Wait a few minutes after push (build time)

### Permission Denied

**Problem**: Cannot push to GHCR

**Solutions**:
1. Ensure workflow has `packages: write` permission
2. Check repository settings → Actions → General → Workflow permissions
3. Select "Read and write permissions"

## 📊 Image Information

### Image Sizes (Approximate)

- **Frontend**: ~200MB (nginx + React build)
- **API**: ~150MB (Node.js + dependencies)
- **Combined**: ~200MB (Frontend only)

### Build Time

- **Frontend**: ~2-3 minutes
- **API**: ~1-2 minutes
- **Total**: ~3-5 minutes

### Cache Usage

The workflow uses GitHub Actions cache to speed up builds:
- First build: Full build time
- Subsequent builds: 30-60 seconds (with cache)

## 🔐 Security

### Best Practices

1. ✅ **Use specific version tags** in production
   ```bash
   docker pull ghcr.io/andwaitforit/mabl-bank-demo:v1.2.3
   ```
   Not:
   ```bash
   docker pull ghcr.io/andwaitforit/mabl-bank-demo:latest
   ```

2. ✅ **Verify image digests**
   ```bash
   docker pull ghcr.io/andwaitforit/mabl-bank-demo@sha256:abc123...
   ```

3. ✅ **Use build attestations** (automatically created)
   - View in GitHub Packages
   - Verify supply chain security

4. ✅ **Scan for vulnerabilities**
   ```bash
   docker scan ghcr.io/andwaitforit/mabl-bank-demo:latest
   ```

### Image Signing

Images include build attestations for:
- Build provenance
- Source repository
- Commit SHA
- Build timestamp

## 🚀 Advanced Usage

### Multi-Platform Builds

Currently builds for `linux/amd64`. To add ARM support, update workflow:

```yaml
platforms: linux/amd64,linux/arm64
```

### Custom Build Args

Pass custom build arguments:

```yaml
build-args: |
  REACT_APP_API_URL=https://api.example.com
  NODE_ENV=production
```

### Automated Testing

Add testing before publishing:

```yaml
- name: Run tests
  run: |
    docker build -t test-image .
    docker run test-image npm test
```

## 📞 Support

### Getting Help

- **GitHub Actions logs**: Check Actions tab
- **Package page**: View on GitHub Packages
- **Issues**: Open an issue in the repository

### Useful Commands

```bash
# View image history
docker history ghcr.io/andwaitforit/mabl-bank-demo:latest

# Inspect image
docker inspect ghcr.io/andwaitforit/mabl-bank-demo:latest

# View image layers
docker pull ghcr.io/andwaitforit/mabl-bank-demo:latest
docker images --digests | grep mabl-bank-demo
```

## 📚 Related Documentation

- **[Docker Testing Guide](./DOCKER_TESTING.md)** - Local Docker usage
- **[GitHub Actions Documentation](https://docs.github.com/en/actions)** - Workflow syntax
- **[GHCR Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)** - Container registry

---

**Last Updated**: November 2025
**Repository**: https://github.com/andwaitforit/mabl-bank-demo

