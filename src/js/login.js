
import { mostrarPopover } from './componentes.js'
import { inicializarPopovers } from './componentes.js'

$(document).ready(() => init());
function init() {
    inicializarPopovers()
    FormularioRegistro()
}




function FormularioRegistro() {
    /* Formulario de registro */

    $("#formulario-registro").submit(function (event) {
        event.preventDefault();
        validaciones()
        console.log('sdasd')
    })

    $('#InputFecha').on('change', function () {
        $('#check-date2').css('display', 'inline-block')
        $('#check-date1').css('display', 'none')

    })
}
function validaciones() {
    const nombreUsuario = $("#InputNombre").val();
    const email = $("#InputEmail").val();
    const fechaEntrega = $("#InputFecha").val();
    const direccionEntrega = $("#InputDireccion").val();
    let valid = true
    let mensajeCabecera
    let fechaRegistrada = new Date($('#InputFecha').val())
    let fechaActual = new Date()

    if (nombreUsuario.lenght < 15 || nombreUsuario === "") {
        mostrarPopover("#InputNombre", "El nombre debe tener al menos 4 caracteres");
        valid = false;
    }
    if (fechaRegistrada < fechaActual) {
        let mensajeFecha = 'La fecha tiene q ser posterior a la de hoy.'
        alert(mensajeFecha)
        mostrarPopover($('#InputFecha'), mensajeFecha)
        valid = false
        return;
    }
    if (!validarEmail(email) || email === "") {
        mostrarPopover("#InputEmail", "Por favor, introduce una dirección de correo válida");
        valid = false;
    }
    if (direccionEntrega.lenght < 30 || direccionEntrega === "") {
        mostrarPopover("#InputDireccion", "La dirección debe tener al menos 5 caracteres");
        valid = false;
    }
    if (valid) {
        mensajeCabecera = 'Petición exitosa'
        const datosFormulario = {
            cabecera: mensajeCabecera,
            nombre: nombreUsuario,
            email: email,
            fecha: fechaEntrega,
            direccion: direccionEntrega
        };
        mostrarModal(datosFormulario)
        $("#formulario-registro").submit()
    } else {
        mensajeCabecera = 'Petición fallida'
        let dato = 'no valido'
        const datosFormularioIcompletos = {
            cabecera: mensajeCabecera,
            nombre: dato,
            email: dato,
            fecha: dato,
            direccion: dato
        }
        mostrarModal(datosFormularioIcompletos)
        $("#formulario-registro").submit()

    }
    return valid
}
function mostrarModal(datos) {

    const modalContent = `
    <h3 >Estos son los datos de tu entrega</h3>
      <p><b>Nombre:</b> ${datos.nombre}</p>
      <p><b>Email:</b> ${datos.email}</p>
      <p><b>Fecha de Entrega:</b> ${datos.fecha}</p>
      <p><b>Dirección de Entrega:</b> ${datos.direccion}</p>
    `;
    $('#informacionVenta').text(datos.cabecera)
    $('#modal-body-content').html(modalContent);
    $('#modalInfoVenta').modal('show');
}
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}