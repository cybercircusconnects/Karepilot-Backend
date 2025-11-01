import nodemailer from "nodemailer";
import { emailConfig, validateEmailConfig } from "../../config/emailConfig";
import { EmailOptions, EmailPasswordResetTemplate, EmailVerificationTemplate } from "../../types";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!validateEmailConfig()) {
      throw new Error("Email configuration is invalid. Please check your environment variables.");
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailConfig.gmail.user,
        pass: emailConfig.gmail.appPassword,
      },
    });
  }

  private generateEmailVerificationHTML(data: EmailVerificationTemplate): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Karepilot</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
          }
          .logo {
            font-size: 36px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
            letter-spacing: -1px;
          }
          .tagline {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 50px 40px;
          }
          .welcome-section {
            text-align: center;
            margin-bottom: 40px;
          }
          .welcome-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
          }
          .welcome-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 12px;
            line-height: 1.2;
          }
          .welcome-subtitle {
            font-size: 18px;
            color: #718096;
            font-weight: 400;
          }
          .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 30px;
            text-align: center;
          }
          .greeting strong {
            color: #667eea;
            font-weight: 600;
          }
          .code-section {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .code-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            animation: shimmer 3s infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          .code-label {
            font-size: 14px;
            color: #718096;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .verification-code {
            font-size: 42px;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 12px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            margin: 10px 0;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
          }
          .instructions {
            font-size: 16px;
            color: #4a5568;
            margin: 30px 0;
            text-align: center;
            line-height: 1.6;
          }
          .warning-section {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border: 1px solid #fc8181;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            position: relative;
          }
          .warning-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: #e53e3e;
            border-radius: 50%;
            margin-right: 10px;
            vertical-align: middle;
            position: relative;
          }
          .warning-icon::after {
            content: '!';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
          .warning-text {
            font-size: 14px;
            color: #742a2a;
            font-weight: 500;
            display: inline-block;
            vertical-align: middle;
          }
          .footer {
            background: #f7fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-brand {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 10px;
          }
          .footer-text {
            font-size: 14px;
            color: #718096;
            margin-bottom: 5px;
          }
          .footer-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
          }
          .footer-link:hover {
            text-decoration: underline;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #667eea;
            border-radius: 50%;
            margin: 0 8px;
            text-decoration: none;
            color: white;
            line-height: 40px;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .social-link:hover {
            background: #5a67d8;
            transform: translateY(-2px);
          }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
            .verification-code { font-size: 32px; letter-spacing: 8px; }
            .welcome-title { font-size: 24px; }
            .header { padding: 30px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">Karepilot</div>
            <div class="tagline">Your Healthcare Companion</div>
          </div>
          
          <div class="content">
            <div class="welcome-section">
              <div class="welcome-icon">✓</div>
              <h1 class="welcome-title">Welcome to Karepilot!</h1>
              <p class="welcome-subtitle">Let's verify your email address</p>
            </div>
            
            <div class="greeting">
              Hello <strong>${data.fullName}</strong> 👋
            </div>
            
            <div class="code-section">
              <div class="code-label">Your Verification Code</div>
              <div class="verification-code">${data.verificationCode}</div>
            </div>
            
            <div class="instructions">
              Enter this 4-digit code in the Karepilot app to complete your registration and start your healthcare journey with us.
            </div>
            
            <div class="warning-section">
              <span class="warning-icon"></span>
              <span class="warning-text">
                <strong>Security Notice:</strong> This code expires in 10 minutes. If you didn't request this verification, please ignore this email.
              </span>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-brand">Karepilot</div>
            <p class="footer-text">This email was sent by Karepilot</p>
            <p class="footer-text">
              Need help? Contact our <a href="mailto:support@karepilot.com" class="footer-link">support team</a>
            </p>
            <div class="social-links">
              <a href="#" class="social-link">📱</a>
              <a href="#" class="social-link">🌐</a>
              <a href="#" class="social-link">📧</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateEmailVerificationText(data: EmailVerificationTemplate): string {
    return `
      Email Verification - Karepilot
      
      Hello ${data.fullName},
      
      Thank you for registering with Karepilot! To complete your registration and verify your email address, please use the verification code below:
      
      Verification Code: ${data.verificationCode}
      
      Enter this code in the app to verify your email address and activate your account.
      
      Important: This verification code will expire in 10 minutes for security reasons. If you didn't request this verification, please ignore this email.
      
      This email was sent by Karepilot
      If you have any questions, please contact our support team.
    `;
  }

  async sendEmailVerification(data: EmailVerificationTemplate, email: string): Promise<boolean> {
    try {
      const mailOptions: EmailOptions = {
        to: email,
        subject: emailConfig.templates.verification.subject,
        html: this.generateEmailVerificationHTML(data),
        text: this.generateEmailVerificationText(data),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email verification sent to ${email}:`, result.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email verification:", error);
      return false;
    }
  }

  async sendPasswordReset(data: EmailPasswordResetTemplate, email: string): Promise<boolean> {
    try {
      const mailOptions: EmailOptions = {
        to: email,
        subject: emailConfig.templates.passwordReset.subject,
        html: this.generatePasswordResetHTML(data),
        text: this.generatePasswordResetText(data),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}:`, result.messageId);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }
  }

  private generatePasswordResetHTML(data: EmailPasswordResetTemplate): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Karepilot</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
          }
          .logo {
            font-size: 36px;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
            letter-spacing: -1px;
          }
          .tagline {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
            position: relative;
            z-index: 1;
          }
          .content {
            padding: 50px 40px;
          }
          .security-section {
            text-align: center;
            margin-bottom: 40px;
          }
          .security-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: white;
          }
          .security-title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 12px;
            line-height: 1.2;
          }
          .security-subtitle {
            font-size: 18px;
            color: #718096;
            font-weight: 400;
          }
          .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 30px;
            text-align: center;
          }
          .greeting strong {
            color: #e53e3e;
            font-weight: 600;
          }
          .code-section {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border: 2px solid #fc8181;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .code-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(229, 62, 62, 0.1), transparent);
            animation: shimmer 3s infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          }
          .code-label {
            font-size: 14px;
            color: #742a2a;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .reset-code {
            font-size: 42px;
            font-weight: 800;
            color: #e53e3e;
            letter-spacing: 12px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            margin: 10px 0;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(229, 62, 62, 0.1);
          }
          .instructions {
            font-size: 16px;
            color: #4a5568;
            margin: 30px 0;
            text-align: center;
            line-height: 1.6;
          }
          .warning-section {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border: 1px solid #fc8181;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            position: relative;
          }
          .warning-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: #e53e3e;
            border-radius: 50%;
            margin-right: 10px;
            vertical-align: middle;
            position: relative;
          }
          .warning-icon::after {
            content: '!';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
          .warning-text {
            font-size: 14px;
            color: #742a2a;
            font-weight: 500;
            display: inline-block;
            vertical-align: middle;
          }
          .footer {
            background: #f7fafc;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-brand {
            font-size: 20px;
            font-weight: 700;
            color: #e53e3e;
            margin-bottom: 10px;
          }
          .footer-text {
            font-size: 14px;
            color: #718096;
            margin-bottom: 5px;
          }
          .footer-link {
            color: #e53e3e;
            text-decoration: none;
            font-weight: 500;
          }
          .footer-link:hover {
            text-decoration: underline;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #e53e3e;
            border-radius: 50%;
            margin: 0 8px;
            text-decoration: none;
            color: white;
            line-height: 40px;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .social-link:hover {
            background: #c53030;
            transform: translateY(-2px);
          }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .content { padding: 30px 20px; }
            .footer { padding: 20px; }
            .reset-code { font-size: 32px; letter-spacing: 8px; }
            .security-title { font-size: 24px; }
            .header { padding: 30px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">Karepilot</div>
            <div class="tagline">Secure Password Reset</div>
          </div>
          
          <div class="content">
            <div class="security-section">
              <div class="security-icon">🔒</div>
              <h1 class="security-title">Password Reset Request</h1>
              <p class="security-subtitle">Secure your account with a new password</p>
            </div>
            
            <div class="greeting">
              Hello <strong>${data.fullName}</strong> 👋
            </div>
            
            <div class="code-section">
              <div class="code-label">Your Reset Code</div>
              <div class="reset-code">${data.resetCode}</div>
            </div>
            
            <div class="instructions">
              Enter this 4-digit code in the Karepilot app to reset your password and secure your account.
            </div>
            
            <div class="warning-section">
              <span class="warning-icon"></span>
              <span class="warning-text">
                <strong>Security Alert:</strong> This code expires in 10 minutes. If you didn't request this password reset, please ignore this email and consider changing your password.
              </span>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-brand">Karepilot</div>
            <p class="footer-text">This email was sent by Karepilot</p>
            <p class="footer-text">
              Need help? Contact our <a href="mailto:support@karepilot.com" class="footer-link">support team</a>
            </p>
            <div class="social-links">
              <a href="#" class="social-link">📱</a>
              <a href="#" class="social-link">🌐</a>
              <a href="#" class="social-link">📧</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePasswordResetText(data: EmailPasswordResetTemplate): string {
    return `
      Password Reset - Karepilot
      
      Hello ${data.fullName},
      
      We received a request to reset your password. Use the code below to reset your password:
      
      Reset Code: ${data.resetCode}
      
      Enter this code in the app to reset your password.
      
      Important: This reset code will expire in 10 minutes for security reasons. If you didn't request this password reset, please ignore this email.
      
      This email was sent by Karepilot
      If you have any questions, please contact our support team.
    `;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service connection verified successfully");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}

export default new EmailService();
