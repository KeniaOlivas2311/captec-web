// =========================
// PROTEGER PÁGINA ADMIN
// =========================
(function checkAuth() {
  if (localStorage.getItem("captec_admin_auth") !== "true") {
    window.location.href = "login.html";
  }
})();
  

// =========================
// ELEMENTOS DOM
// =========================
const tituloEl = document.getElementById("titulo");
const descripcionEl = document.getElementById("descripcion");
const imagenEl = document.getElementById("imagen");
const previewWrapper = document.getElementById("previewWrapper");
const guardarBtn = document.getElementById("guardarBtn");
const limpiarBtn = document.getElementById("limpiarBtn");
const listaNovedades = document.getElementById("lista-novedades");
const btnLogout = document.getElementById("btnLogout");

let editarId = null;


// =========================
// PREVIEW DE IMAGEN
// =========================
imagenEl.addEventListener("change", () => {
  const file = imagenEl.files[0];
  if (!file) {
    previewWrapper.innerHTML = '<span style="color:#999">Vista previa</span>';
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    previewWrapper.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover" />`;
  };
  reader.readAsDataURL(file);
});


// =========================
// GUARDAR / ACTUALIZAR
// =========================
guardarBtn.addEventListener("click", () => {
  const titulo = tituloEl.value.trim();
  const descripcion = descripcionEl.value.trim();

  if (!titulo || !descripcion) {
    alert("Completa título y descripción.");
    return;
  }

  if (editarId) {
    actualizarNovedadExistente(editarId, titulo, descripcion);
    return;
  }

  if (!imagenEl.files.length) {
    alert("Selecciona una imagen.");
    return;
  }

  const file = imagenEl.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const novedades = JSON.parse(localStorage.getItem("novedades_captec")) || [];

    novedades.unshift({
      id: Date.now(),
      titulo,
      descripcion,
      img: e.target.result
    });

    localStorage.setItem("novedades_captec", JSON.stringify(novedades));
    limpiarFormulario();
    cargarNovedades();
    alert("Novedad guardada.");
  };

  reader.readAsDataURL(file);
});


// =========================
// LIMPIAR FORMULARIO
// =========================
limpiarBtn.addEventListener("click", limpiarFormulario);

function limpiarFormulario() {
  tituloEl.value = "";
  descripcionEl.value = "";
  imagenEl.value = "";
  previewWrapper.innerHTML = '<span style="color:#999">Vista previa</span>';
  editarId = null;
  guardarBtn.textContent = "Guardar Novedad";
}


// =========================
// CARGAR NOVEDADES
// =========================
function cargarNovedades() {
  const novedades = JSON.parse(localStorage.getItem("novedades_captec")) || [];
  listaNovedades.innerHTML = "";

  if (!novedades.length) {
    listaNovedades.innerHTML = `<p style="color:#bbb; text-align:center;">No hay novedades publicadas.</p>`;
    return;
  }

  novedades.forEach(nov => {
    const card = document.createElement("div");
    card.className = "novedad-admin-card";

    card.innerHTML = `
      <div>
        <h3>${escapeHtml(nov.titulo)}</h3>
        <p>${escapeHtml(nov.descripcion)}</p>
        <div class="card-actions">
          <button class="edit-btn">Editar</button>
          <button class="del-btn">Eliminar</button>
        </div>
      </div>
      <div>
        <img src="${nov.img}" />
      </div>
    `;

    card.querySelector(".edit-btn").addEventListener("click", () => editarNovedad(nov.id));
    card.querySelector(".del-btn").addEventListener("click", () => {
      if (confirm("¿Eliminar esta novedad?")) borrarNovedad(nov.id);
    });

    listaNovedades.appendChild(card);
  });
}


// =========================
// EDITAR NOVEDAD
// =========================
function editarNovedad(id) {
  const novedades = JSON.parse(localStorage.getItem("novedades_captec")) || [];
  const nov = novedades.find(n => n.id === id);

  if (!nov) return alert("Novedad no encontrada.");

  tituloEl.value = nov.titulo;
  descripcionEl.value = nov.descripcion;
  previewWrapper.innerHTML = `<img src="${nov.img}" style="width:100%; height:100%; object-fit:cover" />`;

  editarId = id;
  guardarBtn.textContent = "Actualizar Novedad";
}


// =========================
// ACTUALIZAR NOVEDAD
// =========================
function actualizarNovedadExistente(id, nuevoTitulo, nuevaDesc) {
  let novedades = JSON.parse(localStorage.getItem("novedades_captec")) || [];

  novedades = novedades.map(n =>
    n.id === id ? {...n, titulo: nuevoTitulo, descripcion: nuevaDesc} : n
  );

  localStorage.setItem("novedades_captec", JSON.stringify(novedades));
  limpiarFormulario();
  cargarNovedades();
  alert("Novedad actualizada.");
}


// =========================
// BORRAR NOVEDAD
// =========================
function borrarNovedad(id) {
  let novedades = JSON.parse(localStorage.getItem("novedades_captec")) || [];
  novedades = novedades.filter(n => n.id !== id);
  localStorage.setItem("novedades_captec", JSON.stringify(novedades));
  cargarNovedades();
}


// =========================
// LOGOUT ÚNICO Y CORRECTO
// =========================
btnLogout.addEventListener("click", () => {
  if (confirm("Cerrar sesión?")) {
    localStorage.removeItem("captec_admin_auth");
    window.location.href = "index.html";
  }
});


// =========================
// ESCAPE HTML
// =========================
function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}


// =========================
// INICIALIZAR
// =========================
cargarNovedades();




// ---------- CONFIGURACIÓN DE SERVICIOS ----------
const serviciosDefault = [
  {
    nombre: "Certificación en Electromecánica Industrial",
    descripcion: "Curso completo de electromecánica industrial con certificación.",
    costo: "$5,000",
    fecha: "2025-11-15",
    duracion: "3 meses",
    imagen: "assets/img/control.jpeg"
  },
  {
    nombre: "Preparatoria Abierta",
    descripcion: "Obtén tu certificado de preparatoria de manera flexible.",
    costo: "$6,500",
    fecha: "2025-12-01",
    duracion: "1 año",
    imagen: "assets/img/prepa.jpeg"
  },
  {
    nombre: "Curso de Montacargas",
    descripcion: "Aprende a manejar montacargas de manera profesional.",
    costo: "$2,000",
    fecha: "2025-11-10",
    duracion: "2 semanas",
    imagen: "assets/img/manejo.jpeg"
  },
  {
    nombre: "Instalación de Paneles Solares",
    descripcion: "Curso práctico de instalación de paneles solares.",
    costo: "$4,000",
    fecha: "2025-11-20",
    duracion: "1 mes",
    imagen: "assets/img/paneles.jpeg"
  },
  {
    nombre: "Diplomados",
    descripcion: "Diversos diplomados técnicos.",
    costo: "$3,500",
    fecha: "2026-01-01",
    duracion: "2 meses",
    imagen: "assets/img/elec.jpeg"
  }
];

// Inicializar si no existe
if (!localStorage.getItem("captec_servicios")) {
  localStorage.setItem("captec_servicios", JSON.stringify(serviciosDefault));
}

let servicios = JSON.parse(localStorage.getItem("captec_servicios"));

const tablaServicios = document.getElementById("lista-servicios-admin");
const modalEditarServicio = document.getElementById("modal-editar-servicio");
const cerrarModal = document.getElementById("cerrar-editar-servicio");
let servicioActual = null;

// Mostrar tabla
function renderServiciosAdmin() {
  tablaServicios.innerHTML = "";

  servicios.forEach((s, index) => {
    tablaServicios.innerHTML += `
      <tr>
        <td>${s.nombre}</td>
        <td><button class="btn-editar-servicio" data-index="${index}">Editar</button></td>
      </tr>
    `;
  });

  document.querySelectorAll(".btn-editar-servicio").forEach(btn => {
    btn.addEventListener("click", (e) => {
      servicioActual = e.target.dataset.index;
      abrirModalServicioAdmin(servicioActual);
    });
  });
}

renderServiciosAdmin();

// --- Modal editar servicio ---
function abrirModalServicioAdmin(i) {
  const s = servicios[i];

  document.getElementById("serv-nombre").value = s.nombre;
  document.getElementById("serv-descripcion").value = s.descripcion;
  document.getElementById("serv-costo").value = s.costo;
  document.getElementById("serv-fecha").value = s.fecha;
  document.getElementById("serv-duracion").value = s.duracion;

  modalEditarServicio.style.display = "flex";
}

cerrarModal.addEventListener("click", () => {
  modalEditarServicio.style.display = "none";
});

// Guardar servicio editado
document.getElementById("guardar-servicio").addEventListener("click", async () => {

  const imgFile = document.getElementById("serv-imagen").files[0];
  let imgBase64 = servicios[servicioActual].imagen;

  if (imgFile) {
    imgBase64 = await convertirABase64(imgFile);
  }

  servicios[servicioActual] = {
    nombre: document.getElementById("serv-nombre").value,
    descripcion: document.getElementById("serv-descripcion").value,
    costo: document.getElementById("serv-costo").value,
    fecha: document.getElementById("serv-fecha").value,
    duracion: document.getElementById("serv-duracion").value,
    imagen: imgBase64
  };

  localStorage.setItem("captec_servicios", JSON.stringify(servicios));
  renderServiciosAdmin();

  alert("Servicio actualizado correctamente");
  modalEditarServicio.style.display = "none";
});




