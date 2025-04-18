const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (to, url) => {
    const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Verify Your Email',
        html: `
      <h2>Almost there!</h2>
      <p>Click below to verify your email:</p>
      <a href="${url}" style="
        display: inline-block;
        padding: 10px 20px;
        background: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      ">Verify Email</a>
      <p>This link expires in 15 minutes.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
