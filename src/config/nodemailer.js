const nodemailer = require('nodemailer')
const config = require('./envPath')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
      user: config.GMAIL_MAIL,
      pass: config.GMAIL_PASS
  },
  tls: {
      rejectUnauthorized: false
  }
});

module.exports = {transporter}