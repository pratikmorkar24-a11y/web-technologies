// ============================================================
// Inkwell — Global UI behaviour (nav, scroll reveal, header)
// ============================================================
(function () {
  // ---- Mobile nav toggle ----
  const hamburger = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  // ---- Sticky header shadow on scroll ----
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 12) {
        header.style.boxShadow = '0 12px 30px -18px rgba(0,0,0,0.7)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // ---- Scroll reveal animations ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ---- Auto-dismiss flash messages ----
  const flashStack = document.getElementById('flashStack');
  if (flashStack) {
    setTimeout(() => { flashStack.remove(); }, 5200);
  }
})();
