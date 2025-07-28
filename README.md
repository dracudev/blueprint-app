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

A comprehensive Node.js web application for managing web development projects and client relationships. Built with Express.js and featuring a sophisticated database abstraction layer, this application provides complete project lifecycle management from client onboarding to order fulfillment and payment tracking.

The application supports both individual and company clients, tracks project orders with detailed status updates, manages product catalogs, and provides comprehensive payment tracking functionality. Built with a modular architecture that supports easy ORM switching through database abstraction layers.

## Features

- 🔐 User authentication (sign up, login, logout)
- 👥 Role-based access (public, registered, admin)
- 👤 User profiles
- 🏢 Client management (company/individual clients)
- 📋 Order management system
- 📦 Product catalog management
- � Payment tracking system
- � Job status tracking (Received, In Progress, Completed, Delivered)
- 🗄️ Database abstraction layer (easy ORM switching)
- 🌐 Service pages for business presentation

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM (abstracted)
- **Architecture**: Database abstraction layer
- **Authentication**: bcrypt, cookie-session
- **View Engine**: EJS
- **Validation**: express-validator
- **Database**: MySQL with Prisma ORM
- **Styling**: Custom CSS

### Dependencies

- **Core**: Express.js 5.1.0, Node.js
- **Database**: Prisma 6.12.0, @prisma/client 6.12.0, mysql2 3.14.1
- **Authentication**: bcrypt 6.0.0, cookie-session 2.1.1
- **Validation**: express-validator 7.2.1
- **Environment**: dotenv 16.5.0
- **Development**: nodemon 3.1.10

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
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL="mysql://username:password@localhost:3306/codecost"
   
   # Session Configuration
   SESSION_SECRET=your_secret_key_here
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema (for development)
   npm run db:push
   
   # Or run migrations (for production)
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
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

### Client Management

- `GET /client/setup` - Client setup form
- `POST /client/setup` - Create new client profile
- `GET /client/profile` - View client profile
- `POST /client/profile` - Update client profile
- `GET /client/edit` - Edit client information
- `PUT /client/edit` - Update client data
- `GET /client/data` - Get client data (API)

### User Profile

- `GET /user/profile` - User profile and information

### General

- `GET /` - Home page
- `GET /services` - Services information page

## Scripts

- `npm start` - Start production server (with deployment script)
- `npm run dev` - Start development server with nodemon
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:migrate` - Create and apply migrations (development)
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:reset` - Reset database and run migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)

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
│   │   ├── deploy.js
│   │   └── reset-db.js
│   └── styles/
│       ├── auth.css
│       ├── client-setup.css
│       ├── error.css
│       ├── global.css
│       ├── home.css
│       ├── profile.css
│       └── services.css
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── session.js
│   ├── models/          # (Abstracted)
│   │   ├── index.js
│   │   ├── Client.js
│   │   └── User.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   └── userRoutes.js
│   ├── validations/
│   │   ├── authValidation.js
│   │   └── clientValidation.js
│   └── views/               # EJS templates
│       ├── partials/
│       │   ├── head.ejs
│       │   └── header.ejs
│       ├── client-setup.ejs
│       ├── error.ejs
│       ├── home.ejs
│       ├── login.ejs
│       ├── profile.ejs
│       ├── services.ejs
│       └── signup.ejs
```

## Database Schema

### Users Table

- `id` (Primary Key)
- `name` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `role` (Enum: public, registered, admin)
- `created_at` (DateTime)

### Clients Table

- `client_id` (Primary Key)
- `is_company` (Boolean)
- `company_name` (String, nullable)
- `first_name` (String, nullable)
- `last_name` (String, nullable)
- `email` (String, unique)
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
