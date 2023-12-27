# Task Manager

## Project Description

This project is a task management system web application that allows users to manage tasks, set deadlines, categorize tasks, and more. It has user authentication and a dashboard to view tasks, along with a RESTful API for CRUD operations.
Technologies used are:

- Frontend: React
- Backend: Node.js with Express
- Database: PostgreSQL

## Setup Instructions

1. Setting up the database and .env file:

- Make sure PostgreSQL is installed on your machine.
- Create a new database named 'authtodolist'.

```
createdb authtodolist
```

- Run the SQL commands in database.sql to create the required tables and initial data.

```
psql -d authtodolist -a -f database.sql
```

- Create an .env file in the server directory and add this line to it:

```
jwtSecret = "cat123"
```

- Update the db.js file or the .env file in the server directory with your database connection details.

2. Start the server and install the required packages:

```
cd server
npm i pg cors express reactstrap
nodemon server
```

3. Start the client:

```
cd client
npm install
npm start
```
