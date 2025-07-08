import React, { useState } from 'react';
import { Mail, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailSubscription = ({ 
  title = "Stay Updated", 
  subtitle = "Get notified when new articles are published",
  className = "",
  variant = "default" // "default", "hero", "sidebar"
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual subscription service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store subscription in localStorage for demo
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '[]');
      const newSubscription = {
        email,
        subscribedAt: new Date().toISOString(),
        status: 'active',
        preferences: {
          newArticles: true,
          updates: true,
          weeklyDigest: false
        }
      };
      
      // Check if already subscribed
      const existingIndex = subscriptions.findIndex(sub => sub.email === email);
      if (existingIndex >= 0) {
        subscriptions[existingIndex] = newSubscription;
      } else {
        subscriptions.push(newSubscription);
      }
      
      localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions));
      
      setIsSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed! You\'ll receive notifications for new articles.');
      
      // Reset subscription status after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from localStorage
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '[]');
      const updatedSubscriptions = subscriptions.filter(sub => sub.email !== email);
      localStorage.setItem('emailSubscriptions', JSON.stringify(updatedSubscriptions));
      
      toast.success('Successfully unsubscribed');
      setIsSubscribed(false);
      setEmail('');
      
    } catch (error) {
      console.error('Unsubscribe error:', error);
      toast.error('Failed to unsubscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: "bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 shadow-xl",
          input: "bg-white/10 border-white/20 text-white placeholder-white/70 focus:ring-white/50 focus:border-white/50",
          button: "bg-white text-blue-600 hover:bg-gray-100"
        };
      case 'sidebar':
        return {
          container: "bg-gray-50 border border-gray-200 rounded-lg p-6",
          input: "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500",
          button: "bg-blue-600 text-white hover:bg-blue-700"
        };
      default:
        return {
          container: "bg-white border border-gray-200 rounded-lg p-6 shadow-sm",
          input: "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
          button: "bg-blue-600 text-white hover:bg-blue-700"
        };
    }
  };

  const styles = getVariantStyles();

  if (isSubscribed) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Successfully Subscribed!</h3>
          <p className="text-sm opacity-80 mb-4">
            You'll receive notifications when new articles are published.
          </p>
          <button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="text-sm underline hover:no-underline transition-all"
          >
            {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex items-center mb-4">
        <Mail className="h-6 w-6 mr-3" />
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm opacity-80">{subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${styles.input}`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${styles.button}`}
        >
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              <span>Subscribe</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs opacity-70">
        <p>By subscribing, you agree to receive email notifications about:</p>
        <ul className="mt-2 space-y-1">
          <li>• New cybersecurity articles and insights</li>
          <li>• Important security updates and alerts</li>
          <li>• Weekly digest (optional)</li>
        </ul>
        <p className="mt-2">
          You can unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </div>
  );
};

export default EmailSubscription; 