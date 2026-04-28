/* --- MISMA CONFIGURACIÓN --- */
const OWNER = 'DavidC41'; 
const REPO = 'Pagina-Web-Musical';
const DATA_PATH = 'almacenamiento.json';

function verificarPassword() {
    const pass = document.getElementById('admin-pass').value;
    const token = document.getElementById('github-token').value; // Necesitas este input en el HTML

    if(pass === "BIBERON2026" && token) {
        document.getElementById('login-section').style.display = "none";
        document.getElementById('form-section').style.display = "block";
    } else {
        alert("Acceso denegado. Asegúrate de poner el Token de GitHub.");
    }
}

async function guardarEnGithub() {
    const token = document.getElementById('github-token').value;
    const id = document.getElementById('p-id').value;
    
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
        // 1. Obtener el archivo actual y su SHA
        const resGet = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
        const dataGet = await resGet.json();
        
        // 2. Decodificar y actualizar
        let contenido = JSON.parse(atob(dataGet.content));
        contenido[id] = nuevoVinilo;

        // 3. Subir de nuevo a GitHub
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
        }
    } catch (e) {
        alert("Error al conectar con GitHub.");
    }
}

// Asignamos la función al botón del admin
const btnGuardar = document.getElementById('btn-guardar-github');
if(btnGuardar) btnGuardar.onclick = guardarEnGithub;
