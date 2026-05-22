const cord = document.getElementById('cord');
const scene = document.querySelector('.toggle-scene');

let isDragging = false;
let startY = 0;
const maxPull = 40; // Máximo de píxeles que se puede jalar hacia abajo

// Detectar cuando se empieza a jalar (Mouse y Pantallas Táctiles)
const startPull = (e) => {
    isDragging = true;
    startY = e.clientY || e.touches[0].clientY;
    cord.style.transition = 'none'; // Quitamos transición mientras se arrastra
};

// Detectar el movimiento del jalón
const movePull = (e) => {
    if (!isDragging) return;
    
    const currentY = e.clientY || e.touches[0].clientY;
    const deltaY = currentY - startY;

    // Solo permitimos jalar hacia abajo hasta el límite (maxPull)
    if (deltaY > 0 && deltaY < maxPull) {
        cord.style.transform = `translateX(-50%) translateY(${deltaY}px)`;
    }
};

// Detectar cuando se suelta la cuerda
const endPull = (e) => {
    if (!isDragging) return;
    isDragging = false;

    // Obtener la posición final antes de soltar
    const transformValue = window.getComputedStyle(cord).transform;
    const matrix = new WebKitCSSMatrix(transformValue);
    const draggedDistance = matrix.m42; // Distancia en el eje Y

    // Si se jaló lo suficiente (más de 15px), ejecutamos el interruptor
    if (draggedDistance > 15) {
        scene.classList.toggle('is-on');
    }

    // Devolver la cuerda a su estado original con efecto elástico
    cord.style.transition = 'transform 0.3s cubic-bezier(0.57, 1.83, 0.43, 0.88)';
    cord.style.transform = 'translateX(-50%) translateY(0px)';
};

// Eventos de Mouse
cord.addEventListener('mousedown', startPull);
window.addEventListener('mousemove', movePull);
window.addEventListener('mouseup', endPull);

// Eventos Táctiles (Móviles)
cord.addEventListener('touchstart', startPull);
window.addEventListener('touchmove', movePull);
window.addEventListener('touchend', endPull);