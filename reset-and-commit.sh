#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Reset Demo & Commit Changes${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Run reset-feature
echo -e "${BLUE}Step 1: Running reset-feature...${NC}"
npm run reset-feature

# Check if reset was successful (backup file existed)
if [ ! -f ".original-transact-page.backup" ] && [ -f "src/components/TransactPage.js" ]; then
    echo ""
    echo -e "${BLUE}Step 2: Checking for changes...${NC}"
    
    # Check if there are any changes to commit
    if git diff --quiet src/components/TransactPage.js; then
        echo -e "${YELLOW}No changes to commit. TransactPage.js is already in original state.${NC}"
        exit 0
    fi
    
    echo -e "${GREEN}✓ Changes detected${NC}"
    echo ""
    
    # Step 2: Stage the changes
    echo -e "${BLUE}Step 3: Staging changes...${NC}"
    git add src/components/TransactPage.js
    echo -e "${GREEN}✓ Changes staged${NC}"
    echo ""
    
    # Step 3: Commit the changes
    echo -e "${BLUE}Step 4: Committing changes...${NC}"
    git commit -m "Reset demo environment to original state

- Restore original TransactPage.js
- Remove donation feature modifications
- Prepare for next demo cycle"
    echo -e "${GREEN}✓ Changes committed${NC}"
    echo ""
    
    # Step 4: Ask about pushing
    echo -e "${YELLOW}Would you like to push these changes? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo ""
        echo -e "${BLUE}Step 5: Pushing to remote...${NC}"
        git push
        echo -e "${GREEN}✓ Changes pushed to remote${NC}"
        echo ""
    else
        echo ""
        echo -e "${YELLOW}Skipping push. Run 'git push' manually when ready.${NC}"
        echo ""
    fi
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Demo environment reset and committed!${NC}"
    echo -e "${GREEN}========================================${NC}"
else
    echo ""
    echo -e "${YELLOW}No commit needed - backup not found or already in original state.${NC}"
fi

echo ""

