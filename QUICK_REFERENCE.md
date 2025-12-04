# Quick Reference Guide

## 🚀 Getting Started (30 seconds)

### Option 1: Local Development (Recommended)

**Terminal 1 - Backend:**
```bash
# From project root
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd incident_manager2000
npm install
npm run dev
```

Open: http://localhost:3000

### Option 2: Docker (Full Stack)

```bash
docker-compose up
```

Open: http://localhost:3000

---

## 📊 Quick API Tests

### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","name":"Test","role":"EMPLOYEE"}'
```

### Create Incident
```bash
curl -X POST http://localhost:8080/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Security Issue",
    "description":"Found malware",
    "reportedBy":"user@test.com",
    "category":"Malware",
    "priority":"HIGH"
  }'
```

### Get All Incidents
```bash
curl http://localhost:8080/api/incidents | json_pp
```

### Update Incident Status
```bash
curl -X PUT http://localhost:8080/api/incidents/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

---

## 🗂️ Project Structure at a Glance

### Backend (Spring Boot)
```
src/main/java/poli/bsk/incidents/
├── controller/     → REST API endpoints
├── service/        → Business logic
├── model/          → Data entities
├── repository/     → Database queries
├── dto/            → Data transfer objects
└── config/         → Configuration
```

### Frontend (Next.js)
```
incident_manager2000/
├── app/            → Pages and routing
├── components/     → React components
├── lib/            → API client & types
└── public/         → Static files
```

---

## 🔑 Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/incidents` | List all incidents |
| POST | `/api/incidents` | Create incident |
| GET | `/api/incidents/{id}` | Get incident detail |
| PUT | `/api/incidents/{id}` | Update incident |
| DELETE | `/api/incidents/{id}` | Delete incident |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |

---

## 📝 Frontend Features

✅ Dashboard with real-time incident list
✅ Create new incident form
✅ Status filtering (All, Open, Resolved)
✅ Update incident status
✅ Delete incidents
✅ Responsive design
✅ Dark mode support

---

## 🗄️ Database Schema

### Incidents
- `id` - Primary key
- `title` - Incident title
- `description` - Details
- `status` - OPEN, IN_PROGRESS, RESOLVED, CLOSED
- `priority` - LOW, MEDIUM, HIGH, CRITICAL
- `category` - Type of incident
- `reportedBy` - Email of reporter
- `assignedTo` - Assigned IT staff
- `reportedAt` - Creation timestamp
- `resolvedAt` - Resolution timestamp

### Users
- `id` - Primary key
- `email` - Email address
- `name` - Full name
- `role` - ADMIN, EMPLOYEE, IT_EMPLOYEE

---

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Or use Docker
docker-compose up postgresql
```

### Frontend Won't Start
```bash
cd incident_manager2000
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 Documentation

- **PLATFORM_README.md** - Full API documentation & architecture
- **DEVELOPMENT.md** - Setup guide & troubleshooting
- **COMPLETION_SUMMARY.md** - What was built

---

## 🎯 Incident Workflow

```
1. Employee reports incident (Frontend form)
   ↓
2. Incident created in database (Backend)
   ↓
3. IT Staff views on dashboard
   ↓
4. IT Staff assigns priority & category
   ↓
5. IT Staff marks as IN_PROGRESS
   ↓
6. IT Staff resolves and marks RESOLVED
   ↓
7. Admin closes incident
```

---

## 🛠️ Technology Stack

```
Frontend:      Next.js + React + TypeScript + Tailwind CSS
Backend:       Spring Boot + Java 25 + Spring Security
Database:      PostgreSQL
DevOps:        Docker + Docker Compose + Nginx
Build:         Maven (backend) + npm (frontend)
```

---

## 📞 Support

For issues:
1. Check DEVELOPMENT.md troubleshooting section
2. Review PLATFORM_README.md for API details
3. Check application logs:
   ```bash
   # Backend logs
   docker-compose logs incident-manager
   
   # Frontend logs (console in browser)
   ```

---

## ✅ Checklist for First Run

- [ ] Java 25+ installed
- [ ] Node.js 18+ installed
- [ ] PostgreSQL running
- [ ] Backend started (`mvn spring-boot:run`)
- [ ] Frontend started (`npm run dev`)
- [ ] Accessed http://localhost:3000
- [ ] Created test user via API
- [ ] Created test incident via dashboard
- [ ] Updated incident status
- [ ] Deleted test incident

---

## 🎓 Learning Resources

- Spring Boot: https://spring.io/
- Next.js: https://nextjs.org/
- PostgreSQL: https://www.postgresql.org/
- Docker: https://www.docker.com/

---

**Last Updated:** December 4, 2025
**Version:** 1.0.0
