// ============================================
// AI CHATBOT - INTELLIGENT PHOTOGRAPHY ASSISTANT
// ============================================

class AIPhotographyChatbot {
  constructor() {
    this.conversationHistory = [];
    this.userProfile = this.loadUserProfile();
    this.isTyping = false;
    this.currentContext = 'general';
    this.init();
  }

  init() {
    this.createChatbotUI();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  // ===== UI CREATION =====
  createChatbotUI() {
    const container = document.createElement('div');
    container.className = 'ai-chatbot-container';
    container.innerHTML = `
      <button class="chatbot-toggle-btn" title="Chat with Dolly AI">
        <i class="fas fa-comments"></i>
      </button>
      <div class="chatbot-window">
        <div class="chatbot-header">
          <div>
            <h3>🤖 Dolly AI Assistant</h3>
            <p>Always here to help 24/7</p>
          </div>
          <button class="chatbot-close-btn" title="Close chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages"></div>
        <div class="chatbot-input-area">
          <input 
            type="text" 
            class="chatbot-input-field" 
            id="chatbotInput" 
            placeholder="Ask me anything..."
            autocomplete="off"
          >
          <button class="chatbot-send-btn" title="Send message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(container);
  }

  attachEventListeners() {
    const toggleBtn = document.querySelector('.chatbot-toggle-btn');
    const closeBtn = document.querySelector('.chatbot-close-btn');
    const sendBtn = document.querySelector('.chatbot-send-btn');
    const input = document.getElementById('chatbotInput');
    const window = document.querySelector('.chatbot-window');

    toggleBtn.addEventListener('click', () => window.classList.toggle('active'));
    closeBtn.addEventListener('click', () => window.classList.remove('active'));
    
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  // ===== MESSAGE HANDLING =====
  sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';

    // Save conversation
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response
    this.showTypingIndicator();
    setTimeout(() => this.generateResponse(message), 800);
  }

  addMessage(text, sender = 'bot', isHTML = false) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (isHTML) {
      contentDiv.innerHTML = text;
    } else {
      contentDiv.textContent = text;
    }

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (sender === 'bot') {
      this.conversationHistory.push({
        role: 'bot',
        content: text,
        timestamp: new Date()
      });
    }
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    messageDiv.id = 'typingIndicator';

    messageDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  // ===== AI RESPONSE GENERATION =====
  generateResponse(userMessage) {
    this.removeTypingIndicator();

    // Convert to lowercase for matching
    const msg = userMessage.toLowerCase();

    // Determine context and get response
    let response = this.getIntelligentResponse(msg);
    
    // Add response
    this.addMessage(response, 'bot', true);

    // Save user profile
    this.updateUserProfile(userMessage);
  }

  getIntelligentResponse(message) {
    // SERVICE INQUIRIES
    if (this.matches(message, ['wedding', 'शादी', 'विवाह'])) {
      return this.getServiceResponse('wedding');
    }
    if (this.matches(message, ['passport', 'photo', 'आईडी', 'पासपोर्ट'])) {
      return this.getServiceResponse('passport');
    }
    if (this.matches(message, ['drone', 'aerial', 'aerial photography', 'ड्रोन'])) {
      return this.getServiceResponse('drone');
    }
    if (this.matches(message, ['color', 'grading', 'editing', 'edit', 'ग्रेडिंग', 'संपादन'])) {
      return this.getServiceResponse('grading');
    }

    // BOOKING
    if (this.matches(message, ['book', 'booking', 'appointment', 'schedule', 'बुक', 'नियुक्ति'])) {
      return this.getBookingResponse();
    }

    // PRICING
    if (this.matches(message, ['price', 'cost', 'rate', 'how much', 'कीमत', 'खर्च'])) {
      return this.getPricingResponse();
    }

    // CONTACT
    if (this.matches(message, ['contact', 'phone', 'email', 'call', 'निर्भर', 'ईमेल', 'फोन'])) {
      return this.getContactResponse();
    }

    // LOCATION
    if (this.matches(message, ['location', 'address', 'where', 'studio', 'कहाँ', 'पता'])) {
      return this.getLocationResponse();
    }

    // PORTFOLIO
    if (this.matches(message, ['portfolio', 'work', 'gallery', 'samples', 'examples', 'पोर्टफोलियो'])) {
      return this.getPortfolioResponse();
    }

    // TURNAROUND TIME
    if (this.matches(message, ['how long', 'delivery', 'turnaround', 'days', 'time', 'कितना समय'])) {
      return this.getTurnaroundResponse();
    }

    // REVISION POLICY
    if (this.matches(message, ['revision', 'revisions', 'changes', 'unlimited', 'संशोधन'])) {
      return this.getRevisionResponse();
    }

    // TRAVEL
    if (this.matches(message, ['travel', 'location', 'national', 'outside', 'bilaspur', 'बाहर'])) {
      return this.getTravelResponse();
    }

    // EQUIPMENT/QUALITY
    if (this.matches(message, ['equipment', 'camera', 'drone', 'quality', 'professional', 'उपकरण'])) {
      return this.getEquipmentResponse();
    }

    // TESTIMONIALS
    if (this.matches(message, ['testimonial', 'review', 'client', 'feedback', 'rating', 'समीक्षा'])) {
      return this.getTestimonialResponse();
    }

    // PAYMENT METHODS
    if (this.matches(message, ['payment', 'method', 'upi', 'card', 'transfer', 'भुगतान'])) {
      return this.getPaymentResponse();
    }

    // THANK YOU / GREETING
    if (this.matches(message, ['thanks', 'thank you', 'thank u', 'thx', 'ty', 'धन्यवाद'])) {
      return "You're welcome! 😊 Feel free to ask me anything else about our photography services!";
    }

    // HELLO / GREETING
    if (this.matches(message, ['hello', 'hi', 'hey', 'हेलो', 'हाय'])) {
      return "Hello! 👋 I'm Dolly's AI assistant. How can I help you today? Ask me about:<br><br><strong>Services:</strong> Wedding, Passport, Drone, Color Grading<br><strong>Booking:</strong> Availability & Packages<br><strong>Pricing:</strong> Rates & Payment<br><strong>Contact:</strong> Phone, Email, Location";
    }

    // DEFAULT
    return this.getDefaultResponse(message);
  }

  // ===== RESPONSE BUILDERS =====
  getServiceResponse(service) {
    const services = {
      wedding: `
        <strong>💍 Wedding Photography</strong><br>
        Capturing the most beautiful moments of your special day!<br><br>
        <strong>What We Offer:</strong>
        • Pre-wedding shoot
        • Engagement ceremony
        • Mehndi & sangeet
        • Wedding day coverage
        • Reception & after-party
        • 1000+ edited photos
        • Album with premium binding<br><br>
        <div class="service-price">Starting from ₹25,000</div>
        <br><a href="services.html#wedding" target="_blank" style="color: #d4af37; text-decoration: underline;">Learn More</a> | <a href="contact.html" target="_blank" style="color: #d4af37; text-decoration: underline;">Book Now</a>
      `,
      passport: `
        <strong>📸 Passport Photos</strong><br>
        Professional ID photos that meet official requirements!<br><br>
        <strong>What We Offer:</strong>
        • Perfect lighting & composition
        • Meets all official standards
        • Quick turnaround (1-2 hours)
        • Digital & printed copies
        • Retouching included
        • Unlimited revisions<br><br>
        <div class="service-price">₹150 - ₹250</div>
        <br><a href="services.html#passport" target="_blank" style="color: #d4af37; text-decoration: underline;">Learn More</a> | <a href="contact.html" target="_blank" style="color: #d4af37; text-decoration: underline;">Book Now</a>
      `,
      drone: `
        <strong>🚁 Drone Photography</strong><br>
        Stunning aerial shots from unique perspectives!<br><br>
        <strong>What We Offer:</strong>
        • Aerial photography
        • Aerial videography
        • Real estate shots
        • Event coverage
        • 4K video quality
        • Professional editing<br><br>
        <div class="service-price">Starting from ₹6,000</div>
        <br><a href="services.html#drone" target="_blank" style="color: #d4af37; text-decoration: underline;">Learn More</a> | <a href="contact.html" target="_blank" style="color: #d4af37; text-decoration: underline;">Book Now</a>
      `,
      grading: `
        <strong>🎨 Color Grading & Editing</strong><br>
        Enhance your images with professional color correction!<br><br>
        <strong>What We Offer:</strong>
        • Color correction
        • Professional grading
        • Mood & tone adjustment
        • Batch processing
        • Cinematic look
        • Quick delivery<br><br>
        <div class="service-price">Starting from ₹150 per image</div>
        <br><a href="services.html#grading" target="_blank" style="color: #d4af37; text-decoration: underline;">Learn More</a> | <a href="contact.html" target="_blank" style="color: #d4af37; text-decoration: underline;">Book Now</a>
      `
    };

    return services[service] || "Tell me which service you're interested in!";
  }

  getBookingResponse() {
    return `
      <strong>📅 Booking a Service</strong><br><br>
      <strong>How to Book:</strong><br>
      1️⃣ Choose your service<br>
      2️⃣ Check availability<br>
      3️⃣ Pay 30% advance deposit<br>
      4️⃣ Confirm your date<br><br>
      <strong>For Weddings:</strong> Book 2-3 months in advance<br>
      <strong>For Passport Photos:</strong> Same day availability<br>
      <strong>For Other Services:</strong> 1-2 weeks notice<br><br>
      <div class="quick-replies">
        <button class="quick-reply-btn" onclick="document.location='contact.html'">📞 Contact Now</button>
        <button class="quick-reply-btn" onclick="document.location='services.html'">💼 View All Services</button>
      </div>
    `;
  }

  getPricingResponse() {
    return `
      <strong>💰 Our Pricing</strong><br><br>
      <strong>Wedding Photography:</strong><br>
      • Basic: ₹15,000<br>
      • Professional: ₹30,000<br>
      • Premium: ₹60,000+<br><br>
      <strong>Passport Photos:</strong><br>
      • Single photo set: ₹150<br>
      • Family pack (5): ₹500<br><br>
      <strong>Drone Photography:</strong><br>
      • Hourly: ₹3,000<br>
      • Half-day: ₹6,000<br>
      • Full-day: ₹10,000<br><br>
      <div class="quick-replies">
        <button class="quick-reply-btn" onclick="document.location='services.html'">See All Prices</button>
        <button class="quick-reply-btn" onclick="document.location='contact.html'">Get Custom Quote</button>
      </div>
    `;
  }

  getContactResponse() {
    return `
      <strong>📞 Contact Information</strong><br><br>
      <strong>Call Us:</strong><br>
      📱 <a href="tel:+919993035235" style="color: #d4af37;">+91 9993035235</a><br><br>
      <strong>Email Us:</strong><br>
      ✉️ <a href="mailto:shivamdwivedi280708@gmail.com" style="color: #d4af37;">shivamdwivedi280708@gmail.com</a><br><br>
      <strong>WhatsApp:</strong><br>
      💬 <a href="https://wa.me/919993035235?text=Hi%20Shivam!%20I%20would%20like%20to%20inquire%20about%20your%20photography%20services." target="_blank" style="color: #d4af37;">Message us on WhatsApp</a><br><br>
      <strong>Hours:</strong><br>
      Mon-Fri: 10AM - 8PM<br>
      Sat-Sun: 11AM - 6PM
    `;
  }

  getLocationResponse() {
    return `
      <strong>📍 Our Studio Location</strong><br><br>
      <strong>Address:</strong><br>
      Deendayal Colony, Mangla<br>
      Bilaspur, Chhattisgarh, India<br>
      Pincode - 495001<br><br>
      <div class="quick-replies">
        <button class="quick-reply-btn" onclick="document.location='contact.html'">📍 View on Map</button>
        <button class="quick-reply-btn" onclick="document.location='contact.html'">📞 Get Directions</button>
      </div>
    `;
  }

  getPortfolioResponse() {
    return `
      <strong>🖼️ Our Portfolio</strong><br><br>
      We have 1000+ beautiful photos showcasing:<br>
      ✓ Weddings & Events<br>
      ✓ Portrait Photography<br>
      ✓ Drone aerial shots<br>
      ✓ Color-graded masterpieces<br><br>
      <strong>Check out our latest work:</strong><br>
      <div class="quick-replies">
        <button class="quick-reply-btn" onclick="document.location='portfolio.html'">👁️ View Portfolio</button>
        <button class="quick-reply-btn" onclick="document.location='portfolio.html'">🎬 See Before/After</button>
      </div>
    `;
  }

  getTurnaroundResponse() {
    return `
      <strong>⏱️ Delivery Timeline</strong><br><br>
      <strong>Standard Turnaround:</strong><br>
      📸 Edited photos: 2-3 weeks<br>
      🎬 Videos: 3-4 weeks<br>
      📱 Passport photos: 1-2 hours<br><br>
      <strong>Express Options Available:</strong><br>
      ⚡ 1-week delivery: +20%<br>
      ⚡ 3-day delivery: +40%<br><br>
      <strong>Contact for rush bookings!</strong>
    `;
  }

  getRevisionResponse() {
    return `
      <strong>🔄 Revision Policy</strong><br><br>
      ✓ <strong>Unlimited Revisions!</strong><br>
      ✓ We don't stop until you're happy<br>
      ✓ Color corrections included<br>
      ✓ Composition changes<br>
      ✓ Retouching & enhancement<br><br>
      Your satisfaction is our top priority!<br><br>
      Any concerns? <a href="contact.html" style="color: #d4af37; text-decoration: underline;">Contact us directly</a>
    `;
  }

  getTravelResponse() {
    return `
      <strong>✈️ Travel Services</strong><br><br>
      <strong>We Cover:</strong><br>
      ✓ Bilaspur city bookings<br>
      ✓ Nearby cities in Chhattisgarh<br>
      ✓ Outstation destinations across India<br><br>
      <strong>Travel Fees:</strong><br>
      • Within 20km: Free<br>
      • 20-100km: +₹2,000<br>
      • Beyond 100km: Custom quote<br><br>
      <a href="contact.html" style="color: #d4af37; text-decoration: underline;">Get a custom quote for your location</a>
    `;
  }

  getEquipmentResponse() {
    return `
      <strong>🎥 Our Equipment & Quality</strong><br><br>
      <strong>Cameras:</strong><br>
      • Canon EOS R5 (Professional)<br>
      • Canon 5D Mark IV<br>
      • Lens collection: 14mm-200mm<br><br>
      <strong>Drones:</strong><br>
      • DJI Mavic 3 (4K video)<br>
      • DJI Mini 3 Pro<br><br>
      <strong>Software:</strong><br>
      • Lightroom & Photoshop<br>
      • DaVinci Resolve<br>
      • Professional editing suite<br><br>
      <strong>Result:</strong> Professional-grade photos & videos every time! 📸
    `;
  }

  getTestimonialResponse() {
    return `
      <strong>⭐ Client Testimonials</strong><br><br>
      <strong>"The wedding photos are absolutely breathtaking!"</strong><br>
      — Priya & Arjun, Bilaspur<br><br>
      <strong>"Professional & incredibly detail-oriented!"</strong><br>
      — Rahul Sharma, Raipur<br><br>
      <strong>"My passport photos were accepted on the first try!"</strong><br>
      — Ananya Kapoor, Bilaspur<br><br>
      <div class="quick-replies">
        <button class="quick-reply-btn" onclick="document.location='index.html#testimonials'">⭐ Read All Reviews</button>
      </div>
    `;
  }

  getPaymentResponse() {
    return `
      <strong>💳 Payment Methods</strong><br><br>
      We accept:<br>
      ✓ UPI (Google Pay, PhonePe, Paytm)<br>
      ✓ Credit/Debit Cards<br>
      ✓ Bank Transfers<br>
      ✓ Digital Wallets<br>
      ✓ Cash (studio visits only)<br><br>
      <strong>Deposit Required:</strong><br>
      30% advance to confirm your date<br>
      Remaining 70% due 7 days before event<br><br>
      <a href="contact.html" style="color: #d4af37; text-decoration: underline;">Book & pay online</a>
    `;
  }

  getDefaultResponse(message) {
    const fallbacks = [
      "That's a great question! 🤔 Let me help you better. Are you interested in:<br><div class='quick-replies'><button class='quick-reply-btn' onclick=\"document.querySelector('.chatbot-input-field').value='Tell me about wedding photography'; document.querySelector('.chatbot-send-btn').click()\">Wedding Photography</button><button class='quick-reply-btn' onclick=\"document.querySelector('.chatbot-input-field').value='How do I book?'; document.querySelector('.chatbot-send-btn').click()\">Booking</button><button class='quick-reply-btn' onclick=\"document.querySelector('.chatbot-input-field').value='What are your prices?'; document.querySelector('.chatbot-send-btn').click()\">Pricing</button></div>",
      "I'm here to answer questions about our photography services! 📸<br>You can ask me about: Services, Pricing, Booking, Location, or anything else!",
      "That's interesting! 😊 For detailed information, I recommend:<br><div class='quick-replies'><button class='quick-reply-btn' onclick=\"document.location='contact.html'\">📞 Contact Us</button><button class='quick-reply-btn' onclick=\"document.location='services.html'\">View All Services</button></div>"
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // ===== HELPER FUNCTIONS =====
  matches(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
  }

  addWelcomeMessage() {
    setTimeout(() => {
      this.addMessage(
        "👋 Hello! I'm Dolly's AI Assistant. I'm here to help you with information about our photography services, pricing, booking, and more. What can I help you with today?",
        'bot',
        false
      );
    }, 500);
  }

  // ===== USER PROFILE MANAGEMENT =====
  loadUserProfile() {
    const profile = localStorage.getItem('dollyUserProfile');
    return profile ? JSON.parse(profile) : {
      visits: 0,
      interests: [],
      lastVisit: new Date(),
      inquiries: 0
    };
  }

  updateUserProfile(message) {
    this.userProfile.inquiries++;
    
    // Track interests
    if (message.toLowerCase().includes('wedding')) {
      this.userProfile.interests.push('wedding');
    }
    if (message.toLowerCase().includes('passport')) {
      this.userProfile.interests.push('passport');
    }
    if (message.toLowerCase().includes('drone')) {
      this.userProfile.interests.push('drone');
    }
    if (message.toLowerCase().includes('booking')) {
      this.userProfile.interests.push('booking');
    }

    this.userProfile.lastVisit = new Date();
    localStorage.setItem('dollyUserProfile', JSON.stringify(this.userProfile));
  }
}

// ===== INITIALIZE WHEN DOCUMENT READY =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AIPhotographyChatbot();
  });
} else {
  new AIPhotographyChatbot();
}
