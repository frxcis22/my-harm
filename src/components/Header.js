import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, X, Check, LogOut, Shield, Lock, Eye, Key, Bug, Network, Database, Code, AlertTriangle, Zap, Cpu, HardDrive, Wifi, Server, Fingerprint, Globe, Terminal, FileText, Settings, Users, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Security terms for the bubbles
const securityTerms = [
  'Firewall', 'Encryption', 'Malware', 'Phishing', 'Ransomware', 'Zero-Day',
  'Penetration Testing', 'SOC', 'SIEM', 'EDR', 'XDR', 'Threat Intelligence',
  'Vulnerability Assessment', 'Incident Response', 'Digital Forensics', 'Compliance',
  'GDPR', 'HIPAA', 'ISO 27001', 'NIST', 'OWASP', 'MITRE ATT&CK', 'CVE', 'CWE',
  'Authentication', 'Authorization', 'Multi-Factor', 'Biometrics', 'PKI', 'SSL/TLS',
  'VPN', 'IDS/IPS', 'Honeypot', 'Sandboxing', 'Behavioral Analysis', 'Machine Learning',
  'Blockchain', 'Quantum Security', 'Cloud Security', 'DevSecOps', 'Container Security'
];

// Security icons for bubbles - using only the most basic ones
const securityIcons = [
  Shield, Lock, Eye, Key, Bug, Network, Database, Code, AlertTriangle
];

const Header = ({ onMenuClick, isAdmin, onAdminToggle, onAdminLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [bubbles, setBubbles] = useState([]);
  const { user, isAdminAuthenticated } = useAuth();
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Initialize animated bubbles
  useEffect(() => {
    const createBubbles = () => {
      const newBubbles = Array.from({ length: 12 }, (_, index) => {
        const IconComponent = securityIcons[Math.floor(Math.random() * securityIcons.length)];
        const term = securityTerms[Math.floor(Math.random() * securityTerms.length)];
        
        return {
          id: index,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 15,
          speed: Math.random() * 0.5 + 0.2,
          direction: Math.random() * 360,
          opacity: Math.random() * 0.3 + 0.1,
          term,
          icon: IconComponent,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)` // Blue to cyan range
        };
      });
      setBubbles(newBubbles);
    };

    createBubbles();
  }, []);

  // Animate bubbles
  useEffect(() => {
    const animateBubbles = () => {
      setBubbles(prevBubbles => 
        prevBubbles.map(bubble => {
          const newX = bubble.x + Math.cos(bubble.direction * Math.PI / 180) * bubble.speed;
          const newY = bubble.y + Math.sin(bubble.direction * Math.PI / 180) * bubble.speed;
          
          // Bounce off edges
          let newDirection = bubble.direction;
          if (newX <= 0 || newX >= 100) {
            newDirection = 180 - newDirection;
          }
          if (newY <= 0 || newY >= 100) {
            newDirection = -newDirection;
          }
          
          return {
            ...bubble,
            x: Math.max(0, Math.min(100, newX)),
            y: Math.max(0, Math.min(100, newY)),
            direction: newDirection
          };
        })
      );
    };

    const interval = setInterval(animateBubbles, 50);
    return () => clearInterval(interval);
  }, []);

  // Mock notifications data
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'comment',
        message: 'New comment on "Advanced Threat Detection"',
        time: '2 minutes ago',
        read: false
      },
      {
        id: 2,
        type: 'like',
        message: 'Someone liked your article "Cybersecurity Best Practices"',
        time: '15 minutes ago',
        read: false
      },
      {
        id: 3,
        type: 'contact',
        message: 'New contact message from john@example.com',
        time: '1 hour ago',
        read: false
      },
      {
        id: 4,
        type: 'share',
        message: 'Your article was shared on LinkedIn',
        time: '2 hours ago',
        read: true
      },
      {
        id: 5,
        type: 'comment',
        message: 'New comment on "Incident Response Guide"',
        time: '3 hours ago',
        read: true
      }
    ]);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'contact':
        return '📧';
      case 'share':
        return '📤';
      default:
        return '🔔';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to articles page with search query
      navigate(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search after navigation
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 backdrop-blur-sm border-b border-blue-700 flex-shrink-0 relative overflow-hidden">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {bubbles.map((bubble) => {
          const IconComponent = bubble.icon;
          // Add error handling for undefined icons
          if (!IconComponent) {
            console.warn('Undefined icon for bubble:', bubble);
            return null;
          }
          return (
            <div
              key={bubble.id}
              className="absolute rounded-full flex items-center justify-center text-white font-medium text-xs shadow-lg backdrop-blur-sm border border-white/20"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                opacity: bubble.opacity,
                backgroundColor: bubble.color,
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.1s ease-out'
              }}
              title={bubble.term}
            >
              <IconComponent className="w-3 h-3" />
            </div>
          );
        })}
      </div>

      {/* Header Content */}
      <div className="relative z-10 flex h-20 items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white tracking-wide">
                CyberScroll
              </h1>
              <p className="text-xs text-blue-200 font-medium">
                Security Hub
              </p>
            </div>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
            <input
              type="text"
              placeholder="Search cybersecurity articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="pl-10 pr-4 py-2 w-80 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications - Only show for admin */}
          {isAdmin && (
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={toggleNotifications}
                className="p-2 hover:bg-white/10 rounded-md transition-colors relative text-white"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={toggleNotifications}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-lg">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.read ? 'font-medium' : ''} text-gray-900`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3 text-gray-500" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Controls - Only visible when user is Francis */}
          {user?.role === 'admin' && (
            <div className="flex items-center space-x-2">
              {/* Admin Toggle */}
              <button
                onClick={onAdminToggle}
                className="p-2 hover:bg-white/10 rounded-md transition-colors text-xs text-blue-200 hover:text-white"
                title={isAdminAuthenticated ? "Toggle Admin Mode (Ctrl+Shift+A)" : "Login to Admin (Ctrl+Shift+A)"}
              >
                {isAdmin ? '🔓' : '🔒'}
              </button>

              {/* Admin Logout - Only show when in admin mode */}
              {isAdmin && (
                <button
                  onClick={onAdminLogout}
                  className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-red-300 hover:text-red-200"
                  title="Logout from Admin"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 