// Hour of Playtime - Interactive Backflipping P Loading Screen

class AudioController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playJump() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn(e);
    }
  }

  playWhoosh() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn(e);
    }
  }

  playLand() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn(e);
    }
  }
}

const audio = new AudioController();

// Canvas & Animation System
const canvas = document.getElementById('stageCanvas');
const ctx = canvas.getContext('2d');

const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const flipCounterEl = document.getElementById('flipCounter');
const soundBtn = document.getElementById('soundBtn');
const soundIcon = document.getElementById('soundIcon');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const installBtn = document.getElementById('installBtn');

let flipCount = 0;
let deferredPrompt = null;

// Sound toggle
soundBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  audio.init();
  audio.enabled = !audio.enabled;
  soundIcon.textContent = audio.enabled ? '🔊' : '🔇';
  soundBtn.style.opacity = audio.enabled ? '1' : '0.5';
});

// Fullscreen toggle
fullscreenBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

// PWA Install prompt handling
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.classList.add('hidden');
    }
    deferredPrompt = null;
  }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('SW registration error:', err);
    });
  });
}

// Loading status messages cycle
const loadingPhases = [
  'INITIALIZING PLAYTIME ARCHIVES',
  'CALIBRATING GRABPACK HYDRAULICS',
  'CHECKING VENTILATION SHAFTS',
  'ALERT: HUGGY WUGGY DETECTED',
  'CHARGING ELECTRICAL CIRCUITS',
  'PREPARING TOY ASSEMBLY LINE',
  'SYNCHRONIZING EXPERIMENTAL TOYS',
  'HOUR OF PLAYTIME READY'
];
let currentPhaseIdx = 0;
let progressValue = 15;

setInterval(() => {
  progressValue += Math.random() * 12 + 6;
  if (progressValue > 100) {
    progressValue = 100;
  }
  progressBar.style.width = `${progressValue}%`;

  if (progressValue >= 100) {
    setTimeout(() => {
      progressValue = 10;
      currentPhaseIdx = (currentPhaseIdx + 1) % loadingPhases.length;
      statusText.textContent = loadingPhases[currentPhaseIdx];
    }, 1200);
  } else {
    currentPhaseIdx = Math.min(
      Math.floor((progressValue / 100) * loadingPhases.length),
      loadingPhases.length - 1
    );
    statusText.textContent = loadingPhases[currentPhaseIdx];
  }
}, 1100);

// Physics & Animation of the P and Shadow
const STAGE_SIZE = 600;
canvas.width = STAGE_SIZE;
canvas.height = STAGE_SIZE;

// Geometry of the stylized P
// Centered coordinate system for the P
function drawPShape(context) {
  context.beginPath();
  // Outer P contour
  context.moveTo(-54, 150);
  context.bezierCurveTo(-58, 60, -64, -30, -74, -80);
  context.bezierCurveTo(-82, -125, -56, -185, 20, -185);
  context.bezierCurveTo(94, -185, 114, -125, 114, -65);
  context.bezierCurveTo(114, 4, 78, 38, -4, 38);
  context.lineTo(0, 102);
  context.bezierCurveTo(4, 126, 10, 150, 10, 150);
  context.bezierCurveTo(-10, 152, -36, 152, -54, 150);
  context.closePath();

  // Inner cutout (counter)
  context.moveTo(-22, -72);
  context.bezierCurveTo(-22, -28, -8, -8, 24, -8);
  context.bezierCurveTo(54, -8, 68, -28, 68, -72);
  context.bezierCurveTo(68, -116, 54, -144, 24, -144);
  context.bezierCurveTo(-8, -144, -22, -116, -22, -72);
  context.closePath();

  context.fillStyle = '#EA2F3D';
  context.fill('evenodd');
}

// Particle System for jump dust & sparkles
const particles = [];
function spawnDust(x, y, count = 12, color = '#ffffff') {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1.0,
      decay: Math.random() * 0.04 + 0.03,
      size: Math.random() * 5 + 3,
      color
    });
  }
}

// Backflip State Machine
const STATE_IDLE_SQUASH = 0;
const STATE_JUMP_UP = 1;
const STATE_BACKFLIP = 2;
const STATE_LAND_SQUASH = 3;

const pObject = {
  // Base Hole Anchor
  holeX: 300,
  holeY: 440,
  holeRadiusX: 175,
  holeRadiusY: 52,

  // Position offset relative to hole
  x: 300,
  y: 310, // resting top of P
  baseRestY: 310,
  
  // Velocity
  vy: 0,
  gravity: 0.95,
  jumpStrength: -22,

  // Rotation (Backflip is rotating clockwise backwards)
  rotation: 0,
  rotationSpeed: 0,

  // Squash & Stretch
  scaleX: 1,
  scaleY: 1,

  // State
  state: STATE_IDLE_SQUASH,
  stateTimer: 0,

  // Shadow properties
  shadowScale: 1,
  shadowAlpha: 0.85,
  shadowRotation: 0,

  // Super flip multiplier from user tap
  isSuperFlip: false
};

function triggerJump(isSuper = false) {
  audio.init();
  pObject.isSuperFlip = isSuper;
  pObject.state = STATE_IDLE_SQUASH;
  pObject.stateTimer = 0;
}

// User Interaction
function handleScreenTap() {
  audio.init();
  if (navigator.vibrate) {
    navigator.vibrate(35);
  }
  
  // If already in mid-air, trigger an extra mid-air boost backflip!
  if (pObject.state === STATE_JUMP_UP || pObject.state === STATE_BACKFLIP) {
    pObject.vy = -18;
    pObject.rotationSpeed += 0.18;
    audio.playWhoosh();
    spawnDust(pObject.x, pObject.y, 16, '#EA2F3D');
  } else {
    triggerJump(true);
  }
}

window.addEventListener('pointerdown', (e) => {
  // Ignore clicks on header controls
  if (e.target.closest('.app-header')) return;
  handleScreenTap();
});

// Main Update Loop
let lastTime = performance.now();

function update(dt) {
  // Normalize dt roughly around 16.6ms
  const step = Math.min(dt / 16.666, 2.5);

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.vy += 0.15 * step;
    p.life -= p.decay * step;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Animation State Machine
  switch (pObject.state) {
    case STATE_IDLE_SQUASH: {
      pObject.stateTimer += 0.08 * step;
      // Squash down anticipation
      const squashProgress = Math.sin(pObject.stateTimer * Math.PI);
      pObject.scaleX = 1 + squashProgress * 0.35;
      pObject.scaleY = 1 - squashProgress * 0.35;
      pObject.y = pObject.baseRestY + squashProgress * 25;
      pObject.rotation = 0;

      if (pObject.stateTimer >= 1.0) {
        // Launch into jump!
        pObject.state = STATE_JUMP_UP;
        pObject.vy = pObject.isSuperFlip ? -27 : -22;
        pObject.scaleX = 0.75;
        pObject.scaleY = 1.35;
        pObject.rotationSpeed = pObject.isSuperFlip ? 0.22 : 0.17;
        audio.playJump();
        spawnDust(pObject.holeX, pObject.holeY, 14, '#000000');
      }
      break;
    }

    case STATE_JUMP_UP:
    case STATE_BACKFLIP: {
      pObject.state = STATE_BACKFLIP;
      pObject.vy += pObject.gravity * step;
      pObject.y += pObject.vy * step;

      // Backflip rotation (counter-clockwise backflip)
      pObject.rotation -= pObject.rotationSpeed * step;

      // Recover stretch towards normal
      pObject.scaleX += (1 - pObject.scaleX) * 0.08 * step;
      pObject.scaleY += (1 - pObject.scaleY) * 0.08 * step;

      // Play whoosh near top of arc
      if (Math.abs(pObject.vy) < 2 && Math.random() < 0.2) {
        audio.playWhoosh();
      }

      // Check for landing
      if (pObject.y >= pObject.baseRestY && pObject.vy > 0) {
        pObject.y = pObject.baseRestY;
        pObject.vy = 0;
        pObject.rotation = 0; // align straight on landing
        pObject.state = STATE_LAND_SQUASH;
        pObject.stateTimer = 0;
        pObject.scaleX = 1.4;
        pObject.scaleY = 0.65;
        
        audio.playLand();
        if (navigator.vibrate) {
          navigator.vibrate(25);
        }
        spawnDust(pObject.holeX, pObject.holeY, 18, '#000000');

        flipCount++;
        flipCounterEl.textContent = `Flips: ${flipCount}`;
      }
      break;
    }

    case STATE_LAND_SQUASH: {
      pObject.stateTimer += 0.09 * step;
      // Spring elastic recover
      const damp = Math.exp(-pObject.stateTimer * 4);
      const osc = Math.sin(pObject.stateTimer * 10);
      pObject.scaleX = 1 + osc * damp * 0.4;
      pObject.scaleY = 1 - osc * damp * 0.4;
      pObject.y = pObject.baseRestY - (1 - pObject.scaleY) * 20;

      if (pObject.stateTimer >= 1.2) {
        // Prepare next flip after brief pause
        pObject.scaleX = 1;
        pObject.scaleY = 1;
        pObject.state = STATE_IDLE_SQUASH;
        pObject.stateTimer = 0;
        pObject.isSuperFlip = false;
      }
      break;
    }
  }

  // Shadow calculation:
  // As height increases, shadow shrinks slightly, rotates with backflip, and fades slightly
  const heightAboveHole = Math.max(0, pObject.baseRestY - pObject.y);
  const heightNorm = Math.min(heightAboveHole / 300, 1.0);

  pObject.shadowScale = Math.max(0.45, 1.0 - heightNorm * 0.55);
  pObject.shadowAlpha = Math.max(0.3, 0.85 - heightNorm * 0.5);
  pObject.shadowRotation = pObject.rotation * 0.8;
}

// Render Scene
function render() {
  ctx.clearRect(0, 0, STAGE_SIZE, STAGE_SIZE);

  // 1. Vibrant Yellow Background
  ctx.fillStyle = '#FDCD02';
  ctx.fillRect(0, 0, STAGE_SIZE, STAGE_SIZE);

  // Subtle interior glow / vignette
  const bgGrad = ctx.createRadialGradient(
    STAGE_SIZE / 2,
    STAGE_SIZE / 2,
    50,
    STAGE_SIZE / 2,
    STAGE_SIZE / 2,
    STAGE_SIZE * 0.7
  );
  bgGrad.addColorStop(0, 'rgba(255, 235, 70, 0.25)');
  bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, STAGE_SIZE, STAGE_SIZE);

  // 2. Black Hole / Pit (Bottom Layer)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    pObject.holeX,
    pObject.holeY,
    pObject.holeRadiusX,
    pObject.holeRadiusY,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = '#050505';
  ctx.fill();

  // Hole inner rim depth
  const holeGrad = ctx.createRadialGradient(
    pObject.holeX,
    pObject.holeY - 5,
    10,
    pObject.holeX,
    pObject.holeY,
    pObject.holeRadiusX
  );
  holeGrad.addColorStop(0, '#000000');
  holeGrad.addColorStop(1, '#1a1814');
  ctx.fillStyle = holeGrad;
  ctx.fill();
  ctx.restore();

  // 3. Dynamic Backflipping Shadow
  // Shadow appears on the floor / over the hole
  ctx.save();
  ctx.translate(pObject.holeX, pObject.holeY);
  ctx.rotate(pObject.shadowRotation);
  ctx.scale(pObject.shadowScale, pObject.shadowScale * 0.45);

  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${pObject.shadowAlpha})`;
  ctx.filter = 'blur(6px)';
  ctx.fill();
  ctx.filter = 'none';
  ctx.restore();

  // 4. Particles (Dust / Sparks)
  for (const p of particles) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
    ctx.restore();
  }

  // 5. The Red 'P' Character with Squash, Stretch & 360° Backflip
  ctx.save();
  ctx.translate(pObject.x, pObject.y);
  ctx.rotate(pObject.rotation);
  ctx.scale(pObject.scaleX, pObject.scaleY);

  // Motion blur / speed trails during fast flip
  if (Math.abs(pObject.rotationSpeed) > 0.1 && pObject.state === STATE_BACKFLIP) {
    ctx.save();
    ctx.rotate(pObject.rotationSpeed * 0.3);
    ctx.globalAlpha = 0.25;
    drawPShape(ctx);
    ctx.restore();
  }

  // Draw main crisp P
  drawPShape(ctx);

  // Subtle highlight gloss on the P loop
  ctx.beginPath();
  ctx.arc(24, -72, 60, -Math.PI * 0.6, -Math.PI * 0.1);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();

  // 6. Front lip of the black hole
  // When P is inside the resting position, its stem goes down behind the front edge of the hole!
  if (pObject.y >= pObject.baseRestY - 10) {
    ctx.save();
    ctx.beginPath();
    // Clip to the bottom half of the hole
    ctx.rect(0, pObject.holeY, STAGE_SIZE, STAGE_SIZE - pObject.holeY);
    ctx.clip();

    ctx.beginPath();
    ctx.ellipse(
      pObject.holeX,
      pObject.holeY,
      pObject.holeRadiusX,
      pObject.holeRadiusY,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#050505';
    ctx.fill();
    ctx.restore();
  }
}

// Animation Frame Runner
function gameLoop(time) {
  const dt = time - lastTime;
  lastTime = time;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame((time) => {
  lastTime = time;
  gameLoop(time);
});
