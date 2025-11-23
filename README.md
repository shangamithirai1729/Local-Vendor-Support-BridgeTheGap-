# BridgeTheGap - Local Vendor Support Platform

A full-stack web application that connects local vendors with customers in their community, featuring location-based search, reviews, and comprehensive vendor management.

## 🛠 Tech Stack

- **Frontend**: React (normal React, not Vite) with plain CSS
- **Backend**: Spring Boot (Java, Maven)
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Maps Integration**: Google Maps API (placeholder included)

## 📂 Project Structure

```
BridgeTheGap/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── ...
│   └── package.json
├── backend/                 # Spring Boot backend application
│   ├── src/main/java/com/bridgethegap/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic services
│   │   ├── repository/      # Data access layer
│   │   ├── entity/          # JPA entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── config/          # Configuration classes
│   │   └── security/        # Security configuration
│   └── pom.xml
└── database/                # Database schema
    └── schema.sql
```

## 🚀 Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### 1. Database Setup

1. Start your MySQL server
2. Create a new database:
   ```sql
   CREATE DATABASE bridgethegapdb;
   ```
3. Run the schema file:
   ```bash
   mysql -u your_username -p bridgethegapdb < database/schema.sql
   ```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=PUT_DB_USERNAME_HERE
   spring.datasource.password=PUT_DB_PASSWORD_HERE
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🔑 Default Admin Account

The application comes with a default admin account:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@bridgethegap.com

## 📱 Features

### User Features
- User registration and login
- Browse products and services
- Add reviews and ratings
- Location-based vendor search
- User profile management

### Vendor Features
- Vendor registration and login
- Product/service management
- Business profile management
- Location setting for discovery
- Customer review monitoring

### Admin Features
- User management (view/delete)
- Vendor management (view/delete)
- Product management (view/delete)
- Review management (view/delete)
- System administration

### Location Features
- Haversine formula for distance calculation
- Location-based vendor search
- Google Maps integration (placeholder)
- Radius-based filtering

## 🗄️ Database Schema

The application includes the following main tables:

- **users**: Customer information and location data
- **vendors**: Vendor information and business details
- **products**: Products and services offered by vendors
- **reviews**: Customer reviews and ratings
- **admins**: Administrative user accounts

## 🔧 Configuration

### Backend Configuration

Update `backend/src/main/resources/application.properties`:

```properties
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

For Google Maps integration, replace `PUT_API_KEY_HERE` in the frontend code with your actual Google Maps API key.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/vendor/register` - Vendor registration
- `POST /api/auth/vendor/login` - Vendor login
- `POST /api/auth/admin/login` - Admin login

### Users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `PUT /api/users/{id}/location` - Update user location
- `GET /api/users/nearby` - Get nearby users

### Vendors
- `GET /api/vendors/{id}` - Get vendor by ID
- `PUT /api/vendors/{id}` - Update vendor
- `DELETE /api/vendors/{id}` - Delete vendor
- `GET /api/vendors/category/{category}` - Get vendors by category
- `GET /api/vendors/nearby` - Get nearby vendors

### Products
- `POST /api/products` - Add product
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/vendor/{vendorId}` - Get products by vendor
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?q={query}` - Search products

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/product/{productId}` - Get reviews by product
- `GET /api/reviews/user/{userId}` - Get reviews by user
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review
- `GET /api/reviews/product/{productId}/rating` - Get product rating

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/vendors` - Get all vendors
- `DELETE /api/admin/vendors/{id}` - Delete vendor
- `GET /api/admin/products` - Get all products
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/reviews` - Get all reviews
- `DELETE /api/admin/reviews/{id}` - Delete review

## 🔒 Security Features

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend-backend communication
- Input validation and sanitization
- Role-based access control

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/bridge-the-gap-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: Remember to replace all placeholder values (database credentials, API keys, etc.) with your actual configuration values before running the application.
