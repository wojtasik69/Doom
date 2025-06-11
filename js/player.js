const PLAYER = {
    x: 1.5 * TILE_SIZE, // Początkowa pozycja X
    y: 1.5 * TILE_SIZE, // Początkowa pozycja Y
    angle: Math.PI / 2, // Początkowy kąt (patrzenie w dół)
    speed: 5,           // Prędkość poruszania
    rotationSpeed: 0.05 // Prędkość obrotu
};

let keys = {}; // Obiekt do śledzenia wciśniętych klawiszy

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function updatePlayer() {
    if (keys['ArrowUp'] || keys['KeyW']) {
        PLAYER.x += Math.cos(PLAYER.angle) * PLAYER.speed;
        PLAYER.y += Math.sin(PLAYER.angle) * PLAYER.speed;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        PLAYER.x -= Math.cos(PLAYER.angle) * PLAYER.speed;
        PLAYER.y -= Math.sin(PLAYER.angle) * PLAYER.speed;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
        PLAYER.angle -= PLAYER.rotationSpeed;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        PLAYER.angle += PLAYER.rotationSpeed;
    }
}
