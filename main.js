// Inicializa el DOM para asegurarme de que el html este completamente cargado

document.addEventListener("DOMContentLoaded", function () {
  // Variable Global de pelicula para utilizarla en cualquir parte del código

  let peliculasGuardadas = []; // Almacenar las películas de la API

  //2. Declaro el Objeto usuario para guardar nombre y apellido en la SessionStorage
  const usuario = {
    nombre: "",
    apellido: "",
  };
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

  //1. Hacer una petición a la API de películas async/await

  const getPeliculas = async () => {
    let respuesta = await fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=a36a0107dd6b1ea8569d698315062324"
    );
    const peliculas = await respuesta.json(); //convierto la respuesta en un archivo disponible para js
    // guardo las películas en la variable
    // Agregar propiedades aleatorias
    peliculasGuardadas = peliculas.results.map((pelicula) => ({
      ...pelicula,
      precio: generarPrecioAleatorio(),
      hora: generarHorarioAleatorio(),
    }));
    console.log(peliculasGuardadas); //verifico que se guarden correctamente

    return peliculasGuardadas; // Devolvemos el array de películas
  };
  function generarPrecioAleatorio() {
    const precios = [1500, 1800, 2000, 2200, 2500]; // precios posibles
    const indice = Math.floor(Math.random() * precios.length);
    return precios[indice];
  }

  function generarHorarioAleatorio() {
    const horarios = ["14:00", "16:30", "19:00", "21:15", "23:00"];
    const indice = Math.floor(Math.random() * horarios.length);
    return horarios[indice];
  }

  // M A N E J O   D E   E V E N T O S  D E S D E   E L  D O M

  //3. Mostrar las películas en el HTML

  const mostrarPeliculas = () => {
    let cartelera = document.getElementById("carteleraPeliculas");
    let tarjetaPeliculas = "";

    peliculasGuardadas.slice(0, 12).forEach((pelicula, index) => {
      //uso el .slice para que solo me muestre 12 pelis de 20
      //uso un forEach para recorrer el array de películas del index
      tarjetaPeliculas += `<div class="peliculas">
      <img src= "https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="${pelicula.title}"> 
      <p class =" tituloPelicula mt-2"> ${pelicula.title}</p>
      <button class ="btnComprar" data-index="${index}">Comprar</button>
      </div>`;
    });
    cartelera.innerHTML = tarjetaPeliculas;
  };

  getPeliculas().then(() => {
    mostrarPeliculas();
  });

  // 6. Guardar nombre y usuario con datos desde el formulario
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
    }
  });

  //7. Eventos para los botones de "Comprar"

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

        if (peliSeleccionada) {
          carritoPeli.push(peliSeleccionada);
          actualizarResumen();
        }
      }
    });
  console.log(carritoPeli); //verifico que el carrito se esté llenando

  //   // 6. Mostrar resumen de compra paso a paso

  //   // function actualizarResumen() {
  //   //   let total = 0;
  //   //   for (let i = 0; i < carritoPeli.length; i++) {
  //   //     const pelicula = carritoPeli[i];
  //   //     total = total + pelicula.precio;
  //   //   }
  //   //   let listaPeliculas = "";
  //   //   for (let i = 0; i < carritoPeli.length; i++) {
  //   //     const pelicula = carritoPeli[i];
  //   //     const elementoLista = `<li>${pelicula.nombre} - $${pelicula.precio}</li>`;
  //   //     listaPeliculas = listaPeliculas + elementoLista;
  //   //   }
  //   //   const resumenHTML = ` <div class="resumen">
  //   //                         <p>Resumen de Compra</p>
  //   //                         <p>Nombre: ${usuario.nombre}</p>
  //   //                         <ul>${listaPeliculas}</ul>
  //   //                         <p><strong>Total: $${total}</strong></p>
  //   //                       </div> `;
  //   //   compraFinal.innerHTML = resumenHTML;
  //   // }

  // 6. Mostrar resumen de compra optimizada con metodos como reduce y map
  function actualizarResumen() {
    const total = carritoPeli.reduce(
      //el reduce sustituye el ciclo for. la const total guardará la suma de los precios
      (acumulador, pelicula) => acumulador + pelicula.precio,
      0
    );
    console.log(total); //verifico que el total se esté calculando
    const listaPeliculas = carritoPeli
      .map(
        (
          pelicula //el map sustituye el ciclo for. el map devuelve un nuevo array
        ) =>
          `<li> Titulo: ${pelicula.title} - Horario: ${pelicula.hora} - Valor: ${pelicula.precio}</li>`
      )
      .join(""); // el join une los elementos del array en un string
    const resumenHTML = ` <div class="resumen">
    <p>Resumen de Compra</p>
    <p>Nombre: ${usuario.nombre} ${usuario.apellido}</p>
    <ul>${listaPeliculas}</ul>
    <p><strong>Total: $${total}</strong></p>
    <button id="btnPagar class="btnPagar">Finalizar Compra</button>
    </div> `;
    compraFinal.innerHTML = resumenHTML;
  }
});
