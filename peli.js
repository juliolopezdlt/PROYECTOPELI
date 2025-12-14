function mostrarPelis(cont, pelis) {
  pelis.forEach((peli) => {
    const miDiv = document.createElement("div");
    miDiv.className = "peli";

    const imagen = document.createElement("img");
    imagen.src =
      peli.Poster && peli.Poster !== "N/A" ? peli.Poster : "defecto.jpg";
    imagen.alt = peli.Title;

    const title = document.createElement("p");
    title.textContent = peli.Title;

    const fav = document.createElement("span");
    fav.innerHTML = "&#9733;";
    fav.style.cursor = "pointer";
    fav.style.display = "block";

    // Revisar si ya está en favoritos
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");
    if (favoritos.includes(peli.imdbID)) fav.style.color = "red";

    // Click en estrella
    fav.addEventListener("click", (e) => {
      e.stopPropagation();
      let favs = JSON.parse(localStorage.getItem("favoritos") || "[]");
      if (favs.includes(peli.imdbID)) {
        favs = favs.filter((id) => id !== peli.imdbID);
        fav.style.color = "white";
      } else {
        favs.push(peli.imdbID);
        fav.style.color = "red";
      }
      localStorage.setItem("favoritos", JSON.stringify(favs));
    });

    miDiv.appendChild(imagen);
    miDiv.appendChild(title);
    miDiv.appendChild(fav);
    cont.appendChild(miDiv);

    // Click en la portada
    miDiv.addEventListener("click", () => mostrarPanel(peli.imdbID));
  });
}

// Botón de favoritos
const btnFavoritos = document.getElementById("btn-favoritos");
const contFavoritos = document.getElementById("contenedor-favoritos");

btnFavoritos.addEventListener("click", () => {
  // Limpiar contenedor
  contFavoritos.innerHTML = "";

  // Obtener array de favoritos del localStorage
  let favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

  if (favoritos.length === 0) {
    contFavoritos.innerHTML = "<p>No tienes favoritos aún.</p>";
  } else {
    favoritos.forEach((id) => {
      // Por cada ID de favorito, pedimos la info a la API
      fetch(`https://www.omdbapi.com/?apikey=d3dce2e9&i=${id}`)
        .then((res) => res.json())
        .then((peli) => {
          const divPeli = document.createElement("div");
          divPeli.style.display = "inline-block";
          divPeli.style.margin = "10px";
          divPeli.style.textAlign = "center";

          const img = document.createElement("img");
          img.src = peli.Poster !== "N/A" ? peli.Poster : "defecto.jpg";
          img.alt = peli.Title;
          img.style.width = "150px";
          img.style.borderRadius = "10px";
          img.style.cursor = "pointer";

          const titulo = document.createElement("p");
          titulo.textContent = peli.Title;
          titulo.style.color = "white";

          // Al hacer click en la imagen, mostramos el panel
          img.addEventListener("click", () => mostrarPanel(peli.imdbID));

          divPeli.appendChild(img);
          divPeli.appendChild(titulo);
          contFavoritos.appendChild(divPeli);
        });
    });
  }

  // Mostrar/ocultar contenedor
  contFavoritos.style.display =
    contFavoritos.style.display === "none" ? "block" : "none";
});

window.addEventListener("load", () => {
  const bienvenida = document.getElementById("bienvenida");
  const btnBienvenida = document.getElementById("cerrar-bienvenida");

  // Siempre mostrar la bienvenida
  bienvenida.style.display = "flex";

  btnBienvenida.addEventListener("click", () => {
    bienvenida.style.display = "none"; // se oculta al pulsar
  });
});
function mostrarPanel(id) {
  fetch(`https://www.omdbapi.com/?apikey=d3dce2e9&i=${id}`)
    .then((res) => res.json())
    .then((peli) => {
      var overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "999";
      overlay.style.overflow = "auto";

      var panel = document.createElement("div");
      panel.style.backgroundColor = "rgba(0,0,0,0.9)";
      panel.style.color = "white";
      panel.style.padding = "20px";
      panel.style.borderRadius = "10px";
      panel.style.maxWidth = "80%";
      panel.style.maxHeight = "80%";
      panel.style.overflowY = "auto";
      panel.style.textAlign = "center";

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

      panel.querySelector(".cerrar-panel").addEventListener("click", () => {
        overlay.remove();
        document.body.style.overflow = "auto";
      });
    });
}

window.onload = () => {
  let cont = document.getElementById("div");
  var contadorPag = 1;
  var nombrePeli = "";
  var anioPeli = "";
  var cargando = false;
  var tipo = "";
  var botswitch = document.getElementById("toggle");

  var switchText = document.getElementById("switch-text");
  var tipo = localStorage.getItem("tipo") || "movie";
  if (tipo === "movie") {
    botswitch.checked = true;
    switchText.textContent = "Movies";
  } else {
    botswitch.checked = false;
    switchText.textContent = "Series";
  }
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

  //asociamos el valor del nombre y del año con el localstorage
  document.getElementById("busca").value =
    localStorage.getItem("nombrePeli") || "";
  document.getElementById("anio").value =
    localStorage.getItem("anioPeli") || "";

  nombrePeli = document.getElementById("busca").value;
  anioPeli = document.getElementById("anio").value;

  if (nombrePeli !== "") {
    lanzarPeticion();
  }

  function lanzarPeticion() {
    if (cargando) cargando = true;
    fetch(
      `https://www.omdbapi.com/?apikey=d3dce2e9&s=${nombrePeli}&y=${anioPeli}&page=${contadorPag}&type=${tipo}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.Search) {
          mostrarPelis(cont, data.Search);
          contadorPag++;
        }
      })
      .finally(() => {
        cargando = false;
      });
  }

  document.getElementById("botonbuscar").addEventListener("click", () => {
    cont.innerHTML = "";
    contadorPag = 1;
    nombrePeli = document.getElementById("busca").value;
    anioPeli = document.getElementById("anio").value;

    // guarda los valores porr si recargamos la pagina, q no se pierda lo q hemos buscado
    localStorage.setItem("nombrePeli", nombrePeli);
    localStorage.setItem("anioPeli", anioPeli);

    lanzarPeticion();
  });

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

  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight
    ) {
      lanzarPeticion();
    }
  });
};
