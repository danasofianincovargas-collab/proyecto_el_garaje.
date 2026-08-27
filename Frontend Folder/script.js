/* =================================================================
   SISTEMA CENTRALIZADO - EL GARAJE (GA3-220501096-AA2-EV02)
   Frontend unificado: autenticación real vía API, buscador dinámico
   y gestión de favoritos. Un solo script.js para todas las páginas.
   ================================================================= */

const API_BASE_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    inicializarLogin();
    inicializarBuscador();
    inicializarFavoritos();
});


/* =================================================================
   1. MÓDULO DE AUTENTICACIÓN (login.html)
   Consume la API real del backend (POST /api/usuarios/login).
   Ya no se valida contraseña ni se guarda sesión en LocalStorage.
   ================================================================= */
function inicializarLogin() {
    const formLogin = document.getElementById("formLogin");
    if (!formLogin) return;

    const inputCorreo = document.getElementById("correo");
    const inputPassword = document.getElementById("password");
    const btnTogglePassword = document.getElementById("btnTogglePassword");
    const iconoOjo = document.getElementById("iconoOjo");
    const chkRecordar = document.getElementById("chkRecordar");
    const alertaError = document.getElementById("alertaError");

    // Recordar solo el correo (nunca la contraseña) si el usuario lo pidió
    const correoRecordado = localStorage.getItem("correoRecordado");
    if (correoRecordado && inputCorreo && chkRecordar) {
        inputCorreo.value = correoRecordado;
        chkRecordar.checked = true;
    }

    // Mostrar u ocultar la contraseña
    if (btnTogglePassword && inputPassword && iconoOjo) {
        btnTogglePassword.addEventListener("click", () => {
            const esPassword = inputPassword.getAttribute("type") === "password";
            inputPassword.setAttribute("type", esPassword ? "text" : "password");
            iconoOjo.classList.toggle("bi-eye");
            iconoOjo.classList.toggle("bi-eye-slash");
        });
    }

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (alertaError) alertaError.classList.add("d-none");

        const correo = inputCorreo.value.trim();
        const password = inputPassword.value.trim();

        try {
            const respuesta = await fetch(`${API_BASE_URL}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, password })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                mostrarErrorLogin(alertaError, datos.mensaje || "Correo o contraseña incorrectos.");
                return;
            }

            if (chkRecordar && chkRecordar.checked) {
                localStorage.setItem("correoRecordado", correo);
            } else {
                localStorage.removeItem("correoRecordado");
            }

            // Sesión activa en memoria de pestaña (sin contraseña).
            // Esta es la fuente real de autorización: cada panel valida
            // contra esto, no contra parámetros de la URL.
            sessionStorage.setItem("usuarioActivo", JSON.stringify(datos.usuario));

            window.location.href = `${datos.usuario.rol}.html`;
        } catch (error) {
            mostrarErrorLogin(alertaError, "No fue posible conectar con el servidor. Intenta de nuevo.");
        }
    });
}

function mostrarErrorLogin(alertaError, mensaje) {
    if (!alertaError) {
        alert(mensaje);
        return;
    }
    alertaError.textContent = mensaje;
    alertaError.classList.remove("d-none");
}


/* =================================================================
   MÓDULO DE PROTECCIÓN DE VISTAS (admin.html / cocina.html / mesero.html)
   Es la única fuente real de autorización: exige haber pasado por el
   login (POST /api/usuarios/login) y tener el rol correcto guardado
   en sessionStorage. Sin esto, cualquiera podía entrar a un panel
   solo escribiendo la URL con ?rol=admin, sin nunca dar la clave.
   ================================================================= */
function protegerVista(rolRequerido) {
    let usuario = null;
    try {
        usuario = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    } catch (error) {
        usuario = null;
    }

    if (!usuario || usuario.rol !== rolRequerido) {
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}


/* =================================================================
   2. MÓDULO DE BÚSQUEDA DINÁMICA EN TIEMPO REAL (destinos.html / menu.html)
   ================================================================= */
function inicializarBuscador() {
    const inputBuscador = document.getElementById("inputBuscador");
    const tarjetasDestinos = document.querySelectorAll(".card-destino");
    const alertaSinResultados = document.getElementById("alertaSinResultados");

    if (!inputBuscador) return;

    inputBuscador.addEventListener("input", (e) => {
        const textoBusqueda = e.target.value.toLowerCase().trim();
        let encontrados = 0;

        tarjetasDestinos.forEach((tarjeta) => {
            const tituloCard = tarjeta.querySelector(".card-title").textContent.toLowerCase();

            if (tituloCard.includes(textoBusqueda)) {
                tarjeta.style.display = "block";
                encontrados++;
            } else {
                tarjeta.style.display = "none";
            }
        });

        if (alertaSinResultados) {
            const sinCoincidencias = encontrados === 0 && textoBusqueda !== "";
            alertaSinResultados.classList.toggle("d-none", !sinCoincidencias);
        }
    });
}


/* =================================================================
   3. MÓDULO DE GESTIÓN DE FAVORITOS Y PERSISTENCIA (destinos.html)
   ================================================================= */
function inicializarFavoritos() {
    const botonesFavorito = document.querySelectorAll(".btn-favorito");
    if (botonesFavorito.length === 0) return;

    let favoritos = JSON.parse(localStorage.getItem("favoritosElGaraje")) || [];

    botonesFavorito.forEach((boton) => {
        const idDestino = boton.getAttribute("data-id");
        const tarjeta = boton.closest(".card-destino");
        const badgeFavorito = tarjeta ? tarjeta.querySelector(".badge-favorito") : null;

        if (favoritos.includes(idDestino)) {
            marcarComoFavoritoUI(boton, badgeFavorito, true);
        }

        boton.addEventListener("click", () => {
            const esFavoritoActual = favoritos.includes(idDestino);

            if (esFavoritoActual) {
                favoritos = favoritos.filter((id) => id !== idDestino);
                marcarComoFavoritoUI(boton, badgeFavorito, false);
            } else {
                favoritos.push(idDestino);
                marcarComoFavoritoUI(boton, badgeFavorito, true);
            }

            localStorage.setItem("favoritosElGaraje", JSON.stringify(favoritos));
        });
    });
}

function marcarComoFavoritoUI(boton, badge, esFavorito) {
    if (esFavorito) {
        boton.classList.remove("btn-outline-danger");
        boton.classList.add("btn-danger");
        boton.innerHTML = "❤️ Favorito";
        if (badge) badge.classList.remove("d-none");
    } else {
        boton.classList.remove("btn-danger");
        boton.classList.add("btn-outline-danger");
        boton.innerHTML = "🤍 Marcar Favorito";
        if (badge) badge.classList.add("d-none");
    }
}
