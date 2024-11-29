-- Create the database
CREATE DATABASE finance_blog;

-- Select the database
USE finance_blog;

-- Create the blogs table
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0
);