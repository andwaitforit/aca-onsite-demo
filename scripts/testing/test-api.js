/**
 * Simple test script for Stock Tracker API
 * Run with: node scripts/test-api.js
 * Make sure the server is running on port 3001 first
 */

const BASE_URL = 'http://localhost:3001/api';

// Test helper function
async function testEndpoint(name, url, expectedStatus = 200, options = {}) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   URL: ${url}`);
    if (options.method) {
      console.log(`   Method: ${options.method}`);
    }
    
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    
    if (response.status === expectedStatus) {
      console.log(`   ✅ Status: ${response.status} (Expected: ${expectedStatus})`);
      console.log(`   📦 Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
      return { success: true, data };
    } else {
      console.log(`   ❌ Status: ${response.status} (Expected: ${expectedStatus})`);
      return { success: false, data };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('='.repeat(50));
  const testSymbol = `TST${Date.now().toString(36).toUpperCase()}`;
  const trackedSymbol = 'SWANSON';

  // Ensure tracked symbol starts from clean slate
  await fetch(`${BASE_URL}/tracked-stocks/${trackedSymbol}`, { method: 'DELETE' }).catch(() => {});
  
  // Test 1: Get all stocks
  await testEndpoint(
    'Get All Stocks',
    `${BASE_URL}/stocks`
  );
  
  // Test 2: Get single stock (valid)
  await testEndpoint(
    'Get Single Stock (Valid)',
    `${BASE_URL}/stocks/SWANSON`
  );
  
  // Test 3: Get single stock (invalid)
  await testEndpoint(
    'Get Single Stock (Invalid)',
    `${BASE_URL}/stocks/INVALID`,
    404
  );
  
  // Test 4: Get batch stocks (valid)
  await testEndpoint(
    'Get Batch Stocks (Valid)',
    `${BASE_URL}/stocks/batch/SWANSON,LITTLES,PAWN`
  );
  
  // Test 5: Get batch stocks (mixed valid/invalid)
  await testEndpoint(
    'Get Batch Stocks (Mixed)',
    `${BASE_URL}/stocks/batch/SWANSON,INVALID,PAWN`
  );

  // Test 6: Create stock (valid)
  await testEndpoint(
    'Create Stock (Valid)',
    `${BASE_URL}/stocks`,
    201,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: testSymbol, name: 'Test Co', basePrice: 10.5 })
    }
  );

  // Test 7: Create stock (duplicate)
  await testEndpoint(
    'Create Stock (Duplicate)',
    `${BASE_URL}/stocks`,
    409,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: testSymbol, name: 'Test Co Again', basePrice: 20 })
    }
  );

  // Test 8: Delete stock (valid)
  await testEndpoint(
    'Delete Stock (Valid)',
    `${BASE_URL}/stocks/${testSymbol}`,
    200,
    { method: 'DELETE' }
  );

  // Test 9: Delete stock (not found)
  await testEndpoint(
    'Delete Stock (Not Found)',
    `${BASE_URL}/stocks/${testSymbol}`,
    404,
    { method: 'DELETE' }
  );

  // Test 10: List tracked stocks (initial state)
  await testEndpoint(
    'Get Tracked Stocks (Initial)',
    `${BASE_URL}/tracked-stocks`
  );

  // Test 11: Add tracked stock
  await testEndpoint(
    'Add Tracked Stock',
    `${BASE_URL}/tracked-stocks`,
    201,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: trackedSymbol })
    }
  );

  // Test 12: Get tracked stocks (after add)
  await testEndpoint(
    'Get Tracked Stocks (After Add)',
    `${BASE_URL}/tracked-stocks`
  );

  // Test 13: Add tracked stock duplicate
  await testEndpoint(
    'Add Tracked Stock (Duplicate)',
    `${BASE_URL}/tracked-stocks`,
    409,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: trackedSymbol })
    }
  );

  // Test 14: Remove tracked stock
  await testEndpoint(
    'Remove Tracked Stock',
    `${BASE_URL}/tracked-stocks/${trackedSymbol}`,
    200,
    { method: 'DELETE' }
  );

  // Test 15: Remove tracked stock (not found)
  await testEndpoint(
    'Remove Tracked Stock (Not Found)',
    `${BASE_URL}/tracked-stocks/${trackedSymbol}`,
    404,
    { method: 'DELETE' }
  );
  
  // Test 16: Verify price changes
  console.log('\n🔄 Testing Price Randomization...');
  const result1 = await testEndpoint('First Request', `${BASE_URL}/stocks/SWANSON`);
  await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  const result2 = await testEndpoint('Second Request', `${BASE_URL}/stocks/SWANSON`);
  
  if (result1.success && result2.success) {
    const price1 = result1.data.price;
    const price2 = result2.data.price;
    if (price1 !== price2) {
      console.log(`   ✅ Prices are different: $${price1} vs $${price2} (Randomization working)`);
    } else {
      console.log(`   ⚠️  Prices are the same: $${price1} (May happen by chance)`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Tests Complete!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or install node-fetch');
  console.log('   Install: npm install node-fetch');
  console.log('   Or use: node --experimental-fetch scripts/test-api.js');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
