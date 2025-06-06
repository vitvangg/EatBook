# Project Setup Guide

## Getting Started

To run this project, please follow these steps:

### 1. Download Source Code
- Switch to the `dev` branch to download the latest code
```bash
git checkout dev
git pull origin dev
```

### 2. Database Setup

#### Install MongoDB
1. Download and install MongoDB Community Server from: 🔗 https://www.mongodb.com/try/download/community
2. Download and install MongoDB Compass from the same link above

#### Connect to Database
1. Open MongoDB Compass
2. Click "Connect" (use default connection settings)
3. Create a new database for the project (if needed)

### 3. Backend Setup

#### Navigate to Backend Directory
```bash
cd Backend
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

### 4. Database Data Setup

#### Install MongoDB Database Tools
1. Download MongoDB Database Tools from: 🔗 https://www.mongodb.com/try/download/database-tools
2. Extract and add to your system PATH, or install via package manager:
   - **Windows**: Download the MSI installer
   - **macOS**: `brew install mongodb/brew/mongodb-database-tools`
   - **Linux**: Follow the installation guide for your distribution

#### Restore Database from Backup
- Raw database backup is located in the `db-backup` folder within the Backend directory
- Use `mongorestore` command to restore the database:

```bash
# Navigate to Backend directory
cd Backend

# Restore the database (adjust database name as needed)
mongorestore --db your_database_name db-backup/

# Or restore to default database name from backup
mongorestore db-backup/
```

#### Alternative: Manual Import via MongoDB Compass
If you prefer using MongoDB Compass:
1. Open MongoDB Compass
2. Connect to your database
3. Create/select your database
4. Import collections manually from the `db-backup` folder

## Environment Variables

Make sure to create a `.env` file in the Backend directory with necessary environment variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
# Add other required environment variables
```

## Troubleshooting

- Ensure MongoDB service is running before starting the backend
- Check if all dependencies are installed correctly
- Verify database connection in MongoDB Compass
- Make sure the port is not already in use

## Frontend Setup

#### Navigate to Frontend Directory
```bash
cd fe-main
```

#### Install Dependencies
```bash
npm install
```

#### Install Additional Required Libraries (if needed)
If you encounter missing dependencies, install these packages:
```bash
npm install zustand
npm install react-router-dom
npm install react-icons
npm install lucide-react@latest
npm install bootstrap
```

#### Start Frontend Development Server
```bash
npm run dev
```

## Running the Application

Once both backend and frontend are set up:

1. **Start Backend Server:**
```bash
cd Backend
npm run dev
```

2. **Start Frontend Server:**
```bash
cd fe-main
npm run dev
```

3. **Start Mobile App:**
```bash
cd app
npm run dev
```

4. **Access the Application:**
   - Frontend: Usually runs on `http://localhost:3000` or `http://localhost:5173`
   - Backend API: Usually runs on `http://localhost:5000`
   - Mobile App: Follow the instructions in terminal for mobile development

## Additional Notes

- The backend server will run on the port specified in your environment variables (default: 5000)
- The frontend will typically run on port 3000 or 5173 (Vite default)
- Make sure to import the database backup before testing the application
- Ensure both backend and frontend servers are running simultaneously
- Check the console for any error messages during startup
