// --- VARIABLES PRINCIPALES ---
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const tileSize = 32;

// --- CARGAR IMÁGENES ---
const tileset = new Image();
tileset.src = "recursos/img/DungeonCrawl_ProjectUtumnoTileset.png"; // Ruta del tileset 8-bit

const playerImg = new Image();
playerImg.src = "recursos/img/personaje.png"; // Tu sprite 8-bit del personaje

// --- MAPA (10x7) ---
// 0 = piso, 1 = pared, 2 = zona oscura
const map = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,2,0,0,0,0,1],
    [1,0,0,2,0,0,2,0,0,1],
    [1,0,0,0,0,0,0,2,0,1],
    [1,0,2,0,0,2,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
];

// --- JUGADOR ---
let player = { x: 64, y: 64, w: 16, h: 16 };
let sanity = 100;
let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// --- DIBUJAR MAPA ---
// Coordenadas de tiles dentro del tileset:
// piso: (0,0)   pared: (32,0)   oscuro: (64,0)
function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const tile = map[y][x];
            let sx = 0, sy = 0;

            if (tile === 1) sx = 32;   // pared
            if (tile === 2) sx = 64;   // zona oscura

            ctx.drawImage(tileset, sx, sy, 32, 32, x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}

// --- ACTUALIZAR LÓGICA ---
function update() {
    const speed = 1.5;

    if (keys['ArrowUp']) player.y -= speed;
    if (keys['ArrowDown']) player.y += speed;
    if (keys['ArrowLeft']) player.x -= speed;
    if (keys['ArrowRight']) player.x += speed;

    // Detectar zona oscura (reduce sanidad)
    const tileX = Math.floor(player.x / tileSize);
    const tileY = Math.floor(player.y / tileSize);

    if (map[tileY] && map[tileY][tileX] === 2) {
        sanity -= 0.1;
    }

    if (sanity < 0) sanity = 0;
    document.getElementById("sanity").innerText = sanity.toFixed(0);
}

// --- DIBUJAR JUGADOR ---
function drawPlayer() {
    if (playerImg.complete && playerImg.naturalWidth > 0) {
        ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    } else {
        ctx.fillStyle = "#f2c94c";
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }
}

// --- EFECTOS DE LOCURA ---
function drawSanityEffects() {
    if (sanity < 50 && Math.random() < 0.1) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 20, 20);
    }
}

// --- MENSAJES DE ECO ---
const mensajes = [
    "¿Estás solo aquí?",
    "La puerta no siempre lleva a la salida...",
    "No recuerdas lo que hiciste, ¿verdad?",
    "El espejo te observa también."
];

document.addEventListener("keydown", () => {
    const random = Math.floor(Math.random() * mensajes.length);
    document.getElementById("mensaje").textContent = mensajes[random];
});

// --- BUCLE PRINCIPAL ---
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    update();
    drawPlayer();
    drawSanityEffects();
    requestAnimationFrame(loop);
}

loop();
