// Imports
const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // Create a Transporter - A Service Send the E-mail to clients
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define the Email options - Like Subject and Body
  const mailOptions = {
    from: 'The Natura Project <natura@test.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send the Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
