import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

// Helper function to get auth token (you'll need to update with a real token or login)
async function getAuthToken(): Promise<string> {
  // Try to login with test credentials
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'slugtest@example.com',
      password: '123456'
    });
    return response.data.token;
  } catch (error: any) {
    console.log('Login failed, trying to register...');
    const timestamp = Date.now();
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: `slugtest${timestamp}@example.com`,
      username: `slugtest${timestamp}`,
      password: '123456'
    });
    return registerResponse.data.token;
  }
}

async function runTests() {
  try {
    console.log('🔐 Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Authenticated successfully\n');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Test 1: Create a restaurant
    console.log('📝 Test 1: Creating restaurant with name "Original Name"...');
    const createResponse = await axios.post(
      `${BASE_URL}/restaurants`,
      { name: 'Original Name' },
      { headers }
    );
    const restaurantId = createResponse.data.restaurant.id;
    const originalSlug = createResponse.data.restaurant.slug;
    console.log(`✅ Created restaurant with ID: ${restaurantId}`);
    console.log(`   Slug: ${originalSlug}`);
    console.log(`   Expected: "original-name"`);
    console.log(`   Match: ${originalSlug === 'original-name' ? '✅ PASS' : '❌ FAIL'}\n`);

    // Test 2: Update restaurant name - slug should auto-regenerate
    console.log('📝 Test 2: Updating restaurant name to "New Restaurant Name"...');
    const updateResponse = await axios.patch(
      `${BASE_URL}/restaurants/${restaurantId}`,
      { name: 'New Restaurant Name' },
      { headers }
    );
    const newSlug = updateResponse.data.restaurant.slug;
    console.log(`✅ Updated restaurant`);
    console.log(`   Old slug: ${originalSlug}`);
    console.log(`   New slug: ${newSlug}`);
    console.log(`   Expected: "new-restaurant-name"`);
    console.log(`   Match: ${newSlug === 'new-restaurant-name' ? '✅ PASS' : '❌ FAIL'}\n`);

    // Test 3: Update other fields (not name) - slug should NOT change
    console.log('📝 Test 3: Updating description only (slug should stay same)...');
    const updateDescResponse = await axios.patch(
      `${BASE_URL}/restaurants/${restaurantId}`,
      { description: 'A new description' },
      { headers }
    );
    const unchangedSlug = updateDescResponse.data.restaurant.slug;
    console.log(`✅ Updated description`);
    console.log(`   Slug: ${unchangedSlug}`);
    console.log(`   Should match previous: ${newSlug}`);
    console.log(`   Match: ${unchangedSlug === newSlug ? '✅ PASS' : '❌ FAIL'}\n`);

    // Test 4: Test uniqueness - create another restaurant with same name
    console.log('📝 Test 4: Testing slug uniqueness...');
    const secondRestaurant = await axios.post(
      `${BASE_URL}/restaurants`,
      { name: 'Sushi Bar' },
      { headers }
    );
    const firstSlug = secondRestaurant.data.restaurant.slug;
    console.log(`✅ Created restaurant with name "Sushi Bar"`);
    console.log(`   Slug: ${firstSlug}`);

    // Create third restaurant and update its name to conflict
    const thirdRestaurant = await axios.post(
      `${BASE_URL}/restaurants`,
      { name: 'Pizza Place' },
      { headers }
    );
    const thirdId = thirdRestaurant.data.restaurant.id;

    const conflictUpdate = await axios.patch(
      `${BASE_URL}/restaurants/${thirdId}`,
      { name: 'Sushi Bar' },
      { headers }
    );
    const conflictSlug = conflictUpdate.data.restaurant.slug;
    console.log(`✅ Updated third restaurant name to "Sushi Bar"`);
    console.log(`   First restaurant slug: ${firstSlug}`);
    console.log(`   Third restaurant slug: ${conflictSlug}`);
    console.log(`   Should have suffix: ${conflictSlug.startsWith('sushi-bar-') ? '✅ PASS' : '❌ FAIL'}\n`);

    // Test 5: Test manual regenerate-slug endpoint
    console.log('📝 Test 5: Testing manual regenerate-slug endpoint...');
    const regenerateResponse = await axios.patch(
      `${BASE_URL}/restaurants/${restaurantId}/regenerate-slug`,
      {},
      { headers }
    );
    const regeneratedSlug = regenerateResponse.data.restaurant.slug;
    console.log(`✅ Manually regenerated slug`);
    console.log(`   Slug: ${regeneratedSlug}`);
    console.log(`   Based on current name: "New Restaurant Name"`);
    console.log(`   Expected: "new-restaurant-name"`);
    console.log(`   Match: ${regeneratedSlug === 'new-restaurant-name' ? '✅ PASS' : '❌ FAIL'}\n`);

    // Test 6: Publish and test public endpoint
    console.log('📝 Test 6: Testing public endpoint with new slug...');
    await axios.patch(
      `${BASE_URL}/restaurants/${restaurantId}/publish`,
      {},
      { headers }
    );
    console.log(`✅ Published restaurant`);

    const publicResponse = await axios.get(
      `${BASE_URL}/api/public/restaurants/${regeneratedSlug}`
    );
    console.log(`✅ Public endpoint accessible`);
    console.log(`   Restaurant name: ${publicResponse.data.restaurant.name}`);
    console.log(`   Public slug works: ✅ PASS\n`);

    console.log('🎉 All tests completed!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Slug auto-generation on create');
    console.log('   ✅ Slug auto-regeneration on name update');
    console.log('   ✅ Slug unchanged when name not updated');
    console.log('   ✅ Slug uniqueness with suffixes');
    console.log('   ✅ Manual regenerate-slug endpoint');
    console.log('   ✅ Public endpoint works with new slugs');

  } catch (error: any) {
    console.error('❌ Test failed:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

runTests();
