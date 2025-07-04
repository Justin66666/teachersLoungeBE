# Two-Factor Authentication Setup Guide

This document explains how to set up and use the 2FA functionality that has been added to the Teachers' Lounge application.

## Backend Setup

### 1. Environment Variables
Add the following environment variables to your `.env` file in the backend directory:

```
EMAIL_USER=teachersLoungeService@gmail.com
EMAIL_PASS=your-16-digit-app-password
EMAIL_FROM=teachersLoungeService@gmail.com
```

### 2. Email Service Credentials
- **Email**: teachersLoungeService@gmail.com
- **Password**: teachersLoungeService99
- **App Password**: (16-digit password found in Gmail account under "App passwords")

### 3. Dependencies
The following dependency has been added to package.json:
- `nodemailer ^7.0.4`

Run `npm install` to install the new dependency.

### 4. Routes Added
The following routes have been added to handle 2FA:
- `POST /2fa/send-2fa-code` - Sends a 2FA code to the user's email
- `POST /2fa/verify-2fa` - Verifies the 2FA code
- `POST /api/auth/send-otp` - Alternative endpoint for sending OTP
- `POST /api/auth/verify-otp` - Alternative endpoint for verifying OTP

## Frontend Setup

### 1. New Components
- `TwoFactorAuthView.js` - The main 2FA input screen
- Updated `AuthNavigator.js` to include the 2FA screen

### 2. Updated Components
- `SignInView.js` - Added a toggle switch to enable 2FA
- `LogInCommand.js` - Updated to support 2FA parameter
- `SocialLoginCommand.js` - Already includes 2FA support
- `App_StyleSheet.js` - Added styles for 2FA components

### 3. New Styles Added
- `twoFactorTitle` - Title text for 2FA screen
- `twoFactorSubtitle` - Subtitle text for 2FA screen
- `otpContainer` - Container for OTP input fields
- `otpInput` - Individual OTP input field styling
- `resendContainer` - Container for resend button/timer
- `resendText` - Resend button text styling
- `resendTimerText` - Timer text styling
- `twoFAToggleContainer` - Container for 2FA toggle
- `twoFAToggleText` - 2FA toggle label text

## How to Use

### For Regular Login
1. Enter your email and password
2. Toggle the "Enable Two-Factor Authentication" switch to ON
3. Press "Sign In"
4. You will be redirected to the 2FA screen
5. Check your email for the 6-digit code
6. Enter the code in the 2FA screen
7. The app will automatically verify and log you in

### For Social Login
- Social login (Google, LinkedIn, Apple) automatically supports 2FA if the backend returns `requires2FA: true`

## Technical Notes

### Backend
- Codes are stored temporarily in memory using a Map
- Codes are 6-digit random numbers
- Codes are automatically deleted after successful verification
- Email service uses Gmail SMTP with app-specific passwords

### Frontend
- 2FA screen has auto-focus between input fields
- Auto-submission when all 6 digits are entered
- Resend functionality with 60-second cooldown timer
- Proper error handling and user feedback

## Security Considerations

1. **Code Storage**: Currently codes are stored in memory. For production, consider using Redis or database storage.
2. **Code Expiration**: Consider adding expiration times for codes (e.g., 5-10 minutes).
3. **Rate Limiting**: Consider adding rate limiting for code generation and verification.
4. **App Passwords**: Use Google App Passwords for better security than regular passwords.

## Troubleshooting

### Email Not Sending
1. Check that EMAIL_USER and EMAIL_PASS are correctly set in .env
2. Ensure you're using the 16-digit app password, not the regular Gmail password
3. Check that "Less secure app access" is enabled if not using app passwords

### 2FA Screen Not Showing
1. Ensure the toggle is set to ON in the login screen
2. Check that TwoFactorAuthView is properly imported in AuthNavigator
3. Verify the login function is being called with the enable2FA parameter

### Backend Errors
1. Check server logs for nodemailer errors
2. Verify that all routes are properly registered in app.js
3. Ensure twoFactor.js is properly imported and used 