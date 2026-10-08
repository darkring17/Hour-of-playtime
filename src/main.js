// Hour of Playtime - Clean Black Screen with Bottom-Right Backflipping P

class AudioController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
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
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
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
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.22);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
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
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn(e);
    }
  }
}

const audio = new AudioController();

// DOM Elements
const installGate = document.getElementById('installGate');
const mainScreen = document.getElementById('mainScreen');
const gateInstallBtn = document.getElementById('gateInstallBtn');
const bypassBtn = document.getElementById('bypassBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');
const iosInstructions = document.getElementById('iosInstructions');

let deferredPrompt = null;

// Check if running in installed standalone mode
function isAppInstalled() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = window.navigator.standalone === true;
  return isStandalone || isIOSStandalone;
}

function unlockApp() {
  installGate.classList.add('hidden');
  mainScreen.classList.remove('hidden');
  audio.init();
}

// Check on load
if (isAppInstalled()) {
  unlockApp();
}

// iOS vs Android UI adjustments
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
  gateInstallBtn.style.display = 'none';
  iosInstructions.style.display = 'block';
} else {
  iosInstructions.style.display = 'none';
}

// Install Event handling
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  gateInstallBtn.style.display = 'flex';
});

gateInstallBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      unlockApp();
    }
    deferredPrompt = null;
  } else {
    unlockApp();
  }
});

bypassBtn.addEventListener('click', () => {
  unlockApp();
});

// Sound Toggle
soundToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  audio.init();
  audio.enabled = !audio.enabled;
  soundIcon.textContent = audio.enabled ? '🔊' : '🔇';
  soundToggleBtn.style.opacity = audio.enabled ? '1' : '0.5';
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('SW registration:', err);
    });
  });
}

// -------------------------------------------------------------
// Canvas Animation: Bottom-Right Backflipping P
// -------------------------------------------------------------
const canvas = document.getElementById('pCanvas');
const ctx = canvas.getContext('2d');
const STAGE_SIZE = 240;
canvas.width = STAGE_SIZE;
canvas.height = STAGE_SIZE;

// Geometry of the stylized Poppy Playtime P
function drawPShape(context) {
  context.beginPath();
  // Outer P
  context.moveTo(-22, 60);
  context.bezierCurveTo(-24, 24, -26, -12, -30, -32);
  context.bezierCurveTo(-33, -50, -22, -74, 8, -74);
  context.bezierCurveTo(38, -74, 46, -50, 46, -26);
  context.bezierCurveTo(46, 2, 31, 15, -2, 15);
  context.lineTo(0, 41);
  context.bezierCurveTo(2, 50, 4, 60, 4, 60);
  context.bezierCurveTo(-4, 61, -14, 61, -22, 60);
  context.closePath();

  // Inner cutout
  context.moveTo(-9, -29);
  context.bezierCurveTo(-9, -11, -3, -3, 10, -3);
  context.bezierCurveTo(22, -3, 27, -11, 27, -29);
  context.bezierCurveTo(27, -46, 22, -58, 10, -58);
  context.bezierCurveTo(-3, -58, -9, -46, -9, -29);
  context.closePath();

  context.fillStyle = '#EA2F3D';
  context.fill('evenodd');
}

// Particle System
const particles = [];
function spawnDust(x, y, count = 8, color = '#000000') {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 1.0,
      decay: Math.random() * 0.05 + 0.04,
      size: Math.random() * 3 + 2,
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
  holeX: 120,
  holeY: 175,
  holeRadiusX: 70,
  holeRadiusY: 21,

  x: 120,
  y: 124,
  baseRestY: 124,

  vy: 0,
  gravity: 0.65,
  jumpStrength: -15,

  rotation: 0,
  rotationSpeed: 0,

  scaleX: 1,
  scaleY: 1,

  state: STATE_IDLE_SQUASH,
  stateTimer: 0,

  shadowScale: 1,
  shadowAlpha: 0.85,
  shadowRotation: 0,

  isSuperFlip: false
};

function triggerFlip(isSuper = false) {
  audio.init();
  pObject.isSuperFlip = isSuper;
  pObject.state = STATE_IDLE_SQUASH;
  pObject.stateTimer = 0;
}

// Tap anywhere on screen to trigger a super flip
window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('#installGate') || e.target.closest('.sound-toggle')) return;
  audio.init();
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }

  if (pObject.state === STATE_JUMP_UP || pObject.state === STATE_BACKFLIP) {
    pObject.vy = -12;
    pObject.rotationSpeed += 0.16;
    audio.playWhoosh();
    spawnDust(pObject.x, pObject.y, 8, '#EA2F3D');
  } else {
    triggerFlip(true);
  }
});

let lastTime = performance.now();

function update(dt) {
  const step = Math.min(dt / 16.666, 2.5);

  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.vy += 0.1 * step;
    p.life -= p.decay * step;
    if (p.life <= 0) particles.splice(i, 1);
  }

  // Animation State
  switch (pObject.state) {
    case STATE_IDLE_SQUASH: {
      pObject.stateTimer += 0.08 * step;
      const squash = Math.sin(pObject.stateTimer * Math.PI);
      pObject.scaleX = 1 + squash * 0.3;
      pObject.scaleY = 1 - squash * 0.3;
      pObject.y = pObject.baseRestY + squash * 10;
      pObject.rotation = 0;

      if (pObject.stateTimer >= 1.0) {
        pObject.state = STATE_JUMP_UP;
        pObject.vy = pObject.isSuperFlip ? -17 : -14;
        pObject.scaleX = 0.8;
        pObject.scaleY = 1.25;
        pObject.rotationSpeed = pObject.isSuperFlip ? 0.22 : 0.17;
        audio.playJump();
        spawnDust(pObject.holeX, pObject.holeY, 6, '#000000');
      }
      break;
    }

    case STATE_JUMP_UP:
    case STATE_BACKFLIP: {
      pObject.state = STATE_BACKFLIP;
      pObject.vy += pObject.gravity * step;
      pObject.y += pObject.vy * step;

      // Backflip rotation
      pObject.rotation -= pObject.rotationSpeed * step;

      pObject.scaleX += (1 - pObject.scaleX) * 0.08 * step;
      pObject.scaleY += (1 - pObject.scaleY) * 0.08 * step;

      if (Math.abs(pObject.vy) < 1.5 && Math.random() < 0.25) {
        audio.playWhoosh();
      }

      // Landing check
      if (pObject.y >= pObject.baseRestY && pObject.vy > 0) {
        pObject.y = pObject.baseRestY;
        pObject.vy = 0;
        pObject.rotation = 0;
        pObject.state = STATE_LAND_SQUASH;
        pObject.stateTimer = 0;
        pObject.scaleX = 1.35;
        pObject.scaleY = 0.7;
        audio.playLand();
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }
        spawnDust(pObject.holeX, pObject.holeY, 8, '#000000');
      }
      break;
    }

    case STATE_LAND_SQUASH: {
      pObject.stateTimer += 0.09 * step;
      const damp = Math.exp(-pObject.stateTimer * 4);
      const osc = Math.sin(pObject.stateTimer * 10);
      pObject.scaleX = 1 + osc * damp * 0.35;
      pObject.scaleY = 1 - osc * damp * 0.35;
      pObject.y = pObject.baseRestY - (1 - pObject.scaleY) * 10;

      if (pObject.stateTimer >= 1.2) {
        pObject.scaleX = 1;
        pObject.scaleY = 1;
        pObject.state = STATE_IDLE_SQUASH;
        pObject.stateTimer = 0;
        pObject.isSuperFlip = false;
      }
      break;
    }
  }

  // Shadow
  const heightAboveHole = Math.max(0, pObject.baseRestY - pObject.y);
  const heightNorm = Math.min(heightAboveHole / 120, 1.0);

  pObject.shadowScale = Math.max(0.45, 1.0 - heightNorm * 0.55);
  pObject.shadowAlpha = Math.max(0.3, 0.85 - heightNorm * 0.5);
  pObject.shadowRotation = pObject.rotation * 0.8;
}

function render() {
  ctx.clearRect(0, 0, STAGE_SIZE, STAGE_SIZE);

  // 1. Yellow Background
  ctx.fillStyle = '#FDCD02';
  ctx.fillRect(0, 0, STAGE_SIZE, STAGE_SIZE);

  // 2. Black Hole
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
  ctx.restore();

  // 3. Dynamic Backflipping Shadow
  ctx.save();
  ctx.translate(pObject.holeX, pObject.holeY);
  ctx.rotate(pObject.shadowRotation);
  ctx.scale(pObject.shadowScale, pObject.shadowScale * 0.45);

  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${pObject.shadowAlpha})`;
  ctx.filter = 'blur(3px)';
  ctx.fill();
  ctx.filter = 'none';
  ctx.restore();

  // 4. Particles
  for (const p of particles) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
    ctx.restore();
  }

  // 5. Red 'P' Character with Backflip
  ctx.save();
  ctx.translate(pObject.x, pObject.y);
  ctx.rotate(pObject.rotation);
  ctx.scale(pObject.scaleX, pObject.scaleY);

  if (Math.abs(pObject.rotationSpeed) > 0.1 && pObject.state === STATE_BACKFLIP) {
    ctx.save();
    ctx.rotate(pObject.rotationSpeed * 0.25);
    ctx.globalAlpha = 0.25;
    drawPShape(ctx);
    ctx.restore();
  }

  drawPShape(ctx);

  // Gloss highlight
  ctx.beginPath();
  ctx.arc(10, -29, 24, -Math.PI * 0.6, -Math.PI * 0.1);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();

  // 6. Front lip of the black hole
  if (pObject.y >= pObject.baseRestY - 4) {
    ctx.save();
    ctx.beginPath();
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
