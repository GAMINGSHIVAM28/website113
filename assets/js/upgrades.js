// ============================================
// UPGRADE FEATURES - ADVANCED JAVASCRIPT
// ============================================

class UpgradeFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.initBackToTop();
    this.initDarkMode();
    this.initWhatsApp();
    this.initTestimonialsSlider();
    this.initBeforeAfterSlider();
    this.initScrollReveal();
    this.initLightbox();
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
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '🌙';
    toggle.title = 'Toggle Dark Mode';
    document.body.appendChild(toggle);

    // Check saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      toggle.innerHTML = '☀️';
    }

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      toggle.innerHTML = isDark ? '☀️' : '🌙';
    });
  }

  // ===== WHATSAPP BUTTON =====
  initWhatsApp() {
    const button = document.createElement('a');
    button.className = 'whatsapp-btn show';
    button.href = 'https://wa.me/919993035235?text=Hi%20Shivam!%20I%20would%20like%20to%20inquire%20about%20your%20photography%20services.';
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.title = 'Chat on WhatsApp';
    button.innerHTML = '💬';
    document.body.appendChild(button);

    // Show after scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        button.classList.add('show');
      }
    }, { passive: true });
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
    setInterval(() => {
      moveSlide((currentIndex + 1) % cards.length);
    }, 5000);
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
    const reveals = document.querySelectorAll('.service-card, .feature-item, .stat-card, .award-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal');
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    reveals.forEach(reveal => {
      reveal.classList.add('scroll-reveal');
      observer.observe(reveal);
    });
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
