# CodeCost | Web Development Budgeting

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Default Users](#default-users)
- [API Routes](#api-routes)
- [Scripts](#scripts)
- [File Structure](#file-structure)
- [Database Schema](#database-schema)
- [Database Architecture](#database-architecture)
- [Contributing](#contributing)
- [License](#license)

## Description

A Node.js application for web development budgeting and project estimation, built with Express.js and a database abstraction layer that supports easy ORM switching.

## Features

- 🔐 User authentication (sign up, login, logout)
- 👥 Role-based access (public, registered, admin)
- � Budget management (CRUD operations)
- � Project cost estimation
- 🛠️ Admin dashboard
- 👤 User profiles
- 🗄️ Database abstraction layer (easy ORM switching)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM (abstracted)
- **Architecture**: Database abstraction layer
- **Authentication**: bcrypt, cookie-session
- **View Engine**: EJS
- **Validation**: express-validator
- **File Upload**: Multer

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/dracudev/codecost-app
   cd codecost-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=codecost
   DB_PORT=3306
   SESSION_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema (for development)
   npx prisma db push
   
   # Or run migrations (for production)
   npx prisma migrate dev
   
   # Seed the database with initial data
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

## Default Users

(Default users to be determined)

**Admin User:**

- Email:
- Password:

**Regular User:**

- Email:
- Password:

## API Routes

### Authentication

- `GET /auth/signup` - Sign up form
- `POST /auth/signup` - Create new user
- `GET /auth/login` - Login form
- `POST /auth/login` - Authenticate user
- `POST /auth/logout` - Logout user

### Budget Management

(Budget routes to be determined)

### User Profile

- `GET /user/profile` - User profile and budget information
- (Additional user routes to be determined)

### Admin

- `GET /admin/dashboard` - Admin dashboard

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database (development)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma db seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio (database GUI)

## File Structure

```tree
├── app.js                 # Main application file
├── package.json
├── .env
├── database/             # Database Abstraction Layer
│   ├── index.js             # Database adapter (connection manager)
│   ├── config/
│   │   └── prisma.js        # Prisma instance + model creation
│   ├── factories/
│   │   └── PrismaModelFactory.js  # Schema → Prisma converter
│   ├── prisma/              # Prisma configuration
│   │   ├── schema.prisma    # Prisma schema definition
│   │   ├── seed.js          # Database seeder
│   │   └── generated/       # Generated Prisma client
│   └── schemas/             # ORM-agnostic schema definitions
│       ├── index.js
│       ├── userSchema.js
│       ├── clientSchema.js
│       ├── orderSchema.js
│       ├── orderItemSchema.js
│       ├── productSchema.js
│       └── paymentSchema.js
├── public/              # Static assets
│   ├── images/
│   ├── scripts/
│   ├── styles/
│   └── uploads/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── session.js
│   │   └── upload.js
│   ├── models/          # (Abstracted)
│   │   ├── index.js
│   │   └── User.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── validations/
│   │   └── authValidation.js
│   └── views/               # EJS templates
│       ├── partials/
│       │   ├── head.ejs
│       │   └── header.ejs
│       ├── admin.ejs
│       ├── error.ejs
│       ├── home.ejs
│       ├── login.ejs
│       ├── profile.ejs
│       └── signup.ejs
```

## Database Schema

### Clients Table

- `client_id` (Primary Key)
- `is_company` (Boolean)
- `company_name` (String, nullable)
- `first_name` (String, nullable)
- `last_name` (String, nullable)
- `email` (String)
- `phone` (String, nullable)
- `billing_address` (Text, nullable)

### Orders Table

- `order_id` (Primary Key)
- `client_id` (Foreign Key)
- `created_at` (DateTime)
- `job_status` (Enum: Received, In Progress, Completed, Delivered)
- `total_amount` (Decimal)

### Products Table

- `product_id` (Primary Key)
- `product_name` (String)

### OrderItems Table

- `order_item_id` (Primary Key)
- `order_id` (Foreign Key)
- `product_id` (Foreign Key)
- `quantity` (Integer)
- `unit_price` (Decimal)

### Payments Table

- `payment_id` (Primary Key)
- `order_id` (Foreign Key)
- `payment_status` (Enum: Paid, Partially Paid, Unpaid)
- `paid_amount` (Decimal)
- `payment_date` (DateTime)

## Database Architecture

### **Abstraction Layers:**

1. **📊 Schemas** (`/database/schemas/`): ORM-agnostic data definitions
2. **🏭 Model Factory** (`/database/factories/`): Converts schemas to Prisma models  
3. **⚙️ Config Layer** (`/database/config/`): Prisma client and connection management
4. **🔌 Database Adapter** (`/database/index.js`): Connection abstraction
5. **📦 Models** (`/src/models/`): Clean model exports
6. **🗄️ Prisma Layer** (`/database/prisma/`): Prisma schema, migrations, and generated client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the tests
5. Submit a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE.md) file for details.
