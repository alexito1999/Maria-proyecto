
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

    })

    $('#InputFecha').on('change', function () {
        $('#check-date2').css('display', 'inline-block')
        $('#check-date1').css('display', 'none')

    })
}
function validaciones() {
    let valid = true
    const nombreUsuario = $("#InputNombre").val();
    const email = $("#InputEmail").val();
    const fechaEntrega = $("#InputFecha").val();
    const direccionEntrega = $("#InputDireccion").val();
    let fechaRegistrada = new Date($('#InputFecha').val())
    let fechaActual = new Date()

    if (fechaRegistrada < fechaActual) {
        let mensajeFecha = 'La fecha tiene q ser posterior a la de hoy.'
        alert(mensajeFecha)
        mostrarPopover($('#InputFecha'), mensajeFecha)
        valid = false
        return;
    }

    if (valid) {
        const datosFormulario = {
            nombre: nombreUsuario,
            email: email,
            fecha: fechaEntrega,
            direccion: direccionEntrega
        };
        mostrarModal(datosFormulario)
        $('#formulario-registro')[0].reset();
    }
    return valid
}
function mostrarModal(datos) {
    const modalContent = `
                  <h3 class="">Estos son los datos de tu entrega</h3>
      <p><b>Nombre:</b> ${datos.nombre}</p>
      <p><b>Email:</b> ${datos.email}</p>
      <p><b>Fecha de Entrega:</b> ${datos.fecha}</p>
      <p><b>Dirección de Entrega:</b> ${datos.direccion}</p>
    `;
    $('#modal-body-content').html(modalContent);
    $('#modalInfoVenta').modal('show');
}
