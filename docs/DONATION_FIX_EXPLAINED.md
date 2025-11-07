# Donation Feature Fix - Technical Explanation

## The Bug

In `add-broken-feature.sh`, the donation amount was not being deducted from the account:

```javascript
// BUG: Only processing the main amount, not including donation
transact(user.number, amount, props.type, props.setUsers);
```

This meant:
- User withdraws $50
- User donates $10
- **Only $50 is deducted** (bug!)
- Balance shows $9,950 instead of expected $9,940

## The Fix

In `fix-feature.sh`, we now properly calculate the total amount:

```javascript
// FIX: Calculate donation amount properly
const donation = donationEnabled && donationAmount > 0 ? parseFloat(donationAmount) || 0 : 0;

// FIX: Calculate total amount including donation
const totalAmount = parseFloat(amount) + donation;

// Process the total withdrawal (including donation)
transact(user.number, totalAmount, props.type, props.setUsers);
```

Now:
- User withdraws $50
- User donates $10
- Total calculation: $50 + $10 = $60
- **$60 is deducted** (correct!)
- Balance shows $9,940 ✅

## How It Works

### 1. State Management
The donation amount is stored in state and processed through the `trim()` utility:

```javascript
const onDonationAmount = (e) => {
    const rawValue = e.target.value;
    const amount = trim(rawValue);  // Converts to number, handles $ and commas
    setDonationAmount(amount);
}
```

### 2. Transaction Processing
When the form is submitted:

```javascript
const amount = trim(e.target.elements.amount.value);  // Main withdrawal amount
const donation = donationEnabled && donationAmount > 0 ? parseFloat(donationAmount) || 0 : 0;
const totalAmount = parseFloat(amount) + donation;  // Total to withdraw
transact(user.number, totalAmount, 'subtract', props.setUsers);
```

### 3. The `transact()` Function
From `Utils.js`, the transact function handles the actual balance update:

```javascript
export function transact(number, amount, type, setUsers) {
    let multiplier = 1;
    if(type === 'subtract' || type === 'debit') multiplier = -1;
    
    // ...
    user.balance += amount * multiplier;  // For withdrawals: balance += 60 * -1
    // ...
}
```

So with `type="subtract"`:
- `totalAmount = 60` (withdrawal 50 + donation 10)
- `multiplier = -1`
- `user.balance += 60 * -1` = `user.balance -= 60` ✅

## Validation & Edge Cases

The fix handles these edge cases:

1. **Empty donation field**: `donationAmount` defaults to 0
2. **Donation checkbox unchecked**: `donation = 0`
3. **Invalid input**: `parseFloat(...) || 0` ensures we get 0 instead of NaN
4. **Zero donation**: Check `donationAmount > 0` before parsing

## Test Expectations

The test (`tests/donation.spec.js`) verifies:

```javascript
const withdrawalAmount = 50;
const donationAmount = 10;

// Expected: initialBalance - withdrawalAmount - donationAmount
const expectedBalance = initialBalance - 50 - 10;

// Assert the balance is correct
expect(newBalance).toBeCloseTo(expectedBalance, 2);
```

### Test Scenario
```
Initial balance: $10,000.00
Withdrawal:          -$50.00
Donation:            -$10.00
─────────────────────────────
Expected balance:  $9,940.00
```

## Verification Steps

To verify the fix works:

1. **Run the broken version**:
   ```bash
   npm run add-broken-feature
   npm start  # In another terminal
   npm run test:donation  # Should FAIL
   ```
   Result: Balance will be $9,950 (only withdrawal deducted)

2. **Apply the fix**:
   ```bash
   npm run fix-feature
   npm run test:donation  # Should PASS
   ```
   Result: Balance will be $9,940 (withdrawal + donation deducted)

3. **Manual testing**:
   - Go to http://localhost:3000
   - Login (user/password)
   - Click "Withdraw"
   - Select an account
   - Enter withdrawal amount: 50
   - Check "Donate to Sweetums Charity"
   - Enter donation: 10
   - Click "withdraw"
   - Verify balance decreased by $60

## Success Criteria

✅ **Bug Fixed When:**
- Test `npm run test:donation` passes
- Balance correctly reflects withdrawal + donation
- Success message shows donation amount
- Transaction history (if checked) shows correct total

❌ **Bug Still Exists If:**
- Test fails with "Expected: 9940, Received: 9950"
- Only withdrawal amount is deducted
- Donation amount is ignored in calculation

## Key Code Changes

### Before (Broken)
```javascript
transact(user.number, amount, props.type, props.setUsers);
```

### After (Fixed)  
```javascript
const donation = donationEnabled && donationAmount > 0 ? parseFloat(donationAmount) || 0 : 0;
const totalAmount = parseFloat(amount) + donation;
transact(user.number, totalAmount, props.type, props.setUsers);
```

### Message Display
```javascript
// Before
if (donationEnabled && donationAmount > 0) {
    message += ` Thank you for your $${donationAmount} donation to Sweetums Charity!`;
}

// After (uses formatted donation value)
if (donation > 0) {
    message += ` Thank you for your $${donation.toFixed(2)} donation to Sweetums Charity!`;
}
```

---

**Summary**: The fix ensures that both the withdrawal amount AND the donation amount are included in the total that gets deducted from the user's account balance.

