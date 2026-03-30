// ============================================
// ABOUT PAGE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Close mobile menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  // Enhanced Intersection Observer with staggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  let elementIndex = 0;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = (elementIndex % 3) * 120;
        entry.target.style.animationDelay = delay + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
      elementIndex++;
    });
  }, observerOptions);

  // Observe elements for animation with hover effects
  const observableElements = document.querySelectorAll(
    '.mvv-card, .skill-category, .award-card'
  );
  observableElements.forEach(element => {
    observer.observe(element);
    // Add hover effects
    element.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
      this.style.transform = 'translateY(-5px)';
    });
    element.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
      this.style.transform = 'translateY(0)';
    });
  });

  // Add enhanced animations and styles
  const style = document.createElement('style');
  style.textContent = `
    .visible {
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

    .mvv-card, .skill-category, .award-card {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(8px, 8px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  `;
  document.head.appendChild(style);

  // Smooth scroll for anchor links
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
});
