# Incident Manager 2000 - Development Setup Guide

## Quick Start (Local Development)

### 1. Backend Setup (Spring Boot)

**Prerequisites:**
- Java 25 or higher
- Maven 3.8+
- PostgreSQL 15+

**Steps:**

1. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE incidentsdb;
CREATE USER debiluser WITH PASSWORD 'debil';
ALTER ROLE debiluser SET client_encoding TO 'utf8';
ALTER ROLE debiluser SET default_transaction_isolation TO 'read committed';
ALTER ROLE debiluser SET default_transaction_deferrable TO on;
ALTER ROLE debiluser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE incidentsdb TO debiluser;
\q
```

2. Verify `src/main/resources/application.properties`:
```properties
spring.application.name=incidents
spring.datasource.url=jdbc:postgresql://localhost:5432/incidentsdb
spring.datasource.username=debiluser
spring.datasource.password=debil
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
server.port=8080
```

3. Build and run:
```bash
# From project root
mvn clean install
mvn spring-boot:run
```

Backend will be available at: **http://localhost:8080**
API will be at: **http://localhost:8080/api**

### 2. Frontend Setup (Next.js)

**Prerequisites:**
- Node.js 18.17+
- npm or yarn

**Steps:**

1. Navigate to frontend:
```bash
cd incident_manager2000
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 3. Docker Compose Setup (Full Stack)

**Prerequisites:**
- Docker
- Docker Compose

**Steps:**

1. From project root:
```bash
docker-compose up --build
```

**Services:**
- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- Nginx Proxy: http://localhost:80
- pgAdmin: http://localhost:5050
- PostgreSQL: localhost:5432

**Docker Compose Services:**
- `nginx` - Reverse proxy
- `incident-manager` - Spring Boot backend
- `postgresql` - Database
- `pgadmin` - Database UI

To stop:
```bash
docker-compose down
```

To clean up volumes:
```bash
docker-compose down -v
```

## Testing the Application

### 1. Create a Test User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "role": "EMPLOYEE"
  }'
```

### 2. Create a Test Incident
```bash
curl -X POST http://localhost:8080/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Incident",
    "description": "This is a test incident",
    "reportedBy": "test@example.com",
    "category": "Malware",
    "priority": "HIGH"
  }'
```

### 3. Get All Incidents
```bash
curl http://localhost:8080/api/incidents
```

### 4. Access Frontend Dashboard
Open browser to: http://localhost:3000

## Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find and kill process using port 8080
lsof -i :8080
kill -9 <PID>
```

**Database connection error:**
- Verify PostgreSQL is running
- Check credentials in application.properties
- Ensure database exists: `psql -U postgres -l`

**Build failures:**
```bash
# Clean Maven cache
mvn clean
# Rebuild
mvn install
```

### Frontend Issues

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Docker Issues

**Containers won't start:**
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild images
docker-compose up --build --force-recreate
```

**Database permissions error:**
```bash
# Remove and recreate database volume
docker-compose down -v
docker-compose up
```

## Development Workflow

### Making Backend Changes

1. Edit Java files in `src/main/java`
2. Spring Boot devtools will auto-reload
3. Or manually rebuild:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Making Frontend Changes

1. Edit `.tsx` files in `incident_manager2000/`
2. Next.js will hot-reload automatically
3. Check http://localhost:3000

### Database Changes

1. Modify model classes (e.g., `Incident.java`)
2. Spring Boot will auto-migrate if `ddl-auto=update`
3. For manual migration, use Flyway or Liquibase

## Database Management

### Using pgAdmin (Docker)

1. Access http://localhost:5050
2. Login credentials from `docker-compose.yaml`
3. Add server:
   - Host: postgresql
   - Port: 5432
   - Username: bsk
   - Password: bsk

### Direct PostgreSQL Access

```bash
# Connect to database
psql -h localhost -U debiluser -d incidentsdb

# List tables
\dt

# View incident data
SELECT * FROM incidents;

# View user data
SELECT * FROM users;
```

## Useful Commands

### Maven
```bash
# Clean and build
mvn clean install

# Skip tests
mvn clean install -DskipTests

# Run specific test
mvn test -Dtest=IncidentsApplicationTests

# Build JAR
mvn package
```

### npm
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build production
npm run build

# Start production build
npm start

# Lint code
npm run lint
```

### Docker Compose
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## IDE Setup

### IntelliJ IDEA
1. Open project folder
2. Mark `src/main/java` as Sources Root
3. Mark `src/test/java` as Test Sources Root
4. Install plugins: Lombok, Spring Boot

### VS Code
1. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Tailwind CSS IntelliSense
   - ESLint
   - Thunder Client (for API testing)

## Environment Variables

Create `.env` file for Docker:
```env
# Database
POSTGRES_USER=bsk
POSTGRES_PASSWORD=bsk
POSTGRES_DB=incident-manager

# Spring Boot
SPRING_DATASOURCE_URL=jdbc:postgresql://postgresql:5432/incident-manager
SPRING_DATASOURCE_USERNAME=bsk
SPRING_DATASOURCE_PASSWORD=bsk
SERVER_PORT=8080

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Next Steps

After setup is complete:
1. Access frontend at http://localhost:3000
2. Create a test user via API
3. Create test incidents via the UI
4. Test incident status updates
5. Explore the dashboard features

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
