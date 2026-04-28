/* --- CONFIGURACIÓN DE TU REPO --- */
const OWNER = 'DavidC41'; // Cambia por tu usuario de GitHub
const REPO = 'Pagina-Web-Musical'; // Cambia por el nombre de tu proyecto
const DATA_PATH = 'almacenamiento.json'; // El archivo que servirá de base de datos

let catalogo = {}; // Empezamos con el catálogo vacío

/* --- 1. LÓGICA DEL MENÚ (Tu código original mejorado) --- */
document.addEventListener('DOMContentLoaded', () => {
    const openMenuBtn = document.querySelector('.action-menu');
    const sideMenu = document.querySelector('.side-menu');
    const navLinks = document.querySelectorAll('.nav-links li');
    const closeMenuBtn = document.querySelector('.close-menu');

    if (openMenuBtn && sideMenu) {
        navLinks.forEach((link, index) => link.style.setProperty('--i', index + 1));

        openMenuBtn.addEventListener('click', () => {
            sideMenu.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });

        const cerrar = () => {
            sideMenu.classList.remove('is-active');
            document.body.style.overflow = '';
        };

        if (closeMenuBtn) closeMenuBtn.addEventListener('click', cerrar);
        navLinks.forEach(link => link.addEventListener('click', cerrar));
    }
});

/* --- 2. CARGA DINÁMICA DESDE GITHUB --- */
async function cargarBaseDeDatos() {
    try {
        // Pedimos el JSON a GitHub (añadimos random para evitar caché)
        const response = await fetch(`${DATA_PATH}?v=${Math.random()}`);
        catalogo = await response.json();
        
        // Una vez tenemos los datos, ejecutamos las funciones de pintado
        pintarTienda();
        cargarDatosProducto();
    } catch (error) {
        console.error("Error cargando el catálogo:", error);
    }
}

function pintarTienda() {
    const grid = document.getElementById('contenedor-vinilos');
    if (!grid) return;

    let html = "";
    for (let id in catalogo) {
        const v = catalogo[id];
        html += `
            <article class="vinilo-card">
                <div class="vinilo-image">
                    <a href="producto.html?id=${id}">
                        <img src="${v.imagen}" alt="${v.titulo}">
                    </a>
                </div>
                <div class="vinilo-info">
                    <span class="artista">${v.artista}</span>
                    <span class="album">${v.titulo}</span>
                    <span class="precio">${v.precio}</span>
                </div>
            </article>`;
    }
    grid.innerHTML = html;
}

function cargarDatosProducto() {
    const id = new URLSearchParams(window.location.search).get('id');
    const producto = catalogo[id];
    const tituloElemento = document.getElementById('txt-titulo');
    
    if (producto && tituloElemento) {
        document.getElementById('txt-artista').innerText = producto.artista;
        document.getElementById('txt-titulo').innerText = producto.titulo;
        document.getElementById('txt-precio').innerText = producto.precio;
        document.getElementById('txt-descripcion').innerText = producto.desc;
        document.getElementById('main-img').src = producto.imagen;

        if (!producto.agotado) {
            const btnP = document.getElementById('btn-principal');
            if (btnP) {
                btnP.innerText = "AÑADIR AL CARRITO";
                btnP.style.backgroundColor = "#79d616";
                btnP.style.color = "#000";
            }
            const btnS = document.getElementById('btn-secondary');
            if (btnS) btnS.style.display = 'none';
        }
    }
}

// Al cargar la web, lo primero es traer los datos
window.onload = cargarBaseDeDatos;
