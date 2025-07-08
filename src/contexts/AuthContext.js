import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user] = useState({
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Francis Bockarie',
    email: 'francis@cyberscroll.com',
    jobTitle: 'IT Security Professional',
    organization: 'CyberScroll Security',
    bio: 'Cybersecurity professional with expertise in threat intelligence, incident response, and security architecture.',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Secure admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminSessionExpiry, setAdminSessionExpiry] = useState(null);
  const [adminAccessAttempts, setAdminAccessAttempts] = useState(0);
  const [adminLockoutUntil, setAdminLockoutUntil] = useState(null);

  // Admin credentials (in a real app, this would be hashed and stored securely)
  const ADMIN_CREDENTIALS = {
    email: 'francis@cyberscroll.com',
    password: 'CyberScroll2024!', // This should be hashed in production
    pin: '1337' // Additional security layer
  };

  // Admin session timeout (30 minutes)
  const ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000;

  // Always authenticated in public mode
  useEffect(() => {
    setLoading(false);
    setIsAuthenticated(true);
  }, []);

  // Check admin session expiry
  useEffect(() => {
    if (adminSessionExpiry && Date.now() > adminSessionExpiry) {
      logoutAdmin();
    }
  }, [adminSessionExpiry]);

  // Check admin lockout
  useEffect(() => {
    if (adminLockoutUntil && Date.now() > adminLockoutUntil) {
      setAdminLockoutUntil(null);
      setAdminAccessAttempts(0);
    }
  }, [adminLockoutUntil]);

  const login = async (credentials) => {
    // No-op in public mode
    toast.success('Already logged in (public mode)');
    return { user, token: 'public-mode' };
  };

  const logout = async () => {
    // No-op in public mode
    toast.success('Logout disabled in public mode');
  };

  const sendCode = async (email) => {
    // No-op in public mode
    toast.success('Authentication disabled in public mode');
    return { message: 'Public mode - no authentication required' };
  };

  const updateProfile = async (profileData) => {
    // No-op in public mode
    toast.error('Profile updates disabled in public mode');
    throw new Error('Profile updates not available in public mode');
  };

  const refreshToken = async () => {
    // No-op in public mode
    return { token: 'public-mode' };
  };

  // Secure admin authentication
  const authenticateAdmin = async (credentials) => {
    // Check if admin is locked out
    if (adminLockoutUntil && Date.now() < adminLockoutUntil) {
      const remainingTime = Math.ceil((adminLockoutUntil - Date.now()) / 1000 / 60);
      toast.error(`Admin access locked. Try again in ${remainingTime} minutes.`);
      
      // Log lockout attempt
      if (window.addAdminLogEntry) {
        window.addAdminLogEntry('lockout', `Admin access attempt while locked out. Remaining time: ${remainingTime} minutes`);
      }
      
      return false;
    }

    // Verify admin credentials
    const isValidEmail = credentials.email === ADMIN_CREDENTIALS.email;
    const isValidPassword = credentials.password === ADMIN_CREDENTIALS.password;
    const isValidPin = credentials.pin === ADMIN_CREDENTIALS.pin;

    if (isValidEmail && isValidPassword && isValidPin) {
      // Successful authentication
      setIsAdminAuthenticated(true);
      setAdminSessionExpiry(Date.now() + ADMIN_SESSION_TIMEOUT);
      setAdminAccessAttempts(0);
      setAdminLockoutUntil(null);
      
      // Store admin session in localStorage (encrypted in production)
      const adminSession = {
        authenticated: true,
        expiry: Date.now() + ADMIN_SESSION_TIMEOUT,
        timestamp: Date.now()
      };
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
      
      // Log successful access
      if (window.addAdminLogEntry) {
        window.addAdminLogEntry('success', `Admin access granted for ${credentials.email}`);
      }
      
      toast.success('Admin access granted');
      return true;
    } else {
      // Failed authentication
      const newAttempts = adminAccessAttempts + 1;
      setAdminAccessAttempts(newAttempts);
      
      // Log failed attempt
      if (window.addAdminLogEntry) {
        window.addAdminLogEntry('failed', `Failed admin login attempt for ${credentials.email}. Attempt ${newAttempts}/5`);
      }
      
      // Lockout after 5 failed attempts for 15 minutes
      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + (15 * 60 * 1000); // 15 minutes
        setAdminLockoutUntil(lockoutTime);
        
        // Log lockout
        if (window.addAdminLogEntry) {
          window.addAdminLogEntry('lockout', `Admin access locked for 15 minutes due to 5 failed attempts`);
        }
        
        toast.error('Too many failed attempts. Admin access locked for 15 minutes.');
      } else {
        toast.error(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
      }
      
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminSessionExpiry(null);
    localStorage.removeItem('adminSession');
    
    // Log logout
    if (window.addAdminLogEntry) {
      window.addAdminLogEntry('logout', 'Admin session ended by user');
    }
    
    toast.success('Admin session ended');
  };

  const checkAdminSession = () => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.authenticated && session.expiry > Date.now()) {
          setIsAdminAuthenticated(true);
          setAdminSessionExpiry(session.expiry);
          return true;
        } else {
          // Session expired
          localStorage.removeItem('adminSession');
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      localStorage.removeItem('adminSession');
    }
    return false;
  };

  const extendAdminSession = () => {
    if (isAdminAuthenticated) {
      const newExpiry = Date.now() + ADMIN_SESSION_TIMEOUT;
      setAdminSessionExpiry(newExpiry);
      
      const adminSession = {
        authenticated: true,
        expiry: newExpiry,
        timestamp: Date.now()
      };
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    sendCode,
    login,
    logout,
    updateProfile,
    refreshToken,
    // Admin authentication
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    checkAdminSession,
    extendAdminSession,
    adminAccessAttempts,
    adminLockoutUntil,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 