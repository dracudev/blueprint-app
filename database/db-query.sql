-- Create the database (Note: In Supabase, database is already created)
-- CREATE DATABASE blueprint_app; -- Not needed for Supabase
-- USE blueprint_app; -- Not needed for PostgreSQL
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'registered' CHECK (role IN ('registered', 'client', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Clients table
CREATE TABLE "Clients" (
    client_id SERIAL PRIMARY KEY,
    is_company BOOLEAN NOT NULL,
    company_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    billing_address TEXT
);
CREATE INDEX idx_client_email ON "Clients"(email);
-- Projects table
CREATE TABLE "Projects" (
    project_id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    job_status VARCHAR(20) DEFAULT 'Received' CHECK (
        job_status IN (
            'Received',
            'In Progress',
            'Completed',
            'Delivered'
        )
    ),
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (client_id) REFERENCES "Clients"(client_id) ON DELETE CASCADE
);
-- Services table
CREATE TABLE "Services" (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);
-- ProjectItems table
CREATE TABLE "ProjectItems" (
    project_item_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES "Projects"(project_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES "Services"(service_id)
);
-- Payments table
CREATE TABLE "Payments" (
    payment_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Unpaid' CHECK (
        payment_status IN ('Paid', 'Partially Paid', 'Unpaid')
    ),
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES "Projects"(project_id) ON DELETE CASCADE
);
-- Sample data
-- Insert users (passwords are hashed versions of 'admin' and 'user')
INSERT INTO users (name, email, password, role)
VALUES (
        'Admin',
        'admin@admin.com',
        '$2b$10$K7L/VXjOAGxXXOE5qUqHSOJdXl1XH7aDJZhqZlNPZKG6TyQ7aRjEO',
        'admin'
    ),
    (
        'User',
        'user@user.com',
        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'registered'
    );
-- Insert services
INSERT INTO "Services" (service_name, description, price)
VALUES (
        'Website Development',
        'Complete website development including design, frontend, and backend implementation. Includes responsive design, SEO optimization, and content management system.',
        2500.00
    ),
    (
        'Mobile App Development',
        'Native and cross-platform mobile application development for iOS and Android. Includes UI/UX design, backend integration, and app store deployment.',
        4000.00
    ),
    (
        'E-commerce Platform',
        'Full-featured e-commerce platform with payment integration, inventory management, project tracking, and admin dashboard. Includes shopping cart and checkout functionality.',
        6000.00
    );
-- Insert clients
INSERT INTO "Clients" (
        is_company,
        company_name,
        first_name,
        last_name,
        email,
        phone,
        billing_address
    )
VALUES (
        TRUE,
        'Tech Solutions Inc.',
        NULL,
        NULL,
        'contact@techsolutions.com',
        '+1-555-0123',
        '123 Tech Street, Silicon Valley, CA 94000'
    ),
    (
        FALSE,
        NULL,
        'John',
        'Doe',
        'john.doe@email.com',
        '+1-555-0456',
        '456 Main Street, Anytown, USA 12345'
    );
-- Insert projects
INSERT INTO "Projects" (client_id, job_status, total_amount)
VALUES (1, 'In Progress', 5000.00),
    (2, 'Received', 3000.00);
-- Insert project items
INSERT INTO "ProjectItems" (project_id, service_id, quantity, unit_price)
VALUES (1, 1, 1, 5000.00),
    (2, 2, 1, 3000.00);
-- Insert payments
INSERT INTO "Payments" (project_id, payment_status, paid_amount)
VALUES (1, 'Partially Paid', 2500.00),
    (2, 'Unpaid', 0.00);