const config = require('./envPath')
const MongoStore = require('connect-mongo')

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

const configSession = {
  store: MongoStore.create({ 
      mongoUrl: config.MONGODB_URI,
      mongoOptions: advancedOptions
  }),
  secret: 'chumagram',
  cookie: {
      maxAge: parseInt(config.SESSION_TIME),
      httpOnly: false,
      secure: false
  },
  //rolling: true, 
  resave: false, 
  saveUninitialized: false
}

module.exports = configSession