const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Ensure env is loaded
dotenv.config();

const router = express.Router();

// Log env vars for debugging
console.log('📧 Email Config:', {
  user: process.env.EMAIL_USER ? '✓ Set' : '✗ Missing',
  pass: process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing',
  from: process.env.EMAIL_FROM || 'Not set'
});

// Create transporter function to ensure fresh config
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'cmadusanka611@gmail.com',
      pass: process.env.EMAIL_PASS || 'impiayfmsmklghgs',
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Basic validation helper for email format
const isEmail = (val) => /.+@.+\..+/.test(String(val || ''));

router.post('/email/send', async (req, res) => {
  console.log('📨 Email send request received:', req.body);
  const { to, subject, text, html, message } = req.body || {};
  
  try {
    if (!to || !isEmail(to)) {
      console.log('❌ Invalid email address:', to);
      return res.status(400).json({ success: false, message: 'Valid "to" email is required' });
    }

    const fromEnv = process.env.EMAIL_FROM;
    const from = isEmail(fromEnv) ? fromEnv : process.env.EMAIL_USER;
    console.log('📧 Sending from:', from, 'to:', to);

    // Accept 'message' field from frontend and use it as 'text' if text/html not provided
    const emailText = text || message;
    const emailHtml = html;

    if (!emailText && !emailHtml) {
      console.log('❌ No email body provided');
      return res.status(400).json({ success: false, message: 'Email body (text, html, or message) is required' });
    }

    const mailOptions = {
      from,
      to,
      subject: subject || 'Notification',
      text: emailText || undefined,
      html: emailHtml || undefined,
    };

    console.log('📤 Attempting to send email with options:', { from, to, subject });
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    return res.json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    console.error('Full error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;