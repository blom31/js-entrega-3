// Inicializa el DOM para asegurarme de que el html este completamente cargado

document.addEventListener("DOMContentLoaded", function () {
  // M A N E J O   D E   A P I

  //1. Hacer una petición a la API de películas

  const getPeliculas = async () => {
    let respuesta = await fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=a36a0107dd6b1ea8569d698315062324"
    );
    const peliculas = await respuesta.json(); //convierto la respuesta en un archivo disponible para js
    console.log(peliculas.results); //verifico que tenga acceso a los datos
    return peliculas.results; // Devolvemos el array de películas
  };
  getPeliculas();

  //2. Mostrar las peliculas en consola
  // como mi resultado proviene de una promesas, tengo que usar siempre el async/await para obtener los datos
  const menu = async () => {
    const peliculas = await getPeliculas(); // Esperar los datos

    peliculas.forEach((pelicula, index) => {
      console.log(`Película ${index + 1}: ${pelicula.title}`);
    });
  };

  menu(); // Llamamos a menu()

  // M A N E J O   D E   E V E N T O S  D E S D E   E L  D O M

  //3. Mostrar las películas en el HTML

  const mostrarPeliculas = async () => {
    const peliculas = await getPeliculas(); //Esperar los datos
    let cartelera = document.getElementById("carteleraPeliculas");
    let tarjetaPeliculas = "";

    peliculas.forEach((pelicula, index) => {
      tarjetaPeliculas += `<div class="peliculas">
      <img src= "https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="${pelicula.title}"> 
      <p class =" tituloPelicula mt-2"> ${pelicula.title}</p>
      <button class ="btnComprar" data-index=" ${index}">Comprar</button>
      </div>`;
    });
    cartelera.innerHTML = tarjetaPeliculas;
    //4. Agrego evento a los botones, ejemplo de usar una librería externa
    document.querySelectorAll(".btnComprar").forEach((boton) => {
      boton.addEventListener("click", () => {
        Swal.fire("Inicia Sesión antes de comprar!");
      });
    });
  };

  mostrarPeliculas();
});
// 1. Objeto usuario para guardar nombre y apellido
//   const usuario = {
//     nombre: "",
//     apellido: "",
//   };

//   // 3. guardar nombre y usuario con datos desde el formulario
//   let guardarUsuario = document.getElementById("btnGuardar");
//   guardarUsuario.addEventListener("click", (event) => {
//     event.preventDefault(); // detiene el reinicio de la pág cuando presione el botón guardar

//     const nombre = document.getElementById("nombre").value.trim(); // el trim elimina si hay espacios en blanco
//     const apellido = document.getElementById("apellido").value.trim();

//     // esto para validar que los campos no los guarde vacíos
//     if (!nombre || !apellido) {
//       alert("Por favor, completa ambos campos antes de continuar.");
//       return;
//     }

//     usuario.nombre = nombre;
//     usuario.apellido = apellido;
//     console.log(usuario); // verifico que se guarde correctamente los datos

//     sessionStorage.setItem("nombre", usuario.nombre); //guardo los datos en el sessionStorage
//     const nombreGuardado = sessionStorage.getItem("nombre"); // recupero los datos

//     if (nombreGuardado) {
//       // si recupero datos del formulario y los guardo, muestro un saludo
//       const saludo = document.getElementById("saludo");
//       saludo.innerText = `Hola, ${nombreGuardado}. ¡Elige tu película! 🎬`;
//     }
//   });

//   // 4. Mostrar tarjetas de películas
//   let cartelera = document.getElementById("cartelera");
//   let tarjetaPeliculas = "";

//   peliculas.forEach((pelicula, index) => {
//     tarjetaPeliculas += `
//   <div class="cardPeli">
//   <h4>${pelicula.nombre}</h4>
//   <p>Horario: ${pelicula.hora}</p>
//   <p>Valor: $${pelicula.precio}</p>
//   <button class="btn btn-light" data-index="${index}">Comprar</button>
//   </div>
//   `;
//   });
//   cartelera.innerHTML = tarjetaPeliculas;

//   // 5. Eventos para los botones de "Comprar"
//   let compraFinal = document.getElementById("compraFinal");
//   let carritoPeli = [];

//   document.getElementById("cartelera").addEventListener("click", (e) => {
//     if (e.target.classList.contains("btn")) {
//       // Validar si el usuario ha ingresado su nombre
//       if (!usuario.nombre.trim()) {
//         alert("Por favor, ingresa tu nombre antes de elegir una película.");
//         return;
//       }

//       const index = parseInt(e.target.getAttribute("data-index"));
//       const peliSeleccionada = peliculas[index];

//       if (peliSeleccionada) {
//         carritoPeli.push(peliSeleccionada);
//         actualizarResumen();
//       }
//     }
//   });

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

//   // 6. Mostrar resumen de compra optimizada con metodos como reduce y map
//   function actualizarResumen() {
//     const total = carritoPeli.reduce(
//       //el reduce sustituye el ciclo for. la const total guardará la suma de los precios
//       (acumulador, pelicula) => acumulador + pelicula.precio,
//       0
//     );
//     console.log(total); //verifico que el total se esté calculando
//     const listaPeliculas = carritoPeli
//       .map(
//         (
//           pelicula //el map sustituye el ciclo for. el map devuelve un nuevo array
//         ) =>
//           `<li> Titulo: ${pelicula.nombre} - Horario: ${pelicula.hora} - Valor: ${pelicula.precio}</li>`
//       )
//       .join(""); // el join une los elementos del array en un string
//     const resumenHTML = ` <div class="resumen">
//                             <p>Resumen de Compra</p>
//                             <p>Nombre: ${usuario.nombre}</p>
//                             <ul>${listaPeliculas}</ul>
//                             <p><strong>Total: $${total}</strong></p>
//                           </div> `;
//     compraFinal.innerHTML = resumenHTML;
//   }
//});
