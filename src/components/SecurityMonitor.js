import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Activity, Zap, Lock } from 'lucide-react';
import { logSecurityEvent, isSecureConnection } from '../utils/security';

const SecurityMonitor = ({ isAdmin = false }) => {
  const [securityStatus, setSecurityStatus] = useState({
    connection: 'checking',
    threats: [],
    events: [],
    lastCheck: null
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [threatLevel, setThreatLevel] = useState('low'); // low, medium, high, critical

  // Security event types and their severity
  const eventTypes = {
    'xss_attempt': { severity: 'high', color: 'red', icon: AlertTriangle },
    'sql_injection': { severity: 'critical', color: 'red', icon: XCircle },
    'brute_force': { severity: 'high', color: 'orange', icon: Shield },
    'spam_detected': { severity: 'medium', color: 'yellow', icon: AlertTriangle },
    'suspicious_activity': { severity: 'medium', color: 'yellow', icon: Eye },
    'rate_limit_exceeded': { severity: 'low', color: 'blue', icon: Activity },
    'admin_access': { severity: 'info', color: 'green', icon: Lock },
    'comment_reported': { severity: 'medium', color: 'orange', icon: AlertTriangle }
  };

  // Check security status
  const checkSecurityStatus = () => {
    const status = {
      connection: isSecureConnection() ? 'secure' : 'insecure',
      threats: [],
      events: [],
      lastCheck: new Date().toISOString()
    };

    // Check for security threats
    const threats = detectThreats();
    status.threats = threats;

    // Get recent security events
    const events = getRecentSecurityEvents();
    status.events = events;

    // Calculate threat level
    const level = calculateThreatLevel(threats, events);
    setThreatLevel(level);

    setSecurityStatus(status);
  };

  // Detect potential security threats
  const detectThreats = () => {
    const threats = [];

    // Check for suspicious URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const suspiciousParams = ['script', 'javascript', 'eval', 'onload', 'onerror'];
    
    suspiciousParams.forEach(param => {
      if (urlParams.has(param)) {
        threats.push({
          type: 'xss_attempt',
          description: `Suspicious URL parameter detected: ${param}`,
          severity: 'high',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Check for suspicious localStorage content
    try {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        const session = JSON.parse(adminSession);
        if (session.authenticated && session.expiry < Date.now()) {
          threats.push({
            type: 'expired_session',
            description: 'Expired admin session detected',
            severity: 'medium',
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      threats.push({
        type: 'storage_corruption',
        description: 'Local storage corruption detected',
        severity: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    // Check for multiple failed login attempts
    const failedAttempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '[]');
    if (failedAttempts.length > 5) {
      threats.push({
        type: 'brute_force',
        description: 'Multiple failed login attempts detected',
        severity: 'high',
        timestamp: new Date().toISOString()
      });
    }

    return threats;
  };

  // Get recent security events
  const getRecentSecurityEvents = () => {
    try {
      const events = JSON.parse(localStorage.getItem('securityLogs') || '[]');
      return events.slice(0, 10); // Last 10 events
    } catch (error) {
      return [];
    }
  };

  // Calculate overall threat level
  const calculateThreatLevel = (threats, events) => {
    let score = 0;

    // Score threats
    threats.forEach(threat => {
      switch (threat.severity) {
        case 'critical': score += 10; break;
        case 'high': score += 5; break;
        case 'medium': score += 2; break;
        case 'low': score += 1; break;
      }
    });

    // Score recent events
    events.forEach(event => {
      const eventType = eventTypes[event.event];
      if (eventType) {
        switch (eventType.severity) {
          case 'critical': score += 3; break;
          case 'high': score += 2; break;
          case 'medium': score += 1; break;
        }
      }
    });

    if (score >= 15) return 'critical';
    if (score >= 10) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  // Get threat level display info
  const getThreatLevelInfo = () => {
    const levels = {
      low: { color: 'green', text: 'Low Threat', icon: CheckCircle },
      medium: { color: 'yellow', text: 'Medium Threat', icon: AlertTriangle },
      high: { color: 'orange', text: 'High Threat', icon: Shield },
      critical: { color: 'red', text: 'Critical Threat', icon: XCircle }
    };
    return levels[threatLevel];
  };

  // Handle security event click
  const handleEventClick = (event) => {
    if (isAdmin) {
      // Show detailed event information for admins
      console.log('Security Event Details:', event);
      logSecurityEvent('admin_event_view', { eventId: event.id });
    }
  };

  // Auto-refresh security status
  useEffect(() => {
    checkSecurityStatus();
    
    const interval = setInterval(checkSecurityStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Log security monitor access
  useEffect(() => {
    logSecurityEvent('security_monitor_accessed', { 
      isAdmin, 
      threatLevel,
      connectionStatus: securityStatus.connection 
    });
  }, [isAdmin, threatLevel, securityStatus.connection]);

  const threatLevelInfo = getThreatLevelInfo();
  const ThreatIcon = threatLevelInfo.icon;

  return (
    <div className="security-monitor">
      {/* Compact Status Bar */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-${threatLevelInfo.color}-100`}>
                <ThreatIcon className={`h-5 w-5 text-${threatLevelInfo.color}-600`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Security Status</h3>
                <p className="text-xs text-gray-500">{threatLevelInfo.text}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  securityStatus.connection === 'secure' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-500">
                  {securityStatus.connection === 'secure' ? 'Secure' : 'Insecure'}
                </span>
              </div>
              
              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Eye className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Threats Section */}
            {securityStatus.threats.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Active Threats ({securityStatus.threats.length})</span>
                </h4>
                <div className="space-y-2">
                  {securityStatus.threats.map((threat, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">{threat.description}</p>
                          <p className="text-xs text-red-600 mt-1">
                            {new Date(threat.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          threat.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          threat.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {threat.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Events Section */}
            {securityStatus.events.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>Recent Security Events ({securityStatus.events.length})</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {securityStatus.events.map((event, index) => {
                    const eventType = eventTypes[event.event] || { 
                      severity: 'info', 
                      color: 'gray', 
                      icon: Activity 
                    };
                    const EventIcon = eventType.icon;
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          eventType.severity === 'critical' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                          eventType.severity === 'high' ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' :
                          eventType.severity === 'medium' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                          'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded ${
                            eventType.severity === 'critical' ? 'bg-red-100' :
                            eventType.severity === 'high' ? 'bg-orange-100' :
                            eventType.severity === 'medium' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            <EventIcon className={`h-3 w-3 ${
                              eventType.severity === 'critical' ? 'text-red-600' :
                              eventType.severity === 'high' ? 'text-orange-600' :
                              eventType.severity === 'medium' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {event.event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {event.details && typeof event.details === 'object' 
                                ? JSON.stringify(event.details).substring(0, 100) + '...'
                                : event.details || 'No details available'
                              }
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Security Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Security Recommendations</span>
              </h4>
              <div className="space-y-2">
                {threatLevel === 'critical' && (
                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded-md">
                    <strong>Critical:</strong> Immediate action required. Review all security events and consider implementing additional security measures.
                  </p>
                )}
                {threatLevel === 'high' && (
                  <p className="text-sm text-orange-700 bg-orange-50 p-3 rounded-md">
                    <strong>High:</strong> Monitor closely and address any identified threats promptly.
                  </p>
                )}
                {securityStatus.connection === 'insecure' && (
                  <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
                    <strong>Connection:</strong> Consider using HTTPS for enhanced security.
                  </p>
                )}
                {securityStatus.threats.length === 0 && securityStatus.events.length === 0 && (
                  <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
                    <strong>Good:</strong> No security threats detected. Continue monitoring.
                  </p>
                )}
              </div>
            </div>

            {/* Last Check */}
            <div className="text-xs text-gray-500 text-center">
              Last security check: {securityStatus.lastCheck ? 
                new Date(securityStatus.lastCheck).toLocaleString() : 'Never'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityMonitor; 