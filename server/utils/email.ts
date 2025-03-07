import nodemailer from 'nodemailer';

// In a production environment, these should be in environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.example.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@example.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-password';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Gemini Admin <noreply@example.com>';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Create a transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// For development, log emails instead of sending them
const isDev = process.env.NODE_ENV !== 'production';

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject,
    html,
  };

  if (isDev) {
    console.log('Email would be sent in production:');
    console.log(mailOptions);
    return true;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  
  const html = `
    <h1>Reset Your Password</h1>
    <p>You requested a password reset for your Gemini Admin Dashboard account. Please click the link below to reset your password:</p>
    <p><a href="${resetUrl}" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
    <p>Or copy and paste this URL into your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;

  return sendEmail({
    to,
    subject: 'Password Reset - Gemini Admin Dashboard',
    html,
  });
}
