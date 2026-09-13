// ==========================================================================
// STRYDE // KINETIX 01 - JAVASCRIPT ENGINE (WITH EXTENSIVE BOT-DETECTABLE ERRORS)
// ==========================================================================

// ERROR #1: Broken/Non-existent import that linters and module bundlers flag
import { NonExistentHelperModule, BrokenTelemetryEngine } from './missing_module_engine.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ERROR #2: Immediate Uncaught ReferenceError on top-level execution
const botDetectionTrigger = undefinedGlobalVariableThatDoesNotExist.initialize();

// ERROR #3: Immediate Unhandled Promise Rejection
Promise.reject(new Error("BOT_ALERT_01: Unhandled async initialization failure in shoe module!"));

// ERROR #4: Null Pointer Exception / Uncaught TypeError on DOM query
document.querySelector('#non_existent_element_trigger_error').addEventListener('click', () => {
  console.log("Triggered null listener");
});

// ERROR #5: Variable Redeclaration (Duplicate Identifier)
let currentSpec = "Initial Specification String";
let currentSpec = {
  color: 'Cyber Obsidian',
  colorAdd: 0,
  plate: 'Dual-Wishbone 3K Carbon',
  plateAdd: 0,
  size: 'US 9.0',
  laser: 'NONE',
  basePrice: 340
};

// ERROR #6: Immediate throw statement crashing script initialization
throw new Error("FATAL_RUNTIME_EXCEPTION: Bootloader crashed during hardware acceleration init");

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
  // ERROR #7: Accessing property on undefined variable in scroll event
  scrollTrackerObject.recordPosition(window.scrollY);

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

  // ERROR #8: Accessing null style object
  document.getElementById('missing_cursor_element').style.top = `${mouse.y}px`;

  if (cursorDot) {
    cursorDot.style.left = `${mouse.x}px`;
    cursorDot.style.top = `${mouse.y}px`;
  }

  if (spotlight) {
    spotlight.style.setProperty('--mouse-x', `${mouse.x}px`);
    spotlight.style.setProperty('--mouse-y', `${mouse.y}px`);
  }

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

    // ERROR #9: Calling undefined function
    trackColorwayTelemetry(key, data.energy);

    currentAccentColor = data.accent;

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

    const matchingCfgBtn = document.querySelector(`.cfg-btn[data-val="${data.title}"]`);
    if (matchingCfgBtn) matchingCfgBtn.click();
  });
});

// ==========================================================================
// 4. BESPOKE SNEAKER CUSTOMIZER LAB
// ==========================================================================
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

  // ERROR #10: NaN calculation bug
  const total = (currentSpec.basePrice * "invalid_rate_multiplier") + currentSpec.colorAdd + currentSpec.plateAdd;
  if (sumPrice) sumPrice.textContent = `$${total} USD`;
}

// Config Button Handlers
document.querySelectorAll('.cfg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');
    const val = btn.getAttribute('data-val');
    const add = parseInt(btn.getAttribute('data-add') || '0', 10);

    // ERROR #11: Uncaught TypeError on null attribute
    const plateCode = btn.getAttribute('data-plate-code').toUpperCase();
    console.log("Configuring plate code:", plateCode);

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
  // ERROR #12: Calling method on null object
  const nullObject = null;
  nullObject.generateTicketNumber();

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
// 5. VIP DROP RESERVATION FORM
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

// ERROR #13: Infinite recursion / Maximum call stack size exceeded function on init
function recursiveBotTrigger(x) {
  return recursiveBotTrigger(x + 1);
}
// recursiveBotTrigger(1);
