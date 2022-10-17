//Variables
const formulario = document.querySelector("#formulario");
const respuestaMontoTotal = document.getElementById("respuestaMontoTotal");
const respuestaMontoMensual = document.getElementById("respuestaMontoMensual");

let listUser = [];



//Caracteristicas prestamos
const interes = [15,30,45];
const sueldosMinimos = [60000, 100000, 175000, 300000];
const prestamos = [125000, 250000, 500000, 800000];


//Evento confirmar informacion
formulario.addEventListener("submit", confirmarInformacion);


//Mis funciones
//Funcion al clickear el botos "confirmar", pregunta si estamos seguros de la decision y transforma todos los inputs en valores.
function confirmarInformacion(e){
  e.preventDefault();
  Swal.fire({
    title: '¿Desea confirmar su solicitud de prestamo?',
    showDenyButton: true,
    confirmButtonText: 'Confirmar',
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      botonConfirmacion();
    }else if (result.isDenied) {
      Swal.fire('Se cancelo su solicitud!', '', 'info')
      setTimeout(reset, 2000);
    }
  })     
}
function botonConfirmacion(){
  let  pnombre = document.getElementById("nombre").value,
  pedad = document.getElementById("edad").value,
  pdni = document.getElementById("dni").value,
  pnumTelefono = document.getElementById("numTelefono").value,
  psueldo = document.getElementById("sueldo").value,
  pcantPrestamo = document.getElementById("cantPrestamo").value,
  pcantidadCuotas = document.getElementById("cantidadCuotas").value,
  pcbu = document.getElementById("cbu").value
  
  //Verifica que los campos contengan informacion
  if(pnombre.length < 1 || pnombre.trim() == ""){
    mensajeError("nombre", "Ingrese su nombre");
  }else if(pedad.length < 1 || pedad.trim() == "" || pedad < 18){
    mensajeError("edad", "Ingrese su edad / Edad no valida");
  }else if(pdni.length < 8 || pdni.trim() == ""){
    mensajeError("dni", "Ingrese su DNI");
  }else if(pnumTelefono.length < 10 || pnumTelefono.trim() == ""){
    mensajeError("numTelefono", "Ingrese su numero celular / Ingrese un numero correcto");
  }else if(psueldo.length < 1 || psueldo.trim() == ""){
    mensajeError("sueldo", "Ingrese su sueldo");
  }else if(pcantPrestamo.length < 1 || pcantPrestamo.trim() == ""){
    mensajeError("cantPrestamo", "Ingrese la cantidad que desea de prestamo");
  }else  if(pcantidadCuotas.length < 1 || pcantidadCuotas.trim() == ""){
    mensajeError("cantidadCuotas", "Ingrese en cuantas cuotas desea sacarlo");
  }else if(pcbu.length != 22 || pcbu.trim() == ""){
    mensajeError("cbu", "Ingrese su cbu/cvu / Ingrese un cbu/cvu correcto");
  }else{
    Swal.fire('Se completo con exito su solicitud!', '', 'success')
    
    let pedad = parseInt(document.getElementById("edad").value),
    pdni = parseInt(document.getElementById("dni").value),
    pnumTelefono = parseInt(document.getElementById("numTelefono").value),
    psueldo = parseFloat(document.getElementById("sueldo").value),
    pcantPrestamo = parseFloat(document.getElementById("cantPrestamo").value),
    pcantidadCuotas = parseInt(document.getElementById("cantidadCuotas").value)

    addUser(pnombre, pedad, pdni, pnumTelefono, psueldo, pcantPrestamo, pcantidadCuotas, pcbu);
  }
}

//Los valores recibidos de la anterior funcion los pasa a un objeto, se hace una simulacion de una "subida de datos", chequea si los datos colocados son correctos y saca las cuentas de intereses
function addUser(pnombre, pedad, pdni, pnumTelefono, psueldo, pcantprestamo, pcantidadcuotas, pcbu){
  let user = {
      nombre: pnombre,
      edad: pedad,
      dni: pdni,
      numTelefono: pnumTelefono,
      sueldo: psueldo,
      cantPrestamo: pcantprestamo,
      cantidadCuotas: pcantidadcuotas,
      cbu: pcbu
  };
  listUser.push(user);
  LocalStorageUser(listUser);

  fetch('https://my-json-server.typicode.com/Ssanttsz/fetchJSON/user', {
    method:'POST',
    body: JSON.stringify(user),
    headers:{
      "Content-type": "application/json"
    }
  }).then(res=>res.json())
  .then(data=>{
    console.log(data)
    if(user.sueldo < sueldosMinimos[0]){
      Swal.fire('Su sueldo no cumple con el monto minimo para poder sacar prestamos.', '', 'info')
      setTimeout(reset, 5000);
     }else if(user.sueldo >= sueldosMinimos[0] && user.cantPrestamo <= prestamos[0]){
      CalcularInteres();

     }else if(user.sueldo < sueldosMinimos[1] && user.cantPrestamo >= prestamos[0]){
      Swal.fire(`Su sueldo no cumple con el monto minimo para poder sacar mas de $${prestamos[0]}`, '', 'info')
      setTimeout(reset, 5000);
     }else if(user.sueldo >= sueldosMinimos[1] && user.cantPrestamo <= prestamos[1]){
      CalcularInteres();

     }else if(user.sueldo < sueldosMinimos[2] && user.cantPrestamo >= prestamos[1]){
      Swal.fire(`Su sueldo no cumple con el monto minimo para poder sacar mas de $${prestamos[1]}`, '', 'info')
      setTimeout(reset, 5000);
     }else if(user.sueldo >= sueldosMinimos[2] && user.cantPrestamo <= prestamos[2]){
      CalcularInteres();

     }else if(user.sueldo < sueldosMinimos[3] && user.cantPrestamo >= prestamos[2]){
      Swal.fire(`Su sueldo no cumple con el monto minimo para poder sacar mas de $${prestamos[2]}`, '', 'info')
      setTimeout(reset, 5000);
     }else if(user.sueldo >= sueldosMinimos[3] && user.cantPrestamo <= prestamos[3]){
      CalcularInteres();

     }else if(user.cantPrestamo > prestamos[3]){
      Swal.fire(`Su sueldo no cumple con el monto minimo para poder sacar mas de $${prestamos[3]}`, '', 'info')
      setTimeout(reset, 5000);
    }

    function CalcularInteres(){
      if(user.cantidadCuotas === 3 || user.cantidadCuotas === 6 || user.cantidadCuotas === 12){
        
        if(user.cantidadCuotas == 3){
          totalDevolver = user.cantPrestamo + (user.cantPrestamo * interes[0]) / 100;
          cuotaMensual = totalDevolver / 3;
          Swal.fire({
            title: 'Solicitud creada con exito',
            html: `Usuario:  ${data.nombre}
            <br>
            Edad: ${data.edad}
            <br>
            DNI: ${data.dni}
            <br>
            Celular: ${data.numTelefono}
            <br>
            Sueldo: $${data.sueldo}
            <br>
            Prestamo: $${data.cantPrestamo}
            <br>
            CVU/CBU: ${data.cbu}
            <br>
            Total a devolver: $${totalDevolver} en ${data.cantidadCuotas} cuotas
            <br>
            Cuota mensual: $${cuotaMensual} 
            `,
          })
        }else{
          if(user.cantidadCuotas == 6){
              totalDevolver = user.cantPrestamo + (user.cantPrestamo * interes[1]) / 100;
              cuotaMensual = totalDevolver / 6;
              Swal.fire({
                title: 'Solicitud creada con exito',
                html: `Usuario:  ${data.nombre}
                <br>
                Edad: ${data.edad}
                <br>
                DNI: ${data.dni}
                <br>
                Celular: ${data.numTelefono}
                <br>
                Sueldo: $${data.sueldo}
                <br>
                Prestamo: $${data.cantPrestamo}
                <br>
                CVU/CBU: ${data.cbu}
                <br>
                Total a devolver: $${totalDevolver} en ${data.cantidadCuotas} cuotas
                <br>
                Cuota mensual: $${cuotaMensual} 
                `,
              })
          }else{
              if(user.cantidadCuotas == 12){
                  totalDevolver = user.cantPrestamo + (user.cantPrestamo * interes[2]) / 100;
                  cuotaMensual = totalDevolver / 12;
                  Swal.fire({
                    title: 'Solicitud creada con exito',
                    
                    html: `<label style="text-align: left;">Usuario:  ${data.nombre}</label>
                    <br>
                    <label>Edad: ${data.edad}</label>
                    <br>
                    <label>DNI: ${data.dni}</label>
                    <br>
                    <label>Celular: ${data.numTelefono}</label>
                    <br>
                    <label>Sueldo: $${data.sueldo}</label>
                    <br>
                    <label>Prestamo: $${data.cantPrestamo}</label>
                    <br>
                    <label>CVU/CBU: ${data.cbu}</label>
                    <br>
                    <label>Total a devolver: $${totalDevolver} en ${data.cantidadCuotas} cuotas</label>
                    <br>
                    <label>Cuota mensual: $${cuotaMensual}</label>
                    `,
                    customClass: {
                      html: 'htmlSweet',
                      title: 'tituloSweet'
                    }
                  })
                  Swal.fire({
                    title: 'Solicitud creada con exito',

                  })
              }
          }
        }
      }else{
        Swal.fire(`Cuota incorrecta`, '', 'info')
      }
    
    }
  })
}
    
  
//Funcion para recargar la pagina
function reset(){
    location.reload();
}

//Funcion para cargar informacion del usuario al LocalStorage
function LocalStorageUser(plist){
  localStorage.setItem('User', JSON.stringify(plist));
}

//Mensaje error en los campos de informacion
function mensajeError(claseInput, mensaje){
  let elemento = document.querySelector(`.${claseInput}`);
  elemento.lastElementChild.innerHTML = mensaje;
}