# API Documentation

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "interviewer"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "interviewer"
  }
}
```

**Status Codes:**
- `201 Created` - User registered successfully
- `400 Bad Request` - Missing fields or user already exists
- `500 Internal Server Error` - Server error

---

### Login User
Authenticate user and get JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "interviewer"
  }
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Missing credentials
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

### Get Current User
Get authenticated user information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "interviewer"
}
```

**Status Codes:**
- `200 OK` - User data retrieved
- `401 Unauthorized` - Invalid/missing token
- `500 Internal Server Error` - Server error

---

## Interview Endpoints

### Create Interview Room
Create a new interview room (interviewer only).

**Endpoint:** `POST /api/interviews/create-room`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "roomId": "abc123def456",
  "interviewId": "507f1f77bcf86cd799439011"
}
```

**Status Codes:**
- `201 Created` - Room created
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### Get All Interviews
Get all interviews for authenticated user.

**Endpoint:** `GET /api/interviews`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): `active`, `completed`, `cancelled`
- `limit` (optional): Number of records to return (default: 50)
- `skip` (optional): Pagination offset

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "roomId": "abc123def456",
    "interviewer": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "candidate": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "status": "completed",
    "rating": 8,
    "feedback": "Great problem-solving skills",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:45:00Z",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:45:30Z"
  }
]
```

**Status Codes:**
- `200 OK` - Interviews retrieved
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### Get Interview by Room ID
Get specific interview details.

**Endpoint:** `GET /api/interviews/room/:roomId`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `roomId` (required): Interview room ID

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "roomId": "abc123def456",
  "interviewer": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "candidate": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "code": "function solution() { ... }",
  "language": "javascript",
  "status": "active",
  "startTime": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:05:00Z"
}
```

**Status Codes:**
- `200 OK` - Interview retrieved
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Interview not found
- `500 Internal Server Error` - Server error

---

### Update Code
Save code changes during interview.

**Endpoint:** `PUT /api/interviews/:roomId/code`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `roomId` (required): Interview room ID

**Request Body:**
```json
{
  "code": "function solution() { return 'Hello'; }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "roomId": "abc123def456",
  "code": "function solution() { return 'Hello'; }",
  "language": "javascript",
  "status": "active",
  "updatedAt": "2024-01-15T10:05:30Z"
}
```

**Status Codes:**
- `200 OK` - Code updated
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Interview not found
- `500 Internal Server Error` - Server error

---

### Rate Interview
Submit rating and feedback after interview (interviewer only).

**Endpoint:** `POST /api/interviews/:roomId/rate`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `roomId` (required): Interview room ID

**Request Body:**
```json
{
  "rating": 8,
  "feedback": "Excellent problem-solving approach. Strong communication skills."
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "roomId": "abc123def456",
  "interviewer": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "candidate": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "status": "completed",
  "rating": 8,
  "feedback": "Excellent problem-solving approach. Strong communication skills.",
  "endTime": "2024-01-15T10:45:00Z",
  "updatedAt": "2024-01-15T10:45:30Z"
}
```

**Status Codes:**
- `200 OK` - Rating submitted
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Interview not found
- `500 Internal Server Error` - Server error

---

## Error Response Format

All endpoints return errors in the following format:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing/invalid authentication
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- Limit login attempts to 5 per minute
- Limit API calls to 100 per minute per authenticated user
- Implement CAPTCHA for registration

---

## Pagination

For endpoints returning lists, use query parameters:
- `limit`: Number of records (default: 50, max: 100)
- `skip`: Number to skip from start (default: 0)

Example:
```
GET /api/interviews?limit=20&skip=40
```

---

## Timestamps

All timestamps are in ISO 8601 format (UTC):
- `createdAt`: When the record was created
- `updatedAt`: When the record was last modified
- `startTime`: When the interview started
- `endTime`: When the interview ended

---

## Field Validations

### User Registration
- `name`: 2-100 characters
- `email`: Valid email format, unique
- `password`: Minimum 6 characters
- `role`: Must be 'interviewer' or 'candidate'

### Interview Rating
- `rating`: 1-10 (integer)
- `feedback`: 0-1000 characters (optional)

---

**Last Updated:** January 2024
