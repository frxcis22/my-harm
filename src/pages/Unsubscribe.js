import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, X, CheckCircle, AlertCircle } from 'lucide-react';
import subscriptionService from '../services/subscriptionService';
import toast from 'react-hot-toast';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Get email from URL parameters
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      checkSubscription(emailParam);
    }
  }, [searchParams]);

  const checkSubscription = async (emailAddress) => {
    try {
      const subscriptions = subscriptionService.loadSubscriptions();
      const found = subscriptions.find(sub => sub.email === emailAddress.toLowerCase().trim());
      setSubscription(found);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const success = await subscriptionService.unsubscribe(email);
      if (success) {
        setUnsubscribed(true);
        toast.success('Successfully unsubscribed');
      } else {
        toast.error('No active subscription found for this email');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Failed to unsubscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResubscribe = async () => {
    if (!email) return;

    setLoading(true);

    try {
      await subscriptionService.subscribe(email);
      setUnsubscribed(false);
      toast.success('Successfully resubscribed!');
      checkSubscription(email);
    } catch (error) {
      console.error('Error resubscribing:', error);
      toast.error('Failed to resubscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Mail className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {unsubscribed ? 'Unsubscribed' : 'Unsubscribe'}
            </h1>
            <p className="text-gray-600">
              {unsubscribed 
                ? 'You have been successfully unsubscribed from our email notifications.'
                : 'Manage your email subscription preferences'
              }
            </p>
          </div>

          {!unsubscribed ? (
            <>
              {/* Email Input */}
              <form onSubmit={handleUnsubscribe} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                {/* Subscription Status */}
                {subscription && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Active subscription found</p>
                        <p>Subscribed since {new Date(subscription.subscribedAt).toLocaleDateString()}</p>
                        <p>Emails received: {subscription.emailCount || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium">Are you sure?</p>
                      <p>You will no longer receive notifications about new articles, updates, or security alerts.</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Unsubscribing...</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      <span>Unsubscribe</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Successfully Unsubscribed
                </h2>
                <p className="text-gray-600">
                  You will no longer receive email notifications from CyberScroll Security.
                </p>
              </div>

              {/* Resubscribe Option */}
              <div className="space-y-4">
                <button
                  onClick={handleResubscribe}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Resubscribing...' : 'Resubscribe'}
                </button>
                
                <Link
                  to="/subscription"
                  className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Manage Preferences
                </Link>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Changed your mind?
              </p>
              <Link
                to="/"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Return to CyberScroll Security
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            If you have any questions, please contact us at{' '}
            <a href="mailto:francis@cyberscroll.com" className="text-blue-600 hover:underline">
              francis@cyberscroll.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe; 