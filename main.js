/* ============================================
   RAISYA ADHA — Romance Page
   main.js
   ============================================ */

/* ── CUSTOM CURSOR ── */
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = -200, mouseY = -200;
let ringX  = -200, ringY  = -200;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  // Dot follows instantly
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  // Ring follows with smooth lag
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
})();

// Scale cursor on hoverable elements
document.querySelectorAll('button, a, .trait-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform     = 'translate(-50%, -50%) scale(1.8)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursorRing.style.opacity   = '0.9';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.opacity   = '0.5';
  });
});

/* ── CANVAS BACKGROUND ── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Stars
const stars = Array.from({ length: 200 }, () => ({
  x:     Math.random() * window.innerWidth,
  y:     Math.random() * window.innerHeight,
  r:     Math.random() * 1.3 + 0.3,
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.005 + 0.002,
  drift: (Math.random() - 0.5) * 0.12,
}));

// Floating canvas hearts
const canvasHearts = Array.from({ length: 14 }, () => ({
  x:          Math.random() * window.innerWidth,
  y:          Math.random() * window.innerHeight * 2 + window.innerHeight,
  size:       Math.random() * 13 + 5,
  speedY:     Math.random() * 0.45 + 0.18,
  opacity:    Math.random() * 0.25 + 0.04,
  wobble:     Math.random() * Math.PI * 2,
  wobbleAmp:  Math.random() * 0.45 + 0.1,
  wobbleSpeed:Math.random() * 0.018 + 0.008,
}));

function drawHeart(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x,           y - size * 0.30, x - size * 0.50, y - size * 0.60, x - size * 0.50, y - size * 0.90);
  ctx.bezierCurveTo(x - size * 0.50, y - size * 1.30, x, y - size * 1.30, x, y - size * 0.90);
  ctx.bezierCurveTo(x,           y - size * 1.30, x + size * 0.50, y - size * 1.30, x + size * 0.50, y - size * 0.90);
  ctx.bezierCurveTo(x + size * 0.50, y - size * 0.60, x, y - size * 0.30, x, y);
  ctx.closePath();
}

function renderBg() {
  ctx.clearRect(0, 0, W, H);

  // Subtle radial glow in center
  const grd = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.5, W * 0.75);
  grd.addColorStop(0,   'rgba(80, 12, 32, 0.28)');
  grd.addColorStop(0.45,'rgba(30,  4, 16, 0.14)');
  grd.addColorStop(1,   'rgba(0,   0,  0, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Stars
  stars.forEach(s => {
    s.phase += s.speed;
    s.x += s.drift;
    if (s.x > W + 2) s.x = -2;
    if (s.x < -2)    s.x = W + 2;

    const alpha = ((Math.sin(s.phase) + 1) / 2) * 0.65 + 0.12;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,194,204,${alpha.toFixed(3)})`;
    ctx.fill();
  });

  // Floating hearts
  canvasHearts.forEach(h => {
    h.y -= h.speedY;
    h.wobble += h.wobbleSpeed;
    h.x += Math.sin(h.wobble) * h.wobbleAmp;

    if (h.y < -40) {
      h.y = H + 40;
      h.x = Math.random() * W;
    }

    ctx.save();
    ctx.globalAlpha = h.opacity;
    ctx.fillStyle = 'rgba(232,96,122,1)';
    drawHeart(h.x, h.y, h.size);
    ctx.fill();
    ctx.restore();
  });

  requestAnimationFrame(renderBg);
}
renderBg();

/* ── FLOATING PETALS (DOM) ── */
const petalContainer = document.getElementById('petals');
const petalSet = ['🌸', '🌺', '🌹', '❀', '✿'];

for (let i = 0; i < 20; i++) {
  const p = document.createElement('span');
  p.classList.add('petal');
  p.textContent = petalSet[Math.floor(Math.random() * petalSet.length)];
  p.style.left     = (Math.random() * 100) + 'vw';
  p.style.fontSize = (Math.random() * 13 + 9) + 'px';
  p.style.opacity  = (Math.random() * 0.45 + 0.15).toFixed(2);

  const duration = (Math.random() * 14 + 10).toFixed(1) + 's';
  const delay    = (Math.random() * 18).toFixed(1) + 's';
  p.style.animationDuration       = duration;
  p.style.animationDelay          = delay;
  p.style.animationTimingFunction = 'linear';
  p.style.animationIterationCount = 'infinite';
  p.style.animationName           = 'petalFall';

  petalContainer.appendChild(p);
}

/* ── AUDIO ── */
const audio      = document.getElementById('bg-music');
const playBtn    = document.getElementById('play-btn');
const musicBars  = document.getElementById('music-bars');
let isPlaying    = false;

// Called when user clicks the popup button
function startExperience() {
  const popup = document.getElementById('audio-popup');

  // Fade out popup
  popup.style.transition = 'opacity 0.5s ease';
  popup.style.opacity    = '0';
  setTimeout(() => { popup.style.display = 'none'; }, 500);

  // Attempt autoplay
  audio.volume = 0.42;
  audio.play()
    .then(() => setPlayState(true))
    .catch(() => {
      // Autoplay blocked — user can still press play manually
      setPlayState(false);
    });
}

function setPlayState(playing) {
  isPlaying = playing;
  playBtn.textContent = playing ? '⏸' : '▶';
  if (playing) {
    musicBars.classList.add('playing');
  } else {
    musicBars.classList.remove('playing');
  }
}

function toggleMusic() {
  if (isPlaying) {
    audio.pause();
    setPlayState(false);
  } else {
    audio.play()
      .then(() => setPlayState(true))
      .catch(() => {});
  }
}

// Sync UI if audio ends or is paused externally
audio.addEventListener('pause', () => setPlayState(false));
audio.addEventListener('play',  () => setPlayState(true));

/* ── SCROLL REVEAL ── */
// Apply .reveal to all scrollable content blocks EXCEPT hero children
// Hero children already use CSS keyframe animations on their own.
const revealTargets = document.querySelectorAll(
  'section, .trait-card, .love-letter, footer'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve trait cards so stagger still works on re-scroll
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => revealObserver.observe(el));

/* ── CLICK SPARKLE ── */
document.addEventListener('click', e => {
  // Don't spawn sparkles on popup button while popup is visible
  const popup = document.getElementById('audio-popup');
  if (popup && popup.style.display !== 'none' && popup.style.opacity !== '0') return;

  const colors = ['#e8607a', '#f5c2cc', '#d4607a', '#ffd6e0'];

  for (let i = 0; i < 7; i++) {
    const dot = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = (Math.random() * 5 + 3) + 'px';

    dot.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: ${size};
      height: ${size};
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9990;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(dot);

    const angle = (i / 7) * Math.PI * 2 + Math.random() * 0.4;
    const dist  = 28 + Math.random() * 36;
    const dx    = Math.cos(angle) * dist;
    const dy    = Math.sin(angle) * dist;

    dot.animate([
      { transform: 'translate(-50%,-50%) translate(0, 0)',                       opacity: 1  },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,      opacity: 0  }
    ], {
      duration: 480 + Math.random() * 220,
      easing: 'cubic-bezier(0,0,0.2,1)'
    }).onfinish = () => dot.remove();
  }
});
