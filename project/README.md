# eLocation Backend - Rental Matching Platform API

A comprehensive NestJS backend for a rental matching platform with user management, ads, payments, and admin features.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Role-based access control (Admin/User)
- Protected routes with guards

### 👥 User Management
- User CRUD operations
- Profile management (name, email, phone)
- Admin and regular user roles
- User status management

### 📝 Ads Management
- Create, read, update, delete ads
- Photo upload (max 5 images)
- Search and filtering by category, price, location
- Pagination support
- WhatsApp integration for contact
- Active/inactive status management

### 🏷️ Categories
- Predefined categories: Real Estate, Vehicles, Household Appliances, Events, Others
- Category management for admins
- Seeding functionality

### 💳 Payment System
- Simulated MTN/Moov Mobile Money integration
- Payment initiation and verification
- Payment history tracking
- Mandatory payment for real estate contacts
- Payment status management

### 🛠️ Admin Dashboard
- User management and moderation
- Ad moderation (approve/reject)
- Statistics dashboard
- Payment monitoring
- Recent activity tracking

## Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **File Upload**: Multer
- **Configuration**: @nestjs/config with .env

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Create a MySQL database and update the `.env` file with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=elocation_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 3. Run the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (admin only)
- `PATCH /users/:id/toggle-status` - Toggle user status (admin only)

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin only)
- `PATCH /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)
- `POST /categories/seed` - Seed default categories (admin only)

### Ads
- `GET /ads` - Search and filter ads (with pagination)
- `POST /ads` - Create new ad (protected)
- `GET /ads/my-ads` - Get user's ads (protected)
- `GET /ads/:id` - Get ad by ID
- `PATCH /ads/:id` - Update ad (protected)
- `DELETE /ads/:id` - Delete ad (protected)
- `POST /ads/:id/upload-photos` - Upload ad photos (protected)
- `GET /ads/:id/whatsapp` - Get WhatsApp redirect link

### Payments
- `POST /payments/initiate` - Initiate payment (protected)
- `POST /payments/verify` - Verify payment (protected)
- `GET /payments/my-payments` - Get user's payments (protected)
- `GET /payments/all` - Get all payments (admin only)

### Admin
- `GET /admin/stats` - Get dashboard statistics (admin only)
- `GET /admin/pending-ads` - Get ads pending moderation (admin only)
- `PATCH /admin/ads/:id/moderate` - Moderate ad (admin only)
- `GET /admin/recent-users` - Get recent users (admin only)
- `GET /admin/recent-payments` - Get recent payments (admin only)

## Search & Filtering

The ads endpoint supports advanced search and filtering:

```
GET /ads?search=house&categoryId=uuid&minPrice=100&maxPrice=1000&location=Dakar&isAvailable=true&page=1&limit=10&sortBy=price&sortOrder=ASC
```

Query parameters:
- `search` - Search in title, description, location
- `categoryId` - Filter by category
- `minPrice/maxPrice` - Price range filtering
- `location` - Location search
- `isAvailable` - Availability filter
- `page/limit` - Pagination
- `sortBy/sortOrder` - Sorting (createdAt, price, title)

## File Upload

Photos are uploaded to the `/uploads` directory and served statically. Maximum 5 photos per ad, with size limit of 5MB per file.

## Payment Integration

The payment system simulates MTN and Moov Mobile Money integration:

1. **Initiate Payment**: Creates a pending payment record
2. **Verify Payment**: Simulates verification (80% success rate for demo)
3. **Payment Status**: Tracks pending, completed, failed, cancelled statuses

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- File upload restrictions
- CORS enabled

## Development

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Formatting
```bash
npm run format
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Update JWT_SECRET to a secure value
3. Configure your production database
4. Build the application: `npm run build`
5. Start with: `npm run start:prod`

## Database Schema

The application creates the following main tables:
- `users` - User accounts and profiles
- `categories` - Ad categories
- `ads` - Advertisement listings
- `payments` - Payment records and history

All tables include proper relationships, indexes, and constraints for optimal performance.

## Support

For issues and questions, please check the documentation or create an issue in the project repository.