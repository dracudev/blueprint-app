# Blueprint | Web Development Budgeting

![Blueprint](public/images/mockup.png)

> A comprehensive web development project management and client budgeting platform designed for professional service providers and development agencies.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bulueprint--app.vercel.app-blue?style=for-the-badge&logo=vercel)](https://dracudev-blueprint-app.vercel.app/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE.md)

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

A comprehensive Node.js web application for managing web development projects and client relationships. Built with Express.js and featuring a sophisticated database abstraction layer, this application provides complete project lifecycle management from client onboarding to project fulfillment and payment tracking.

The application supports both individual and company clients, tracks projects with detailed status updates, manages service catalogs, and provides comprehensive payment tracking functionality. Built with a modular architecture that supports easy ORM switching through database abstraction layers and role-based access control (registered users, clients, and admins).

## Features

- JWT authentication (secure API/session tokens)
- Role-based access control (registered, client, admin)
- Client management (company/individual clients)
- Project, Client and Service management system
- Payment tracking system
- Job status tracking (Received, In Progress, Completed, Delivered)
- Database abstraction layer (easy ORM switching)
- Security middleware: helmet, express-rate-limit
- Responsive dashboard with CRUD operations
- Mobile-friendly design
- Real-time project status updates

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
   git clone https://github.com/dracudev/blueprint-app
   cd blueprint-app
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
   DATABASE_URL="mysql://username:password@localhost:3306/blueprint"
   
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
- `GET /auth/logout` - Logout user

### Client Management

- `GET /client/setup` - Client setup form
- `POST /client/setup` - Create/update client profile
- `GET /client/profile` - Redirect to client profile
- `GET /client/data` - Get client data (API)
- `GET /client/:id` - View client details

### Dashboard

- `GET /dashboard` - Main dashboard (role-based access)

### Services

- `GET /service` - Services information page
- `GET /service/:id` - View service details

### Projects

- `GET /project` - Redirects to dashboard projects tab
- `GET /project/:id` - View project details

### API Endpoints

#### Client API

- `GET /api/clients` - List clients (role-based)
- `POST /api/clients` - Create client (admin only)
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client (admin only)

#### Service API

- `GET /api/services` - List services (role-based)
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

#### Project API

- `GET /api/projects` - List projects (role-based)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (admin only)

### General

- `GET /` - Home page

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
- `npm run db:fullreset` - Full database reset with custom script

## File Structure

```tree
├── app.js                    # Main application entry point
├── package.json              # Dependencies and scripts
├── database/
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Database seeding
│   └── config/               # Database configuration
├── public/
│   ├── scripts/              # Client-side JavaScript
│   └── styles/               # CSS stylesheets
├── src/
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Authentication & security
│   ├── routes/               # API and web routes
│   │   └── api/              # REST API endpoints
│   ├── services/             # Business logic layer
│   ├── validations/          # Input validation
│   └── views/                # EJS templates
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
| role        | Enum    | registered, client, admin          |
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

### Projects (Database)

| Column      | Type     | Description                        |
|-------------|----------|------------------------------------|
| project_id  | PK       | Primary Key                        |
| client_id   | FK       | Foreign Key                        |
| created_at  | DateTime |                                    |
| job_status  | Enum     | Received, In Progress, Completed, Delivered |
| total_amount| Decimal  |                                    |

### Services (Database)

| Column        | Type    | Description                        |
|---------------|---------|------------------------------------|
| service_id    | PK      | Primary Key                        |
| service_name  | String  |                                    |
| description   | Text    | Nullable                           |
| price         | Decimal |                                    |

### ProjectItems

| Column         | Type    | Description                        |
|----------------|---------|------------------------------------|
| project_item_id| PK      | Primary Key                        |
| project_id     | FK      | Foreign Key                        |
| service_id     | FK      | Foreign Key                        |
| quantity       | Integer |                                    |
| unit_price     | Decimal |                                    |

### Payments

| Column         | Type     | Description                        |
|----------------|----------|------------------------------------|
| payment_id     | PK       | Primary Key                        |
| project_id     | FK       | Foreign Key                        |
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
