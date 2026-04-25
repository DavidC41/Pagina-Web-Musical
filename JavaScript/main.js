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
        imagen: "Imagenes/diego900-vinilo.png",
        desc: "Edición limitada en formato doble vinilo. Contiene 2 vinilos de 180gr y pósters exclusivos.",
        agotado: true
    },
    "kanye-west": {
        artista: "Kanye West",
        titulo: "My Beautiful Dark Twisted Fantasy",
        precio: "49,99 €",
        imagen: "Imagenes/Kanye_West-vinilo.png",
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
