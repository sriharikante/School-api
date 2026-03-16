# School API

This is a simple API built with Node.js and Express that lets you add schools to a database and find the nearest schools using coordinates.

## Source Code and Live API links 

**1. Source Code Repository**
- https://github.com/sriharikante/School-api

**2. Live API Endpoints (Hosted on Render)**
- **Base URL:** `https://school-api-gu2s.onrender.com`
- **Add a School (POST):** `https://school-api-gu2s.onrender.com/addSchool`
- **Find Nearest Schools (GET):** `https://school-api-gu2s.onrender.com/listSchools?latitude=17.4350&longitude=78.3850`

**3.Postman Collection**
 https://kantesrihari1-8078502.postman.co/workspace/srihari-k's-Workspace~a4d13b14-93fe-41ca-8d70-b3f932d1b9a3/collection/52740553-f9f67d7d-e8ab-4d34-84ce-e144663f78e1?action=share&source=copy-link&creator=52740553

---

## 🛠️ Built With
* **Node.js & Express.js** (Backend server)
* **TiDB Cloud** (Free serverless MySQL database)
* **Render** (Live hosting)

## 🧪 How to Test
1. Import the provided Postman collection.
2. The URLs in the collection are already pointed to the live Render server.
3. Open the **Add a School** POST request and click Send to add data.
4. Open the **Find Schools Near Me** GET request and click Send to see the database calculate and return the closest schools.
*(Note: Because it is hosted on a free Render tier, the server might take about 50 seconds to wake up on the very first request).*