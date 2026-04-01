// ============================================
// GLOBAL CONFIG LOADER - Loads business details from JSON
// Auto-updates entire website on config change
// ============================================

let CONFIG = null;

async function loadConfig() {
  try {
    const response = await fetch('assets/config/business-config.json');
    if (!response.ok) throw new Error('Config not found');
    CONFIG = await response.json();
    applyConfigToDOM();
    return CONFIG;
  } catch (error) {
    console.error('Failed to load config:', error);
    // Fallback defaults
    CONFIG = {
      business: {
        name: 'Dolly Digital Studio',
        email: 'shivamdwivedi280708@gmail.com',
        phone: '+91 99930 35235',
        whatsapp: '+919993035235',
        address: '4 Bindayal Colony Rd, Bilaspur, Chhattisgarh',
        location_lat: '21.8000',
        location_lng: '81.6300'
      },
      emailjs: {
        publicKey: 'user_aelzppxFfJ14icf5H',
        serviceId: 'service_bgsr254',
        templateIds: {
          photographer: 'template_dhyupld',
          userReply: 'template_lpam2tb'
        }
      },
      social: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        youtube: 'https://youtube.com'
      }
    };
    applyConfigToDOM();
    return CONFIG;
  }
}

function applyConfigToDOM() {
  if (!CONFIG) return;

  // Update ALL footer variants (home, contact, services, portfolio, about)
  const pageVariants = ['', '-home', '-contact', '-services', '-portfolio', '-about'];
  
  pageVariants.forEach(variant => {
    const footerPhone = document.getElementById(`footer-phone${variant}`);
    if (footerPhone) {
      footerPhone.textContent = CONFIG.business.phone;
      footerPhone.href = `tel:${CONFIG.business.phone.replace(/\s/g, '')}`;
    }

    const footerEmail = document.getElementById(`footer-email${variant}`);
    if (footerEmail) {
      footerEmail.textContent = CONFIG.business.email;
      footerEmail.href = `mailto:${CONFIG.business.email}`;
    }

    const footerAddress = document.getElementById(`footer-address${variant}`);
    if (footerAddress) footerAddress.textContent = CONFIG.business.address;

    const studioPhone = document.getElementById(`studio-phone${variant}`);
    if (studioPhone) {
      studioPhone.textContent = CONFIG.business.phone;
      studioPhone.href = `tel:${CONFIG.business.phone.replace(/\s/g, '')}`;
    }

    const studioEmail = document.getElementById(`studio-email${variant}`);
    if (studioEmail) {
      studioEmail.textContent = CONFIG.business.email;
      studioEmail.href = `mailto:${CONFIG.business.email}`;
    }

    const studioEmail2 = document.getElementById(`studio-email2${variant}`);
    if (studioEmail2) {
      studioEmail2.href = `mailto:${CONFIG.business.email}`;
    }
  });

  // Update social media links
  updateSocialLink('instagram', CONFIG.social.instagram);
  updateSocialLink('facebook', CONFIG.social.facebook);
  updateSocialLink('youtube', CONFIG.social.youtube);

  // Update WhatsApp links
  const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
  whatsappLinks.forEach(link => {
    const message = link.getAttribute('data-message') || 'Hi, I am interested in your photography services.';
    link.href = `https://wa.me/${CONFIG.business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  });

  // Update business name in header/footer
  const businessNameElements = document.querySelectorAll('[data-business-name]');
  businessNameElements.forEach(el => {
    el.textContent = CONFIG.business.name;
  });

  // Update contact page photographer email label
  const contactPhotographerEmail = document.getElementById('contact-photographer-email');
  if (contactPhotographerEmail) {
    contactPhotographerEmail.textContent = `Send inquiries to: ${CONFIG.business.email}`;
  }
}

function updateSocialLink(platform, url) {
  const link = document.querySelector(`[data-social="${platform}"]`);
  if (link && url) {
    link.href = url;
    link.rel = 'noopener';
  }
}

// Load config on page load
document.addEventListener('DOMContentLoaded', loadConfig);

// If called before DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadConfig);
} else {
  loadConfig();
}
