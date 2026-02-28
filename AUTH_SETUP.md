# Authentication System Documentation

## Overview
The HostelOps application now includes an environment variable-based authentication system for admin users. Students can log in directly without credentials, while admins must authenticate with username and password.

## Admin Credentials

**Username:** `admin`  
**Password:** `000`

> ⚠️ **Important:** Change these credentials in production. Update the `.env` file in the backend directory with secure values.

## How It Works

### Login Flow

#### Student Login
- Students click the "Student" tab
- No credentials required
- Direct login with `role: "student"`

#### Admin Login
- Admins click the "Admin" tab
- Enter username and password
- Credentials are sent to `/api/auth/admin` endpoint
- Server validates against environment variables
- On success: logs in with `role: "admin"`
- On failure: displays error message (generic for security)

### Backend Authentication Endpoint

**Route:** `POST /api/auth/admin`

**Request Body:**
```json
{
  "username": "admin",
  "password": "SecureAdmin2026!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "role": "admin"
}
```

**Failure Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Username and password are required"
}
```

## Security Features

1. **Environment Variables:** Credentials stored in `.env`, not in code
2. **Input Validation:** Both username and password are required
3. **Generic Error Messages:** Doesn't reveal if username or password is wrong
4. **Error Logging:** Server logs errors for diagnostics
5. **Try-Catch Blocks:** Handles unexpected errors gracefully

## Environment Variables

Located in `backend/.env`:

```env
MONGO_URI=mongodb://mongo:27017/testdb

# Admin Authentication Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SecureAdmin2026!
```

## Production Recommendations

1. **Change Default Credentials:**
   - Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`
   - Use strong, unique passwords

2. **Add Encryption:**
   - Consider bcrypt for password hashing
   - Use HTTPS for credential transmission

3. **Add Rate Limiting:**
   - Implement to prevent brute force attacks
   - Limit login attempts per IP

4. **Add Session/JWT:**
   - Consider JWT tokens for stateless authentication
   - Add token expiration logic

5. **Audit Logging:**
   - Log all authentication attempts
   - Track admin actions for compliance

## Testing

### Test Student Login
```
1. Go to login page
2. Click "Student" tab
3. Click "Continue"
4. Should be redirected to index.html with student role
```

### Test Admin Login
```
1. Go to login page
2. Click "Admin" tab
3. Enter username: admin
4. Enter password: SecureAdmin2026!
5. Click "Login"
6. Should be redirected to index.html with admin role
```

### Test Failed Authentication
```
1. Go to login page
2. Click "Admin" tab
3. Enter wrong credentials
4. Error message: "Invalid credentials"
5. Should remain on login page
```

## Frontend Components

- **[frontend/login.html](frontend/login.html)** - Tabbed login interface with admin form
- **[backend/server.js](backend/server.js)** - Authentication endpoint
- **[backend/.env](backend/.env)** - Environment variables with credentials

## API Usage Example

```javascript
async function adminLogin() {
  const response = await fetch('/api/auth/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      username: 'admin', 
      password: 'SecureAdmin2026!' 
    })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem("role", "admin");
    window.location.href = "index.html";
  }
}
```
