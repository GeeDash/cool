const canvas = document.getElementById('dragonCanvas');
const ctx    = canvas.getContext('2d');

function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
window.addEventListener('resize', resize);
resize();

const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
window.addEventListener('mousemove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });

// ── CONFIG ─────────────────────────────────────────────────────────────────
const NUM  = 36;
const STEP = 16;
const G    = 1.6180339887; // golden ratio for deterministic organic variation

// Per-segment variation table — generated once, read every frame
const V = Array.from({ length: NUM }, (_, i) => {
    const a = (i * G)               % 1;
    const b = (i * G * G   + 0.33)  % 1;
    const c = (i * G * 1.17 + 0.71) % 1;
    const d = (i * G * 0.77 + 0.19) % 1;
    return {
        tMul:  0.55 + a * 0.85,   // top rib length multiplier
        bMul:  0.45 + b * 0.95,   // bottom rib (more asymmetric)
        tSwp:  0.20 + a * 0.30,   // backward sweep – top
        bSwp:  0.16 + c * 0.36,   // backward sweep – bottom
        tBnd:  0.28 + b * 0.42,   // curvature – top
        bBnd:  0.22 + a * 0.45,   // curvature – bottom
        hasNS: d > 0.45,           // grows a neural spine projection
        phase: a * Math.PI * 2,
    };
});

const segs = Array.from({ length: NUM }, () => ({
    x: innerWidth / 2, y: innerHeight / 2, angle: 0
}));
let tick = 0;

// Evaluate quadratic bezier at parameter t
function qbez(ax, ay, cpx, cpy, bx, by, t) {
    const m = 1 - t;
    return {
        x: m * m * ax + 2 * m * t * cpx + t * t * bx,
        y: m * m * ay + 2 * m * t * cpy + t * t * by,
    };
}

// ── SPINE — tapered calligraphic stroke ────────────────────────────────────
function drawSpine() {
    ctx.lineCap = 'round';
    for (let i = 1; i < NUM; i++) {
        const t = i / (NUM - 1);
        const w = Math.max(0.3, Math.pow(Math.sin(t * Math.PI * 0.8 + 0.1), 0.55) * 2.5);
        ctx.beginPath();
        ctx.moveTo(segs[i - 1].x, segs[i - 1].y);
        ctx.lineTo(segs[i].x,     segs[i].y);
        ctx.strokeStyle = `rgba(20,18,15,${0.52 - t * 0.13})`;
        ctx.lineWidth   = w;
        ctx.stroke();
    }
}

// ── BONE RIB — thick base → medium shaft → ghost → dissolving tip ──────────
// All coords are in the local segment frame (translate + rotate already applied)
function drawBoneRib(ribLen, side, swp, bnd, segT, alpha, ay) {
    const tipX = -ribLen * swp;
    const tipY =  side * ribLen;
    const cpX  =  ribLen * 0.04 - ribLen * bnd * 0.24;
    const cpY  =  side * ribLen * 0.43 + ay;

    const m32 = qbez(0, 0, cpX, cpY, tipX, tipY, 0.32);
    const m65 = qbez(0, 0, cpX, cpY, tipX, tipY, 0.65);

    ctx.lineCap = 'round';

    // Layer A — thick base (0 → 32%)
    ctx.lineWidth   = Math.max(0.5, 2.1 - segT);
    ctx.strokeStyle = `rgba(20,18,15,${alpha * 0.75})`;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(cpX * 0.28, cpY * 0.28, m32.x, m32.y);
    ctx.stroke();

    // Layer B — medium shaft (0 → 65%)
    ctx.lineWidth   = Math.max(0.3, 1.0 - segT * 0.45);
    ctx.strokeStyle = `rgba(20,18,15,${alpha * 0.48})`;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(cpX * 0.52, cpY * 0.52, m65.x, m65.y);
    ctx.stroke();

    // Layer C — ghost full stroke (0 → 100%)
    ctx.lineWidth   = 0.42;
    ctx.strokeStyle = `rgba(20,18,15,${alpha * 0.20})`;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
    ctx.stroke();

    // Layer D — dissolving whiskers from ~60% of the bone outward
    const dBase = qbez(0, 0, cpX, cpY, tipX, tipY, 0.60);
    const dAng  = Math.atan2(tipY - cpY, tipX - cpX);
    for (let d = 0; d < 3; d++) {
        const aOff = (d - 1) * 0.30;
        const dLen = ribLen * (0.13 + d * 0.04);
        ctx.lineWidth   = 0.22;
        ctx.strokeStyle = `rgba(20,18,15,${alpha * (0.09 - d * 0.025)})`;
        ctx.beginPath();
        ctx.moveTo(dBase.x, dBase.y);
        ctx.lineTo(
            dBase.x + Math.cos(dAng + aOff) * dLen,
            dBase.y + Math.sin(dAng + aOff) * dLen
        );
        ctx.stroke();
    }
}

// ── NEURAL SPINE — small dorsal projection on select vertebrae ─────────────
function drawNeuralSpine(segT, v, alpha) {
    const h    = 4 + (1 - segT) * 5;
    const lean = (v.phase - Math.PI) * 0.08;
    ctx.lineWidth   = Math.max(0.32, 0.88 - segT * 0.38);
    ctx.strokeStyle = `rgba(20,18,15,${alpha * 0.58})`;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.quadraticCurveTo(lean, -h * 0.55, lean * 1.5, -h);
    ctx.stroke();
}

// ── WING / FEATHER SECTION — organic S-curve strands with fade ─────────────
// side: 'top' | 'bottom'  |  wingI: 0→1 intensity
function drawWingFeathers(idx, segT, v, wingI, side) {
    const sg      = side === 'top' ? -1 : 1;
    const baseAl  = (side === 'top' ? 0.38 : 0.20) * wingI * (1 - segT * 0.28);
    const baseLen = (side === 'top' ? 30 : 18) + wingI * 18;
    const numF    = Math.floor((side === 'top' ? 8 : 5) + wingI * 4);
    const wave    = Math.sin(tick * 1.08 + idx * 0.44 + v.phase) * 0.11;

    const startA = sg * 0.30 * Math.PI;
    const endA   = sg * 1.05 * Math.PI;

    for (let f = 0; f < numF; f++) {
        const frac = f / (numF - 1);
        const ang  = startA + (endA - startA) * frac + wave;
        const len  = baseLen * (0.28 + Math.sin(frac * Math.PI) * 0.72);
        const al   = baseAl  * (1 - frac * 0.52);
        const lw   = Math.max(0.16, (0.88 - frac * 0.64) * (1 - segT * 0.34));

        ctx.lineWidth   = lw;
        ctx.strokeStyle = `rgba(20,18,15,${al})`;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Cubic bezier for S-curve organic feel
        ctx.bezierCurveTo(
            Math.cos(ang + 0.42) * len * 0.38, Math.sin(ang + 0.42) * len * 0.38,
            Math.cos(ang + 0.10) * len * 0.73, Math.sin(ang + 0.10) * len * 0.73,
            Math.cos(ang) * len,                Math.sin(ang) * len
        );
        ctx.stroke();
    }

    // One long smoke tendril per top section
    if (side === 'top') {
        const tAng = sg * 0.60 * Math.PI + wave * 0.5;
        const tLen = baseLen * 1.38;
        ctx.lineWidth   = 0.18;
        ctx.strokeStyle = `rgba(20,18,15,${baseAl * 0.22})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            Math.cos(tAng + 0.50) * tLen * 0.32, Math.sin(tAng + 0.50) * tLen * 0.32,
            Math.cos(tAng + 0.12) * tLen * 0.68, Math.sin(tAng + 0.12) * tLen * 0.68,
            Math.cos(tAng) * tLen,                Math.sin(tAng) * tLen
        );
        ctx.stroke();
    }
}

// ── SEGMENT ────────────────────────────────────────────────────────────────
function drawSeg(s, idx) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);

    const t  = idx / (NUM - 1);
    const v  = V[idx];
    const al = 0.88 - t * 0.27;

    // Wing zones: primary shoulder (4–14), secondary hip (19–25)
    const wP = (idx >= 4  && idx <= 14) ? Math.sin((idx - 4)  / 10 * Math.PI) : 0;
    const wS = (idx >= 19 && idx <= 25) ? Math.sin((idx - 19) / 6  * Math.PI) * 0.48 : 0;
    const wingI = Math.max(wP, wS);

    // Feathers drawn first so bones layer on top
    if (wingI > 0.05) {
        drawWingFeathers(idx, t, v, wingI,        'top');
        drawWingFeathers(idx, t, v, wingI * 0.52, 'bottom');
    }

    // Rib base length
    let base;
    if (idx <= 5) {
        base = 23 - idx * 1.7;
    } else {
        base = Math.max(4, Math.sin((t - 0.13) * Math.PI * 1.18) * 27 + 5);
    }

    // Double-wave organic animation
    const ay = (
        Math.sin(tick * 1.35 + idx * 0.50 + v.phase) * 0.09 +
        Math.sin(tick * 0.62 + idx * 0.27)            * 0.038
    ) * base;

    // Bone ribs (top and bottom)
    drawBoneRib(base * v.tMul, -1, v.tSwp, v.tBnd, t, al,        ay);
    drawBoneRib(base * v.bMul, +1, v.bSwp, v.bBnd, t, al * 0.84, -ay * 0.72);

    // Neural spine on selected vertebrae
    if (v.hasNS) drawNeuralSpine(t, v, al);

    // Vertebra centrum — slightly irregular ellipse, not a perfect circle
    ctx.fillStyle = `rgba(20,18,15,${al * 0.92})`;
    const vs = Math.max(1.0, 2.6 * (1 - t * 0.58));
    ctx.beginPath();
    ctx.ellipse(0, 0, vs * 1.22, vs, 0.13 + v.phase * 0.07, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ── HEAD ───────────────────────────────────────────────────────────────────
function drawHead(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    ctx.fillStyle  = '#141210';
    ctx.strokeStyle = '#141210';
    ctx.lineCap    = 'round';

    // Upper crest — asymmetric fan of dissolving spines
    [
        [-0.34, 20, 0.47], [-0.51, 28, 0.43], [-0.69, 33, 0.38],
        [-0.87, 28, 0.33], [-1.04, 19, 0.27], [-1.22, 12, 0.20],
    ].forEach(([a, len, cOff]) => {
        const ang = a * Math.PI;
        ctx.lineWidth   = 1.0;
        ctx.strokeStyle = '#141210';
        ctx.beginPath(); ctx.moveTo(-1, 0);
        ctx.quadraticCurveTo(
            -1 + Math.cos(ang + cOff) * len * 0.52, Math.sin(ang + cOff) * len * 0.52,
            -1 + Math.cos(ang) * len,               Math.sin(ang) * len
        );
        ctx.stroke();
        // Fading tip whisker
        const tx = -1 + Math.cos(ang) * len;
        const ty = Math.sin(ang) * len;
        ctx.lineWidth   = 0.20;
        ctx.strokeStyle = 'rgba(20,18,15,0.09)';
        ctx.beginPath(); ctx.moveTo(tx, ty);
        ctx.lineTo(tx + Math.cos(ang) * len * 0.18, ty + Math.sin(ang) * len * 0.18);
        ctx.stroke();
    });

    // Lower crest — shorter, fewer
    [[0.29, 13, 0.42], [0.48, 17, 0.38], [0.66, 11, 0.32]].forEach(([a, len, cOff]) => {
        const ang = a * Math.PI;
        ctx.lineWidth   = 0.80;
        ctx.strokeStyle = '#141210';
        ctx.beginPath(); ctx.moveTo(-1, 0);
        ctx.quadraticCurveTo(
            -1 + Math.cos(ang + cOff) * len * 0.50, Math.sin(ang + cOff) * len * 0.50,
            -1 + Math.cos(ang) * len,               Math.sin(ang) * len
        );
        ctx.stroke();
    });

    // Angular skull polygon
    ctx.fillStyle = '#141210';
    ctx.beginPath();
    ctx.moveTo(-8,  4); ctx.lineTo(-10, -3); ctx.lineTo(-4, -9);
    ctx.lineTo( 6, -8); ctx.lineTo( 13,  -1); ctx.lineTo(9,  5);
    ctx.closePath(); ctx.fill();

    // Elongated snout
    ctx.beginPath();
    ctx.moveTo( 7, -6); ctx.lineTo(23, -2);
    ctx.lineTo(22,  1); ctx.lineTo( 7,  2);
    ctx.closePath(); ctx.fill();

    // Eye socket
    ctx.fillStyle = '#e8e4dc';
    ctx.beginPath();
    ctx.ellipse(4, -2.5, 3.6, 2.6, -0.18, 0, Math.PI * 2);
    ctx.fill();

    // Slit pupil
    ctx.fillStyle = '#141210';
    ctx.beginPath();
    ctx.ellipse(4.5, -2.5, 1.1, 2.3, -0.12, 0, Math.PI * 2);
    ctx.fill();

    // Lower fangs (uneven)
    [[9.5, 4, 3.2], [13, 4, 2.6], [16.5, 3.6, 2.0]].forEach(([x, y, h]) => {
        ctx.fillStyle = '#141210';
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + 1.2, y + h); ctx.lineTo(x + 2.8, y);
        ctx.closePath(); ctx.fill();
    });

    // Upper fang
    ctx.beginPath();
    ctx.moveTo(13.5, -5); ctx.lineTo(16, -10); ctx.lineTo(17.5, -5);
    ctx.closePath(); ctx.fill();

    ctx.restore();
}

// ── MAIN LOOP ──────────────────────────────────────────────────────────────
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tick += 0.035;

    segs[0].x += (pointer.x - segs[0].x) * 0.1;
    segs[0].y += (pointer.y - segs[0].y) * 0.1;

    for (let i = 1; i < NUM; i++) {
        const p = segs[i - 1], c = segs[i];
        c.angle = Math.atan2(p.y - c.y, p.x - c.x);
        c.x = p.x - Math.cos(c.angle) * STEP;
        c.y = p.y - Math.sin(c.angle) * STEP;
    }

    drawSpine();
    for (let i = NUM - 1; i >= 1; i--) drawSeg(segs[i], i);
    drawHead(segs[0]);

    requestAnimationFrame(loop);
}

loop();
