E-Commerce App - API

Overview

This is the backend API for the e-commerce application, built using Node.js with Express and MongoDB. It provides endpoints for managing users, products, orders, payments, and cart operations.

Features

User Authentication: JWT-based authentication with role-based access control.

Product Management: CRUD operations for products.

Cart Management: Add, remove, update items in the cart.

Order Processing: Handle checkout and order history.

Payment Integration: Stripe for payment processing.

Middleware: Authentication and error handling.

Tech Stack

Backend: Node.js, Express

Database: MongoDB with Mongoose

Authentication: JWT (JSON Web Token)

Validation: Joi

Payment Integration: Stripe

storage: multer

Setup Instructions

Prerequisites

Node.js (>= 18)

MongoDB (Local or Cloud-based like MongoDB Atlas)

npm

Installation

Clone the repository:

git clone https://github.com/yourusername/mern-ecom-api.git
cd ecom-api

Install dependencies:

npm install


Create an .env file in the root directory and configure:

PORT=YOUR_RUNNING_PORT
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

Start the server:

npm run dev


Folder Structure

/src
  ├── controllers/     # Route controllers (business logic)
  ├── enums/           # TypeScript enums
  ├── middleware/      # Express middleware (auth, error handling)
  ├── models/         # Mongoose models (schemas)
  ├── routes/         # Express route handlers
  ├── uploads/        # File uploads directory
  ├── index.ts        # Entry point