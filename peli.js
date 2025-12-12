function mostrarPelis(cont, pelis) {
  pelis.forEach((peli) => {
    var miDiv = document.createElement("div");
    miDiv.className = "peli";
    // crea cada tarjeta de película

    var imagen = document.createElement("img");

    // si hay poster válido lo usa, si no pone la imagen por defecto
    if (peli.Poster && peli.Poster !== "N/A") {
      imagen.src = peli.Poster;
    } else {
      imagen.src = "defecto.jpg";
    }

    imagen.alt = peli.Title;
    imagen.style.width = "150px";
    imagen.style.margin = "10px";

    // si falla la imagen del poster, mete la de defecto
    imagen.onerror = () => {
      imagen.src = "defecto.jpg";
    };

    var title = document.createElement("p");
    title.textContent = peli.Title;
    // muestra el nombre de la peli

    var fav = document.createElement("span");
    fav.innerHTML = "&#9733;";
    // estrella para marcar favoritos

    let favoritos = localStorage.getItem("favoritos");
    if (!favoritos) {
      favoritos = [];
    } else {
      favoritos = JSON.parse(favoritos);
    }

    // si ya estaba en favoritos, pinta la estrella en rojo
    if (favoritos.includes(peli.imdbID)) {
      fav.style.color = "red";
    }

    // cuando pulsas la estrella añade o quita de favoritos
    fav.addEventListener("click", () => {
      let favs = localStorage.getItem("favoritos");
      if (!favs) {
        favs = [];
      } else {
        favs = JSON.parse(favs);
      }

      if (favs.includes(peli.imdbID)) {
        // si ya estaba, la quita
        favs = favs.filter((id) => id !== peli.imdbID);
        fav.style.color = "white";
      } else {
        // si no estaba, la mete
        favs.push(peli.imdbID);
        fav.style.color = "red";
      }
      localStorage.setItem("favoritos", JSON.stringify(favs));
    });

    // mete todo dentro de la tarjeta
    miDiv.appendChild(imagen);
    miDiv.appendChild(title);
    miDiv.appendChild(fav);
    cont.appendChild(miDiv);

    // al hacer clic en la tarjeta abre el panel con más info
    miDiv.addEventListener("click", () => {
      mostrarPanel(peli.imdbID);
    });
  });
}

// botón y contenedor de favoritos
var btnFavoritos = document.getElementById("btn-favoritos");
var contFavoritos = document.getElementById("contenedor-favoritos");

var favoritosAbiertos = false; // controla si está visible

btnFavoritos.addEventListener("click", function () {
  // si ya está abierto lo cierra
  if (favoritosAbiertos) {
    contFavoritos.style.display = "none";
    contFavoritos.innerHTML = "";
    favoritosAbiertos = false;
    return;
  }

  // si está cerrado lo abre
  contFavoritos.innerHTML = "<h2>Favoritos</h2>";
  contFavoritos.style.display = "block";

  var favoritos = localStorage.getItem("favoritos");
  if (!favoritos) {
    favoritos = [];
  } else {
    favoritos = JSON.parse(favoritos);
  }

  // si no hay favoritos muestra un mensaje
  if (favoritos.length === 0) {
    var p = document.createElement("p");
    p.textContent = "No tienes películas favoritas.";
    contFavoritos.appendChild(p);
  } else {
    // por cada id de favorito pide la info a la api y la muestra
    favoritos.forEach(function (id) {
      fetch("https://www.omdbapi.com/?apikey=d3dce2e9&i=" + id)
        .then(function (res) {
          return res.json();
        })
        .then(function (peli) {
          var card = document.createElement("div");
          card.className = "fav-card";

          var img = document.createElement("img");

          // poster o imagen por defecto
          if (peli.Poster && peli.Poster !== "N/A") {
            img.src = peli.Poster;
          } else {
            img.src = "defecto.jpg";
          }

          img.alt = peli.Title;
          card.appendChild(img);

          var info = document.createElement("div");
          info.className = "fav-card-info";

          var h3 = document.createElement("h3");
          h3.textContent = peli.Title;

          var p = document.createElement("p");
          p.textContent = peli.Year;

          info.appendChild(h3);
          info.appendChild(p);

          card.appendChild(info);
          contFavoritos.appendChild(card);
        });
    });
  }

  favoritosAbiertos = true;
});

// muestra la pantalla de bienvenida al cargar la página
window.addEventListener("load", () => {
  const bienvenida = document.getElementById("bienvenida");
  const btnBienvenida = document.getElementById("cerrar-bienvenida");

  bienvenida.style.display = "flex";

  // cuando le das al botón, se cierra la pantalla
  btnBienvenida.addEventListener("click", (e) => {
    bienvenida.style.display = "none";
  });
});

function mostrarPanel(id) {
  // pide la info de la peli por id y muestra un panel encima
  fetch(`https://www.omdbapi.com/?apikey=d3dce2e9&i=${id}`)
    .then((res) => res.json())
    .then((peli) => {
      var overlay = document.createElement("div");
      // crea un fondo oscuro por encima de todo

      var panel = document.createElement("div");
      // panel donde va la info de la peli

      // mete la info en el panel
      panel.innerHTML =
        "<h2>" +
        peli.Title +
        "</h2>" +
        "<p>Año: " +
        peli.Year +
        "</p>" +
        "<p>Genero: " +
        peli.Genre +
        "</p>" +
        "<p>Director: " +
        peli.Director +
        "</p>" +
        "<p>Actores: " +
        peli.Actors +
        "</p>" +
        "<p>Plot: " +
        peli.Plot +
        "</p>" +
        "<img src='" +
        peli.Poster +
        "' style='width:200px;margin-top:10px;border-radius:10px'/>" +
        "<button class='cerrar-panel'>Cerrar</button>";

      overlay.appendChild(panel);
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";
      // bloquea el scroll del fondo

      // botón para cerrar el panel
      panel.querySelector(".cerrar-panel").addEventListener("click", () => {
        overlay.remove();
        document.body.style.overflow = "auto";
      });
    });
}

window.onload = () => {
  // parte que gestiona la búsqueda y la carga automática al hacer scroll
  let cont = document.getElementById("div");
  var contadorPag = 1;
  var nombrePeli = "";
  var anioPeli = "";
  var cargando = false;
  var tipo = "";

  var botswitch = document.getElementById("toggle");
  var switchText = document.getElementById("switch-text");

  // carga si el usuario estaba buscando películas o series
  var storedTipo = localStorage.getItem("tipo");
  if (!storedTipo) {
    tipo = "movie";
  } else {
    tipo = storedTipo;
  }

  // ajusta el switch visualmente
  if (tipo === "movie") {
    botswitch.checked = true;
    switchText.textContent = "Movies";
  } else {
    botswitch.checked = false;
    switchText.textContent = "Series";
  }

  // cuando cambias el switch guarda si quieres pelis o series
  botswitch.addEventListener("change", function () {
    if (botswitch.checked) {
      tipo = "movie";
      switchText.textContent = "Movies";
    } else {
      tipo = "series";
      switchText.textContent = "Series";
    }

    localStorage.setItem("tipo", tipo);
  });

  // carga los valores anteriores de la búsqueda si estaban guardados
  var storedNombre = localStorage.getItem("nombrePeli");
  var storedAnio = localStorage.getItem("anioPeli");

  document.getElementById("busca").value = storedNombre || "";
  document.getElementById("anio").value = storedAnio || "";

  nombrePeli = document.getElementById("busca").value;
  anioPeli = document.getElementById("anio").value;

  // si había algo escrito, vuelve a buscar al cargar
  if (nombrePeli !== "") {
    lanzarPeticion();
  }

  // función que hace la petición a la api
  function lanzarPeticion() {
    if (cargando) cargando = true;

    fetch(
      `https://www.omdbapi.com/?apikey=d3dce2e9&s=${nombrePeli}&y=${anioPeli}&page=${contadorPag}&type=${tipo}`
    )
      .then((response) => response.json())
      .then((data) => {
        // si encuentra pelis las muestra y pasa a la siguiente página
        if (data.Search) {
          mostrarPelis(cont, data.Search);
          contadorPag++;
        }
      })
      .finally(() => {
        cargando = false;
      });
  }

  // cuando pulsas el botón buscar
  document.getElementById("botonbuscar").addEventListener("click", () => {
    cont.innerHTML = "";
    contadorPag = 1;

    nombrePeli = document.getElementById("busca").value;
    anioPeli = document.getElementById("anio").value;

    // guarda la búsqueda
    localStorage.setItem("nombrePeli", nombrePeli);
    localStorage.setItem("anioPeli", anioPeli);

    lanzarPeticion();
  });

  // permite buscar pulsando enter
  document.getElementById("busca").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cont.innerHTML = "";
      contadorPag = 1;

      nombrePeli = document.getElementById("busca").value;
      anioPeli = document.getElementById("anio").value;

      localStorage.setItem("nombrePeli", nombrePeli);
      localStorage.setItem("anioPeli", anioPeli);

      lanzarPeticion();
    }
  });

  // scroll infinito: cuando llegas abajo carga más pelis
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight
    ) {
      lanzarPeticion();
    }
  });
};
