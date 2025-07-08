import React, { useState, useEffect } from 'react';
import { Shield, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminSessionIndicator = ({ isAdmin }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const { isAdminAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAdmin || !isAdminAuthenticated) {
      setTimeRemaining(null);
      return;
    }

    const checkSessionTime = () => {
      try {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.expiry) {
            const remaining = session.expiry - Date.now();
            if (remaining > 0) {
              setTimeRemaining(remaining);
            } else {
              setTimeRemaining(0);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session time:', error);
      }
    };

    checkSessionTime();
    const interval = setInterval(checkSessionTime, 1000);

    return () => clearInterval(interval);
  }, [isAdmin, isAdminAuthenticated]);

  if (!isAdmin || !isAdminAuthenticated) {
    return null;
  }

  const formatTime = (ms) => {
    if (ms <= 0) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isWarning = timeRemaining && timeRemaining < 5 * 60 * 1000; // 5 minutes
  const isCritical = timeRemaining && timeRemaining < 2 * 60 * 1000; // 2 minutes

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg border ${
        isCritical 
          ? 'bg-red-100 border-red-300 text-red-800' 
          : isWarning 
            ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
            : 'bg-green-100 border-green-300 text-green-800'
      }`}>
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Admin Session</span>
        {timeRemaining !== null && (
          <>
            <Clock className="h-4 w-4" />
            <span className="text-sm font-mono">
              {formatTime(timeRemaining)}
            </span>
          </>
        )}
        {isCritical && <AlertTriangle className="h-4 w-4" />}
      </div>
    </div>
  );
};

export default AdminSessionIndicator; 