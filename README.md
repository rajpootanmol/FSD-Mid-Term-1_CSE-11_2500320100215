Library Management System

Student Details

Name: Anmol Rajpoot
Roll Number: 2500320100215
Branch: CSE
Section: CSE-11

Project Description

A Library Management System developed using Node.js and Express.js to manage books through REST APIs.

Technologies Used

Node.js
Express.js
JavaScript
Postman

Folder Structure

Library-Management-System/
node_modules/
server.js
package.json
package-lock.json
README.md

Installation and Execution

npm install
node server.js

Server URL: http://localhost:3000

API Endpoints

Method	Endpoint	Function
POST	/api/books	Add book
GET	/api/books	Get all books
GET	/api/books/:id	Get book by ID
PUT	/api/books/:id	Update book
DELETE	/api/books/:id	Delete book
POST	/api/books/:id/issue	Issue book
POST	/api/books/:id/return	Return book

Features

Add and manage books.
Search and filter books.
Update and delete book records.
Issue and return books.
Input validation and error handling.

Data Storage

Book records are stored in an in-memory JavaScript array.

Conclusion

Successfully implemented all seven tasks using Node.js and Express.js. APIs were tested using Postman.
