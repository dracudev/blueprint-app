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
- **Database**: MySQL with (abstracted)
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
   # (Database setup commands to be determined)
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
- (Database scripts to be determined)

## File Structure

```tree
├── app.js                 # Main application file
├── package.json
├── .env
├── database/             # Database Abstraction Layer
│   ├── index.js             # Database adapter (connection manager)
│   ├── config/
│   │   ├── database.js      # Environment configurations
│   │   └── sequelize.js     # Sequelize instance + model creation
│   ├── factories/
│   │   └── SequelizeModelFactory.js  # Schema → Sequelize converter
│   ├── migrations/
│   ├── seeders/
│   └── schemas/             # ORM-agnostic schema definitions
│       ├── index.js
│       ├── userSchema.js
│       ├── courseSchema.js
│       └── enrollmentSchema.js
├── public/              # Static assets
│   ├── images/
│   ├── scripts/
│   └── styles/
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
│       ├── admin.ejs
│       ├── error.ejs
│       ├── home.ejs
│       ├── login.ejs
│       ├── profile.ejs
│       └── signup.ejs
```

## Database Schema

### Users Table

- `id` (Primary Key)
- `name`
- `email` (Unique)
- `password` (Hashed)
- `role` (public, registered, admin)
- `profile_picture`
- `created_at`

### Projects Table

(To be determined)

### Budget Items Table

(To be determined)

## Database Architecture

### **Abstraction Layers:**

1. **📊 Schemas** (`/database/schemas/`): ORM-agnostic data definitions
2. **🏭 Model Factory** (`/database/factories/`): Converts schemas to ORM models  
3. **⚙️ Config Layer** (`/database/config/`): Environment and connection management
4. **🔌 Database Adapter** (`/database/index.js`): Connection abstraction
5. **📦 Models** (`/src/models/`): Clean model exports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the tests
5. Submit a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE.md) file for details.
