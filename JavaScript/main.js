/* =========================================
   1. CONFIGURACIÓN GLOBAL
   ========================================= */
const OWNER = 'DavidC41'; 
const REPO = 'Pagina-Web-Musical';
const JSON_FOLDER = 'JSON/almacenamiento.json';

// Ruta inteligente para el fetch (detecta si estamos en /HTML/ o raíz)
let FETCH_PATH = window.location.pathname.includes('/HTML/') 
    ? `../${JSON_FOLDER}` 
    : JSON_FOLDER;

let catalogo = {}; // Base de datos temporal

/* =========================================
   2. LÓGICA DEL MENÚ (Tu diseño original)
   ========================================= */
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
    
    // Iniciar carga de datos al entrar
    cargarBaseDeDatos();
});

/* =========================================
   3. TIENDA Y PRODUCTO (Leer Datos)
   ========================================= */
async function cargarBaseDeDatos() {
    try {
        const respuesta = await fetch(`${FETCH_PATH}?v=${Math.random()}`);
        if (!respuesta.ok) return;
        catalogo = await respuesta.json();

        // Si existe el contenedor de vinilos, pintamos la tienda
        if (document.getElementById('contenedor-vinilos')) pintarTienda();
        
        // Si existe el título del producto, cargamos detalle
        if (document.getElementById('txt-titulo')) cargarDatosProducto();
    } catch (e) { console.error("Error cargando JSON:", e); }
}

function pintarTienda() {
    const grid = document.getElementById('contenedor-vinilos');
    let html = "";
    for (let id in catalogo) {
        const v = catalogo[id];
        html += `
            <article class="vinilo-card">
                <div class="vinilo-image">
                    <a href="producto.html?id=${id}"><img src="${v.imagen}" alt="${v.titulo}"></a>
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
    const p = catalogo[id];
    if (p) {
        document.getElementById('txt-artista').innerText = p.artista;
        document.getElementById('txt-titulo').innerText = p.titulo;
        document.getElementById('txt-precio').innerText = p.precio;
        document.getElementById('txt-descripcion').innerText = p.desc;
        document.getElementById('main-img').src = p.imagen;
        
        if (!p.agotado) {
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

/* =========================================
   4. PANEL ADMIN (Escribir en GitHub)
   ========================================= */
function verificarPassword() {
    const pass = document.getElementById('admin-pass').value;
    const token = document.getElementById('github-token').value;
    if (pass === "BIBERON2026" && token) {
        document.getElementById('login-section').style.display = "none";
        document.getElementById('form-section').style.display = "block";
    } else { alert("Datos incorrectos"); }
}

async function guardarEnGithub() {
    const token = document.getElementById('github-token').value;
    const id = document.getElementById('p-id').value;
    const btn = document.getElementById('btn-guardar-github');

    if (!id || !token) return alert("Por favor, introduce el ID y el Token.");

    // Bloqueamos el botón y damos feedback visual
    const textoOriginal = btn.innerText;
    btn.innerText = "SUBIENDO... ESPERA";
    btn.disabled = true;
    btn.style.opacity = "0.5";

    const nuevoVinilo = {
        artista: document.getElementById('p-artista').value,
        titulo: document.getElementById('p-titulo').value,
        precio: document.getElementById('p-precio').value,
        imagen: "Imagenes/" + (document.getElementById('p-img').value || "default.png"),
        desc: document.getElementById('p-desc').value,
        agotado: false
    };

    const urlApi = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${JSON_FOLDER}`;

    try {
        const resGet = await fetch(urlApi, { 
            headers: { 'Authorization': `token ${token}`}
        });
        const dataGet = await resGet.json();
        
        let contenido = JSON.parse(atob(dataGet.content));
        contenido[id] = nuevoVinilo;

        const resPut = await fetch(urlApi, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `✅ Admin: Añadido vinilo ${id}`,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(contenido, null, 2)))),
                sha: dataGet.sha
            })
        });

        if (resPut.ok) {
            alert("¡VINILO INTRODUCIDO CORRECTAMENTE! 🚀");
            
            // Limpiamos el formulario
            document.getElementById('p-id').value = "";
            document.getElementById('p-artista').value = "";
            document.getElementById('p-titulo').value = "";
            document.getElementById('p-precio').value = "";
            document.getElementById('p-img').value = "";
            document.getElementById('p-desc').value = "";
            
        } else {
            alert("Error al subir. Revisa los permisos de tu Token.");
        }
    } catch (e) {
        alert("Error de conexión con GitHub.");
        console.error(e);
    } finally {
        // Restauramos el botón
        btn.innerText = textoOriginal;
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

// Escuchador para el botón de admin
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-guardar-github') {
        guardarEnGithub();
    }
});
