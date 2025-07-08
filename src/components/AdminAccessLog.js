import React, { useState, useEffect, useCallback } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminAccessLog = () => {
  const [accessLogs, setAccessLogs] = useState([]);

  useEffect(() => {
    // Load existing logs from localStorage
    try {
      const logs = localStorage.getItem('adminAccessLogs');
      if (logs) {
        setAccessLogs(JSON.parse(logs));
      }
    } catch (error) {
      console.error('Error loading admin access logs:', error);
    }
  }, []);

  const addLogEntry = useCallback((type, details) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type, // 'success', 'failed', 'lockout', 'logout'
      details,
      ip: '127.0.0.1', // In production, get real IP
      userAgent: navigator.userAgent
    };

    const updatedLogs = [newLog, ...accessLogs.slice(0, 49)]; // Keep last 50 entries
    setAccessLogs(updatedLogs);
    
    try {
      localStorage.setItem('adminAccessLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error saving admin access logs:', error);
    }
  }, [accessLogs]);

  const clearLogs = () => {
    setAccessLogs([]);
    localStorage.removeItem('adminAccessLogs');
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'lockout':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'logout':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'lockout':
        return 'bg-orange-50 border-orange-200';
      case 'logout':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Expose addLogEntry function globally for use in AuthContext
  useEffect(() => {
    window.addAdminLogEntry = addLogEntry;
    return () => {
      delete window.addAdminLogEntry;
    };
  }, [addLogEntry]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Admin Access Log</h3>
        </div>
        <button
          onClick={clearLogs}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
        >
          Clear Logs
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {accessLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No admin access logs yet</p>
            <p className="text-sm">Access attempts will be logged here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {accessLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 ${getLogColor(log.type)} border-l-4`}
              >
                <div className="flex items-start space-x-3">
                  {getLogIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {log.type} Access
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {log.details}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>IP: {log.ip}</span>
                      <span>Browser: {log.userAgent.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{accessLogs.length} log entries</span>
          <span>Last 50 entries shown</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessLog; 