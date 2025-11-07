# NPM Scripts Quick Reference

This document provides a comprehensive list of all available npm scripts in the banking-app project.

## 📖 Table of Contents

- [Development](#development)
- [Testing](#testing)
- [Demo Scripts](#demo-scripts)
- [Docker](#docker)
- [Deployment](#deployment)
- [Quick Command Comparison](#quick-command-comparison)

---

## 🔧 Development

Start and build the application:

| Command | Description | Usage |
|---------|-------------|-------|
| `npm start` | Start React development server | Main frontend app on port 3000. Includes NODE_OPTIONS for legacy OpenSSL support |
| `npm run server` | Start backend API server | Express API on port 3001 |
| `npm run build` | Build production bundle | Creates optimized build in `/build`. Includes NODE_OPTIONS for legacy OpenSSL support |
| `npm run eject` | Eject from Create React App | ⚠️ Irreversible operation |

### Example Development Workflow
```bash
# Terminal 1: Start backend API
npm run server

# Terminal 2: Start frontend
npm start

# Browser will open to http://localhost:3000
```

**Note:** The `npm start` command automatically includes `NODE_OPTIONS=--openssl-legacy-provider` for compatibility with React 17 and older Node versions. You no longer need to prefix it manually.

---

## 🧪 Testing

Run various test suites:

| Command | Description | Test Type |
|---------|-------------|-----------|
| `npm test` | Run React unit tests | Jest/React Testing Library |
| `npm run test:playwright` | Run all Playwright tests | E2E tests |
| `npm run test:playwright:ui` | Run Playwright with UI | E2E with visual debugger |
| `npm run test:donation` | Run donation feature tests | Specific E2E test suite |
| `npm run test:api` | Test backend API endpoints | API integration tests |
| `npm run test:codex-mcp` | Run codex MCP tests | MCP integration tests |

### Testing Tips

**Run specific test file:**
```bash
npx playwright test tests/login.spec.js
```

**Run tests in headed mode:**
```bash
npx playwright test --headed
```

**Generate test report:**
```bash
npx playwright test --reporter=html
```

---

## 🎭 Demo Scripts

Interactive demonstrations of testing capabilities:

### Auto-Healing Demo
| Command | Description | Duration |
|---------|-------------|----------|
| `npm run autoheal` | mabl vs Playwright auto-healing demo | ~5 minutes |

**What it demonstrates:**
- ✅ mabl's automatic element detection
- ❌ Traditional selector brittleness
- 🔄 Real-world UI change scenario

**Prerequisites:**
- mabl link agent installed
- mabl CLI auth key configured
- Localhost environment set up in mabl

### Donation Feature Demo (Pre-PR Bug Detection)
| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run add-broken-feature` | Add buggy donation feature | Step 1: Add feature |
| `npm run fix-feature` | Apply fix to donation bug | Step 3: Fix bug |
| `npm run reset-feature` | Reset to original state | Step 5: Cleanup |
| `npm run demo:full` | Run complete demo automatically | Automated demo |

**Complete Manual Workflow:**
```bash
# 1. Add broken feature
npm run add-broken-feature

# 2. Start app (new terminal)
npm start

# 3. Run tests → Should FAIL ❌
npm run test:donation

# 4. Fix the bug
npm run fix-feature

# 5. Run tests → Should PASS ✅
npm run test:donation

# 6. Reset everything
npm run reset-feature
```

**What it demonstrates:**
- 🐛 How tests catch bugs early
- ✅ Shift-left testing benefits
- 🔄 Typical dev workflow simulation
- 📝 Test-driven development value

---

## 🐳 Docker

Manage Docker containers:

| Command | Description | Notes |
|---------|-------------|-------|
| `npm run docker:up` | Start containers (detached) | Runs `docker-compose up -d` |
| `npm run docker:down` | Stop and remove containers | Cleanup all containers |
| `npm run docker:logs` | View container logs | Follow mode (-f) |

### Docker Workflow
```bash
# Start everything
npm run docker:up

# Check logs
npm run docker:logs

# Stop when done
npm run docker:down
```

**Access Points:**
- Frontend: http://localhost:3000
- API: http://localhost:3001

---

## 🚀 Deployment

Deploy to GitHub Pages:

| Command | Description | Notes |
|---------|-------------|-------|
| `npm run predeploy` | Build before deploy | Runs automatically |
| `npm run deploy` | Deploy to GitHub Pages | Uses gh-pages |

### Deployment Steps
```bash
# Build and deploy in one command
npm run deploy

# This will:
# 1. Run npm run predeploy (builds the app)
# 2. Deploy to gh-pages branch
# 3. Available at your GitHub Pages URL
```

---

## 📊 Quick Command Comparison

### Traditional Way vs NPM Scripts

| Task | Old Command | New NPM Script |
|------|-------------|----------------|
| Run auto-heal demo | `sh demo-auto-healing.sh` | `npm run autoheal` |
| Run Playwright tests | `npx playwright test` | `npm run test:playwright` |
| Test API | `node scripts/test-api.js` | `npm run test:api` |
| Start Docker | `docker-compose up -d` | `npm run docker:up` |
| Stop Docker | `docker-compose down` | `npm run docker:down` |
| Add test feature | `sh add-broken-feature.sh` | `npm run add-broken-feature` |
| Fix test feature | `sh fix-feature.sh` | `npm run fix-feature` |
| Reset feature | `sh reset-feature.sh` | `npm run reset-feature` |

---

## 🎯 Common Use Cases

### "I want to run the donation demo"
```bash
npm run demo:full
```

### "I want to test if my changes broke anything"
```bash
npm run test:playwright
```

### "I want to see the auto-healing capability"
```bash
npm run autoheal
```

### "I want to develop locally with Docker"
```bash
npm run docker:up
# Check http://localhost:3000
npm run docker:down  # When done
```

### "I want to test the API"
```bash
# Start the API first
npm run server

# In another terminal
npm run test:api
```

### "I want to develop locally (no Docker)"
```bash
# Terminal 1
npm run server

# Terminal 2
npm start
```

---

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Docker Issues
```bash
# Clean up everything
npm run docker:down
docker system prune -a

# Rebuild from scratch
npm run docker:up
```

### Tests Failing
```bash
# Make sure app is running
npm start

# Run tests in UI mode to debug
npm run test:playwright:ui
```

### Reset Demo State
```bash
# If demo scripts leave things in weird state
npm run reset-feature

# Or manually:
git checkout src/components/TransactPage.js
git checkout src/components/LoginPage.js
```

---

## 📝 Notes

- All scripts are defined in `package.json`
- Scripts can be chained using `&&` operator
- Use `||` for error handling (e.g., `|| true` to continue on failure)
- Background processes can be stopped with `Ctrl+C` or by killing the terminal

---

## 🆘 Getting Help

For more detailed information:
- **Donation Demo**: See [DONATION_FEATURE_DEMO.md](./DONATION_FEATURE_DEMO.md)
- **Docker**: See [DOCKER_TESTING.md](./DOCKER_TESTING.md)
- **API**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Main README**: See [README.md](../README.md)

---

*Last updated: November 2025*

