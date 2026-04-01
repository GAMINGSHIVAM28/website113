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
      // Initialize EmailJS
      // Must use exact user key from EmailJS dashboard (starts with user_)
      // Example: user_aelzppxFfJ14icf5H
      const publicKey = "aelzppxFfJ14icf5H";
      emailjs.init(publicKey);

      this.createLoadingSpinner();
      this.createSuccessContainer();
      this.setMinimumEventDate();
      this.prefillServiceFromQuery();
      this.bindFieldInteractions();
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

  setMinimumEventDate() {
    const eventDateField = document.getElementById('eventDate');
    if (eventDateField) {
      eventDateField.min = new Date().toISOString().split('T')[0];
    }
  }

  bindFieldInteractions() {
    const fields = this.contactForm?.querySelectorAll('input, select, textarea') || [];

    fields.forEach((field) => {
      const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        field.removeAttribute('aria-invalid');
        field.style.borderColor = '';
        field.style.boxShadow = '';

        if (this.statusElement && this.statusElement.textContent) {
          this.statusElement.textContent = '';
          this.statusElement.style.display = 'none';
        }
      });
    });
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

  handleSubmit(e) {
    e.preventDefault(); // Prevent form submission

    this.clearStatus();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const eventDate = document.getElementById('eventDate').value;
    const shootLocation = document.getElementById('shootLocation').value.trim();
    const budget = document.getElementById('budget').value;
    const terms = document.getElementById('terms').checked;

    const errors = this.validateForm(name, email, phone, service, subject, message, terms);

    if (Object.keys(errors).length > 0) {
      this.displayErrors(errors);
      return;
    }

    // Check for honeypot spam
    const honey = document.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim()) {
      this.showStatus('Spam detected. Please try again.', 'error');
      return;
    }

    this.setSubmittingState(true);
    this.showLoading();
    this.showStatus('Sending your message...', 'success');

    const templateParams = {
      name: name,
      email: email,
      phone: phone,
      service: service,
      subject: subject,
      message: message,
      event_date: eventDate,
      shoot_location: shootLocation,
      budget: budget
    };

    // Send email to photographer
    const photographerPromise = emailjs.send(
      "service_bgsr254", // Your EmailJS service ID
      "template_dhyupld", // Confirmed photographer template ID
      {
        ...templateParams,
        to_email: "shivamdwivedi280708@gmail.com" // Photographer's email
      }
    );

    // Send auto-reply to user
    const userPromise = emailjs.send(
      "service_bgsr254", // Replace with your EmailJS service ID
      "template_lpam2tb", // Replace with template ID for user auto-reply
      {
        ...templateParams,
        to_email: email // User's email
      }
    );

    Promise.all([photographerPromise, userPromise])
      .then(() => {
        this.hideLoading();
        this.setSubmittingState(false);
        this.showStatus('Message sent successfully!', 'success');
        this.showSuccess();
        this.contactForm.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        this.hideLoading();
        this.setSubmittingState(false);

        let userMessage = 'Failed to send message. Please try again or contact us directly.';
        if (error && error.status && error.text) {
          const text = (typeof error.text === 'string' ? error.text : JSON.stringify(error.text));
          userMessage = `Email service error (${error.status}): ${text}. Please verify EmailJS settings.`;
        }

        this.showStatus(userMessage, 'error');
      });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new FormHandler();
});
