# Troubleshooting: Donation Feature Demo

This guide helps you debug issues with the donation feature demo.

## Quick Diagnostics

### 1. Verify Scripts Are Executable
```bash
ls -l *.sh
```

All `.sh` files should have execute permissions (`-rwxr-xr-x`). If not:
```bash
chmod +x add-broken-feature.sh fix-feature.sh reset-feature.sh demo-auto-healing.sh show-commands.sh
```

### 2. Check Current State
```bash
# Check if backup exists (indicates demo is in progress)
ls -la .original-transact-page.backup

# Check current TransactPage
grep -A 5 "// BUG:" src/components/TransactPage.js || echo "No bug marker found"
grep -A 5 "// FIX:" src/components/TransactPage.js || echo "No fix marker found"
```

## Common Issues & Solutions

### Issue 1: "Fix doesn't work" - Test Still Fails

**Symptoms:**
- Run `npm run fix-feature`
- Run `npm run test:donation`
- Test fails with: `Expected: 9940, Received: 9950`

**Diagnosis:**
The fix script ran, but the donation amount is not being deducted.

**Solutions:**

#### A. Verify the Fix Was Applied
```bash
# Check if the fix is in the file
grep -A 10 "const donation = " src/components/TransactPage.js

# Should show:
# const donation = donationEnabled && donationAmount > 0 ? parseFloat(donationAmount) || 0 : 0;
```

If you don't see this line, the fix wasn't applied. Run:
```bash
npm run fix-feature
```

#### B. Check for State Management Issues
Add console logging to debug:
```bash
# Temporarily add logging to the fixed version
# Edit src/components/TransactPage.js and add before transact():
console.log('Withdrawal amount:', amount);
console.log('Donation amount:', donationAmount);
console.log('Donation enabled:', donationEnabled);
console.log('Calculated donation:', donation);
console.log('Total amount:', totalAmount);
```

#### C. Verify transact() Function
```bash
# Check the transact function hasn't been modified
grep -A 15 "export function transact" src/components/Utils.js
```

Should show the original implementation with:
```javascript
user.balance += amount * multiplier;
```

### Issue 2: App Won't Start

**Symptoms:**
- `npm start` fails
- Error about OpenSSL

**Solution:**
The NODE_OPTIONS should be included automatically now. Verify:
```bash
grep "start" package.json

# Should show:
# "start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start"
```

If not, update package.json:
```json
"start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start"
```

### Issue 3: Test Can't Find Elements

**Symptoms:**
- Test fails with "Element not found"
- Error about `#donation-toggle` or `#donation-amount`

**Diagnosis:**
The broken/fixed feature wasn't applied, or you're on the wrong page.

**Solution:**
```bash
# Verify the donation UI exists
grep -A 5 "donation-toggle" src/components/TransactPage.js

# Should show the checkbox input
```

If not found:
```bash
npm run add-broken-feature
```

### Issue 4: Balance Doesn't Update in Test

**Symptoms:**
- Test shows: `Initial balance: $10000.00`, `Actual balance: $10000.00`
- Balance never changes

**Diagnosis:**
Transaction isn't being processed or localStorage isn't being updated.

**Solution:**

#### A. Check if localStorage is working
In the browser console (http://localhost:3000):
```javascript
// Check users in localStorage
const users = JSON.parse(localStorage.getItem('users'));
console.log(users);
```

#### B. Manually test the feature
1. Open http://localhost:3000
2. Login (user/password)
3. Click "Withdraw"
4. Select an account
5. Note the balance
6. Enter withdrawal: 50
7. Check donation box
8. Enter donation: 10
9. Submit
10. Check if balance decreased by 60

### Issue 5: Demo Script Gets Stuck

**Symptoms:**
- Script waits indefinitely
- Backup file exists after script completes

**Solution:**
```bash
# Force reset
npm run reset-feature

# Or manually:
git checkout src/components/TransactPage.js
rm -f .original-transact-page.backup

# Kill any hung processes
pkill -f "react-scripts"
pkill -f "node"
```

### Issue 6: Test Passes with Broken Version

**Symptoms:**
- Run `npm run add-broken-feature`
- Run test - it PASSES (should fail!)

**Diagnosis:**
Either the broken version isn't actually broken, or the test is wrong.

**Solution:**
```bash
# Check what's in the broken version
grep -A 10 "// BUG:" src/components/TransactPage.js

# Should show:
# transact(user.number, amount, props.type, props.setUsers);
# (without donation calculation)
```

### Issue 7: Multiple Accounts Issues

**Symptoms:**
- Can't select an account
- "Select Account" dropdown is empty

**Diagnosis:**
localStorage has no user data.

**Solution:**
```bash
# Check browser console at http://localhost:3000
# Run in console:
localStorage.clear();
# Then refresh page and login again
```

## Verification Checklist

Use this checklist to verify everything is working:

- [ ] **Scripts are executable**: `ls -l *.sh` shows `rwx` permissions
- [ ] **Package.json has NODE_OPTIONS**: `grep "NODE_OPTIONS" package.json`
- [ ] **App starts**: `npm start` runs without errors
- [ ] **Login works**: Can access http://localhost:3000 and login
- [ ] **Withdraw page loads**: Can click "Withdraw" and see the page
- [ ] **Broken version fails test**: `npm run test:donation` fails after `npm run add-broken-feature`
- [ ] **Fixed version passes test**: `npm run test:donation` passes after `npm run fix-feature`
- [ ] **Manual test works**: Can manually withdraw with donation in browser
- [ ] **Reset works**: `npm run reset-feature` restores original state

## Manual Test Procedure

To verify the fix manually:

### Test the Broken Version
```bash
npm run add-broken-feature
npm start  # In another terminal
```

1. Go to http://localhost:3000
2. Login: `user` / `password`
3. Click "Withdraw"
4. Select first account (note balance: e.g., $10,000)
5. Enter withdrawal: 50
6. Check "Donate to Sweetums Charity"
7. Enter donation: 10
8. Click "withdraw"
9. **Bug**: Balance should be $9,950 (wrong! should be $9,940)

### Test the Fixed Version
```bash
npm run fix-feature
```

1. Refresh page
2. Click "Withdraw"
3. Select first account (balance: $9,950 from previous test)
4. Enter withdrawal: 50
5. Check donation box
6. Enter donation: 10
7. Click "withdraw"
8. **Fixed**: Balance should be $9,890 (correct! $9,950 - $60)

### Reset
```bash
npm run reset-feature
```

## Debug Output

To get detailed debug output, run tests with:
```bash
# With debugging
npx playwright test tests/donation.spec.js --reporter=list --debug

# With verbose output
npx playwright test tests/donation.spec.js --reporter=list --headed

# Generate HTML report
npx playwright test tests/donation.spec.js --reporter=html
npx playwright show-report
```

## Still Having Issues?

### Check All Files
```bash
# Verify all key files exist
ls -l src/components/TransactPage.js
ls -l src/components/Utils.js
ls -l tests/donation.spec.js
ls -l add-broken-feature.sh
ls -l fix-feature.sh
ls -l reset-feature.sh
```

### Check Dependencies
```bash
npm list playwright
npm list react
npm list react-scripts
```

### Review Logs
Look for errors in:
- Browser console (F12 in browser)
- Terminal running `npm start`
- Terminal running `npm run test:donation`

### Clean Slate
Start completely fresh:
```bash
# Reset everything
npm run reset-feature
git checkout src/components/TransactPage.js
rm -f .original-transact-page.backup

# Clean build
rm -rf node_modules
rm -rf build
rm -rf test-results
npm install

# Start fresh
npm start
```

---

**Need More Help?**

1. Check `DONATION_FIX_EXPLAINED.md` for technical details
2. Review `docs/DONATION_FEATURE_DEMO.md` for step-by-step guide
3. Run `npm run help` for available commands

