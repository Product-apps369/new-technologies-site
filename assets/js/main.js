/* ==========================================================================
   HERO SLIDER
   Автоматическая смена Hero-изображений + точки ручного переключения.
   Написан с защитой от ошибок: если разметка hero отсутствует на странице
   (например, эта же связка JS используется на другой странице без Hero),
   скрипт просто не активируется, а не бросает исключение.
   ========================================================================== */

(function initHeroSlider(){
  const shell = document.querySelector('.hero-shell');
  if (!shell) return; // на странице нет Hero — ничего не делаем

  const slides = Array.from(shell.querySelectorAll('.hero-slide'));
  const dots = Array.from(shell.querySelectorAll('.hero-dots button'));
  if (slides.length === 0) return;

  const AUTO_DELAY = 4500;
  let index = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
  if (index === -1) index = 0;
  let timer = null;

  function show(i){
    index = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
  }

  function next(){
    show(index + 1);
  }

  function startAuto(){
    stopAuto();
    if (slides.length > 1) {
      timer = setInterval(next, AUTO_DELAY);
    }
  }

  function stopAuto(){
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      startAuto(); // сброс таймера при ручном переключении
    });
  });

  // Пауза автопрокрутки при наведении — не влияет на верстку/высоту.
  shell.addEventListener('mouseenter', stopAuto);
  shell.addEventListener('mouseleave', startAuto);

  // Инициализация в исходное состояние на случай, если разметка
  // не содержит класс .active ни на одном слайде.
  show(index);
  startAuto();
})();
/* ==========================================================================
   NAVIGATION
   Общая логика шапки/навигации, переиспользуемая на всех страницах сайта.
   Сейчас: подсветка активного пункта меню при скролле по Главной и
   лёгкая тень у header при прокрутке. Всё — прогрессивное улучшение:
   при отсутствии нужных элементов на странице просто не активируется.
   ========================================================================== */

(function initHeaderScrollState(){
  const header = document.querySelector('header');
  if (!header) return;

  function onScroll(){
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

(function initActiveNavLink(){
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  if (navLinks.length === 0) return;

  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (sections.length === 0) return;

  function setActive(){
    let current = sections[0];
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(link => {
      const match = link.getAttribute('href') === '#' + current.id;
      link.classList.toggle('active', match);
    });
  }

  setActive();
  window.addEventListener('scroll', setActive, { passive: true });
})();

(function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  function closeNav(){
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function openNav(){
    nav.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    if (nav.classList.contains('nav-open')) closeNav(); else openNav();
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('nav-open')) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    closeNav();
  });
})();
/* ==========================================================================
   INTERACTIONS
   Мелкие, безопасные улучшения интерфейса, не влияющие на текущий
   утверждённый визуальный вид: автогод в футере и т.п.
   ========================================================================== */

(function setFooterYear(){
  const copyEl = document.querySelector('footer .copy');
  if (!copyEl) return;
  const currentYear = new Date().getFullYear();
  copyEl.innerHTML = copyEl.innerHTML.replace(/©\s*\d{4}/, '© ' + currentYear);
})();
