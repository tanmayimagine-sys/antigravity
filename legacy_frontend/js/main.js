/**
 * main.js — Global JavaScript (classic script, no modules)
 * Handles: navbar, mobile menu, scroll effects, fade-in, scroll progress
 */

/* ── Scroll progress bar ──────────────────────────────────── */
const progressBar = document.querySelector('.progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = ((window.scrollY / total) * 100) + '%';
  }, { passive: true });
}

/* ── Navbar scrolled state + active link ─────────────────── */
const navbar = document.querySelector('.navbar');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Hamburger / mobile nav ──────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }));
}

/* ── Fade-in intersection observer ───────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── Hero search redirect ─────────────────────────────────── */
const heroForm = document.querySelector('.hero-search-form');
if (heroForm) {
  heroForm.addEventListener('submit', e => {
    e.preventDefault();
    const dest = heroForm.querySelector('input').value.trim();
    if (dest) window.location.href = `planner.html?destination=${encodeURIComponent(dest)}`;
  });
}

/* ── Toast utility (global) ──────────────────────────────── */
window.showToast = function(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    Object.assign(container.style, { position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:'9999', display:'flex', flexDirection:'column', gap:'.6rem' });
    document.body.appendChild(container);
  }
  const colors = { info:'#1E3A8A', success:'#22c55e', error:'#ef4444', warning:'#F59E0B' };
  const icons  = { info:'ℹ️', success:'✅', error:'❌', warning:'⚠️' };
  const el = document.createElement('div');
  el.style.cssText = `background:#fff;border-left:4px solid ${colors[type]};padding:.75rem 1.25rem;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.12);font-family:'Inter',sans-serif;font-size:.9rem;display:flex;align-items:center;gap:.6rem;max-width:320px;color:#1e293b;animation:slideInToast .3s ease;`;
  el.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.animation = 'fadeOutToast .3s ease forwards'; setTimeout(() => el.remove(), 300); }, duration);
};

/* ── Inject toast keyframes ───────────────────────────────── */
if (!document.getElementById('toast-style')) {
  const s = document.createElement('style');
  s.id = 'toast-style';
  s.textContent = `@keyframes slideInToast{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}@keyframes fadeOutToast{to{opacity:0;transform:translateX(30px)}}`;
  document.head.appendChild(s);
}
