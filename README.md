# **Event Logging System**

A scalable backend system for decentralized, tamper-proof event logging with a React-based frontend for log visualization. Built to handle distributed applications, this project demonstrates event logging, querying, and visualization capabilities.

---

## **Features**

### Backend
- **Event Logging API**: 
  - Accepts logs with metadata: Event Type, Timestamp, Source Application ID, and Data Payload.
  - Ensures tamper-proof logging using cryptographic hashing.
- **Search and Query**:
  - Query logs by timestamp, event type, and source application ID.
  - Supports pagination for large datasets.
- **Error Handling**:
  - Validates incoming requests and handles missing or invalid fields gracefully.

### Frontend
- Built with React for a modern and responsive user interface.
- Displays logged events with filtering and visualization using `chart.js`.
- Communicates with the backend API to fetch and display logs.

### Dockerized Deployment
- Both the backend and frontend are containerized for easy deployment.
- Docker Compose orchestrates the containers for seamless integration.

---

## **Technology Stack**
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Chart.js
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

---

## **Project Structure**





```
project/
├── backend/
│   ├── app.js                # Backend server entry point
│   ├── Dockerfile            # Dockerfile for backend
│   ├── docker-compose.yml    # Docker Compose file
│   ├── package.json          # Backend dependencies
│   └── simulateLogs.js       # Script for simulating log events
├── frontend/
│   ├── src/
│   │   ├── index.js          # React app entry point
│   │   └── index.html        # React app template
│   ├── Dockerfile            # Dockerfile for frontend
│   ├── package.json          # Frontend dependencies
│   └── webpack.config.js     # Webpack configuration for React
└── README.md                 # Documentation
```


---

## **Setup and Usage**

### Prerequisites
- Docker and Docker Compose installed on your system.
- MongoDB (containerized or external).

---

### Steps to Run the Application

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd project


Navigate to the Backend Folder:

bash
Copy code
cd backend
Start the Application with Docker Compose: Run this from the backend folder to start both backend and frontend:

bash
Copy code
docker-compose up --build
Access the Application:

Backend API: http://localhost:3000
Frontend: http://localhost:3001
API Endpoints
1. Log an Event
POST /api/logs
Request Body:
json
Copy code
{
  "event_type": "userLogin",
  "timestamp": "2024-11-21T12:00:00Z",
  "source_app_id": "app123",
  "data_payload": {
    "user": "johndoe",
    "action": "login"
  }
}
Response:
json
Copy code
{
  "message": "Log created successfully",
  "log": {
    "_id": "xyz123",
    "event_type": "userLogin",
    "timestamp": "2024-11-21T12:00:00Z",
    "source_app_id": "app123",
    "data_payload": { "user": "johndoe", "action": "login" },
    "previous_hash": "abc456",
    "hash": "hashvalue"
  }
}
2. Fetch Logs
GET /api/logs
Query Parameters:
timestamp, event_type, source_app_id, page, limit
Response:
json
Copy code
{
  "logs": [
    {
      "_id": "xyz123",
      "event_type": "userLogin",
      "timestamp": "2024-11-21T12:00:00Z",
      "source_app_id": "app123",
      "data_payload": { "user": "johndoe", "action": "login" },
      "previous_hash": "abc456",
      "hash": "hashvalue"
    }
  ],
  "page": 1,
  "totalPages": 10
}