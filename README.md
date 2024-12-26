# ABS_product_management


Product Management API

Node.js (version 14 or higher)
npm (comes with Node.js)
A database is MySQL

Start the server

- node server.js

GIT_URL

https://github.com/shaheen2984/ABS_product_management

Database scheema details

Scheema name: product_management

Database Tables

users:
        user_id (auto-increment, primary key)
        user_name (string, required)
        email (string, required, unique)
        password (string, required)
        Active(number, NOT NULL)
 
categories:
        
        category_id (auto-increment, primary key)
        category_name (string, required, unique per user)
        Active(number, NOT NULL)
        user_id (foreign key, references the user who created the category)
 
products:
        
        product_id (auto-increment, primary key)
        product_name (string, required)
        price (float, required)
        category_id (foreign key, references the category)
        Active(number, NOT NULL)
