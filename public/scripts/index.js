
//*______________________ ERRORES AL INICIAR SESIÓN ______________________

try {
    // Leemos la cookie de error en el mail
    let emailErr = document.cookie
    .split('; ')
    .find(row => row.startsWith("initErr="))
    ?.split('=')[1];

    if (emailErr) mostrarErrSession();

} catch (error){
    console.log(error)
}

function ocultarErrSession(e){
    document.querySelector('#errInitSession').style.display = 'none';
    document.querySelector('#atenuarErr').style.display = 'none';
}
function mostrarErrSession(e){
    document.querySelector('#errInitSession').style.display = 'block';
    document.querySelector('#atenuarErr').style.display = 'block';
}

function toCreateUser(e){
    window.location.replace('http://' + window.location.host + '/registrarse');
}