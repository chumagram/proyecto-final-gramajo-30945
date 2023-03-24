const malditoDotenv = require('../../conf-dotenv')

module.exports = {
    NODE_ENV: malditoDotenv.NODE_ENV,
    HOST: malditoDotenv.HOST,
    PORT: malditoDotenv.PORT,
    MONGODB_URI: malditoDotenv.MONGODB_URI,
    SESSION_TIME: malditoDotenv.SESSION_TIME,
    TIPO_PERSISTENCIA: malditoDotenv.TIPO_PERSISTENCIA,
    GMAIL_MAIL: malditoDotenv.GMAIL_MAIL,
    GMAIL_PASS: malditoDotenv.GMAIL_PASS
}