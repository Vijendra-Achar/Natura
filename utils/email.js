// Imports
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.lastName = user.name.split(' ')[1];
    this.url = url;
    this.from = `The Natura Project <${process.env.EMAIL_FROM}>`;
  }

  // Create a Transporter - A Service Send the E-mail to clients
  createNewTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Transport for the production version uing Send Grid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1 --> Render the template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      lastName: this.lastName,
      url: this.url,
      subject,
    });

    const text = htmlToText.fromString(html);

    // 2 --> Define the Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text,
    };

    // 3 --> Create the transport and send the E-mail
    await this.createNewTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natura Project!');
  }
};
