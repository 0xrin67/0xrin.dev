(function () {
  'use strict';

  var STORE_KEY = '0xrin_lang';

  var DICT = {
    en: {
      _title: '0xrin — developer',
      _desc: '0xrin — fullstack developer. Telegram bots, automation, AI/ML, Minecraft dev.',

      'nav.about': 'about',
      'nav.work': 'work',
      'nav.contact': 'contact',
      'nav.cta': '~/reach-me',

      'hero.tag1': 'open for offers',
      'hero.tag2': 'commissioned work',
      'hero.tagline': '<span class="hl">fullstack developer</span>.',
      'hero.viewWork': 'view work',
      'hero.contactBtn': 'contact',

      'hint.scroll': 'scroll',
      'hint.swipe': 'swipe',

      'about.title': 'about',
      'about.p1': 'I\'m <strong>0xrin</strong> — a fullstack developer with <span class="hl">3 years</span> of experience turning ideas into shipped code. I build <span class="hl">telegram bots</span> &amp; <span class="hl">mini apps</span>, work with <span class="hl">various databases</span>, write <span class="hl">parsers &amp; automation</span>, do <span class="hl">Minecraft</span> development (bots, mods, cheats) and <span class="hl">train neural networks</span> for real tasks.',
      'about.p2': 'I\'ve trained and deployed AI models for computer-vision tasks in real-time pipelines (YOLO object detection + aimbot, fully self-built &amp; working). Solid <span class="hl">DevOps</span> foundation and comfortable on <span class="hl">Linux</span>. Currently going deeper on Rust and shipping personal projects.',

      'stat.projects': '// projects shipped',
      'stat.years': '// years coding',
      'stat.langs': '// active langs',

      'badge.learning': '(learning)',
      'badge.basics': '(basics)',

      'work.title': 'work',
      'work.sub': 'selected areas I work in',

      'proj.flagshipTag': 'FLAGSHIP',
      'proj.category': 'category',
      'proj.soon': 'soon',
      'proj.ai.desc': 'Self-trained YOLO neural network for real-time object detection, wired into an aimbot pipeline. Dataset labeling, training, inference, low-latency — all built from scratch.',
      'proj.bots.desc': 'Shops, broadcasts, payments, admin panels, FSM, inline modes. From simple utils to load-bearing bots with DBs & queues.',
      'proj.miniapps.desc': 'Web apps that live inside Telegram: custom JS frontend, theming, payments, auth. A SPA wired to a Python backend.',
      'proj.automation.desc': 'Data collection, anti-bot bypass, proxy rotation, export to any format. Schedulers, monitors, auto-reports.',
      'proj.ml.desc': 'Dataset prep, training & fine-tuning, deployment to inference. YOLO object detection, classification, custom tasks.',
      'proj.minecraft.desc': 'Bots, mods & cheats for Minecraft on Node.js & Java. From auto-farm bots to client-side mods and custom utilities.',
      'proj.next.desc': 'Your next pet or commercial project lands here. Swap this card in <code>index.html</code> for your own.',

      'contact.title': 'contact',
      'contact.sub': 'open to projects, ideas & collabs',
      'terminal.whoamiOut': '0xrin — fullstack developer · always shipping',
    },

    ru: {
      _title: '0xrin — разработчик',
      _desc: '0xrin — fullstack-разработчик. Телеграм-боты, автоматизация, AI/ML, разработка под Minecraft.',

      'nav.about': 'обо мне',
      'nav.work': 'работы',
      'nav.contact': 'контакты',
      'nav.cta': '~/связаться',

      'hero.tag1': 'открыт к заказам',
      'hero.tag2': 'любая работа',
      'hero.tagline': '<span class="hl">fullstack-разработчик</span>.',
      'hero.viewWork': 'смотреть проекты',
      'hero.contactBtn': 'контакты',

      'hint.scroll': 'скролл',
      'hint.swipe': 'свайп',

      'about.title': 'обо мне',
      'about.p1': 'Я <strong>0xrin</strong> — fullstack-разработчик с опытом <span class="hl">3 года</span>, превращаю идеи в готовый код. Делаю <span class="hl">телеграм-ботов</span> и <span class="hl">мини-приложения</span>, работаю с <span class="hl">разными базами данных</span>, пишу <span class="hl">парсеры и автоматизацию</span>, занимаюсь разработкой под <span class="hl">Minecraft</span> (боты, моды, читы) и <span class="hl">обучаю нейросети</span> под реальные задачи.',
      'about.p2': 'Обучал и разворачивал AI-модели для компьютерного зрения в real-time пайплайнах (YOLO-детекция объектов + aimbot, полностью собран с нуля). Уверенная база в <span class="hl">DevOps</span>, комфортно работаю в <span class="hl">Linux</span>. Сейчас углубляюсь в Rust и пилю свои проекты.',

      'stat.projects': '// проектов задеплоено',
      'stat.years': '// года в кодинге',
      'stat.langs': '// активных языков',

      'badge.learning': '(учу)',
      'badge.basics': '(база)',

      'work.title': 'проекты',
      'work.sub': 'области, в которых я работаю',

      'proj.flagshipTag': 'ФЛАГМАН',
      'proj.category': 'категория',
      'proj.soon': 'скоро',
      'proj.ai.desc': 'Своя YOLO-нейросеть для детекции объектов в реальном времени, встроенная в aimbot-пайплайн. Разметка датасета, обучение, инференс, низкая задержка — всё с нуля.',
      'proj.bots.desc': 'Магазины, рассылки, платежи, админ-панели, FSM, inline-режимы. От простых утилит до нагруженных ботов с большими БД.',
      'proj.miniapps.desc': 'Веб-приложения внутри Telegram: свой JS-фронтенд, темизация, платежи, авторизация и не только.',
      'proj.automation.desc': 'Сбор данных, обход анти-бот систем, ротация прокси, экспорт в любой формат. Планировщики, мониторы, авто-отчёты.',
      'proj.ml.desc': 'Подготовка датасета, обучение и дообучение, деплой в инференс. YOLO-детекция, классификация, кастомные задачи.',
      'proj.minecraft.desc': 'Боты, моды и читы для Minecraft на Node.js и Java. От авто-фарм ботов до клиентских модов и кастомных утилит.',

      'contact.title': 'контакты',
      'contact.sub': 'открыт к проектам, идеям и коллабам',
      'terminal.whoamiOut': '0xrin — fullstack-разработчик · всегда в деле',
    },
  };

  var DYNAMIC = {
    en: {
      typed: ['building bots', 'training AI', 'shipping code', 'mining minecraft', 'breaking limits'],
      memes: ['git push --force | pray', '0 bugs (that I know of)', 'built at 3am, deployed at 4'],
      noTrackTitle: 'no tracks',
      noTrackArtistEdit: 'edit tracks.json',
      noTrackArtistDrop: 'drop mp3 into /audio',
    },
    ru: {
      typed: ['пишу ботов', 'обучаю нейросети', 'пишу код', 'ломаю границы'],
      memes: ['0 багов (как я знаю)', 'собрано в 3 ночи, задеплоено в 4'],
      noTrackTitle: 'нет треков',
      noTrackArtistEdit: 'отредактируй tracks.json',
      noTrackArtistDrop: 'положи mp3 в /audio',
    },
  };

  var COMMON = {
    terminalCommands: [
      'git push origin main',
      'npm run dev',
      'node bot.js',
      'python main.py',
      'python train.py --epochs 100',
      'python -m http.server',
      'docker compose up -d',
      'cargo run --release',
      'neofetch',
      'ssh 0xrin@0xrin.dev',
      'echo "available · dm me"',
    ],
  };

  function detect() {
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (saved === 'ru' || saved === 'en') return saved;
    } catch (e) {}
    var langs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'en'];
    for (var i = 0; i < langs.length; i++) {
      var l = (langs[i] || '').toLowerCase();
      if (l.indexOf('ru') === 0) return 'ru';
      if (l.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }

  var current = detect();
  document.documentElement.lang = current;

  function apply(lang) {
    var d = DICT[lang] || DICT.en;
    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-i18n');
      var val = (key in d) ? d[key] : DICT.en[key];
      if (val == null) continue;
      if (el.hasAttribute('data-i18n-html')) el.innerHTML = val;
      else el.textContent = val;
    }

    if (d._title) document.title = d._title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && d._desc) desc.setAttribute('content', d._desc);

    var btn = document.getElementById('langToggle');
    if (btn) {
      btn.textContent = lang === 'ru' ? 'EN' : 'RU';
      btn.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
    }
  }

  function setLang(lang) {
    if (lang !== 'ru' && lang !== 'en') return;
    current = lang;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    apply(lang);
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  window.I18N = {
    get lang() { return current; },
    t: function (key) {
      var d = DICT[current] || DICT.en;
      return (key in d) ? d[key] : (DICT.en[key] != null ? DICT.en[key] : key);
    },
    dyn: function (key) {
      var d = DYNAMIC[current] || DYNAMIC.en;
      return (key in d) ? d[key] : DYNAMIC.en[key];
    },
    common: function (key) { return COMMON[key]; },
    setLang: setLang,
    toggle: function () { setLang(current === 'ru' ? 'en' : 'ru'); },
  };

  function init() {
    apply(current);
    var btn = document.getElementById('langToggle');
    if (btn) btn.addEventListener('click', function () { window.I18N.toggle(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
