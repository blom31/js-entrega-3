// Inicializa el DOM para asegurarme de que el html este completamente cargado

document.addEventListener("DOMContentLoaded", function () {
  if (document.body.id === "index") {
    //con esto aseguro estar trabajando en el index

    // Variable Global de pelicula para utilizarla en cualquir parte del código
    let peliculasGuardadas = []; // Almacenar las películas de la API

    // Declaro el Objeto usuario para guardar nombre y apellido en la SessionStorage
    const usuario = {
      nombre: "",
      apellido: "",
    };

    // Declaro el carrito de compras para guardar las películas seleccionadas
    let carritoPeli = [];

    let compraFinal = document.getElementById("compraFinal");

    // Al cargar la página, revisar si hay un nombre guardado en sessionStorage
    const nombreGuardado = sessionStorage.getItem("nombre");
    const apellidoGuardado = sessionStorage.getItem("apellido");

    if (nombreGuardado && apellidoGuardado) {
      usuario.nombre = nombreGuardado;
      usuario.apellido = apellidoGuardado;

      const saludo = document.getElementById("saludo");
      saludo.innerText = `Hola, ${usuario.nombre}. `;
    }
    // Recuperar carrito del localStorage
    const carritoGuardado = localStorage.getItem("carritoPeli");
    if (carritoGuardado) {
      carritoPeli = JSON.parse(carritoGuardado);
      actualizarResumen();
    }

    // Hacer una petición a la API de películas async/await

    const getPeliculas = async () => {
      try {
        //agrego el try/catch para el manejo de errores
        let respuesta = await fetch(
          "https://api.themoviedb.org/3/movie/popular?api_key=a36a0107dd6b1ea8569d698315062324"
        );

        if (!respuesta.ok) {
          throw new Error("Error al obtener películas");
        }

        const peliculas = await respuesta.json();

        peliculasGuardadas = peliculas.results.map((pelicula) => ({
          ...pelicula, //uso funciones para asignar nuevas propiedades como precio  y hora que la Api por defeto no trae
          precio: generarPrecio(),
          hora: generarHorario(),
        }));

        return peliculasGuardadas;
      } catch (error) {
        console.error("Fallo en la API:", error);
        Swal.fire("Error", "No se pudieron cargar las películas", "error");
      }
    };

    function generarPrecio() {
      const precios = [1500, 1800, 2000, 2200, 2500]; // precios posibles
      const indice = Math.floor(Math.random() * precios.length);
      return precios[indice];
    }

    function generarHorario() {
      const horarios = ["14:00", "16:30", "19:00", "21:15", "23:00"]; // horarios posibles
      const indice = Math.floor(Math.random() * horarios.length);
      return horarios[indice];
    }

    // M A N E J O   D E   E V E N T O S  D E S D E   E L  D O M

    // Mostrar las películas en el HTML

    const mostrarPeliculas = () => {
      let cartelera = document.getElementById("carteleraPeliculas");
      let tarjetaPeliculas = "";

      peliculasGuardadas.slice(0, 12).forEach((pelicula, index) => {
        //uso el .slice para que solo me muestre 12 pelis de 20
        //uso un forEach para recorrer el array de películas del index
        tarjetaPeliculas += `<div class="peliculas">
  <img src= "https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="${pelicula.title}"> 
  <p class="tituloPelicula mt-2">${pelicula.title}</p>
  <button class="btnComprar ms-5" data-index="${index}">Comprar</button>
</div>`;
      });
      cartelera.innerHTML = tarjetaPeliculas;
    };

    const loader = document.getElementById("loaderPeliculas");
    loader.style.display = "block"; // Mostrar spinner

    setTimeout(() => {
      getPeliculas().then(() => {
        mostrarPeliculas();
        loader.style.display = "none"; // Oculto el spinner después de 1 segundo
      });
    }, 1000); // Espero 1 segundo antes de cargar las películas

    // Guardar nombre y usuario con datos desde el formulario
    let guardarUsuario = document.getElementById("btnGuardar");
    guardarUsuario.addEventListener("click", (event) => {
      event.preventDefault(); // detiene el reinicio de la pág cuando presione el botón guardar

      const nombre = document.getElementById("nombre").value.trim(); //capturo el valor del input y lo guardo en la var
      const apellido = document.getElementById("apellido").value.trim(); // el trim elimina si hay espacios en blanco

      // esto para validar que los campos no los guarde vacíos
      if (!nombre || !apellido) {
        Swal.fire({
          title: "Ingresa ambos campos antes de continuar",
          icon: "info",
        });
        return;
      }

      usuario.nombre = nombre;
      usuario.apellido = apellido;
      console.log(usuario); // verifico que se guarde correctamente los datos

      sessionStorage.setItem("nombre", usuario.nombre); //guardo los datos en el sessionStorage
      const nombreGuardado = sessionStorage.getItem("nombre"); // recupero los datos

      if (nombreGuardado) {
        // si recupero datos del formulario y los guardo, muestro un saludo
        const saludo = document.getElementById("saludo");
        saludo.innerText = `Hola, ${nombreGuardado}. `;

        window.scrollTo({
          //esto es para desplazarme al top de la pag.
          top: 0,
        });
      }
    });

    // Eventos para los botones de "Comprar"

    document
      .getElementById("carteleraPeliculas")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("btnComprar")) {
          //selecciono los botones de compra

          // Validar si el usuario ha ingresado su nombre
          if (!usuario.nombre.trim()) {
            Swal.fire({
              title: "Inicia Sesión antes de continuar",
              icon: "info",
            });
            return;
          }

          const index = parseInt(e.target.getAttribute("data-index"));
          const peliSeleccionada = peliculasGuardadas[index];

          // Buscar si la película ya está en el carrito
          const peliEnCarrito = carritoPeli.find(
            (p) => p.id === peliSeleccionada.id
          );

          if (peliEnCarrito) {
            peliEnCarrito.cantidad += 1; // Si ya está, aumento la cantidad
          } else {
            peliSeleccionada.cantidad = 1; // Si no está, le agrego cantidad
            carritoPeli.push(peliSeleccionada); // Y la meto al carrito
          }

          actualizarResumen();

          Swal.fire({
            //indico al usuario que agrego la peli al carrito
            icon: "success",
            title: "¡Película agregada!",
            text: `"${peliSeleccionada.title}" se añadió al carrito`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });

    // Mostrar resumen de compra optimizada con metodos como reduce y map
    function actualizarResumen() {
      const total = carritoPeli.reduce(
        // con el reduce calculo el total de la compra
        (acumulador, pelicula) =>
          acumulador + pelicula.precio * pelicula.cantidad,
        0
      );

      console.log(total); //verifico que el total se esté calculando
      const listaPeliculas = carritoPeli
        .map(
          (
            pelicula //el map "sustituye el ciclo for" recorre el array. el map devuelve un nuevo array
          ) =>
            `<li> Título: ${pelicula.title} - Horario: ${
              pelicula.hora
            } - Cantidad: ${pelicula.cantidad} - Subtotal: $${
              pelicula.precio * pelicula.cantidad
            }</li>`
        )
        .join(""); // el join une los elementos del array en un string
      const resumenHTML = ` <div class="resumen">
      <p>Nombre: ${usuario.nombre} ${usuario.apellido}</p>
      <ul>${listaPeliculas}</ul>
      <p><strong>Total: $${total}</strong></p>
      <button id="btnFinalizar" class="btnFinalizar">Finalizar Compra</button>
      </div> `;
      compraFinal.innerHTML = resumenHTML;
      localStorage.setItem("carritoPeli", JSON.stringify(carritoPeli));

      // Agregar el event listener justo después de insertar el HTML
      const btnPagar = document.getElementById("btnFinalizar");
      if (btnPagar) {
        btnPagar.addEventListener("click", () => {
          sessionStorage.setItem("compraFinal", JSON.stringify(carritoPeli));
          sessionStorage.setItem("usuario", JSON.stringify(usuario));
          window.location.href = "./pages/factura.html";
        });
      }
    }
  }
  if (document.body.id === "factura") {
    console.log("Estoy en la página factura"); // con esto verifico que se cargue el codigo de js en la  pagina "factura"

    const usuario = JSON.parse(sessionStorage.getItem("usuario")) || {};
    const compra = JSON.parse(sessionStorage.getItem("compraFinal")) || [];
    console.log(usuario);
    console.log(compra);

    const ticket = document.getElementById("ticket");

    if (compra.length === 0) {
      ticket.innerHTML = `<h3> No hay películas en el carrito</h3>`;
      return;
    }
    const listaHTML = compra // creo otro array con los datos de la peliculas en el carrito
      .map(
        (peli) =>
          `<li>${peli.title} - ${peli.hora} - $${peli.precio} - Boletos ${peli.cantidad}</li>`
      )
      .join("");

    const total = compra.reduce(
      (acc, peli) => acc + peli.precio * peli.cantidad,
      0
    ); // calculo el total de la compra
    ticket.innerHTML = `
    <h2>Ticket</h2>
    <p>Nombre: ${usuario.nombre} ${usuario.apellido}</p>
    <ul class="listaTicket">${listaHTML}</ul>
    <p><strong>Total: $${total}</strong></p>
    <div class="btns">
      <button id="pagarBtn" class="btnPagar">Pagar</button>
      <button id="cancelarBtn" class="btnCancelar">Cancelar</button>
    </div>
    `;
    document.getElementById("pagarBtn").addEventListener("click", () => {
      Swal.fire("¡Compra realizada!", "Gracias por tu compra", "success").then(
        () => {
          sessionStorage.clear();
          localStorage.removeItem("carritoPeli"); // limpio el carrito guardado
          window.location.href = "../index.html";
        }
      );
    });
    document.getElementById("cancelarBtn").addEventListener("click", () => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esto cancelará la compra",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.clear();
          localStorage.removeItem("carritoPeli"); // limpio el carrito guardado
          window.location.href = "../index.html";
        }
      });
    });
  }
});
// para optimizar el proyecto, crear la sección favoritos, aagregar el boton para eliminar peliculas,
