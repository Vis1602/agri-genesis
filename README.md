# AgriGenesis - Agricultural Expert & AI Consultation Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Socket.IO Events](#socketio-events)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌾 Overview

**AgriGenesis** is a full-stack web application that connects farmers with agricultural experts and provides AI-powered farming solutions. The platform enables:
- **Real-time Chat**: Direct messaging between farmers and experts
- **AI Assistant**: Google Gemini-powered farming consultation
- **Appointment Scheduling**: Book consultations with experts

The application is built with a modern tech stack featuring Express.js backend, React frontend, MongoDB database, and Socket.IO for real-time communication.

---

## ✨ Features

- 🔐 **User Authentication**: Secure registration and login
- 🤖 **AI Assistant Chat**: Get instant agricultural advice via Google Gemini
- 👨‍⚕️ **Connect with Experts**: Browse available agricultural experts
- 💬 **Real-time Chat**: Direct communication with experts using Socket.IO
- 📅 **Schedule Appointments**: Book consultation slots with experts
- 📊 **View My Appointments**: Track all scheduled consultations
- 📋 **Expert Dashboard**: Manage consultations and appointments
- 📅 **Appointment Management**: View and manage scheduled consultations


### General Features
- 🎨 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🔔 **Toast Notifications**: Real-time user feedback
- 🌐 **CORS Support**: Cross-origin requests enabled
- 📱 **Mobile-Friendly UI**: Tailwind CSS for modern styling

---

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client 4.8.1** - Real-time communication
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **FontAwesome 6.4.0** - Icon library
- **Lucide React** - Additional UI icons

### Backend
- **Node.js & Express 5.1.0** - REST API server
- **MongoDB & Mongoose 8.14.2** - NoSQL database
- **Socket.IO 4.7.5** - Real-time bidirectional communication
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 3.0.2** - Password hashing
- **Google Generative AI SDK 0.24.1** - AI integration (Gemini)
- **CORS 2.8.5** - Cross-origin requests
- **Dotenv 16.5.0** - Environment variables

---

## 📁 Project Structure

```
agrigenesis-full-stack/
├── agrigenesis-backend/           # Node.js/Express server
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── chatController.js
│   │   ├── geminiController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── userModel.js          # User schema (Farmer/Expert)
│   │   ├── appointmentModel.js   # Appointment scheduling
│   │   ├── chatModel.js          # Chat messages
│   │   └── reviewModel.js        # Expert reviews
│   ├── routes/
│   │   ├── userRoutes.js         # Auth & user management
│   │   ├── appointmentRoutes.js  # Appointment CRUD
│   │   ├── chatRoutes.js         # Chat history
│   │   ├── geminiRoutes.js       # AI routes
│   │   └── reviewRoutes.js       # Review management
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express app & Socket.IO setup
│   └── package.json
│
└── Agrigenesis-frontend/          # React application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── Pages/
    │   │   ├── Home.js           # Landing page
    │   │   ├── LoginPage.js      # User authentication
    │   │   ├── RegisterPage.js   # User registration
    │   │   ├── Chat.js           # Real-time chat & AI chat
    │   │   ├── Appointment.js    # Book appointments
    │   │   ├── MyAppointments.js # View scheduled appointments
    │   │   └── ExpertDashboard.js# Expert management
    │   ├── Components/
    │   │   ├── Navbar.js         # Navigation bar
    │   │   ├── PrivateRoute.js   # Protected routes
    │   │   ├── BookAppointment.js
    │   │   ├── Reviews.js        # Review component
    │   │   └── ...
    │   ├── services/
    │   │   ├── api.js            # Axios configuration & API calls
    │   │   ├── auth.js           # Authentication service
    │   │   ├── geminiService.js  # AI integration
    │   │   └── appointmentService.js
    │   ├── Styles/               # CSS files
    │   ├── App.js                # Main routing
    │   ├── index.js              # React entry point
    │   └── App.css
    ├── .env                      # Frontend environment variables
    ├── package.json
    └── tailwind.config.js        # Tailwind CSS configuration
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v16+ and npm v8+
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/Vis1602/agri-genesis.git
cd agri-genesis
```

### Step 2: Backend Setup
```bash
cd agrigenesis-backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
echo "Creating .env file..."
```

### Step 3: Frontend Setup
```bash
cd ../Agrigenesis-frontend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
echo "Creating .env file..."
```

---

## 🔐 Environment Variables

### Backend `.env` (agrigenesis-backend/.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrigenesis?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here_make_it_strong_and_random

# Google Gemini API
GEMINI_API_KEY=your_google_gemini_api_key_here

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

### Frontend `.env` (Agrigenesis-frontend/.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# Google Gemini API (for frontend AI calls)
REACT_APP_GEMINI_API_KEY=your_google_gemini_api_key_here

# Environment
REACT_APP_ENV=development
```
