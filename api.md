# API Endpoints

This document outlines all the API endpoints for the application.

## Authentication Routes

### 1. Register a new user
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Registers a new user in the system.
- **Body:**
  - `fullName` (String, required): The user's full name.
  - `email` (String, required): The user's email address.
  - `password` (String, required): The user's password. Must be at least 6 characters.
- **Validation:**
  - `fullName` must not be empty and trimmed.
  - `email` must be a valid email address.
  - `password` must be at least 6 characters long.
- **Response:**
  - `message` (String): Success message.
  - `accessToken` (String): The access token.
  - `refreshToken` (String): The refresh token.
  - `user` (Object): The registered user's profile.
- **Error Responses:**
  - `400 Bad Request`: Validation errors or user already exists.
  - `500 Internal Server Error`: Server error.

### 2. Login a user
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns tokens.
- **Body:**
  - `email` (String, required): The user's email.
  - `password` (String, required): The user's password.
- **Validation:**
  - `email` must be a valid email address.
  - `password` must be provided.
- **Response:**
  - `message` (String): Success message.
  - `accessToken` (String): The access token.
  - `refreshToken` (String): The refresh token.
  - `user` (Object): The logged‑in user's profile.
- **Error Responses:**
  - `400 Bad Request`: Invalid credentials.
  - `500 Internal Server Error`: Server error.

### 3. Refresh token
- **URL:** `/api/auth/refresh-token`
- **Method:** `POST`
- **Description:** Issues a new access token using a valid refresh token.
- **Body:**
  - `refreshToken` (String, required).
- **Response:**
  - `accessToken` (String).
- **Error Responses:**
  - `401 Unauthorized`: Refresh token not found.
  - `403 Forbidden`: Invalid refresh token.
  - `500 Internal Server Error`: Server error.

### 4. Logout
- **URL:** `/api/auth/logout`
- **Method:** `POST`
- **Description:** Logs the user out by invalidating the refresh token.
- **Body:**
  - `refreshToken` (String, optional).
- **Response:**
  - `204 No Content` on success.

### 5. Get current user
- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Description:** Returns the authenticated user's profile.
- **Response:**
  - `user` (Object).

## Listings Routes

### 1. Get all listings
- **URL:** `/api/listings`
- **Method:** `GET`
- **Description:** Retrieves a list of all listings.

### 2. Create a listing
- **URL:** `/api/listings`
- **Method:** `POST`
- **Description:** Creates a new listing.
- **Body:**
  - `title` (String, required)
  - `author` (String, required)
  - `category` (String, required)
  - `condition` (String, required, enum: New, Like New, Good, Fair, Acceptable)
  - `price` (Number, required, min: 0)
  - `description` (String, optional)
  - `imageUrls` (Array of Strings, optional)
- **Validation:** All required fields must be present and follow the constraints above.

### 3. Get featured listings
- **URL:** `/api/listings/featured`
- **Method:** `GET`

### 4. Get categories
- **URL:** `/api/listings/categories`
- **Method:** `GET`

### 5. Get my listings
- **URL:** `/api/listings/my-listings`
- **Method:** `GET`
- **Access:** Private (authenticated user).

### 6. Get a listing by ID
- **URL:** `/api/listings/:id`
- **Method:** `GET`

### 7. Update a listing
- **URL:** `/api/listings/:id`
- **Method:** `PUT`
- **Body:** Same fields as creation (all optional, only provided fields are updated).

### 8. Delete a listing
- **URL:** `/api/listings/:id`
- **Method:** `DELETE`

## Account Routes

### 1. Get profile
- **URL:** `/api/account/profile`
- **Method:** `GET`

### 2. Update profile
- **URL:** `/api/account/profile`
- **Method:** `PUT`
- **Body:** `fullName`, `bio`, `avatarUrl` (all optional).

### 3. Update email
- **URL:** `/api/account/email`
- **Method:** `PUT`
- **Body:** `email` (required, valid email).

### 4. Update password
- **URL:** `/api/account/password`
- **Method:** `PUT`
- **Body:** `oldPassword`, `newPassword` (both required).

### 5. Get user listings
- **URL:** `/api/account/listings`
- **Method:** `GET`

### 6. Get incoming orders
- **URL:** `/api/account/orders/incoming`
- **Method:** `GET`

### 7. Get purchase history
- **URL:** `/api/account/orders/purchases`
- **Method:** `GET`

### 8. Get order details
- **URL:** `/api/account/orders/:id`
- **Method:** `GET`

## Cart Routes

### 1. Get cart
- **URL:** `/api/cart`
- **Method:** `GET`

### 2. Add to cart
- **URL:** `/api/cart`
- **Method:** `POST`
- **Body:** `listingId` (MongoID), `quantity` (positive integer).

### 3. Clear cart
- **URL:** `/api/cart`
- **Method:** `DELETE`

### 4. Update cart item
- **URL:** `/api/cart/:itemId`
- **Method:** `PUT`
- **Body:** `quantity` (non‑negative integer).

### 5. Remove cart item
- **URL:** `/api/cart/:itemId`
- **Method:** `DELETE`

## Orders Routes

### 1. Create order
- **URL:** `/api/orders`
- **Method:** `POST`
- **Body:** `shippingAddress` (object with `street`, `city`, `state`, `country`).

### 2. Get my orders
- **URL:** `/api/orders/my-orders`
- **Method:** `GET`

### 3. Get my sales
- **URL:** `/api/orders/my-sales`
- **Method:** `GET`

### 4. Get order by ID
- **URL:** `/api/orders/:id`
- **Method:** `GET`

### 5. Update order status
- **URL:** `/api/orders/:id/status`
- **Method:** `PUT`
- **Body:** `status` (enum: Pending, Processing, Shipped, Delivered, Cancelled).

## Admin Routes

### 1. Dashboard stats
- **URL:** `/api/admin/dashboard`
- **Method:** `GET`

### 2. Manage users
- **URL:** `/api/admin/users`
- **Method:** `GET` (list), `POST` (add new user).
- **Add User Body:** `fullName`, `email`, `password`, `role` (optional).
- **URL:** `/api/admin/users/:id`
- **Method:** `GET`, `PUT` (update status), `DELETE` (remove).
- **URL:** `/api/admin/users/:id/role`
- **Method:** `PUT`
- **URL:** `/api/admin/users/:id/reset-password`
- **Method:** `POST`

### 3. Manage listings
- **URL:** `/api/admin/listings`
- **Method:** `GET`
- **URL:** `/api/admin/listings/:id`
- **Method:** `GET`, `PUT`, `DELETE`

### 4. Manage orders
- **URL:** `/api/admin/orders`
- **Method:** `GET`
- **URL:** `/api/admin/orders/:id`
- **Method:** `GET`, `PUT` (update status)

## Upload Routes

### 1. Upload image
- **URL:** `/api/upload/image`
- **Method:** `POST`
- **Description:** Upload an image file.
- **Validation:** File must be an image (`image/*`) and not exceed 5 MB.
