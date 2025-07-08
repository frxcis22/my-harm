import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminLoginModal from './components/AdminLoginModal';
import AdminSessionIndicator from './components/AdminSessionIndicator';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import NotificationSettings from './pages/NotificationSettings';
import SubscriptionPreferences from './pages/SubscriptionPreferences';
import Unsubscribe from './pages/Unsubscribe';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { user, isAdminAuthenticated, checkAdminSession, extendAdminSession, logoutAdmin } = useAuth();

  // Check for existing admin session on app load
  useEffect(() => {
    const hasValidSession = checkAdminSession();
    if (hasValidSession) {
      setAdminMode(true);
    }
  }, [checkAdminSession]);

  // Extend admin session on user activity
  useEffect(() => {
    if (isAdminAuthenticated) {
      const handleUserActivity = () => {
        extendAdminSession();
      };

      // Extend session on various user activities
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, { passive: true });
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [isAdminAuthenticated, extendAdminSession]);

  // Secure admin access - Press Ctrl+Shift+A to trigger admin login (only for Francis)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        // Only allow admin access if user is Francis
        if (user?.role === 'admin') {
          if (isAdminAuthenticated) {
            // If already authenticated, toggle admin mode
            setAdminMode(!adminMode);
            console.log('Admin mode toggled:', !adminMode);
          } else {
            // If not authenticated, show login modal
            setShowAdminModal(true);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [adminMode, user?.role, isAdminAuthenticated]);

  // Handle admin authentication success
  const handleAdminLoginSuccess = () => {
    setAdminMode(true);
    setShowAdminModal(false);
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setAdminMode(false);
    logoutAdmin();
  };

  // Check if user should have admin access
  // Only Francis can access admin features AND must be authenticated
  const isAdmin = adminMode && isAdminAuthenticated && user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={isAdmin} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          isAdmin={isAdmin}
          onAdminToggle={() => {
            if (isAdminAuthenticated) {
              setAdminMode(!adminMode);
            } else {
              setShowAdminModal(true);
            }
          }}
          onAdminLogout={handleAdminLogout}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notifications" element={<NotificationSettings />} />
            <Route path="/subscription" element={<SubscriptionPreferences />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
          </Routes>
        </main>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Session Indicator */}
      <AdminSessionIndicator isAdmin={isAdmin} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
