// ============================================
// PROFESSIONAL FORM HANDLER WITH ANIMATIONS
// ============================================

class FormHandler {
  constructor() {
    this.contactForm = document.getElementById('contactForm');
    this.successContainer = null;
    this.loadingSpinner = null;
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.createLoadingSpinner();
      this.createSuccessContainer();
      this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner-content">
        <div class="camera-shutter">
          <div class="shutter-blade"></div>
          <div class="shutter-blade"></div>
          <div class="shutter-blade"></div>
          <div class="shutter-blade"></div>
          <div class="shutter-blade"></div>
        </div>
        <p class="spinner-text">Sending Your Message...</p>
      </div>
    `;
    document.body.appendChild(spinner);
    this.loadingSpinner = spinner;
  }

  createSuccessContainer() {
    const container = document.createElement('div');
    container.className = 'success-container';
    container.innerHTML = `
      <div class="success-box">
        <div class="success-icon">✓</div>
        <h2 class="success-title">Thank You!</h2>
        <p class="success-message">Your message has been received with 5-star quality processing! 📸</p>
        <div class="success-details">
          <strong>What Happens Next?</strong>
          <p>✓ We've captured your inquiry</p>
          <p>✓ Our team is reviewing your details</p>
          <p>✓ You'll hear from us within 24 hours</p>
        </div>
        <div class="success-actions">
          <button class="success-btn btn-secondary-success" onclick="this.parentElement.parentElement.parentElement.classList.remove('show')">Back to Site</button>
          <a href="index.html" class="success-btn btn-primary-success">Home Page</a>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    this.successContainer = container;
  }

  showLoading() {
    this.loadingSpinner.classList.add('active');
  }

  hideLoading() {
    this.loadingSpinner.classList.remove('active');
  }

  showSuccess() {
    this.playShutterEffect();
    this.successContainer.classList.add('show');
    this.createConfetti();
  }

  hideSuccess() {
    this.successContainer.classList.remove('show');
  }

  playShutterEffect() {
    const flash = document.createElement('div');
    flash.className = 'camera-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
  }

  createConfetti() {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.background = ['#d4af37', '#ff6b6b', '#ffffff'][Math.floor(Math.random() * 3)];
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = confetti.style.width;
      confetti.style.animation = `confettiFall ${2 + Math.random() * 1}s ease-out forwards`;
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  }

  validateForm(name, email, service, subject, message, terms) {
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.nameError = 'Please enter a valid name (at least 2 characters)';
    }

    if (!email || !this.isValidEmail(email)) {
      errors.emailError = 'Please enter a valid email address';
    }

    if (!service) {
      errors.serviceError = 'Please select a service';
    }

    if (!subject || subject.trim().length < 3) {
      errors.subjectError = 'Subject must be at least 3 characters';
    }

    if (!message || message.trim().length < 10) {
      errors.messageError = 'Message must be at least 10 characters';
    }

    if (!terms) {
      errors.termsError = 'You must agree to the terms and conditions';
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  displayErrors(errors) {
    // Clear all previous errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');

    // Display new errors
    Object.keys(errors).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = errors[key];
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const terms = document.getElementById('terms').checked;

    // Validate
    const errors = this.validateForm(name, email, service, subject, message, terms);

    if (Object.keys(errors).length > 0) {
      this.displayErrors(errors);
      return;
    }

    // Show loading
    this.showLoading();

    // Simulate processing (FormSubmit handles actual sending)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hide loading
    this.hideLoading();

    // Show success with animations
    this.showSuccess();

    // Reset form
    this.contactForm.reset();

    // Auto hide success after 6 seconds
    setTimeout(() => {
      this.hideSuccess();
    }, 6000);

    // Log data (for debugging)
    console.log({
      name,
      email,
      phone,
      service,
      subject,
      message,
      timestamp: new Date().toISOString()
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new FormHandler();
});
