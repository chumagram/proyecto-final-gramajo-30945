const dotenv = require('dotenv');
dotenv.config()

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_TIME: process.env.SESSION_TIME,
  TIPO_PERSISTENCIA: process.env.TIPO_PERSISTENCIA,
  GMAIL_MAIL: process.env.GMAIL_MAIL,
  GMAIL_PASS: process.env.GMAIL_PASS
}