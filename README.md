# 📊 Average Calculator HTTP Microservice

This microservice exposes an API endpoint to fetch and compute the average of numeric streams such as prime, Fibonacci, even, and random numbers from a third-party server. It uses a sliding window to maintain the most recent unique numbers and calculates the average accordingly.

---

## 🚀 Features

- Fetches numbers from an external evaluation service
- Supports number types: **Prime (p)**, **Fibonacci (f)**, **Even (e)**, and **Random (r)**
- Uses **OAuth2 token-based authentication**
- Maintains a **fixed-size sliding window (default: 10)** of unique numbers
- Ignores duplicate numbers and fetch timeouts exceeding **500ms**
- Returns both previous and current window states with average

---

## 📦 Tech Stack

- **Node.js**
- **Express.js**
- **Axios** (for HTTP requests)

---

## 📂 Project Structure

```
.
├── index.js         # Main application file
├── package.json     # Node.js metadata and dependencies
└── README.md        # Project documentation
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/average-calculator-service.git
cd average-calculator-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Server

```bash
node index.js
```

The server will start at:  
📍 `http://localhost:9876`

---

## 🔐 Authentication

You must obtain an **access token** from the test server using your registered company credentials. The service caches the token and automatically refreshes it before expiry.

### ⚠️ Registration (One-time Only)

Use the `/register` endpoint on the test server to register your details. Save the `clientID` and `clientSecret` provided.

---

## 📘 API Usage

### Endpoint

```http
GET /numbers/:numberid
```

### `:numberid` can be:

| ID  | Type         |
|-----|--------------|
| `p` | Prime        |
| `f` | Fibonacci    |
| `e` | Even         |
| `r` | Random       |

### Sample Request

```http
GET http://localhost:9876/numbers/e
```

### Sample Response

```json
{
  "windowPrevState": [2, 4, 6, 8],
  "windowCurrState": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  "numbers": [10, 12, 14, 16, 18, 20],
  "avg": 11.0
}
```

---

## 🛑 Constraints

- Max 500ms for fetching numbers from third-party API
- Duplicate numbers are ignored
- Window holds up to 10 most recent **unique** numbers
- Older numbers are removed as the window overflows

```

Examples:
- `/primes`
- `/fibo`
- `/even`
- `/rand`

---
