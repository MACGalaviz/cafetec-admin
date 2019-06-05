const content = document.getElementById("tBody");

function getConnection(host) {
    console.log("hola");
    $.ajax({
        url: `http://localhost:3977/api/orden/`,
        success: function(response) {
            let json = JSON.parse(response);
           console.log(json);
            json.forEach(e=>{
                let json2 = JSON.parse(e.pedido);
                drawItem(e);

                json2.forEach(w=>{
                    drawItem2(w,e.id);

                });
            });
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });
}

function drawItem(e){
    //const image = `${e.thumbnail.path}/portrait_uncanny.${e.thumbnail.extension}`;
    let hero = `
    <tr>
      <th scope="row">${e.orden_code}</th>
        
      <td>${e.control_number}</td>
      <td >
      <table class="table" border="true">
  <thead class="thead-light">
    <tr>
      <th scope="col">Código de barras</th>
      <th scope="col">Nombre</th>
      <th scope="col">Detalles</th>
      <th scope="col">Precio</th>
    </tr>
  </thead>
  <tbody id="${e.id}">
    
  </tbody>
</table>
</td>
      <td>$${e.costo} pesos</td>
      <td>${e.status}</td>
      <td>
      <button class="btn btn-primary" onclick="statusOrden(${e.id},2);">Aceptar Orden</button><br>
      <button class="btn btn-danger" onclick="statusOrden(${e.id},3);">Cancelar Orden</button><br>
      <button class="btn btn-success" onclick="statusOrden(${e.id},4);">Finalizar Orden</button>
      </td>
    </tr>
    `;
    content.insertAdjacentHTML('beforeEnd',hero);
}

function drawItem2(json2,id){
    //const image = `${e.thumbnail.path}/portrait_uncanny.${e.thumbnail.extension}`;
    let hero = `
    <tr>
      <th scope="row">${json2.code_number}</th>
      <td>${json2.name}</td>
      <td>${json2.details}</td>
      <td>$${json2.price} pesos</td>     
    </tr>
    `;
    let content2 = document.getElementById(id);
    content2.insertAdjacentHTML('beforeEnd',hero);
}

function statusOrden(id,status){
    const url = `http://192.168.1.14:3977/api/orden/${id}`;
    let data = {status_orden_id:status};
    $.ajax({
        url: url,
        method: 'PATCH', // or 'PUT'
        dataType: "json",
        data: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        },
        success: function(response) {
            console.log(response);
/*            if(response.length == 0){
                Swal.fire({
                    title: 'Uy, Hubo un problema',
                    text: 'Error al guardar la nueva contraseña',
                    type: 'error'
                })
            }else{
                Swal.fire({
                    title: 'Lo lograste!',
                    text: 'has modificado tu contraseña correctamente, felicidades!',
                    type: 'success'
                })
                logOut();
            }*/
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


function buscarOrden() {

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
