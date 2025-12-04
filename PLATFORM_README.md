# Incident Manager 2000

A comprehensive security incident management platform built with Spring Boot and Next.js. This application enables organizations to register, classify, and resolve security incidents efficiently.

## Features

### User Roles
- **Admin**: Full system access, user management, incident management
- **Employee**: Can report and track incidents
- **IT Employee**: Can classify incidents, assign priority, and resolve tickets

### Core Features
- **Incident Registration**: Employees can report security incidents with detailed information
- **Incident Tracking**: Monitor incident status from open to resolved
- **Priority Management**: Classify incidents by priority (Low, Medium, High, Critical)
- **Category Classification**: Organize incidents by type (Malware, Phishing, DDoS, etc.)
- **Status Workflow**: Incidents progress through OPEN → IN_PROGRESS → RESOLVED → CLOSED
- **User Management**: Admin controls for user creation and role assignment
- **Real-time Updates**: Live incident dashboard with filtering and search

## Tech Stack

### Backend
- **Java 25** with Spring Boot 4.0.0
- **Spring Security** for authentication and authorization
- **Spring Data JPA** for database operations
- **PostgreSQL** as the relational database
- **RESTful API** with CORS support

### Frontend
- **Next.js 16** React framework
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hooks** for state management

### DevOps
- **Docker & Docker Compose** for containerization
- **Nginx** as reverse proxy
- **PostgreSQL** database service

## Getting Started

### Prerequisites
- Java 25+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Backend Setup

1. Navigate to the project root
2. Configure `src/main/resources/application.properties`:
   ```properties
   spring.application.name=incidents
   spring.datasource.url=jdbc:postgresql://localhost:5432/incidentsdb
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

3. Build and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The backend API will be available at `http://localhost:8080/api`

### Frontend Setup

1. Navigate to `incident_manager2000/`
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Docker Setup

1. From the project root:
   ```bash
   docker-compose up
   ```

This will start:
- PostgreSQL database
- Spring Boot backend (port 8080)
- Next.js frontend (port 3000)
- Nginx reverse proxy (port 80)
- pgAdmin for database management (port 5050)

## API Endpoints

### Incidents
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/{id}` - Get incident by ID
- `GET /api/incidents/status/{status}` - Filter by status
- `GET /api/incidents/priority/{priority}` - Filter by priority
- `GET /api/incidents/reporter/{email}` - Get incidents by reporter
- `GET /api/incidents/assigned/{email}` - Get incidents assigned to user
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/{id}` - Update incident
- `DELETE /api/incidents/{id}` - Delete incident

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `GET /api/users/role/{role}` - Get users by role
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Request/Response Examples

### Create Incident
```bash
POST /api/incidents
Content-Type: application/json

{
  "title": "Suspicious Email Activity",
  "description": "Multiple phishing emails detected from external domain",
  "reportedBy": "employee@company.com",
  "category": "Phishing",
  "priority": "HIGH"
}
```

### Update Incident Status
```bash
PUT /api/incidents/1
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "assignedTo": "it-admin@company.com"
}
```

### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "email": "newuser@company.com",
  "name": "John Doe",
  "role": "EMPLOYEE"
}
```

## Database Schema

### Incidents Table
```sql
CREATE TABLE incidents (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  reported_by VARCHAR(255),
  reported_at TIMESTAMP,
  status VARCHAR(50),
  priority VARCHAR(50),
  category VARCHAR(100),
  assigned_to VARCHAR(255),
  resolution TEXT,
  resolved_at TIMESTAMP,
  comments TEXT[],
  attachments TEXT[]
);
```

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50)
);
```

## Project Structure

```
IncidentManager2000/
├── src/
│   ├── main/
│   │   ├── java/poli/bsk/incidents/
│   │   │   ├── IncidentsApplication.java
│   │   │   ├── config/SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── IncidentController.java
│   │   │   │   └── UserController.java
│   │   │   ├── model/
│   │   │   │   ├── Incident.java
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   ├── IncidentRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── service/
│   │   │   │   ├── IncidentService.java
│   │   │   │   └── UserService.java
│   │   │   └── dto/
│   │   │       ├── IncidentDTO.java
│   │   │       └── UserDTO.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── incident_manager2000/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── IncidentForm.tsx
│   │   ├── IncidentList.tsx
│   │   └── IncidentCard.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
├── nginx/
│   └── nginx.conf
├── docker-compose.yaml
├── Dockerfile
├── pom.xml
└── README.md
```

## Configuration

### Spring Boot Application Properties
Located in `src/main/resources/application.properties`

### Environment Variables
For Docker deployment, configure in `docker-compose.yaml`:
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME`: Database user
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SERVER_PORT`: Application port (default 8080)

## Security

- CORS enabled for frontend communication
- CSRF protection disabled for API endpoints (enable with authentication)
- Password encryption using BCrypt
- Role-based access control (RBAC)
- Spring Security configuration for future OAuth2/Keycloak integration

## Development

### Build Backend
```bash
mvn clean package
```

### Run Tests
```bash
mvn test
```

### Lint Frontend
```bash
cd incident_manager2000
npm run lint
```

### Build Frontend
```bash
npm run build
```

## Future Enhancements

- [ ] OAuth2 integration with Keycloak
- [ ] JWT token authentication
- [ ] Advanced incident filtering and search
- [ ] File attachment support
- [ ] Email notifications
- [ ] Audit logging
- [ ] Dashboard analytics
- [ ] Incident templates
- [ ] Comments and collaboration
- [ ] Mobile app

## License

This project is part of the BSK (Bezpieczeństwo Systemów Komputerowych) course.

## Support

For issues or questions, please create an issue in the repository.
