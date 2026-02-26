# Portfolio Application

A personal website/portfolio backend application built with Spring Boot and PostgreSQL. This application provides REST API endpoints for managing projects, messages, and user authentication with JWT security.

## Project Overview

This is a full-stack portfolio application that allows users to:
- Manage personal projects
- Handle user messages/inquiries
- Secure endpoints with JWT-based authentication
- Store data in a PostgreSQL database

## Technology Stack

- **Framework**: Spring Boot 4.0.3
- **Language**: Java 25
- **Database**: PostgreSQL 15
- **Authentication**: Spring Security with JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/medtb/portfolio/
│   │   │   ├── PortfolioApplication.java          # Main application entry point
│   │   │   ├── config/
│   │   │   │   ├── JwtFilter.java                 # JWT authentication filter
│   │   │   │   ├── JwtService.java                # JWT token generation and validation
│   │   │   │   └── SecurityConfig.java            # Spring Security configuration
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java            # Authentication endpoints
│   │   │   │   ├── MessageController.java         # Message management endpoints
│   │   │   │   └── ProjectController.java         # Project management endpoints
│   │   │   ├── entity/
│   │   │   │   ├── Message.java                   # Message entity
│   │   │   │   └── Project.java                   # Project entity
│   │   │   ├── repository/
│   │   │   │   ├── MessageRepository.java         # Message data access layer
│   │   │   │   └── ProjectRepository.java         # Project data access layer
│   │   │   └── service/
│   │   │       ├── MessageService.java            # Message business logic
│   │   │       └── ProjectService.java            # Project business logic
│   │   └── resources/
│   │       └── application.properties             # Application configuration
│   └── test/
│       └── java/                                  # Unit tests
├── pom.xml                                        # Maven dependencies and build configuration
└── mvnw                                           # Maven Wrapper (Unix)

docker-compose.yml                                 # Docker Compose configuration for PostgreSQL
```

## Prerequisites

- Java 25 or higher
- Maven 3.6+
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)

## Getting Started

### 1. Clone and Setup

```bash
cd /path/to/P
```

### 2. Start PostgreSQL Database

Using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance with:
- Database: `portfolio`
- User: `admin`
- Password: `admin`
- Port: `5432`

### 3. Build the Application

```bash
cd backend
./mvnw clean install
```

Or on Windows:
```bash
mvnw.cmd clean install
```

### 4. Run the Application

```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## Configuration

The application is configured via `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio
spring.datasource.username=admin
spring.datasource.password=admin

# JWT
jwt.secret=mysupersecurejwtsecretkeythatismorethan32bytes!!

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Note**: For production, ensure you:
- Change the JWT secret to a secure value
- Update database credentials
- Configure environment-specific settings

## API Endpoints

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Project Management
- `GET /projects` - Get all projects
- `POST /projects` - Create a new project (requires authentication)
- `GET /projects/{id}` - Get project by ID
- `PUT /projects/{id}` - Update project (requires authentication)
- `DELETE /projects/{id}` - Delete project (requires authentication)

### Message Management
- `GET /messages` - Get all messages
- `POST /messages` - Create a new message
- `GET /messages/{id}` - Get message by ID
- `DELETE /messages/{id}` - Delete message (requires authentication)

## Authentication

The application uses JWT (JSON Web Tokens) for securing endpoints:

1. Authenticate with `/auth/login` to receive a JWT token
2. Include the token in the `Authorization: Bearer <token>` header for protected endpoints
3. The `JwtFilter` validates tokens before processing requests

## Development

### Running Tests

```bash
./mvnw test
```

### Build Docker Image

Create a Dockerfile in the backend directory and build:

```bash
docker build -t portfolio-app:latest .
```

## Database Schema

- **Projects**: Stores portfolio projects with metadata
- **Messages**: Stores contact form messages
- **Users**: Implicitly managed through Spring Security

Hibernate will automatically create/update tables based on entity definitions (controlled by `spring.jpa.hibernate.ddl-auto=update`).

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running and accessible
- Verify credentials in `application.properties`
- Check that port 5432 is not blocked by firewall

### Port Already in Use
- Change `server.port` in `application.properties`
- Or kill the process using port 8080

### Build Failures
```bash
./mvnw clean package -DskipTests
```

## Future Enhancements

- Add email notification for contact messages
- Implement pagination for projects and messages
- Add file upload for project images
- Enhanced security with role-based access control (RBAC)
- API documentation with Swagger/OpenAPI

## License

This project is a personal portfolio application.

## Contact

For questions or feedback, reach out through the contact form in the application.
