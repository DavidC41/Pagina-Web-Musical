 // Seleccionamos los elementos
    const openMenuBtn = document.querySelector('.action-menu'); // El botón con las rayitas
    const sideMenu = document.querySelector('.side-menu');
    const navLinks = document.querySelectorAll('.nav-links li');

    // 1. Añadimos un índice a cada enlace para la animación de cascada (Apparell style)
    navLinks.forEach((link, index) => {
        link.style.setProperty('--i', index + 1);
    });

    // 2. Función para abrir el menú
    openMenuBtn.addEventListener('click', () => {
        sideMenu.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Bloquea el scroll de la web de fondo
    });

    // 3. Función para cerrar el menú
    // (He añadido un detector para que si haces clic en un enlace, el menú se cierre)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sideMenu.classList.remove('is-active');
            document.body.style.overflow = ''; // Devuelve el scroll
        });
    });

    // 4. Si quieres un botón de cerrar específico (la X), asegúrate de que tenga la clase .close-menu
    const closeMenuBtn = document.querySelector('.close-menu');
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            sideMenu.classList.remove('is-active');
            document.body.style.overflow = '';
        });
    }   

    /* =========================================
   2. BASE DE DATOS DE VINILOS
   ========================================= */

const catalogo = {
    "diego900": {
        artista: "Diego 900",
        titulo: "La Espalda del Sol",
        precio: "30,00 €",
        imagen: "/Imagenes/diego900-vinilo.png",
        desc: "Edición limitada en formato doble vinilo. Contiene 2 vinilos de 180gr y pósters exclusivos.",
        agotado: true

    },
    "kanye-west": {
        artista: "Kanye West",
        titulo: "My Beautiful Dark Twisted Fantasy",
        precio: "49,99 €",
        imagen: "/Imagenes/Kanye_West-vinilo.png",
        desc: "Edición de lujo con arte original y triple vinilo de alta fidelidad.",
        agotado: false
    }
    // Puedes seguir añadiendo más aquí...
};

/* =========================================
   3. LÓGICA DINÁMICA (Solo para producto.html)
   ========================================= */

function cargarDatosProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // Coge el "diego900" de la URL
    const producto = catalogo[id];

    // Comprobamos si estamos en la página de producto buscando un elemento que solo exista ahí

    const tituloElemento = document.getElementById('txt-titulo');

    if (producto && tituloElemento) {
        document.getElementById('txt-artista').innerText = producto.artista;
        document.getElementById('txt-titulo').innerText = producto.titulo;
        document.getElementById('txt-precio').innerText = producto.precio;
        document.getElementById('txt-descripcion').innerText = producto.desc;
        document.getElementById('main-img').src = producto.imagen;


        // Si el producto NO está agotado, cambiamos el botón gris por el verde

        if (!producto.agotado) {
            document.getElementById('status-badge').style.display = 'none';
            const btnPrincipal = document.getElementById('btn-principal');
            const btnSecundario = document.getElementById('btn-secondary');

            btnPrincipal.innerText = "AÑADIR AL CARRITO";
            btnPrincipal.style.backgroundColor = "#79d616"; // Verde BIBERON
            btnPrincipal.style.color = "#000";
            btnPrincipal.style.cursor = "pointer";

            
            if (btnSecundario) btnSecundario.style.display = 'none'; // Ocultamos el "Avísame"

        }

    }

}



// Ejecutamos la función de carga al iniciar

window.addEventListener('load', cargarDatosProducto);


/* --- LÓGICA DE ADMIN --- */

function verificarPassword() {
    const pass = document.getElementById('admin-pass').value;

    // Pon aquí la contraseña que quieras para tu trabajo

    if(pass === "BIBERON2026") {
        document.getElementById('login-section').style.display = "none";
        document.getElementById('form-section').style.display = "block";
    } else {
        alert("Acceso denegado");

    }

}

const generateBtn = document.getElementById('generate-btn');

if (generateBtn) {

    generateBtn.addEventListener('click', () => {
        const id = document.getElementById('p-id').value;
        const artista = document.getElementById('p-artista').value;
        const titulo = document.getElementById('p-titulo').value;
        const precio = document.getElementById('p-precio').value;
        const img = "/Imagenes/" + document.getElementById('p-img').value;
        const desc = document.getElementById('p-desc').value;

        const resultado = `"${id}": {

    artista: "${artista}",
    titulo: "${titulo}",
    precio: "${precio}",
    imagen: "${img}",
    desc: "${desc}"

},`;


        const output = document.getElementById('code-output');
        output.innerText = "COPIA ESTO EN TU JAVASCRIPT:\n\n" + resultado;
        output.style.display = "block";

    });

}



/* --- LÓGICA DE TIENDA (INDEX) --- */

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



/* --- LÓGICA DE PRODUCTO --- */

function cargarDetalle() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const titleTag = document.getElementById('txt-titulo');



    if (id && titleTag && catalogo[id]) {

        const p = catalogo[id];
        document.getElementById('txt-artista').innerText = p.artista;
        document.getElementById('txt-titulo').innerText = p.titulo;
        document.getElementById('txt-precio').innerText = p.precio;
        document.getElementById('txt-descripcion').innerText = p.desc;
        document.getElementById('main-img').src = p.imagen;

    }

}


/* --- INICIALIZACIÓN --- */

window.onload = () => {

    pintarTienda();
    cargarDetalle();

};
