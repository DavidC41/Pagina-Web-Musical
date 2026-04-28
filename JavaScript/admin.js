/* --- CONFIGURACIÓN --- */
const OWNER = 'DavidC41'; 
const REPO = 'Pagina-Web-Musical';
// IMPORTANTE: Para GitHub API, la ruta empieza desde la raíz, sin "../"
const DATA_PATH = 'JSON/almacenamiento.json'; 

// 1. Lógica de Login
function verificarPassword() {
    const pass = document.getElementById('admin-pass').value;
    const token = document.getElementById('github-token').value;

    if(pass === "BIBERON2026" && token) {
        document.getElementById('login-section').style.display = "none";
        document.getElementById('form-section').style.display = "block";
    } else {
        alert("Acceso denegado. Asegúrate de poner el Token de GitHub.");
    }
}

// 2. Lógica de Guardar
async function guardarEnGithub() {
    const token = document.getElementById('github-token').value;
    const id = document.getElementById('p-id').value;
    
    if(!id) return alert("Escribe un ID para el vinilo");

    const nuevoVinilo = {
        artista: document.getElementById('p-artista').value,
        titulo: document.getElementById('p-titulo').value,
        precio: document.getElementById('p-precio').value,
        imagen: "Imagenes/" + document.getElementById('p-img').value,
        desc: document.getElementById('p-desc').value,
        agotado: false
    };

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`;

    try {
        const resGet = await fetch(url, { 
            headers: { 'Authorization': `token ${token}`, 'Cache-Control': 'no-cache' } 
        });
        
        if (!resGet.ok) {
            alert("No se encontró el archivo JSON. Revisa la ruta en el repo.");
            return;
        }

        const dataGet = await resGet.json();
        let contenido = JSON.parse(atob(dataGet.content));
        contenido[id] = nuevoVinilo;

        const resPut = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Nuevo vinilo: ${id}`,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(contenido, null, 2)))),
                sha: dataGet.sha
            })
        });

        if (resPut.ok) {
            alert("¡Web actualizada con éxito!");
            location.reload();
        } else {
            alert("Error al subir. Revisa permisos del Token.");
        }
    } catch (e) {
        console.error(e);
        alert("Error crítico al conectar con GitHub.");
    }
}

// 3. Asignación del botón (Esperando a que el HTML exista)
document.addEventListener('DOMContentLoaded', () => {
    const btnGuardar = document.getElementById('btn-guardar-github');
    if(btnGuardar) {
        btnGuardar.onclick = guardarEnGithub;
    }
});
