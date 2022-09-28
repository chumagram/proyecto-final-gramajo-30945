const argv = require('yargs/yargs')(process.argv.slice(2)).argv
const dotenv = require('dotenv');
const path = require('path');

/* dotenv.config({
    path: path.resolve(process.cwd(), argv.NODE_ENV + '.env')
}) */

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    //HOST: process.env.HOST || 'localhost',
    //PORT: process.env.PORT || 8080,
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_TIME: process.env.SESSION_TIME || 20000,
    TIPO_PERSISTENCIA: process.env.TIPO_PERSISTENCIA || 'MONGO',
    GMAIL_MAIL: process.env.GMAIL_MAIL,
    GMAIL_PASS: process.env.GMAIL_PASS
}

