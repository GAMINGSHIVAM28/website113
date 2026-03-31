// ============================================
// PROFESSIONAL FORM HANDLER WITH REAL EMAIL DELIVERY
// ============================================

class FormHandler {
  constructor() {
    this.contactForm = document.getElementById('contactForm');
    this.successContainer = null;
    this.loadingSpinner = null;
    this.statusElement = document.getElementById('formStatus');
    this.submitButton = this.contactForm?.querySelector('button[type="submit"]') || null;
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.createLoadingSpinner();
      this.createSuccessContainer();
      this.setMinimumEventDate();
      this.prefillServiceFromQuery();
      this.handleRedirectStatus();
      this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleRedirectStatus() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('submitted') === '1') {
      this.showStatus('✅ Message sent successfully!', 'success');
      this.showSuccess();

      setTimeout(() => {
        this.hideSuccess();
        const cleanUrl = `${window.location.pathname}${window.location.hash || ''}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }, 6000);
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

  setMinimumEventDate() {
    const eventDateField = document.getElementById('eventDate');
    if (eventDateField) {
      eventDateField.min = new Date().toISOString().split('T')[0];
    }
  }

  prefillServiceFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const serviceField = document.getElementById('service');

    if (!service || !serviceField) {
      return;
    }

    const hasMatchingOption = Array.from(serviceField.options).some((option) => option.value === service);
    if (hasMatchingOption) {
      serviceField.value = service;
    }
  }

  createSuccessContainer() {
    const container = document.createElement('div');
    container.className = 'success-container';
    container.innerHTML = `
      <div class="success-box">
        <div class="success-icon">✓</div>
        <h2 class="success-title">Thank You!</h2>
        <p class="success-message">Your inquiry has been sent successfully! 📸</p>
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
    if (this.loadingSpinner) {
      this.loadingSpinner.classList.add('active');
    }
  }

  hideLoading() {
    if (this.loadingSpinner) {
      this.loadingSpinner.classList.remove('active');
    }
  }

  showSuccess() {
    this.playShutterEffect();
    this.successContainer.classList.add('show');
    this.createConfetti();
  }

  hideSuccess() {
    if (this.successContainer) {
      this.successContainer.classList.remove('show');
    }
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

  setSubmittingState(isSubmitting) {
    if (!this.submitButton) {
      return;
    }

    this.submitButton.disabled = isSubmitting;
    this.submitButton.textContent = isSubmitting ? 'Sending...' : 'Send Message';
    this.submitButton.style.opacity = isSubmitting ? '0.8' : '1';
    this.submitButton.style.cursor = isSubmitting ? 'not-allowed' : 'pointer';
  }

  showStatus(message, type = 'error') {
    if (!this.statusElement) {
      return;
    }

    this.statusElement.textContent = message;
    this.statusElement.style.display = 'block';
    this.statusElement.style.marginTop = '1rem';
    this.statusElement.style.padding = '0.9rem 1rem';
    this.statusElement.style.borderRadius = '10px';
    this.statusElement.style.fontWeight = '600';
    this.statusElement.style.lineHeight = '1.5';
    this.statusElement.style.background = type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    this.statusElement.style.color = type === 'success' ? '#166534' : '#991b1b';
    this.statusElement.style.border = type === 'success' ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)';
  }

  clearStatus() {
    this.clearFieldErrors();

    if (this.statusElement) {
      this.statusElement.textContent = '';
      this.statusElement.style.display = 'none';
    }
  }

  validateForm(name, email, phone, service, subject, message, terms) {
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.nameError = 'Please enter a valid name (at least 2 characters)';
    }

    if (!email || !this.isValidEmail(email)) {
      errors.emailError = 'Please enter a valid email address';
    }

    if (phone && !/^[+\d\s()-]{7,20}$/.test(phone)) {
      errors.phoneError = 'Please enter a valid phone number';
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

  clearFieldErrors() {
    const fields = this.contactForm?.querySelectorAll('input, select, textarea') || [];
    fields.forEach((field) => {
      field.removeAttribute('aria-invalid');
      field.style.borderColor = '';
      field.style.boxShadow = '';
    });
  }

  displayErrors(errors) {
    const fieldMap = {
      nameError: 'name',
      emailError: 'email',
      phoneError: 'phone',
      serviceError: 'service',
      subjectError: 'subject',
      messageError: 'message',
      termsError: 'terms'
    };

    this.clearFieldErrors();

    let firstField = null;
    Object.keys(errors).forEach((key) => {
      const fieldId = fieldMap[key];
      const field = fieldId ? document.getElementById(fieldId) : null;

      if (field) {
        field.setAttribute('aria-invalid', 'true');
        field.style.borderColor = '#dc2626';
        field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.12)';

        if (!firstField) {
          firstField = field;
        }
      }
    });

    const firstError = Object.values(errors)[0];
    if (firstError) {
      this.showStatus(firstError, 'error');
      firstField?.focus();
    }
  }

  ensureHiddenField(name, value) {
    let field = this.contactForm.querySelector(`input[name="${name}"]`);

    if (!field) {
      field = document.createElement('input');
      field.type = 'hidden';
      field.name = name;
      this.contactForm.appendChild(field);
    }

    field.value = value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.clearStatus();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const terms = document.getElementById('terms').checked;

    const errors = this.validateForm(name, email, phone, service, subject, message, terms);

    if (Object.keys(errors).length > 0) {
      this.displayErrors(errors);
      return;
    }

    if (window.location.protocol === 'file:') {
      this.showStatus('To send real inquiries, open this page through a local server or your live website: https://shivam-photography.netlify.app/. Form delivery will not work from file:// pages.', 'error');
      return;
    }

    const successUrl = `${window.location.origin}${window.location.pathname}?submitted=1${window.location.hash || ''}`;
    this.ensureHiddenField('_next', successUrl);
    this.ensureHiddenField('_captcha', 'false');
    this.ensureHiddenField('_template', 'table');

    this.setSubmittingState(true);
    this.showLoading();
    this.showStatus('Sending your inquiry...', 'success');

    try {
      const formAction = this.contactForm.getAttribute('action') || 'https://formsubmit.co/shivamdwivedi280708@gmail.com';
      const ajaxEndpoint = formAction.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      const formData = new FormData(this.contactForm);
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 15000);

      const response = await fetch(ajaxEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData,
        signal: controller.signal
      });

      window.clearTimeout(timeoutId);
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === 'false') {
        throw new Error(result.message || `Submission failed with status ${response.status}`);
      }

      this.contactForm.reset();
      this.setMinimumEventDate();
      window.location.href = successUrl;
    } catch (error) {
      console.error('Contact form submission failed:', error);
      this.hideLoading();
      this.setSubmittingState(false);

      const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
      const isTimeout = error?.name === 'AbortError';
      this.showStatus(
        isOffline
          ? 'You appear to be offline. Please reconnect and try again.'
          : isTimeout
            ? 'The request is taking too long. Please try again in a few moments.'
            : 'Sorry, your message could not be sent right now. Please try again in a moment or contact us on WhatsApp.',
        'error'
      );
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new FormHandler();
});

window.addEventListener('load', function () {
  if (window.location.search.includes('submitted=1')) {
    const msg = document.getElementById('formStatus');
    if (msg) {
      msg.innerText = '✅ Message sent successfully!';
      msg.style.color = 'green';
    }
  }
});
