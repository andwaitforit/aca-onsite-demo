# 📚 Documentation Quick Reference

All detailed documentation has been organized in the `docs/` directory.

## 🚀 Quick Start

```bash
# See all available commands
npm run help

# Run complete demo
npm run demo:full

# View documentation index
cat docs/README.md
```

## 📖 Main Documentation

### For Running Demos
- **[Donation Feature Demo](./docs/DONATION_FEATURE_DEMO.md)** - Complete walkthrough
- **[Setup Guide](./docs/SETUP_COMPLETE.md)** - What's included and how to use it
- **[Command Reference](./docs/NPM_SCRIPTS_REFERENCE.md)** - All npm commands

### For Development
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Backend endpoints
- **[Docker Guide](./docs/DOCKER_TESTING.md)** - Docker setup
- **[Technical Details](./docs/DONATION_FIX_EXPLAINED.md)** - How the donation feature works

### For Troubleshooting
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING_DONATION_DEMO.md)** - Debug common issues
- **[Checkbox Fix](./docs/CHECKBOX_FIX_SUMMARY.md)** - How we fixed the checkbox
- **[Node Options Fix](./docs/NODE_OPTIONS_FIX.md)** - OpenSSL compatibility

## 📂 File Organization

```
banking-app/
├── README.md                  # Main project README (you are here)
├── DOCUMENTATION.md           # This file - documentation guide
│
├── docs/                      # 📚 All detailed documentation
│   ├── README.md             # Documentation index
│   │
│   ├── Getting Started
│   │   ├── SETUP_COMPLETE.md
│   │   └── NPM_SCRIPTS_REFERENCE.md
│   │
│   ├── Demo Guides
│   │   └── DONATION_FEATURE_DEMO.md
│   │
│   ├── Technical
│   │   ├── API_DOCUMENTATION.md
│   │   ├── DOCKER_TESTING.md
│   │   ├── DONATION_FIX_EXPLAINED.md
│   │   ├── DONATION_FEATURE_V2_CHANGES.md
│   │   └── ...
│   │
│   └── Troubleshooting
│       ├── TROUBLESHOOTING_DONATION_DEMO.md
│       ├── CHECKBOX_FIX_SUMMARY.md
│       └── NODE_OPTIONS_FIX.md
│
├── tests/                     # Playwright tests
├── src/                       # React application
├── scripts/                   # Helper scripts
└── *.sh                       # Demo scripts
```

## 🎯 Common Tasks

### "I want to run the donation demo"
```bash
npm run demo:full
```
Or follow: [Donation Feature Demo](./docs/DONATION_FEATURE_DEMO.md)

### "I need to see all commands"
```bash
npm run help
```
Or see: [NPM Scripts Reference](./docs/NPM_SCRIPTS_REFERENCE.md)

### "Something isn't working"
Check: [Troubleshooting Guide](./docs/TROUBLESHOOTING_DONATION_DEMO.md)

### "I want to understand the code"
Read: [Donation Fix Explained](./docs/DONATION_FIX_EXPLAINED.md)

## 🔗 Important Links

- **[Complete Documentation Index](./docs/README.md)** - All docs organized by topic
- **[Main README](./README.md)** - Project overview
- **[Package.json](./package.json)** - All npm scripts

---

**Pro Tip**: Use `npm run help` to see a visual list of all available commands!

