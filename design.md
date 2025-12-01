# Overview
*Menadżer incydentów bezpieczeństwa – narzędzie do rejestrowania, klasyfikowania i obsługi incydentów w systemach IT*

## Stack
* Java Spring Boot with Java 25
* MongoDB for object-oriented database
* Spring Security + Keycloak/Auth0/Azure AD for authenticating and security
* Frontend - TBD
* Spring Boot Actuator
* Rabbit MQ
* Spring Scheduler/Quartz for asynchronicity and scheduling
* NextJS

## Plan
**Monolithic application**

1. Login with company email (OAuth/Keycloak)
   1. Frontend (can be simple)
   2. Registration (handled by OAuth)
2. Main panel

## Application

### Authorization Component
Keycloak

### User Registration Component
Handled by OAuth
Role assigned

#### OAuth
Zewnętrzny serwis.
Frontend => external service => OAuth server returns Token => Session
And then:
Request => Authorization by OAuth

### Incident Registration component
Handles Regular Employee request

#### Incident object
id
title
description
reportedBy
reportedAt
status
**priority**
category
assignedTo
Resolution
ResolvedAt
Comments
**Attachments**

### Incident Classification component
Handles IT Employee request
Modifies the incident object

#### IT Employee View Of Every Incident (incident search component/navbar)
Allows IT Employee

### Incident Resolution component
???

## DB Design

## Roles
### Admin (admin of the application)
* Can add/remove users
* Can add/remove incidents
### Company Regular Employee
* Can Register an incident
  * Can Categorize and incident
* Can login
* Can log off
### Company IT Employee
* Can classify (what priority it is)
* Can resolve a ticket (incident)
* Can login
* Can log off