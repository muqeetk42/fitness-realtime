# Project Context: Fitness - Realtime

## Overview
This is a full-stack real-time fitness application built using the MERN stack (MongoDB, Express.js, React via Next.js, Node.js). 
The project is currently in its early stages, containing a basic server setup and a skeleton client application.

## Directory Structure
- `/client`: Frontend application built with Next.js (App Router).
- `/server`: Backend API built with Express.js.

## Technology Stack

### Frontend (`/client`)
- **Framework**: Next.js 16.2.4
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **State/Routing**: Next.js App Router (`/app` directory)

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (connected via Mongoose 9.5.0)
- **Authentication**: JWT (jsonwebtoken), bcrypt (installed, but logic pending implementation)
- **Other Utilities**: CORS, dotenv

## Current State & Features
### Backend Features
- **MongoDB Connection**: Successfully connects to a MongoDB Atlas cluster. *(Note: Credentials are currently hardcoded in `server.js` and should be moved to a `.env` file for security).*
- **API Endpoints**:
  - `GET /`: Health check endpoint ("Server is running 🚀").
  - `POST /register`: Registers a new user. It currently saves the `username`, `email`, and plain text `password` to the database. *(Note: Password hashing with `bcrypt` is not yet implemented).*
- **Database Models**:
  - `User`: Contains `username`, `email`, and `password`.

### Frontend Features
- Next.js skeleton structure is initialized with default pages (`app/page.js`, `app/layout.js`) and Tailwind CSS v4 integration.
- Development server is running and configured.

## Next Steps / Recommendations
1. **Security**: 
   - Move the MongoDB URI in `server/server.js` to a `.env` file.
   - Implement password hashing using `bcrypt` in the `/register` endpoint before saving the user to the database.
2. **Authentication**: Implement a login endpoint (`/login`) using `jsonwebtoken` to issue authentication tokens.
3. **Frontend Integration**: Connect the Next.js frontend to the Express backend (e.g., create a registration form that calls the `POST http://localhost:5000/register` API using Axios).
