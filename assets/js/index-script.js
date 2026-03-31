// ============================================
// INDEX PAGE - ENHANCED JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.classList.toggle('menu-open', isActive);
    });

    navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (event) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = href && href !== '#' ? document.querySelector(href) : null;

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const revealTargets = document.querySelectorAll('.service-card, .feature-item, .testimonial-card, .trust-item, .showcase-card, .experience-card');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((element) => element.classList.add('reveal-up'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -70px 0px'
    });

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

  const counterElements = document.querySelectorAll('[data-count]');
  const animateCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    const formatter = new Intl.NumberFormat('en-IN');
    const duration = 1400;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = `${formatter.format(value)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = `${formatter.format(target)}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if (!prefersReducedMotion && counterElements.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });

    counterElements.forEach((counter) => counterObserver.observe(counter));
  } else {
    counterElements.forEach((counter) => {
      counter.textContent = `${new Intl.NumberFormat('en-IN').format(Number(counter.dataset.count || 0))}${counter.dataset.suffix || ''}`;
    });
  }

  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-img');

  if (!prefersReducedMotion && hero && heroImage) {
    let scrollOffset = 0;

    const applyHeroTransform = (rotateX = 0, rotateY = 0) => {
      heroImage.style.transform = `translateY(${scrollOffset}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener('scroll', () => {
      scrollOffset = Math.min(window.scrollY * 0.08, 18);
      applyHeroTransform();
    }, { passive: true });

    hero.addEventListener('mousemove', (event) => {
      const rect = hero.getBoundingClientRect();
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
      applyHeroTransform(rotateX, rotateY);
    });

    hero.addEventListener('mouseleave', () => applyHeroTransform());
  }

  const style = document.createElement('style');
  style.textContent = `
    .reveal-up {
      opacity: 0;
      transform: translateY(26px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }

    .reveal-up.is-visible,
    .is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(8px, 8px);
      transition: transform 0.3s ease;
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
      transition: transform 0.3s ease;
    }
  `;

  document.head.appendChild(style);
});
