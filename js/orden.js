let host3 = "192.168.1.14";//host.value.trim();

function buscarOrden() {
    let idOrden = JSON.parse(localStorage.getItem("idOrden"));
    console.log(idOrden);
    if(idOrden != null){


        $.ajax({
            url: `http://${host3}:3977/api/orden/${idOrden.id}`,
            success: function(response) {
                let data = JSON.parse(response);
                console.log(data.status);
                switch (data.status) {
                    case "Espera":
                        Swal.fire({
                        title: 'Orden en espera',
                        text: 'Tu orden aún no ha sido aceptada, en un momento se volverá verificar.',
                        type: 'warning',
                            onClose: () => {
                            setTimeout(function (){esperaDeRespuesta();},60000);
                        }});
                        break;

                    case "Aceptada":
                        Swal.fire({
                            title: 'Orden aceptada',
                            html: "<p>Tu orden ha sido aceptada, ve a caja con el siguiente código.</p><p><strong>"+data.orden_code+"</strong></p><p>Con él podrás recoger tu orden.</p>",
                            type: 'info',
                            onClose: () => {
                                setTimeout(function (){esperaDeRespuesta();},60000);
                            }});
                        break;

                    case "Cancelada":
                        Swal.fire({
                            title: 'Orden cancelada',
                            html: "<p>Tu orden ha sido cancelada por los siguientes motivos:</p><p><strong> No había ese producto</strong></p>",
                            type: 'error',
                            onClose: () => {
                                localStorage.removeItem("idOrden");
                            }});
                        break;

                    case "Finalizada":
                        Swal.fire({
                            title: 'Orden finalizada',
                            html: "<p>Tu orden ha sido finalizada, gracias por usar nuestro sistema, esperamos que haya sido de su agrado.</p>",
                            type: 'success',
                            onClose: () => {
                                let userData = JSON.parse(localStorage.getItem("userData"));
                                console.log(userData.cash);
                                console.log(idOrden.costo);
                                let cash = userData.cash - idOrden.costo;
                                console.log(cash);
                                let dataTemp = {
                                    id: userData.id,
                                    control_number: userData.control_number,
                                    password: userData.password,
                                    cash: cash,
                                    role_id: userData.role_id,
                                    date: userData.date,
                                    status: userData.status
                                };
                                console.log("dataTemp"+dataTemp);
                                localStorage.setItem("userData",JSON.stringify(dataTemp));
                                localStorage.removeItem("idOrden");
                                localStorage.removeItem("jsonCarrito");
                                window.location.href = "./index.html";
                            }});
                        break;
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

    }
}

function esperaDeRespuesta(){
    buscarOrden();
}

esperaDeRespuesta();
