// Llamamos a socket.io
const socket = io.connect();

//*_______________ COMIENZO DE SESIÓN / ACTUALIZAR PÁGINA _______________

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

// FUNCIÓN: saludar al usuario y mostrar logout
function renderSession(){
    let alias = readCookieUser()

    //Mostrar boton de logout
    document.querySelector('#logout').style.display = 'block';
    document.querySelector('#logout').style.display = 'inline';
    
    //Mostar cartel de bienvenida
    let html = `Bienvenido ${alias}`
    document.getElementById('saludos').textContent = html;
    document.querySelector('#hechoInitSession').style.display = 'block';

    // Oculta el cartel de bienvenida luego de 4 segundos
    setTimeout(() => {
        document.querySelector('#hechoInitSession').style.display = 'none';
    }, 4000);
}

// Verificación de sesión
let cookieSession = readCookieSession();

if (cookieSession.error){
    logout();
} else {
    renderSession(); // mostrar bienvenida y logout
}

//*___________________ HERRAMIENTAS PARA PRODUCTOS ___________________
function showAddProd(e) {
    document.querySelector('#formProductAdd').style.display = 'block';
    document.querySelector('#formProductUpdate').style.display = 'none';
    document.querySelector('#formProductDelete').style.display = 'none';
}
function showUpdProd(e) {
    document.querySelector('#formProductAdd').style.display = 'block';
    document.querySelector('#formProductUpdate').style.display = 'none';
    document.querySelector('#formProductDelete').style.display = 'none';
}
function showDelProd(e) {
    document.querySelector('#formProductAdd').style.display = 'block';
    document.querySelector('#formProductUpdate').style.display = 'none';
    document.querySelector('#formProductDelete').style.display = 'none';
}

//*_______________________ FINALIZAR SESIÓN _______________________

//FUNCIÓN: cerrar sesión
function logout(e) {
    let alias = readCookieUser()

    let html = `Hasta luego ${alias}`
    document.getElementById('despedida').textContent = html;

    // Borrar las cookies
    let deleteAlias = `alias=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteAlias;
    let deleteEmail = `email=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteEmail;

    document.querySelector('#closeSession').style.display = 'block';
    document.querySelector('#atenuarBye').style.display = 'block';

    setTimeout(() => {
        window.location.replace('http://' + window.location.host);
    }, 2000);
}

//*______________________ SOBRE LOS PRODUCTOS ______________________

function renderProduct(data) {
    const html = data.map((element) => {
        return(`<tr>
            <td>${element.title}</td>
            <td>${element.price}</td>
            <td><img class="imgProducto" src=${element.thumbnail} alt="imagen de ${element.title}"></td>
        </tr>`)
    }).join(" ");
    document.getElementById('tablaProductos').innerHTML = html;
}

function addProduct(e){
    const producto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    };
    socket.emit('new-product', producto);
    return false;
}

//*________________________ SOCKETS ________________________

socket.on('productos', data => {
    renderProduct(data);
});