# Backend API Reference

**Base URL:** `http://localhost:4000`  
**Version:** 1.0  
**Documentation:** [Swagger UI](http://localhost:4000/api-docs)

All protected endpoints require Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Restaurants](#restaurants)
4. [Upload](#upload)
5. [Public API](#public-api)
6. [Data Schemas](#data-schemas)
7. [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "123456"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm123abc",
    "uniqueID": "#1001",
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `username`: Min 3 chars, unique (case-insensitive)
- `password`: Exactly 6 digits (e.g., "123456")

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm123abc",
    "uniqueID": "#1001",
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "error": {
    "message": "Invalid credentials"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "cm123abc",
    "uniqueID": "#1001",
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

---

## 👤 User Management

### Update User
**PATCH** `/user`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (at least one field required):**
```json
{
  "username": "new_username",
  "password": "654321"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "cm123abc",
    "uniqueID": "#1001",
    "email": "user@example.com",
    "username": "new_username",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:10:00.000Z"
  }
}
```

---

### Delete User
**DELETE** `/user`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted"
}
```

---

## 🍽️ Restaurants

### Create Restaurant
**POST** `/restaurants`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Restaurant",
  "description": "A wonderful place to eat",
  "category": "Japanese",
  "contacts": {
    "phone": "+81-3-1234-5678",
    "email": "info@restaurant.com",
    "website": "https://restaurant.com"
  },
  "address": {
    "street": "1-2-3 Shibuya",
    "city": "Tokyo",
    "zip": "150-0002",
    "country": "Japan"
  },
  "location": {
    "lat": 35.6762,
    "lng": 139.6503
  },
  "hours": {
    "monday": { "isOpen": true, "open": "09:00", "close": "22:00" },
    "tuesday": { "isOpen": true, "open": "09:00", "close": "22:00" },
    "wednesday": { "isOpen": true, "open": "09:00", "close": "22:00" },
    "thursday": { "isOpen": true, "open": "09:00", "close": "22:00" },
    "friday": { "isOpen": true, "open": "09:00", "close": "23:00" },
    "saturday": { "isOpen": true, "open": "10:00", "close": "23:00" },
    "sunday": { "isOpen": false }
  },
  "priceRange": "$$",
  "attributes": {
    "hasWifi": true,
    "hasParking": true,
    "wheelchairAccessible": true,
    "outdoorSeating": true,
    "acceptsCreditCards": true
  },
  "media": {
    "logo": "https://pub-xxx.r2.dev/logo.jpg",
    "cover": "https://pub-xxx.r2.dev/cover.jpg",
    "gallery": [
      "https://pub-xxx.r2.dev/photo1.jpg",
      "https://pub-xxx.r2.dev/photo2.jpg"
    ]
  },
  "socials": {
    "instagram": "https://instagram.com/restaurant",
    "facebook": "https://facebook.com/restaurant"
  }
}
```

**Required Fields:**
- `name` (string)

**Optional Fields:**
- `description`, `category`, `contacts`, `address`, `location`, `hours`, `priceRange`, `attributes`, `media`, `socials`

**Response (201 Created):**
```json
{
  "restaurant": {
    "id": "cm456xyz",
    "slug": "my-restaurant",
    "name": "My Restaurant",
    "description": "A wonderful place to eat",
    "category": "Japanese",
    "contacts": { /* ... */ },
    "address": { /* ... */ },
    "location": { /* ... */ },
    "hours": { /* ... */ },
    "priceRange": "$$",
    "attributes": { /* ... */ },
    "media": { /* ... */ },
    "socials": { /* ... */ },
    "isPublished": false,
    "userId": "cm123abc",
    "createdAt": "2025-11-26T10:00:00.000Z",
    "updatedAt": "2025-11-26T10:00:00.000Z"
  }
}
```

**Price Range Values:**
- `$` - Cheap
- `$$` - Moderate
- `$$$` - Expensive
- `$$$$` - Very Expensive

---

### List Restaurants
**GET** `/restaurants`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "restaurants": [
    {
      "id": "cm456xyz",
      "slug": "my-restaurant",
      "name": "My Restaurant",
      "description": "A wonderful place to eat",
      "category": "Japanese",
      "contacts": { /* ... */ },
      "address": { /* ... */ },
      "location": null,
      "hours": { /* ... */ },
      "priceRange": "$$",
      "attributes": { /* ... */ },
      "media": { /* ... */ },
      "socials": { /* ... */ },
      "isPublished": false,
      "userId": "cm123abc",
      "createdAt": "2025-11-26T10:00:00.000Z",
      "updatedAt": "2025-11-26T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Restaurant
**GET** `/restaurants/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "restaurant": {
    "id": "cm456xyz",
    "slug": "my-restaurant",
    "name": "My Restaurant",
    /* full restaurant object */
  }
}
```

**Error (404 Not Found):**
```json
{
  "error": {
    "message": "Restaurant not found"
  }
}
```

---

### Update Restaurant
**PATCH** `/restaurants/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** When the `name` field is updated, the `slug` will be automatically regenerated based on the new name to ensure the public URL reflects the current restaurant name.

**Request Body (partial update):**
```json
{
  "name": "Updated Restaurant Name",
  "description": "Updated description",
  "priceRange": "$$$$"
}
```

**Response (200 OK):**
```json
{
  "restaurant": {
    "id": "cm456xyz",
    "slug": "updated-restaurant-name",  // Auto-regenerated from new name
    "name": "Updated Restaurant Name",
    "description": "Updated description",
    "priceRange": "$$$$",
    /* ... other fields */
  }
}
```

**Example:**
```bash
# Update restaurant name - slug will auto-regenerate
curl -X PATCH http://localhost:4000/restaurants/cm456xyz \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Sushi Bar Tokyo"}'

# Response will include: "slug": "sushi-bar-tokyo"
```

---

### Manually Regenerate Slug
**PATCH** `/restaurants/:id/regenerate-slug`

**Headers:**
```
Authorization: Bearer <token>
```

**Description:** Manually regenerate the slug from the current restaurant name. Useful for fixing existing restaurants or handling edge cases.

**Response (200 OK):**
```json
{
  "restaurant": {
    "id": "cm456xyz",
    "slug": "new-generated-slug",
    "name": "Current Restaurant Name",
    /* ... full restaurant object */
  }
}
```

---

### Delete Restaurant
**DELETE** `/restaurants/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Restaurant deleted"
}
```

---

### Publish Restaurant
**PATCH** `/restaurants/:id/publish`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "restaurant": {
    "id": "cm456xyz",
    "isPublished": true,
    /* ... */
  }
}
```

---

### Unpublish Restaurant
**PATCH** `/restaurants/:id/unpublish`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "restaurant": {
    "id": "cm456xyz",
    "isPublished": false,
    /* ... */
  }
}
```

---

## 📤 Upload

### Upload Single Image
**POST** `/api/upload/image`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `image`: File (max 10MB, image/* only)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://pub-ab86c5cad25e43b6b68dae346be5e7d6.r2.dev/uuid.jpg"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "error": "No file uploaded"
}
```

---

### Upload Multiple Images
**POST** `/api/upload/images`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `images[]`: Files (max 10 files, each max 10MB, image/* only)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "urls": [
      "https://pub-xxx.r2.dev/uuid1.jpg",
      "https://pub-xxx.r2.dev/uuid2.jpg",
      "https://pub-xxx.r2.dev/uuid3.jpg"
    ]
  }
}
```

**Supported Formats:**
- JPG/JPEG
- PNG
- WebP

---

### Delete Image
**DELETE** `/api/upload/:filename`

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```
DELETE /api/upload/uuid.jpg
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## 🌐 Public API

### Get Restaurant by Slug
**GET** `/api/public/restaurants/:slug`

**No authentication required**

**Example:**
```
GET /api/public/restaurants/my-restaurant
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "id": "cm456xyz",
      "slug": "my-restaurant",
      "name": "My Restaurant",
      "description": "A wonderful place to eat",
      "category": "Japanese",
      "contacts": { /* ... */ },
      "address": { /* ... */ },
      "location": { /* ... */ },
      "hours": { /* ... */ },
      "priceRange": "$$",
      "attributes": { /* ... */ },
      "media": { /* ... */ },
      "socials": { /* ... */ },
      "isPublished": true,
      "userId": "cm123abc",
      "createdAt": "2025-11-26T10:00:00.000Z",
      "updatedAt": "2025-11-26T10:00:00.000Z"
    }
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Restaurant not found"
}
```

**Note:** Only returns restaurants where `isPublished: true`

---

## 📊 Data Schemas

### User Object
```typescript
{
  id: string;              // Unique ID
  uniqueID: string;        // Display ID (e.g., "#1001")
  email: string;           // Unique email
  username: string;        // Unique username
  createdAt: string;       // ISO datetime
  updatedAt: string;       // ISO datetime
}
```

### Restaurant Object
```typescript
{
  id: string;
  slug: string;                    // URL-friendly slug
  name: string;
  description?: string;
  category?: string;
  contacts?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  location?: {
    lat: number;
    lng: number;
  } | null;
  hours?: Record<DayOfWeek, HourEntry>;  // See Hours Schema below
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  attributes?: Record<string, boolean | string>;
  media?: {
    logo?: string;
    cover?: string;
    gallery?: string[];
  };
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  isPublished: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Hours Schema
```typescript
type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

type HourEntry = 
  | { isOpen: false }
  | { isOpen: true; open: string; close: string };  // Time format: "HH:MM"

// Example:
{
  "monday": { "isOpen": true, "open": "09:00", "close": "22:00" },
  "sunday": { "isOpen": false }
}
```

---

## ⚠️ Error Handling

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Not allowed to access this resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error | Server error |

### Error Response Format
```json
{
  "error": {
    "message": "Descriptive error message"
  }
}
```

Or for upload endpoints:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🔧 Frontend Integration Examples

### Setting up Axios Client
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Usage Examples

**Login:**
```typescript
const { data } = await api.post('/auth/login', {
  email: 'user@example.com',
  password: '123456'
});
localStorage.setItem('token', data.token);
```

**Get Restaurants:**
```typescript
const { data } = await api.get('/restaurants');
console.log(data.restaurants);
```

**Upload Image:**
```typescript
const formData = new FormData();
formData.append('image', file);

const { data } = await api.post('/api/upload/image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
console.log(data.data.url); // Use this URL in restaurant.media
```

**Create Restaurant:**
```typescript
const { data } = await api.post('/restaurants', {
  name: 'My Restaurant',
  description: 'Great food',
  priceRange: '$$',
  // ... other fields
});
```

---

## 🔍 Testing Endpoints

**Swagger UI:** http://localhost:4000/api-docs

Use Swagger UI for interactive API testing with built-in request/response examples.

---

## 📝 Notes

- All datetime fields are in ISO 8601 format
- Passwords must be exactly 6 digits
- Usernames and emails are unique (case-insensitive)
- Slugs are auto-generated from restaurant names
- The `isPublished` field controls public visibility
- File uploads use Cloudflare R2 for storage
- Maximum file size: 10MB per image
- Maximum bulk upload: 10 images at once

---

**Last Updated:** 2025-11-26
