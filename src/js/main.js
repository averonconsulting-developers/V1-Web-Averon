/* ═══════════════════════════════════════════════
   AVERON CONSULTING — main.js
═══════════════════════════════════════════════ */

/* ── Lead magnet banner ─────────────────────── */
function closeBanner() {
  const banner = document.getElementById('lead-magnet-banner');
  const navbar = document.getElementById('navbar');
  if (!banner) return;
  banner.classList.add('hidden');
  if (navbar) navbar.classList.add('banner-hidden');
  document.documentElement.style.setProperty('--banner-h', '0px');
  sessionStorage.setItem('bannerClosed', '1');
}

function handleLeadMagnet(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const btn   = e.target.querySelector('button');
  btn.textContent = 'Enviado';
  btn.style.background = 'rgba(0,0,0,0.5)';
  input.value = '';
  setTimeout(closeBanner, 1200);
}

// Restore closed state on reload
if (sessionStorage.getItem('bannerClosed')) {
  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('lead-magnet-banner');
    const navbar = document.getElementById('navbar');
    if (banner) banner.classList.add('hidden');
    if (navbar) navbar.classList.add('banner-hidden');
    document.documentElement.style.setProperty('--banner-h', '0px');
  });
}

/* ── Navbar scroll behavior ─────────────────── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 40) {
    if (navbar) navbar.classList.add('scrolled');
  } else {
    if (navbar) navbar.classList.remove('scrolled');
  }
  lastScroll = y;
}, { passive: true });

/* ── Mobile menu ────────────────────────────── */
function toggleMenu() {
  const links  = document.getElementById('nav-links');
  const toggle = document.querySelector('.nav-toggle');
  if (!links || !toggle) return;
  const isOpen = links.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
}

function closeMenu() {
  const links  = document.getElementById('nav-links');
  const toggle = document.querySelector('.nav-toggle');
  if (!links || !toggle) return;
  links.classList.remove('open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}

// Close on outside click
document.addEventListener('click', (e) => {
  const links  = document.getElementById('nav-links');
  const toggle = document.querySelector('.nav-toggle');
  if (!links || !toggle) return;
  if (!links.contains(e.target) && !toggle.contains(e.target)) {
    closeMenu();
  }
});

/* ── Scroll reveal (IntersectionObserver) ───── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = [...parent.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 400);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── FAQ accordion ──────────────────────────── */
function toggleFaq(btn) {
  const answer  = btn.nextElementSibling;
  const isOpen  = btn.getAttribute('aria-expanded') === 'true';

  // Close all others
  document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(other => {
    if (other !== btn) {
      other.setAttribute('aria-expanded', 'false');
      other.nextElementSibling.classList.remove('open');
    }
  });

  // Toggle current
  btn.setAttribute('aria-expanded', !isOpen);
  answer.classList.toggle('open', !isOpen);
}

/* ── Depth parallax (hero index only) ──────── */
const heroScene = document.getElementById('heroScene');
if (heroScene) {
  const layers = heroScene.querySelectorAll('.depth-layer');
  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5);
    targetY = (e.clientY / window.innerHeight - 0.5);
  });

  function animateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth);
      const x = currentX * depth * 60;
      const y = currentY * depth * 30;
      layer.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animateParallax);
  }
  animateParallax();
}

/* ── Stats counter animation ────────────────── */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => statObserver.observe(el));

/* ── CSS keyframe injection ──────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes logo-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  .nav-links a.active {
    color: var(--text) !important;
  }
`;
document.head.appendChild(style);

/* ── Word split text reveal ────────────────── */
function initWordSplit() {
  document.querySelectorAll('h1, h2.split').forEach(el => {
    el.classList.add('split-words');
    const html = el.innerHTML;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    let wordIndex = 0;
    function processNode(node) {
      if (node.nodeType === 3) {
        const words = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach(part => {
          if (part.match(/^\s+$/)) {
            frag.appendChild(document.createTextNode(part));
          } else if (part) {
            const ww = document.createElement('span');
            ww.className = 'word-wrap';
            const w = document.createElement('span');
            w.className = 'word';
            w.style.transitionDelay = `${wordIndex * 60}ms`;
            w.textContent = part;
            ww.appendChild(w);
            frag.appendChild(ww);
            wordIndex++;
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'SPAN') {
        Array.from(node.childNodes).forEach(processNode);
      }
    }
    Array.from(wrapper.childNodes).forEach(processNode);
    el.innerHTML = wrapper.innerHTML;
  });

  const wordObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('words-visible');
        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.split-words').forEach(el => wordObserver.observe(el));
}
document.addEventListener('DOMContentLoaded', initWordSplit);

/* ── Card 3D tilt on hover ──────────────────── */
document.querySelectorAll('.problema-card, .ejemplo-card, .team-card, .fase').forEach(card => {
  card.classList.add('card-tilt');
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ── Magnetic button effect ─────────────────── */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── Cursor particle trail ───────────────────── */
let lastSpark = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSpark < 60) return;
  lastSpark = now;
  const spark = document.createElement('div');
  spark.className = 'cursor-spark';
  spark.style.left = e.clientX + 'px';
  spark.style.top  = e.clientY + 'px';
  const size  = 2 + Math.random() * 4;
  spark.style.width  = size + 'px';
  spark.style.height = size + 'px';
  const angle = Math.random() * 360;
  const dist  = 20 + Math.random() * 35;
  spark.style.setProperty('--tx', Math.cos(angle * Math.PI / 180) * dist + 'px');
  spark.style.setProperty('--ty', Math.sin(angle * Math.PI / 180) * dist + 'px');
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 820);
});

/* ── Line draw on scroll ────────────────────── */
const lineObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); lineObserver.unobserve(e.target); } });
}, { threshold: 0.3 });
document.querySelectorAll('.line-draw').forEach(el => lineObserver.observe(el));

/* ── Section cinematic entrance ──────────────── */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      sectionObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('section').forEach(s => {
  // no aplicar al hero
  if (s.id === 'hero' || s.classList.contains('page-hero')) return;
  s.classList.add('reveal-section');
  sectionObserver.observe(s);
});

/* ── Scroll parallax en imágenes ─────────────── */
function initScrollParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;

  let ticking = false;

  function update() {
    els.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
      const speed  = parseFloat(el.dataset.parallax || 0.15);
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `scale(1.12) translateY(${center * speed}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}
initScrollParallax();
