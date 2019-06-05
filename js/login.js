//const login = document.getElementById("login");
//const loginForm = document.getElementById("loginForm").submit();
// console.log(loginForm);
//import * as host from "./script";

function login(){
    /*let host2 = document.getElementById("host");
    console.log(host2.value.trim());*/
    let host = "192.168.1.14";//host2.value.trim();
    let userInput = document.getElementById("userInput");
    let passwordInput = document.getElementById("passwordInput");
    let user = userInput.value.trim();
    console.log(user);
    let password = passwordInput.value.trim();
    console.log(password);
    const url = `http://${host}:3977/api/user`;
    let data = {control_number: user, password: password};
    console.log(data);

    /*fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:',response);
            localStorage.setItem("userData",JSON.stringify(response[0]));
            console.log(localStorage.getItem("userData"));
        });*/

    $.ajax({
        url: `http://${host}:3977/api/user`,
        method: 'POST', // or 'PUT'
        dataType: "json",
        data: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(response) {
            console.log(response);
            if(response.length == 0){
                Swal.fire({
                    title: 'Uy, seguro que eres tu?',
                    text: 'Ese usuario y/o contraseña no se encuentran en nuestra base de datos.',
                    type: 'error'
                })
            }else{
                localStorage.setItem("userData",JSON.stringify(response[0]));
                console.log(JSON.parse(localStorage.getItem("userData")));
                afterLogin();
                Swal.fire({
                    title: 'Lo lograste!',
                    text: 'has iniciado sesión correctamente, felicidades!',
                    type: 'success'
                })
            }
        },
        error: function() {
            Swal.fire({
                title: 'Comprueba tu conexión...',
                text: 'Será posible que no cuentes con una conexión a internet?, o datos...',
                type: 'question'
            })
        }
    });

    $('#modalClose').click();
    userInput.value = "";
    passwordInput.value = "";
    //afterLogin();
}
//login();

//TODO parametros a login() asignar datos y cerrar sesion

function afterLogin() {
    let userNameText = document.getElementById("userNameText");
    let userCashText = document.getElementById("userCashText");
    const btnLogin = document.getElementById("btnLogin");
    const btnChangePassword = document.getElementById("btnChangePassword");
    const btnLogOut = document.getElementById("btnLogOut");
    const btnCarrito = document.getElementById("btnCarrito");
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData);

    //Mostrar en html
    userNameText.style.display = "";
    userCashText.style.display = "";
    btnChangePassword.style.display = "";
    btnLogOut.style.display="";
    btnCarrito.style.display="";

    // Ocultar en html
    btnLogin.style.display = "none";

    // mostrar
    userNameText.innerText = "#Control: "+userData.control_number;
    userCashText.innerText = "Monedero: $"+userData.cash;

}

function logOut(){
    let userNameText = document.getElementById("userNameText");
    let userCashText = document.getElementById("userCashText");
    const btnLogin = document.getElementById("btnLogin");
    const btnChangePassword = document.getElementById("btnChangePassword");
    const btnLogOut = document.getElementById("btnLogOut");
    //const btnCarrito = document.getElementById("btnCarrito");
    localStorage.removeItem("userData");
    // Ocultar en html
    userNameText.style.display = "none";
    userCashText.style.display = "none";
    btnChangePassword.style.display = "none";
    btnLogOut.style.display="none";
    //btnCarrito.style.display="none";

    // Mostrar en html
    btnLogin.style.display = "";
    //location.reload();
}

if(localStorage.getItem("userData")){
 afterLogin();
}
