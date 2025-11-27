function mostrarPelis(cont, pelis) {
  pelis.forEach((peli) => {
    var miDiv = document.createElement("div");
    miDiv.className = "peli";
    var imagen = document.createElement("img");

    // si Poster es "N/A", null o undefined, usa defecto.jpg
    imagen.src =
      peli.Poster && peli.Poster !== "N/A" ? peli.Poster : "defecto.jpg";
    imagen.alt = peli.Title;
    imagen.style.width = "150px";
    imagen.style.margin = "10px";

    // si la imagen falla al cargar, reemplaza por defecto.jpg
    imagen.onerror = () => {
      imagen.src = "defecto.jpg";
    };

    var title = document.createElement("p");
    title.textContent = peli.Title;
    title.style.color = "white";
    title.style.width = "150px";
    title.style.textAlign = "center";

    miDiv.appendChild(imagen);
    miDiv.appendChild(title);

    cont.appendChild(miDiv);

    miDiv.addEventListener("click", () => {
      mostrarPanel(peli.imdbID);
    });
  });
}

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

      panel.innerHTML = `
        <h2>${peli.Title}</h2>
        <p>Año: ${peli.Year}</p>
        <p>Genero: ${peli.Genre}</p>
        <p>Director: ${peli.Director}</p>
        <p>Actores: ${peli.Actors}</p>
        <p>Plot: ${peli.Plot}</p>
        <img src="${peli.Poster}" style="width:200px;margin-top:10px;border-radius:10px"/>
        <button id="cerrar">Cerrar</button>
      `;

      overlay.appendChild(panel);
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      document.getElementById("cerrar").addEventListener("click", () => {
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

  function lanzarPeticion() {
    if (cargando) cargando = true;
    fetch(
      `https://www.omdbapi.com/?apikey=d3dce2e9&s=${nombrePeli}&y=${anioPeli}&page=${contadorPag}`
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
    lanzarPeticion();
  });

  document.getElementById("busca").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cont.innerHTML = "";
      contadorPag = 1;
      nombrePeli = document.getElementById("busca").value;
      anioPeli = document.getElementById("anio").value;
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
