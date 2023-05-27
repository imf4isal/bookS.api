const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // creating a transporter
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '8f8017cf5d4527',
      pass: '734f25f746a996',
    },
  });

  // define email options

  const mailOptions = {
    from: 'faisal <hello@faisal.dev',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
