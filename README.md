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
- [Contributing](#contributing)
- [License](#license)

## Description

A comprehensive Node.js web application for managing web development projects and client relationships. Built with Express.js and featuring a sophisticated database abstraction layer, this application provides complete project lifecycle management from client onboarding to order fulfillment and payment tracking.

The application supports both individual and company clients, tracks project orders with detailed status updates, manages product catalogs, and provides comprehensive payment tracking functionality. Built with a modular architecture that supports easy ORM switching through database abstraction layers.

## Features

- 🔑 JWT authentication (secure API/session tokens)
- 👥 Role-based access (public, registered, admin)
- 🏢 Client management (company/individual clients)
- 📋 Order, Client and Product management system
- 💸 Payment tracking system
- 📊 Job status tracking (Received, In Progress, Completed, Delivered)
- 🗄️ Database abstraction layer (easy ORM switching)
- 🛡️ Security middleware: helmet, express-rate-limit

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM (abstracted)
- **Architecture**: Database abstraction layer
- **Authentication**: bcrypt, cookie-session, JWT (jsonwebtoken)
- **Security**: Helmet, express-rate-limit
- **View Engine**: EJS
- **Validation**: express-validator
- **Styling**: Custom CSS

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

After seeding, you can log in with:

**Admin User:**

- Email: <admin@admin.com>
- Password: admin

**Regular User:**

- Email: <user@user.com>
- Password: user

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
├── app.js
├── package.json
├── .env
├── database/
│   ├── config/
│   ├── factories/
│   ├── prisma/
│   ├── schemas/
│   └── index.js
├── public/
│   ├── images/
│   ├── scripts/
│   └── styles/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validations/
│   └── views/
└── README.md
```

## Database Schema

### Users

| Column      | Type    | Description                        |
|-------------|---------|------------------------------------|
| id          | PK      | Primary Key                        |
| name        | String  |                                    |
| email       | String  | Unique                             |
| password    | String  | Hashed                             |
| role        | Enum    | public, registered, admin          |
| created_at  | DateTime|                                    |

### Clients

| Column         | Type     | Description         |
|----------------|----------|---------------------|
| client_id      | PK       | Primary Key         |
| is_company     | Boolean  |                     |
| company_name   | String   | Nullable            |
| first_name     | String   | Nullable            |
| last_name      | String   | Nullable            |
| email          | String   | Unique              |
| phone          | String   | Nullable            |
| billing_address| Text     | Nullable            |

### Orders

| Column      | Type     | Description                        |
|-------------|----------|------------------------------------|
| order_id    | PK       | Primary Key                        |
| client_id   | FK       | Foreign Key                        |
| created_at  | DateTime |                                    |
| job_status  | Enum     | Received, In Progress, Completed, Delivered |
| total_amount| Decimal  |                                    |

### Products

| Column        | Type    | Description                        |
|---------------|---------|------------------------------------|
| product_id    | PK      | Primary Key                        |
| product_name  | String  |                                    |

### OrderItems

| Column         | Type    | Description                        |
|----------------|---------|------------------------------------|
| order_item_id  | PK      | Primary Key                        |
| order_id       | FK      | Foreign Key                        |
| product_id     | FK      | Foreign Key                        |
| quantity       | Integer |                                    |
| unit_price     | Decimal |                                    |

### Payments

| Column         | Type     | Description                        |
|----------------|----------|------------------------------------|
| payment_id     | PK       | Primary Key                        |
| order_id       | FK       | Foreign Key                        |
| payment_status | Enum     | Paid, Partially Paid, Unpaid       |
| paid_amount    | Decimal  |                                    |
| payment_date   | DateTime |                                    |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the tests
5. Submit a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE.md) file for details.
