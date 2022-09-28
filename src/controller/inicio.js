let config = require('../config/envPath')
const logs = require('../utils/logsGenerator')

class ControladorInicio {

  getRoot = (req, res) => {
    try {
      res.render('pages/index');
    } catch (error) {
      logs.showError('error en getRoot', error)
    }
  }

  getRegister (req, res){
    try {
      res.render('pages/registrarse');
    } catch (error) {
      logs.showError('error en getRegister', error)
    }
  }

  getConfig (req, res) {
    try {
      res.render('pages/config', {
        modo: config.NODE_ENV,
        os: process.platform,
        idProcess: process.pid,
        port: config.PORT,
        nodeVersion: process.version,
        sessionTime: config.SESSION_TIME,
        persistence: config.TIPO_PERSISTENCIA,
        gmailAdmin: config.GMAIL_MAIL
      })
    } catch (error) {
      logs.showError('error en getConfig', error)
    }
  }
}

module.exports = ControladorInicio