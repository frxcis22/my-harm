# Cybersecurity Blog - Francis Bockarie

A modern, secure cybersecurity blog platform built with React, featuring comprehensive admin security controls and professional content management.

## 🚀 Features

### Public Features
- **Blog Articles**: Professional cybersecurity content
- **Responsive Design**: Modern UI that works on all devices
- **Dark/Light Theme**: Toggle between themes
- **Contact Form**: Secure contact messaging system
- **Search Functionality**: Find articles and content quickly

### Admin Features (Secured)
- **Multi-Factor Authentication**: Email, password, and PIN required
- **Admin Dashboard**: Content management and analytics
- **Access Logging**: Monitor all admin access attempts
- **Session Management**: Secure 30-minute sessions with auto-extension
- **Brute Force Protection**: 5-attempt lockout system
- **Real-time Monitoring**: Session timers and status indicators

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **React Hot Toast**: User notifications

### Backend (Ready for Integration)
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **JWT**: Authentication tokens
- **MongoDB**: Database (configured but not connected)

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Webpack**: Module bundling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd my-harm
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Step 4: Build for Production
```bash
npm run build
```

## 🔐 Admin Access

### Authentication Credentials
- **Email**: `francis@cyberscroll.com`
- **Password**: `CyberScroll2024!`
- **PIN**: `1337`

### How to Access Admin Features

1. **Trigger Admin Access**
   - Press `Ctrl+Shift+A` (keyboard shortcut)
   - Or click the admin toggle button (🔒) in the header

2. **Authenticate**
   - Enter your admin credentials in the secure modal
   - Click "Access Admin Panel"

3. **Use Admin Features**
   - Admin dashboard becomes accessible
   - Notifications panel appears
   - Session timer shows remaining time

### Security Features
- **Session Timeout**: 30 minutes with auto-extension
- **Brute Force Protection**: 5 failed attempts = 15-minute lockout
- **Access Logging**: All attempts logged and monitored
- **Multi-Factor**: Email + Password + PIN required

## 📁 Project Structure

```
my-harm/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.js      # Main navigation header
│   │   ├── Sidebar.js     # Navigation sidebar
│   │   ├── AdminLoginModal.js    # Secure admin login
│   │   ├── AdminSessionIndicator.js  # Session status
│   │   └── AdminAccessLog.js     # Access monitoring
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.js # Authentication & admin state
│   │   └── ThemeContext.js # Theme management
│   ├── pages/             # Page components
│   │   ├── Home.js        # Landing page
│   │   ├── Dashboard.js   # Admin dashboard
│   │   ├── Articles.js    # Blog articles
│   │   ├── Contact.js     # Contact form
│   │   ├── Settings.js    # User settings
│   │   └── NotificationSettings.js # Notification preferences
│   ├── services/          # API services
│   │   └── api.js         # HTTP client
│   ├── App.js             # Main app component
│   └── index.js           # App entry point
├── backend/               # Backend API (ready for integration)
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## 🎨 UI Components

### Header Component
- **Search Bar**: Find articles and content
- **Notifications**: Admin-only notification panel
- **Admin Controls**: Secure admin toggle and logout
- **User Profile**: User information display

### Sidebar Component
- **Navigation**: Main site navigation
- **Admin Section**: Admin-only navigation items
- **Theme Toggle**: Dark/light mode switch

### Admin Components
- **AdminLoginModal**: Secure authentication interface
- **AdminSessionIndicator**: Real-time session status
- **AdminAccessLog**: Access attempt monitoring

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

### Tailwind Configuration
Customize the design system in `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        // Add custom colors
      }
    }
  },
  plugins: []
}
```

## 📊 Admin Dashboard Features

### Analytics
- **Article Statistics**: Views, likes, comments
- **Engagement Metrics**: Reader interaction data
- **Content Performance**: Top-performing articles

### Content Management
- **Article Editor**: Create and edit blog posts
- **Draft Management**: Save and manage drafts
- **Tag System**: Organize content with tags

### Security Monitoring
- **Access Logs**: Monitor admin access attempts
- **Session Tracking**: Real-time session status
- **Security Alerts**: Failed access notifications

## 🚀 Deployment

### Frontend Deployment
The application is configured for deployment on Render.com:

1. **Connect Repository**: Link your Git repository
2. **Build Command**: `npm run build`
3. **Publish Directory**: `build`
4. **Environment Variables**: Set production variables

### Backend Deployment
The backend is ready for deployment with:

1. **Database Setup**: Configure MongoDB connection
2. **Environment Variables**: Set production credentials
3. **API Endpoints**: Configure CORS and security

## 🔒 Security Considerations

### Production Security
- [ ] Hash admin credentials
- [ ] Encrypt session data
- [ ] Implement server-side validation
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Set up secure logging
- [ ] Configure IP restrictions

### Current Security Features
- ✅ Multi-factor authentication
- ✅ Session management
- ✅ Brute force protection
- ✅ Access logging
- ✅ Secure admin interface

## 🐛 Troubleshooting

### Common Issues

#### Admin Access Problems
- **"Access locked"**: Wait 15 minutes after 5 failed attempts
- **"Session expired"**: Re-authenticate with Ctrl+Shift+A
- **Admin features not showing**: Verify authentication and admin mode

#### Development Issues
- **Port conflicts**: Change port in package.json scripts
- **Build errors**: Clear node_modules and reinstall
- **Hot reload issues**: Restart development server

### Performance Optimization
- **Code Splitting**: Implement React.lazy for route-based splitting
- **Image Optimization**: Use WebP format and lazy loading
- **Bundle Analysis**: Use webpack-bundle-analyzer
- **Caching**: Implement service workers for offline support

## 📝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards
- Follow ESLint configuration
- Use meaningful commit messages
- Add comments for complex logic
- Test all admin security features

## 📄 License

This project is proprietary software owned by Francis Bockarie.

## 🤝 Support

For technical support or questions:
- **Email**: francis@cyberscroll.com
- **Documentation**: See `ADMIN_SECURITY.md` for detailed admin features
- **Issues**: Create an issue in the repository

---

**Built with ❤️ by Francis Bockarie - Cybersecurity Professional**