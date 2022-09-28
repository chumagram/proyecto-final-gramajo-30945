const config = require('../config/envPath')
const cluster = require('cluster') // para crear subprocesos cluster
const logs = require('../utils/logsGenerator')

const PORT = config.PORT || 8080
const SMODE = config.SMODE || 'NORMAL'

function initServer(app){
  if(SMODE == 'NORMAL'){
    app.listen(PORT, () => {
      logs.showAviso(`Server HTTP escuchando en el puerto ${PORT}`);
    });
  } else if (SMODE == 'CLUSTER') {
    if(cluster.isPrimary) { // isPrimary | isMaster
      logs.showAviso(`Primary PID ${process.pid}`);
      for (let index = 0; index < numCPUs; index++) {
        cluster.fork(PORT) // crea un worker para cada CPU
      }
      cluster.on('online', worker => {
        logs.showAviso(`Worker PID ${worker.process.pid} online`);
      })
      cluster.on('exit', worker => {
        logs.showAviso(`Worker PID ${worker.process.pid} died`);
      })
    } else { // entra al else cuando es un worker
      app.listen(PORT, () => {
        logs.showAviso(`Server HTTP escuchando en el puerto ${app.address().port}`);
      });
    }
  }
}

module.exports = {initServer}