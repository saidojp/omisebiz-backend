import axios from 'axios';

const API_URL = 'http://localhost:4000';
const TEST_USER = {
  email: 'menu_test_user@example.com',
  password: '123456',
  username: 'menu_tester'
};

async function runTests() {
  try {
    console.log('🚀 Starting Menu Features Tests...\n');

    // 1. Auth: Register/Login
    console.log('1️⃣  Authentication...');
    let token;
    try {
      await axios.post(`${API_URL}/auth/register`, TEST_USER);
      console.log('   Registered new user');
    } catch (e: any) {
      if (e.response?.status === 409) {
        console.log('   User already exists');
      } else {
        throw e;
      }
    }

    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    token = loginRes.data.token;
    console.log('   ✅ Logged in successfully\n');

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 2. Create Restaurant with Menu
    console.log('2️⃣  Test: Create Restaurant with Menu');
    const restaurantData = {
      name: `Sushi Test ${Date.now()}`,
      description: "Authentic Japanese cuisine",
      category: "Japanese",
      menuItems: [
        {
          id: "menu-1",
          name: "Grilled Salmon",
          description: "Fresh Atlantic salmon",
          price: "¥2500",
          category: "Main Course",
          imageUrl: "https://example.com/salmon.jpg"
        }
      ],
      featuredDish: {
        menuItemId: "menu-1",
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon",
        price: "¥2500",
        imageUrl: "https://example.com/salmon.jpg"
      }
    };

    const createRes = await axios.post(`${API_URL}/restaurants`, restaurantData, { headers: authHeaders });
    const restaurantId = createRes.data.restaurant.id;
    const slug = createRes.data.restaurant.slug;

    if (createRes.data.restaurant.menuItems?.length === 1 && createRes.data.restaurant.featuredDish) {
      console.log('   ✅ Restaurant created with menu and featured dish');
    } else {
      console.error('   ❌ Failed: Menu items or featured dish missing in response');
      process.exit(1);
    }
    console.log(`   ID: ${restaurantId}`);
    console.log(`   Slug: ${slug}\n`);

    // 3. Update Menu
    console.log('3️⃣  Test: Update Menu');
    const updateData = {
      menuItems: [
        {
          id: "menu-1",
          name: "Grilled Salmon (Updated)",
          price: "¥2800",
          category: "Main Course"
        },
        {
          id: "menu-2",
          name: "Miso Soup",
          price: "¥500",
          category: "Appetizers"
        }
      ],
      featuredDish: {
        menuItemId: "menu-1",
        name: "Grilled Salmon (Updated)",
        price: "¥2800"
      }
    };

    const updateRes = await axios.patch(`${API_URL}/restaurants/${restaurantId}`, updateData, { headers: authHeaders });
    
    if (updateRes.data.restaurant.menuItems?.length === 2 && updateRes.data.restaurant.featuredDish.name.includes('Updated')) {
      console.log('   ✅ Menu updated successfully');
    } else {
      console.error('   ❌ Failed: Menu update verification failed');
      process.exit(1);
    }
    console.log('\n');

    // 4. Publish Restaurant (needed for public API)
    console.log('4️⃣  Publishing Restaurant...');
    await axios.patch(`${API_URL}/restaurants/${restaurantId}/publish`, {}, { headers: authHeaders });
    console.log('   ✅ Restaurant published\n');

    // 5. Public API Check
    console.log('5️⃣  Test: Public API');
    const publicRes = await axios.get(`${API_URL}/api/public/restaurants/${slug}`);
    
    const publicRest = publicRes.data.restaurant;
    if (publicRest.menuItems && publicRest.featuredDish) {
      console.log('   ✅ Public API returns menuItems and featuredDish');
      console.log(`   Menu Items Count: ${publicRest.menuItems.length}`);
      console.log(`   Featured Dish: ${publicRest.featuredDish.name}`);
    } else {
      console.error('   ❌ Failed: Public API missing menu data');
      process.exit(1);
    }
    console.log('\n');

    // 6. Validation Test
    console.log('6️⃣  Test: Validation (Invalid Data)');
    try {
      await axios.post(`${API_URL}/restaurants`, {
        name: "Invalid Menu",
        menuItems: [{ id: "1", name: "", price: "100" }] // Empty name should fail
      }, { headers: authHeaders });
      console.error('   ❌ Failed: Should have rejected invalid menu item');
    } catch (e: any) {
      if (e.response?.status === 400) {
        console.log('   ✅ Validation correctly rejected invalid data');
      } else {
        console.error(`   ❌ Unexpected error: ${e.message}`);
      }
    }

    console.log('\n🎉 All tests passed successfully!');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

runTests();
