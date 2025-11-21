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
          properties: {
            username: {
              type: "string",
              example: "new_name",
              description: "New unique username (case-insensitive)",
            },
            password: { type: "string", pattern: "^\\d{6}$" },
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
