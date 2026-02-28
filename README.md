# Portfolio Application

A full-stack personal portfolio website built with **Spring Boot** (Java backend) and **Angular** (TypeScript frontend). Features project management, contact forms, and JWT-based authentication with PostgreSQL persistence.

## Project Overview

This is a complete portfolio application system consisting of:

**Frontend** - Angular 21 SPA providing:
- Public pages: Home, Portfolio Projects showcase, Contact form
- Admin dashboard: Manage projects, view messages
- JWT token management and secure routing

**Backend** - Spring Boot 4.0.3 REST API providing:
- User authentication with JWT tokens
- Project CRUD operations
- Contact message handling
- Secure endpoints with role-based access control

**Database** - PostgreSQL storing projects and contact messages

## Technology Stack

**Backend:**
- **Framework**: Spring Boot 4.0.3
- **Language**: Java 25
- **Database**: PostgreSQL 15
- **Authentication**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven

**Frontend:**
- **Framework**: Angular 21.2.0
- **Language**: TypeScript 5.9
- **State Management**: RxJS 7.8 (Observables)
- **Build Tool**: Angular CLI
- **Package Manager**: npm 11.9.0

## Project Structure

```
P/
├── ARCHITECTURE.md                              # Detailed system architecture overview
├── docker-compose.yml                           # PostgreSQL container setup
│
├── backend/                                     # Spring Boot REST API Server
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/medtb/portfolio/
│   │   │   │   ├── PortfolioApplication.java          # Entry point
│   │   │   │   ├── config/                            # Security & JWT config
│   │   │   │   │   ├── JwtFilter.java                 # JWT validation
│   │   │   │   │   ├── JwtService.java                # Token generation
│   │   │   │   │   └── SecurityConfig.java            # Spring Security setup
│   │   │   │   ├── controller/                        # REST endpoints
│   │   │   │   │   ├── AuthController.java            # /api/auth/*
│   │   │   │   │   ├── ProjectController.java         # /api/projects/*
│   │   │   │   │   └── MessageController.java         # /api/messages/*
│   │   │   │   ├── service/                           # Business logic
│   │   │   │   │   ├── ProjectService.java
│   │   │   │   │   └── MessageService.java
│   │   │   │   ├── repository/                        # Data access (JPA)
│   │   │   │   │   ├── ProjectRepository.java
│   │   │   │   │   └── MessageRepository.java
│   │   │   │   └── entity/                            # Database models
│   │   │   │       ├── Project.java
│   │   │   │       └── Message.java
│   │   │   └── resources/
│   │   │       └── application.properties             # DB & JWT config
│   │   └── test/
│   │       └── java/                                  # Unit tests
│   ├── pom.xml                                        # Maven dependencies
│   └── mvnw / mvnw.cmd                               # Maven wrapper scripts
│
├── frontend/                                    # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts                          # Root component
│   │   │   ├── app.routes.ts                   # Route definitions
│   │   │   ├── config/                         # App configuration
│   │   │   ├── core/                           # Core services
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts               # Protects admin routes
│   │   │   ├── interceptors/
│   │   │   │   └── jwt-interceptor.ts          # Adds JWT to requests
│   │   │   ├── services/
│   │   │   │   ├── auth.ts                     # Login/logout + token
│   │   │   │   ├── project.ts                  # Project API calls
│   │   │   │   └── message.ts                  # Message API calls
│   │   │   └── pages/
│   │   │       ├── home/                       # Homepage
│   │   │       ├── projects/                   # Public projects showcase
│   │   │       ├── contact/                    # Contact form
│   │   │       └── admin/
│   │   │           ├── admin-login/            # Login page
│   │   │           └── admin-dashboard/        # Manage projects
│   │   ├── environments/
│   │   │   ├── environment.ts                  # Dev config
│   │   │   └── environment.prod.ts             # Prod config
│   │   ├── main.ts                             # Bootstrap app
│   │   └── styles.scss                         # Global styles
│   ├── package.json                            # npm dependencies
│   ├── angular.json                            # Angular CLI config
│   ├── proxy.conf.json                         # Dev proxy setup
│   ├── tsconfig.json                           # TypeScript config
│   └── README.md                               # Frontend setup guide
│
└── portfolio/                                   # Additional Maven module
    └── target/                                  # Build artifacts
```

## Prerequisites

**Backend:**
- Java 25 or higher
- Maven 3.6+
- Docker & Docker Compose (for PostgreSQL)
- PostgreSQL 15 (or use Docker)

**Frontend:**
- Node.js 20+ and npm 10+
- Angular CLI 21+

**All:**
- Git
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Getting Started

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This starts PostgreSQL with:
- Database: `portfolio`
- User: `admin`
- Password: `admin`
- Port: `5432`

### 2. Backend Setup & Run

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`  
Available endpoints: `http://localhost:8080/api/*`

**On Windows:**
```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

### 3. Frontend Setup & Run

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:4200`  
Opens automatically in your browser

The frontend proxy (proxy.conf.json) automatically routes `/api` requests to the backend on port 8080.

### 4. Test the Application

1. **View Projects**: Navigate to `/projects` (public, no auth needed)
2. **Contact Form**: Go to `/contact` and submit a message
3. **Admin Login**: Visit `/admin/login`
   - Username: `admin`
   - Password: `admin123`
4. **Admin Dashboard**: After login, manage projects and view messages

## Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio
spring.datasource.username=admin
spring.datasource.password=admin
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=mysupersecurejwtsecretkeythatismorethan32bytes!!
```

### Frontend Configuration

Edit `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // Routes to backend via proxy.conf.json
};
```

Dev proxy setup in `frontend/proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Important Notes

**Development:**
- JWT secret is hardcoded for demo
- Credentials stored in application.properties
- CORS enabled for local testing

**Production:**
- Change `jwt.secret` to a long, random value (min 32 chars)
- Use environment variables for sensitive data (database, JWT secret)
- Disable `spring.jpa.show-sql`
- Set `spring.jpa.hibernate.ddl-auto=validate`
- Use HTTPS/SSL certificates
- Implement proper rate limiting
- Add request logging and monitoring

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/login` | ❌ | Login with username/password, returns JWT token |

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Projects
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/projects` | ❌ | Get all projects (public) |
| POST | `/projects` | ✅ | Create new project |
| DELETE | `/projects/{id}` | ✅ | Delete project |

**Example POST `/projects` (requires JWT token):**
```json
{
  "title": "My Awesome Project",
  "description": "A cool web app built with Angular",
  "githubUrl": "https://github.com/user/project"
}
```

### Messages
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/messages` | ❌ | Submit contact form message |

**Example POST `/messages`:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "content": "I'd like to collaborate..."
}
```

### Authorization

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Use `admin` / `admin123` credentials to login and get a token.

## Development

### Running Both Services

**Terminal 1 - Start Database:**
```bash
docker-compose up
```

**Terminal 2 - Start Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm start
```

Open `http://localhost:4200` in your browser.

### Backend Development

**Run Tests:**
```bash
cd backend
./mvnw test
```

**Build Project:**
```bash
./mvnw clean package
```

**Run with Custom Port:**
```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"
```

**View Logs:**
```bash
./mvnw spring-boot:run | grep -i error
```

### Frontend Development

**Run Frontend Only (with mock backend):**
```bash
cd frontend
npm start -- --proxy-config proxy.conf.json
```

**Build for Production:**
```bash
ng build --configuration production
```

**Run Tests:**
```bash
npm test
```

**Format Code:**
```bash
npm run format
```

### Hot Reload

- **Backend**: Changes to Java files require restart (./mvnw will auto-compile)
- **Frontend**: Angular auto-recompiles on file save; browser auto-refreshes

### Debugging

**Backend - Add Breakpoint:**
1. In your IDE, click on line number to add breakpoint
2. Run: `./mvnw spring-boot:run`
3. IDE will pause at breakpoint

**Frontend - Browser DevTools:**
1. Open DevTools (F12)
2. Sources tab shows TypeScript source code
3. Set breakpoints and inspect variables
4. Network tab shows API calls

## Database Schema

### Project Table
```sql
CREATE TABLE project (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  github_url VARCHAR(255)
);
```

### Message Table
```sql
CREATE TABLE message (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  content VARCHAR(2000) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Note:** Tables are automatically created by Hibernate on first run (`spring.jpa.hibernate.ddl-auto=update`)

### Entity Relationships

- **Project**: Standalone entity for portfolio projects
- **Message**: Contact form submissions, timestamped for tracking

## Troubleshooting

### Backend Issues

**Port 8080 Already in Use**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process (replace PID)
kill -9 <PID>

# Or change port in application.properties
server.port=9090
```

**Database Connection Failed**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Verify credentials in application.properties
# Default: admin/admin

# Test connection
psql -h localhost -U admin -d portfolio
```

**Maven Build Fails**
```bash
# Clear Maven cache
./mvnw clean

# Rebuild with skipping tests
./mvnw clean package -DskipTests

# Update dependencies
./mvnw dependency:resolve
```

**JWT Token Errors**
- Ensure jwt.secret is set in application.properties (min 32 chars)
- Check token is included in Authorization header: `Bearer <token>`
- Tokens expire in 1 hour; login again to get new token

### Frontend Issues

**Port 4200 Already in Use**
```bash
# Use different port
ng serve --port 4300

# Or kill process using 4200
lsof -i :4200
kill -9 <PID>
```

**npm Dependencies Error**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**API Calls Failing (CORS Error)**
- Ensure backend is running on port 8080
- Check proxy.conf.json target is correct: `http://localhost:8080`
- Backend has `@CrossOrigin` on controllers

**Module Not Found**
```bash
# Rebuild node_modules
npm install

# Check import paths in .ts files
# Angular is case-sensitive!
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused: localhost:5432` | PostgreSQL not running | `docker-compose up -d` |
| `Port 8080 already in use` | Another app using port | Change port or kill process |
| `Cannot GET /api/projects` | Backend not running | `cd backend && ./mvnw spring-boot:run` |
| `404 Not Found` | Wrong endpoint path | Check route in app.routes.ts |
| `401 Unauthorized` | Missing/invalid JWT token | Login first at /admin/login |
| `CORS error` | Frontend-backend mismatch | Check proxy.conf.json |
| `Cannot find module` | Missing dependencies | `npm install` |

### Getting Help

1. Check logs in terminal
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system overview
3. Check browser console (F12) for frontend errors
4. Check backend console for Java exceptions
5. Verify database connection: `docker-compose logs postgres`

## Project Status & Roadmap

### Currently Implemented ✅

- [x] Spring Boot REST API with 3 controllers (Auth, Projects, Messages)
- [x] JWT authentication with hardcoded admin credentials
- [x] Project CRUD (Create, Read, Delete)
- [x] Contact form message submission
- [x] Angular frontend with 5 pages (Home, Projects, Contact, Admin Login, Admin Dashboard)
- [x] Client-side JWT storage and token management
- [x] Route guards for protected pages
- [x] PostgreSQL database with Project & Message entities
- [x] Docker Compose setup for database

### High Priority - Next Steps 📋

1. **View Messages in Admin** - Let admins see all contact submissions
   - Backend: GET /api/messages endpoint
   - Frontend: Display messages list in admin dashboard
   
2. **Edit Projects** - Update project details after creation
   - Backend: PUT /api/projects/{id} endpoint  
   - Frontend: Edit button/modal in admin dashboard
   
3. **Input Validation** - Validate data on frontend and backend
   - Backend: @NotBlank, @Email annotations on entities
   - Frontend: Form validation with error messages
   
4. **Delete Messages** - Allow admins to clean up messages
   - Backend: DELETE /api/messages/{id}
   - Frontend: Delete button for each message

### Medium Priority - Improvements 📈

- [ ] Logout functionality
- [ ] Pagination for projects and messages
- [ ] Search/filter projects by title
- [ ] Loading spinners and empty states
- [ ] Better error handling & user feedback
- [ ] Responsive mobile-friendly design
- [ ] Global exception handler (@ControllerAdvice)

### Low Priority - Polish 🎨

- [ ] Email notifications for contact messages
- [ ] Project images/file uploads
- [ ] User roles and RBAC (Role-Based Access Control)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit and integration tests
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Production deployment guide
- [ ] Analytics integration

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system overview.

## Architecture Overview

This is a **3-tier web application** architecture:

```
┌──────────────────────┐
│   Browser/Client     │
│   (Angular SPA)      │
└──────────────────────┐
          │
          │ HTTP REST API
          │
┌─────────▼──────────────────┐
│   Backend API Server        │
│   (Spring Boot)             │
│   - Controllers             │
│   - Services                │
│   - Repositories            │
└─────────▼──────────────────┘
          │
          │ JDBC/SQL
          │
┌─────────▼──────────────────┐
│   PostgreSQL Database       │
│   - Projects                │
│   - Messages                │
└──────────────────────────────┘
```

### Key Concepts

- **Separation of Concerns**: Each layer has a specific responsibility
- **Security**: JWT tokens protect authenticated endpoints
- **Scalability**: Stateless API design allows horizontal scaling
- **Data Persistence**: PostgreSQL ensures data survives restarts

**For detailed architecture explanation, see [ARCHITECTURE.md](ARCHITECTURE.md)**
