// ============================================
// UPGRADE FEATURES - ADVANCED JAVASCRIPT
// ============================================

class UpgradeFeatures {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    this.initScrollProgress();
    this.highlightCurrentPage();
    this.initBackToTop();
    this.initDarkMode();
    this.initWhatsApp();
    this.initGoogleTranslate();
    this.initTestimonialsSlider();
    this.initBeforeAfterSlider();
    this.initScrollReveal();
    this.initCounterStats();
    this.initLightbox();
  }

  // ===== SCROLL PROGRESS =====
  initScrollProgress() {
    const existingBar = document.querySelector('.scroll-progress');
    const progressBar = existingBar || document.createElement('div');

    if (!existingBar) {
      progressBar.className = 'scroll-progress';
      document.body.appendChild(progressBar);
    }

    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  // ===== ACTIVE NAV LINK =====
  highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const page = href.split('#')[0];
      if (page === currentPage) {
        link.classList.add('active-link');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // ===== BACK TO TOP BUTTON =====
  initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.title = 'Back to Top';
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        button.classList.add('show');
      } else {
        button.classList.remove('show');
      }
    }, { passive: true });

    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== DARK MODE TOGGLE =====
  initDarkMode() {
    if (document.querySelector('.theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '🌙';
    toggle.title = 'Toggle Dark Mode';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(toggle);

    let savedTheme = 'auto';
    try {
      savedTheme = localStorage.getItem('theme') || 'auto';
    } catch (error) {
      savedTheme = 'auto';
    }

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === 'auto' && systemPrefersDark);
    document.body.classList.toggle('dark-mode', shouldUseDark);
    toggle.innerHTML = shouldUseDark ? '☀️' : '🌙';

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      toggle.innerHTML = isDark ? '☀️' : '🌙';

      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (error) {
        console.warn('Theme preference could not be saved.', error);
      }
    });
  }

  // ===== WHATSAPP BUTTON =====
  initWhatsApp() {
    const existingFloatingButton = document.querySelector('.whatsapp-btn, a[aria-label*="WhatsApp"][style*="position:fixed"]');
    if (existingFloatingButton) return;

    const button = document.createElement('a');
    button.className = 'whatsapp-btn';
    button.href = 'https://wa.me/919993035235?text=Hi%20Dolly%20Digital%20Studio%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services.';
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.title = 'Chat on WhatsApp';
    button.setAttribute('aria-label', 'Chat on WhatsApp');
    button.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i>';
    document.body.appendChild(button);

    const syncVisibility = () => {
      button.classList.toggle('show', window.pageYOffset > 180);
    };

    syncVisibility();
    window.addEventListener('scroll', syncVisibility, { passive: true });
  }

  // ===== GOOGLE TRANSLATE =====
  initGoogleTranslate() {
    if (document.querySelector('.translate-utility')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'translate-utility';
    wrapper.innerHTML = `
      <button class="translate-toggle" type="button" aria-expanded="false" aria-controls="translate-panel" title="Translate this page">
        <i class="fas fa-language" aria-hidden="true"></i>
      </button>
      <div class="translate-panel" id="translate-panel" hidden>
        <div class="translate-panel-head">
          <strong>Translate page</strong>
          <span>Powered by Google</span>
        </div>
        <div id="google_translate_element"></div>
        <p class="translate-panel-note">Load translation tools for Hindi and other languages when needed.</p>
      </div>
    `;
    document.body.appendChild(wrapper);

    const toggle = wrapper.querySelector('.translate-toggle');
    const panel = wrapper.querySelector('.translate-panel');
    const note = wrapper.querySelector('.translate-panel-note');
    let isScriptRequested = false;

    const closePanel = () => {
      panel.hidden = true;
      wrapper.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const loadTranslate = () => {
      if (window.google?.translate?.TranslateElement) {
        if (!document.querySelector('#google_translate_element select')) {
          window.googleTranslateElementInit();
        }
        return;
      }

      if (isScriptRequested) {
        return;
      }

      isScriptRequested = true;
      note.textContent = 'Loading translation tools...';

      window.googleTranslateElementInit = () => {
        try {
          if (window.google?.translate?.TranslateElement) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,hi,bn,gu,mr,pa,ta,te,ur,kn,ml',
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              },
              'google_translate_element'
            );
            note.textContent = 'Choose your preferred language below.';
          } else {
            note.textContent = 'Google Translate is not available right now. Please use your browser translation option.';
          }
        } catch (error) {
          console.error('Google Translate could not be initialized.', error);
          note.textContent = 'Google Translate is not available right now. Please use your browser translation option.';
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        note.textContent = 'Google Translate could not load. Please use your browser translation option.';
      };
      document.body.appendChild(script);
    };

    toggle.addEventListener('click', () => {
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      wrapper.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));

      if (willOpen) {
        loadTranslate();
      }
    });

    document.addEventListener('click', (event) => {
      if (!wrapper.contains(event.target)) {
        closePanel();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    });
  }

  // ===== TESTIMONIALS SLIDER =====
  initTestimonialsSlider() {
    const wrapper = document.querySelector('.testimonials-wrapper');
    if (!wrapper) return;

    const slider = document.querySelector('.testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    const controls = document.querySelector('.slider-controls');

    if (!slider || cards.length === 0) return;

    let currentIndex = 0;
    const moveSlide = (index) => {
      currentIndex = index % cards.length;
      const offset = -currentIndex * 100;
      slider.style.transform = `translateX(${offset}%)`;

      document.querySelectorAll('.slider-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === currentIndex);
      });
    };

    // Create controls
    if (!controls) {
      const newControls = document.createElement('div');
      newControls.className = 'slider-controls';
      wrapper.appendChild(newControls);

      for (let i = 0; i < cards.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'slider-btn' + (i === 0 ? ' active' : '');
        btn.innerHTML = i + 1;
        btn.addEventListener('click', () => moveSlide(i));
        newControls.appendChild(btn);
      }
    }

    // Auto-rotate every 5 seconds
    if (!this.prefersReducedMotion && cards.length > 1) {
      setInterval(() => {
        moveSlide((currentIndex + 1) % cards.length);
      }, 5000);
    }
  }

  // ===== BEFORE/AFTER SLIDER =====
  initBeforeAfterSlider() {
    const sliders = document.querySelectorAll('.before-after-slider');
    sliders.forEach(slider => {
      const container = slider.querySelector('.ba-container');
      const afterImg = slider.querySelector('.ba-img.after');
      const sliderLine = slider.querySelector('.ba-slider');

      if (!container || !afterImg || !sliderLine) return;

      let isActive = false;

      const updateSlider = (e) => {
        if (!isActive) return;

        const rect = container.getBoundingClientRect();
        let x = e.clientX - rect.left;

        // Touch support
        if (e.touches) {
          x = e.touches[0].clientX - rect.left;
        }

        x = Math.max(0, Math.min(x, rect.width));

        const percentage = (x / rect.width) * 100;
        afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        sliderLine.style.left = percentage + '%';
      };

      sliderLine.addEventListener('mousedown', () => isActive = true);
      sliderLine.addEventListener('touchstart', () => isActive = true);
      document.addEventListener('mouseup', () => isActive = false);
      document.addEventListener('touchend', () => isActive = false);
      document.addEventListener('mousemove', updateSlider);
      document.addEventListener('touchmove', updateSlider);
    });
  }

  // ===== SCROLL REVEAL ANIMATION =====
  initScrollReveal() {
    const reveals = document.querySelectorAll('.service-card, .feature-item, .stat-card, .award-card, .promise-card, .info-card-item, .faq-item, .gallery-item, .package-card, .process-card, .about-stat-card, .mvv-card, .service-visual-card, .shop-detail-item');

    if (!reveals.length) return;

    if (this.prefersReducedMotion) {
      reveals.forEach((reveal) => {
        reveal.classList.add('scroll-reveal', 'active');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal');
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -80px 0px'
    });

    reveals.forEach(reveal => {
      reveal.classList.add('scroll-reveal');
      observer.observe(reveal);
    });
  }

  // ===== COUNTER ANIMATION =====
  initCounterStats() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (counter) => {
      const target = Number(counter.dataset.count || 0);
      const suffix = counter.dataset.suffix || '';

      if (this.prefersReducedMotion) {
        counter.textContent = `${target.toLocaleString()}${suffix}`;
        return;
      }

      const duration = 1400;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * easedProgress);
        counter.textContent = `${value.toLocaleString()}${suffix}`;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, statsObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.35
    });

    counters.forEach((counter) => observer.observe(counter));
  }

  // ===== IMAGE LIGHTBOX =====
  initLightbox() {
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close">✕</button>
        <img class="lightbox-img" src="" alt="Full size image">
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Add click handlers to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
        }
      });
    });

    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
      }
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new UpgradeFeatures();
  
  // Add upgrade CSS if not already linked
  if (!document.querySelector('link[href*="upgrades.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/upgrades.css';
    document.head.appendChild(link);
  }
});
