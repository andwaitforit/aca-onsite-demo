# Jira Story: Sweetums Charity Donation Feature

## Epic
Banking App - Customer Engagement Features

---

## Story

**Title**: Add $5 Charity Donation Option to Withdrawal Transactions

**Story ID**: BANK-1234

**Story Type**: Feature

**Priority**: Medium

**Story Points**: 5

---

## User Story

**As a** bank customer  
**I want to** have the option to donate $5 to Sweetums Charity when making a withdrawal  
**So that** I can easily support a charitable cause while conducting my banking transactions

---

## Business Value

- **Customer Engagement**: Provides customers with a simple way to contribute to charity
- **Social Responsibility**: Demonstrates the bank's commitment to community support
- **Revenue Neutral**: Donation amount is deducted from customer's account
- **User Experience**: Simple one-click donation toggle enhances the withdrawal process

---

## Acceptance Criteria

### AC1: Donation Option Visibility
**Given** I am on the withdrawal page  
**When** I select an account  
**Then** I should see a donation option labeled "Donate $5 to Sweetums Charity 🍬"

**And** the donation option should NOT appear on the deposit page

### AC2: Donation Toggle Functionality
**Given** I am on the withdrawal page with the donation option visible  
**When** I click on the donation checkbox or label  
**Then** the checkbox should toggle between checked and unchecked states

**And** I should be able to toggle it multiple times before submitting

### AC3: Donation Amount Deduction
**Given** I have selected an account with a balance of $10,000  
**And** I enter a withdrawal amount of $50  
**And** I check the "Donate $5 to Sweetums Charity" checkbox  
**When** I submit the withdrawal  
**Then** my account balance should be reduced by $55 ($50 withdrawal + $5 donation)

**And** I should see a success message including "Thank you for your $5 donation to Sweetums Charity!"

### AC4: Withdrawal Without Donation
**Given** I am on the withdrawal page  
**And** I enter a withdrawal amount of $50  
**And** I do NOT check the donation checkbox  
**When** I submit the withdrawal  
**Then** my account balance should be reduced by only $50

**And** the success message should NOT mention the donation

### AC5: Fixed Donation Amount
**Given** I am on the withdrawal page  
**When** I view the donation option  
**Then** the amount should be clearly displayed as "$5"

**And** there should be no input field to change the donation amount

---

## Technical Requirements

### Frontend Changes
- **Component**: `TransactPage.js`
- **Location**: Withdrawal page only (`props.page === 'withdraw'`)
- **UI Elements**:
  - Checkbox with ID `donation-toggle`
  - Label text: "Donate $5 to Sweetums Charity 🍬"
  - Styled container with light blue background (#f0f8ff)
  - Green border (1px solid #4CAF50)
  - 18px × 18px checkbox for better clickability
  - Pointer cursor on hover

### State Management
```javascript
const [donationEnabled, setDonationEnabled] = useState(false);
const DONATION_AMOUNT = 5; // Fixed $5 donation
```

### Business Logic
```javascript
const donation = donationEnabled ? DONATION_AMOUNT : 0;
const totalAmount = parseFloat(amount) + donation;
transact(user.number, totalAmount, 'subtract', props.setUsers);
```

### Success Message
- Without donation: "Withdraw successful."
- With donation: "Withdraw successful. Thank you for your $5 donation to Sweetums Charity!"

---

## Test Cases

### Test Case 1: Verify Donation UI Appears on Withdrawal Page

**Test ID**: TC-BANK-1234-01  
**Priority**: High  
**Type**: Functional

**Pre-conditions**:
- Application is running
- User is logged in
- Test account exists with sufficient balance

**Test Steps**:
1. Navigate to the Banking App
2. Log in with credentials (user/password)
3. Click on "Withdraw" in the sidebar
4. Verify the donation checkbox is visible
5. Verify the label reads "Donate $5 to Sweetums Charity 🍬"
6. Navigate to "Deposit" page
7. Verify the donation checkbox is NOT visible

**Expected Results**:
- ✅ Donation option visible on Withdraw page
- ✅ Label clearly shows "$5" amount
- ✅ Donation option NOT visible on Deposit page

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

### Test Case 2: Verify Checkbox Toggle Functionality

**Test ID**: TC-BANK-1234-02  
**Priority**: High  
**Type**: Functional

**Pre-conditions**:
- User is on the Withdraw page
- Donation checkbox is visible

**Test Steps**:
1. Observe the checkbox initial state (should be unchecked)
2. Click on the checkbox
3. Verify checkbox becomes checked
4. Click on the checkbox again
5. Verify checkbox becomes unchecked
6. Click on the label text "Donate $5 to Sweetums Charity 🍬"
7. Verify checkbox toggles
8. Hover over the checkbox and label
9. Verify cursor changes to pointer

**Expected Results**:
- ✅ Checkbox starts unchecked
- ✅ Clicking checkbox toggles state
- ✅ Clicking label toggles checkbox
- ✅ Pointer cursor appears on hover
- ✅ Visual feedback on state change

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

### Test Case 3: Verify Correct Amount Deduction With Donation

**Test ID**: TC-BANK-1234-03  
**Priority**: Critical  
**Type**: Functional

**Pre-conditions**:
- User is logged in
- Test account has a balance of $10,000.00

**Test Steps**:
1. Navigate to Withdraw page
2. Select the test account from dropdown
3. Note the current balance: $10,000.00
4. Enter withdrawal amount: $50
5. Check the "Donate $5 to Sweetums Charity" checkbox
6. Verify checkbox is checked (visual confirmation)
7. Click "withdraw" button
8. Wait for success message to appear
9. Verify success message content
10. Note the new balance
11. Calculate expected balance: $10,000 - $50 - $5 = $9,945

**Expected Results**:
- ✅ Initial balance: $10,000.00
- ✅ Withdrawal entered: $50.00
- ✅ Donation checked: $5.00
- ✅ Total deduction: $55.00
- ✅ New balance: $9,945.00
- ✅ Success message includes: "Thank you for your $5 donation to Sweetums Charity!"

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

### Test Case 4: Verify Correct Amount Deduction Without Donation

**Test ID**: TC-BANK-1234-04  
**Priority**: Critical  
**Type**: Functional

**Pre-conditions**:
- User is logged in
- Test account has a balance of $10,000.00

**Test Steps**:
1. Navigate to Withdraw page
2. Select the test account from dropdown
3. Note the current balance: $10,000.00
4. Enter withdrawal amount: $75
5. Do NOT check the donation checkbox
6. Verify checkbox is unchecked
7. Click "withdraw" button
8. Wait for success message
9. Verify success message content
10. Note the new balance
11. Calculate expected balance: $10,000 - $75 = $9,925

**Expected Results**:
- ✅ Initial balance: $10,000.00
- ✅ Withdrawal entered: $75.00
- ✅ Donation unchecked: $0.00
- ✅ Total deduction: $75.00
- ✅ New balance: $9,925.00
- ✅ Success message: "Withdraw successful." (no donation mention)

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

### Test Case 5: Verify Multiple Consecutive Transactions

**Test ID**: TC-BANK-1234-05  
**Priority**: Medium  
**Type**: Functional

**Pre-conditions**:
- User is logged in
- Test account has a balance of $10,000.00

**Test Steps**:
1. Navigate to Withdraw page
2. Select test account
3. **Transaction 1**: Withdraw $100 with donation checked
4. Verify balance: $9,895 ($10,000 - $105)
5. **Transaction 2**: Withdraw $50 without donation
6. Verify balance: $9,845 ($9,895 - $50)
7. **Transaction 3**: Withdraw $25 with donation checked
8. Verify balance: $9,815 ($9,845 - $30)
9. Verify each success message is appropriate

**Expected Results**:
- ✅ Each transaction processes correctly
- ✅ Donation checkbox resets to unchecked after each transaction
- ✅ Balance calculations are accurate for each transaction
- ✅ Success messages reflect whether donation was made

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

### Test Case 6: Verify Insufficient Funds Handling

**Test ID**: TC-BANK-1234-06  
**Priority**: High  
**Type**: Negative Testing

**Pre-conditions**:
- User is logged in
- Test account has a balance of $50.00

**Test Steps**:
1. Navigate to Withdraw page
2. Select test account with $50 balance
3. Enter withdrawal amount: $50
4. Check the donation checkbox (total = $55)
5. Click "withdraw" button
6. Observe the result

**Expected Results**:
- ✅ Transaction should fail
- ✅ Error message: "Withdraw failed." OR appropriate insufficient funds message
- ✅ Balance remains $50.00
- ✅ User can retry with adjusted amounts

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

### Test Case 7: Verify UI Elements and Styling

**Test ID**: TC-BANK-1234-07  
**Priority**: Low  
**Type**: UI/UX

**Pre-conditions**:
- User is on the Withdraw page

**Test Steps**:
1. Locate the donation option container
2. Verify background color is light blue (#f0f8ff)
3. Verify border is green (1px solid #4CAF50)
4. Verify padding is 15px
5. Verify border-radius is 5px
6. Verify checkbox size is 18px × 18px
7. Verify label font size is 16px
8. Verify label font weight is 500
9. Verify 🍬 emoji is present
10. Test on different screen sizes (responsive)

**Expected Results**:
- ✅ All styling matches design specifications
- ✅ Visual hierarchy is clear
- ✅ Colors provide good contrast
- ✅ Checkbox is easily clickable
- ✅ Responsive on mobile and tablet

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

### Test Case 8: Verify Browser Compatibility

**Test ID**: TC-BANK-1234-08  
**Priority**: Medium  
**Type**: Compatibility

**Browsers to Test**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test Steps** (for each browser):
1. Open application in browser
2. Log in
3. Navigate to Withdraw page
4. Verify donation checkbox appears correctly
5. Test checkbox toggle functionality
6. Perform a withdrawal with donation
7. Verify balance updates correctly
8. Check console for errors

**Expected Results**:
- ✅ Consistent appearance across all browsers
- ✅ Checkbox functions correctly in all browsers
- ✅ No JavaScript errors in console
- ✅ Balance calculations work correctly

**Actual Results**: [To be filled during testing]

**Status**: [Pass/Fail]

---

## Automated Test Coverage

### Playwright Test Suite
**File**: `tests/donation.spec.js`

**Test Scenarios**:
1. ✅ Should deduct donation amount from account balance
2. ✅ Should show donation UI only on withdraw page
3. ✅ Should toggle donation checkbox correctly
4. ✅ Should process withdrawal without donation when checkbox is unchecked

**Run Tests**:
```bash
npm run test:donation
```

---

## Edge Cases to Consider

### Edge Case 1: Rapid Clicking
**Scenario**: User rapidly clicks checkbox multiple times  
**Expected**: Checkbox state should accurately reflect final click  
**Risk**: Low

### Edge Case 2: Browser Back Button
**Scenario**: User clicks back after submitting donation  
**Expected**: Checkbox should reset to unchecked state  
**Risk**: Low

### Edge Case 3: Session Timeout
**Scenario**: User checks donation box, then session times out  
**Expected**: Graceful handling with re-authentication  
**Risk**: Medium

### Edge Case 4: Concurrent Transactions
**Scenario**: Multiple browser tabs/windows with same account  
**Expected**: Balance should be consistent across all views  
**Risk**: Medium

### Edge Case 5: Decimal Amounts
**Scenario**: Withdrawal amount has cents (e.g., $50.25)  
**Expected**: Total calculation includes donation correctly ($55.25)  
**Risk**: Low

---

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] All test cases pass (TC-BANK-1234-01 through TC-BANK-1234-08)
- [ ] Automated tests pass (`npm run test:donation`)
- [ ] Code review completed and approved
- [ ] No React console warnings or errors
- [ ] Responsive design verified on mobile, tablet, desktop
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Documentation updated (README, technical docs)
- [ ] Feature demo performed for product owner
- [ ] Accessibility requirements met (WCAG 2.1 Level AA)
- [ ] Performance impact assessed (no significant degradation)
- [ ] Security review completed (no vulnerabilities introduced)
- [ ] Deployed to staging environment
- [ ] QA sign-off received
- [ ] Product owner acceptance received

---

## Dependencies

- No external API dependencies
- Uses existing `transact()` utility function
- Integrates with existing withdrawal flow
- No database schema changes required

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Checkbox not toggling on some browsers | High | Low | Cross-browser testing, fallback UI |
| Incorrect calculation of total amount | Critical | Low | Comprehensive unit tests, manual QA |
| User confusion about fixed $5 amount | Medium | Medium | Clear UI label, help text if needed |
| Performance impact on slow devices | Low | Low | Lightweight implementation, no heavy operations |

---

## Rollback Plan

If critical issues are discovered in production:

1. **Immediate**: Feature flag to disable donation option
2. **Quick Fix**: Deploy hotfix to hide donation UI
3. **Full Rollback**: Revert to previous commit if necessary

**Feature Flag**: `ENABLE_CHARITY_DONATION = false`

---

## Success Metrics

**KPIs to Track**:
- Donation adoption rate (% of withdrawals with donation)
- Total donation amount per week/month
- User feedback/satisfaction scores
- No increase in support tickets related to withdrawals
- No regression in withdrawal transaction completion rate

**Target Metrics**:
- At least 10% donation adoption rate
- Zero critical bugs in production
- Zero increase in withdrawal-related support tickets

---

## Related Stories

- BANK-1235: Add donation reporting dashboard (Future)
- BANK-1236: Support multiple charity options (Future)
- BANK-1237: Add tax receipt generation (Future)
- BANK-1238: Monthly donation summary email (Future)

---

## Attachments

- Screenshots of UI (before/after)
- Demo video: `npm run demo:full`
- Technical documentation: `docs/DONATION_FEATURE_DEMO.md`
- Test results: Playwright test report

---

## Comments

**Product Owner**: "This feature aligns with our Q4 goal of increasing customer engagement and social responsibility. The $5 fixed amount keeps it simple for MVP."

**Tech Lead**: "Implementation is straightforward and low-risk. The existing withdrawal infrastructure handles this cleanly."

**QA Lead**: "Comprehensive test coverage in place. Recommend extra attention to cross-browser testing due to checkbox implementation."

---

**Created**: November 2025  
**Last Updated**: November 2025  
**Assignee**: Development Team  
**Reporter**: Product Owner  
**Labels**: feature, customer-engagement, charity, mvp  
**Sprint**: Sprint 24

