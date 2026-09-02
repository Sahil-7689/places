# 🗺️ Tourist Places Information REST API

A production-quality REST API built with **Node.js, Express.js, and TypeScript** that returns the top 5 tourist places near user coordinates using the **Geoapify Places API**.

---

## 🏛️ Architecture & Separation of Concerns

```text
React Native App
       ↓
GET /api/v1/places/nearby?latitude=26.9124&longitude=75.7873&radius=5000
       ↓
Validation Middleware (src/middleware/validation.middleware.ts)
       ↓
Places Controller (src/controllers/places.controller.ts)
       ↓
Places Service (src/services/places.service.ts)
       ↓
Geoapify Places API
       ↓
Haversine Distance (km) + Filter + Sort (Top 5)
       ↓
Clean JSON Response
       ↓
React Native App
```

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   └── places.controller.ts       # Request validation handling & response dispatch
│   ├── routes/
│   │   └── places.routes.ts           # Route definition (/api/v1/places/nearby)
│   ├── services/
│   │   └── places.service.ts          # Geoapify API integration & Haversine distance
│   ├── types/
│   │   └── places.types.ts            # Type definitions (TouristPlace, Query, ApiResponse)
│   ├── middleware/
│   │   ├── error.middleware.ts        # Error masking & 404 handler
│   │   └── validation.middleware.ts   # Zod coordinate & radius validation
│   ├── config/
│   │   └── env.ts                     # Type-safe environment variable management
│   ├── app.ts                         # Express app (Helmet, CORS, Rate Limit, Healthcheck)
│   └── server.ts                      # Server entry point (0.0.0.0 binding)
├── .env / .env.example                # Environment variables
├── .gitignore                         # Excluded files
├── package.json                       # Dependencies & build scripts
├── tsconfig.json                      # Strict TypeScript compiler options
└── README.md                          # Documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
GEOAPIFY_API_KEY=your_geoapify_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build & Start for Production
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### 1. Health Check
```http
GET /health
```
#### Response (200 OK)
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

### 2. Get Nearby Tourist Places
```http
GET /api/v1/places/nearby?latitude=26.9124&longitude=75.7873&radius=5000
```

#### Query Parameters
| Parameter | Type | Required | Description / Range | Default |
|---|---|---|---|---|
| `latitude` | `number` | **Yes** | Latitude between `-90` and `90` | - |
| `longitude` | `number` | **Yes** | Longitude between `-180` and `180` | - |
| `radius` | `number` | No | Search radius in meters (positive number) | `5000` |

#### Successful Response (200 OK)
```json
{
  "success": true,
  "data": {
    "places": [
      {
        "id": "51945c0f7052f3524059...",
        "name": "Amrapali Museum",
        "address": "Ashok Marg, Bani Park, Jaipur - 302006, Rajasthan, India",
        "latitude": 26.9150126,
        "longitude": 75.8019066,
        "category": "Museum",
        "distance": 1.5
      },
      {
        "id": "51ce9172384ef3524059...",
        "name": "Shaheed Smarak",
        "address": "Mirza Ismail Road, Bani Park, Jaipur - 302006, Rajasthan, India",
        "latitude": 26.9173959,
        "longitude": 75.8017776,
        "category": "Landmark",
        "distance": 1.5
      }
    ]
  }
}
```

---

## 🛡️ Error Scenarios & Status Codes

| Case | Status | Response JSON |
|---|---|---|
| **Invalid Coordinates** | `400 Bad Request` | `{"success": false, "message": "Invalid location parameters"}` |
| **No Places Found** | `200 OK` | `{"success": true, "data": {"places": []}, "message": "No tourist places found nearby"}` |
| **Geoapify API Failure** | `502 Bad Gateway` | `{"success": false, "message": "Unable to fetch nearby tourist places"}` |
| **Rate Limit Exceeded** | `429 Too Many Requests` | `{"success": false, "message": "Too many requests from this IP..."}` |
| **Internal Server Error** | `500 Internal Error` | `{"success": false, "message": "Something went wrong"}` |

---

## 🔒 Security Best Practices Implemented

- **CORS**: Configured for cross-origin mobile client requests.
- **Helmet**: Secures HTTP response headers.
- **Rate Limiting**: Protects against DoS brute-force requests.
- **Input Validation**: Schema validation using `zod` for coordinate boundaries.
- **Error Masking**: Internal errors and API keys are never exposed to clients.
- **Pure Data**: No unnecessary image processing overhead on backend.
