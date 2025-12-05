# Banking App in ReactJS

![Banking App Screenshot](screen.png)

> **📚 Documentation**: See [DOCUMENTATION.md](./DOCUMENTATION.md) for organized documentation index or [docs/](./docs/) for all detailed guides.

The user is a bank employee who manually manages the bank's accounts.
He does the creation of account manually using the account holders name and sets the initial balance of the account if possible.

He also does the withdrawal and deposit manually for each account.
He also does the transfer of balances if there are requests for it.
Your task is to help this poor employee out by creating a simple admin banking app


## Objective
A banking app created with ReactJS that we can test with both mabl and playwright. Included is a shell script
that will run tests with both platforms twice.  Initially we will run the tests against the original state of 
the application.  The script will then apply a UI change to our login button as one might expect changes to occur
in typical dev cycles.  We will then re-run the tests in both mabl and playwright and as expected the playwright
test will fail while mabl will pass.  Once completed the application state will be restored to the original version 
using git stash.

Since this test will be running again your local environment you'll want to deploy the mabl link agent, and configure
your local host as a dev environment in your workspace.  Additionally within the demo-auto-healing.sh you'll need to
replace the api key with your own cli auth key.

## Quick Start Commands

All commands are available via npm scripts for easy access:

### Development
```bash
npm start                    # Start React dev server (includes legacy OpenSSL support)
npm run server              # Start backend API server (port 3001)
npm run build               # Build for production (includes legacy OpenSSL support)
```

**Note:** The `start` and `build` scripts automatically include `NODE_OPTIONS=--openssl-legacy-provider` for compatibility with older React versions.

### Testing
```bash
npm run test:playwright     # Run all Playwright tests
npm run test:playwright:ui  # Run Playwright tests with UI
npm run test:donation       # Run donation feature tests
npm run test:api            # Test backend API endpoints
npm run test:codex-mcp      # Run codex MCP tests
```

### Docker
```bash
npm run docker:up           # Start Docker containers
npm run docker:down         # Stop Docker containers
npm run docker:logs         # View container logs
```

### Demo Scripts
```bash
npm run autoheal            # Run auto-healing demo (mabl vs Playwright)
npm run add-broken-feature  # Add buggy donation feature
npm run fix-feature         # Fix the donation feature bug
npm run reset-feature       # Reset to original state
npm run demo:full           # Run complete donation demo automatically
```

## API Docs
- Human-readable guide: `docs/API_DOCUMENTATION.md`
- OpenAPI/Swagger spec: `docs/openapi.yaml` (import into Swagger UI/Inspector, Postman, or VS Code extensions)

## Demo Scenarios

### 1. Auto-Healing Demo (mabl vs Playwright)
```bash
npm run autoheal
```

This demo demonstrates mabl's auto-healing capabilities compared to traditional Playwright selectors. It:
1. Runs tests against the original application (both pass)
2. Modifies the login button significantly
3. Re-runs tests - Playwright fails, mabl auto-heals and passes
4. Restores original state

**Setup Required:**
- Deploy the mabl link agent
- Configure localhost as a dev environment in your workspace
- Update `demo-auto-healing.sh` with your mabl CLI auth key

### 2. Pre-PR Bug Detection Demo (Donation Feature)
```bash
npm run demo:full
```

This demo simulates a realistic development workflow where testing catches bugs before PR:
1. Developer adds Sweetums Charity donation feature (with a bug)
2. Runs tests locally - tests FAIL ❌
3. Developer catches bug before creating PR
4. Applies fix to the feature
5. Runs tests again - tests PASS ✅
6. Resets to original state

**Manual Step-by-Step:**
```bash
# Step 1: Add broken feature
npm run add-broken-feature

# Step 2: Start app (in another terminal)
npm start

# Step 3: Run tests (should fail)
npm run test:donation

# Step 4: Fix the bug
npm run fix-feature

# Step 5: Run tests (should pass)
npm run test:donation

# Step 6: Reset
npm run reset-feature
```

For detailed documentation, see:
- **[Donation Feature Demo Guide](./docs/DONATION_FEATURE_DEMO.md)** - Complete demo walkthrough
- **[Documentation Index](./docs/README.md)** - All documentation organized by topic

## Docker Deployment

The application can be deployed using Docker containers. Both the frontend and backend API are containerized and automatically published to GitHub Container Registry.

### Prerequisites
- Docker and Docker Compose installed on your system

### Option 1: Using Pre-built Images from GHCR (Recommended)

Pull and run the latest published images:

```bash
# Pull the latest images
docker-compose -f docker-compose.ghcr.yml pull

# Start the application
docker-compose -f docker-compose.ghcr.yml up -d

# Access the application
# - Frontend: http://localhost:3000
# - API: http://localhost:3001

# Stop the containers
docker-compose -f docker-compose.ghcr.yml down
```

**Available Images:**
- `ghcr.io/andwaitforit/mabl-bank-demo-frontend:latest`
- `ghcr.io/andwaitforit/mabl-bank-demo-api:latest`

See [GitHub Container Registry Guide](./docs/GITHUB_CONTAINER_REGISTRY.md) for more details.

### Option 2: Build Locally

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

4. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Building Individual Containers

**Frontend only:**
```bash
docker build -t banking-app-frontend .
docker run -p 3000:80 banking-app-frontend
```

**API only:**
```bash
docker build -f Dockerfile.api -t banking-app-api .
docker run -p 3001:3001 banking-app-api
```

### Environment Variables

The frontend container accepts a build argument for the API URL:
```bash
docker build --build-arg REACT_APP_API_URL=http://your-api-url/api -t banking-app-frontend .
```

### Docker Compose Configuration

The `docker-compose.yml` file orchestrates both services:
- **frontend**: React app served via nginx (port 3000)
- **api**: Node.js Express API server (port 3001)

The frontend automatically connects to the API service using Docker's internal networking.

### Testing Docker Deployment

For detailed testing instructions, see:
- **[Docker Testing Guide](./docs/DOCKER_TESTING.md)** - Local Docker usage
- **[GitHub Container Registry Guide](./docs/GITHUB_CONTAINER_REGISTRY.md)** - Using published images

Quick test:
```bash
# Option 1: Use published images
docker-compose -f docker-compose.ghcr.yml up

# Option 2: Build locally
docker-compose up --build

# In another terminal, test the API
curl http://localhost:3001/api/stocks

# Open browser to http://localhost:3000
```

### Continuous Deployment

Docker images are automatically built and published to GitHub Container Registry when code is pushed to the `main` branch. See [GHCR Documentation](./docs/GITHUB_CONTAINER_REGISTRY.md) for details.

## Demo Account Credentials

Use the following credentials to test the app.

### For Admin
```
email: admin
password: admin
```

### For Client
```
email: client@client.com
password: abc123
```

## Stock Tracker Feature

The app includes a Stock Tracker module that displays fake stock prices for businesses from Parks & Recreation:
- Swanson Foods (SWANSON)
- Little Sebastian Memorial (LITTLES)
- Pawn Shop (PAWN)
- Rent-A-Swag (RENT)
- Tom's Bistro (TOMS)
- JJ's Diner (JJ)
- The Pit (PIT)
- Sweetums (SWEET)
- Gryzzl (GRIZ)
- Entertainment 720 (ENT)

To use the Stock Tracker:
1. Start the backend API server: `npm run server`
2. Start the React app: `NODE_OPTIONS=--openssl-legacy-provider npm start`
3. Navigate to "Stock Tracker" in the sidebar menu
4. Add stocks to track by clicking the "+ Add" button
5. Remove stocks by clicking the "×" button

Stock prices update automatically every 5 seconds with random fluctuations.

### API Documentation

For detailed API endpoint documentation and testing examples, see:
- [API Documentation](./docs/API_DOCUMENTATION.md)

### Testing the API

You can test the API endpoints using:
- **cURL**: See examples in the API documentation
- **Postman**: Import the endpoints from the documentation
- **Test Script**: Run `node scripts/test-api.js` (requires Node.js 18+ or node-fetch)
