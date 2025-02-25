import Carrito from './Carrito.js';
import Producto from './Producto.js'
$(document).ready(() => init());


function init() {
  añadirAlCarrito(); // Ahora que los productos están en el DOM, activamos el evento
  FormularioRegistro();
  ConstructorDesplegableCarrito();
  animacionCabecera()
  inicializarPopovers()

  /* components */
  /* CABECERA */
  creacionCategorias(".categorias")

  /* MAIN */
  crearCarrusel("#containerCarousel", "carruselPrincipal") //contenedor y el id de los targets de los botones
  /*   eventoProducto()
   */
  mostrarDatosProductos("#container-productos-principales");
  buscador()
  intersectionTitles()


}

/* Datos */
async function cargarProductos() {
  try {
    const response = await fetch("./json/productos.json");
    if (!response.ok) {
      throw new Error('Error al cargar el JSON.');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error:', error);
  }
}
async function cargarCarruselPrincipal() {
  try {
    const response = await fetch("./json/carruselPrincipal.json");
    if (!response.ok) {
      throw new Error('Error al cargar el JSON.');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error:', error);
  }
}
async function cargarCategorias() {
  try {
    const response = await fetch("./json/Categorias.json");
    if (!response.ok) {
      throw new Error('Error al cargar el JSON.');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error:', error);
  }
}
async function obtenerProductosPorCategoria(categoriaId) {
  const data = await cargarProductos()
  console.log('categoriaID: ', categoriaId)
  let productosFiltrado = data.filter(producto => producto.categoria === categoriaId)
  return productosFiltrado
}

/* Funciones */

function inicializarPopovers() {
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}
function mostrarPopover(element, message) {
  $(element).popover({
    content: message,
    placement: "bottom",
    trigger: "manual" // Controlar la apertura y cierre manualmente
  });
  $(element).popover('show');
  setTimeout(function () {
    $(element).popover('hide');
  }, 2000);
  console.log("pulsado")
  // Opcional: eliminar el popover completamente después de ocultarlo
  $(element).on('hidden.bs.popover', function () {
    $(this).popover('dispose');
  });
}
function animacionCabecera() {
  let lastScrollTop = 0;
  const header = document.querySelector('#header');
  const primeraLinea = document.querySelector('.primera-linea');
  const headerHeight = primeraLinea.offsetHeight; // Obtener la altura de la parte que quiero ocultar


  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // Scroll hacia abajo
      header.style.top = `-${headerHeight}px`; // Ajusta este valor según la altura de tu cabecera
      console.log("abajo")
    } else {
      // Scroll hacia arriba
      header.style.top = `-${headerHeight}px`;
      console.log("arriba")

    }

    lastScrollTop = scrollTop;
  });

}

async function creacionCategorias(container) {
  const data = await cargarCategorias()
  let items = ''
  $.each(data, (index, categories) => {
    items += `            
    <article class="title-importants categoria" data-id="${categories.id}">${categories.nombre}</article>
    `;
  })
  $(container).html(items);
  $('.categoria').click(function () {
    const categoriaId = $(this).data('id')
    filtrarProductosPorCategoria(categoriaId);
  })
}
// Nueva función para filtrar productos por categoría
async function filtrarProductosPorCategoria(categoriaId) {
  const productosFiltrados = await obtenerProductosPorCategoria(categoriaId)
  const categoriaFiltrada = await cargarCategorias()
  const nombreCategoria = categoriaFiltrada.find(categoria => categoria.id === categoriaId)

  let titulo = ''
  titulo = ` <h1 class="title-importants title-observer">
    ${nombreCategoria.nombre}
  </h1>`
  let containerProductos = '#container-productos-principales'
  $(containerProductos).empty(); // Limpiar el contenedor antes de agregar los productos filtrados
  $(containerProductos).append(titulo)

  let containerInterno = $('<div id="box-products" class="row"></div>');
  $(containerProductos).append(containerInterno)

  $.each(productosFiltrados, (index, elem) => {
    const newElem = crearCardModeloProducto(elem);
    $(containerInterno).append(newElem);
  });
  intersectionTitles()

}

async function crearCarrusel(container, id) {

  const data = await cargarCarruselPrincipal()
  let itemsCarouselInner = "";
  let itemsCarouselIndicators = "";


  $.each(data, (index, item) => {
    itemsCarouselInner += `
     <div class="carousel-item ${index === 0 ? 'active' : ''}">
         <img
           src="${item.imagen}"
           class="d-block w-100"
           alt=""
         />
         <div class="carousel-caption d-none  d-md-block">
           <h2 class="title-importants title-observer">${item.captionTitulo}</h2 >
           <p>
             ${item.captionTexto}
           </p>
         </div>
       </div>
       `
    itemsCarouselIndicators += `
        <button type="button" data-bs-target="#${id}" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${index}"></button>
      `

  })


  let newComponentCarrusel = `
    <div
          id="${id}"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-indicators">
            ${itemsCarouselIndicators}
          </div>

          <div class="carousel-inner">
            ${itemsCarouselInner}
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
  intersectionTitles()

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

function crearCardModeloProducto(data) {
  /*   let origin = window.location.origin
    let urlProductos = origin + '/productos.html'
    console.log("nueva uri: ", urlProductos) */
  let newElem = '';
  newElem += `
      <article class="product"  data-id="${data.id}">
          <div class="card btn " >
            <div class="imagen " >
              <img class="imagen1" data-image="${data.imagen}" src="${data.imagen}"  alt="...">
              <img class="imagen2" data-image="${data.imagenSecundaria}" src="${data.imagenSecundaria}"  alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">${data.nombre}</h5>
              <p class="card-descripcion"><b>Descripcion: </b> ${data.descripcion}.</p>
            </div>
            <div class="card-footer">
            <span class="card-precio"> ${data.precio} €</span>

              <i class="bi bi-bag-plus buy-button btn  "><span>Comprar</span> </i>
              
            </div>
          </div>
      </article>`;

  return newElem;
}


async function mostrarDatosProductos(container) {
  /* Variables */
  const data = await cargarProductos()

  let titulo = ''
  titulo = ` <h1 class="title-importants title-observer">
          Tienda  <span>A&J</span> medieval
        </h1>`

  $(container).append(titulo);

  let containerInterno = $('<div id="box-products" class="row"></div>');
  /* Bucle constructor */
  $.each(data, (index, elem) => {
    const newElem = crearCardModeloProducto(elem)

    $(containerInterno).append(newElem);

  });
  $(container).append(containerInterno);
  intersectionTitles()

}
/* function eventoProducto() {
  const product = $('.product')
  $(document).on('click', product, () => {
    const productoElegido = $(this)
    const id = productoElegido.data("id");
    console.log(productoElegido)
    console.log(id)

    const imageUrl = $(this).data('image'); // Obtener la URL de la imagen del atributo data-image
    $('#productImage').attr('src', imageUrl); // Establecer la URL de la imagen en el modal
    $('#productModal').modal('show');
    console.log('listo')
  })


} */
function intersectionTitles() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('activo')
      } else {
        entry.target.classList.remove('activo')
      }
    });
  })

  const targets = document.querySelectorAll('.title-observer')
  targets.forEach(target => observer.observe(target))

}
function MostrarCuadroSugerencias(data) {

  /* Variables */
  let inputBuscador = $("#input-search");
  let listaSugerencias = $(".lista-sugerencia");

  /* Al teclear en el input*/
  inputBuscador.keyup(function () {
    let busquedaCoincidente = $(this).val().toLowerCase();
    let count = 0;

    $.each(data, function (index, elem) {
      let nombre = elem.nombre.toLowerCase();
      if (nombre.includes(busquedaCoincidente) && count < 5) {
        let newElem = $(`
          <li class="lista"><i class='bi bi-chevron-right'></i>
          ${elem.nombre}
          </li>`);
        listaSugerencias.append(newElem);
        count++;
      }
    });
  });

  /* Al hacer click en la sugerencia */
  listaSugerencias.on("click", ".lista", function () {
    let nombre = $(this).text().trim();
    console.log(nombre);
    inputBuscador.val(nombre);
    listaSugerencias.empty();
  });
  /* Al hacer clic fuera del input y de la lista de sugerencias */
  $(document).on("click", function (event) {
    if (!$(event.target).closest('#input-search, .lista, .boton').length) {
      inputBuscador.val('')
      listaSugerencias.empty();
    }
  });
}
function buscador() {
  const inputBuscador = $('#input-search')
  const contenedorPadre = $('.container-card-filtrada')
  const botonApertura = $('#boton-apertura')
  const primeraLinea = document.querySelector('#header');
  const headerHeight = primeraLinea.offsetHeight;
  $('.container-buscador-ampliado').css('top', -headerHeight)


  buscarProductos(contenedorPadre);

  botonApertura.click(function (event) {
    event.stopPropagation(); // Evitar el cierre inmediato del overlay
    $('.container-buscador-ampliado').css('top', 0)
    $('.container-buscador-ampliado').css('height', headerHeight)
    inputBuscador.focus()
    $(".overlay").addClass("visible");
  })

  $(document).click(function (event) {
    // Verificar si el clic fue fuera del contenedor emergente y del input de búsqueda
    if (!$(event.target).closest('.container-buscador-ampliado, #input-search, .lista').length) {
      $('.container-buscador-ampliado').css('top', -headerHeight);
      $(".overlay").removeClass("visible");
      $('.linea2').fadeIn('slow');
      $('.linea3').fadeIn('slow');
    }

  })
  $('.container-buscador-ampliado').click(function () {
    console.log('click emerrngente')
  })
  inputBuscador.blur(function (event) {
    event.stopPropagation(); // Evitar el cierre inmediato del overlay
    $(".overlay").removeClass("visible");
  })
  /* Al borrar el input usando el botón de cancelar del navegador */
  /*   inputBuscador.on('input', function () {
      if ($(this).val() === '') {
        listaSugerencias.empty();
      }
    }); */


}
async function buscarProductos(containerfiltrada) {
  /* Variables */
  const data = await cargarProductos()


  const botonBusqueda = document.getElementById('boton');
  const productoFiltradoExistente = $('.container-card-filtrada')
  /* Funcion previa */
  MostrarCuadroSugerencias(data)
  /* Funcion del formulario */
  // obtengo los datos y creo la card del producto
  $(".formulario-busqueda").submit(function (event) {
    event.preventDefault();
    // borro lo q haya en el contenedor
    productoFiltradoExistente.empty();
    // guardo el valor del campo
    let busqueda = $('#input-search').val().trim().toLowerCase()
    // limpio el campo
    $('#input-search').val('')

    if (!busqueda) {
      // Mostrar popover si el campo de búsqueda está vacío
      mostrarPopover(this, "No hay ninguna búsqueda");
    } else {
      const productoEncontrado = data.find(
        (item) => item.nombre.trim().toLowerCase() === busqueda
      );

      if (productoEncontrado) {

        $('#container-productos-principales').empty()
        const cardEncontrada = crearCardModeloProducto(productoEncontrado)
        let newElem = $(`
        <div class="cabecera ">
        <h1 class="title-importants title-observer">Producto buscado</h1>
        <i class="bi bi-x-circle close" role="button"></i>
        </div>      
          ${cardEncontrada}
        `);
        containerfiltrada.append(newElem);
        intersectionTitles()

        // Hacer scroll hasta la nueva card
        $('html, body').animate({
          scrollTop: $("#container-products").offset().top - 50
        })

        // Eliminar card al hacer clic en el botón
        $(".container-card-filtrada .close").click(function () {
          $(".container-card-filtrada").fadeToggle();
          mostrarDatosProductos("#container-productos-principales");
        });
      }
      else {
        console.log("Producto no encontrado");
        mostrarPopover(this, "Producto no encontrado")
      }
    }
  });
}

/* Array de los productos de las compras */
const carrito = new Carrito()
async function añadirAlCarrito() {
  const data = await cargarProductos()
  //container-products

  $("#container-productos-principales").on("click", ".product .buy-button", function () {
    /* Encontrar el div producto mas cercano */

    const cardProducto = $(this).closest('.product');
    console.log(cardProducto)
    const idcardProducto = cardProducto.data("id");
    console.log("id producto", idcardProducto)
    const detallesProducto = data.find((item) => {
      return item.id === idcardProducto
    })

    if (detallesProducto) {
      /* variables de los datos del producto */

      const { nombre, descripcion, precio } = detallesProducto

      /* Agregar producto al carrito */
      const producto = new Producto(idcardProducto, nombre, descripcion, precio);
      carrito.añadirProducto(producto);
      /* Muestro en consola los productos */
      console.log('carrito: ', carrito);
      actualizarCarrito()
      actualizarBadge(detallesProducto)


    } else {
      console.log("error no se encontro el producto")
    }

  });
}


function actualizarCarrito() {

  $(".cuerpo-carrito").empty();
  $("#total").text(`${carrito.calcularTotal()} €`); // Mostrar el total

  /* Si el carrito esta vacio  pone esto*/
  if (carrito.productos.length === 0) {
    const newElem = $(`
        <i class="bi bi-cart-x carroVacio"></i>
        <h1>La cesta de compras esta vacia</h1>
        `)
    $(".cuerpo-carrito").append(newElem)
    $(".footer-carrito button").css("display", "none")

  } else {
    /* Si tiene algo te pone las lineas de producto */
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

    $(".footer-carrito button").css("display", "block")
  }


}

function ConstructorDesplegableCarrito() {
  eliminarLineaProducto()
  actualizarBadge()

  /* Eventos al clicar al icono carrito */
  //Abro el deplegable
  $("#carrito").click(function () {
    $(".datos-compra").toggle(function () {
      // Verificar el estado actual y añadir o remover la clase 'flex' después de la animación
      if ($(this).is(":visible")) {
        $(this).css("display", "flex");
      }
    })
    actualizarCarrito();
  });

  //Cierro el desplegable
  $(".close").click(function () {
    console.log("añadidad clase")
    $(".datos-compra").slideToggle();
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
function actualizarBadge(detallesProducto) {
  console.log("actualizado");
  const badge = $(".container-carrito .badge")
  const totalProductos = carrito.contarProductos();
  console.log(totalProductos, "productos contados")
  badge.text(totalProductos);
  if (detallesProducto) {
    badge.addClass('maxActive');

    // Remover la clase después de un tiempo
    setTimeout(() => {
      badge.removeClass('maxActive');
    }, 150);
  }
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


