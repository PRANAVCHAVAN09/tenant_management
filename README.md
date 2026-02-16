🏢 MERN Tenant Management System

A full-stack Tenant Management Admin Panel built using the MERN stack.
The application allows administrators to manage Users, Roles, Sites, and Permissions with secure authentication and role-based access control (RBAC).

🌐 Live Application

Frontend: https://tenant-management-liart.vercel.app

Backend API: https://tenant-management-jsps.onrender.com

🔐 Test Login Credentials
Email: pranav324@gmail.com
Password: Pranav123

🚀 Features
Authentication

Admin login using JWT authentication
Access Token + Refresh Token flow
Automatic token refresh on expiry
Secure logout

Role Based Access Control (RBAC)

Roles with dynamic permissions
Permission management via UI (add/remove capsules)
Prevent role deletion if assigned to users
If role becomes inactive → all assigned users automatically inactive
Users cannot be activated if their role is inactive

Users Management

Create users
Assign role & site
Search users
Pagination
Activate / Deactivate users
Status indicator

Sites Management

Create site with location & timezone
Timezone dropdown via API
Infinite scroll site list
Prevent site deletion if users assigned

Roles & Permissions

Create role
Activate / Deactivate role
Delete role (protected)
Permission capsules UI
Add/remove permissions dynamically

Dashboard

Total users
Active users
Total roles
Total sites

🧱 Tech Stack
Frontend

React (Vite)

Tailwind CSS


Backend

Node.js

Express.js

MongoDB Atlas



Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas


🔄 Authentication Flow

Admin logs in

Server creates:
Access Token (15 minutes)
Refresh Token (7 days)


When access token expires:

Axios interceptor calls /auth/refresh
New access token issued automatically
User stays logged in securely

📁 Project Structure
tenant_management/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── api/
│   └── components/

🛠️ Local Setup Instructions
1️⃣ Clone Repository
git clone <your-repo-url>
cd tenant_management

2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🔒 Security Implemented

Password hashing (bcrypt)
JWT verification middleware
HTTP-Only cookies
Protected routes
CORS restricted origin
Refresh token validation in DB

📌 Important Business Rules Implemented

Cannot delete role if users assigned

Cannot delete site if users assigned

Role inactive → users inactive

Cannot activate user if role inactive

Token auto refresh system

👨‍💻 Author

Pranav Chavan
MERN Stack Developer
