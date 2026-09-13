import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. LENIS SMOOTH SCROLL INITIALIZATION
// ==========================================================================
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Header state on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

// ==========================================================================
// 2. CURSOR TRAVELED SYSTEM & GOLD EMBER CANVAS TRAIL
// ==========================================================================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const cursorText = cursorRing?.querySelector('.cursor-text');
const spotlight = document.getElementById('cursor-spotlight');
const trailCanvas = document.getElementById('cursor-trail-canvas');
const ctx = trailCanvas?.getContext('2d');

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let prevMouse = { x: mouse.x, y: mouse.y };
let particles = [];

// Resize Trail Canvas
function resizeCanvas() {
  if (!trailCanvas) return;
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse movement listener
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  // Move direct dot instantly
  if (cursorDot) {
    cursorDot.style.left = `${mouse.x}px`;
    cursorDot.style.top = `${mouse.y}px`;
  }

  // Update background spotlight
  if (spotlight) {
    spotlight.style.setProperty('--mouse-x', `${mouse.x}px`);
    spotlight.style.setProperty('--mouse-y', `${mouse.y}px`);
  }

  // Calculate cursor speed / distance traveled
  const dx = mouse.x - prevMouse.x;
  const dy = mouse.y - prevMouse.y;
  const speed = Math.sqrt(dx * dx + dy * dy);

  // Spawn trail embers if cursor traveled
  if (speed > 2) {
    const count = Math.min(Math.floor(speed / 4) + 1, 5);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 8,
        y: mouse.y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.5 - dx * 0.08,
        vy: (Math.random() - 0.5) * 1.5 - dy * 0.08,
        size: Math.random() * 2.8 + 1,
        alpha: 0.9,
        decay: Math.random() * 0.025 + 0.015,
        color: Math.random() > 0.3 ? '#d4af37' : '#f3e5ab'
      });
    }
  }

  prevMouse.x = mouse.x;
  prevMouse.y = mouse.y;
});

// Click spark burst
window.addEventListener('mousedown', () => {
  cursorRing?.classList.add('click-pulse');
  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * Math.PI * 2;
    const force = Math.random() * 4 + 2;
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: Math.cos(angle) * force,
      vy: Math.sin(angle) * force,
      size: Math.random() * 3.5 + 1.5,
      alpha: 1,
      decay: 0.03,
      color: '#ffdd77'
    });
  }
});

window.addEventListener('mouseup', () => {
  cursorRing?.classList.remove('click-pulse');
});

// Render Particle Trail Loop
function renderTrail() {
  if (!ctx || !trailCanvas) return;
  ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  // Smooth lerp for ring follower
  ringPos.x += (mouse.x - ringPos.x) * 0.18;
  ringPos.y += (mouse.y - ringPos.y) * 0.18;

  if (cursorRing) {
    cursorRing.style.left = `${ringPos.x}px`;
    cursorRing.style.top = `${ringPos.y}px`;
  }

  // Draw and update particles
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

  requestAnimationFrame(renderTrail);
}
requestAnimationFrame(renderTrail);

// Interactive Cursor Text & Hover States
function setupCursorInteractions() {
  const hoverElements = document.querySelectorAll('[data-cursor], a, button, .chapter-card, .dish-item, .option-btn');

  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const customText = el.getAttribute('data-cursor') || '';
      
      if (el.classList.contains('whatsapp-btn') || el.classList.contains('dock-whatsapp')) {
        cursorRing?.classList.add('whatsapp-mode');
      } else if (el.classList.contains('call-btn') || el.classList.contains('dock-call')) {
        cursorRing?.classList.add('call-mode');
      } else {
        cursorRing?.classList.add('active-hover');
      }

      if (cursorText && customText) {
        cursorText.textContent = customText;
      }
    });

    el.addEventListener('mouseleave', () => {
      cursorRing?.classList.remove('active-hover', 'whatsapp-mode', 'call-mode');
      if (cursorText) {
        cursorText.textContent = '';
      }
    });
  });
}
setupCursorInteractions();

// ==========================================================================
// 3. HERO PARTICLES & RISING FLAME EMBERS CANVAS SIMULATION
// ==========================================================================
const heroCanvas = document.getElementById('hero-particles-canvas');
const heroCtx = heroCanvas?.getContext('2d');

let heroParticles = [];
const HERO_PARTICLE_COUNT = 70;

function resizeHeroCanvas() {
  if (!heroCanvas) return;
  const heroSection = document.getElementById('prologue');
  if (heroSection) {
    heroCanvas.width = heroSection.offsetWidth;
    heroCanvas.height = heroSection.offsetHeight;
  }
}
resizeHeroCanvas();
window.addEventListener('resize', resizeHeroCanvas);

// Initialize rising embers
function initHeroParticles() {
  if (!heroCanvas) return;
  heroParticles = [];
  for (let i = 0; i < HERO_PARTICLE_COUNT; i++) {
    heroParticles.push({
      x: Math.random() * heroCanvas.width,
      y: Math.random() * heroCanvas.height,
      radius: Math.random() * 2.8 + 0.8,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.2 + 0.4), // Upward rise
      alpha: Math.random() * 0.7 + 0.2,
      baseAlpha: Math.random() * 0.7 + 0.2,
      flickerSpeed: Math.random() * 0.04 + 0.01,
      angle: Math.random() * Math.PI * 2,
      waveSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.4 ? '#d4af37' : (Math.random() > 0.5 ? '#ff7849' : '#f3e5ab')
    });
  }
}
initHeroParticles();

function renderHeroParticles() {
  if (!heroCtx || !heroCanvas) return;
  heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

  const heroRect = heroCanvas.getBoundingClientRect();
  const heroMouseX = mouse.x - heroRect.left;
  const heroMouseY = mouse.y - heroRect.top;

  for (let i = 0; i < heroParticles.length; i++) {
    const p = heroParticles[i];

    // Sine wave horizontal drift
    p.angle += p.waveSpeed;
    p.x += Math.sin(p.angle) * 0.6 + p.vx;
    p.y += p.vy;

    // Interactive cursor repulsion / wind force
    const dx = p.x - heroMouseX;
    const dy = p.y - heroMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 130 && dist > 0) {
      const force = (130 - dist) / 130;
      p.x += (dx / dist) * force * 3;
      p.y += (dy / dist) * force * 3;
    }

    // Flicker effect
    p.alpha = p.baseAlpha + Math.sin(p.angle * 2) * 0.25;

    // Reset when floating off top or sides
    if (p.y < -10) {
      p.y = heroCanvas.height + 10;
      p.x = Math.random() * heroCanvas.width;
    }
    if (p.x < -10) p.x = heroCanvas.width + 10;
    if (p.x > heroCanvas.width + 10) p.x = -10;

    // Draw ember particle
    heroCtx.save();
    heroCtx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
    heroCtx.fillStyle = p.color;
    heroCtx.shadowBlur = 12;
    heroCtx.shadowColor = p.color;
    heroCtx.beginPath();
    heroCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    heroCtx.fill();
    heroCtx.restore();
  }

  requestAnimationFrame(renderHeroParticles);
}
requestAnimationFrame(renderHeroParticles);

// ==========================================================================
// 4. HERO 3D MOUSE PARALLAX & GYROSCOPIC DEPTH
// ==========================================================================
const heroSection = document.getElementById('prologue');
const heroContent = document.querySelector('.hero-content');
const heroImg = document.querySelector('.hero-img');
const heroCards = document.querySelectorAll('.floating-story-card');

if (heroSection && heroContent) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;

    // 3D tilt of hero content
    gsap.to(heroContent, {
      rotationY: xRel * 12,
      rotationX: -yRel * 12,
      x: xRel * 25,
      y: yRel * 25,
      duration: 0.8,
      ease: 'power2.out',
      transformPerspective: 1000
    });

    // Parallax on background image
    if (heroImg) {
      gsap.to(heroImg, {
        x: -xRel * 40,
        y: -yRel * 40,
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    // Opposing tilt on floating badges
    heroCards.forEach((card, idx) => {
      const factor = idx === 0 ? 1 : -1;
      gsap.to(card, {
        x: xRel * 45 * factor,
        y: yRel * 35 * factor,
        rotationY: xRel * 18 * factor,
        duration: 0.9,
        ease: 'power2.out'
      });
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    gsap.to(heroContent, { rotationY: 0, rotationX: 0, x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
    if (heroImg) gsap.to(heroImg, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' });
    heroCards.forEach((card) => gsap.to(card, { x: 0, y: 0, rotationY: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' }));
  });
}

// ==========================================================================
// 5. CINEMATIC HERO ENTRANCE & SCROLL DEPTH SCRUB TIMELINE
// ==========================================================================
const heroTimeline = gsap.timeline({ delay: 0.1 });

// Expanding badge lines
heroTimeline
  .from('.badge-line.left-line', { scaleX: 0, transformOrigin: 'right', duration: 0.8, ease: 'power3.inOut' })
  .from('.badge-line.right-line', { scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.inOut' }, '-=0.8')
  .from('.badge-icon', { scale: 0, rotation: -90, duration: 0.6, ease: 'back.out(2)' }, '-=0.5')
  .from('.badge-text', { opacity: 0, letterSpacing: '8px', duration: 0.8, ease: 'power3.out' }, '-=0.4')
  .from('.reveal-text', {
    yPercent: 120,
    rotateX: 45,
    opacity: 0,
    stagger: 0.18,
    duration: 1.3,
    ease: 'power4.out'
  }, '-=0.4')
  .from('.hero-description', {
    opacity: 0,
    y: 30,
    filter: 'blur(8px)',
    duration: 1,
    ease: 'power3.out'
  }, '-=0.7')
  .from('.hero-cta-group', {
    opacity: 0,
    y: 25,
    scale: 0.95,
    duration: 0.8,
    ease: 'back.out(1.5)'
  }, '-=0.6')
  .from('.floating-story-card.card-left', {
    x: -80,
    opacity: 0,
    rotation: -10,
    duration: 1.1,
    ease: 'back.out(1.4)'
  }, '-=0.6')
  .from('.floating-story-card.card-right', {
    x: 80,
    opacity: 0,
    rotation: 10,
    duration: 1.1,
    ease: 'back.out(1.4)'
  }, '-=0.9')
  .from('.scroll-indicator', { opacity: 0, y: 15, duration: 0.8, ease: 'power2.out' }, '-=0.5');

// Hero Scroll Scrub Depth Zoom (Z-depth fade into storyline)
gsap.to('.hero-content', {
  scrollTrigger: {
    trigger: '#prologue',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  scale: 0.9,
  opacity: 0,
  y: -60,
  ease: 'none'
});

gsap.to('.hero-img', {
  scrollTrigger: {
    trigger: '#prologue',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  scale: 1.35,
  filter: 'brightness(0.18) contrast(1.3)',
  ease: 'none'
});

// "Begin the Odyssey" Smooth Scroll Trigger
const heroMainBtn = document.querySelector('.hero-main-btn');
if (heroMainBtn) {
  heroMainBtn.addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo('#story-chapters', { offset: -40, duration: 1.6 });
  });
}

// Chapter Cards Staggered Reveal
gsap.from('.chapter-card', {
  scrollTrigger: {
    trigger: '.chapters-section',
    start: 'top 75%',
  },
  y: 60,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  ease: 'power3.out'
});

// Signature Dishes Staggered Reveal
gsap.from('.dish-item', {
  scrollTrigger: {
    trigger: '.degustation-section',
    start: 'top 75%',
  },
  y: 50,
  opacity: 0,
  stagger: 0.12,
  duration: 0.9,
  ease: 'power3.out'
});

// ==========================================================================
// 5. DEGUSTATION CATEGORY FILTERING
// ==========================================================================
const tabButtons = document.querySelectorAll('.menu-tab-btn');
const dishItems = document.querySelectorAll('.dish-item');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.getAttribute('data-category');

    dishItems.forEach((dish) => {
      const dishCategory = dish.getAttribute('data-category');
      if (category === 'all' || dishCategory === category) {
        gsap.to(dish, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          display: 'flex',
          ease: 'power2.out',
        });
      } else {
        gsap.to(dish, {
          scale: 0.9,
          opacity: 0,
          duration: 0.3,
          display: 'none',
          ease: 'power2.in',
        });
      }
    });
  });
});

// ==========================================================================
// 6. INTERACTIVE 4-COURSE TASTING JOURNEY BUILDER
// ==========================================================================
const optionButtons = document.querySelectorAll('.option-btn');
const fillUmami = document.getElementById('fillUmami');
const valUmami = document.getElementById('valUmami');
const fillCitrus = document.getElementById('fillCitrus');
const valCitrus = document.getElementById('valCitrus');
const fillRichness = document.getElementById('fillRichness');
const valRichness = document.getElementById('valRichness');
const profileName = document.getElementById('profileName');
const recText = document.getElementById('recText');
const bookCustomJourneyBtn = document.getElementById('bookCustomJourney');

function calculateSensoryProfile() {
  const activeOptions = document.querySelectorAll('.option-btn.active');
  let totalUmami = 0;
  let totalCitrus = 0;
  let totalRichness = 0;
  let courseNames = [];

  activeOptions.forEach((opt) => {
    totalUmami += parseInt(opt.getAttribute('data-umami') || '5', 10);
    totalCitrus += parseInt(opt.getAttribute('data-citrus') || '5', 10);
    totalRichness += parseInt(opt.getAttribute('data-richness') || '5', 10);
    courseNames.push(opt.getAttribute('data-name'));
  });

  const maxPossible = activeOptions.length * 10 || 40;
  const umamiPct = Math.min(100, Math.round((totalUmami / maxPossible) * 100));
  const citrusPct = Math.min(100, Math.round((totalCitrus / maxPossible) * 100));
  const richnessPct = Math.min(100, Math.round((totalRichness / maxPossible) * 100));

  if (fillUmami && valUmami) {
    fillUmami.style.width = `${umamiPct}%`;
    valUmami.textContent = `${umamiPct}%`;
  }
  if (fillCitrus && valCitrus) {
    fillCitrus.style.width = `${citrusPct}%`;
    valCitrus.textContent = `${citrusPct}%`;
  }
  if (fillRichness && valRichness) {
    fillRichness.style.width = `${richnessPct}%`;
    valRichness.textContent = `${richnessPct}%`;
  }

  // Dynamic Profile Persona & Pairing Recommendation
  if (umamiPct > 80 && richnessPct > 80) {
    if (profileName) profileName.textContent = "The Imperial Alchemist's Feast";
    if (recText) recText.textContent = "Grand Cru Vault Flight — 2012 Dom Pérignon Champagne & 2010 Château Margaux.";
  } else if (citrusPct > 65) {
    if (profileName) profileName.textContent = "The Alpine & Maritime Flora Odyssey";
    if (recText) recText.textContent = "Nordic & Mineral Flight — Meursault Premier Cru & Rare Sparkling Junmai Daiginjo.";
  } else {
    if (profileName) profileName.textContent = "The Symphony of Fire & Ocean";
    if (recText) recText.textContent = "Sommelier Selection — 2015 Domaine de la Romanée-Conti & 40-Year Tawny Port.";
  }

  return courseNames;
}

optionButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const parentSlot = btn.closest('.course-slot');
    if (!parentSlot) return;

    parentSlot.querySelectorAll('.option-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    // Trigger subtle click pulse
    gsap.from(btn, { scale: 0.95, duration: 0.2, ease: 'power1.out' });

    calculateSensoryProfile();
  });
});

// Transfer Builder Selection to WhatsApp
if (bookCustomJourneyBtn) {
  bookCustomJourneyBtn.addEventListener('click', () => {
    const activeNames = calculateSensoryProfile();
    const message = `Hello L'Aura D'Or Concierge, I have customized my 4-Course Tasting Odyssey:\n` +
      `• Course 1: ${activeNames[0] || 'Caviar Tartlet'}\n` +
      `• Course 2: ${activeNames[1] || 'Hokkaido Scallop'}\n` +
      `• Course 3: ${activeNames[2] || 'Miyazaki Wagyu'}\n` +
      `• Course 4: ${activeNames[3] || 'Obsidian Geode'}\n\n` +
      `Please let me know availability for a table reservation!`;

    const waUrl = `https://wa.me/18005559876?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  });
}

// ==========================================================================
// 7. RESERVATION FORM SUBMISSION (CONNECTS TO WHATSAPP)
// ==========================================================================
const bookingForm = document.getElementById('bookingForm');
const bookingSuccessMessage = document.getElementById('bookingSuccessMessage');

if (bookingForm) {
  // Set default booking date to tomorrow
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName')?.value || 'Guest';
    const phone = document.getElementById('guestPhone')?.value || '';
    const date = document.getElementById('bookingDate')?.value || '';
    const party = document.getElementById('partySize')?.value || '2 Guests';
    const experience = document.getElementById('seatingExperience')?.value || '12-Course Degustation';
    const notes = document.getElementById('dietaryNotes')?.value || 'None';

    const waMessage = `*VIP TABLE RESERVATION INQUIRY — L'AURA D'OR*\n\n` +
      `*Guest Name:* ${name}\n` +
      `*Contact:* ${phone}\n` +
      `*Date:* ${date}\n` +
      `*Party Size:* ${party}\n` +
      `*Experience:* ${experience}\n` +
      `*Special Requests / Notes:* ${notes}\n\n` +
      `Kindly confirm table allocation and concierge arrangements.`;

    const waUrl = `https://wa.me/18005559876?text=${encodeURIComponent(waMessage)}`;

    // Show smooth confirmation
    bookingForm.classList.add('hidden');
    bookingSuccessMessage?.classList.remove('hidden');
    gsap.from(bookingSuccessMessage, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' });

    // Open WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  });
}

// ==========================================================================
// 8. SYNTHESIZED SOUND AMBIENCE (NATIVE WEB AUDIO API)
// ==========================================================================
let audioCtx = null;
let isAudioPlaying = false;
let ambientOsc = null;
let gainNode = null;

const soundToggleBtn = document.getElementById('soundToggle');
const soundOnIcon = document.querySelector('.sound-on');
const soundOffIcon = document.querySelector('.sound-off');

function initSoundAmbience() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (!isAudioPlaying) {
    // Generate soothing low warm drone (A2 110Hz + harmonics)
    ambientOsc = audioCtx.createOscillator();
    const subOsc = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    ambientOsc.type = 'sine';
    ambientOsc.frequency.setValueAtTime(110, audioCtx.currentTime); // Warm A2

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Deep A1

    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 2);

    ambientOsc.connect(gainNode);
    subOsc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    ambientOsc.start();
    subOsc.start();

    isAudioPlaying = true;
    soundOnIcon?.classList.remove('hidden');
    soundOffIcon?.classList.add('hidden');
  } else {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        ambientOsc?.stop();
        isAudioPlaying = false;
      }, 1000);
    }
    soundOnIcon?.classList.add('hidden');
    soundOffIcon?.classList.remove('hidden');
  }
}

soundToggleBtn?.addEventListener('click', initSoundAmbience);

// ==========================================================================
// 9. MOBILE NAVIGATION TOGGLE
// ==========================================================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle?.addEventListener('click', () => {
  navMenu?.classList.toggle('open');
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
  });
});

