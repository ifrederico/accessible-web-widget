(function () {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;

  var navToggle = navbar.querySelector('.nav-toggle');
  var navLinks = navbar.querySelector('.nav-links');
  if (!navToggle || !navLinks) return;

  function closeMenu() {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function toggleMenu() {
    var shouldOpen = !navLinks.classList.contains('is-open');
    navLinks.classList.toggle('is-open', shouldOpen);
    navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', shouldOpen);
  }

  navToggle.addEventListener('click', function (event) {
    event.preventDefault();
    toggleMenu();
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (event) {
    if (!navLinks.classList.contains('is-open')) return;
    if (navbar.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) {
      closeMenu();
    }
  });
})();
