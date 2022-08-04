//*______________________ ERRORES AL REGISTRARSE ______________________

try {
    // Leemos la cookie de error en el register
    let registerErr = document.cookie
    .split('; ')
    .find(row => row.startsWith("registerErr="))
    ?.split('=')[1];

    if (registerErr) mostrarErrRegister();

} catch (error){
    console.log(error)
}

function mostrarErrRegister(e){
    document.querySelector('#errRegister').style.display = 'block';
    document.querySelector('#atenuarErr').style.display = 'block';
}
function ocultarErrRegister(e){
    document.querySelector('#errRegister').style.display = 'none';
    document.querySelector('#atenuarErr').style.display = 'none';
}

//*______________________ FORMULARIO PARA REGISTRARSE ______________________


function ocultarCrearUsuario(e){
    window.location.replace('http://' + window.location.host);
}