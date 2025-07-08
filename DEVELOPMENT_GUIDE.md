# Development Guide

## Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Project Architecture](#project-architecture)
3. [Component Development](#component-development)
4. [State Management](#state-management)
5. [Security Implementation](#security-implementation)
6. [Testing Strategy](#testing-strategy)
7. [Code Standards](#code-standards)
8. [Performance Optimization](#performance-optimization)
9. [Deployment Process](#deployment-process)
10. [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites
```bash
# Required software
Node.js >= 16.0.0
npm >= 8.0.0
Git >= 2.30.0
```

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd my-harm

# Install dependencies
npm install

# Start development server
npm start
```

### Development Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run eject      # Eject from Create React App
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

## Project Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Main navigation
│   ├── Sidebar.js      # Navigation sidebar
│   ├── AdminLoginModal.js      # Admin authentication
│   ├── AdminSessionIndicator.js # Session monitoring
│   └── AdminAccessLog.js       # Access logging
├── contexts/           # React contexts
│   ├── AuthContext.js  # Authentication state
│   └── ThemeContext.js # Theme management
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Dashboard.js    # Admin dashboard
│   ├── Articles.js     # Blog articles
│   ├── Contact.js      # Contact form
│   ├── Settings.js     # User settings
│   └── NotificationSettings.js # Notification preferences
├── services/           # API services
│   └── api.js          # HTTP client
├── App.js              # Main app component
└── index.js            # App entry point
```

### Backend Structure
```
backend/
├── middleware/         # Express middleware
│   └── auth.js         # Authentication middleware
├── routes/             # API routes
│   ├── articles.js     # Article endpoints
│   ├── public.js       # Public endpoints
│   └── users.js        # User endpoints
├── validations/        # Input validation
│   └── schemas.js      # Zod schemas
├── server.js           # Express server
└── package.json        # Backend dependencies
```

## Component Development

### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ComponentName = ({ prop1, prop2 }) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Hooks and effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // Render
  return (
    <div className="component-class">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Component Guidelines
- Use functional components with hooks
- Keep components focused and single-purpose
- Use descriptive prop names
- Implement proper error boundaries
- Add PropTypes for type checking

### Styling Approach
```javascript
// Use Tailwind CSS classes
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">
    Component Title
  </h2>
</div>

// Custom CSS for complex styles
import './ComponentName.css';
```

## State Management

### Context API Usage
```javascript
// Creating a context
const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [state, setState] = useState(initialValue);
  
  const value = {
    state,
    setState,
    // Other methods
  };
  
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

// Using a context
const { state, setState } = useMyContext();
```

### State Management Patterns
1. **Local State**: Use useState for component-specific state
2. **Global State**: Use Context API for app-wide state
3. **Form State**: Use controlled components or form libraries
4. **Server State**: Use custom hooks for API calls

### Admin State Management
```javascript
// Admin authentication state
const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
const [adminSessionExpiry, setAdminSessionExpiry] = useState(null);
const [adminAccessAttempts, setAdminAccessAttempts] = useState(0);
```

## Security Implementation

### Authentication Flow
```javascript
// 1. User triggers admin access (Ctrl+Shift+A)
// 2. Check if user has admin role
if (user?.role === 'admin') {
  // 3. Show login modal if not authenticated
  if (!isAdminAuthenticated) {
    setShowAdminModal(true);
  } else {
    // 4. Toggle admin mode if authenticated
    setAdminMode(!adminMode);
  }
}
```

### Session Management
```javascript
// Session creation
const adminSession = {
  authenticated: true,
  expiry: Date.now() + ADMIN_SESSION_TIMEOUT,
  timestamp: Date.now()
};
localStorage.setItem('adminSession', JSON.stringify(adminSession));

// Session validation
const checkAdminSession = () => {
  const sessionData = localStorage.getItem('adminSession');
  if (sessionData) {
    const session = JSON.parse(sessionData);
    return session.authenticated && session.expiry > Date.now();
  }
  return false;
};
```

### Brute Force Protection
```javascript
// Track failed attempts
const newAttempts = adminAccessAttempts + 1;
setAdminAccessAttempts(newAttempts);

// Lockout after 5 attempts
if (newAttempts >= 5) {
  const lockoutTime = Date.now() + (15 * 60 * 1000);
  setAdminLockoutUntil(lockoutTime);
}
```

### Access Logging
```javascript
// Log access attempts
const addLogEntry = (type, details) => {
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    type, // 'success', 'failed', 'lockout', 'logout'
    details,
    ip: '127.0.0.1',
    userAgent: navigator.userAgent
  };
  // Store in localStorage
};
```

## Testing Strategy

### Unit Testing
```javascript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

test('renders component correctly', () => {
  render(<ComponentName />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});

test('handles user interaction', () => {
  render(<ComponentName />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Updated Text')).toBeInTheDocument();
});
```

### Integration Testing
```javascript
// Admin authentication testing
test('admin authentication flow', async () => {
  render(<App />);
  
  // Trigger admin access
  fireEvent.keyDown(document, { 
    key: 'A', 
    ctrlKey: true, 
    shiftKey: true 
  });
  
  // Verify modal appears
  expect(screen.getByText('Admin Access')).toBeInTheDocument();
});
```

### Security Testing
```javascript
// Test brute force protection
test('locks out after 5 failed attempts', async () => {
  // Attempt 5 failed logins
  for (let i = 0; i < 5; i++) {
    await attemptFailedLogin();
  }
  
  // Verify lockout
  expect(screen.getByText('Access locked')).toBeInTheDocument();
});
```

## Code Standards

### ESLint Configuration
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error"
  }
}
```

### Naming Conventions
```javascript
// Components: PascalCase
const AdminLoginModal = () => {};

// Functions: camelCase
const handleAdminLogin = () => {};

// Constants: UPPER_SNAKE_CASE
const ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000;

// Files: kebab-case
// admin-login-modal.js
```

### Code Organization
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// 2. Component definition
const ComponentName = ({ props }) => {
  // 3. State declarations
  const [state, setState] = useState(initialValue);
  
  // 4. Hooks and effects
  useEffect(() => {}, []);
  
  // 5. Event handlers
  const handleEvent = () => {};
  
  // 6. Helper functions
  const helperFunction = () => {};
  
  // 7. Render
  return <div>Content</div>;
};

// 8. Export
export default ComponentName;
```

## Performance Optimization

### Code Splitting
```javascript
// Route-based splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Articles = React.lazy(() => import('./pages/Articles'));

// Component-based splitting
const AdminLoginModal = React.lazy(() => import('./components/AdminLoginModal'));
```

### Memoization
```javascript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### Bundle Optimization
```javascript
// Dynamic imports
const loadAdminFeatures = async () => {
  const { AdminDashboard } = await import('./admin/AdminDashboard');
  return AdminDashboard;
};
```

## Deployment Process

### Build Process
```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm test

# 3. Build for production
npm run build

# 4. Verify build
npm run serve
```

### Environment Configuration
```bash
# Development
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development

# Production
REACT_APP_API_URL=https://api.cyberscroll.com
REACT_APP_ENVIRONMENT=production
```

### Deployment Checklist
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Security features tested
- [ ] Performance optimized
- [ ] Error handling implemented

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### ESLint Warnings
```bash
# Fix automatically
npm run lint:fix

# Manual fixes
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {}, []);
```

#### Admin Access Issues
```javascript
// Check admin session
const sessionData = localStorage.getItem('adminSession');
console.log('Session:', sessionData);

// Clear admin session
localStorage.removeItem('adminSession');
```

#### Performance Issues
```javascript
// Profile component renders
const ComponentWithProfiler = () => (
  <Profiler id="ComponentName" onRender={callback}>
    <ComponentName />
  </Profiler>
);
```

### Debug Tools
- **React Developer Tools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API call monitoring
- **Console Logs**: Custom debugging

### Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

---

This development guide provides comprehensive documentation for all development processes, coding standards, and technical implementation details for the Cybersecurity Blog application. 