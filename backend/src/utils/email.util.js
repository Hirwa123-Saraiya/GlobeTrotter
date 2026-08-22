const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"GlobeTrotter" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your GlobeTrotter password reset code',
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your GlobeTrotter password</h2>
        <p>Use the code below to reset your password. It expires in 10 minutes.</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
