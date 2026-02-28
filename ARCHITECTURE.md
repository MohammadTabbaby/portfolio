# Portfolio Application Architecture Overview

## Table of Contents
1. [High-Level Overview](#high-level-overview)
2. [System Architecture](#system-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [How They Connect](#how-they-connect)
6. [Data Flow Examples](#data-flow-examples)
7. [Security Flow](#security-flow)

---

## High-Level Overview

This is a **two-tier web application** consisting of a **Spring Boot backend** (Java API server) and an **Angular frontend** (user-facing web interface), connected through HTTP REST API calls. Think of it like a restaurant:

- **Backend (Kitchen)**: Processes orders, stores data, manages business logic
- **Frontend (Dining Area)**: Where customers interact, place orders, view results
- **Database (Pantry)**: Stores all the ingredients (data)

```
┌─────────────────────────────────────────────────────────────┐
│                    PORTFOLIO APPLICATION                     │
├──────────────────────────┬──────────────────────────────────┤
│    BACKEND (Java)        │    FRONTEND (Angular)             │
│  REST API Server         │  User Interface                   │
│  Port: 8080              │  Port: 4200                       │
│  Spring Boot 4.0.3       │  Angular 21.2.0                  │
│                          │                                   │
│  ✓ Business Logic        │  ✓ UI Components                 │
│  ✓ Data Processing       │  ✓ User Interactions             │
│  ✓ Security (JWT)        │  ✓ Routing & Navigation          │
│  ✓ Database Access       │  ✓ HTTP Requests                 │
└──────────────────────────┴──────────────────────────────────┘
                │                          │
                └──────────────────────────┘
                      HTTP REST API
                    (communication layer)
                │
                └──────────────────────┐
                                       │
                  ┌────────────────────▼─────────────────┐
                  │   DATABASE (PostgreSQL)               │
                  │   Port: 5432 (Docker Container)      │
                  │                                      │
                  │   Stores:                             │
                  │   • Projects                          │
                  │   • Messages                          │
                  │   • User Sessions (via JWT)           │
                  └──────────────────────────────────────┘
```

---

## System Architecture

### Technology Stack

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Angular)                      │
│ TypeScript • RxJS • Signals • HttpClient • Router             │
└────────────────────────────┬─────────────────────────────────┘
                             │
                    HTTP REST API Call
              (JSON request/response over HTTP)
                             │
          ┌──────────────────▼──────────────────┐
          │      PROXY (Development)            │
          │   proxy.conf.json setup             │
          │   Redirects /api → http://...8080   │
          └──────────────────┬──────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      BACKEND (Spring Boot)                     │
│                                                                 │
│  Spring Web • Spring Data JPA • Spring Security • JWT         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ CONTROLLERS (Endpoints)                                 │ │
│  │ • AuthController (/api/auth/login)                      │ │
│  │ • ProjectController (/api/projects GET, POST, DELETE)  │ │
│  │ • MessageController (/api/messages)                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          │                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ SERVICES (Business Logic)                               │ │
│  │ • ProjectService (CRUD operations, validation)          │ │
│  │ • MessageService (Message handling)                     │ │
│  │ • JwtService (Token generation & validation)            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          │                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ REPOSITORIES (Data Access)                              │ │
│  │ • ProjectRepository (extends JpaRepository)             │ │
│  │ • MessageRepository (extends JpaRepository)             │ │
│  │ (Auto-generated CRUD methods)                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          │                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ENTITIES (Data Models)                                  │ │
│  │ • Project (@Entity, @Table in DB)                       │ │
│  │ • Message (@Entity, @Table in DB)                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          │                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ CONFIGURATION & SECURITY                                │ │
│  │ • SecurityConfig (Spring Security setup)                │ │
│  │ • JwtFilter (Authenticates JWT tokens)                  │ │
│  │ • JwtService (Creates/validates tokens)                 │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────────┬──────────────────────────────────┘
                             │
                   JDBC (SQL Queries)
                             │
         ┌───────────────────▼───────────────────┐
         │   DATABASE (PostgreSQL)                │
         │   Connection Pool (HikariCP)           │
         │                                        │
         │   Tables:                              │
         │   • project (id, title, description... │
         │   • message (id, name, email, text..)  │
         │                                        │
         │   Persists all application data        │
         └────────────────────────────────────────┘
```

---

## Backend Architecture

### Layer-by-Layer Breakdown

#### 1. **ENTITY LAYER** (Data Models)
These are Java classes that represent database tables.

**Example: Project.java**
```java
@Entity                      // Marks this as a database table
@Table(name = "project")     // Maps to "project" table in PostgreSQL
public class Project {
    @Id                      // Primary key
    @GeneratedValue          // Auto-increment ID
    private Long id;
    
    private String title;
    private String description;
    private String githubUrl;
}
```

**Why needed?** 
- Provides a structure for what data exists in the database
- Spring Data JPA automatically maps Java objects to database rows
- **Analogy**: A blueprint for a house before construction

---

#### 2. **REPOSITORY LAYER** (Data Access)
These are interfaces that handle communication with the database. Spring automatically implements them!

**Example: ProjectRepository.java**
```java
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Spring auto-generates these methods:
    // findAll() - Get all projects
    // findById(Long id) - Get project by ID
    // save(Project project) - Insert/update
    // delete(Project project) - Delete
}
```

**Why needed?**
- Abstracts database operations
- Handles JDBC/SQL calls automatically
- Provides reusable CRUD (Create, Read, Update, Delete) methods
- **Analogy**: A librarian who retrieves books from shelves instead of you going directly

---

#### 3. **SERVICE LAYER** (Business Logic)
These contain the actual business logic and coordinate between repositories.

**Example: ProjectService.java**
```java
@Service
public class ProjectService {
    private final ProjectRepository repository;
    
    public List<Project> getAll() {
        return repository.findAll();  // Uses repository to fetch data
    }
    
    public Project create(Project project) {
        // Could add validation here
        // Could enrich data before saving
        return repository.save(project);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
```

**Why needed?**
- Separates business rules from data access
- Makes code testable and reusable
- Can add validation, logging, error handling
- **Analogy**: A manager who decides what work to do but delegates to workers

---

#### 4. **CONTROLLER LAYER** (REST Endpoints)
These handle HTTP requests and responses. They're the public-facing API.

**Example: ProjectController.java**
```java
@RestController              // Returns JSON, not HTML
@RequestMapping("/api/projects")  // Endpoint path
@CrossOrigin                 // Allows requests from frontend
public class ProjectController {
    
    private final ProjectService service;
    
    @GetMapping              // GET /api/projects
    public List<Project> getAll() {
        return service.getAll();
    }
    
    @PostMapping             // POST /api/projects
    public Project create(@RequestBody Project project) {
        return service.create(project);
    }
    
    @DeleteMapping("/{id}")   // DELETE /api/projects/{id}
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
```

**Why needed?**
- Defines API endpoints that frontend can call
- Converts HTTP requests to Java method calls
- Converts Java objects to JSON responses
- **Analogy**: A restaurant's menu that tells customers what they can order

---

#### 5. **SECURITY LAYER** (Authentication & Authorization)

**JWT Service** - Creates and validates security tokens
```java
@Service
public class JwtService {
    
    public String generateToken(String username) {
        // Creates a signed token that expires in 1 hour
        return Jwts.builder()
                .setSubject(username)           // Who this token is for
                .setExpiration(new Date(...))   // When it expires
                .signWith(key)                  // Sign with secret key
                .compact();
    }
}
```

**How it works:**
1. User logs in with username/password
2. Backend verifies credentials
3. Backend generates a JWT token
4. Frontend stores token in localStorage
5. Frontend sends token with every request
6. Backend validates token before processing request

**Why needed?**
- Verifies user identity without storing sessions
- Tokens can't be forged (signed with secret key)
- Tokens expire automatically
- **Analogy**: Like a concert ticket - proves you paid, can't be faked, has an expiration date

---

## Frontend Architecture

### Component Structure

The Angular frontend follows a **component-based architecture**:

```
Your Browser (localhost:4200)
    │
    ├─ app.ts (Root Component)
    │   │
    │   ├─ Header/Navigation
    │   │
    │   └─ RouterOutlet (Shows current page)
    │       │
    │       ├─ HomeComponent (/pages/home/)
    │       │   └─ Displays portfolio homepage
    │       │
    │       ├─ ProjectsComponent (/pages/projects/)
    │       │   │
    │       │   ├─ Calls ProjectService.getAll()
    │       │   ├─ Displays projects from backend
    │       │   └─ Can add/delete projects
    │       │
    │       ├─ ContactComponent (/pages/contact/)
    │       │   └─ Send messages
    │       │
    │       ├─ AdminLoginComponent (/pages/admin/admin-login/)
    │       │   │
    │       │   └─ Calls AuthService.login()
    │       │       └─ Gets JWT token from backend
    │       │
    │       └─ AdminDashboardComponent (/pages/admin/)
    │           │
    │           ├─ Protected by AuthGuard
    │           └─ Can manage projects/messages
    │
    ├─ Services (Shared utilities)
    │   │
    │   ├─ AuthService
    │   │   ├─ login(username, password)
    │   │   ├─ logout()
    │   │   ├─ getToken() / setToken()
    │   │   └─ isAuthenticated()
    │   │
    │   ├─ ProjectService
    │   │   ├─ getAll() → GET /api/projects
    │   │   ├─ create() → POST /api/projects
    │   │   └─ delete() → DELETE /api/projects/{id}
    │   │
    │   └─ MessageService
    │       └─ sendMessage() → POST /api/messages
    │
    └─ Interceptors (Request interceptors)
        │
        └─ JwtInterceptor
            └─ Automatically adds JWT token to requests
```

---

## How They Connect

### Request-Response Flow

```
FRONTEND (Browser)              BACKEND (Spring Boot)
─────────────────              ──────────────────────

┌──────────────────┐
│  User clicks     │
│  "Load Projects" │
└────────┬─────────┘
         │
┌────────▼──────────────────┐
│ ProjectComponent ngOnInit  │
│ calls injected            │
│ ProjectService.getAll()   │
└────────┬──────────────────┘
         │
┌────────▼──────────────────────────┐
│ ProjectService.getAll()           │
│ this.http.get('/api/projects')    │
│ Creates HttpRequest               │
└────────┬──────────────────────────┘
         │
┌────────▼──────────────────────────┐
│ JwtInterceptor                     │
│ Adds Authorization header:        │
│ "Bearer <jwt_token>"              │
│                                    │
│ Converts /api → proxy route       │
│ → http://localhost:8080/api/...  │
└────────┬──────────────────────────┘
         │
         │  HTTP GET /api/projects
         │  Header: Authorization: Bearer eyJhbGc...
         │
         ├────────────────────────────────────────────────┐
         │                                                 │
         │          NETWORK TRANSMISSION                  │
         │                                                 │
         └────────────────────────────────────────────────┤
                                                          │
                                         ┌────────────────▼──────┐
                                         │ Spring DispatcherServlet
                                         │ Catches all /api/* calls
                                         └────────────┬───────────┘
                                                      │
                                         ┌────────────▼──────────┐
                                         │ Spring Security Filter
                                         │ Validates JWT token    
                                         │ (JwtFilter)            
                                         └────────────┬───────────┘
                                                      │
                                         ┌────────────▼──────────┐
                                         │ ProjectController     │
                                         │ @GetMapping "/api/    │
                                         │   projects"           │
                                         │ Routes to getAll()    │
                                         └────────────┬───────────┘
                                                      │
                                         ┌────────────▼──────────┐
                                         │ ProjectService.       │
                                         │ getAll()              │
                                         │ Calls repository      │
                                         └────────────┬───────────┘
                                                      │
                                         ┌────────────▼──────────┐
                                         │ ProjectRepository     │
                                         │ .findAll()            │
                                         │ Generates SQL query   │
                                         └────────────┬───────────┘
                                                      │
                                         ┌────────────▼──────────┐
                                         │ PostgreSQL Database   │
                                         │ Executes: SELECT ...  │
                                         │ Returns rows          │
                                         └────────────┬───────────┘
                                                      │
                        ┌─────┐ Rows converted to List<Project>
                        │     └──────────────────┐
                        │                        │
                        │  ┌──────────────────┐  │
                        │  │ Projects Data    │  │
                        │  │ [                │  │
                        │  │   {id: 1,        │  │
                        │  │    title: "...", │  │
                        │  │    ...}          │  │
                        │  │ ]                │  │
                        │  └──────────────────┘  │
                        │                        │
                        └────────┬───────────────┘
                                 │
                        ┌────────▼──────────┐
                        │ Convert to JSON   │
                        │ Response body:    │
                        │ [                 │
                        │   {id: 1,         │
                        │    title: "..."}] │
                        └────────┬──────────┘
                                 │
         ┌───────────────────────┴────────────────────────┐
         │                                                 │
         │  HTTP 200 OK                                   │
         │  Content-Type: application/json                │
         │  Body: [{"id": 1, "title": "..."}]            │
         │                                                 │
         ├────────────────────────────────────────────────┤
         │                                                 │
         │          NETWORK TRANSMISSION                  │
         │                                                 │
         └────────────────────────────────────────────────┤
                                                          │
┌────────────────────────────────────────────────────────▼───┐
│ Frontend receives HTTP response                             │
│ RxJS Observable emits data                                  │
│ Component subscribes and gets data:                         │
│   projects = [                                              │
│     {id: 1, title: "My First Project"},                     │
│     {id: 2, title: "Another Project"}                       │
│   ]                                                         │
└────────────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────┐
│ Component re-renders      │
│ Angular template loops    │
│ through projects array    │
│ *ngFor="let p of projects"
│ Displays each project     │
└────────────────────────────┘
         │
┌────────▼──────────────────┐
│ User sees projects        │
│ displayed in browser      │
└────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: User Views Projects

1. User navigates to `/projects` page
2. ProjectsComponent loads
3. Component calls `ProjectService.getAll()`
4. Service makes HTTP GET request to `/api/projects`
5. Backend routes to ProjectController
6. Controller calls ProjectService (backend)
7. Service calls ProjectRepository
8. Repository queries database
9. Results come back as Java List
10. Converted to JSON and sent to frontend
11. Frontend receives JSON array and renders it

### Example 2: User Logs In

1. User fills login form (username "admin", password "admin123")
2. AdminLoginComponent calls `AuthService.login(username, password)`
3. Service makes HTTP POST to `/api/auth/login` with credentials
4. Backend AuthController receives request
5. Controller verifies credentials (hardcoded check)
6. If valid, JwtService generates JWT token
7. Token sent back to frontend in JSON response
8. Frontend received token and stores in `localStorage`
9. AuthService is now marked as authenticated
10. User can navigate to admin dashboard
11. AuthGuard checks `AuthService.isAuthenticated()` before allowing access

### Example 3: User Adds a Project

1. Admin fills project form and clicks "Add Project"
2. Form data passed to `ProjectService.create(projectData)`
3. Service makes HTTP POST to `/api/projects` with project JSON
4. JwtInterceptor adds JWT token to Authorization header
5. Spring Security validates JWT token
6. If valid, request reaches ProjectController
7. Controller's `create()` method receives project
8. Calls ProjectService.create()
9. Service calls ProjectRepository.save()
10. Repository runs SQL: INSERT INTO project (title, description, ...) VALUES (...)
11. Database returns saved project with new ID
12. Result converted to JSON and sent to frontend
13. Frontend receives new project data
14. Component adds to local projects array
15. UI updates automatically

---

## Security Flow

### How Authentication Works

```
Login Process:
──────────────

                Frontend                    Backend
                ────────                    ───────
    
    User enters:
    • username: "admin"
    • password: "admin123"
            │
            ▼
    POST /api/auth/login
    Body: {username, password}
            │
            ├─────────────────────────────────┐
            │                                 │
            │                      AuthController
            │                      .login()
            │                         │
            │                         ▼
            │                      Verify:
            │                      • username == "admin"
            │                      • password == "admin123"
            │                         │
            │                         ▼
            │                      JwtService
            │                      .generateToken("admin")
            │                         │
            │      Creates JWT token:
            │      ┌────────────────────────────┐
            │      │ HEADER:                    │
            │      │ {alg: "HS256", typ: "JWT"} │
            │      │                            │
            │      │ PAYLOAD:                   │
            │      │ {                          │
            │      │   sub: "admin",            │
            │      │   iat: 1234567890,         │
            │      │   exp: 1234571490          │
            │      │ }                          │
            │      │                            │
            │      │ SIGNATURE:                 │
            │      │ HMAC-SHA256(                │
            │      │   header.payload,         │
            │      │   SECRET_KEY               │
            │      │ )                          │
            │      └────────────────────────────┘
            │
            ▼
    Response 200 OK:
    {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
            │
            ▼
    AuthService.setToken(token)
    localStorage.setItem("portfolio_jwt", token)
            │
            ▼
    User is authenticated!

Authenticated Requests (After Login):
────────────────────────────────────

    Frontend                          Backend
    ────────                          ───────
    
    User clicks "Load Projects"
            │
            ▼
    ProjectService.getAll()
    this.http.get('/api/projects')
            │
            ▼
    JwtInterceptor intercepts:
    • Gets token from localStorage
    • Adds to request header:
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..."
            │
            ├────────────────────────────────┐
            │                                │
            │                    Spring Security
            │                    JwtFilter
            │                    Extract JWT from header
            │                    JwtService.extractUsername(token)
            │                    Verify signature matches
            │                    Check expiration time
            │                         │
            │                    If valid → ✓ Allow request
            │                    If invalid → ✗ Return 401
            │
            ▼
    Response 200 OK with Projects:
    [{id: 1, title: "..."}, ...]
```

### Token Structure

A JWT token has 3 parts separated by dots: `header.payload.signature`

**Example Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwODg5NDU0OCwiZXhwIjoxNzA4ODk4MTQ4fQ.
8k9_X_b3K8F_Qe2Jx7pL_zZ9aL_bN2cO_qR3dV_9kM

│                                                                          │
└─ header.payload.signature ──┘
```

When the frontend sends a request with this token:
- Backend extracts the token
- Verifies the signature (using secret key)
- Checks expiration time
- Extracts username from payload
- Allows or denies access

**Why this is secure:**
- Only backend has the secret key, so users can't forge tokens
- Tokens are signed, so modifications are detected
- Tokens expire automatically
- Tokens are stored in localStorage (accessible to JavaScript but protected from XSS with proper practices)

---

## Why Each Layer is Needed

| Layer | Purpose | Why It's Needed |
|-------|---------|-----------------|
| **Entity** | Data models | Defines database structure, enables ORM mapping |
| **Repository** | Data access | Abstracts database queries, reusable CRUD logic |
| **Service** | Business logic | Separates concerns, enables testing, adds validation |
| **Controller** | HTTP endpoints | Makes API public, converts HTTP ↔ Java |
| **Frontend** | User interface | Allows human interaction, makes system usable |
| **JWT** | Authentication | Enables secure user verification without sessions |
| **Proxy** | Development | Routes frontend requests to backend, enables CORS |
| **Database** | Persistence | Stores data permanently, atomic operations |

---

## Deployment Architecture

When deployed (docker-compose.yml):

```
Docker Network
  │
  ├─ Backend Service (Spring Boot)
  │  Port: 8080
  │  Container: Java runtime
  │
  ├─ Frontend Service (Optional, or served by backend)
  │  Port: 4200 (development)
  │  Container: Node.js + nginx
  │
  └─ PostgreSQL Service
     Port: 5432
     Container: PostgreSQL 15
     Volume: db_data (persistent storage)
```

Development vs Production:
- **Development**: Frontend (4200) ↔ Proxy ↔ Backend (8080). Separate dev servers.
- **Production**: Frontend built as static files, served by backend or nginx.

---

## Quick Reference

### API Endpoints

```
Authentication:
  POST /api/auth/login
  Body: {username, password}
  Response: {token: "JWT_TOKEN"}

Projects:
  GET  /api/projects           → List all projects
  POST /api/projects           → Create new project
  DELETE /api/projects/{id}    → Delete project

Messages:
  POST /api/messages           → Send message
```

### Key Files & Their Roles

#### Backend
| File | Role |
|------|------|
| `PortfolioApplication.java` | Entry point, starts Spring Boot |
| `ProjectController.java` | Handles `/api/projects` requests |
| `ProjectService.java` | Business logic for projects |
| `ProjectRepository.java` | Database queries for projects |
| `Project.java` | Data model, maps to DB table |
| `JwtService.java` | Creates/validates JWT tokens |
| `SecurityConfig.java` | Configures Spring Security |

#### Frontend
| File | Role |
|------|------|
| `app.ts` | Root component, main layout |
| `app.routes.ts` | Defines all page routes |
| `ProjectService` | Calls backend `/api/projects` |
| `AuthService` | Handles login/token storage |
| `JwtInterceptor` | Adds token to all requests |
| `AuthGuard` | Protects admin routes |
| `ProjectsComponent` | Displays projects page |

---

## Summary

This is a **classic three-tier web application**:

1. **Presentation Tier** (Angular Frontend)
   - What users interact with
   - Makes requests to backend
   - Displays data beautifully

2. **Business Logic Tier** (Spring Boot Backend)
   - Processes requests
   - Enforces business rules
   - Manages security
   - Talks to database

3. **Data Tier** (PostgreSQL Database)
   - Permanently stores all data
   - Only backend talks to it
   - Single source of truth

Each part has a specific job, making the system **scalable**, **maintainable**, and **secure**. The JWT authentication layer ensures only authorized users can access protected features.
