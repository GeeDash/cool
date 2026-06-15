'use strict';

const cord     = document.getElementById('cord');
const cordPath = document.getElementById('cord-path');
const cordKnob = document.getElementById('cord-knob');
const scene    = document.querySelector('.toggle-scene');

/* ── Coordenadas base (coinciden con el viewBox "0 0 40 145") ── */
const CX        = 20;   // centro horizontal de la cuerda
const LINE_END  = 122;  // Y del extremo inferior de la línea en reposo
const KNOB_CY   = 131;  // Y del centro del tirador en reposo
const MAX_PULL  = 55;   // jalón máximo en px

let isDragging = false;
let startY     = 0;
let animFrame  = null;

/* ──────────────────────────────────────────
   Helpers matemáticos
────────────────────────────────────────── */
const lerp      = (a, b, t) => a + (b - a) * t;
const easeInOut = t => t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* ──────────────────────────────────────────
   Dibuja la cuerda en pantalla.

   • extraY    → cuántos px baja el extremo inferior (0 = reposo)
   • amplitude → desplazamiento horizontal de los puntos de control.
                 Positivo: cp1 va a la derecha / cp2 a la izquierda → S-curve
                 Negativo: S invertida
────────────────────────────────────────── */
function drawCord(extraY, amplitude) {
    const bottom = LINE_END + extraY;
    const knobY  = KNOB_CY  + extraY;

    if (Math.abs(amplitude) < 0.4) {
        // Línea recta
        cordPath.setAttribute('d', `M ${CX} 0 L ${CX} ${bottom}`);
    } else {
        // Bézier cúbico en S:
        //   cp1 = primer tercio, desplazado +amplitude
        //   cp2 = segundo tercio, desplazado -amplitude
        const third = bottom / 3;
        cordPath.setAttribute('d', [
            `M ${CX} 0`,
            `C ${CX + amplitude} ${third},`,
            `  ${CX - amplitude} ${third * 2},`,
            `  ${CX} ${bottom}`
        ].join(' '));
    }

    cordKnob.setAttribute('cy', knobY);
}

/* ──────────────────────────────────────────
   Animación de rebote tras soltar la cuerda.

   Keyframes: [ t_normalizado, extraY_del_handle, amplitud_S ]
   • t  : 0 → 1  durante `DURATION` ms
   • h  : desplazamiento vertical extra del extremo inferior
   • amp: deformación horizontal (crea la S)
────────────────────────────────────────── */
const DURATION = 800; // ms

function animateRelease(pull) {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }

    // Sin jalón suficiente: vuelve directamente a recto
    if (pull < 1) { drawCord(0, 0); return; }

    /* Keyframes cuidadosamente ajustados para que se vea:
       1. El handle baja (pull) y de golpe vuelve arriba  →  t 0..0.25
       2. Aparece una S pronunciada                       →  t 0.25..0.45
       3. La S se invierte (rebote)                       →  t 0.45..0.62
       4. Oscilaciones amortiguadas                       →  t 0.62..1.00  */
    const kf = [
      // [ t ,   h    , amp ]
        [0.00,  pull ,   0  ],   // inicio: jalada, recta
        [0.25,   0   ,  16  ],   // handle regresa; S comienza (cp1 a la derecha)
        [0.45,   0   , -12  ],   // S invertida
        [0.62,   0   ,   7  ],   // ola menor
        [0.76,   0   ,  -4  ],   // micro-ola
        [0.88,   0   ,   2  ],   // casi quieta
        [1.00,   0   ,   0  ],   // recta perfecta
    ];

    const t0 = performance.now();

    function frame(now) {
        const raw = Math.min((now - t0) / DURATION, 1.0);

        // Encontrar el segmento de keyframes donde estamos
        let i = 0;
        while (i < kf.length - 2 && raw > kf[i + 1][0]) i++;

        const [kt0, h0, a0] = kf[i];
        const [kt1, h1, a1] = kf[i + 1];
        const segLen = kt1 - kt0;
        const segT   = segLen > 0 ? easeInOut((raw - kt0) / segLen) : 1;

        drawCord(lerp(h0, h1, segT), lerp(a0, a1, segT));

        if (raw < 1.0) {
            animFrame = requestAnimationFrame(frame);
        } else {
            animFrame = null;
            drawCord(0, 0); // estado final garantizado: recto
        }
    }

    animFrame = requestAnimationFrame(frame);
}

/* ──────────────────────────────────────────
   Manejo de eventos (mouse + touch)
────────────────────────────────────────── */
const getClientY = e =>
    e.clientY
    ?? e.touches?.[0]?.clientY
    ?? e.changedTouches?.[0]?.clientY
    ?? 0;

const onStart = (e) => {
    e.preventDefault();
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    isDragging = true;
    startY = getClientY(e);
    cord.style.cursor = 'grabbing';
};

const onMove = (e) => {
    if (!isDragging) return;
    const delta = Math.max(0, Math.min(getClientY(e) - startY, MAX_PULL));

    // Mientras se jala: la cuerda se estira hacia abajo casi recta
    // (levísima curva de tensión para que no se vea rígida)
    drawCord(delta, delta * 0.07);
};

const onEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    cord.style.cursor = 'grab';

    const delta = Math.max(0, Math.min(getClientY(e) - startY, MAX_PULL));

    // Toggle si se jaló lo suficiente
    if (delta > 15) scene.classList.toggle('is-on');

    animateRelease(delta);
};

/* Mouse */
cord.addEventListener('mousedown', onStart);
window.addEventListener('mousemove', onMove);
window.addEventListener('mouseup',   onEnd);

/* Touch */
cord.addEventListener('touchstart', onStart, { passive: false });
window.addEventListener('touchmove',  onMove,  { passive: false });
window.addEventListener('touchend',   onEnd);
