// --- CONFIGURACIÓN BÁSICA ---
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// --- CARGAR RECURSOS ---
const fondo = new Image();
fondo.src = "img/fondo.png"; // asegúrate que sea .png

const playerImg = new Image();
playerImg.src = "img/personaje.png";

const puertaImg = new Image();
puertaImg.src = "img/puerta.png";

// --- SONIDOS ---
const ecoSound = new Audio("img/Eco.wav"); // si sigue siendo .waw, cambia a .wav
const golpeSound = new Audio("img/golpe.mp3");

// --- VARIABLES DEL JUEGO ---
let player = { x: 140, y: 100, w: 24, h: 24, speed: 2 };
let sanity = 100;
let keys = {};

// --- EVENTOS DE TECLADO ---
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// --- FUNCIONES DEL JUEGO ---

// Dibuja fondo, puerta y personaje
function draw() {
    // Fondo
    if (fondo.complete && fondo.naturalWidth > 0) {
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Puerta (decorativo)
    ctx.drawImage(puertaImg, 250, 160, 40, 40);

    // Personaje
    if (playerImg.complete && playerImg.naturalWidth > 0) {
        ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    } else {
        ctx.fillStyle = "#f2c94c";
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }
}

// Actualiza posición y lógica
function update() {
    let moved = false;

    if (keys["ArrowUp"]) { player.y -= player.speed; moved = true; }
    if (keys["ArrowDown"]) { player.y += player.speed; moved = true; }
    if (keys["ArrowLeft"]) { player.x -= player.speed; moved = true; }
    if (keys["ArrowRight"]) { player.x += player.speed; moved = true; }

    // Colisiones con bordes
    if (player.x < 0) { player.x = 0; golpeSound.play().catch(() => {}); }
    if (player.y < 0) { player.y = 0; golpeSound.play().catch(() => {}); }
    if (player.x + player.w > canvas.width) { player.x = canvas.width - player.w; golpeSound.play().catch(() => {}); }
    if (player.y + player.h > canvas.height) { player.y = canvas.height - player.h; golpeSound.play().catch(() => {}); }

    // Reducir sanidad cuando se mueve
    if (moved) {
        sanity -= 0.03;
        if (sanity < 0) sanity = 0;
        document.getElementById("sanity").textContent = sanity.toFixed(0);
    }
}

// Efectos visuales cuando la sanidad baja
function drawSanityEffects() {
    if (sanity < 50 && Math.random() < 0.1) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 10, 10);
    }
}

// Mensajes de eco
const mensajes = [
    "¿Estás solo aquí?",
    "La puerta no siempre lleva a la salida...",
    "No recuerdas lo que hiciste, ¿verdad?",
    "El espejo te observa también."
];

document.addEventListener("keydown", e => {
    // Ignorar teclas de movimiento
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;

    const random = Math.floor(Math.random() * mensajes.length);
    document.getElementById("mensaje").textContent = mensajes[random];

    // Sonido del eco
    ecoSound.currentTime = 0;
    ecoSound.play().catch(() => {});
});

// Bucle principal
function loop() {
    update();
    draw();
    drawSanityEffects();
    requestAnimationFrame(loop);
}

// Inicia el juego
loop();
