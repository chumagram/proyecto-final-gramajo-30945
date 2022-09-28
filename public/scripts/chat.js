const socket = io.connect();

function forceLogout(e) {
  // Borrar las cookies
  let deleteAlias = `alias=''; SameSite=Lax; Secure; max-age=0`;
  document.cookie = deleteAlias;
  let deleteEmail = `email=''; SameSite=Lax; Secure; max-age=0`;
  document.cookie = deleteEmail;
  let deleteConnect = `connect.sid=''; SameSite=Lax; Secure; max-age=0`;
  document.cookie = deleteConnect;

  /* document.querySelector('#NoSession').style.display = 'block';
  document.querySelector('#atenuarErr').style.display = 'block'; */

  setTimeout(() => {
      window.location.replace('http://' + window.location.host);
  }, 2000);
}

// FUNCIÓN: Extraer valores de cookie de usuario
function readCookieUser () {
  let cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('alias='))
  ?.split('=')[1];

  if (cookieValue == undefined) {
      return { error: 'user cookie not found'}
  } else {
      return cookieValue
  }
}

// FUNCIÓN: Leemos cookie de session
function readCookieSession () {
  let cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith("connect.sid="))
  ?.split('=')[1];
  if (cookieValue == undefined) {
      return { error: 'session cookie not found'}
  } else {
      return cookieValue
  }
}

// FUNCIÓN: Leemos cookie email de usuario
function readCookieEmail () {
  let emailUser = document.cookie
  .split('; ')
  .find(row => row.startsWith('email='))
  ?.split('=')[1];
  let username = emailUser.split('%')[0]
  let mailServer = emailUser.split('%')[1].slice(2)
  let mailClean = username + '@' + mailServer;

  return mailClean
}

// Verificación de sesión
let cookieSession = readCookieSession();

function renderMessage(data) {
  if (cookieSession.error) forceLogout();
  const html = data.map((element) => {
    const timeStamp = new Date(element.createdAt).toISOString();
    const fecha = timeStamp.substring(0, 10);
    const hora = timeStamp.substring(11,16);
    return(`
    <div class=cadaMensaje>
      <p class='author'>${element.author}</p>
      <p class='text'>${element.text}</p>
      <p class='time'>${fecha} ${hora}</p>
    </div>
    `)
  }).join(" ");
  document.getElementById('messages').innerHTML = html;
  document.getElementById('message').value = '';
}

function addMessage(e){
  if (cookieSession.error) forceLogout();
  let mailClean = readCookieEmail();
  const mensaje = {
    email: mailClean,
    text: document.getElementById('message').value
  };
  socket.emit('new-message', mensaje);
  return false;
}

socket.on('mensajeria', data => {
  renderMessage(data);
});