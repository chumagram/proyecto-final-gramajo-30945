// Llamamos a socket.io
const socket = io.connect();

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

// Renderizar aviso las herramientas para productos
function renderPoster(data){
    document.querySelector('#divAvisosHerr').style.display = 'block';
    document.getElementById('AvisosHerr').innerHTML = data;
    setTimeout(() => {
        document.querySelector('#divAvisosHerr').style.display = 'none';
    }, 3000);
}

//*_______________ COMIENZO DE SESIÓN / ACTUALIZAR PÁGINA _______________

// saludar al usuario y mostrar logout
function renderSession(){
    let alias = readCookieUser();

    //Mostrar boton de logout
    document.querySelector('#logout').style.display = 'block';
    document.querySelector('#logout').style.display = 'inline';
    
    //Mostar cartel de bienvenida
    let html = `${alias}`
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
    forceLogout();
} else {
    let exceptionPage = 'http://' + window.location.host + '/cart'
    if (window.location.href != exceptionPage){
        renderSession(); // mostrar bienvenida y logout
        socket.emit('show-products');
    } else {
        let mailUser = readCookieEmail();
        socket.emit('show-cart-table', mailUser);
    }
}

//*___________________ HERRAMIENTAS PARA PRODUCTOS ___________________

function showAddProd(e) {
    document.querySelector('#formProductAdd').style.display = 'block';
    document.querySelector('#formProductUpdate').style.display = 'none';
    document.querySelector('#formProductDelete').style.display = 'none';
}
function showUpdProd(e) {
    document.querySelector('#formProductAdd').style.display = 'none';
    document.querySelector('#formProductUpdate').style.display = 'block';
    document.querySelector('#formProductDelete').style.display = 'none';
}
function showDelProd(e) {
    document.querySelector('#formProductAdd').style.display = 'none';
    document.querySelector('#formProductUpdate').style.display = 'none';
    document.querySelector('#formProductDelete').style.display = 'block';
}

//*________________________ FINALIZAR SESIÓN ________________________

function logout(e) {

    let alias = readCookieUser()

    let html = `${alias}`
    document.getElementById('despedida').textContent = html;

    // Borrar las cookies
    let deleteAlias = `alias=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteAlias;
    let deleteEmail = `email=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteEmail;
    let deleteConnect = `connect.sid=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteConnect;

    document.querySelector('#closeSession').style.display = 'block';
    document.querySelector('#atenuarBye').style.display = 'block';

    setTimeout(() => {
        window.location.replace('http://' + window.location.host);
    }, 2000);
}

function forceLogout(e) {

    // Borrar las cookies
    let deleteAlias = `alias=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteAlias;
    let deleteEmail = `email=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteEmail;
    let deleteConnect = `connect.sid=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = deleteConnect;

    document.querySelector('#NoSession').style.display = 'block';
    document.querySelector('#atenuarErr').style.display = 'block';

    setTimeout(() => {
        window.location.replace('http://' + window.location.host);
    }, 2000);
}

//*______________________ SOBRE LOS PRODUCTOS ______________________

// Renderizar tabla de productos
function renderProduct(data) {
    const html = data.map((element) => {
        return(`<tr>
            <td class="columnOurId">${element.ourId}</td>
            <td>${element.name}</td>
            <td>${element.price} U$D</td>
            <td class="columnDescription">${element.description}</td>
            <td>
                <img class="imgProducto" src=${element.thumbnail} alt="imagen de ${element.title}">
            </td>
            <td>${element.stock}</td>
            <td>${element.code}</td>
            <td>
                <input onclick="addProductToCart('${element.ourId}')" type="button" class="botonAddToCart" value="Añadir al carrito">
            </td>
        </tr>`)
    }).join(" ");
    
    document.getElementById('tablaProductos').innerHTML = html;
}

// Función para añadir un nuevo producto
function addProduct(e){
    const producto = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        thumbnail: document.getElementById('thumbnail').value,
        stock: document.getElementById('stock').value,
        code: document.getElementById('code').value
    };

    let flag = false

    for (const property in producto) {
        if (producto[property]==''){
            let html = `ERROR: Falta agregar ${property}`
            document.getElementById('ErrAddProduct').innerHTML = html;
            document.querySelector('#divErrAddProduct').style.display = 'block';
            setTimeout(() => {
                document.querySelector('#divErrAddProduct').style.display = 'none';
            }, 2000);
            return flag = true;
        }
    }

    if (!flag){
        for (const property in producto) {
            document.getElementById(`${property}`).value = "";
        }
        socket.emit('new-product', producto);
    }

    return false;
}

// Función para actualizar un producto
function updProduct(e){
    const idToUpdate = parseInt(document.getElementById('idToUpd').value);
    const changes = {}
    const changesAux = {
        nameToUpd: document.getElementById('nameToUpd').value,
        priceToUpd: document.getElementById('priceToUpd').value,
        descriptionToUpd: document.getElementById('descriptionToUpd').value,
        thumbnail: document.getElementById('thumbnailToUpd').value,
        stock: document.getElementById('stockToUpd').value,
        code: document.getElementById('codeToUpd').value
    }

    if (changesAux.nameToUpd) changes.name = changesAux.nameToUpd;
    if (changesAux.priceToUpd) changes.price = parseInt(changesAux.priceToUpd);
    if (changesAux.descriptionToUpd) changes.description = changesAux.descriptionToUpd;
    if (changesAux.thumbnailToUpd) changes.thumbnail = changesAux.thumbnailToUpd;
    if (changesAux.stockToUpd) changes.stock = parseInt(changesAux.stockToUpd);
    if (changesAux.codeToUpd) changes.code = parseInt(changesAux.codeToUpd);

    socket.emit('upd-product', {id:idToUpdate, changes:changes});

    document.getElementById(`idToUpd`).value = "";
    for (const property in changesAux) {
        document.getElementById(`${property}`).value = "";
    }

    return false;
}

// Función para eliminar un producto
function delProduct(e){
    const idToDelete = parseInt(document.getElementById('idToDelete').value);
    socket.emit('del-product', {id: idToDelete});
    document.getElementById(`idToDelete`).value = "";
    return false;
}

//*___________________ PARA EL CARRITO __________________

// Añadir producto al carrito
function addProductToCart(IdInHTML){
    let idProduct = parseInt(IdInHTML);
    let mailUser = readCookieEmail();

    socket.emit('add-product-to-cart', {id: idProduct, mail: mailUser});
    return false;
}

// Eliminar producto del carrito
function delProductToCart(codeInHTML){
    let codeProduct = parseInt(codeInHTML);
    let mailUser = readCookieEmail();
    socket.emit('delete-product-to-cart', {code: codeProduct, mail: mailUser});
}

// Renderizar tabla de carrito
function renderCart(data) {
    const html = data.map((element) => {
        return(`<tr>
            <td>${element.name}</td>
            <td class="columnPrice">${element.price} U$D</td>
            <td class="columnDescription">${element.description}</td>
            <td>
                <img class="imgProducto" src=${element.thumbnail} alt="imagen de ${element.title}">
            </td>
            <td>${element.code}</td>
            <td>${element.quantity}</td>
            <td>
                <input onclick="delProductToCart('${element.code}')" type="button" class="botonDelToCart" value="Eliminar del carrito">
            </td>
        </tr>`)
    }).join(" ");
    
    document.getElementById('tablaCarrito').innerHTML = html;
}

// Función para terminar compra
function finishShop(e){
    let mailUser = readCookieEmail();
    socket.emit('finish-shop', {mail: mailUser});
}

// Función para ir a ver el carrito
function showCart(e) {
    window.location.replace('http://' + window.location.host + '/cart');
}

// Función para volver a home desde el carrito
function showProducts(e){
    window.location.replace('http://' + window.location.host + '/home');
}

// Renderizar aviso de compra finalizada
function purchaseCompleted(e){
    window.location.replace('http://' + window.location.host + '/home');
}

//*_________________  Función el perfil  _________________

// Función para ir desde home al perfil
function showProfile(e) {
    window.location.replace('http://' + window.location.host + '/myProfile');
}

//*_______________ ENTRADAS DE SOCKETS _________________

socket.on('productos', data => renderProduct(data));

socket.on('product-added', data => renderPoster(data));
socket.on('product-updated', data => renderPoster(data));
socket.on('product-deleted', data => renderPoster(data));

socket.on('cart-table', data => renderCart(data));

socket.on('product-added-to-cart', data => renderPoster(data));
socket.on('product-deleted-to-cart', data => renderPoster(data));
socket.on('purchase-completed', data => purchaseCompleted(data));