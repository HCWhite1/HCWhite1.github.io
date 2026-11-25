const $ = id => document.getElementById(id);
const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Overlay partagé (Modales & Visionneuse) ────
const activeOverlays = new Set();
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') [...activeOverlays].at(-1)?.();
});

function bindOverlay(el, onClose) {
  const close = () => {
    if (!el.classList.contains('open')) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    activeOverlays.delete(close);
    if (!activeOverlays.size) document.body.style.overflow = '';
    onClose?.();
  };
  el.addEventListener('click', e => { if (e.target === el) close(); });
  return {
    open() {
      el.classList.add('open');
      el.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      activeOverlays.add(close);
    },
    close,
  };
}

// ─── Thème (Mode sombre par défaut / clair optionnel) ──
const THEME_KEY = 'hc_theme';

function isLightTheme() {
  return document.documentElement.dataset.theme === 'light';
}

function initThemeToggle() {
  const navBtn = $('theme-toggle');
  const orbBtn = $('theme-orb');
  const triggers = [navBtn, orbBtn].filter(Boolean);
  if (!triggers.length) return;

  const orbLabel = orbBtn?.querySelector('.theme-orb-label');

  const sync = () => {
    const light = isLightTheme();
    const ariaLabel = light ? 'Activer le mode sombre' : 'Activer le mode clair';
    const shortLabel = light ? 'Mode sombre' : 'Mode clair';
    triggers.forEach(btn => {
      btn.setAttribute('aria-pressed', String(light));
      btn.setAttribute('aria-label', ariaLabel);
      if (btn === navBtn) btn.title = shortLabel;
    });
    if (orbLabel) orbLabel.textContent = shortLabel;
  };

  const applyTheme = nextLight => {
    if (nextLight) document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem(THEME_KEY, nextLight ? 'light' : 'dark'); } catch {}
    sync();
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextLight ? 'light' : 'dark' } }));
  };

  const spawnWarpRing = (x, y, r) => {
    const ring = document.createElement('span');
    ring.className = 'theme-warp-ring';
    ring.style.setProperty('--warp-x', `${x}px`);
    ring.style.setProperty('--warp-y', `${y}px`);
    ring.style.setProperty('--warp-r', `${r}px`);
    document.body.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
    setTimeout(() => ring.remove(), 900);
  };

  const toggleWithWarp = originBtn => {
    const nextLight = !isLightTheme();
    if (REDUCED_MOTION) {
      applyTheme(nextLight);
      return;
    }

    const rect = originBtn.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    const r = Math.ceil(Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    ));
    const root = document.documentElement;
    root.style.setProperty('--warp-x', `${x}px`);
    root.style.setProperty('--warp-y', `${y}px`);
    root.style.setProperty('--warp-r', `${r}px`);

    if (typeof document.startViewTransition === 'function') {
      const transition = document.startViewTransition(() => applyTheme(nextLight));
      transition.ready.then(() => spawnWarpRing(x, y, r)).catch(() => {});
    } else {
      applyTheme(nextLight);
      spawnWarpRing(x, y, r);
    }
  };

  sync();
  triggers.forEach(btn => btn.addEventListener('click', () => toggleWithWarp(btn)));

  // Rangement de l'orbe pile dans le bouton de la navbar dès qu'on scroll sur l'accueil
  if (orbBtn && navBtn) {
    let ticking = false;
    const measureDock = () => {
      const cs = getComputedStyle(orbBtn);
      const restTop = parseFloat(cs.top) || 0;
      const restRight = parseFloat(cs.right) || 0;
      const navRect = navBtn.getBoundingClientRect();
      const compactCx = window.innerWidth - restRight - navRect.width / 2;
      const compactCy = restTop + navRect.height / 2;
      const dx = Math.round((navRect.left + navRect.width / 2) - compactCx);
      const dy = Math.round((navRect.top + navRect.height / 2) - compactCy);
      orbBtn.style.setProperty('--dock-dx', `${dx}px`);
      orbBtn.style.setProperty('--dock-dy', `${dy}px`);
    };
    const updateDock = () => {
      ticking = false;
      const docked = window.scrollY > 110;
      if (docked !== document.body.classList.contains('orb-docked')) {
        measureDock();
        document.body.classList.toggle('orb-docked', docked);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateDock);
    };
    measureDock();
    document.body.classList.toggle('orb-docked', window.scrollY > 110);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measureDock, { passive: true });
  }
}

// ─── Matrix Rain (rAF + pause onglet masqué) ────
function initMatrix() {
  const canvas = $('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const FONT = 13, STEP_MS = 55, SPEED = 0.45;
  const CHARS = '01{}[]()<>/\\|=+-*$@#~ABCDEFabcdef';
  const STORAGE_KEY = 'hc_matrix_state';
  const PALETTES = {
    dark: {
      bg: '#0a0a0a',
      fade: 'rgba(10,10,10,0.055)',
      preFade: 'rgba(10,10,10,0.08)',
      head: 'rgba(0,255,136,0.92)',
      tail: 'rgba(0,255,136,0.16)',
      preHead: 'rgba(0,255,136,0.85)',
      preTail: 'rgba(0,255,136,0.18)',
    },
    light: {
      bg: '#f6f7f9',
      fade: 'rgba(246,247,249,0.06)',
      preFade: 'rgba(246,247,249,0.08)',
      head: 'rgba(37,99,235,0.88)',
      tail: 'rgba(37,99,235,0.18)',
      preHead: 'rgba(37,99,235,0.8)',
      preTail: 'rgba(37,99,235,0.18)',
    },
  };
  let cols = 0, drops = null, rafId = 0, lastTs = 0;

  const getPalette = () => isLightTheme() ? PALETTES.light : PALETTES.dark;
  const randChar = () => CHARS[(Math.random() * CHARS.length) | 0];

  function loadState(targetCols, maxRows) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
      if (!Array.isArray(saved?.drops) || !saved.drops.length) return null;
      const advance = Math.min(60, Math.max(0, (Date.now() - (saved.t || 0)) / STEP_MS)) * SPEED;
      return Array.from({ length: targetCols }, (_, i) => {
        let next = (i < saved.drops.length ? saved.drops[i] : Math.random() * maxRows) + advance;
        return next > maxRows + 10 ? (next % (maxRows + 20)) - 10 : next;
      });
    } catch { return null; }
  }

  function saveState() {
    if (!drops) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        drops: drops.map(d => Math.round(d * 100) / 100),
        t: Date.now(),
      }));
    } catch {}
  }

  function prewarmTrails() {
    const p = getPalette();
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let step = 20; step >= 1; step--) {
      ctx.fillStyle = p.preFade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = step === 1 ? p.preHead : p.preTail;
      for (let i = 0; i < cols; i++) {
        const y = (drops[i] - step * SPEED) * FONT;
        if (y >= 0 && y <= canvas.height) ctx.fillText(randChar(), i * FONT, y);
      }
    }
  }

  function setup() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.font = `${FONT}px 'JetBrains Mono', monospace`;
    cols = Math.floor(canvas.width / FONT);
    const maxRows = Math.ceil(canvas.height / FONT);
    const restored = loadState(cols, maxRows);
    drops = restored || Array.from({ length: cols }, () => Math.random() * -60);
    if (restored || REDUCED_MOTION) {
      prewarmTrails();
    } else {
      ctx.fillStyle = getPalette().bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function draw() {
    const p = getPalette();
    ctx.fillStyle = p.fade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = p.head;
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FONT;
      if (y >= 0) ctx.fillText(randChar(), i * FONT, y);
    }
    ctx.fillStyle = p.tail;
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FONT;
      if (y >= 0) ctx.fillText(randChar(), i * FONT, y - FONT);
      drops[i] += y < 0 ? 0.4 : SPEED;
      if (y > canvas.height && Math.random() > 0.975) drops[i] = Math.random() * -30;
    }
  }

  function loop(ts) {
    if (document.hidden) { rafId = 0; return; }
    if (ts - lastTs >= STEP_MS) { lastTs = ts; draw(); }
    rafId = requestAnimationFrame(loop);
  }

  setup();
  document.addEventListener('themechange', () => {
    if (drops) prewarmTrails();
  });
  if (REDUCED_MOTION) return;

  rafId = requestAnimationFrame(loop);
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { saveState(); setup(); }, 150);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveState();
    else if (!rafId) rafId = requestAnimationFrame(loop);
  });
  window.addEventListener('pagehide', saveState);
}

// ─── Scroll Reveal ──────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length || REDUCED_MOTION) return;
  let remaining = els.length;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      io.unobserve(e.target);
      if (--remaining === 0) io.disconnect();
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => io.observe(el));
}

// ─── Deep-link vers un onglet CSS (Stages) ──────
function initTabHash() {
  if (!location.hash) return;
  const el = $(decodeURIComponent(location.hash.slice(1)));
  const pane = el?.closest('.tab-pane');
  const radio = pane && $('tab-' + pane.id);
  if (!radio) return;
  radio.checked = true;
  requestAnimationFrame(() => el.scrollIntoView());
}

// ─── Modal (Réalisations) ───────────────────────
function initModals() {
  const overlay = $('modal-overlay');
  if (!overlay) return;

  const videoEl = $('modal-video');
  const stopVideo = () => {
    if (!videoEl) return;
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
    videoEl.style.display = 'none';
  };

  const ctrl = bindOverlay(overlay, () => {
    stopVideo();
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });

  function open(id) {
    const d = window.REALISATIONS?.[id];
    if (!d) return;
    populateModal(d, videoEl, stopVideo);
    ctrl.open();
  }

  document.querySelector('.realisations-grid')?.addEventListener('click', e => {
    const target = e.target.closest('[data-modal]');
    if (target) open(target.dataset.modal);
  });
  $('modal-close-btn')?.addEventListener('click', ctrl.close);

  const openFromHash = () => location.hash && open(decodeURIComponent(location.hash.slice(1)));
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
}

function populateModal(d, videoEl, stopVideo) {
  $('modal-tag').textContent = d.stage ?? '';
  $('modal-title').textContent = d.title ?? '';

  const imgEl = $('modal-img');
  if (d.image) {
    imgEl.src = d.image;
    imgEl.alt = d.title ?? '';
    imgEl.classList.toggle('modal-img-full', Boolean(d.imageFull || d.image.endsWith('.gif')));
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  if (videoEl) {
    if (d.video) {
      videoEl.src = d.video;
      videoEl.muted = true;
      videoEl.style.display = 'block';
      videoEl.play().catch(() => {});
    } else {
      stopVideo();
    }
  }

  document.querySelector('#modal-overlay .modal')?.classList.toggle('modal-wide', Boolean(d.schemaTemplate));

  const schemaWrap = $('modal-schema-wrap'), schemaHost = $('modal-schema-host');
  if (schemaWrap && schemaHost) {
    const tpl = d.schemaTemplate && $(d.schemaTemplate);
    if (tpl) {
      const root = schemaHost.shadowRoot || schemaHost.attachShadow({ mode: 'open' });
      root.replaceChildren(tpl.content.cloneNode(true));
      const link = $('modal-schema-link');
      if (link) { link.href = d.schemaUrl || '#'; link.hidden = !d.schemaUrl; }
      schemaWrap.hidden = false;
    } else {
      schemaWrap.hidden = true;
    }
  }

  const galleryEl = $('modal-gallery');
  if (galleryEl) {
    galleryEl.hidden = !d.gallery?.length;
    galleryEl.innerHTML = (d.gallery ?? []).map(item => `
      <figure class="modal-gallery-item shot">
        <button type="button" class="shot-btn" data-full="${item.src}" aria-label="Agrandir ${item.alt ?? ''}">
          <img src="${item.src}" alt="${item.alt ?? ''}" loading="lazy" decoding="async">
        </button>
        ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ''}
      </figure>`).join('');
  }

  const descEl = $('modal-desc');
  if (d.descriptionHtml) descEl.innerHTML = d.descriptionHtml;
  else descEl.textContent = d.description ?? '';

  $('modal-technos').innerHTML = (d.technos ?? []).map(t => `
    <span class="techno-chip">${t.logo ? `<img src="${t.logo}" alt="" loading="lazy">` : ''}${t.name}</span>`).join('');

  const repoBtn = $('modal-repo-btn');
  if (repoBtn) { repoBtn.href = d.repo || '#'; repoBtn.hidden = !d.repo; }

  const detailsToggle = $('modal-details-toggle');
  if (detailsToggle) detailsToggle.checked = false;
  const detailsList = $('modal-details-list');
  if (detailsList) {
    detailsList.innerHTML = (d.details ?? []).map(c => `
      <div class="details-comp-block">
        <div class="details-comp-header">
          <span class="details-comp-code">${c.code}</span>
          <span class="details-comp-label">— ${c.label}</span>
        </div>
        ${c.sub ? `<p class="details-comp-sub">▸ ${c.sub}</p>` : ''}
        ${c.points?.length ? `<ul class="details-points">${c.points.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
      </div>`).join('');
  }
}

// ─── Back to top (fallback si pas de scroll-timeline CSS) ──
function initBackToTop() {
  const btn = $('back-to-top');
  if (!btn || CSS.supports('animation-timeline', 'scroll()')) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle('visible', window.scrollY > 300);
      ticking = false;
    });
  }, { passive: true });
}

// ─── News (Veille) ──────────────────────────────
function initNewsArticles() {
  const dateView = $('news-date-view'), overlay = $('news-modal-overlay');
  if (!dateView || !overlay) return;

  const ctrl = bindOverlay(overlay);
  const modal = {
    title: $('news-modal-title'), summary: $('news-modal-summary'),
    author: $('news-modal-author'), bornage: $('news-modal-bornage'),
    date: $('news-modal-date'), pdf: $('news-modal-pdf'), source: $('news-modal-source'),
  };
  const fmtDate = iso => iso ? iso.split('-').reverse().join('/') : '-';

  function openModal(item) {
    const title = item.querySelector('.news-title')?.textContent.trim() || 'Article';
    const src = item.querySelector('.news-src')?.textContent.trim() || '';
    const { author = 'A définir', bornage = 'A définir', date = '', pdf = '', url = '#', summary } = item.dataset;
    modal.title.textContent = title;
    modal.summary.textContent = summary || `${title} : point rapide ${bornage.toLowerCase()} via ${src}.`;
    modal.author.textContent = author;
    modal.bornage.textContent = bornage;
    modal.date.textContent = fmtDate(date);
    modal.pdf.href = pdf || '#';
    modal.pdf.hidden = !pdf;
    modal.source.href = url;
    modal.source.textContent = src ? `Source originale (${src})` : 'Source originale';
    ctrl.open();
  }

  dateView.addEventListener('click', e => {
    const item = e.target.closest('.news-item');
    if (!item) return;
    e.preventDefault();
    openModal(item);
  });
  overlay.querySelector('[data-news-close]')?.addEventListener('click', ctrl.close);

  // Rendu paresseux de la vue Bornage uniquement au premier clic sur "Bornage"
  $('sort-bornage')?.addEventListener('change', () => {
    const cols = { CPU: [], GPU: [], Drivers: [] };
    dateView.querySelectorAll('.news-item').forEach(el => cols[el.dataset.bornage || 'CPU']?.push(el));
    const bornageView = $('news-bornage-view');
    Object.entries(cols).forEach(([key, list]) => {
      const box = bornageView.querySelector(`[data-bornage-col="${key}"] .news-bornage-list`);
      if (!box) return;
      list.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''))
        .forEach(item => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'news-bornage-item';
          btn.innerHTML = `<span class="news-title">${item.querySelector('.news-title')?.textContent.trim() || 'Article'}</span>`
            + `<span class="news-src">${item.querySelector('.news-src')?.textContent.trim() || ''}</span>`
            + `<span class="news-date">${fmtDate(item.dataset.date)}</span>`;
          btn.addEventListener('click', () => openModal(item));
          box.appendChild(btn);
        });
    });
  }, { once: true });
}

// ─── Visionneuse de captures (Accueil & Stages) ─
function initShots() {
  const viewer = $('shot-viewer');
  if (!viewer) return;
  const img = viewer.querySelector('img');
  const cap = viewer.querySelector('figcaption');
  const closeBtn = viewer.querySelector('.shot-viewer-close');
  let lastFocus = null;

  const ctrl = bindOverlay(viewer, () => {
    img.removeAttribute('src');
    lastFocus?.focus();
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('.shot-btn, #modal-img');
    if (!btn) return;
    lastFocus = btn;
    const isModalImg = btn.id === 'modal-img';
    img.src = isModalImg ? btn.src : btn.dataset.full;
    img.alt = isModalImg ? btn.alt : (btn.querySelector('img')?.alt ?? '');
    cap.textContent = isModalImg ? btn.alt : (btn.closest('.shot')?.querySelector('figcaption')?.textContent ?? '');
    ctrl.open();
    closeBtn.focus();
  });
  closeBtn.addEventListener('click', ctrl.close);
}

// ─── Coloration paresseuse des extraits (Stages) ─
function initCode() {
  const drops = document.querySelectorAll('.code-drop');
  if (!drops.length) return;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const RE = /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(async|await|const|let|var|function|return|if|else|new|null|true|false|die|empty|elseif)\b|(\$\w+)/g;

  drops.forEach(drop => {
    drop.addEventListener('toggle', () => {
      if (!drop.open) return;
      drop.querySelectorAll('code').forEach(code => {
        const src = code.textContent;
        let out = '', last = 0, m;
        RE.lastIndex = 0;
        while ((m = RE.exec(src)) !== null) {
          out += esc(src.slice(last, m.index));
          out += `<span class="tok-${m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'v'}">${esc(m[0])}</span>`;
          last = RE.lastIndex;
        }
        code.innerHTML = out + esc(src.slice(last));
      });
    }, { once: true });
  });
}

// ─── Repère de sections (Accueil — rAF + cache) ─
function initSectionSpy() {
  const spy = $('section-spy');
  if (!spy) return;
  const links = [...spy.querySelectorAll('.spy-link')];
  const sections = links.map(l => $(l.dataset.spy)).filter(Boolean);
  if (!sections.length) return;

  let tops = [], lastIdx = -1, ticking = false;
  const measure = () => { tops = sections.map(s => s.getBoundingClientRect().top + window.scrollY); };

  function update() {
    ticking = false;
    const trigger = window.scrollY + window.innerHeight * 0.35;
    let idx = 0;
    for (let i = 0; i < tops.length; i++) if (tops[i] <= trigger) idx = i;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) idx = tops.length - 1;
    if (idx === lastIdx) return;
    lastIdx = idx;
    links.forEach((l, i) => {
      l.classList.toggle('active', i === idx);
      l.classList.toggle('past', i < idx);
    });
  }

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); });
  window.addEventListener('load', () => { measure(); update(); });
}

// ─── Filtres (Réalisations) ─────────────────────
function initRealisationFilters() {
  const bar = $('realisations-filters');
  const grid = document.querySelector('.realisations-grid');
  if (!bar || !grid) return;

  const cards = [...grid.querySelectorAll('.realisation-card')];
  const pills = [...bar.querySelectorAll('.filter-pill')];
  const countEl = $('realisations-count');
  const emptyEl = $('realisations-empty');
  const resetBtn = $('realisations-reset');
  const state = { type: 'all', status: 'all' };

  function apply() {
    let visible = 0;
    cards.forEach(card => {
      const matchType = state.type === 'all' || card.dataset.type === state.type;
      const matchStatus = state.status === 'all' || card.dataset.status === state.status;
      const show = matchType && matchStatus;
      card.hidden = !show;
      if (show) {
        visible++;
        card.classList.add('visible');
      }
    });
    pills.forEach(pill => {
      const active = state[pill.dataset.filterGroup] === pill.dataset.filterValue;
      pill.classList.toggle('active', active);
      pill.setAttribute('aria-pressed', String(active));
    });
    if (countEl) countEl.textContent = `${visible} / ${cards.length}`;
    if (emptyEl) emptyEl.hidden = visible > 0;
  }

  bar.addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    const { filterGroup: group, filterValue: value } = pill.dataset;
    state[group] = state[group] === value && value !== 'all' ? 'all' : value;
    apply();
  });

  resetBtn?.addEventListener('click', () => {
    state.type = 'all';
    state.status = 'all';
    apply();
  });
}

// ─── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMatrix();
  initReveal();
  initSectionSpy();
  initTabHash();
  initModals();
  initRealisationFilters();
  initNewsArticles();
  initShots();
  initCode();
  initBackToTop();
});
