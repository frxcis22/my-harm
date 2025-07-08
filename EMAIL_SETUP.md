# Email Verification Setup Guide

## Overview
This application uses email verification codes for secure authentication. Users register with their email and receive a 6-digit verification code each time they want to access their account.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Email Configuration
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Gmail App Password Setup
To use Gmail for sending verification emails:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Navigate to Security > 2-Step Verification
   - Scroll down to "App passwords"
   - Select "Mail" and generate a new password
   - Use this generated password in `EMAIL_PASS`

### 4. Alternative Email Providers
You can modify the email configuration in `backend/routes/auth.js` to use other providers:

```javascript
// For Outlook/Hotmail
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// For custom SMTP
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## How It Works

### Registration Flow
1. User enters name and email
2. System creates user account
3. Verification code is sent to email
4. User enters 6-digit code
5. Account is activated and user is logged in

### Login Flow
1. User enters email address
2. Verification code is sent to email
3. User enters 6-digit code
4. User is logged in

### Security Features
- **6-digit codes**: Random numeric codes
- **10-minute expiration**: Codes expire after 10 minutes
- **Single-use**: Each code can only be used once
- **Rate limiting**: Built-in protection against abuse
- **24-hour tokens**: JWT tokens expire after 24 hours

## Testing

### Test the Email System
1. Start the backend server: `node server.js`
2. Try registering a new user
3. Check your email for the verification code
4. Enter the code to complete registration

### Development Testing
For development, you can use services like:
- **Mailtrap**: For testing email delivery
- **Ethereal Email**: For fake SMTP testing
- **Gmail**: For real email testing

## Troubleshooting

### Common Issues

1. **Email not sending**:
   - Check EMAIL_USER and EMAIL_PASS in .env
   - Verify Gmail app password is correct
   - Check if 2FA is enabled on Google account

2. **Code not received**:
   - Check spam folder
   - Verify email address is correct
   - Wait a few minutes for delivery

3. **Invalid code errors**:
   - Codes expire after 10 minutes
   - Each code can only be used once
   - Request a new code if needed

### Debug Mode
Enable debug logging by adding to your .env:
```env
DEBUG=nodemailer:*
```

## Production Considerations

1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Implement rate limiting** to prevent abuse
3. **Use environment-specific configurations**
4. **Monitor email delivery rates**
5. **Implement email templates** for better branding
6. **Add email verification tracking**

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong JWT secrets** in production
3. **Implement proper rate limiting**
4. **Monitor for suspicious activity**
5. **Regularly rotate email credentials**
6. **Use HTTPS in production**

## Backend Server Status

🚀 Server running on port 5000