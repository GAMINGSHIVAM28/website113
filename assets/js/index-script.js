// ============================================
// INDEX PAGE - ENHANCED JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', function() {
      const isActive = navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.classList.toggle('menu-open', isActive);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(event) {
      if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  // Smooth scroll for navigation links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced Intersection Observer with staggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  let elementIndex = 0;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = (elementIndex % 3) * 100;
        entry.target.style.animationDelay = delay + 'ms';
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
      elementIndex++;
    });
  }, observerOptions);

  // Observe all service cards and feature items
  const observableElements = document.querySelectorAll('.service-card, .feature-item, .testimonial-card');
  observableElements.forEach(element => {
    observer.observe(element);
  });

  // Parallax effect for hero section
  const hero = document.querySelector('.hero-section');
  if (hero) {
    window.addEventListener('scroll', debounce(() => {
      const scrollY = window.scrollY;
      hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }, 10), { passive: true });
  }

  // Mouse hover effects for cards
  document.querySelectorAll('.service-card, .feature-item, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});

// Add enhanced animations to CSS
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    animation: fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
    50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
  }

  .service-card, .feature-item, .testimonial-card {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease !important;
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

  /* Smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }
`;
document.head.appendChild(style);
