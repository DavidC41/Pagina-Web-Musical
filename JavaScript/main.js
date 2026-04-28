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
   2. LÓGICA DEL MENÚ
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

        if (document.getElementById('contenedor-vinilos')) pintarTienda();
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
   4. PANEL ADMIN (Opción B: Subida Real)
   ========================================= */

// Función para convertir archivo a Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

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
    const fileInput = document.getElementById('p-img-file'); // ID actualizado
    const btn = document.getElementById('btn-guardar-github');

    if (!id || !token || !fileInput.files[0]) {
        return alert("Por favor, rellena todos los campos y selecciona una imagen.");
    }

    const archivo = fileInput.files[0];
    const nombreImagen = archivo.name;
    const textoOriginal = btn.innerText;

    btn.innerText = "SUBIENDO ARCHIVOS...";
    btn.disabled = true;
    btn.style.opacity = "0.5";

    try {
        // PASO 1: SUBIR LA IMAGEN A GITHUB (Base64)
        const imageBase64 = await toBase64(archivo);
        const urlImg = `https://api.github.com/repos/${OWNER}/${REPO}/contents/Imagenes/${nombreImagen}`;
        
        await fetch(urlImg, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `📸 Admin: Nueva imagen ${nombreImagen}`,
                content: imageBase64
            })
        });

        // PASO 2: ACTUALIZAR EL JSON
        const urlApi = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${JSON_FOLDER}`;
        const resGet = await fetch(urlApi, { headers: { 'Authorization': `token ${token}` } });
        const dataGet = await resGet.json();
        
        let contenido = JSON.parse(atob(dataGet.content));
        
        contenido[id] = {
            artista: document.getElementById('p-artista').value,
            titulo: document.getElementById('p-titulo').value,
            precio: document.getElementById('p-precio').value,
            imagen: "Imagenes/" + nombreImagen,
            desc: document.getElementById('p-desc').value,
            agotado: false
        };

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
            alert("¡VINILO E IMAGEN SUBIDOS CON ÉXITO! 🚀");
            location.reload(); 
        } else {
            alert("Error al actualizar el JSON.");
        }

    } catch (e) {
        alert("Error de conexión. Revisa el token o la consola.");
        console.error(e);
    } finally {
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
