# Security Documentation

## Overview
JobNest has been built with security best practices in mind to protect user data and ensure safe operations.

## Authentication & Authorization

### JWT (JSON Web Tokens)
- Tokens expire after 7 days
- Tokens are signed with a strong secret key
- Token validation includes checking for expiration and signature

### Password Security
- **Minimum Requirements**:
  - At least 8 characters
  - Contains uppercase letters (A-Z)
  - Contains lowercase letters (a-z)
  - Contains numbers (0-9)

- **Hashing**: Passwords are hashed using bcryptjs with 10 salt rounds
- **Storage**: Only hashed passwords are stored in the database
- **Transmission**: Always use HTTPS in production

### User Input Validation

#### Registration
- Name: Minimum 2 characters
- Email: Valid email format validation
- Password: Strong password requirements (see above)
- Prevents duplicate email registrations

#### Job Creation/Update
- Company: Required, minimum 2 characters
- Role: Required, minimum 2 characters
- Status: Enum validation (applied, shortlisted, interview, offer, rejected)
- All string inputs are trimmed and validated

#### Database IDs
- MongoDB ObjectId format validation on all API routes
- Prevents invalid ID injection attacks

## API Security

### CORS (Cross-Origin Resource Sharing)
```javascript
corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
```

### Protected Routes
- All job-related endpoints require authentication
- User profile endpoint requires authentication
- Token validation happens on every protected request

### Error Handling
- Sensitive error details are not exposed to clients
- Server-side logging for debugging (console.error)
- Proper HTTP status codes:
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (authentication issues)
  - 404: Not Found
  - 409: Conflict (duplicate email registration)
  - 500: Server Error

## Data Protection

### Access Control
- Users can only access their own jobs
- Database queries filter by user ID
- No cross-user data exposure

### Sensitive Data
- Passwords are never returned in API responses
- Error messages don't reveal system internals
- Logs are separated from user responses

## Environment Variables

**Development (.env)**:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb_connection_string
JWT_SECRET=development_secret
CLIENT_URL=http://localhost:5173
```

**Production (.env.production)**:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=production_mongodb_string
JWT_SECRET=strong_random_generated_secret
CLIENT_URL=https://yourdomain.com
```

**Important**: Never commit .env files to version control

## Security Best Practices

### For Deployment
1. ✅ Use HTTPS/SSL certificates
2. ✅ Set strong JWT_SECRET (use `crypto.randomBytes(32).toString('hex')`)
3. ✅ Keep MongoDB URI confidential
4. ✅ Set NODE_ENV=production
5. ✅ Use environment variables for all sensitive config
6. ✅ Enable CORS only for known domains
7. ✅ Implement rate limiting (recommended)
8. ✅ Monitor logs for suspicious activity
9. ✅ Regularly update dependencies
10. ✅ Use security headers middleware

### Client-Side Security
- ✅ Error boundary catches React errors
- ✅ Token stored in localStorage (consider upgrading to secure cookies)
- ✅ Logout clears user context
- ✅ Protected routes prevent unauthorized access

## Known Limitations & Future Improvements

### Current Limitations
- No email verification for registration
- No password reset functionality
- No rate limiting on API endpoints
- No audit logging of user actions
- No 2FA (two-factor authentication)

### Recommended Enhancements
1. Add email verification on registration
2. Implement password reset via email
3. Add rate limiting (express-rate-limit)
4. Implement comprehensive audit logging
5. Add 2FA support
6. Use secure HTTP-only cookies for tokens
7. Add CSRF protection
8. Implement helmet.js for security headers
9. Add request validation middleware
10. Add monitoring and alerting

## Reporting Security Issues

If you discover a security vulnerability, please email security@jobnest.com or create a private security advisory on GitHub.

**Please do not** publicly disclose security vulnerabilities before giving the maintainers time to fix them.

## Compliance

JobNest aims to comply with:
- GDPR (General Data Protection Regulation) - in implementation
- CCPA (California Consumer Privacy Act) - in implementation
- Standard web security best practices

## Testing Security

### Manual Testing Checklist
- [ ] Test registration with weak passwords
- [ ] Test login with invalid credentials
- [ ] Test accessing protected routes without token
- [ ] Test accessing other user's jobs
- [ ] Test SQLi/NoSQLi injection attempts
- [ ] Test XSS with special characters in inputs
- [ ] Test CORS with unauthorized origins

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
