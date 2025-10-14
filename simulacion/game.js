const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

let player = { x: 40, y: 40, w: 16, h: 16 };
let sanity = 100;
let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function update() {
    const speed = 1.5;
    if (keys['ArrowUp']) player.y -= speed;
    if (keys['ArrowDown']) player.y += speed;
    if (keys['ArrowLeft']) player.x -= speed;
    if (keys['ArrowRight']) player.x += speed;

    if (player.x > 150 && player.x < 200) sanity -= 0.1; // zona “oscura”
    document.getElementById("sanity").innerText = sanity.toFixed(0);
}

function draw() {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f2c94c";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    if (sanity < 50 && Math.random() < 0.1) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(Math.random() * 320, Math.random() * 240, 20, 20);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
