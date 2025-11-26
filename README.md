# BeeBetter – Habit Tracking & Motivation App

## Project Title
BeeBetter – Habit Tracking & Motivation App

## Problem Statement
Many people struggle to maintain habits due to inconsistent motivation, lack of structure, and no proper tracking system.
BeeBetter aims to offer a structured, gamified, and visual platform where users can build habits, track daily progress, and stay consistent using streaks and reminders.

## System Architecture
- **Frontend**: React.js + React Router (multi-page routing)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Hosting**: Vercel (Frontend) + Render (Backend)

## Key Features
- **Authentication & Authorization**: JWT-based login, signup, logout.
- **CRUD Operations**: Create, read, update, delete habits.
- **Searching, Sorting, Filtering, Pagination**: Efficient data handling.
- **Dynamic Data Fetching**: Real-time updates from backend.
- **Streak Tracking**: Gamified progress.

## Tech Stack
- **Frontend**: React.js, React Router, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or use Atlas URI)

### Backend Setup
1. Navigate to `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (already created):
   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/beebetter
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment
- **Frontend**: Deploy the `client` folder to Vercel.
- **Backend**: Deploy the `server` folder to Render/Railway. Ensure environment variables are set in the dashboard.
