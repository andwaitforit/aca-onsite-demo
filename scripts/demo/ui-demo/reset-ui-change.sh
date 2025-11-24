#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Resetting Login Button to Original${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ -f ".original-login-page.backup" ]; then
    echo -e "${BLUE}Restoring original LoginPage.js...${NC}"
    cp .original-login-page.backup src/components/LoginPage.js
    rm .original-login-page.backup
    echo -e "${GREEN}✓ Original login button restored!${NC}"
    echo ""
    echo -e "${YELLOW}Cleanup complete:${NC}"
    echo "  • LoginPage.js reverted to original"
    echo "  • Button text back to 'Login'"
    echo "  • Original classes restored"
    echo "  • Backup file deleted"
    echo ""
    echo -e "${GREEN}Result:${NC}"
    echo "  ✅ Playwright tests will PASS again"
    echo "  ✅ mabl tests continue to PASS"
else
    echo -e "${YELLOW}No backup found. Nothing to restore.${NC}"
    echo "Run ${GREEN}npm run ui-demo:add${NC} first to create a backup."
fi

echo ""
echo -e "${BLUE}Ready for next demo cycle!${NC}"
echo ""

