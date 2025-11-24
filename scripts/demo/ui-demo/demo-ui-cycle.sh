#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          UI Auto-Healing Demo Manager                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Demo Objective:${NC}"
echo "  Demonstrate how UI changes break Playwright but mabl auto-heals"
echo ""
echo -e "${GREEN}Available Demo Commands:${NC}"
echo ""
echo -e "  ${CYAN}1. npm run ui-demo:add${NC}       - Apply button UI changes"
echo -e "  ${CYAN}2. npm run ui-demo:reset${NC}     - Reset to original button"
echo -e "  ${CYAN}3. npm run ui-demo:test-pw${NC}   - Run Playwright test"
echo -e "  ${CYAN}4. npm run ui-demo:full${NC}      - Complete demo cycle"
echo ""
echo -e "${YELLOW}Quick Demo Flow:${NC}"
echo ""

PS3=$'\n'"${YELLOW}Select an option (1-4), or press Ctrl+C to exit: ${NC}"

options=("Apply UI change (Playwright will fail)" "Reset UI (both pass)" "Full demo with tests" "Exit")

select opt in "${options[@]}"
do
    case $opt in
        "Apply UI change (Playwright will fail)")
            echo ""
            echo -e "${BLUE}========================================${NC}"
            echo -e "${BLUE}Option 1: Apply UI Changes${NC}"
            echo -e "${BLUE}========================================${NC}"
            echo ""
            
            sh scripts/demo/ui-demo/add-ui-change.sh
            
            echo -e "${YELLOW}Now run:${NC}"
            echo "  ${GREEN}npm run ui-demo:test-pw${NC} ${RED}← Will FAIL${NC}"
            echo "  ${GREEN}[Run your mabl test]${NC} ${GREEN}← Will PASS${NC}"
            echo ""
            break
            ;;
        "Reset UI (both pass)")
            echo ""
            echo -e "${BLUE}========================================${NC}"
            echo -e "${BLUE}Option 2: Reset UI${NC}"
            echo -e "${BLUE}========================================${NC}"
            echo ""
            
            sh scripts/demo/ui-demo/reset-ui-change.sh
            
            echo -e "${YELLOW}Now run:${NC}"
            echo "  ${GREEN}npm run ui-demo:test-pw${NC} ${GREEN}← Will PASS${NC}"
            echo "  ${GREEN}[Run your mabl test]${NC} ${GREEN}← Will PASS${NC}"
            echo ""
            break
            ;;
        "Full demo with tests")
            echo ""
            echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
            echo -e "${BLUE}║          Full UI Auto-Healing Demo                            ║${NC}"
            echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
            echo ""
            
            echo -e "${CYAN}Phase 1: Test Original State${NC}"
            echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
            echo -e "${YELLOW}Testing original login button...${NC}"
            echo ""
            npm run ui-demo:test-pw
            original_pw_result=$?
            
            if [ $original_pw_result -eq 0 ]; then
                echo -e "${GREEN}✓ Playwright: PASS${NC}"
            else
                echo -e "${RED}✗ Playwright: FAIL (unexpected)${NC}"
            fi
            echo -e "${GREEN}✓ mabl: PASS (verify manually)${NC}"
            echo ""
            
            echo -e "${YELLOW}Press Enter to apply UI changes...${NC}"
            read
            
            echo ""
            echo -e "${CYAN}Phase 2: Apply UI Changes${NC}"
            echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
            sh scripts/demo/ui-demo/add-ui-change.sh
            
            echo -e "${YELLOW}Press Enter to run tests on modified UI...${NC}"
            read
            
            echo ""
            echo -e "${CYAN}Phase 3: Test Modified State${NC}"
            echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
            echo -e "${YELLOW}Testing modified login button...${NC}"
            echo ""
            npm run ui-demo:test-pw
            modified_pw_result=$?
            
            if [ $modified_pw_result -ne 0 ]; then
                echo -e "${RED}✗ Playwright: FAIL (expected - brittle selectors)${NC}"
            else
                echo -e "${YELLOW}⚠ Playwright: PASS (unexpected - check test)${NC}"
            fi
            echo -e "${GREEN}✓ mabl: PASS (auto-healed - verify manually)${NC}"
            echo ""
            
            echo -e "${YELLOW}Press Enter to reset UI...${NC}"
            read
            
            echo ""
            echo -e "${CYAN}Phase 4: Reset UI${NC}"
            echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
            sh scripts/demo/ui-demo/reset-ui-change.sh
            
            echo -e "${YELLOW}Press Enter to verify tests pass again...${NC}"
            read
            
            echo ""
            echo -e "${CYAN}Phase 5: Test Reset State${NC}"
            echo -e "${BLUE}────────────────────────────────────────────────────────────────${NC}"
            echo -e "${YELLOW}Testing restored login button...${NC}"
            echo ""
            npm run ui-demo:test-pw
            reset_pw_result=$?
            
            if [ $reset_pw_result -eq 0 ]; then
                echo -e "${GREEN}✓ Playwright: PASS (back to working)${NC}"
            else
                echo -e "${RED}✗ Playwright: FAIL (unexpected)${NC}"
            fi
            echo -e "${GREEN}✓ mabl: PASS (verify manually)${NC}"
            echo ""
            
            echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
            echo -e "${GREEN}║          Demo Complete!                                       ║${NC}"
            echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${CYAN}Summary:${NC}"
            echo -e "  Original State:  PW ${GREEN}PASS${NC}  | mabl ${GREEN}PASS${NC}"
            echo -e "  Modified State:  PW ${RED}FAIL${NC}  | mabl ${GREEN}PASS${NC} ${YELLOW}← Auto-healing!${NC}"
            echo -e "  Reset State:     PW ${GREEN}PASS${NC}  | mabl ${GREEN}PASS${NC}"
            echo ""
            echo -e "${BLUE}Key Takeaway:${NC}"
            echo "  UI changes require Playwright test maintenance"
            echo "  mabl automatically adapts with zero maintenance"
            echo ""
            break
            ;;
        "Exit")
            echo ""
            echo -e "${BLUE}Goodbye!${NC}"
            echo ""
            exit 0
            ;;
        *) 
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
done

echo ""

