import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. SMOOTH SCROLL (LENIS)
// ==========================================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Header Scrolled State
const header = document.getElementById('shoesHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

// ==========================================================================
// 2. KINETIC NEON CURSOR & TRAVELLED PARTICLE TRAIL
// ==========================================================================
const cursorDot = document.getElementById('shoe-cursor-dot');
const cursorRing = document.getElementById('shoe-cursor-ring');
const cursorText = cursorRing?.querySelector('.cursor-text');
const spotlight = document.getElementById('cursorSpotlight');
const canvas = document.getElementById('shoe-cursor-canvas');
const ctx = canvas?.getContext('2d');

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let ringPos = { x: mouse.x, y: mouse.y };
let prevMouse = { x: mouse.x, y: mouse.y };
let particles = [];
let currentAccentColor = '#00f2fe';

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (cursorDot) {
    cursorDot.style.left = `${mouse.x}px`;
    cursorDot.style.top = `${mouse.y}px`;
  }

  if (spotlight) {
    spotlight.style.setProperty('--mouse-x', `${mouse.x}px`);
    spotlight.style.setProperty('--mouse-y', `${mouse.y}px`);
  }

  // Calculate cursor speed & distance traveled
  const dx = mouse.x - prevMouse.x;
  const dy = mouse.y - prevMouse.y;
  const speed = Math.sqrt(dx * dx + dy * dy);

  if (speed > 3) {
    const count = Math.min(Math.floor(speed / 5) + 1, 4);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 6,
        y: mouse.y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 1.5 - dx * 0.05,
        vy: (Math.random() - 0.5) * 1.5 - dy * 0.05,
        size: Math.random() * 2.5 + 1,
        alpha: 0.9,
        decay: Math.random() * 0.03 + 0.02,
        color: currentAccentColor
      });
    }
  }

  prevMouse.x = mouse.x;
  prevMouse.y = mouse.y;
});

// Click ripple burst
window.addEventListener('mousedown', () => {
  cursorRing?.classList.add('click-pulse');
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const force = Math.random() * 4 + 2;
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: Math.cos(angle) * force,
      vy: Math.sin(angle) * force,
      size: Math.random() * 3 + 1,
      alpha: 1,
      decay: 0.035,
      color: '#ffffff'
    });
  }
});

window.addEventListener('mouseup', () => {
  cursorRing?.classList.remove('click-pulse');
});

function renderParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ringPos.x += (mouse.x - ringPos.x) * 0.18;
  ringPos.y += (mouse.y - ringPos.y) * 0.18;

  if (cursorRing) {
    cursorRing.style.left = `${ringPos.x}px`;
    cursorRing.style.top = `${ringPos.y}px`;
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;
    p.size = Math.max(0, p.size - 0.02);

    if (p.alpha <= 0 || p.size <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(renderParticles);
}
requestAnimationFrame(renderParticles);

// Interactive Cursor Text Setup
function setupCursorText() {
  const hoverElements = document.querySelectorAll('[data-cursor], a, button, .vault-card, .eng-card, .cfg-btn');
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const customText = el.getAttribute('data-cursor') || '';
      if (el.classList.contains('vip-whatsapp-card') || el.classList.contains('dock-wa') || el.id === 'orderWhatsAppBtn') {
        cursorRing?.classList.add('whatsapp-mode');
      } else if (el.classList.contains('vip-call-card') || el.classList.contains('dock-phone')) {
        cursorRing?.classList.add('call-mode');
      } else {
        cursorRing?.classList.add('active-hover');
      }
      if (cursorText && customText) cursorText.textContent = customText;
    });

    el.addEventListener('mouseleave', () => {
      cursorRing?.classList.remove('active-hover', 'whatsapp-mode', 'call-mode');
      if (cursorText) cursorText.textContent = '';
    });
  });
}
setupCursorText();

// ==========================================================================
// 3. COLORWAY SWITCHER & TELEMETRY SYNC
// ==========================================================================
const swatchButtons = document.querySelectorAll('.swatch-btn');
const mainShoeImg = document.getElementById('mainShoeImage');
const hudWeight = document.getElementById('hudWeight');
const hudEnergy = document.getElementById('hudEnergy');
const currentColorwayLabel = document.getElementById('currentColorwayLabel');
const sneakerVisual = document.getElementById('sneakerVisual');

const colorwayData = {
  obsidian: {
    img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
    title: 'Cyber Obsidian',
    accent: '#00f2fe',
    glow: 'rgba(0, 242, 254, 0.4)',
    weight: '182g',
    energy: '94.8%'
  },
  solar: {
    img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=85',
    title: 'Solar Flare Gold',
    accent: '#ffaa00',
    glow: 'rgba(255, 170, 0, 0.4)',
    weight: '185g',
    energy: '95.2%'
  },
  volt: {
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=85',
    title: 'Hyper Neon Volt',
    accent: '#39ff14',
    glow: 'rgba(57, 255, 20, 0.4)',
    weight: '178g',
    energy: '96.1%'
  },
  phantom: {
    img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85',
    title: 'Phantom White',
    accent: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.4)',
    weight: '180g',
    energy: '94.5%'
  }
};

swatchButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    swatchButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const key = btn.getAttribute('data-color');
    const data = colorwayData[key];
    if (!data) return;

    currentAccentColor = data.accent;

    // Animate shoe switch
    gsap.timeline()
      .to(mainShoeImg, { scale: 0.9, opacity: 0.3, duration: 0.2, ease: 'power2.in' })
      .add(() => {
        if (mainShoeImg) mainShoeImg.src = data.img;
        if (hudWeight) hudWeight.textContent = data.weight;
        if (hudEnergy) hudEnergy.textContent = data.energy;
        if (currentColorwayLabel) currentColorwayLabel.textContent = `CURRENT SPEC: ${data.title.toUpperCase()} // AERODYNAMIC RACE FIT`;
        if (sneakerVisual) {
          sneakerVisual.style.filter = `drop-shadow(0 25px 45px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 35px ${data.glow})`;
        }
      })
      .to(mainShoeImg, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' });

    // Sync with customizer selection
    const matchingCfgBtn = document.querySelector(`.cfg-btn[data-val="${data.title}"]`);
    if (matchingCfgBtn) matchingCfgBtn.click();
  });
});

// ==========================================================================
// 4. 3D GYROSCOPIC MOUSE PARALLAX ON SNEAKER STAGE
// ==========================================================================
const stage = document.getElementById('sneakerStage');
const shoeImg = document.querySelector('.hero-shoe-img');
const teleCards = document.querySelectorAll('.telemetry-card');

if (stage && shoeImg) {
  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(shoeImg, {
      rotationY: x * 25,
      rotationX: -y * 25,
      rotationZ: -12 + x * 8,
      x: x * 30,
      y: y * 30,
      duration: 0.5,
      ease: 'power2.out'
    });

    teleCards.forEach((card, idx) => {
      const factor = idx === 1 ? -1 : 1;
      gsap.to(card, {
        x: x * 40 * factor,
        y: y * 30 * factor,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  });

  stage.addEventListener('mouseleave', () => {
    gsap.to(shoeImg, { rotationY: 0, rotationX: 0, rotationZ: -12, x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
    teleCards.forEach((card) => gsap.to(card, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' }));
  });
}

// ==========================================================================
// 5. BESPOKE SNEAKER CUSTOMIZER LAB
// ==========================================================================
let currentSpec = {
  color: 'Cyber Obsidian',
  colorAdd: 0,
  plate: 'Dual-Wishbone 3K Carbon',
  plateAdd: 0,
  size: 'US 9.0',
  laser: 'NONE',
  basePrice: 340
};

const sumColor = document.getElementById('sumColor');
const sumPlate = document.getElementById('sumPlate');
const sumSize = document.getElementById('sumSize');
const sumLaser = document.getElementById('sumLaser');
const sumPrice = document.getElementById('sumPrice');
const customLaserInput = document.getElementById('customLaserText');
const orderWhatsAppBtn = document.getElementById('orderWhatsAppBtn');

function updateSummary() {
  if (sumColor) sumColor.textContent = currentSpec.color;
  if (sumPlate) sumPlate.textContent = currentSpec.plate;
  if (sumSize) sumSize.textContent = `${currentSpec.size} (Standard Race Fit)`;
  if (sumLaser) sumLaser.textContent = currentSpec.laser || 'NONE';

  const total = currentSpec.basePrice + currentSpec.colorAdd + currentSpec.plateAdd;
  if (sumPrice) sumPrice.textContent = `$${total} USD`;
}

// Config Button Handlers
document.querySelectorAll('.cfg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');
    const val = btn.getAttribute('data-val');
    const add = parseInt(btn.getAttribute('data-add') || '0', 10);

    const group = btn.closest('.config-group');
    group?.querySelectorAll('.cfg-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    if (type === 'color') {
      currentSpec.color = val;
      currentSpec.colorAdd = add;
    } else if (type === 'plate') {
      currentSpec.plate = val;
      currentSpec.plateAdd = add;
    }

    gsap.from(btn, { scale: 0.96, duration: 0.2, ease: 'power1.out' });
    updateSummary();
  });
});

// Size Buttons
document.querySelectorAll('.size-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentSpec.size = btn.textContent.trim();
    gsap.from(btn, { scale: 0.9, duration: 0.2, ease: 'power1.out' });
    updateSummary();
  });
});

// Laser input
customLaserInput?.addEventListener('input', (e) => {
  currentSpec.laser = e.target.value.trim().toUpperCase() || 'NONE';
  updateSummary();
});

// Order via WhatsApp Action
orderWhatsAppBtn?.addEventListener('click', () => {
  const total = currentSpec.basePrice + currentSpec.colorAdd + currentSpec.plateAdd;
  const msg = `*NEW CUSTOM BUILD INQUIRY — STRYDE // KINETIX 01*\n\n` +
    `• Model Colorway: ${currentSpec.color}\n` +
    `• Chassis: ${currentSpec.plate}\n` +
    `• Size: ${currentSpec.size}\n` +
    `• Laser Engraving: ${currentSpec.laser}\n` +
    `• Total Spec Price: $${total} USD\n\n` +
    `Please confirm lead time and dispatch arrangements.`;

  const waUrl = `https://wa.me/18005557463?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
});

// ==========================================================================
// 6. VIP DROP RESERVATION FORM
// ==========================================================================
const shoeForm = document.getElementById('shoeReserveForm');
const shoeSuccessMsg = document.getElementById('shoeSuccessMsg');

shoeForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('clientName')?.value || 'Guest';
  const phone = document.getElementById('clientPhone')?.value || '';
  const model = document.getElementById('desiredModel')?.value || '';
  const size = document.getElementById('clientSize')?.value || 'US 9.0';
  const dest = document.getElementById('deliveryCountry')?.value || '';

  const waMsg = `*VIP DROP RESERVATION — STRYDE LABS*\n\n` +
    `*Client Name:* ${name}\n` +
    `*Contact:* ${phone}\n` +
    `*Target Edition:* ${model}\n` +
    `*Shoe Size:* ${size}\n` +
    `*Delivery City/Country:* ${dest}\n\n` +
    `Requesting priority allocation and VIP stylist consultation.`;

  const waUrl = `https://wa.me/18005557463?text=${encodeURIComponent(waMsg)}`;

  shoeForm.classList.add('hidden');
  shoeSuccessMsg?.classList.remove('hidden');
  gsap.from(shoeSuccessMsg, { y: 20, opacity: 0, duration: 0.5 });

  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 1200);
});

// ==========================================================================
// 7. KINETIC SYNTH AMBIENCE (WEB AUDIO API)
// ==========================================================================
let audioCtx = null;
let isAudioPlaying = false;
let synthOsc = null;
let synthGain = null;

const audioToggleBtn = document.getElementById('shoeAudioToggle');

function toggleKineticSynth() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  if (!isAudioPlaying) {
    synthOsc = audioCtx.createOscillator();
    synthGain = audioCtx.createGain();

    synthOsc.type = 'sawtooth';
    synthOsc.frequency.setValueAtTime(65.41, audioCtx.currentTime); // C2

    synthGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    synthGain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 1.5);

    synthOsc.connect(synthGain);
    synthGain.connect(audioCtx.destination);
    synthOsc.start();

    isAudioPlaying = true;
    audioToggleBtn?.classList.add('active');
  } else {
    synthGain?.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    setTimeout(() => {
      synthOsc?.stop();
      isAudioPlaying = false;
      audioToggleBtn?.classList.remove('active');
    }, 800);
  }
}

audioToggleBtn?.addEventListener('click', toggleKineticSynth);

// Mobile Nav Toggle
const mobileNavToggle = document.getElementById('mobileNavToggle');
const shoeNav = document.getElementById('shoeNav');

mobileNavToggle?.addEventListener('click', () => {
  shoeNav?.classList.toggle('open');
});

shoeNav?.querySelectorAll('a').forEach((l) => {
  l.addEventListener('click', () => shoeNav?.classList.remove('open'));
});
