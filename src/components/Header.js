import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, X, Check, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick, isAdmin, onAdminToggle, onAdminLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const { user, isAdminAuthenticated } = useAuth();
  const notificationRef = useRef(null);
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b flex-shrink-0">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search cybersecurity articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="pl-10 pr-4 py-2 w-80 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="p-2 hover:bg-muted rounded-md transition-colors relative"
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
                className="p-2 hover:bg-muted rounded-md transition-colors text-xs text-gray-500 hover:text-gray-700"
                title={isAdminAuthenticated ? "Toggle Admin Mode (Ctrl+Shift+A)" : "Login to Admin (Ctrl+Shift+A)"}
              >
                {isAdmin ? '🔓' : '🔒'}
              </button>

              {/* Admin Logout - Only show when in admin mode */}
              {isAdmin && (
                <button
                  onClick={onAdminLogout}
                  className="p-2 hover:bg-red-100 rounded-md transition-colors text-red-600 hover:text-red-700"
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