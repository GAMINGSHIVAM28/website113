// ============================================
// PORTFOLIO PAGE - ENHANCED JAVASCRIPT
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

  // Enhanced Gallery Filter with smooth animations
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      this.style.transform = 'scale(1.05)';
      setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);

      const filterValue = this.getAttribute('data-filter');

      galleryItems.forEach((item, index) => {
        if (filterValue === 'all') {
          item.style.animation = 'none';
          item.classList.remove('hidden');
          item.style.display = 'block';
          setTimeout(() => {
            item.style.animation = `galleryFadeIn 0.5s ease ${index * 50}ms forwards`;
          }, 10);
        } else {
          if (item.classList.contains(filterValue)) {
            item.style.animation = 'none';
            item.classList.remove('hidden');
            item.style.display = 'block';
            setTimeout(() => {
              item.style.animation = `galleryFadeIn 0.5s ease ${index * 50}ms forwards`;
            }, 10);
          } else {
            item.classList.add('hidden');
            item.style.animation = 'galleryFadeOut 0.3s ease forwards';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });

  // Enhanced Intersection Observer with delayed animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  let cardIndex = 0;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = (cardIndex % 4) * 100;
        entry.target.style.animationDelay = delay + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
      cardIndex++;
    });
  }, observerOptions);

  // Observe stat cards and add hover effects
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    observer.observe(card);
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add enhanced animations and styles
  const style = document.createElement('style');
  style.textContent = `
    .visible {
      animation: scaleInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
    }

    @keyframes scaleInUp {
      from {
        opacity: 0;
        transform: scale(0.85) translateY(30px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes galleryFadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes galleryFadeOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    .stat-card {
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease !important;
    }

    .gallery-item {
      transition: opacity 0.3s ease, transform 0.3s ease !important;
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

    .gallery-item.hidden {
      animation: fadeOut 0.3s ease forwards !important;
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `;
  document.head.appendChild(style);
});
