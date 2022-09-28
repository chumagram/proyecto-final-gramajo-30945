const path = require('path');
const {transporter} = require('../config/nodemailer')
const config = require('../config/envPath')

function htmlToUser(user) {
  return `
<div style="background:black;"}>
  <div style="text-align:center">
    <br>
    <img src="cid:tittleStoreWars" style="width: 250px;">
    <br>
    <h1 style="color: orangered;">Bienvenido <span style="color: white;">${user.alias}</span></h1>
    <h2 style="color: white;">Que disfrute de nuestros productos de una galaxia muy muy lejana...</h2>
    <div style="color:orange; padding-left: 20px;">
      <h3>Datos ingresados:</h3>
      <p><i>E-mail</i>: <b>${user.email}</b></p>
      <p><i>Nombre</i>: <b>${user.name}</b></p>
      <p><i>Apellido</i>: <b>${user.lastname}</b></p>
      <p><i>Usuario</i>: <b>${user.alias}</b></p>
      <p><i>Edad</i>: <b>${user.age}</b></p>
      <p><i>Dirección</i>: <b>${user.address}</b></p>
      <br><br>
    </div>
  </div>
</div>
  `
}

function  htmlToAdmin(user) {
  return `
<div style="background:black;"}>
  <br><br>
  <div style="color:orange; padding-left: 50px;">
    <h3>Datos del nuevo usuario:</h3>
    <p><i>E-mail</i>: <b>${user.email}</b></p>
    <p><i>Nombre</i>: <b>${user.name}</b></p>
    <p><i>Apellido</i>: <b>${user.lastname}</b></p>
    <p><i>Usuario</i>:<b>${user.alias}</b></p>
    <p><i>Edad</i>: <b>${user.age}</b></p>
    <p><i>Dirección</i>: <b>${user.address}</b></p>
  </div>
  <br><br>
</div>
  `
}

async function welcomeMail (user){
  try {
    await transporter.sendMail({
      from: 'Servidor Node.js',
      to: user.email,
      subject: 'Bienvenido a Store Wars - que la fuerza te acompañe',
      attachments:[{
        filename: 'tittle.webp',
        path: path.resolve(__dirname, "../../public/images/tittle.webp"),
        cid: 'tittleStoreWars'
      }],
      html: htmlToUser(user)
    })
  } catch (error) {
    return error
  } 
}

async function newUserMail (user){
  try {
    await transporter.sendMail({
      from: 'STORE WARS',
      to: config.GMAIL_MAIL,
      subject: `STORE WARS | ¡Nuevo usuario! - ${user.alias}`,
      html: htmlToAdmin(user)
    })
  } catch (error) {
    return error
  } 
}

async function ordenCompletada (orden){
  let shoppingListHTML = orden.listP.map((element) => {
    return(`
    <li>
      <dt>${element.name}</dt>
      <dd>Precio: ${element.price} U$D</dd>
      <dd>Código: ${element.code}</dd>
      <dd>Cantidad: ${element.quantity}</dd>
    </li>
    `)
  }).join(" ");

  let shoppingHTML = `
  <h2>¡Nueva compra de ${orden.name} ${orden.lastname}!<h2>
  <h3>Datos de la compra</h3>
  <p>Email: ${orden.email}</p>
  <p>Dirección de envío: ${orden.dirEnvio}</p>
  <p>Número de orden: ${orden.numOrden}</p>
  <h3>Lista de objetos comprados:</h3>
  <ul>${shoppingListHTML}</ul>
  `
  
  let shoppingUserHTML = `
  <h2>¡Gracias por comprar en STORE WARS!<h2>
  <h3>Datos de la compra</h3>
  <p>Nombre y apellido: ${orden.name} ${orden.lastname}</p>
  <p>Email: ${orden.email}</p>
  <p>Dirección de envío: ${orden.dirEnvio}</p>
  <p>Número de orden: ${orden.numOrden}</p>
  <h3>Lista de objetos comprados:</h3>
  <ul>${shoppingListHTML}</ul>
  `

  try {
    await transporter.sendMail({
      from: 'STORE WARS',
      to: config.GMAIL_MAIL,
      subject: `STORE WARS | Nueva compra de ${orden.email}`,
      html: shoppingHTML
    })
    await transporter.sendMail({
      from: 'STORE WARS',
      to: orden.email,
      subject: `STORE WARS | ¡Gracias por su compra, ${orden.name}!`,
      html: shoppingUserHTML
    })
  } catch (error) {
    return error
  }
}

module.exports = {
  welcomeMail,
  newUserMail,
  ordenCompletada
}