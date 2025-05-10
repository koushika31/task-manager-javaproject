# Task Management System

A full-stack Java web application for managing tasks and to-dos.

## Tech Stack

- Backend: Java with Spring Boot
- Database: MySQL
- Frontend: React.js
- API Documentation: Swagger/OpenAPI
- Containerization: Docker
- Cloud: AWS

## Prerequisites

1. Java 17 or higher
2. Maven
3. MySQL
4. Node.js and npm
5. Docker
6. Git

## Setup Instructions

### 1. Database Setup

1. Install MySQL
2. Create a database named `taskmanager` (or it will be created automatically)
3. Update `application.properties` with your database credentials if different from defaults:
   - Username: root
   - Password: root

### 2. Backend Setup

1. Clone the repository
2. Navigate to the project directory
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Access Swagger UI at: http://localhost:8080/swagger-ui.html

### 3. Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### 4. Docker Setup

1. Build the Docker image:
   ```bash
   docker build -t task-manager .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:8080 task-manager
   ```
   
   Or use Docker Compose to run both the application and MySQL:
   ```bash
   docker-compose up
   ```

## API Testing with Postman

1. Import the Postman collection from `postman/TaskManager.postman_collection.json`
2. Set up environment variables in Postman
3. Run the requests to test the API endpoints

## Project Structure

```
task-manager/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── taskmanager/
│   │   │           ├── controller/
│   │   │           ├── model/
│   │   │           ├── repository/
│   │   │           ├── service/
│   │   │           └── TaskManagerApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── frontend/
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.