# 💰 Finance Companion - Personal Finance Mobile App

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

## 📱 About The App

**Finance Companion** is a complete personal finance management app that helps users track expenses, manage savings goals, and gain spending insights. Built with React Native Expo for cross-platform compatibility (Android, iOS, Web).

### 🎯 Live Demo

| Platform | URL |
|----------|-----|
| **Web App** | https://69d01133564d0153752214d6--poetic-hummingbird-99bb3f.netlify.app |
| **Backend API** | https://finance-backend.onrender.com |
| **GitHub** | https://github.com/Dutta-Raj/finance-companion-app |

## ✨ Features

### 1. 📊 Home Dashboard
- Current balance with large display
- Total income and expense summary
- Monthly savings goal with progress bar
- Spending chart by category (visual analytics)

### 2. 💰 Transaction Management
- Add, Edit, Delete transactions
- Search and filter by income/expense
- 10+ categories (Food, Transport, Shopping, Bills, etc.)
- Date tracking with notes/description

### 3. 🎯 Goals & Challenges
- Monthly savings goal tracker
- 🔥 Saving Streak system (gamification)
- Custom savings goals with progress tracking

### 4. 📈 Insights Analytics
- Highest spending category
- Week vs last week comparison
- Spending by category breakdown
- Period filtering (All/7 Days/30 Days)

### 5. 🎨 Professional UI/UX
- Modern gradient design
- Smooth animations
- Loading and empty states
- Touch-friendly interface
- 3-tab navigation

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native (Expo) |
| **Backend** | Node.js + Express |
| **State Management** | React Hooks (useState, useEffect) |
| **HTTP Client** | Axios |
| **Storage** | In-memory (backend) + localStorage |
| **Authentication** | Token-based |
| **Deployment** | Netlify (frontend) + Render (backend) |

## 📂 Project Structure
FinanceCompanion/
├── FinanceNew/ # Frontend React Native App
│ ├── App.js # Main application
│ ├── package.json # Dependencies
│ ├── app.json # Expo configuration
│ └── assets/ # Images and icons
│
├── finance-backend-pro/ # Backend API Server
│ ├── server.js # Express server
│ └── package.json # Backend dependencies
│
└── README.md # Documentation

text

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for Android/iOS testing)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Dutta-Raj/finance-companion-app.git
cd finance-companion-app/finance-backend-pro

# Install dependencies
npm install

# Start the server
node server.js
Server runs on http://localhost:5000

Frontend Setup
bash
# Navigate to frontend directory
cd ../FinanceNew

# Install dependencies
npm install

# Start the Expo development server
npx expo start --clear
Press w to open in web browser

Scan QR code with Expo Go app for Android/iOS

Test Credentials
text
Email: test@test.com
Password: 123456
Or register a new account.

📱 Running on Android Device
Option 1: Expo Go (Easiest)
Install Expo Go from Google Play Store

Run npx expo start --tunnel

Scan QR code with Expo Go app

Option 2: Build APK
bash
eas build -p android --profile preview
🌐 Deployment
Frontend (Netlify)
bash
npx expo export -p web
# Drag and drop 'dist' folder to Netlify
Backend (Render)
Push code to GitHub

Connect repository to Render.com

Set build command: npm install

Set start command: node server.js
