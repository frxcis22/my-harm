import React, { useState } from 'react';
import { Mail, Settings, Bell, Shield, Calendar, X, CheckCircle, FileText } from 'lucide-react';
import subscriptionService from '../services/subscriptionService';
import toast from 'react-hot-toast';

const SubscriptionPreferences = () => {
  const [email, setEmail] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [preferences, setPreferences] = useState({
    newArticles: true,
    updates: true,
    weeklyDigest: false,
    securityAlerts: true
  });
  const [saving, setSaving] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSearching(true);

    try {
      const subscriptions = subscriptionService.loadSubscriptions();
      const found = subscriptions.find(sub => sub.email === email.toLowerCase().trim());
      
      if (found) {
        setSubscription(found);
        setPreferences(found.preferences);
        toast.success('Subscription found! You can now manage your preferences.');
      } else {
        setSubscription(null);
        toast.error('No subscription found for this email address');
      }
    } catch (error) {
      console.error('Error searching subscription:', error);
      toast.error('Failed to search subscription');
    } finally {
      setSearching(false);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!subscription) return;

    setSaving(true);

    try {
      await subscriptionService.updatePreferences(subscription.email, preferences);
      toast.success('Preferences updated successfully');
      
      // Update local subscription data
      const updatedSubscription = { ...subscription, preferences };
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscription) return;

    if (!window.confirm('Are you sure you want to unsubscribe? You will no longer receive any notifications.')) {
      return;
    }

    setLoading(true);

    try {
      await subscriptionService.unsubscribe(subscription.email);
      toast.success('Successfully unsubscribed');
      setSubscription(null);
      setEmail('');
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Failed to unsubscribe');
    } finally {
      setLoading(false);
    }
  };

  const handleResubscribe = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const newSubscription = await subscriptionService.subscribe(email, preferences);
      setSubscription(newSubscription);
      toast.success('Successfully resubscribed!');
    } catch (error) {
      console.error('Error resubscribing:', error);
      toast.error('Failed to resubscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email Subscription Preferences
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your email preferences and stay in control of the notifications you receive from CyberScroll Security.
          </p>
        </div>

        {/* Search Section */}
        {!subscription && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Find Your Subscription
              </h2>
              <p className="text-gray-600">
                Enter your email address to manage your subscription preferences
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex space-x-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subscription Management */}
        {subscription && (
          <div className="space-y-8">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Subscription Status
                </h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status === 'active' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Unsubscribed
                    </>
                  )}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Email Address</p>
                  <p className="text-gray-900">{subscription.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Subscribed Since</p>
                  <p className="text-gray-900">
                    {new Date(subscription.subscribedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Emails Received</p>
                  <p className="text-gray-900">{subscription.emailCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Last Email</p>
                  <p className="text-gray-900">
                    {subscription.lastEmailSent 
                      ? new Date(subscription.lastEmailSent).toLocaleDateString()
                      : 'None yet'
                    }
                  </p>
                </div>
              </div>

              {subscription.status === 'unsubscribed' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        You are currently unsubscribed
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        You won't receive any notifications until you resubscribe.
                      </p>
                      <button
                        onClick={handleResubscribe}
                        disabled={loading}
                        className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                      >
                        {loading ? 'Resubscribing...' : 'Resubscribe'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            {subscription.status === 'active' && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">New Articles</h3>
                          <p className="text-sm text-gray-600">
                            Get notified when new cybersecurity articles are published
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.newArticles}
                            onChange={(e) => setPreferences(prev => ({ ...prev, newArticles: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <Settings className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Site Updates</h3>
                          <p className="text-sm text-gray-600">
                            Receive notifications about important site updates and changes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.updates}
                            onChange={(e) => setPreferences(prev => ({ ...prev, updates: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Security Alerts</h3>
                          <p className="text-sm text-gray-600">
                            Get urgent notifications about critical security threats and alerts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.securityAlerts}
                            onChange={(e) => setPreferences(prev => ({ ...prev, securityAlerts: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                          <p className="text-sm text-gray-600">
                            Receive a weekly summary of all articles and updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.weeklyDigest}
                            onChange={(e) => setPreferences(prev => ({ ...prev, weeklyDigest: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={handleUpdatePreferences}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                  <button
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Unsubscribing...' : 'Unsubscribe'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">About Your Subscription</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You can unsubscribe at any time</li>
                <li>• We respect your privacy and never share your email</li>
                <li>• All emails include an unsubscribe link</li>
                <li>• You can change your preferences anytime</li>
                <li>• Security alerts are sent for critical threats only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPreferences; 