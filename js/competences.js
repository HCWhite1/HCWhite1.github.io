// ─── Compétences : niveau, note & activités (page d’accueil) ─
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

document.addEventListener('DOMContentLoaded', initSkillActivities);
