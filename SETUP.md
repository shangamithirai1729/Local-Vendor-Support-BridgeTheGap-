# BridgeTheGap Setup Instructions

## 🚀 Complete Setup Guide

Follow these steps to get BridgeTheGap running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** - [Download from Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
- **Node.js 16+** - [Download from nodejs.org](https://nodejs.org/)
- **MySQL 8.0+** - [Download from mysql.com](https://dev.mysql.com/downloads/)
- **Maven 3.6+** - [Download from maven.apache.org](https://maven.apache.org/download.cgi)

## Step 1: Database Setup

### 1.1 Start MySQL Server
```bash
# On Windows (if installed as service)
net start mysql

# On macOS (using Homebrew)
brew services start mysql

# On Linux
sudo systemctl start mysql
```

### 1.2 Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE bridgethegapdb;
exit
```

### 1.3 Import Schema
```bash
# Import the schema file
mysql -u root -p bridgethegapdb < database/schema.sql
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Configure Database Connection
Edit `src/main/resources/application.properties`:

```properties
# Replace these with your MySQL credentials
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 2.3 Run Backend
```bash
# Using Maven
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/bridge-the-gap-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Start Frontend
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Step 4: Verify Installation

### 4.1 Check Backend
Visit `http://localhost:8080` - you should see a Spring Boot error page (this is normal for a REST API)

### 4.2 Check Frontend
Visit `http://localhost:3000` - you should see the BridgeTheGap homepage

### 4.3 Test API
You can test the API using curl or Postman:

```bash
# Test user registration
curl -X POST http://localhost:8080/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🔧 Configuration Options

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/bridgethegapdb?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=mySecretKey
jwt.expiration=86400000

# CORS Configuration
cors.allowed.origins=http://localhost:3000
```

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:8080` (see `package.json` proxy setting).

## 🗄️ Default Data

The application includes:

### Default Admin Account
- **Username**: admin
- **Password**: admin123
- **Email**: admin@bridgethegap.com

### Sample Data
You can add sample data by:
1. Registering as a user
2. Registering as a vendor
3. Adding products through the vendor dashboard
4. Adding reviews through the user dashboard

## 🌐 Google Maps Integration

To enable Google Maps functionality:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Replace `PUT_API_KEY_HERE` in the frontend code with your actual API key
3. The maps will then display vendor locations and enable location-based search

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check Java version: `java -version` (should be 17+)
- Check MySQL is running: `mysql -u root -p`
- Verify database credentials in `application.properties`
- Check port 8080 is not in use

#### Frontend Won't Start
- Check Node.js version: `node --version` (should be 16+)
- Delete `node_modules` and run `npm install` again
- Check port 3000 is not in use

#### Database Connection Issues
- Verify MySQL is running
- Check database name is `bridgethegapdb`
- Verify username/password in `application.properties`
- Check MySQL user has proper permissions

#### CORS Issues
- Ensure backend is running on port 8080
- Check CORS configuration in `SecurityConfig.java`
- Verify frontend is running on port 3000

### Logs

#### Backend Logs
Check the console output where you ran `mvn spring-boot:run`

#### Frontend Logs
Check the browser console and the terminal where you ran `npm start`

## 📱 Testing the Application

### 1. User Registration
1. Go to `http://localhost:3000`
2. Click "User Login"
3. Click "Register here"
4. Fill out the registration form
5. You'll be redirected to the user dashboard

### 2. Vendor Registration
1. Go to `http://localhost:3000`
2. Click "Vendor Login"
3. Click "Register here"
4. Fill out the vendor registration form
5. You'll be redirected to the vendor dashboard

### 3. Admin Login
1. Go to `http://localhost:3000/admin/login`
2. Use username: `admin`, password: `admin123`
3. You'll be redirected to the admin dashboard

### 4. Search Functionality
1. Go to `http://localhost:3000/search`
2. Enter coordinates or use "Use My Location"
3. Set search radius
4. Click "Search Vendors"

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes**: The Spring Boot dev server will auto-reload
2. **Frontend Changes**: The React dev server will auto-reload
3. **Database Changes**: Restart the backend after schema changes

### Hot Reload

Both frontend and backend support hot reload during development:
- Frontend: Changes are reflected immediately
- Backend: Changes require a restart (or use Spring Boot DevTools)

## 📦 Production Deployment

### Backend
```bash
cd backend
mvn clean package -Pproduction
java -jar target/bridge-the-gap-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a web server
```

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Check the logs for error messages
4. Ensure all services are running on the correct ports
5. Verify database connectivity

## ✅ Success Checklist

- [ ] MySQL server is running
- [ ] Database `bridgethegapdb` is created
- [ ] Schema is imported successfully
- [ ] Backend starts without errors on port 8080
- [ ] Frontend starts without errors on port 3000
- [ ] Can access the homepage at `http://localhost:3000`
- [ ] Can register a new user
- [ ] Can register a new vendor
- [ ] Can login as admin
- [ ] Search functionality works (with or without Google Maps)

Once all items are checked, you're ready to use BridgeTheGap! 🎉
