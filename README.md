# 🎓 Campus Management System

A full-stack microservices-based Campus Management System built using React and Spring Boot, featuring secure authentication, API Gateway routing, and role-based access control.

---

## 🚀 Tech Stack

Frontend:
- React (Vite)
- Axios
- React Router

Backend:
- Spring Boot (Microservices)
- Spring Cloud Gateway
- REST APIs

Security:
- JWT Authentication
- Role-Based Access Control (RBAC)

Database:
- (Add your DB here: MySQL / MongoDB)

---

## ✨ Features

- Secure login and registration using JWT
- Faculty can create and manage student records
- Faculty can update only the students they created
- Unauthorized access is restricted
- API Gateway for centralized routing
- Microservices-based scalable architecture

---

## 🧠 System Architecture

Frontend (React - 5173)
        ↓
API Gateway (8080)
        ↓
-------------------------------------
| Auth Service     (8081)          |
| Student Service  (8082)          |
| Event Service    (8083)          |
| Faculty Service  (8084)          |
-------------------------------------

---

## 🔧 Setup Instructions

### 1. Clone the Repository

git clone https://github.com/your-username/campus-management-system.git
cd campus-management-system

---

### 2. Backend Setup

Start all services in order:
- Auth Service
- Student Service
- Event Service
- Faculty Service
- API Gateway

---

### 3. Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173

---

## 🔐 API Usage

All APIs go through API Gateway:

http://localhost:8080/api/...

Example endpoints:
- POST /api/auth/login
- POST /api/auth/register
- GET /api/students
- POST /api/students
- PUT /api/students/{id}

---

## 🛡️ Security

- JWT-based authentication
- Token required for protected routes
- Role-based authorization
- Faculty can only edit students they created

---

## 🧪 Debugging Tips

- Use Browser DevTools → Network tab
- 401 → Token issue
- 404 → Route mismatch
- CORS → Backend config issue

---

## 📌 Future Enhancements

- Dashboard analytics
- File upload support
- Deployment (AWS / Render)
- UI improvements

---

## 👨‍💻 Author

Sivasarathy A
Sudharsan B
Suganth T
Sujay M S

---

## ⭐ Acknowledgement

Built as part of a full-stack microservices project focusing on real-world architecture and secure design.
