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

// ─── Tabs (Rectorat, Stages) ────────────────────
function initTabs() {
  const activate = target => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === target));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === target));
  };
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.tab));
  });

  // Lien vers un élément dans un onglet (ex : stages.html#stage1-annuaire)
  const el = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  const pane = el?.closest('.tab-pane');
  if (pane) {
    activate(pane.id);
    requestAnimationFrame(() => el.scrollIntoView());
  }
}

// ─── Modal (Réalisations) ───────────────────────
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  function open(id) {
    const data = window.REALISATIONS?.[id];
    if (!data) return;
    populateModal(data);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.modal));
  });

  // Ouverture directe via realisations.html#<id> (liens depuis l'accueil)
  const openFromHash = () => open(decodeURIComponent(location.hash.slice(1)));
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }
  overlay.querySelector('#modal-close-btn')?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  const detailsBtn   = document.getElementById('modal-details-btn');
  const detailsPanel = document.getElementById('modal-details-panel');
  detailsBtn?.addEventListener('click', () => {
    const isHidden = detailsPanel.hidden;
    detailsPanel.hidden = !isHidden;
    detailsBtn.classList.toggle('open', isHidden);
    detailsBtn.textContent = isHidden ? '▾ Masquer les détails' : '▸ Détails';
  });
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

  // Details panel — reset & populate
  const detailsBtn   = document.getElementById('modal-details-btn');
  const detailsPanel = document.getElementById('modal-details-panel');
  if (detailsPanel) {
    detailsPanel.hidden = true;
    if (detailsBtn) { detailsBtn.classList.remove('open'); detailsBtn.textContent = '▸ Détails'; }
    detailsPanel.innerHTML = (d.details ?? []).map(c => `
      <div class="details-comp-block">
        <div class="details-comp-header">
          <span class="details-comp-code">${c.code}</span>
          <span class="details-comp-label">${c.label}</span>
        </div>
        <p class="details-comp-sub">▸ ${c.sub ?? ''}</p>
        ${c.points && c.points.length
          ? `<ul class="details-points">${c.points.map(p => `<li>${p}</li>`).join('')}</ul>`
          : '<p class="details-empty">—</p>'}
      </div>`).join('');
  }
}

// ─── Compétences → niveau, note & activités (Accueil) ─
// Sur une puce (les deux attributs sont optionnels) :
// <span class="skill-chip" data-level="autonome" data-activities="annuaire,portfolio">
// Texte personnalisé : SKILL_NOTES ci-dessous, clé = slug de la puce
// Description des niveaux : affichée en infobulle au survol de la barre
const LEVELS = [
  { id: 'notions',  label: 'Notions',  desc: "J'ai découvert, je connais les bases" },
  { id: 'debutant', label: 'Débutant', desc: "J'ai pratiqué sur quelques exercices ou petits projets" },
  { id: 'autonome', label: 'Autonome', desc: "Je m'en sers seul sur un projet, en cherchant dans la doc" },
  { id: 'avance',   label: 'Avancé',   desc: 'Je le maîtrise bien, je peux aider les autres' },
  { id: 'expert',   label: 'Expert',   desc: 'Référence, usage pro poussé' },
];

// Texte personnalisé affiché sous la barre de niveau (vide = rien d'affiché).
// Le HTML simple est accepté (<strong>, <em>…).
// Clé = slug de la puce : nom en minuscules, sans accents, « # » → « sharp »,
// le reste des caractères spéciaux → « - » (visible dans l'en-tête ~/competences/<slug>)
const SKILL_NOTES = {
  // Langages & Web
  'csharp':            '',
  'python':            '',
  'php':               '',
  'javascript':        '',
  'node-js':           '',
  'html-css':          '',
  'powershell':        '',
  // Frameworks
  'symfony':           '',
  'net':               '',
  'twig':              '',
  'bootstrap':         '',
  // Bases de données
  'langage-sql':       '',
  'mysql':             '',
  'phpmyadmin':        '',
  'sql-server':        '',
  'ssms':              '',
  'dbeaver':           '',
  // Versioning
  'git':               '',
  'github':            '',
  // IDEs & Éditeurs
  'vs-code':           '',
  'jetbrains-rider':   '',
  'visual-studio':     '',
  'android-studio':    '',
  'sublime-text':      '',
  // Virtualisation & Infra
  'virtualbox':        '',
  'vmware':            '',
  'docker':            '',
  'wampserver':        '',
  // Linux
  'fedora':            '',
  'kali-linux':        '',
  'ubuntu':            '',
  'debian':            '',
  // Outils ITSM
  'glpi':              '',
  // Cybersécurité
  'rgpd':              '',
  'anssi-mooc':        '',
  'root-me':           '',
  'cryptologie':       '',
  // Suite Office
  'word':              '',
  'excel':             '',
  'powerpoint':        '',
  'outlook':           '',
  'teams':             '',
  // Langues
  'francais-natif':    '',
  'anglais-b2-c1':     '',
  // Soft Skills
  'travail-en-equipe': '',
  'autonomie':         '',
};

// type  : 'stage' | 'formation' | 'perso' | 'certif'
// usage : ce que la compétence a servi à faire — texte unique, ou objet
//         { default: '…', <slug de la puce>: '…' } pour préciser selon la puce
//         (slug = nom de la puce en minuscules, ex : 'javascript', 'html-css', 'langage-sql')
const ACTIVITIES = {
  annuaire: {
    label: 'Site Annuaire interne — SNA', type: 'stage', period: '2025',
    codes: 'B1.3 · B1.4 · B1.5',
    usage: {
      default:       'Annuaire web multi-entités (SNA, Vernon, CIAS, OTC, CCAS)',
      javascript:    'Recherche & filtres, mode sombre persistant',
      php:           'Authentification, CRUD complet, sessions, logs',
      'html-css':    'Interface de consultation, mode sombre',
      'langage-sql': 'Base agents / services / pôles / directions',
      mysql:         'Base agents / services / pôles, import CSV en masse',
      wampserver:    'Déploiement sur le serveur interne de la DNI',
      autonomie:     'Pivot technique décidé seul : WordPress → PHP/MySQL custom',
    },
    href: 'realisations.html#annuaire',
  },
  'annuaire-v2': {
    label: 'Site Annuaire interne — v2', type: 'stage', period: '2026',
    codes: 'B1.3 · B1.4 · B1.5',
    usage: 'Import XLSX, export Excel, mots-clés de recherche, logs consultables',
    href: 'stages.html#stage2-annuaire',
  },
  stocks: {
    label: 'Gestion des stocks — DNI', type: 'stage', period: '2026',
    codes: 'B1.3 · B1.4 · B1.5 · B1.6',
    usage: {
      default:       'Outil web de gestion des stocks et commandes',
      javascript:    'Application complète côté serveur avec Node.js / Express',
      'node-js':     'Back-end Express : alertes de seuil, commandes automatiques',
      bootstrap:     'Interface : tableau de bord, stocks, commandes',
      'langage-sql': 'Stocks par site, suivi des commandes (7 statuts)',
      mysql:         'Stocks par site, suivi des commandes (7 statuts)',
      autonomie:     'Choix volontaire de technologies nouvelles (Node.js / Express)',
    },
    href: 'stages.html#stage2-stocks',
  },
  support: {
    label: 'Missions support — DNI', type: 'stage', period: '2025',
    codes: 'B1.1 · B1.2',
    usage: {
      default:             'Postes Windows 11, inventaire du parc, tickets GLPI',
      glpi:                'Résolution de tickets de support utilisateurs',
      'travail-en-equipe': 'Réunions hebdomadaires support (lundi) et DNI (vendredi)',
    },
    href: 'stages.html#stage1-support',
  },
  glpi: {
    label: "Gestion d'incidents sous GLPI — SNA", type: 'stage', period: '2025',
    codes: 'B1.1 · B1.2',
    usage: 'Tickets quotidiens, mise à jour de l’inventaire du parc',
    href: 'realisations.html#glpi',
  },
  cybernews: {
    label: 'Site CyberNews', type: 'formation', period: '2024 — 2025',
    codes: 'B1.3 · B1.5',
    usage: "Site d'actualité cyber, 2 articles publiés par mois",
    href: 'realisations.html#cybernews',
  },
  tpsql: {
    label: 'TP SQL', type: 'formation', period: '2025',
    codes: 'B1.1 · B1.2 · B1.5',
    usage: 'Manipulation et requêtage de bases relationnelles',
    href: 'realisations.html#tpsql',
  },
  portfolio: {
    label: 'Portfolio BTS SIO', type: 'perso', period: '2024 — en cours',
    codes: 'B1.6',
    usage: {
      default:    'Site vitrine HTML / CSS / JS, hébergé sur GitHub Pages',
      javascript: 'Animation canvas, modales, révélation au scroll',
      'html-css': 'Design responsive, thème sombre, sans framework',
      git:        'Versionnage du code source',
      github:     'Dépôt public et déploiement via GitHub Pages',
    },
    href: 'realisations.html#portfolio',
  },
  erasmove: {
    label: 'Application Erasmove', type: 'formation', period: '',
    codes: '',
    usage: {
      default: 'Application de bureau .NET MAUI de gestion de voyages Erasmus',
      csharp:  'Application de bureau MAUI en MVVM, projet en équipe',
    },
    href: 'https://github.com/wiizzl/erasmove',
  },
  'exercices-csharp': {
    label: 'Exercices en cours de formation', type: 'formation', period: '',
    codes: '',
    usage: 'Nombreux exercices C# au cours du BTS',
    href: '',
  },
  'scripts-discord': {
    label: 'Scripts API Discord', type: 'perso', period: '',
    codes: '',
    usage: 'Scripts automatisés via l’API Discord',
    href: '',
  },
  'bogue': {
    label: 'Application Web PHP "Bogue"', type: 'formation', period: '',
    codes: '',
    usage: 'Projet Scolaire Dockerisé',
    href: 'https://github.com/wiizzl/bogue', 
  },
  'bogue-trello': {
    label: 'Projet Scolaire « Bogue »', type: 'formation', period: '',
    codes: '',
    usage: 'Utilisation de l’API Trello',
    href: 'https://github.com/wiizzl/bogue', 
  },
  'scripts-powershell': {
    label: 'Scripts Autostart & Restart server', type: 'perso', period: '',
    codes: '',
    usage: 'Add/Remove Autostart, Restart server',
    href: '',
  },
  'tp-powershell': {
    label: 'TP', type: 'formation', period: '',
    codes: '',
    usage: 'Activités PowerShell',
    href: '',
  },
  'tp-symfony': {
    label: 'TP Symfony', type: 'formation', period: '',
    codes: '',
    usage: '',
    href: '',
  },
  'fedora': {
    label: 'Utilisation personelle', type: 'perso', period: '',
    codes: '',
    usage: 'Dual Boot sur mon PC',
    href: 'https://fedoraproject.org/fr/kde/download/',
  },
  'kali': {
    label: 'TP', type: 'formation', period: '',
    codes: '',
    usage: 'Installation en VM et utilisation de John the Ripper',
    href: 'https://www.kali.org/',
  },
  'ubuntu': {
    label: 'TP', type: 'formation', period: '',
    codes: '',
    usage: 'Installation en VM et utilisation de commandes',
    href: 'https://www.ubuntu-fr.org/',
  },
  'debian': {
    label: 'TP', type: 'formation', period: '',
    codes: '',
    usage: 'Installation en VM et utilisation de commandes',
    href: 'https://www.debian.org/index.fr.html',
  },

  'algo-maths': {
    label: 'Cours d’algorithmique en mathématiques', type: 'formation', period: '',
    codes: '',
    usage: '',
    href: '',
  },
  synthese: {
    label: 'Tableau de synthèse E5', type: 'formation', period: '',
    codes: '',
    usage: 'Synthèse des réalisations professionnelles',
    href: 'rectorat.html',
  },
  'certif-anssi': {
    label: 'MOOC SecNumAcadémie — ANSSI', type: 'certif', period: '',
    codes: '',
    usage: 'Attestation de suivi du MOOC',
    href: '#diplomes',
  },
  'certif-rgpd': {
    label: 'Attestation RGPD', type: 'certif', period: '',
    codes: '',
    usage: 'Les 6 Modules de formation aux principes du RGPD.',
    href: '#diplomes',
  },
};

const ACTIVITY_TYPES = { stage: 'Stage', formation: 'Formation', perso: 'Perso', certif: 'Certif' };

function initSkillActivities() {
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;

  document.querySelectorAll('.skill-chip[data-activities], .skill-chip[data-level]').forEach(chip => {
    const list = (chip.dataset.activities ?? '').split(',')
      .map(id => ACTIVITIES[id.trim()])
      .filter(Boolean);
    const levelIdx = LEVELS.findIndex(l => l.id === chip.dataset.level);
    const level = LEVELS[levelIdx];
    const name = chip.textContent.trim();
    const slug = name.replace(/#/g, 'sharp').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const usageFor = a => typeof a.usage === 'string' ? a.usage : (a.usage?.[slug] ?? a.usage?.default);
    const note = SKILL_NOTES[slug]?.trim();
    if (!list.length && !level && !note) return;

    chip.classList.add('has-activities');
    chip.tabIndex = 0;

    // Mini-jauge dans la puce : niveau lisible sans survol
    if (level) {
      const mini = document.createElement('span');
      mini.className = 'skill-chip-meter';
      mini.setAttribute('aria-hidden', 'true');
      mini.innerHTML = LEVELS.map((_, i) => `<i${i <= levelIdx ? ' class="on"' : ''}></i>`).join('');
      chip.appendChild(mini);
    }

    const levelHtml = (level || note) ? `
      <div class="skill-level">
        ${level ? `
        <div class="skill-popover-row">
          <span class="skill-popover-title">niveau</span>
          <span class="skill-level-score">${levelIdx + 1}/${LEVELS.length} · <b>${level.label}</b></span>
        </div>
        <div class="skill-level-scale" role="img" aria-label="Niveau ${levelIdx + 1} sur ${LEVELS.length} : ${level.label}, ${level.desc}">
          ${LEVELS.map((l, i) => `
            <span class="skill-level-step${i < levelIdx ? ' past' : ''}${i === levelIdx ? ' current' : ''}" title="${l.label} — ${l.desc}">
              <span class="skill-level-seg"></span>
              <span class="skill-level-lbl">${l.label}</span>
            </span>`).join('')}
        </div>` : ''}
        ${note ? `<p class="skill-note">${note}</p>` : ''}
      </div>` : '';

    const activitiesHtml = list.length ? `
      <div class="skill-popover-row">
        <span class="skill-popover-title">utilisé dans</span>
        <span class="skill-popover-count">${list.length} activité${list.length > 1 ? 's' : ''}</span>
      </div>
      ${list.map(a => {
        // href vide → ligne non cliquable ; http(s) → nouvel onglet
        const external = /^https?:\/\//.test(a.href ?? '');
        const tag = a.href ? 'a' : 'div';
        const attrs = !a.href ? ' is-static"'
          : `${external ? ' is-external' : ''}" href="${a.href}"${external ? ' target="_blank" rel="noopener"' : ''}`;
        const meta = [a.codes, a.period].filter(Boolean).join(' · ');
        return `
        <${tag} class="skill-popover-item${attrs}>
          <span class="skill-popover-item-head">
            <span class="skill-popover-label">${a.label}</span>
            <span class="skill-popover-type type-${a.type}">${ACTIVITY_TYPES[a.type] ?? a.type}</span>
          </span>
          ${usageFor(a) ? `<span class="skill-popover-usage">${usageFor(a)}</span>` : ''}
          ${meta ? `<span class="skill-popover-meta">${meta}</span>` : ''}
        </${tag}>`;
      }).join('')}` : '';

    const pop = document.createElement('div');
    pop.className = 'skill-popover';
    pop.innerHTML = `
      <div class="skill-popover-header">
        <span class="dots"><i></i><i></i><i></i></span>
        <span class="path">~/competences/<b>${slug}</b></span>
      </div>
      <div class="skill-popover-body">${levelHtml}${activitiesHtml}</div>`;
    chip.appendChild(pop);

    // Positionnement : à droite si ça déborde, en dessous si caché par la navbar
    const place = () => {
      const r = chip.getBoundingClientRect();
      chip.classList.toggle('pop-right', r.left + pop.offsetWidth > window.innerWidth - 16);
      chip.classList.toggle('pop-below', r.top - pop.offsetHeight - 12 < navH);
    };
    chip.addEventListener('mouseenter', place);
    chip.addEventListener('focusin', place);
  });
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

// ─── News (Veille) ─────────────────────────────
function initNewsArticles() {
  const items = Array.from(document.querySelectorAll('.news-item'));
  const overlay = document.getElementById('news-modal-overlay');
  if (!items.length || !overlay) return;

  const modal = {
    title: document.getElementById('news-modal-title'),
    summary: document.getElementById('news-modal-summary'),
    author: document.getElementById('news-modal-author'),
    bornage: document.getElementById('news-modal-bornage'),
    date: document.getElementById('news-modal-date'),
    pdf: document.getElementById('news-modal-pdf'),
    source: document.getElementById('news-modal-source')
  };

  const dateView = document.getElementById('news-date-view');
  const bornageView = document.getElementById('news-bornage-view');
  const sortBtns = Array.from(document.querySelectorAll('.news-sort-btn'));

  function formatDate(isoDate) {
    if (!isoDate) return '-';
    const [year, month, day] = isoDate.split('-');
    return year && month && day ? `${day}/${month}/${year}` : isoDate;
  }

  function openModal(item) {
    const title = item.querySelector('.news-title')?.textContent?.trim() || 'Article';
    const source = item.querySelector('.news-src')?.textContent?.trim() || '';
    const author = item.dataset.author || 'A définir';
    const bornage = item.dataset.bornage || 'A définir';
    const date = item.dataset.date || '';
    const pdf = item.dataset.pdf || '#';
    const url = item.dataset.url || '#';

    modal.title.textContent = title;
    modal.summary.textContent = item.dataset.summary || `${title} : point rapide ${bornage.toLowerCase()} via ${source}.`;
    modal.author.textContent = author;
    modal.bornage.textContent = bornage;
    modal.date.textContent = formatDate(date);
    modal.pdf.href = pdf;
    modal.source.href = url;
    modal.source.textContent = source ? `Source originale (${source})` : 'Source originale';

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderBornageView() {
    const cols = { CPU: [], GPU: [], Drivers: [] };
    items.forEach(item => {
      const bornage = item.dataset.bornage || 'CPU';
      if (cols[bornage]) cols[bornage].push(item);
    });

    Object.entries(cols).forEach(([key, list]) => {
      const container = bornageView.querySelector(`[data-bornage-col="${key}"] .news-bornage-list`);
      if (!container) return;
      container.innerHTML = '';
      list
        .sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''))
        .forEach(item => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'news-bornage-item';
          const title = item.querySelector('.news-title')?.textContent?.trim() || 'Article';
          const src = item.querySelector('.news-src')?.textContent?.trim() || '';
          const date = formatDate(item.dataset.date || '');
          btn.innerHTML = `<span class="news-title">${title}</span><span class="news-src">${src}</span><span class="news-date">${date}</span>`;
          btn.addEventListener('click', () => openModal(item));
          container.appendChild(btn);
        });
    });
  }

  items.forEach(item => item.addEventListener('click', e => {
    e.preventDefault();
    openModal(item);
  }));

  function switchView(mode) {
    sortBtns.forEach(b => b.classList.toggle('active', b.dataset.sort === mode));
    dateView.hidden = mode !== 'date';
    bornageView.hidden = mode !== 'bornage';
  }

  sortBtns.forEach(btn => btn.addEventListener('click', () => {
    switchView(btn.dataset.sort || 'date');
  }));

  overlay.querySelector('[data-news-close]')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => e.target === overlay && closeModal());
  document.addEventListener('keydown', e => e.key === 'Escape' && overlay.classList.contains('open') && closeModal());

  renderBornageView();
  switchView('date');
}

// ─── Init ───────────────────────────────────────

// ─── Visionneuse de captures (Stages) ───────────
function initShots() {
  const viewer = document.getElementById('shot-viewer');
  const buttons = document.querySelectorAll('.shot-btn');
  if (!viewer || !buttons.length) return;

  const img = viewer.querySelector('img');
  const cap = viewer.querySelector('figcaption');
  const closeBtn = viewer.querySelector('.shot-viewer-close');
  let lastFocus = null;

  function open(btn) {
    lastFocus = btn;
    img.src = btn.dataset.full;
    img.alt = btn.querySelector('img')?.alt ?? '';
    cap.textContent = btn.closest('.shot')?.querySelector('figcaption')?.textContent ?? '';
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    if (!viewer.classList.contains('open')) return;
    viewer.classList.remove('open');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    lastFocus?.focus();
  }

  buttons.forEach(btn => btn.addEventListener('click', () => open(btn)));
  closeBtn.addEventListener('click', close);
  viewer.addEventListener('click', e => { if (e.target === viewer) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}


// ─── Coloration des extraits de code (Stages) ───
function initCode() {
  const blocks = document.querySelectorAll('.code-drop code');
  if (!blocks.length) return;

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // 1 : commentaire   2 : chaîne   3 : mot-clé   4 : variable PHP
  const RE = /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|\b(async|await|const|let|var|function|return|if|else|new|null|true|false|die|empty|elseif)\b|(\$\w+)/g;

  blocks.forEach(code => {
    const src = code.textContent;
    let out = '', last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'v';
      out += '<span class="tok-' + cls + '">' + esc(m[0]) + '</span>';
      last = RE.lastIndex;
    }
    code.innerHTML = out + esc(src.slice(last));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMatrix();
  initTyping();
  initReveal();
  initNav();
  initTabs();
  initModals();
  initNewsArticles();
  initSkillActivities();
  initShots();
  initCode();
  initBackToTop();
});
