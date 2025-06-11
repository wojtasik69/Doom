const FOV = Math.PI / 3; // Field of View
const HALF_FOV = FOV / 2;
const NUM_RAYS = 800; // Liczba promieni (równa szerokości canvasu)
const DELTA_ANGLE = FOV / NUM_RAYS;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PROJECTION_PLANE_DIST = (CANVAS_WIDTH / 2) / Math.tan(HALF_FOV);

const ctx = document.getElementById('gameCanvas').getContext('2d');

function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Rysowanie podłogi i sufitu (uproszczone kolory)
    ctx.fillStyle = '#666'; // Sufit
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 2);
    ctx.fillStyle = '#444'; // Podłoga
    ctx.fillRect(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT / 2);
}

function renderGame() {
    clearCanvas();

    let rayAngle = PLAYER.angle - HALF_FOV;

    for (let ray = 0; ray < NUM_RAYS; ray++) {
        // Oblicz kierunek promienia
        let dirX = Math.cos(rayAngle);
        let dirY = Math.sin(rayAngle);

        // Pozycja gracza na mapie w jednostkach siatki
        let mapX = Math.floor(PLAYER.x / TILE_SIZE);
        let mapY = Math.floor(PLAYER.y / TILE_SIZE);

        // Długości kroku i odległości od początku promienia do następnej linii siatki
        let sideDistX, sideDistY;

        // Długości promienia od jednej linii siatki do następnej (w poziomie i pionie)
        const deltaDistX = Math.abs(1 / dirX);
        const deltaDistY = Math.abs(1 / dirY);

        let stepX, stepY; // Kierunek kroku (1 lub -1)
        let hit = 0; // Czy trafiono w ścianę
        let side; // Czy trafiono w ścianę poziomą (0) czy pionową (1)

        // Obliczanie początkowych sideDistX, sideDistY i kierunku kroku
        if (dirX < 0) {
            stepX = -1;
            sideDistX = (PLAYER.x - mapX * TILE_SIZE) * deltaDistX / TILE_SIZE;
        } else {
            stepX = 1;
            sideDistX = ((mapX + 1) * TILE_SIZE - PLAYER.x) * deltaDistX / TILE_SIZE;
        }
        if (dirY < 0) {
            stepY = -1;
            sideDistY = (PLAYER.y - mapY * TILE_SIZE) * deltaDistY / TILE_SIZE;
        } else {
            stepY = 1;
            sideDistY = ((mapY + 1) * TILE_SIZE - PLAYER.y) * deltaDistY / TILE_SIZE;
        }

        // Algorytm DDA (Digital Differential Analyzer)
        while (hit === 0) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0; // Trafiono w ścianę pionową
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1; // Trafiono w ścianę poziomą
            }
            if (mapX >= 0 && mapX < MAP_WIDTH && mapY >= 0 && mapY < MAP_HEIGHT && MAP[mapY][mapX] > 0) {
                hit = 1; // Trafiono w ścianę
            }
        }

        // Obliczanie odległości do ściany
        let perpWallDist;
        if (side === 0) {
            perpWallDist = (mapX * TILE_SIZE - PLAYER.x + (1 - stepX) * TILE_SIZE / 2) / dirX;
        } else {
            perpWallDist = (mapY * TILE_SIZE - PLAYER.y + (1 - stepY) * TILE_SIZE / 2) / dirY;
        }

        // Korekcja efektu rybiego oka
        perpWallDist = perpWallDist * Math.cos(PLAYER.angle - rayAngle);

        if (perpWallDist === 0) perpWallDist = 0.0001; // Zapobieganie dzieleniu przez zero

        // Oblicz wysokość linii do narysowania
        let lineHeight = (TILE_SIZE * PROJECTION_PLANE_DIST) / perpWallDist;

        // Oblicz punkt startowy i końcowy rysowania linii
        let drawStart = -lineHeight / 2 + CANVAS_HEIGHT / 2;
        if (drawStart < 0) drawStart = 0;
        let drawEnd = lineHeight / 2 + CANVAS_HEIGHT / 2;
        if (drawEnd >= CANVAS_HEIGHT) drawEnd = CANVAS_HEIGHT - 1;

        // Wybierz kolor ściany (uproszczone: jaśniejszy/ciemniejszy w zależności od boku)
        let wallColor = '#888'; // Domyślny szary
        if (side === 1) { // Ściana pozioma
            wallColor = '#555';
        }
        
        ctx.fillStyle = wallColor;
        ctx.fillRect(ray, drawStart, 1, drawEnd - drawStart);

        rayAngle += DELTA_ANGLE; // Przejście do następnego promienia
    }
}
