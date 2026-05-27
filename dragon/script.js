const canvas = document.getElementById('dragonCanvas');
const ctx = canvas.getContext('2d');

// Ajustar el canvas al tamaño de la pantalla
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Coordenadas del mouse (inicia en el centro)
const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

// Configuración del cuerpo del dragón
const numSegments = 35;       // Cantidad de "vértebras" o segmentos
const segments = [];
const segmentLength = 22;     // Distancia fija entre cada segmento

// Inicializar todos los segmentos en el centro de la pantalla
for (let i = 0; i < numSegments; i++) {
    segments.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        angle: 0
    });
}

let time = 0;

function animate() {
    // Limpiar el lienzo en cada fotograma
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.05;

    // 1. Movimiento de la cabeza (segmento 0) hacia el mouse con suavizado
    const head = segments[0];
    head.x += (pointer.x - head.x) * 0.15;
    head.y += (pointer.y - head.y) * 0.15;

    // 2. Cinemática inversa: cada segmento sigue al que tiene adelante
    for (let i = 1; i < numSegments; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];

        // Calcular la distancia y el ángulo hacia el segmento anterior
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        curr.angle = Math.atan2(dy, dx);

        // Restringir la posición para mantener la distancia constante
        curr.x = prev.x - Math.cos(curr.angle) * segmentLength;
        curr.y = prev.y - Math.sin(curr.angle) * segmentLength;
    }

    // 3. Renderizado: Dibujar de atrás hacia adelante para que la cabeza quede arriba
    for (let i = numSegments - 1; i >= 0; i--) {
        const seg = segments[i];

        ctx.save();
        ctx.translate(seg.x, seg.y);
        ctx.rotate(seg.angle);

        // sizeFactor hace que el cuerpo sea más grueso en el medio y fino en los extremos
        const sizeFactor = Math.sin((i / numSegments) * Math.PI); 
        ctx.strokeStyle = '#1a1a1a';
        ctx.fillStyle = '#1a1a1a';

        if (i === 0) {
            // --- DIBUJAR LA CABEZA ---
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Detalles de los cuernos
            ctx.beginPath();
            ctx.moveTo(-5, -5);
            ctx.lineTo(-20, -15);
            ctx.moveTo(-5, 5);
            ctx.lineTo(-20, 15);
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // --- DIBUJAR EL CUERPO / ESPINAS ---
            // El seno dependiente del tiempo ('time') genera el efecto de ondulación orgánica
            const ribLength = 15 + sizeFactor * 25 + Math.sin(time + i * 0.5) * 5;

            ctx.lineWidth = 2;
            ctx.beginPath();
            // Espina lateral superior
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-10, -ribLength / 2, -5, -ribLength);
            // Espina lateral inferior
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-10, ribLength / 2, -5, ribLength);
            ctx.stroke();

            // Vértebra central
            ctx.beginPath();
            ctx.arc(0, 0, 4 + sizeFactor * 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // Volver a ejecutar la animación en el próximo fotograma disponible
    requestAnimationFrame(animate);
}

// Iniciar el bucle de animación
animate();