// ─── Compétences : niveau, note & activités (page d'accueil) ─
const LEVELS = [
  { id: 'notions',  label: 'Notions',  desc: "J'ai découvert, je connais les bases" },
  { id: 'debutant', label: 'Débutant', desc: "J'ai pratiqué sur quelques exercices ou petits projets" },
  { id: 'autonome', label: 'Autonome', desc: "Je m'en sers seul sur un projet, en cherchant dans la doc" },
  { id: 'avance',   label: 'Avancé',   desc: 'Je le maîtrise bien, je peux aider les autres' },
  { id: 'expert',   label: 'Expert',   desc: 'Référence, usage pro poussé' },
];

const SKILL_NOTES = {
  'claude-code': 'Modèle : <strong>Opus 5.5 Orchestrator Sonnet 5.5</strong>',
  'antigravity': 'Modèle : <strong>Gemini 4 Neon Orchestrator Gemini 4 Hydrogen</strong>',
  'opencode':    'Agent de code en ligne de commande multi-modèles',
  't3-code':     'Interface graphique pour agents de code (Claude Code, Codex…)',
};

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
  octagames: {
    label: 'OctaGames — Plateforme de jeux temps réel', type: 'perso', period: '2025 — en cours',
    codes: 'B1.3 · B1.4 · B1.5 · B1.6',
    usage: {
      default:    'Plateforme de 10 jeux multijoueurs temps réel (Node.js, Socket.io, MongoDB Atlas, Cloudflare & R2)',
      javascript: '10 jeux Canvas 2D / Web Audio, client socket.io et serveur Node.js',
      'node-js':  'Serveur Express + Socket.io hébergé sur Render, persistance par lots vers MongoDB Atlas',
      'html-css': 'Interfaces multi-jeux, lobby, profils et mode camouflage iframe',
      git:        'Versionnage du projet et workflow CI/CD',
      github:     'Dépôt privé, CI lint/audit et sauvegarde hebdomadaire d’Atlas via Actions',
    },
    href: 'realisations.html#octagames',
  },
  servym: {
    label: 'Servym — Gestionnaire de services', type: 'perso', period: '2026 — en cours',
    codes: 'B1.4 · B1.5 · B1.6',
    usage: {
      default:       'Gestionnaire de services desktop & web déployable (Rust / Tauri 2 / Axum)',
      'claude-code': 'Développement assisté par agent IA (Opus 5.5 Orchestrator Sonnet 5.5)',
      antigravity:   'Orchestration agentique et édition assistée (Gemini 4 Neon Orchestrator Gemini 4 Hydrogen)',
    },
    href: 'realisations.html#servym',
  },
  candym: {
    label: 'Candym — Suivi de candidatures', type: 'perso', period: '2026 — en cours',
    codes: 'B1.4 · B1.5 · B1.6',
    usage: {
      default:       'CRM local Node.js (Express 5) / SQLite : Kanban, relances, suivi IMAP et envoi SMTP',
      'claude-code': 'Développement assisté par agent IA (Opus 5.5 Orchestrator Sonnet 5.5)',
      antigravity:   'Orchestration agentique et édition assistée (Gemini 4 Neon Orchestrator Gemini 4 Hydrogen)',
    },
    href: 'realisations.html#candym',
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
    label: 'Application Erasmove', type: 'formation',
    usage: {
      default: 'Application de bureau .NET MAUI de gestion de voyages Erasmus',
      csharp:  'Application de bureau MAUI en MVVM, projet en équipe',
    },
    href: 'https://github.com/wiizzl/erasmove',
  },
  'exercices-csharp':   { label: 'Exercices en cours de formation', type: 'formation', usage: 'Nombreux exercices C# au cours du BTS' },
  'scripts-discord':    { label: 'Scripts API Discord', type: 'perso', usage: 'Scripts automatisés via l’API Discord' },
  bogue:                { label: 'Application Web PHP "Bogue"', type: 'formation', usage: 'Projet Scolaire Dockerisé', href: 'https://github.com/wiizzl/bogue' },
  'bogue-trello':       { label: 'Projet Scolaire « Bogue »', type: 'formation', usage: 'Utilisation de l’API Trello', href: 'https://github.com/wiizzl/bogue' },
  'scripts-powershell': { label: 'Scripts Autostart & Restart server', type: 'perso', usage: 'Add/Remove Autostart, Restart server' },
  'tp-powershell':      { label: 'TP', type: 'formation', usage: 'Activités PowerShell' },
  'tp-symfony':         { label: 'TP Symfony', type: 'formation' },
  fedora:               { label: 'Utilisation personelle', type: 'perso', usage: 'Dual Boot sur mon PC', href: 'https://fedoraproject.org/fr/kde/download/' },
  kali:                 { label: 'TP', type: 'formation', usage: 'Installation en VM et utilisation de John the Ripper', href: 'https://www.kali.org/' },
  ubuntu:               { label: 'TP', type: 'formation', usage: 'Installation en VM et utilisation de commandes', href: 'https://www.ubuntu-fr.org/' },
  debian:               { label: 'TP', type: 'formation', usage: 'Installation en VM et utilisation de commandes', href: 'https://www.debian.org/index.fr.html' },
  'algo-maths':         { label: 'Cours d’algorithmique en mathématiques', type: 'formation' },
  synthese:             { label: 'Tableau de synthèse E5', type: 'formation', usage: 'Synthèse des réalisations professionnelles', href: 'rectorat.html' },
  'certif-anssi':       { label: 'MOOC SecNumAcadémie — ANSSI', type: 'certif', usage: 'Attestation de suivi du MOOC', href: '#diplomes' },
  'certif-rgpd':        { label: 'Attestation RGPD', type: 'certif', usage: 'Les 6 Modules de formation aux principes du RGPD.', href: '#diplomes' },
};

const ACTIVITY_TYPES = { stage: 'Stage', formation: 'Formation', perso: 'Perso', certif: 'Certif' };

function buildPopover(slug, levelIdx, note, list) {
  const level = LEVELS[levelIdx];
  const usageFor = a => typeof a.usage === 'string' ? a.usage : (a.usage?.[slug] ?? a.usage?.default);

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
      const ext = /^https?:\/\//.test(a.href ?? '');
      const tag = a.href ? 'a' : 'div';
      const attrs = !a.href ? ' is-static"'
        : `${ext ? ' is-external' : ''}" href="${a.href}"${ext ? ' target="_blank" rel="noopener"' : ''}`;
      const meta = [a.codes, a.period].filter(Boolean).join(' · ');
      const usage = usageFor(a);
      return `
      <${tag} class="skill-popover-item${attrs}>
        <span class="skill-popover-item-head">
          <span class="skill-popover-label">${a.label}</span>
          <span class="skill-popover-type type-${a.type}">${ACTIVITY_TYPES[a.type] ?? a.type}</span>
        </span>
        ${usage ? `<span class="skill-popover-usage">${usage}</span>` : ''}
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
  return pop;
}

function initSkillActivities() {
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;

  document.querySelectorAll('.skill-chip[data-activities], .skill-chip[data-level]').forEach(chip => {
    const list = (chip.dataset.activities ?? '').split(',').map(id => ACTIVITIES[id.trim()]).filter(Boolean);
    const levelIdx = LEVELS.findIndex(l => l.id === chip.dataset.level);
    const slug = chip.textContent.trim().replace(/#/g, 'sharp').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const note = SKILL_NOTES[slug];
    if (!list.length && levelIdx < 0 && !note) return;

    chip.classList.add('has-activities');
    chip.tabIndex = 0;

    if (levelIdx >= 0) {
      const mini = document.createElement('span');
      mini.className = 'skill-chip-meter';
      mini.setAttribute('aria-hidden', 'true');
      mini.innerHTML = LEVELS.map((_, i) => `<i${i <= levelIdx ? ' class="on"' : ''}></i>`).join('');
      chip.appendChild(mini);
    }

    let pop = null;
    const place = () => {
      if (!pop) {
        pop = buildPopover(slug, levelIdx, note, list);
        chip.appendChild(pop);
      }
      const r = chip.getBoundingClientRect();
      chip.classList.toggle('pop-right', r.left + pop.offsetWidth > window.innerWidth - 16);
      chip.classList.toggle('pop-below', r.top - pop.offsetHeight - 12 < navH);
    };
    chip.addEventListener('mouseenter', place);
    chip.addEventListener('focusin', place);
  });
}

document.addEventListener('DOMContentLoaded', initSkillActivities);
