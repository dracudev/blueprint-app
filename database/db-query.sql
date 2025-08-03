-- Create the database
CREATE DATABASE blueprint;
USE blueprint;
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('public', 'registered', 'admin') DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Clients table
CREATE TABLE Clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    is_company BOOLEAN NOT NULL,
    company_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    billing_address TEXT,
    INDEX idx_client_email (email)
);
-- Projects table
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    job_status ENUM(
        'Received',
        'In Progress',
        'Completed',
        'Delivered'
    ) DEFAULT 'Received',
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id)
);
-- Services table
CREATE TABLE Services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL
);
-- ProjectItems table
CREATE TABLE ProjectItems (
    project_item_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (service_id) REFERENCES Services(service_id)
);
-- Payments table
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    payment_status ENUM('Paid', 'Partially Paid', 'Unpaid') DEFAULT 'Unpaid',
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);