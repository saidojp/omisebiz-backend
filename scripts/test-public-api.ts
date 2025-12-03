import "dotenv/config";
import axios from "axios";
import { prisma } from "../src/prisma";

const API_URL = process.env.API_BASE_URL || "http://localhost:4000";

const testPublicApi = async () => {
  try {
    console.log("Setting up test data...");
    
    // Create a user
    const user = await prisma.user.create({
      data: {
        email: `public-test-${Date.now()}@example.com`,
        password: "hashedpassword",
        username: `publicuser${Date.now()}`,
        uniqueID: `#${Date.now()}`,
      },
    });

    // Create a published restaurant
    const publishedSlug = `pub-rest-${Date.now()}`;
    await prisma.restaurant.create({
      data: {
        name: "Published Restaurant",
        slug: publishedSlug,
        userId: user.id,
        isPublished: true,
        description: "A published restaurant",
        category: "Test",
        contacts: {},
        address: {},
        hours: {},
        attributes: {},
        media: {},
        socials: {},
      },
    });

    // Create an unpublished restaurant
    const unpublishedSlug = `unpub-rest-${Date.now()}`;
    await prisma.restaurant.create({
      data: {
        name: "Unpublished Restaurant",
        slug: unpublishedSlug,
        userId: user.id,
        isPublished: false,
        description: "An unpublished restaurant",
        category: "Test",
        contacts: {},
        address: {},
        hours: {},
        attributes: {},
        media: {},
        socials: {},
      },
    });

    console.log("Testing published restaurant...");
    try {
      const res = await axios.get(`${API_URL}/api/public/restaurants/${publishedSlug}`);
      if (res.status === 200 && res.data.restaurant.slug === publishedSlug) {
        console.log("✅ Published restaurant fetched successfully");
      } else {
        console.error("❌ Failed to fetch published restaurant");
      }
    } catch (e) {
      console.error("❌ Error fetching published restaurant:", e);
    }

    console.log("Testing unpublished restaurant...");
    try {
      await axios.get(`${API_URL}/api/public/restaurants/${unpublishedSlug}`);
      console.error("❌ Unpublished restaurant should return 404 but returned 200");
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        console.log("✅ Unpublished restaurant returned 404 as expected");
      } else {
        console.error("❌ Unexpected error for unpublished restaurant:", e.message);
      }
    }

    console.log("Testing non-existent restaurant...");
    try {
      await axios.get(`${API_URL}/api/public/restaurants/non-existent-slug`);
      console.error("❌ Non-existent restaurant should return 404 but returned 200");
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        console.log("✅ Non-existent restaurant returned 404 as expected");
      } else {
        console.error("❌ Unexpected error for non-existent restaurant:", e.message);
      }
    }

    // Cleanup
    console.log("Cleaning up...");
    await prisma.restaurant.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log("Done.");

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

testPublicApi();
