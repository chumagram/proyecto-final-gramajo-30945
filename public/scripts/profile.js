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

function getImage (){
    let alias = readCookieUser();
    let html = `<img src="/images/uploads/avatar-${alias}.jpg" id="avatarImg"></img>`
    document.getElementById('divImgAvatar').innerHTML = html;
}

getImage()