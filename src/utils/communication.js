const dotenv = require('dotenv').config();
const path = require('path');

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
            <p><i>E-mail</i>: <b>${user.id}</b></p>
            <p><i>Nombre</i>: <b>${user.name}</b></p>
            <p><i>Apellido</i>: <b>${user.lastname}</b></p>
            <p><i>Usuario</i>: <b>${user.alias}</b></p>
            <p><i>Edad</i>: <b>${user.age}</b></p>
            <p><i>Dirección</i>: <b>${user.address}</b></p>
            <p><i>Teléfono</i>: <b>+${user.phone}</b></p>
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
        <p><i>E-mail</i>: <b>${user.id}</b></p>
        <p><i>Nombre</i>: <b>${user.name}</b></p>
        <p><i>Apellido</i>: <b>${user.lastname}</b></p>
        <p><i>Usuario</i>:<b>${user.alias}</b></p>
        <p><i>Edad</i>: <b>${user.age}</b></p>
        <p><i>Dirección</i>: <b>${user.address}</b></p>
        <p><i>Teléfono</i>: <b>+${user.phone}</b></p>
    </div>
    <br><br>
</div>
    `
}

function messageToAdmin (user) {
    return `
¡Nuevo usuario!
Datos del nuevo usuario:
- E-Mail: ${user.id}
- Nombre: ${user.name}
- Apellido: ${user.lastname}
- Usuario: ${user.alias}
- Edad: ${user.age}
- Dirección: ${user.address}
- Teléfono: ${user.phone}
`
}

async function welcomeMail (transporter, user){
    try {
        await transporter.sendMail({
            from: 'Servidor Node.js',
            to: user.id,
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

async function newUserMail (transporter, user){
    try {
        await transporter.sendMail({
            from: 'STORE WARS',
            to: process.env.GMAIL_MAIL,
            subject: `STORE WARS | ¡Nuevo usuario! - ${user.alias}`,
            html: htmlToAdmin(user)
        })
    } catch (error) {
        return error
    } 
}

async function newUserWhatsApp(client, user){
    try {
        await client.messages.create({
            body: messageToAdmin(user),
            from: `whatsapp:+${process.env.PHONE_NUMBER_TWILIO}`,
            to: `whatsapp:+${process.env.PHONE_NUMBER_ADMIN}`
        })
    } catch (error) {
        return error
    }
}

async function purchaseCompleted(user, shoppingList, transporter, client){
    let shoppingListHTML = shoppingList.map((element) => {
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
    <h2>¡Nueva compra de ${user.alias}!<h2>
    <p>Lista de objetos comprados:</p>
    <ul>${shoppingListHTML}</ul>
    `
    let shoppingUserHTML = `
    <h2>¡Gracias por comprar en STORE WARS, ${user.alias}!<h2>
    <p>Usted a comprado los siguientes objetos:</p>
    <ul>${shoppingListHTML}</ul>
    `
    let shoppingListMsj = shoppingList.map((element) => {
        return(
`
${element.name}
 - Precio: ${element.price} U$D
 - Código: ${element.code}
 - Cantidad: ${element.quantity}</dd>
`)
    }).join("\n");

    let shoppingMsj = `
¡Nueva compra de ${user.alias}!
Objetos comprados:
${shoppingListMsj}
`

    try {
        await transporter.sendMail({
            from: 'STORE WARS',
            to: process.env.GMAIL_MAIL,
            subject: `STORE WARS | Nueva compra de ${user.alias}`,
            html: shoppingHTML
        })
        await transporter.sendMail({
            from: 'STORE WARS',
            to: user.id,
            subject: `STORE WARS | ¡Gracias por su compra, ${user.alias}!`,
            html: shoppingUserHTML
        })
        await client.messages.create({
            body: shoppingMsj,
            from: `whatsapp:+${process.env.PHONE_NUMBER_TWILIO}`,
            to: `whatsapp:+${process.env.PHONE_NUMBER_ADMIN}`
        })
    } catch (error) {
        return error
    }
}

module.exports = {
    welcomeMail,
    newUserMail,
    newUserWhatsApp,
    purchaseCompleted
}