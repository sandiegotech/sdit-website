/* ================================================================
   SDIT — main.js
   Minimal, focused interactions
   ================================================================ */

(function () {

  /* ---- Nav: scroll shadow + background ---- */
  const nav = document.getElementById('nav');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 48);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init in case page loads scrolled

  /* ---- Mobile nav toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close mobile nav on any link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Open menu');
    });
  });

  /* ---- Smooth scroll for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Intersection Observer: scroll-in animations ---- */
  const animateEls = document.querySelectorAll('[data-animate]');

  if (animateEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animateEls.forEach(el => observer.observe(el));
  }

  /* ---- Stat number counter animation ---- */
  const statNums = document.querySelectorAll('.moment__stat-num');

  const animateStat = (el) => {
    const raw = el.textContent.trim();
    // Skip non-numeric values like "Now."
    if (!/[\d,]+/.test(raw)) return;

    const isPercent = raw.includes('%');
    const numStr = raw.replace(/[^0-9.]/g, '');
    const target = parseFloat(numStr);
    if (isNaN(target)) return;

    const suffix = isPercent ? '%' : (raw.includes(',') ? '' : '');
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (target >= 1000) {
        el.textContent = Math.round(current).toLocaleString() + (isPercent ? '%' : '');
      } else {
        el.textContent = current.toFixed(isPercent ? 1 : 0) + (isPercent ? '%' : '');
      }

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = raw; // restore original to avoid rounding drift
    };

    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => statObserver.observe(el));

})();
