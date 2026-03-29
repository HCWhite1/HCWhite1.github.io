/* =============================================
   main.js — Hugo CANU Portfolio
   ============================================= */

// ─── Matrix Rain ───────────────────────────────
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const FONT = 13;
  const CHARS = '01{}[]()<>/\\|=+-*$@#~ABCDEFabcdef';
  let cols, drops;

  function setup() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cols  = Math.floor(canvas.width / FONT);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  }
  setup();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  });

  function draw() {
    ctx.fillStyle = 'rgba(10,10,10,0.055)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FONT;
      if (y < 0) { drops[i] += 0.4; continue; }

      // head — bright
      ctx.fillStyle = 'rgba(0,255,136,0.85)';
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT, y);
      // trail — dim
      ctx.fillStyle = 'rgba(0,255,136,0.1)';
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT, y - FONT);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = Math.random() * -30;
      }
      drops[i] += 0.45;
    }
  }
  setInterval(draw, 55);
}

// ─── Typing Effect ─────────────────────────────
function typeText(el, text, speed, done) {
  let i = 0;
  el.textContent = '';
  const t = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i++];
    } else {
      clearInterval(t);
      if (done) done();
    }
  }, speed);
}

function initTyping() {
  const nameEl = document.getElementById('hero-name-text');
  if (!nameEl) return;
  setTimeout(() => typeText(nameEl, 'CANU Hugo', 75), 400);
}

// ─── Scroll Reveal ─────────────────────────────
function initReveal() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ─── Active Nav ─────────────────────────────────
function initNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ─── Tabs (Rectorat) ────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

// ─── Modal (Réalisations) ───────────────────────
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modal;
      const data = window.REALISATIONS?.[id];
      if (!data) return;
      populateModal(data);
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  overlay.querySelector('#modal-close-btn')?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function populateModal(d) {
  document.getElementById('modal-tag').textContent   = d.stage ?? '';
  document.getElementById('modal-title').textContent = d.title ?? '';

  const imgEl = document.getElementById('modal-img');
  if (d.image) { imgEl.src = d.image; imgEl.style.display = 'block'; }
  else           { imgEl.style.display = 'none'; }

  document.getElementById('modal-desc').textContent = d.description ?? '';

  const compEl = document.getElementById('modal-competences');
  compEl.innerHTML = (d.competences ?? []).map(c => `
    <div class="competence-item">
      <span class="code">${c.code}</span> — ${c.label}
      ${c.sub ? `<span class="sub">▸ ${c.sub}</span>` : ''}
    </div>`).join('');

  const techEl = document.getElementById('modal-technos');
  techEl.innerHTML = (d.technos ?? []).map(t => `
    <span class="techno-chip">
      ${t.logo ? `<img src="${t.logo}" alt="">` : ''}${t.name}
    </span>`).join('');
}

// ─── Back to top ────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMatrix();
  initTyping();
  initReveal();
  initNav();
  initTabs();
  initModals();
  initBackToTop();
});
