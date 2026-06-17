const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 160;

const particles = [];
const mouse = { x: -9999, y: -9999 };

function isInHeart(x, y) {
  const a = x * x + y * y - 1;
  return Math.pow(a, 3) - x * x * y * y * y <= 0;
}

// 🔁 Generar una rejilla de puntos
const spacing = 0.05; // cuanto menor, más puntos y más uniforme
for (let x = -1.5; x <= 1.5; x += spacing) {
  for (let y = -1.5; y <= 1.5; y += spacing) {
    if (isInHeart(x, y)) {
      const px = centerX + x * scale;
      const py = centerY - y * scale;

      particles.push({
        x: px,
        y: py,
        ox: px,
        oy: py,
        vx: 0,
        vy: 0
      });
    }
  }
}

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.min(150 / (dist || 1), 4);

    if (dist < 100) {
      const angle = Math.atan2(dy, dx);
      p.vx += Math.cos(angle) * force;
      p.vy += Math.sin(angle) * force;
    }

    // Volver a posición original
    p.vx += (p.ox - p.x) * 0.05;
    p.vy += (p.oy - p.y) * 0.05;

    p.vx *= 0.9;
    p.vy *= 0.9;

    p.x += p.vx;
    p.y += p.vy;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ff3366";
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

animate();
