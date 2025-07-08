// Email Subscription Service
// Handles subscription management, notifications, and email sending

class SubscriptionService {
  constructor() {
    this.subscriptions = this.loadSubscriptions();
  }

  // Load subscriptions from localStorage
  loadSubscriptions() {
    try {
      const stored = localStorage.getItem('emailSubscriptions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      return [];
    }
  }

  // Save subscriptions to localStorage
  saveSubscriptions() {
    try {
      localStorage.setItem('emailSubscriptions', JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error('Error saving subscriptions:', error);
    }
  }

  // Subscribe a new email
  async subscribe(email, preferences = {}) {
    const defaultPreferences = {
      newArticles: true,
      updates: true,
      weeklyDigest: false,
      securityAlerts: true
    };

    const subscription = {
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
      preferences: { ...defaultPreferences, ...preferences },
      lastEmailSent: null,
      emailCount: 0
    };

    // Check if already subscribed
    const existingIndex = this.subscriptions.findIndex(sub => sub.email === subscription.email);
    const isNewSubscription = existingIndex === -1;
    
    if (existingIndex >= 0) {
      // Update existing subscription
      this.subscriptions[existingIndex] = {
        ...this.subscriptions[existingIndex],
        ...subscription,
        subscribedAt: this.subscriptions[existingIndex].subscribedAt // Keep original date
      };
    } else {
      // Add new subscription
      this.subscriptions.push(subscription);
    }

    this.saveSubscriptions();
    
    // Log subscription for admin
    this.logSubscriptionActivity('subscribe', subscription.email);
    
    // Send admin notification for new subscribers
    if (isNewSubscription) {
      await this.sendAdminNewSubscriberNotification(subscription);
    }
    
    return subscription;
  }

  // Unsubscribe an email
  async unsubscribe(email) {
    const emailLower = email.toLowerCase().trim();
    const subscription = this.subscriptions.find(sub => sub.email === emailLower);
    
    if (subscription) {
      const wasActive = subscription.status === 'active';
      subscription.status = 'unsubscribed';
      subscription.unsubscribedAt = new Date().toISOString();
      this.saveSubscriptions();
      
      // Log unsubscription for admin
      this.logSubscriptionActivity('unsubscribe', emailLower);
      
      // Send admin notification for unsubscribes (only if they were active)
      if (wasActive) {
        await this.sendAdminUnsubscribeNotification(subscription);
      }
      
      return true;
    }
    
    return false;
  }

  // Update subscription preferences
  async updatePreferences(email, preferences) {
    const emailLower = email.toLowerCase().trim();
    const subscription = this.subscriptions.find(sub => sub.email === emailLower);
    
    if (subscription) {
      subscription.preferences = { ...subscription.preferences, ...preferences };
      subscription.updatedAt = new Date().toISOString();
      this.saveSubscriptions();
      
      // Log preference update for admin
      this.logSubscriptionActivity('update_preferences', emailLower, preferences);
      
      return subscription;
    }
    
    return null;
  }

  // Get all active subscriptions
  getActiveSubscriptions() {
    return this.subscriptions.filter(sub => sub.status === 'active');
  }

  // Get subscription statistics
  getSubscriptionStats() {
    const active = this.subscriptions.filter(sub => sub.status === 'active').length;
    const unsubscribed = this.subscriptions.filter(sub => sub.status === 'unsubscribed').length;
    const total = this.subscriptions.length;
    
    return {
      active,
      unsubscribed,
      total,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
    };
  }

  // Send notification for new article
  async sendNewArticleNotification(article) {
    const activeSubscriptions = this.getActiveSubscriptions().filter(
      sub => sub.preferences.newArticles
    );

    // Simulate sending emails to all subscribers
    for (const subscription of activeSubscriptions) {
      const notification = {
        type: 'new_article',
        subject: `New Article: ${article.title}`,
        content: this.generateArticleEmailContent(article, subscription.email),
        sentAt: new Date().toISOString()
      };

      await this.sendEmail(subscription.email, notification);
      
      // Update subscription stats
      subscription.lastEmailSent = notification.sentAt;
      subscription.emailCount = (subscription.emailCount || 0) + 1;
    }

    this.saveSubscriptions();
    
    // Log notification for admin
    this.logSubscriptionActivity('send_article_notification', null, {
      articleId: article.id,
      articleTitle: article.title,
      recipients: activeSubscriptions.length
    });

    return {
      sent: activeSubscriptions.length,
      article: article.title
    };
  }

  // Send general update notification
  async sendUpdateNotification(update) {
    const activeSubscriptions = this.getActiveSubscriptions().filter(
      sub => sub.preferences.updates
    );

    // Simulate sending emails
    for (const subscription of activeSubscriptions) {
      const notification = {
        type: 'update',
        subject: update.subject,
        content: this.generateUpdateEmailContent(update, subscription.email),
        sentAt: new Date().toISOString()
      };

      await this.sendEmail(subscription.email, notification);
      
      subscription.lastEmailSent = notification.sentAt;
      subscription.emailCount = (subscription.emailCount || 0) + 1;
    }

    this.saveSubscriptions();
    
    // Log notification for admin
    this.logSubscriptionActivity('send_update_notification', null, {
      updateSubject: update.subject,
      recipients: activeSubscriptions.length
    });

    return {
      sent: activeSubscriptions.length,
      update: update.subject
    };
  }

  // Send security alert
  async sendSecurityAlert(alert) {
    const activeSubscriptions = this.getActiveSubscriptions().filter(
      sub => sub.preferences.securityAlerts
    );

    // Simulate sending emails
    for (const subscription of activeSubscriptions) {
      const notification = {
        type: 'security_alert',
        subject: `Security Alert: ${alert.title}`,
        content: this.generateSecurityAlertContent(alert, subscription.email),
        sentAt: new Date().toISOString()
      };

      await this.sendEmail(subscription.email, notification);
      
      subscription.lastEmailSent = notification.sentAt;
      subscription.emailCount = (subscription.emailCount || 0) + 1;
    }

    this.saveSubscriptions();
    
    // Log alert for admin
    this.logSubscriptionActivity('send_security_alert', null, {
      alertTitle: alert.title,
      alertSeverity: alert.severity,
      recipients: activeSubscriptions.length
    });

    return {
      sent: activeSubscriptions.length,
      alert: alert.title
    };
  }

  // Generate email content for new article
  generateArticleEmailContent(article, email) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">New Article Published</h2>
        <h3 style="color: #3b82f6;">${article.title}</h3>
        <p style="color: #6b7280; line-height: 1.6;">${article.excerpt}</p>
        <div style="margin: 20px 0;">
          <a href="${window.location.origin}/articles/${article.id}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Read Full Article
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 14px;">
          By Francis Bockarie - CyberScroll Security<br>
          <a href="${window.location.origin}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #3b82f6;">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  // Generate email content for updates
  generateUpdateEmailContent(update, email) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">Site Update</h2>
        <h3 style="color: #3b82f6;">${update.subject}</h3>
        <div style="color: #6b7280; line-height: 1.6;">
          ${update.content}
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 14px;">
          CyberScroll Security<br>
          <a href="${window.location.origin}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #3b82f6;">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  // Generate email content for security alerts
  generateSecurityAlertContent(alert, email) {
    const severityColor = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626'
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${severityColor[alert.severity] || '#ef4444'}; color: white; padding: 20px; border-radius: 8px;">
          <h2 style="margin: 0;">Security Alert</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Severity: ${alert.severity.toUpperCase()}</p>
        </div>
        <div style="padding: 20px 0;">
          <h3 style="color: #1f2937;">${alert.title}</h3>
          <div style="color: #6b7280; line-height: 1.6;">
            ${alert.content}
          </div>
          ${alert.recommendations ? `
            <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
              <h4 style="margin: 0 0 10px 0; color: #1f2937;">Recommendations:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                ${alert.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 14px;">
          CyberScroll Security<br>
          <a href="${window.location.origin}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #3b82f6;">Unsubscribe</a>
        </p>
      </div>
    `;
  }

  // Simulate sending email (replace with actual email service)
  async sendEmail(email, notification) {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`📧 Email sent to ${email}:`, {
      subject: notification.subject,
      type: notification.type,
      sentAt: notification.sentAt
    });
    
    // In production, integrate with email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer
  }

  // Send admin notification for new subscriber
  async sendAdminNewSubscriberNotification(subscription) {
    const adminEmail = 'francis@cyberscroll.com'; // Francis's email
    
    const notification = {
      type: 'admin_new_subscriber',
      subject: `New Email Subscriber: ${subscription.email}`,
      content: this.generateAdminNewSubscriberContent(subscription),
      sentAt: new Date().toISOString()
    };

    // Send notification to admin
    await this.sendEmail(adminEmail, notification);
    
    // Log admin notification
    this.logSubscriptionActivity('admin_notification_sent', adminEmail, {
      notificationType: 'new_subscriber',
      subscriberEmail: subscription.email,
      subscriberCount: this.getActiveSubscriptions().length
    });
  }

  // Generate admin notification content for new subscriber
  generateAdminNewSubscriberContent(subscription) {
    const stats = this.getSubscriptionStats();
    const recentSubscriptions = this.subscriptions
      .filter(sub => sub.status === 'active')
      .sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))
      .slice(0, 5);

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🎉 New Email Subscriber!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone just subscribed to your cybersecurity blog</p>
        </div>
        
        <div style="padding: 30px; background: white; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #10b981; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px;">
              👤
            </div>
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">New Subscriber Details</h2>
            <p style="color: #6b7280; margin: 0;">${subscription.email}</p>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📊 Subscription Statistics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.active}</div>
                <div style="font-size: 12px; color: #6b7280;">Active Subscribers</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #10b981;">${stats.total}</div>
                <div style="font-size: 12px; color: #6b7280;">Total Subscribers</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">⚙️ Notification Preferences</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div style="padding: 10px; background: ${subscription.preferences.newArticles ? '#d1fae5' : '#fef2f2'}; border-radius: 6px; text-align: center;">
                <div style="font-weight: bold; color: ${subscription.preferences.newArticles ? '#065f46' : '#991b1b'};">
                  ${subscription.preferences.newArticles ? '✅' : '❌'} New Articles
                </div>
              </div>
              <div style="padding: 10px; background: ${subscription.preferences.updates ? '#d1fae5' : '#fef2f2'}; border-radius: 6px; text-align: center;">
                <div style="font-weight: bold; color: ${subscription.preferences.updates ? '#065f46' : '#991b1b'};">
                  ${subscription.preferences.updates ? '✅' : '❌'} Site Updates
                </div>
              </div>
              <div style="padding: 10px; background: ${subscription.preferences.securityAlerts ? '#d1fae5' : '#fef2f2'}; border-radius: 6px; text-align: center;">
                <div style="font-weight: bold; color: ${subscription.preferences.securityAlerts ? '#065f46' : '#991b1b'};">
                  ${subscription.preferences.securityAlerts ? '✅' : '❌'} Security Alerts
                </div>
              </div>
              <div style="padding: 10px; background: ${subscription.preferences.weeklyDigest ? '#d1fae5' : '#fef2f2'}; border-radius: 6px; text-align: center;">
                <div style="font-weight: bold; color: ${subscription.preferences.weeklyDigest ? '#065f46' : '#991b1b'};">
                  ${subscription.preferences.weeklyDigest ? '✅' : '❌'} Weekly Digest
                </div>
              </div>
            </div>
          </div>

          ${recentSubscriptions.length > 1 ? `
            <div style="margin-bottom: 30px;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">📈 Recent Subscribers</h3>
              <div style="background: #f9fafb; border-radius: 8px; overflow: hidden;">
                ${recentSubscriptions.slice(0, 3).map(sub => `
                  <div style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-weight: 500; color: #1f2937;">${sub.email}</div>
                      <div style="font-size: 12px; color: #6b7280;">Subscribed ${new Date(sub.subscribedAt).toLocaleDateString()}</div>
                    </div>
                    <div style="font-size: 12px; color: #6b7280;">
                      ${sub.emailCount || 0} emails sent
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="${window.location.origin}/dashboard" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              View Admin Dashboard
            </a>
          </div>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            This notification was sent to Francis Bockarie (francis@cyberscroll.com)<br>
            <a href="${window.location.origin}/dashboard" style="color: #3b82f6; text-decoration: none;">Manage Subscriptions</a>
          </p>
        </div>
      </div>
    `;
  }

  // Log subscription activities for admin monitoring
  logSubscriptionActivity(action, email, details = {}) {
    const activity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      email,
      details,
      ip: '127.0.0.1', // In production, get real IP
      userAgent: navigator.userAgent
    };

    try {
      const activities = JSON.parse(localStorage.getItem('subscriptionActivities') || '[]');
      activities.unshift(activity);
      
      // Keep only last 100 activities
      if (activities.length > 100) {
        activities.splice(100);
      }
      
      localStorage.setItem('subscriptionActivities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error logging subscription activity:', error);
    }
  }

  // Get subscription activities for admin
  getSubscriptionActivities() {
    try {
      return JSON.parse(localStorage.getItem('subscriptionActivities') || '[]');
    } catch (error) {
      console.error('Error loading subscription activities:', error);
      return [];
    }
  }

  // Export subscriptions data (for admin)
  exportSubscriptions() {
    return {
      subscriptions: this.subscriptions,
      stats: this.getSubscriptionStats(),
      activities: this.getSubscriptionActivities()
    };
  }

  // Import subscriptions data (for admin)
  importSubscriptions(data) {
    if (data.subscriptions) {
      this.subscriptions = data.subscriptions;
      this.saveSubscriptions();
    }
    
    if (data.activities) {
      localStorage.setItem('subscriptionActivities', JSON.stringify(data.activities));
    }
  }

  // Send admin notification for unsubscribe
  async sendAdminUnsubscribeNotification(subscription) {
    const adminEmail = 'francis@cyberscroll.com'; // Francis's email
    
    const notification = {
      type: 'admin_unsubscribe',
      subject: `Subscriber Unsubscribed: ${subscription.email}`,
      content: this.generateAdminUnsubscribeContent(subscription),
      sentAt: new Date().toISOString()
    };

    // Send notification to admin
    await this.sendEmail(adminEmail, notification);
    
    // Log admin notification
    this.logSubscriptionActivity('admin_notification_sent', adminEmail, {
      notificationType: 'unsubscribe',
      subscriberEmail: subscription.email,
      subscriberCount: this.getActiveSubscriptions().length
    });
  }

  // Generate admin notification content for unsubscribe
  generateAdminUnsubscribeContent(subscription) {
    const stats = this.getSubscriptionStats();
    const subscriptionDuration = Math.floor((new Date(subscription.unsubscribedAt) - new Date(subscription.subscribedAt)) / (1000 * 60 * 60 * 24)); // days

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📉 Subscriber Unsubscribed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone has unsubscribed from your cybersecurity blog</p>
        </div>
        
        <div style="padding: 30px; background: white; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #ef4444; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px;">
              👋
            </div>
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">Unsubscribed User</h2>
            <p style="color: #6b7280; margin: 0;">${subscription.email}</p>
          </div>

          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📊 Subscription Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #dc2626;">${subscription.emailCount || 0}</div>
                <div style="font-size: 12px; color: #6b7280;">Emails Sent</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #dc2626;">${subscriptionDuration}</div>
                <div style="font-size: 12px; color: #6b7280;">Days Subscribed</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📅 Timeline</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: 500; color: #1f2937;">Subscribed:</span>
                <span style="color: #6b7280;">${new Date(subscription.subscribedAt).toLocaleDateString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500; color: #1f2937;">Unsubscribed:</span>
                <span style="color: #6b7280;">${new Date(subscription.unsubscribedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">📈 Updated Statistics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.active}</div>
                <div style="font-size: 12px; color: #6b7280;">Active Subscribers</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${stats.unsubscribed}</div>
                <div style="font-size: 12px; color: #6b7280;">Unsubscribed</div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 15px;">
              <div style="font-size: 16px; font-weight: bold; color: #1f2937;">${stats.activePercentage}%</div>
              <div style="font-size: 12px; color: #6b7280;">Active Rate</div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${window.location.origin}/dashboard" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              View Admin Dashboard
            </a>
          </div>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            This notification was sent to Francis Bockarie (francis@cyberscroll.com)<br>
            <a href="${window.location.origin}/dashboard" style="color: #3b82f6; text-decoration: none;">Manage Subscriptions</a>
          </p>
        </div>
      </div>
    `;
  }
}

// Create singleton instance
const subscriptionService = new SubscriptionService();

export default subscriptionService; 