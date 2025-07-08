import React, { useState, useEffect } from 'react';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    commentNotifications: true,
    likeNotifications: true,
    shareNotifications: true,
    contactNotifications: true,
    emailAddress: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current settings (mock data for now)
    setSettings({
      emailNotifications: true,
      commentNotifications: true,
      likeNotifications: true,
      shareNotifications: true,
      contactNotifications: true,
      emailAddress: 'francis@cyberscroll.com'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const testNotification = async (type) => {
    try {
      setMessage('Sending test notification...');
      
      // Simulate sending test notification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage(`Test ${type} notification sent! Check your email.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to send test notification.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notification Settings
          </h1>
          <p className="text-gray-600">
            Configure how you receive notifications when users interact with your content.
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') || message.includes('sent')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Email Configuration */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Email Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Email Address
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={settings.emailAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your-email@example.com"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This is where you'll receive all notifications
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                    Enable email notifications
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Notification Types
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="commentNotifications"
                      name="commentNotifications"
                      checked={settings.commentNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="commentNotifications" className="ml-3 block text-sm text-gray-900">
                      <span className="font-medium">New Comments</span>
                      <p className="text-gray-500">Get notified when someone comments on your articles</p>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => testNotification('comment')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Test
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="likeNotifications"
                      name="likeNotifications"
                      checked={settings.likeNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="likeNotifications" className="ml-3 block text-sm text-gray-900">
                      <span className="font-medium">Article Likes</span>
                      <p className="text-gray-500">Get notified when someone likes your articles</p>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => testNotification('like')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Test
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shareNotifications"
                      name="shareNotifications"
                      checked={settings.shareNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shareNotifications" className="ml-3 block text-sm text-gray-900">
                      <span className="font-medium">Content Sharing</span>
                      <p className="text-gray-500">Get notified when someone shares your articles</p>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => testNotification('share')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Test
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="contactNotifications"
                      name="contactNotifications"
                      checked={settings.contactNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="contactNotifications" className="ml-3 block text-sm text-gray-900">
                      <span className="font-medium">Contact Messages</span>
                      <p className="text-gray-500">Get notified when someone sends you a message</p>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => testNotification('contact')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>

            {/* Email Setup Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Email Setup Instructions
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>To receive email notifications, you need to configure your email settings:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Create a <code className="bg-blue-100 px-1 rounded">.env</code> file in the backend directory</li>
                  <li>Add your Gmail credentials:</li>
                  <li className="ml-4">
                    <code className="bg-blue-100 px-1 rounded">EMAIL_USER=your-email@gmail.com</code>
                  </li>
                  <li className="ml-4">
                    <code className="bg-blue-100 px-1 rounded">EMAIL_PASS=your-app-password</code>
                  </li>
                  <li>Use an App Password from your Google Account settings (not your regular password)</li>
                  <li>Restart the backend server after making changes</li>
                </ol>
                <p className="mt-3 text-gray-600">
                  <strong>Note:</strong> If email is not configured, notifications will be logged to the console instead.
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 