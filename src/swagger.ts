import swaggerJsdoc, { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Omisebiz Backend API",
      version: "1.0.0",
      description: "Authentication and user management API",
    },
    servers: [
      {
        url: process.env.API_BASE_URL ?? "http://localhost:4000",
        description: "Current environment",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        User: {
          type: "object",
          required: [
            "id",
            "uniqueID",
            "email",
            "username",
            "createdAt",
            "updatedAt",
          ],
          properties: {
            id: { type: "string", example: "ckxyz123" },
            uniqueID: { type: "string", example: "#1010" },
            email: { type: "string", format: "email" },
            username: {
              type: "string",
              example: "omise_user",
              description:
                "Unique username (case-insensitive, globally unique)",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Restaurant: {
          type: "object",
          properties: {
            id: { type: "string", example: "cmie8tz8b0005piv2md0japx1" },
            slug: { type: "string", example: "my-restaurant" },
            name: { type: "string", example: "My Restaurant" },
            description: { type: "string", example: "A wonderful place to eat" },
            category: { type: "string", example: "Japanese" },
            contacts: {
              type: "object",
              properties: {
                phone: { type: "string", example: "+81-3-1234-5678" },
                email: { type: "string", example: "info@restaurant.com" },
                website: { type: "string", example: "https://restaurant.com" },
              },
            },
            address: {
              type: "object",
              properties: {
                street: { type: "string", example: "1-2-3 Shibuya" },
                city: { type: "string", example: "Tokyo" },
                zip: { type: "string", example: "150-0002" },
                country: { type: "string", example: "Japan" },
              },
            },
            location: {
              type: "object",
              nullable: true,
              properties: {
                lat: { type: "number", example: 35.6762 },
                lng: { type: "number", example: 139.6503 },
              },
            },
            hours: {
              type: "object",
              example: {
                monday: { isOpen: true, open: "09:00", close: "22:00" },
                tuesday: { isOpen: false },
              },
            },
            priceRange: {
              type: "string",
              enum: ["$", "$$", "$$$", "$$$$"],
              example: "$$",
            },
            attributes: {
              type: "object",
              example: { hasWifi: true, hasParking: true },
            },
            media: {
              type: "object",
              example: { logo: "https://example.com/logo.jpg" },
            },
            socials: {
              type: "object",
              example: { instagram: "https://instagram.com/restaurant" },
            },
            isPublished: { type: "boolean", example: false },
            userId: { type: "string", example: "cmie5z9d80001pi959kmejudg" },
            createdAt: { type: "string", format: "date-time", example: "2025-11-25T07:17:34.235Z" },
            updatedAt: { type: "string", format: "date-time", example: "2025-11-25T07:17:34.235Z" },
          },
        },
        CreateRestaurantRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "My Restaurant" },
            description: { type: "string", example: "A wonderful place to eat" },
            category: { type: "string", example: "Japanese" },
            contacts: {
              type: "object",
              properties: {
                phone: { type: "string", example: "+81-3-1234-5678" },
                email: { type: "string", format: "email", example: "info@restaurant.com" },
                website: { type: "string", format: "uri", example: "https://restaurant.com" },
              },
            },
            address: {
              type: "object",
              properties: {
                street: { type: "string", example: "1-2-3 Shibuya" },
                city: { type: "string", example: "Tokyo" },
                zip: { type: "string", example: "150-0002" },
                country: { type: "string", example: "Japan" },
              },
            },
            hours: {
              type: "object",
              example: {
                monday: { isOpen: true, open: "09:00", close: "22:00" },
                tuesday: { isOpen: false },
              },
            },
            priceRange: {
              type: "string",
              enum: ["$", "$$", "$$$", "$$$$"],
              description: "Price range: $ (cheap), $$ (moderate), $$$ (expensive), $$$$ (very expensive)",
              example: "$$",
            },
            attributes: {
              type: "object",
              example: { hasWifi: true, hasParking: true },
            },
            media: {
              type: "object",
              example: { logo: "https://example.com/logo.jpg" },
            },
            socials: {
              type: "object",
              example: { instagram: "https://instagram.com/restaurant" },
            },
          },
        },
        UpdateRestaurantRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Updated Restaurant Name" },
            description: { type: "string", example: "Updated description" },
            category: { type: "string", example: "Italian" },
            contacts: {
              type: "object",
              properties: {
                phone: { type: "string", example: "+81-3-1234-5678" },
                email: { type: "string", format: "email", example: "info@restaurant.com" },
                website: { type: "string", format: "uri", example: "https://restaurant.com" },
              },
            },
            address: {
              type: "object",
              properties: {
                street: { type: "string", example: "1-2-3 Shibuya" },
                city: { type: "string", example: "Tokyo" },
                zip: { type: "string", example: "150-0002" },
                country: { type: "string", example: "Japan" },
              },
            },
            hours: {
              type: "object",
              example: {
                monday: { isOpen: true, open: "09:00", close: "22:00" },
                tuesday: { isOpen: false },
              },
            },
            priceRange: {
              type: "string",
              enum: ["$", "$$", "$$$", "$$$$"],
              description: "Price range: $ (cheap), $$ (moderate), $$$ (expensive), $$$$ (very expensive)",
              example: "$$",
            },
            attributes: {
              type: "object",
              example: { hasWifi: true, hasParking: true },
            },
            media: {
              type: "object",
              example: { logo: "https://example.com/logo.jpg" },
            },
            socials: {
              type: "object",
              example: { instagram: "https://instagram.com/restaurant" },
            },
          },
        },
        RestaurantResponse: {
          type: "object",
          properties: {
            restaurant: { $ref: "#/components/schemas/Restaurant" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "username"],
          properties: {
            email: { type: "string", format: "email" },
            password: {
              type: "string",
              pattern: "^\\d{6}$",
              example: "123456",
            },
            username: {
              type: "string",
              example: "new_user",
              description: "Unique username (case-insensitive check)",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: {
              type: "string",
              pattern: "^\\d{6}$",
              example: "123456",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          description: "At least one field (username or password) must be provided",
          properties: {
            username: {
              type: "string",
              example: "new_name",
              description: "New unique username (case-insensitive)",
            },
            password: {
              type: "string",
              pattern: "^\\d{6}$",
              example: "654321",
              description: "New password (exactly 6 digits)",
            },
          },
        },
        UsernameRequest: {
          type: "object",
          required: ["username"],
          properties: {
            username: {
              type: "string",
              example: "new_name",
              description: "Unique username (case-insensitive)",
            },
          },
        },
        EmailRequest: {
          type: "object",
          required: ["email"],
          properties: { email: { type: "string", format: "email" } },
        },
        PasswordRequest: {
          type: "object",
          required: ["password"],
          properties: { password: { type: "string", pattern: "^\\d{6}$" } },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        UserResponseBody: {
          type: "object",
          properties: { user: { $ref: "#/components/schemas/User" } },
        },
        MessageResponse: {
          type: "object",
          properties: { message: { type: "string" } },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: { message: { type: "string" } },
            },
          },
        },
      },
      responses: {
        UserResponse: {
          description: "User payload",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponseBody" },
            },
          },
        },
        BadRequest: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Conflict: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
