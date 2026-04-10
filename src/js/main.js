/* ═══════════════════════════════════════════════
   AVERON CONSULTING — main.js
═══════════════════════════════════════════════ */

/* ── Lead magnet banner ─────────────────────── */
function closeBanner() {
  const banner = document.getElementById('lead-magnet-banner');
  const navbar = document.getElementById('navbar');
  if (!banner) return;
  banner.classList.add('hidden');
  navbar.classList.add('banner-hidden');
  document.documentElement.style.setProperty('--banner-h', '0px');
  sessionStorage.setItem('bannerClosed', '1');
}

function handleLeadMagnet(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const btn   = e.target.querySelector('button');
  btn.textContent = '✓ Enviado';
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
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = y;
}, { passive: true });

/* ── Mobile menu ────────────────────────────── */
function toggleMenu() {
  const links  = document.getElementById('nav-links');
  const toggle = document.querySelector('.nav-toggle');
  const isOpen = links.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
}

function closeMenu() {
  const links  = document.getElementById('nav-links');
  const toggle = document.querySelector('.nav-toggle');
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
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings inside grids
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
  document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(other => {
    if (other !== btn) {
      other.setAttribute('aria-expanded', 'false');
      other.nextElementSibling.classList.remove('open');
    }
  });

  // Toggle current
  btn.setAttribute('aria-expanded', !isOpen);
  answer.classList.toggle('open', !isOpen);
}

/* ── Hero logo animation ────────────────────── */
// The CSS handles the N→AV assembly animation on page load.
// After assembly, add a subtle idle float.
document.addEventListener('DOMContentLoaded', () => {
  const shapeA = document.getElementById('hero-shape-a');
  const shapeV = document.getElementById('hero-shape-v');
  if (!shapeA || !shapeV) return;

  // After the assembly animation finishes, add a slow float
  shapeA.addEventListener('animationend', () => {
    shapeA.style.animation = 'none';
    shapeV.style.animation = 'none';
    shapeA.style.transform = 'translateX(0)';
    shapeV.style.transform = 'translateX(0)';

    // Subtle continuous idle animation
    const svg = document.getElementById('hero-logo-svg');
    if (svg) {
      svg.style.animation = 'logo-float 6s ease-in-out infinite';
    }
  }, { once: true });
});

/* ── Active nav link on scroll ──────────────── */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ── Smooth scroll for anchor links ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) +
      parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--banner-h'));
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── CSS keyframe injection (logo float) ─────── */
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
