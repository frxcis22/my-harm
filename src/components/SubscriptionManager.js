import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Users, 
  Send, 
  AlertTriangle, 
  BarChart3, 
  Download, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import subscriptionService from '../services/subscriptionService';
import toast from 'react-hot-toast';

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notificationForm, setNotificationForm] = useState({
    type: 'update',
    subject: '',
    content: '',
    severity: 'medium'
  });
  const [sendingNotification, setSendingNotification] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = () => {
    setLoading(true);
    
    try {
      const data = subscriptionService.exportSubscriptions();
      setSubscriptions(data.subscriptions);
      setStats(data.stats);
      setActivities(data.activities);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    if (!notificationForm.subject || !notificationForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSendingNotification(true);

    try {
      let result;
      
      switch (notificationForm.type) {
        case 'update':
          result = await subscriptionService.sendUpdateNotification({
            subject: notificationForm.subject,
            content: notificationForm.content
          });
          break;
        case 'security_alert':
          result = await subscriptionService.sendSecurityAlert({
            title: notificationForm.subject,
            content: notificationForm.content,
            severity: notificationForm.severity
          });
          break;
        default:
          throw new Error('Invalid notification type');
      }

      toast.success(`Notification sent to ${result.sent} subscribers`);
      
      // Reset form
      setNotificationForm({
        type: 'update',
        subject: '',
        content: '',
        severity: 'medium'
      });
      
      // Reload data
      loadSubscriptionData();
      
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSendingNotification(false);
    }
  };

  const handleDeleteSubscription = async (email) => {
    if (!window.confirm(`Are you sure you want to delete the subscription for ${email}?`)) {
      return;
    }

    try {
      await subscriptionService.unsubscribe(email);
      toast.success('Subscription deleted successfully');
      loadSubscriptionData();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast.error('Failed to delete subscription');
    }
  };

  const exportData = () => {
    const data = subscriptionService.exportSubscriptions();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Subscription data exported successfully');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unsubscribed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'unsubscribed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading subscription data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Mail className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Email Subscription Manager</h2>
        </div>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'subscribers', label: 'Subscribers', icon: Users },
            { id: 'notifications', label: 'Send Notifications', icon: Send },
            { id: 'activities', label: 'Activities', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Subscribers</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.total || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Active Subscribers</p>
                    <p className="text-2xl font-bold text-green-900">{stats.active || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-red-600">Unsubscribed</p>
                    <p className="text-2xl font-bold text-red-900">{stats.unsubscribed || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Active Rate</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.activePercentage || 0}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {activity.action.replace(/_/g, ' ')}
                        </p>
                        {activity.email && (
                          <p className="text-xs text-gray-500">{activity.email}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">All Subscribers</h3>
              <div className="text-sm text-gray-500">
                {subscriptions.length} total subscribers
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emails Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.email}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {getStatusIcon(subscription.status)}
                          <span className="ml-1 capitalize">{subscription.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscription.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscription.emailCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteSubscription(subscription.email)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Send Notification</h3>
            
            <form onSubmit={handleSendNotification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <select
                  value={notificationForm.type}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="update">Site Update</option>
                  <option value="security_alert">Security Alert</option>
                </select>
              </div>

              {notificationForm.type === 'security_alert' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Severity
                  </label>
                  <select
                    value={notificationForm.severity}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={notificationForm.subject}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notification subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={notificationForm.content}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notification content (HTML supported)"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Notification Preview</p>
                    <p>This notification will be sent to all active subscribers who have opted in for {notificationForm.type === 'security_alert' ? 'security alerts' : 'updates'}.</p>
                    <p className="mt-2 font-medium">
                      Estimated recipients: {subscriptions.filter(sub => 
                        sub.status === 'active' && 
                        (notificationForm.type === 'security_alert' ? sub.preferences.securityAlerts : sub.preferences.updates)
                      ).length}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingNotification}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sendingNotification ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Notification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Subscription Activities</h3>
              <div className="text-sm text-gray-500">
                {activities.length} total activities
              </div>
            </div>
            
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {activity.action.replace(/_/g, ' ')}
                        </p>
                        {activity.email && (
                          <p className="text-sm text-gray-600">{activity.email}</p>
                        )}
                        {activity.details && Object.keys(activity.details).length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            {Object.entries(activity.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span> {value}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManager; 