import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

async function testPublicFeed() {
  try {
    console.log('📝 Testing Public Restaurants Feed...');
    
    // 1. Get the feed
    const response = await axios.get(`${BASE_URL}/api/public/restaurants`);
    
    console.log('✅ Response received');
    console.log('   Status:', response.status);
    
    if (response.data.success && response.data.data.restaurants) {
      const restaurants = response.data.data.restaurants;
      console.log(`   Found ${restaurants.length} published restaurants`);
      
      if (restaurants.length > 0) {
        console.log('   First restaurant:', restaurants[0].name);
        console.log('   Slug:', restaurants[0].slug);
        console.log('   Is Published:', restaurants[0].isPublished);
      }
      
      console.log('✅ Test Passed');
    } else {
      console.log('❌ Invalid response structure');
      console.log(JSON.stringify(response.data, null, 2));
    }
    
  } catch (error: any) {
    console.error('❌ Test Failed');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
  }
}

testPublicFeed();
