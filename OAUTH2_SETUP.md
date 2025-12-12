# OAuth2 & OpenID Connect Setup Guide

## Overview
This guide explains how to configure OAuth2 authentication with Keycloak and Microsoft for the Incident Manager platform.

## Backend Configuration

### Environment Variables

Set these environment variables before running the application:

#### Keycloak Configuration
```bash
KEYCLOAK_ISSUER_URI=http://localhost:8080/auth/realms/master
KEYCLOAK_CLIENT_ID=incident-manager
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_REDIRECT_URI=http://localhost:8082/login/oauth2/code/keycloak
```

#### Microsoft Configuration
```bash
MICROSOFT_CLIENT_ID=your-azure-app-id
MICROSOFT_CLIENT_SECRET=your-azure-app-secret
MICROSOFT_REDIRECT_URI=http://localhost:8082/login/oauth2/code/microsoft
```

#### Frontend Configuration
```bash
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8082/api
```

### Backend API Endpoints

- `GET /api/auth/user` - Get current authenticated user
- `GET /api/auth/providers` - Get available OAuth2 providers
- `GET /api/auth/login` - Get login URLs for providers
- `POST /api/auth/logout` - Logout the current user
- `GET /api/auth/success` - OAuth2 success callback

## Setting up Keycloak

### 1. Start Keycloak (already in docker-compose.yaml)

```bash
docker-compose up keycloak
```

### 2. Access Keycloak Admin Console

- URL: `http://localhost:8080`
- Initial admin credentials: admin/admin

### 3. Create a Client

1. Go to Clients
2. Create a new client: `incident-manager`
3. Set the following:
   - **Access Type**: Confidential
   - **Valid Redirect URIs**: 
     - `http://localhost:8082/login/oauth2/code/keycloak`
     - `http://localhost:3000/login`
     - `http://localhost:3000`
   - **Web Origins**: 
     - `http://localhost:3000`
     - `http://localhost:8082`

4. Go to the Credentials tab and copy the **Client Secret**

### 4. Create a Realm (Optional)

For production, create a separate realm instead of using "master":

1. Click "Add Realm"
2. Name it: `incident-manager`
3. Create a new client in this realm following the steps above

### 5. Create Test Users

1. Go to Users
2. Add a new user:
   - Username: `testuser`
   - Email: `test@example.com`
3. Set password in Credentials tab

## Setting up Microsoft Azure

### 1. Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Click "New registration"
4. Set Application name: `Incident Manager`
5. Select "Accounts in any organizational directory"

### 2. Configure Redirect URIs

1. In the app, go to Authentication
2. Add Platform: Web
3. Add Redirect URIs:
   - `http://localhost:8082/login/oauth2/code/microsoft`
   - `http://localhost:8082/login/oauth2/callback/microsoft`

### 3. Create Client Secret

1. Go to Certificates & secrets
2. Click "New client secret"
3. Copy the value (this is your `MICROSOFT_CLIENT_SECRET`)

### 4. Grant API Permissions

1. Go to API permissions
2. Add permissions:
   - `Microsoft Graph > User.Read`
   - `Microsoft Graph > email`
   - `Microsoft Graph > openid`
   - `Microsoft Graph > profile`

## Frontend Setup

### 1. Environment Variables

Create or update `.env.local` in `incident_manager2000/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8082/api
```

### 2. Login Page

The login page is automatically created at `/login`. Users can:
- Sign in with Keycloak
- Sign in with Microsoft
- Continue as guest (optional)

### 3. Authentication Context

The `AuthContext` provides:
- `user` - Current authenticated user info
- `isAuthenticated` - Boolean authentication status
- `isLoading` - Loading state
- `login(provider)` - Login function
- `logout()` - Logout function
- `fetchUser()` - Refresh user info

## Running the Application

### Development

```bash
# Backend
$env:SPRING_PROFILES_ACTIVE='dev'
$env:KEYCLOAK_CLIENT_SECRET='change-me'
./mvnw spring-boot:run

# Frontend (in incident_manager2000/)
npm run dev
```

### Production with Docker Compose

```bash
docker-compose up -d --build
```

Ensure environment variables are set in docker-compose.yaml or .env file.

## Testing the Authentication Flow

1. Start the backend and frontend
2. Go to `http://localhost:3000`
3. Click "Login"
4. Choose Keycloak or Microsoft
5. You'll be redirected to the provider's login
6. After login, you'll be redirected back to the application
7. Your user info will be displayed in the Navigation bar

## Troubleshooting

### CORS Issues
- Ensure `http://localhost:3000` is in the allowed origins
- Check that redirect URIs match exactly (no trailing slashes)

### Token Issues
- Verify the client secret is correct
- Check that the OAuth2 client is configured as "Confidential" (for Keycloak)

### Redirect URI Mismatch
- Ensure the redirect URI in your provider matches exactly
- Remove trailing slashes if present

### Missing User Attributes
- Ensure the user has email attribute set in the identity provider
- Check token scopes: `openid profile email`

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS**: Use HTTPS in production (configure with valid certificates)
3. **Token Storage**: Tokens are stored in HTTP-only cookies (more secure than localStorage)
4. **CORS**: Only allow trusted origins
5. **Redirect URIs**: Use exact matching, avoid wildcards

## Additional Resources

- [Spring Security OAuth2 Documentation](https://spring.io/projects/spring-security)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Specification](https://openid.net/specs/openid-connect-core-1_0.html)
