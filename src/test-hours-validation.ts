
import { createRestaurantSchema, validate } from './utils/validation';

const validPayload = {
  name: "Test Restaurant",
  hours: {
    monday: {
      isOpen: true,
      open: "09:00",
      close: "18:00",
      breakStart: "13:00",
      breakEnd: "14:00"
    },
    tuesday: {
      isOpen: false
    }
  },
  // Required fields for createRestaurantSchema
  menuItems: [],
  featuredDish: undefined
};

const invalidPayload = {
  name: "Invalid Restaurant",
  hours: {
    monday: {
      isOpen: true,
      breakStart: "invalid-time" // Should fail regex
    }
  },
   menuItems: [],
  featuredDish: undefined
};

try {
  console.log("Testing valid payload...");
  validate(createRestaurantSchema, validPayload);
  console.log("Valid payload passed validation.");
} catch (error) {
  console.error("Valid payload failed validation:", error);
}

try {
  console.log("\nTesting invalid payload...");
  validate(createRestaurantSchema, invalidPayload);
  console.log("Invalid payload passed validation (unexpected).");
} catch (error) {
  console.log("Invalid payload failed validation as expected.");
}
