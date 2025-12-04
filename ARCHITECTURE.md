# Incident Manager 2000 - Architecture & Design

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React 19 + TypeScript)        │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │  Dashboard   │  │  Create Form │  │  Navigation  │  │  │
│  │  │   Page       │  │  Component   │  │  Bar         │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │                                                          │  │
│  │  Components: IncidentCard, IncidentList, IncidentForm  │  │
│  │  State Management: React Hooks (useState, useEffect)   │  │
│  │  Styling: Tailwind CSS (Responsive + Dark Mode)        │  │
│  │                                                          │  │
│  │  ┌───────────────────────────────────────────────────┐ │  │
│  │  │          API Client (lib/api.ts)                │ │  │
│  │  │   incidentAPI │ userAPI                          │ │  │
│  │  └───────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                         HTTP/REST                               │
│                              ↓                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER (Nginx)                          │
├─────────────────────────────────────────────────────────────────┤
│  Reverse Proxy: Routing, Load Balancing, SSL Termination        │
│  Port 80/443 → Backend Port 8080                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP/REST (Internal)
                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (Spring Boot)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              REST Controllers (Layer 1)                  │  │
│  │                                                          │  │
│  │  ┌─────────────────┐      ┌─────────────────┐          │  │
│  │  │ IncidentCtrl    │      │ UserCtrl        │          │  │
│  │  │  - GET          │      │  - GET          │          │  │
│  │  │  - POST         │      │  - POST         │          │  │
│  │  │  - PUT          │      │  - PUT          │          │  │
│  │  │  - DELETE       │      │  - DELETE       │          │  │
│  │  └─────────────────┘      └─────────────────┘          │  │
│  │                                                          │  │
│  │  Features:                                               │  │
│  │  - Cross-Origin Resource Sharing (CORS)                 │  │
│  │  - Error Handling & Validation                           │  │
│  │  - HTTP Status Codes (200, 201, 404, 400, 500)          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ↓                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             Business Logic Layer (Services)              │  │
│  │                                                          │  │
│  │  ┌─────────────────┐      ┌─────────────────┐          │  │
│  │  │ IncidentService │      │ UserService     │          │  │
│  │  │                 │      │                 │          │  │
│  │  │ - Create        │      │ - Create        │          │  │
│  │  │ - Read (All)    │      │ - Read (All)    │          │  │
│  │  │ - Read (Filter) │      │ - Read (Filter) │          │  │
│  │  │ - Update        │      │ - Update        │          │  │
│  │  │ - Delete        │      │ - Delete        │          │  │
│  │  │                 │      │                 │          │  │
│  │  │ Features:       │      │ Features:       │          │  │
│  │  │ - Status Flow   │      │ - Email Lookup  │          │  │
│  │  │ - DTO Convert   │      │ - Role Filter   │          │  │
│  │  │ - Timestamps    │      │ - Password Hash │          │  │
│  │  │ - Assignments   │      │                 │          │  │
│  │  └─────────────────┘      └─────────────────┘          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ↓                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Data Access Layer (Repositories)               │  │
│  │                                                          │  │
│  │  ┌──────────────────┐    ┌──────────────────┐          │  │
│  │  │ IncidentRepo     │    │ UserRepo         │          │  │
│  │  │  (JPA)           │    │  (JPA)           │          │  │
│  │  │                  │    │                  │          │  │
│  │  │ - findAll()      │    │ - findAll()      │          │  │
│  │  │ - findById()     │    │ - findById()     │          │  │
│  │  │ - save()         │    │ - findByEmail()  │          │  │
│  │  │ - delete()       │    │ - findByRole()   │          │  │
│  │  │ - findByStatus() │    │ - save()         │          │  │
│  │  │ - findByPriority │    │ - delete()       │          │  │
│  │  └──────────────────┘    └──────────────────┘          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ↓                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Security Configuration                     │  │
│  │                                                          │  │
│  │  - Spring Security enabled                              │  │
│  │  - CORS configured                                      │  │
│  │  - CSRF protection                                      │  │
│  │  - Password Encoder (BCrypt)                            │  │
│  │  - Role-Based Access Control (RBAC)                     │  │
│  │                                                          │  │
│  │  Roles:                                                  │  │
│  │  ├─ ADMIN: Full access                                  │  │
│  │  ├─ IT_EMPLOYEE: Manage incidents                       │  │
│  │  └─ EMPLOYEE: Report incidents                          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                         JDBC/SQL
                              ↓

┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                        │  │
│  │                                                          │  │
│  │  ┌─────────────────┐      ┌─────────────────┐          │  │
│  │  │   incidents     │      │      users      │          │  │
│  │  │   Table         │      │      Table      │          │  │
│  │  │                 │      │                 │          │  │
│  │  │ - id (PK)       │      │ - id (PK)       │          │  │
│  │  │ - title         │      │ - email (UQ)    │          │  │
│  │  │ - description   │      │ - name          │          │  │
│  │  │ - status        │      │ - role          │          │  │
│  │  │ - priority      │      │                 │          │  │
│  │  │ - category      │      │ One-to-Many:    │          │  │
│  │  │ - reportedBy    │      │ User → Incident │          │  │
│  │  │ - assignedTo    │      │ (through email) │          │  │
│  │  │ - reportedAt    │      │                 │          │  │
│  │  │ - resolvedAt    │      │ Indexes on:     │          │  │
│  │  │ - comments[]    │      │ - email         │          │  │
│  │  │ - attachments[] │      │ - role          │          │  │
│  │  │                 │      │                 │          │  │
│  │  │ Indexes on:     │      │                 │          │  │
│  │  │ - status        │      │                 │          │  │
│  │  │ - priority      │      │                 │          │  │
│  │  │ - reportedBy    │      │                 │          │  │
│  │  │ - assignedTo    │      │                 │          │  │
│  │  └─────────────────┘      └─────────────────┘          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Docker Container: postgresql:latest                            │
│  Port: 5432                                                     │
│  Volume: PostgreSQL data persistence                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Create Incident Flow

```
┌────────────────────┐
│  User fills form   │ (Frontend Component: IncidentForm)
└────────────────────┘
         │
         ↓
┌────────────────────┐
│  Submit Form       │ (React onClick handler)
└────────────────────┘
         │
         ↓
┌────────────────────┐
│  API Call          │ (incidentAPI.create(data))
│  POST /api/        │ 
│  incidents         │
└────────────────────┘
         │
    HTTP POST
         │
         ↓
┌────────────────────┐
│  IncidentController│ (Spring REST Endpoint)
│  .createIncident() │
└────────────────────┘
         │
         ↓
┌────────────────────┐
│  IncidentService   │ (Business Logic)
│  .createIncident() │
│  - Set timestamp   │
│  - Set status=OPEN│
│  - Convert to DTO  │
└────────────────────┘
         │
         ↓
┌────────────────────┐
│  IncidentRepository│ (JPA)
│  .save(entity)     │
└────────────────────┘
         │
    JDBC SQL INSERT
         │
         ↓
┌────────────────────┐
│  PostgreSQL        │
│  INSERT INTO       │
│  incidents (...)   │
│  VALUES (...)      │
└────────────────────┘
         │
         ↓
┌────────────────────┐
│  Response 201      │ (HTTP Status Created)
│  IncidentDTO       │ (JSON Response)
└────────────────────┘
         │
    HTTP Response
         │
         ↓
┌────────────────────┐
│  Frontend State    │ (React setState)
│  Update List       │
│  Show Success Msg  │
└────────────────────┘
```

## Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────┐
│                    INCIDENT                          │
├──────────────────────────────────────────────────────┤
│ Primary Key:                                         │
│   • id (BIGSERIAL)                                   │
│                                                      │
│ Attributes:                                          │
│   • title (VARCHAR 255)                              │
│   • description (TEXT)                               │
│   • status (VARCHAR 50) → ENUM-like                  │
│   • priority (VARCHAR 50) → ENUM-like                │
│   • category (VARCHAR 100)                           │
│   • reportedAt (TIMESTAMP)                           │
│   • resolvedAt (TIMESTAMP) → Nullable                │
│   • resolution (TEXT) → Nullable                     │
│   • comments (TEXT[]) → Array of strings             │
│   • attachments (TEXT[]) → Array of URLs             │
│                                                      │
│ Foreign Keys:                                        │
│   • reportedBy (VARCHAR 255) ──┐                     │
│   • assignedTo (VARCHAR 255) ──┤─ References Users   │
└──────────────────────────────────┼──────────────────┘
                                   │
                    ┌──────────────┴─────────────┐
                    │ Many-to-One Relationship   │
                    │ (Email matching)           │
                    │                             │
                    ↓                             │
┌──────────────────────────────────────────────┐ │
│              USER                            │ │
├──────────────────────────────────────────────┤ │
│ Primary Key:                                 │ │
│   • id (BIGSERIAL)                           │ │
│                                              │ │
│ Attributes:                                  │ │
│   • email (VARCHAR 255) UNIQUE               │ │
│   • name (VARCHAR 255)                       │ │
│   • role (VARCHAR 50)                        │ │
│     ├─ ADMIN                                 │ │
│     ├─ EMPLOYEE                              │ │
│     └─ IT_EMPLOYEE                           │ │
│                                              │ │
│ Relations:                                   │ │
│   • One user can report many incidents ◄────┘ │
│   • One user can be assigned many incidents ◄─┘
└──────────────────────────────────────────────┘
```

## API Communication Model

```
REQUEST
────────────────────────────────────

HTTP Method: POST
Path: /api/incidents
Content-Type: application/json
CORS: Allowed from http://localhost:3000

Body:
{
  "title": "Security Issue",
  "description": "Detailed description",
  "reportedBy": "user@example.com",
  "category": "Malware",
  "priority": "HIGH",
  "comments": [],
  "attachments": []
}

RESPONSE
────────────────────────────────────

Status: 201 Created
Content-Type: application/json

Body:
{
  "id": 1,
  "title": "Security Issue",
  "description": "Detailed description",
  "reportedBy": "user@example.com",
  "reportedAt": "2024-12-04T10:30:00Z",
  "category": "Malware",
  "priority": "HIGH",
  "status": "OPEN",
  "assignedTo": null,
  "resolution": null,
  "resolvedAt": null,
  "comments": [],
  "attachments": []
}
```

## Component Hierarchy

```
Frontend Components Tree:
───────────────────────

HomePage (page.tsx)
├── Navigation.tsx
│   └── Branding + Navigation Links
├── IncidentForm.tsx (Conditional)
│   ├── Title Input
│   ├── Description TextArea
│   ├── Reporter Email Input
│   ├── Category Select
│   ├── Priority Select
│   └── Submit Button
├── Filter Buttons
│   ├── All
│   ├── Open
│   └── Resolved
└── IncidentList.tsx
    └── IncidentCard.tsx (Repeating)
        ├── Title & ID Badge
        ├── Description
        ├── Status Badge
        ├── Priority Indicator
        ├── Category Display
        ├── Reporter Display
        ├── Date Display
        ├── Status Dropdown
        └── Delete Button
```

## Deployment Architecture

```
┌───────────────────────────────────────────────┐
│         Docker Compose Orchestration          │
├───────────────────────────────────────────────┤
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ nginx (Reverse Proxy)                   │ │
│  │ Port: 80, 443                           │ │
│  │ Container: nginx:latest                 │ │
│  │ Routes:                                 │ │
│  │  • / → incident-manager:3000 (Next.js) │ │
│  │  • /api → incident-manager:8080        │ │
│  └─────────────────────────────────────────┘ │
│           │                      │            │
│           ↓                      ↓            │
│  ┌────────────────┐   ┌────────────────────┐ │
│  │ incident-      │   │ PostgreSQL         │ │
│  │ manager        │   │ Database           │ │
│  │ (Spring Boot)  │   │ Port: 5432         │ │
│  │ Port: 8080     │   │ Container:         │ │
│  │ Container:     │   │  postgres:latest   │ │
│  │ Custom Image   │   │                    │ │
│  │ (from Dockerfile)  │ Volumes:           │ │
│  │                │   │  postgresql:/...   │ │
│  │ Environment:   │   │                    │ │
│  │ - DATASOURCE_  │   │ Environment:       │ │
│  │   URL          │   │ - POSTGRES_USER    │ │
│  │ - USERNAME     │   │ - POSTGRES_PASSWORD│ │
│  │ - PASSWORD     │   │ - POSTGRES_DB      │ │
│  │                │   │                    │ │
│  │ Networks:      │   │ Networks:          │ │
│  │ - backend-net  │   │ - db-net           │ │
│  │                │   │                    │ │
│  └────────────────┘   └────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ pgAdmin (Database Management)           │ │
│  │ Port: 5050                              │ │
│  │ Container: dpage/pgadmin4:latest        │ │
│  │ Access: http://localhost:5050           │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Networks:                                    │
│  ├─ backend-net: nginx ↔ Spring Boot        │ │
│  ├─ gui-net: nginx ↔ Frontend                │ │
│  └─ db-net: Spring Boot ↔ PostgreSQL        │ │
│                                               │
│  Volumes:                                     │
│  └─ postgresql: Database persistence        │ │
│                                               │
└───────────────────────────────────────────────┘
```

## Incident Status Workflow

```
┌───────────┐
│   OPEN    │ (Initial state when reported)
└─────┬─────┘
      │ (IT staff starts working)
      ↓
┌──────────────┐
│ IN_PROGRESS  │ (Actively investigating/resolving)
└─────┬────────┘
      │ (Resolution implemented)
      ↓
┌──────────────┐
│  RESOLVED    │ (Issue fixed, awaiting confirmation)
└─────┬────────┘
      │ (Confirmed resolved)
      ↓
┌──────────────┐
│   CLOSED     │ (Final state, archived)
└──────────────┘
```

---

This architecture ensures:
✅ Separation of concerns (MVC/Layered)
✅ Scalability (Containerized, Load-balanceable)
✅ Maintainability (Clear component boundaries)
✅ Security (Reverse proxy, CORS, Auth-ready)
✅ Data integrity (Transaction support, FK constraints)
