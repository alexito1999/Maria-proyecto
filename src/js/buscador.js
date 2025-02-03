import Carrito from './Carrito.js';
import Producto from './Producto.js'
/* import interObserver from './intersectionObserver.js'
 */
$(document).ready(() => init());

async function init() {
  const datos = await datosJson(); // Espera a que los datos se carguen antes de continuar
  if (datos) {
    operacionesJson(datos); // Procesa los datos
  } else {
    console.log("No se pudieron cargar los datos.");
  }
  añadirAlCarrito(); // Ahora que los productos están en el DOM, activamos el evento
/*   seguimiendoCabecera();
 */  FormularioRegistro();
  ConstructorDesplegableCarrito();
}

async function datosJson() {
  try {
    const response = await $.ajax({
      url: "json/productos.json",
      dataType: "json",
    });
    console.log("Datos cargados:", response);
    return response;
  } catch (error) {
    console.log("Disculpe, existió un problema:", error);
    return null;
  }
}

function operacionesJson(json) {
  mostrarDatosProductos(json);
  cardsPrincipales(json);
  buscarProductos(json);
  crearCarrusel("#containerCarousel", "carruselPrincipal", json.carruselPrincipal)
}


function seguimiendoCabecera() {

  // Inicializar ScrollMagic
  var controller = new ScrollMagic.Controller();
  // create a scene

  // Crear escena
  var scene = new ScrollMagic.Scene({
    triggerElement: '#header',
    triggerHook: 0
  })
    .setPin('#header')
    .addTo(controller);

  // Mostrar u ocultar la cabecera según la dirección del desplazamiento
  var lastScrollTop = 0;
  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var header = document.getElementById('header');

    if (scrollTop > lastScrollTop) {

      header.style.top = `-${header.offsetHeight}px`; // Ocultar la cabecera
    } else {
      header.style.top = '0';
    }

    lastScrollTop = scrollTop;
  });
}
function crearCarrusel(container, id, data) {
  let itemsComponents = "";
  $.each(data, (index, item) => {
    itemsComponents += `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img
          src="${item.imagen}"
          class="d-block w-100"
          alt=""
        />
        <div class="carousel-caption d-none  d-md-block">
          <h2 class="title-importants">${item.captionTitulo}</h2 >
          <p>
            ${item.captionTexto}
          </p>
        </div>
      </div>
      `
  })

  let newComponentCarrusel = `
    <div
          id="${id}"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            ${itemsComponents}
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#${id}"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#${id}"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
    `
  $(container).html(newComponentCarrusel);
}

function cardsPrincipales(json) {
  /* Variables */
  const JsonCardsPrincipales = json.cardsPrincipales;

  $.each(JsonCardsPrincipales, (index, elem) => {
    let newElem = $(`
    <button class="card">
      <img src="${elem.imagen}" alt="" />
      <h1>${elem.titulo}</h1>
      </button>`);
    $("#box-card-principales").append(newElem);
  });
}
function mostrarProductosCarrusel(json) {
  const jProductos = json.productos;
  console.log("datos por Carrusel imagen", jProductos[0].imagen);


  let carrusel = $("#carousel-products .carousel-inner")

  $.each(jProductos, (index, elem) => {
    let newElem = $(`
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="${elem.imagen}" class="card-img-top" alt="...">
      </div>
  `)
    console.log("datos por Carrusel", carrusel);
    carrusel.append(newElem)

  })
}
function mostrarDatosProductos(json) {
  /* Variables */
  const jProductos = json.productos;
  /* Bucle constructor */
  $.each(jProductos, (index, elem) => {

    let newElem = $(`
        <div class="product columna" ">
              <div class="card btn btn-light" data-id="${elem.id}">
                <div class="imagen ">
                  <img src="${elem.imagen}"  alt="...">
                </div>
                <div class="card-body">
                  <h5 class="card-title">${elem.nombre}</h5>
                  <p class="card-descripcion"><b>Descripcion: </b> ${elem.descripcion}.</p>
                </div>
                <div class="card-footer">
                <span class="card-precio"> ${elem.precio} €</span>

                  <buton class="btn btn-dark comprar">Comprar</buton>
                </div>
            </div>
      </div>`);
    $(".box-products").append(newElem);

  });
}

function MostrarCuadroSugerencias(json) {
  /* Variables */
  const jProductos = json.productos;
  let input = $(".input-search");
  let listaSugerencia = $(".lista-sugerencia");
  /* Al teclear en el input*/

  input.keyup(function () {
    let busquedaCoincidente = $(this).val().toLowerCase();
    let count = 0;
    listaSugerencia.empty();

    $.each(jProductos, function (index, elem) {
      let nombre = elem.nombre.toLowerCase();
      if (nombre.includes(busquedaCoincidente) && count < 5) {
        let newElem = $(`
          <li class="lista"><i class='bi bi-chevron-right'></i>
          ${elem.nombre}
          </li>`);
        listaSugerencia.append(newElem);
        count++;
      }
    });

    if (input.val() === "") {
      listaSugerencia.empty();
    }
  });

  /* Al hacer click en la sugerencia */
  listaSugerencia.on("click", ".lista", function () {
    let nombre = $(this).text().trim();
    console.log(nombre);
    input.val(nombre);
    listaSugerencia.empty();
  });
  /* Al borrar el input usando el botón de cancelar del navegador */
  input.on('input', function () {
    if ($(this).val() === '') {
      listaSugerencia.empty();
    }
  });
}

function buscarProductos(json) {
  /* Variables */
  const jProductos = json.productos;

  /* Funcion previa */
  MostrarCuadroSugerencias(json);

  /* Funcion del formulario */
  $(".formulario-busqueda").submit(function (event) {
    event.preventDefault();
    $(".card-filtrada").remove();

    let busqueda = $(".input-search").val().toLowerCase();
    $(".lista-sugerencia").empty();
    $(".input-search").val("");

    console.log("PRODUCTOS QUE TENEMOS:", jProductos);
    console.log("Valor del input:", busqueda);

    let productoEncontrado = jProductos.find(
      (item) => item.nombre.toLowerCase() === busqueda
    );

    if (productoEncontrado) {
      console.log("Producto encontrado:", productoEncontrado.nombre);
      let newElem = $(`
      <div class="card-filtrada card">
      <div class="cabecera ">
      <h1>Producto buscado</h1>
      <button class="boton-cancelar"><i class="bi bi-x-circle"></i>
        </button>
      </div>      
        <div class="card btn btn-dark h-100">
                <div class="imagen ">
                  <img src="${productoEncontrado.imagen}" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                  <h5 class="card-title">${productoEncontrado.nombre}</h5>
                  <p class="card-descripcion"><b>Descripcion: </b> ${productoEncontrado.descripcion}.</p>
                </div>
                <div class="card-footer">
                <p class="card-precio"> ${productoEncontrado.precio}</p>

                  <buton class="btn btn-dark comprar">Comprar</buton>
                </div>
        </div>
      </div>
      `);
      $("#box-card-filtrado").append(newElem);
      // Eliminar card al hacer clic en el botón
      $(".boton-cancelar").click(function () {
        $(".card-filtrada").remove();
      });
    } else {
      console.log("Producto no encontrado");
    }
  });
}
/* Array de los productos de las compras */
const carrito = new Carrito()

function añadirAlCarrito() {
  //container-products
  $(".box-products").on("click", ".product .card", function () {
    /* Encontrar la card mas cercana */
    const card = $(this).closest(".card");
    console.log("sdsasd")

    /* variables de los datos del producto */
    const id = card.data("id");
    const nombre = card.find(".card-title").text();
    const descripcion = card.find(".card-descripcion").text();
    const precio = card.find(".card-precio").text();

    /* Agregar producto al carrito */
    const producto = new Producto(id, nombre, descripcion, precio);
    carrito.añadirProducto(producto);

    /* Muestro en consola los productos */
    console.log(carrito);
    $(".container-carrito .badge").text(carrito.contarProductos())
    actualizarCarrito()

  });
}


function actualizarCarrito() {

  $(".cuerpo-carrito").empty();
  $("#total").text(""); // Limpia el total previo

  if (carrito.productos.length === 0) {
    const newElem = $(`<i class="bi bi-cart-x carroVacio"></i>
        <h1>La cesta de compras esta vacia</h1>`)
    $(".cuerpo-carrito").append(newElem)
    $(".footer-carrito button").css("display", "none")

  } else {
    carrito.productos.forEach(function (producto) {

      const newElem = $(`
        <div class="line" data-id="${producto.id}">
          <span class="col-2" id="cantidad">${producto.cantidad}</span>
          <span class="col-6" id="nombre">${producto.nombre}</span>
          <span class="col-2"  id="precio">${producto.precio}</span>
          <button class="col-2 borrar"><i class="bi bi-trash"></i></button>
        </div>
        `);
      $(".cuerpo-carrito").append(newElem);
    });

    $("#total").text(`${carrito.calcularTotal()} €`); // Mostrar el total
    $(".footer-carrito button").css("display", "block")
  }


}

function ConstructorDesplegableCarrito() {
  eliminarLineaProducto()

  /* Eventos al clicar al icono carrito */
  //Abro el deplegable
  $("#carrito").click(function () {
    let carrito = $(".datos-compra");
    let rightValue = parseInt(carrito.css("right")); // Convierte a número
    let isHidden = rightValue < 0; // Verifica si está oculto

    carrito.animate({ right: isHidden ? '0' : '40rem' });
    actualizarCarrito();

  });

  //Cierro el desplegable
  $(".close").click(function () {
    $(".datos-compra").animate({ right: '-40rem' });
  });
}

function eliminarLineaProducto() {
  $(".cuerpo-carrito").on("click", ".borrar", function () {
    console.log("borrrar")
    const productId = $(this).closest(".line").data("id"); // Obtiene el ID
    console.log(productId)
    carrito.eliminarProducto(productId)

    actualizarBadge()
    actualizarCarrito()
  })

}
function actualizarBadge() {
  console.log("actualizado");

  const totalProductos = carrito.contarProductos();
  $(".container-carrito .badge").text(totalProductos);
}
/* Base de datos de clientes */
let userData = {
  cliente: [],
};

function FormularioRegistro() {
  /* Formulario de registro */
  $(".formulario-registro").submit(function (event) {
    event.preventDefault();

    let cliente = {};
    if (!validarFormulario()) {
      // Detener la ejecución si la validación no pasa
      return;
    }
    /* Datos del usuario al array */
    cliente.nombreUsuario = $("#InputNombre").val();
    cliente.password = $("#InputPassword1").val();
    cliente.email = $("#InputEmail1").val();
    console.log("cliente:", cliente);
    userData.cliente.push(cliente);
    console.log("Usuarios:", userData);

    // Imprimir los datos en la consola
    console.log("Nombre de usuario:", cliente.nombreUsuario);
    console.log("Email:", cliente.email);
    console.log("Contraseña:", cliente.password);

    // Aquí puedes enviar el formulario o realizar alguna acción adicional
    alert(
      "\nMensaje informativo\n Estos son tus datos \n" +
      "\n*Usuario: " +
      cliente.nombreUsuario +
      "\n*Email: " +
      cliente.email +
      "\n*Contraseña: " +
      cliente.password
    );

    /* Restablecer datos */
    $("#InputNombre").val("");
    $("#InputPassword1").val("");
    $("#InputPassword2").val("");
    $("#InputEmail1").val("");


  });
}

function validarFormulario() {
  /* Variables de los campos */
  const nombreUsuario = $("#InputNombre").val();
  const password = $("#InputPassword1").val();
  const password1 = $("#InputPassword2").val();
  const email = $("#InputEmail1").val();

  /* Validaciones */
  if (nombreUsuario.length < 4) {
    alert("El nombre de usuario debe tener al menos 4 caracteres");
    return false;
  }

  if (!validarEmail(email)) {
    return false;
  }

  if (password.length < 4) {
    alert("La contraseña debe tener al menos 4 caracteres, es muy insegura");
    return false;
  }

  if (password !== password1) {
    alert("Las contraseñas no coinciden");
    return false;
  }

  /* Verificaciones de nombre y correo existentes */
  const usuarioExistente = userData.cliente.find(
    (cliente) => cliente.nombreUsuario === nombreUsuario
  );
  if (usuarioExistente) {
    alert("El nombre de usuario ya está en uso");
    return false;
  }

  const emailExistente = userData.cliente.find(
    (cliente) => cliente.email === email
  );
  if (emailExistente) {
    alert("El correo electrónico ya está en uso");
    return false;
  }
  /* Si esta todo correcto devuelve true y continua */
  return true;
}
function validarEmail(email) {
  // Expresión regular para validar el formato del correo electrónico
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validar el formato del correo electrónico
  if (!regex.test(email)) {
    alert("El correo electrónico no es válido");
    return false; // El correo electrónico es válido
  }
  return true; // El correo electrónico es válido
}

function ActivadorPopovers() {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
}
