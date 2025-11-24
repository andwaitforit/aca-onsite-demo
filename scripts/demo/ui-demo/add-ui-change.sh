#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Applying Login Button UI Changes${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Scenario: Design team updates login button styling and text${NC}"
echo -e "${YELLOW}Demo: Playwright tests break, mabl auto-heals${NC}"
echo ""

# Save original state if not already saved
if [ ! -f ".original-login-page.backup" ]; then
    echo -e "${BLUE}Backing up original LoginPage.js...${NC}"
    cp src/components/LoginPage.js .original-login-page.backup
fi

# Create the modified version with new button styling
echo -e "${BLUE}Applying new button design...${NC}"
cat > src/components/LoginPage.js << 'EOL'
import React, { useState } from 'react';
import { Logo } from './Logo';
import { Notif } from './Notif';

export const LoginPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const onSubmitHandler = (event) => {
      event.preventDefault();
      props.loginHandler(username, password);
    }
  
  const onChangeUsername = (event) => {
    event.stopPropagation();
    const value = event.target.value;
    console.log('Username changed:', value);
    setUsername(value);
  }

  const onChangePassword = (event) => {
    event.stopPropagation();
    const value = event.target.value;
    console.log('Password changed:', value);
    setPassword(value);
  }
  
    return (
      <div id="login-page">
        <div id="login">
          <Logo />
          <Notif message={props.notif.message} style={props.notif.style} />
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              autoComplete="off" 
              onChange={onChangeUsername}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              value={username} 
              type="text"
              style={{ pointerEvents: 'auto', cursor: 'text' }}
            />
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              autoComplete="off" 
              onChange={onChangePassword}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              value={password} 
              type="password"
              style={{ pointerEvents: 'auto', cursor: 'text' }}
            />
            <button 
              type="submit" 
              className="btn-primary login-btn authenticate-action"
              data-testid="signin-button"
              id="submit-login"
              data-action="user-signin"
              data-tracking="login-submit-btn"
              aria-label="Sign in to your account"
            >
              <i className="bx bx-log-in-circle" style={{ marginRight: '8px', fontSize: '18px' }}></i>
              <span className="button-text">Sign In</span>
            </button>
          </form>
        </div>
      </div>
    )
}
EOL

echo ""
echo -e "${GREEN}✓ UI changes applied successfully!${NC}"
echo ""
echo -e "${YELLOW}What changed:${NC}"
echo "  • Button text: 'Login' → 'Sign In'"
echo "  • Button classes: 'btn auth-button' → 'btn-primary login-btn'"
echo "  • Button structure: Added icon, new span wrapper"
echo "  • data-testid: 'auth-submit' → 'signin-button'"
echo "  • Added id attribute: 'submit-login'"
echo ""
echo -e "${RED}Impact on Playwright:${NC}"
echo "  ❌ Selector 'button.btn:has-text(\"Login\")' will FAIL"
echo "  ❌ Selector 'button.auth-button' will FAIL"
echo "  ❌ getByTestId('auth-submit') will FAIL"
echo ""
echo -e "${GREEN}Impact on mabl:${NC}"
echo "  ✅ Auto-heals to find the new button"
echo "  ✅ No test maintenance required"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Start app: ${GREEN}npm start${NC}"
echo "  2. Run Playwright: ${GREEN}npm run ui-demo:test-pw${NC} ${RED}(will FAIL)${NC}"
echo "  3. Run mabl test ${GREEN}(will PASS)${NC}"
echo "  4. Reset: ${GREEN}npm run ui-demo:reset${NC}"
echo ""

