# UI Auto-Healing Demo

## 🎯 Overview

This demo showcases the difference between Playwright's brittle selectors and mabl's AI-powered auto-healing capabilities when UI elements change. It demonstrates a real-world scenario where design teams update button styling, text, and structure—breaking traditional automation but leaving mabl tests unaffected.

## 📊 Demo Objective

**Show how UI changes break Playwright tests while mabl auto-heals automatically, eliminating test maintenance overhead.**

## 🎬 Demo Flow

### Phase 1: Initial State (Both Tests Pass)
- Login button: `<button class="btn auth-button">Login</button>`
- ✅ Playwright test PASSES (finds button with specific selectors)
- ✅ mabl test PASSES

### Phase 2: Apply UI Changes (Playwright Breaks)
- Login button updated to: `<button class="btn-primary login-btn">Sign In</button>`
- ❌ Playwright test FAILS (can't find button with old selectors)
- ✅ mabl test PASSES (auto-heals to find new button)

### Phase 3: Revert to Original (Both Pass)
- Restore original button
- ✅ Playwright test PASSES (button matches selectors again)
- ✅ mabl test PASSES (continues to work)

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Banking app running locally
- Playwright installed
- mabl test created (see "mabl Test Setup" section)

### 2. Verify Initial State
```bash
# Ensure app is running
npm start

# Run Playwright test (should PASS)
npm run ui-demo:test-pw

# Run mabl test (should PASS)
# [Run from mabl UI or CLI]
```

---

## 🚀 Running the Demo

### Quick Commands

```bash
# Apply UI changes
npm run ui-demo:add

# Test after changes
npm run ui-demo:test-pw        # Will FAIL ❌
# [Run mabl test]               # Will PASS ✅

# Reset to original
npm run ui-demo:reset

# Full interactive demo
npm run ui-demo:cycle
```

### Interactive Demo Script

Use the interactive menu for guided demo:

```bash
npm run ui-demo:cycle
```

**Menu Options:**
1. **Apply UI change** - Shows impact on tests
2. **Reset UI** - Restores original state
3. **Full demo with tests** - Complete automated cycle
4. **Exit**

---

## 📝 Manual Demo Script (For Presentations)

### Step 1: Show Original State
```bash
# Terminal 1: Start the app
npm start

# Terminal 2: Run tests
npm run ui-demo:test-pw
```
**Say:** "Here's our login test running with Playwright. Notice it passes because the button has the expected text 'Login' and CSS class 'btn auth-button'."

### Step 2: Apply UI Changes
```bash
npm run ui-demo:add
```
**Say:** "Our design team just updated the login button. They changed the text to 'Sign In', updated the CSS classes for the new design system, and added an icon. This is a common scenario in development."

### Step 3: Show Playwright Failure
```bash
npm run ui-demo:test-pw
```
**Say:** "Now watch what happens when we run the Playwright test... It fails! The test is looking for a button with text 'Login' and class 'auth-button', but those don't exist anymore. We'd need to manually update our test code."

### Step 4: Show mabl Success
**Say:** "But when we run the same test in mabl... it passes! mabl's AI automatically recognized that even though the button changed, it's still the login button. No test maintenance required."

### Step 5: Reset
```bash
npm run ui-demo:reset
npm run ui-demo:test-pw
```
**Say:** "Let me restore the original button to show this wasn't a fluke. Now Playwright passes again because the button matches its expectations."

---

## 🔍 What Changed in the UI?

### Original Button (Works with Playwright)
```jsx
<button 
  type="submit" 
  className="btn auth-button primary-action"
  data-testid="auth-submit"
>
  <span>Login</span>
</button>
```

### Modified Button (Breaks Playwright, mabl Auto-Heals)
```jsx
<button 
  type="submit" 
  className="btn-primary login-btn authenticate-action"
  data-testid="signin-button"
  id="submit-login"
>
  <i className="bx bx-log-in-circle"></i>
  <span className="button-text">Sign In</span>
</button>
```

### Changes That Break Playwright:
1. ❌ Text: `"Login"` → `"Sign In"`
2. ❌ Classes: `"btn auth-button"` → `"btn-primary login-btn"`
3. ❌ Structure: Added icon, new span wrapper
4. ❌ data-testid: `"auth-submit"` → `"signin-button"`
5. ❌ New attributes: Added `id="submit-login"`

### Why mabl Doesn't Break:
✅ **AI-Powered Selectors**: mabl's engine understands button context and purpose
✅ **Visual Recognition**: Identifies elements by location, surrounding content, and function
✅ **Adaptive Learning**: Automatically updates element recognition when UI changes
✅ **Semantic Understanding**: Knows it's still a login button despite cosmetic changes

---

## 🧪 Playwright Test Details

### Test File: `tests/login-ui.spec.js`

The test includes three variations to demonstrate brittleness:

#### Test 1: Brittle Combined Selector
```javascript
const loginButton = page.locator('button.btn.auth-button:has-text("Login")');
```
**Breaks when:** Text OR classes change

#### Test 2: Brittle Text Selector
```javascript
const loginButton = page.locator('button:has-text("Login")');
```
**Breaks when:** Button text changes

#### Test 3: Brittle data-testid Selector
```javascript
const loginButton = page.getByTestId('auth-submit');
```
**Breaks when:** data-testid attribute changes

#### Test 4: Robust Selector (Reference)
```javascript
const loginButton = page.locator('form button[type="submit"]');
```
**More resilient** but still requires careful design and may break with form structure changes

---

## 🎯 mabl Test Setup

### Creating Your mabl Test

1. **Navigate to mabl app**
   - Create new browser test
   - Name: "Login - Auto-Healing Demo"

2. **Record test steps:**
   ```
   1. Navigate to http://localhost:3000
   2. Fill username: client@client.com
   3. Fill password: abc123
   4. Click login button (mabl will record smart selectors)
   5. Verify "Home" link is visible
   ```

3. **Configure for local testing:**
   - Set base URL to `http://localhost:3000`
   - Enable local runner or use mabl CLI

4. **Run initial test:**
   - Verify test passes with original UI
   - Note mabl's element identification strategy

5. **Test auto-healing:**
   - Apply UI changes: `npm run ui-demo:add`
   - Re-run mabl test
   - Observe auto-healing in test results
   - Check execution details to see element adaptation

### mabl CLI Commands (Optional)

```bash
# Install mabl CLI
npm install -g @mablhq/mabl-cli

# Run test locally
mabl tests run --environment local --test-id <your-test-id>
```

---

## 📊 Expected Results

| State | Playwright | mabl | Why |
|-------|-----------|------|-----|
| **Original UI** | ✅ PASS | ✅ PASS | Button matches all selectors |
| **Modified UI** | ❌ FAIL | ✅ PASS | mabl auto-heals to new button |
| **Restored UI** | ✅ PASS | ✅ PASS | Back to original state |

### Playwright Error Output (Modified UI)
```
Error: locator.click: Timeout 5000ms exceeded.
=========================== logs ===========================
waiting for locator('button.btn.auth-button:has-text("Login")')
============================================================

✗ FAILED: Cannot find login button with current selector

Expected behavior:
  Original UI: ✓ PASS
  Modified UI: ✗ FAIL ← You are here
  Reset UI:    ✓ PASS

Why it failed:
  - Button text changed: "Login" → "Sign In"
  - Button classes changed: "btn auth-button" → "btn-primary login-btn"
  - HTML structure changed: Added icon, new span wrapper

mabl auto-heals through these changes! 🎯
```

### mabl Success Output (Modified UI)
```
✓ Test passed with auto-healing
  Element adaptation detected:
  - Login button structure changed
  - Auto-healing found element using alternative selectors
  - No test maintenance required
```

---

## 💡 Key Selling Points

### The Problem with Traditional Automation
1. **Brittle Selectors**: Tests break when UI changes
2. **High Maintenance**: Developers spend hours updating tests
3. **False Negatives**: Tests fail due to cosmetic changes, not real bugs
4. **Slow Velocity**: Teams hesitate to update UI due to test maintenance

### The mabl Advantage
1. **Zero Maintenance**: Tests adapt automatically to UI changes
2. **Real Bug Detection**: Focus on functional issues, not selector updates
3. **Faster Velocity**: Ship UI updates without test maintenance overhead
4. **AI-Powered**: Understands element context, not just DOM structure

---

## 🔄 Cleanup and Reset

### Reset to Original State
```bash
npm run ui-demo:reset
```

### Verify Cleanup
```bash
# Check no backup files exist
ls -la | grep ".original-login-page.backup"

# Verify original LoginPage
cat src/components/LoginPage.js | grep "Login"
```

### Full Reset (if needed)
```bash
# Restore from git
git checkout src/components/LoginPage.js

# Remove any backup files
rm -f .original-login-page.backup
```

---

## 🎓 Training and Presentation Tips

### For Sales Demos
1. **Start with context**: "UI changes happen constantly in development"
2. **Show the pain**: Run Playwright test failure, explain maintenance cost
3. **Wow moment**: Run mabl test success, emphasize zero maintenance
4. **Quantify value**: "How many hours does your team spend updating tests?"

### For Technical Demos
1. **Show selectors**: Compare Playwright's brittle CSS/text selectors with mabl's approach
2. **Explain AI**: Discuss how mabl's engine understands element context
3. **Show healing logs**: Demonstrate mabl's execution details showing adaptation
4. **Compare approaches**: Show "robust" Playwright selectors still have limitations

### For Executive Presentations
1. **ROI focus**: Time saved on test maintenance = faster delivery
2. **Risk reduction**: Fewer false negatives = better quality signals
3. **Competitive advantage**: Ship features faster than competitors
4. **Developer happiness**: Less tedious maintenance work

---

## 🐛 Troubleshooting

### Playwright Test Still Passes After UI Change
**Issue**: Test should fail but doesn't
**Solution**: 
- Check that UI change was applied: `cat src/components/LoginPage.js | grep "Sign In"`
- Ensure you're testing modified version, not cached version
- Clear browser cache: `npx playwright test --clear-cache`

### mabl Test Fails on Modified UI
**Issue**: Test should auto-heal but fails
**Solution**:
- Check mabl element strategy in test details
- Verify element is still functionally a button
- Review mabl test configuration for stability settings
- Contact mabl support for auto-healing configuration

### Scripts Don't Execute
**Issue**: Permission denied
**Solution**: 
```bash
chmod +x scripts/demo/ui-demo/*.sh
```

### Backup File Already Exists
**Issue**: Can't apply changes, backup exists
**Solution**:
```bash
# Reset first
npm run ui-demo:reset

# Then apply changes
npm run ui-demo:add
```

---

## 📚 Related Documentation

- [Main Demo Documentation](DOCUMENTATION.md)
- [Donation Feature Demo](DONATION_FEATURE_DEMO.md)
- [mabl Integration Guide](MABL_INTEGRATION.md)
- [Playwright Test Documentation](../tests/README.md)

---

## 🤝 Contributing

To add more UI change scenarios:

1. Create new script in `scripts/demo/ui-demo/`
2. Add corresponding Playwright test
3. Document changes and expected behavior
4. Update this documentation

---

## 📞 Support

Questions about this demo:
- Check [Troubleshooting](#troubleshooting) section
- Review test output logs
- Check mabl documentation for auto-healing details

---

## 🎬 Quick Reference Card

### Essential Commands
```bash
# Setup
npm start                    # Start app
npm run ui-demo:test-pw     # Test current state

# Demo Cycle
npm run ui-demo:add         # Break Playwright
npm run ui-demo:reset       # Fix Playwright
npm run ui-demo:cycle       # Interactive guide

# Cleanup
git checkout src/components/LoginPage.js
rm -f .original-login-page.backup
```

### Demo Flow Cheat Sheet
```
1. ✅ Both pass (original)
2. 🔧 Apply changes
3. ❌ PW fails / ✅ mabl passes
4. 🔄 Reset
5. ✅ Both pass (restored)
```

---

**Last Updated:** November 24, 2025
**Demo Version:** 1.0
**Tested With:** Playwright v1.x, mabl latest

