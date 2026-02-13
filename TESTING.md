# Testing Guide

## Frontend Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register with valid credentials
- [ ] Register with duplicate email (shows error)
- [ ] Login with correct password
- [ ] Login with wrong password (shows error)
- [ ] Token persists on page refresh
- [ ] Logout clears session
- [ ] Redirects to login when not authenticated

#### Interview Creation
- [ ] Only interviewer can see "Create Room" button
- [ ] Create room generates unique ID
- [ ] Room appears in both users' dashboards
- [ ] Can view room details in dashboard

#### Video Communication
- [ ] Local video stream displays correctly
- [ ] Camera toggle works (on/off)
- [ ] Microphone toggle works (on/off)
- [ ] Remote video appears when both users connected
- [ ] Video quality adjusts to bandwidth
- [ ] No audio feedback/echo

#### Code Editor
- [ ] Code changes appear in real-time
- [ ] Code persists when switching tabs
- [ ] Language selection works
- [ ] Syntax highlighting works for all languages
- [ ] Code auto-saves every 5 seconds
- [ ] Multiple users see same code simultaneously

#### Interview Timer
- [ ] Timer starts when users join
- [ ] Timer displays in HH:MM:SS format
- [ ] Timer continues while typing/on video
- [ ] Timer syncs between users

#### Rating System
- [ ] Rating slider works (1-10)
- [ ] Can write feedback
- [ ] Submit stores rating in database
- [ ] Rating appears in history

#### Dashboard
- [ ] Shows all interviews for user
- [ ] Shows current interview status
- [ ] Can join active interviews
- [ ] Can see past ratings

### Automated Testing

Create test file: `frontend/src/__tests__/Login.test.jsx`

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import Login from '../pages/Login'

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />)
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  test('submits form with credentials', () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const submitButton = screen.getByText('Login')
    fireEvent.click(submitButton)
    
    // Assert API call made
  })
})
```

## Backend Testing

### Unit Tests

Create test file: `backend/__tests__/auth.test.js`

```javascript
import request from 'supertest'
import app from '../server.js'

describe('Auth Routes', () => {
  test('POST /api/auth/register - Should register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'candidate'
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user).toHaveProperty('email', 'test@example.com')
  })

  test('POST /api/auth/login - Should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })
})
```

### API Testing with Postman

1. Create Postman collection: `Interview Platform API`
2. Set environment variable: `{{base_url}}` = `http://localhost:5000`
3. Create requests:

```
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "interviewer"
}

POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

GET /api/interviews
Header: Authorization: Bearer {{token}}

POST /api/interviews/create-room
Header: Authorization: Bearer {{token}}

GET /api/interviews/room/{{roomId}}
Header: Authorization: Bearer {{token}}

PUT /api/interviews/{{roomId}}/code
Header: Authorization: Bearer {{token}}
{
  "code": "console.log('test');",
  "language": "javascript"
}

POST /api/interviews/{{roomId}}/rate
Header: Authorization: Bearer {{token}}
{
  "rating": 8,
  "feedback": "Great performance"
}
```

## Integration Testing

### Full User Flow Test

1. **Register as Interviewer**
   - Sign up with interviewer role
   - Verify email and password stored securely

2. **Create Interview Room**
   - Click "Create New Room"
   - Verify roomId generated
   - Verify room accessible via URL

3. **Register as Candidate**
   - In private/incognito window
   - Sign up with candidate role

4. **Candidate Joins Room**
   - Navigate to room URL
   - Verify connection established

5. **Video Communication**
   - Both cameras display
   - Audio works both ways
   - Toggle camera/mic independently

6. **Code Collaboration**
   - Type code in editor
   - Verify syncs to other user
   - Change language jointly
   - Code persists

7. **Complete Interview**
   - Interviewer ends interview
   - Interviewer rates candidate
   - Verify rating in database

## Performance Testing

### Load Test Code

```javascript
// backend/__tests__/load.test.js
import http from 'http'

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/interviews',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + TOKEN
  }
}

// Make 1000 requests
for (let i = 0; i < 1000; i++) {
  http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`)
  }).end()
}
```

### Metrics to Monitor
- Response time < 200ms
- CPU usage < 70%
- Memory usage < 500MB
- Database connections < 100

## Bug Report Template

```markdown
## Bug Report

### Description
Brief description of the bug

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Environment
- Browser: Chrome/Firefox/Safari
- OS: Windows/Mac/Linux
- Version: 1.0.0

### Screenshots/Videos
Attach any relevant media

### Console Errors
Paste any error messages from console
```

## Test Coverage Goals

- Authentication: 95%
- API Routes: 90%
- Socket handlers: 80%
- Frontend Components: 85%

## CI/CD Testing

Use GitHub Actions to run tests:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Generate coverage
        run: npm run coverage
```

---

**Keep testing and improving the application!**
