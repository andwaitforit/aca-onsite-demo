# Sweetums Charity Donation Feature Demo

This demo simulates a realistic development workflow where a developer adds a new feature, introduces a bug, catches it through testing, and then fixes it before creating a PR.

## 🎯 Demo Scenario

**Feature**: Add ability to donate a fixed $5 to Sweetums Charity 🍬 during withdrawals

**Bug**: The initial implementation fails to deduct the $5 donation from the account balance, only deducting the withdrawal amount.

**Fix**: Properly calculate and deduct the total amount (withdrawal + $5 donation) from the account.

## 🚀 Quick Start

### Option 1: Full Automated Demo
```bash
npm run demo:full
```

This runs the entire workflow automatically:
1. Adds the broken feature
2. Runs tests (fails)
3. Applies the fix
4. Runs tests (passes)
5. Resets to original state

### Option 2: Step-by-Step Demo

#### Step 1: Add the Broken Feature
```bash
npm run add-broken-feature
```

This script:
- Backs up the original `TransactPage.js`
- Adds the donation feature with a bug
- Shows a summary of what was changed and what's broken

#### Step 2: Start the App (in a separate terminal)
```bash
npm start
```

**Note:** The start command now automatically includes the required `NODE_OPTIONS=--openssl-legacy-provider` flag.

#### Step 3: Run the Tests and Watch Them Fail ❌
```bash
npm run test:donation
```

The test will fail because:
- Initial balance: $10,000
- Withdrawal: $50
- Donation: $5 (fixed amount)
- Expected balance: $9,945
- **Actual balance: $9,950** ← Bug! Donation not deducted

#### Step 4: Fix the Bug
```bash
npm run fix-feature
```

This script:
- Updates `TransactPage.js` with the correct implementation
- Properly calculates total amount (withdrawal + donation)
- Deducts both amounts from the account

#### Step 5: Run Tests Again and Watch Them Pass ✅
```bash
npm run test:donation
```

Now all tests pass! The balance is correctly reduced by $55 (withdrawal + $5 donation).

#### Step 6: Reset to Original State
```bash
npm run reset-feature
```

This cleans up and restores the original application state.

## 📋 Test Coverage

The test suite (`tests/donation.spec.js`) includes:

1. **Balance Deduction Test**: Verifies $5 donation + withdrawal are both deducted
2. **UI Visibility Test**: Confirms donation checkbox only appears on withdraw page
3. **Checkbox Toggle Test**: Checks checkbox can be checked/unchecked correctly
4. **No Donation Test**: Verifies withdrawals work without donation

## 🎓 What This Demonstrates

### For Testing Best Practices:
- ✅ Tests catch bugs **before** they reach production
- ✅ Automated tests provide fast feedback during development
- ✅ Tests document expected behavior
- ✅ Regression testing prevents old bugs from returning

### For CI/CD Workflow:
This simulates a typical development workflow:
1. Developer implements feature on feature branch
2. Runs tests locally → **Tests fail** ❌
3. Developer catches bug before PR
4. Fixes the bug
5. Runs tests again → **Tests pass** ✅
6. Creates PR with confidence
7. CI/CD pipeline validates changes
8. Code review and merge

## 🔧 Technical Details

### What Changes in the Code

**Broken Version** (`add-broken-feature.sh`):
```javascript
// BUG: Only processes withdrawal, ignores donation
transact(user.number, amount, props.type, props.setUsers);
```

**Fixed Version** (`fix-feature.sh`):
```javascript
// FIX: Calculate and process total amount
const DONATION_AMOUNT = 5; // Fixed $5 donation
const donation = donationEnabled ? DONATION_AMOUNT : 0;
const totalAmount = parseFloat(amount) + donation;
transact(user.number, totalAmount, props.type, props.setUsers);
```

### UI Changes
- Checkbox to enable fixed $5 donation (withdraw page only)
- Clear label: "Donate $5 to Sweetums Charity 🍬"
- Improved checkbox styling for better clickability (18px size, pointer cursor)
- Success message includes donation confirmation
- Styled container with Sweetums Charity branding

## 📊 Demo Output

When you run `npm run add-broken-feature`:
```
========================================
Adding Sweetums Charity Donation Feature
========================================

Scenario: Developer adds a new feature to allow donations during withdrawals
Bug: The donation amount is not properly deducted from the account

✓ Feature added successfully!

What was changed:
  • Added checkbox for fixed $5 donation to Sweetums Charity
  • Checkbox only appears on withdrawal page
  • Added thank you message when donation is made
  • Improved checkbox styling for better clickability

What's broken:
  • The $5 donation is NOT being deducted from the account
  • Only the withdrawal amount is processed, donation is ignored
  • User thinks they donated $5 but their balance doesn't reflect it
```

## 🎯 Use Cases

### 1. Training New Developers
Show how automated tests catch bugs early in development

### 2. Sales Demo
Demonstrate the value of comprehensive test coverage

### 3. CI/CD Presentation
Illustrate shift-left testing and catching issues pre-PR

### 4. Testing Workshop
Hands-on example of test-driven development benefits

## 🔄 Available Commands

| Command | Description |
|---------|-------------|
| `npm run add-broken-feature` | Add the buggy donation feature |
| `npm run fix-feature` | Apply the bug fix |
| `npm run reset-feature` | Restore original state |
| `npm run test:donation` | Run donation feature tests |
| `npm run demo:full` | Run complete automated demo |

## 💡 Tips

- Run `npm start` in a separate terminal before running tests
- The tests use Playwright and require the app to be running on `localhost:3000`
- You can manually test the feature in the browser:
  1. Login (user/password)
  2. Click "Withdraw"
  3. Select an account
  4. Enter withdrawal amount
  5. Check "Donate $5 to Sweetums Charity 🍬"
  6. Submit and observe the balance change (should decrease by withdrawal + $5)

## 🐛 Expected Test Results

### With Bug (after `npm run add-broken-feature`):
```
❌ should deduct donation amount from account balance - FAILED
  Expected: 9945
  Received: 9950
  (Missing $5 donation deduction)
```

### After Fix (after `npm run fix-feature`):
```
✅ should deduct donation amount from account balance - PASSED
✅ should show donation UI only on withdraw page - PASSED
✅ should toggle donation checkbox correctly - PASSED
✅ should process withdrawal without donation when checkbox is unchecked - PASSED
```

## 🧹 Cleanup

The `reset-feature.sh` script automatically:
- Restores the original `TransactPage.js`
- Removes the backup file
- Leaves the repository in a clean state

You can also manually reset by running:
```bash
git checkout src/components/TransactPage.js
```

---

*This demo is part of the banking-app testing demonstration suite. It showcases the value of automated testing in catching bugs early in the development lifecycle.*

