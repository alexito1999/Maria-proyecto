$(document).ready(() => init());

function init() {
  $.ajax({
    url: "json/productos.json",
    //data : { id : 2 },
    /* type: "GET", */
    dataType: "json",
    success: function (json) {
      operaciones(json);
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema");
    },
    complete: function (xhr, status) {
      console.log("Petición realizada");
    },
  });
  if ($(".input-search").val() === "") {
    $(".lista-sugerencia").empty();
  }
}

function operaciones(json) {
  mostrarDatosProductos(json);
  cardsPrincipales(json);
  buscarProductos(json);
  FormularioRegistro();
  añadirAlCarrito();
  ConstructorDesplegableCarrito()
  ActivadorPopovers();
  /* prueba */
  /*   mostrarProductosCarrusel(json)
   */
  crearCarrusel("#containerCarousel", "carruselPrincipal", json.carruselPrincipal)
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
        <div class=" columna">
              <div class="card btn btn-light">
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
let carrito = [];

function añadirAlCarrito() {

  $("#box-card-filtrado, .box-products").one("click", ".comprar", function () {
    /* Encontrar la card mas cercana */
    const card = $(this).closest(".card");

    /* variables de los datos del producto */
    const nombre = card.find(".card-title").text();
    const descripcion = card.find(".card-descripcion").text();
    const precio = card.find(".card-precio").text();

    const productoExistente = carrito.find(
      (producto) => producto.nombre === nombre
    );
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      /* Objeto para cada producto */
      const producto = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        cantidad: 1
      };
      carrito.push(producto);
    }

    /* Muestro en consola los productos */
    console.log(carrito);
    /* Agregar producto al carrito */
  });
}

function ConstructorDesplegableCarrito() {
  añadirAlCarrito()

  $("#carrito").click(function () {
    console.log("clike");
    $(".datos-compra").show()
    if (carrito.length === 0) {
      $("#total").append(0, " €");

    }
    carrito.forEach(function (producto) {
      console.log("datos:" + producto.nombre);

      let newElem = $(`
      <div class="row">
        <div class="col-3 " id="cantidad">${producto.cantidad}</div>
        <div class="col-3 " id="nombre">${producto.nombre}</div>
        <div class="col-3" id="precio">${producto.precio}</div>
        <div class="col-3" id="borrado"><button class="borrar">Borrar</button></div>      
      </div>
      `);
      $(".cuerpo-carrito").append(newElem);
      total += producto.precio; // Sumar el precio de cada producto al total

    });

  });
  $("#carrito").blur(function () {
    $(".datos-compra").hide()
  })
  $(".borrar").click(function () {
    $(".datos-compra").hide()
  })
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
