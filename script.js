// Create background effects
function createBackgroundEffects() {
    const waterDrops = document.getElementById('water-drops');
    const fogEffects = document.getElementById('fog-effects');
    
    // Create water drops
    for (let i = 0; i < 15; i++) {
        const drop = document.createElement('div');
        drop.className = 'water-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.width = `${20 + Math.random() * 30}px`;
        drop.style.height = drop.style.width;
        drop.style.animationDelay = `${Math.random() * 5}s`;
        drop.style.animationDuration = `${5 + Math.random() * 10}s`;
        waterDrops.appendChild(drop);
    }
    
    // Create fog effects
    for (let i = 0; i < 5; i++) {
        const fog = document.createElement('div');
        fog.className = 'fog';
        fog.style.left = `${Math.random() * 100}%`;
        fog.style.top = `${Math.random() * 100}%`;
        fog.style.width = `${150 + Math.random() * 200}px`;
        fog.style.height = fog.style.width;
        fog.style.animationDelay = `${Math.random() * 10}s`;
        fog.style.animationDuration = `${15 + Math.random() * 20}s`;
        fogEffects.appendChild(fog);
    }
}

// Touch effect animation
document.addEventListener('click', function(e) {
    const touchEffect = document.createElement('div');
    touchEffect.className = 'touch-effect';
    touchEffect.style.left = `${e.pageX - 10}px`;
    touchEffect.style.top = `${e.pageY - 10}px`;
    document.body.appendChild(touchEffect);
    
    setTimeout(() => {
        touchEffect.remove();
    }, 600);
});

// Haptic feedback for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('haptic');
        setTimeout(() => {
            this.classList.remove('haptic');
        }, 300);
    });
});

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    const notificationContainer = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after duration
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
    
    function closeNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }, 500);
    }
}

// Chatbot functionality
function openChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    chatbotContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
    showNotification('Welcome to Hydro! Your website planning assistant.', 'info');
}

function closeChatbot() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    chatbotContainer.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Template detail modal functionality
function openTemplateDetail(category) {
    const modal = document.getElementById('templateDetailModal');
    const body = document.getElementById('templateDetailBody');
    
    // Create HTML for template detail
    const discountBadge = category.discountPercent > 0 
        ? `<span class="discount-badge">${category.discountPercent}% OFF</span>` 
        : '';
    
    const tagHtml = category.tag 
        ? `<div class="product-tag">${category.tag}</div>` 
        : '';
    
    const imageHtml = category.image 
        ? `<div class="product-image" style="background-image: url('${category.image}')">
             ${tagHtml}
             <div class="category-title-overlay">${category.name}</div>
           </div>`
        : `<div class="product-image">
             ${tagHtml}
             <div class="image-placeholder">
                 <i class="fas ${categoryIcons[category.name] || 'fa-globe'}"></i>
                 ${category.name}
             </div>
           </div>`;
    
    const detailHtml = `
        <div class="product-card" data-type="${category.type}" data-discount="${category.hasDiscount}">
            ${imageHtml}
            <div class="product-content">
                <h3 class="product-title">${category.name} Website</h3>
                <p class="product-description">${category.description}</p>
                
                <div class="product-examples">
                    <strong>Examples:</strong> <span>${category.examples}</span>
                </div>
                
                <div class="product-features">
                    ${category.features.map(feature => `<div class="feature-tag">${feature}</div>`).join('')}
                </div>
                
                <div class="product-footer">
                    <div class="product-pricing">
                        ${category.discountPercent > 0 
                            ? `<div class="original-price">$${category.originalPrice.toFixed(2)}</div>` 
                            : ''}
                        <div class="discount-price">
                            $${category.discountPrice.toFixed(2)}
                            ${discountBadge}
                        </div>
                    </div>
                    <button class="order-template-btn" data-id="${category.id}" data-name="${category.name}" data-price="${category.discountPrice}">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    body.innerHTML = detailHtml;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listener to order button in modal
    const orderBtn = body.querySelector('.order-template-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = this.getAttribute('data-price');
            
            // Store selected template info
            localStorage.setItem('selectedTemplate', JSON.stringify({
                id: productId,
                name: productName,
                price: productPrice
            }));
            
            // Close modal and go to registration
            closeTemplateDetail();
            document.getElementById('templateMarketplaceSection').style.display = 'none';
            document.getElementById('loginSection').style.display = 'block';
            showStage(1);
            
            showNotification(`You selected: ${productName} template. Please complete registration to proceed.`, 'info', 6000);
        });
    }
}

function closeTemplateDetail() {
    const modal = document.getElementById('templateDetailModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Form navigation logic
let currentStage = 1;
const totalStages = 6;

// Initialize the progress bar
function updateProgressBar() {
    const progressLine = document.getElementById('progressLine');
    const percentage = ((currentStage - 1) / (totalStages - 1)) * 100;
    progressLine.style.width = `${percentage}%`;
    
    // Update step indicators
    for (let i = 1; i <= totalStages; i++) {
        const step = document.getElementById(`step${i}`);
        if (i < currentStage) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (i === currentStage) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    }
}

// Show specific stage
function showStage(stageNumber) {
    // Hide all stages
    for (let i = 1; i <= totalStages; i++) {
        document.getElementById(`stage${i}`).classList.remove('active');
    }
    
    // Show the selected stage
    document.getElementById(`stage${stageNumber}`).classList.add('active');
    currentStage = stageNumber;
    updateProgressBar();
}

// Validate form inputs
function validateStage(stageNum) {
    switch(stageNum) {
        case 2:
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            if (!firstName || !lastName) {
                showNotification('Please enter both first and last name.', 'error');
                return false;
            }
            return true;
            
        case 3:
            const gender = document.getElementById('gender').value;
            if (!gender) {
                showNotification('Please select your gender.', 'error');
                return false;
            }
            return true;
            
        case 4:
            const birthday = document.getElementById('birthday').value;
            if (!birthday) {
                showNotification('Please select your birthday.', 'error');
                return false;
            }
            return true;
            
        case 5:
            const email = document.getElementById('email').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email || !whatsapp) {
                showNotification('Please enter both email and WhatsApp number.', 'error');
                return false;
            }
            
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return false;
            }
            
            return true;
            
        case 6:
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!password || !confirmPassword) {
                showNotification('Please enter and confirm your password.', 'error');
                return false;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match. Please try again.', 'error');
                return false;
            }
            
            if (password.length < 6) {
                showNotification('Password should be at least 6 characters long.', 'warning');
                return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

// Template Marketplace Data
const websiteCategories = [
    {
        id: 1,
        name: "E-commerce",
        description: "Online stores designed for selling products or services directly to customers. Includes shopping cart, payment processing, inventory management, and customer accounts.",
        examples: "Shopify, WooCommerce, Magento, BigCommerce",
        features: ["Product Catalog", "Shopping Cart", "Payment Gateway", "Inventory Management", "Customer Accounts"],
        originalPrice: 865,
        discountPrice: 692,
        discountPercent: 20,
        type: "dynamic",
        hasDiscount: true,
        tag: "Most Popular",
        image: "ecom.png"
    },
    {
        id: 2,
        name: "Business/Brand",
        description: "Professional websites that represent companies, provide information about services, and build trust with potential customers.",
        examples: "Wix, WordPress, Squarespace, Webflow",
        features: ["About Us", "Services", "Contact Form", "Testimonials", "Responsive Design"],
        originalPrice: 450,
        discountPrice: 405,
        discountPercent: 10,
        type: "static",
        hasDiscount: true,
        tag: "Recommended",
        image: "business.png"
    },
    {
        id: 3,
        name: "Blog",
        description: "Platforms for regular content publication, articles, and personal thoughts. Ideal for writers, journalists, and influencers.",
        examples: "WordPress, Medium, Ghost, Blogger",
        features: ["Content Management", "Categories/Tags", "Comments", "Social Sharing", "SEO Tools"],
        originalPrice: 350,
        discountPrice: 350,
        discountPercent: 0,
        type: "dynamic",
        hasDiscount: false,
        image: "blog.png"
    },
    {
        id: 4,
        name: "Portfolio",
        description: "Showcase creative work such as art, design, photography, writing, or development projects to attract clients or employers.",
        examples: "Squarespace, Wix, Adobe Portfolio, WordPress",
        features: ["Gallery Display", "Project Details", "Client Testimonials", "Contact Form", "Responsive Layout"],
        originalPrice: 400,
        discountPrice: 360,
        discountPercent: 10,
        type: "static",
        hasDiscount: true,
        image: "pfl.png"
    },
    {
        id: 5,
        name: "Educational",
        description: "Websites for courses, tutorials, and learning resources. Includes student management, progress tracking, and certification.",
        examples: "Thinkific, Moodle, Teachable, LearnDash",
        features: ["Course Management", "Student Accounts", "Progress Tracking", "Certificates", "Payment Integration"],
        originalPrice: 950,
        discountPrice: 760,
        discountPercent: 20,
        type: "dynamic",
        hasDiscount: true,
        tag: "Best Value",
        image: "edu.png"
    },
    {
        id: 6,
        name: "Social Media",
        description: "Platforms to connect users, share content, and build communities. Includes user profiles, feeds, and interaction tools.",
        examples: "Facebook, Instagram, Twitter, LinkedIn",
        features: ["User Profiles", "Content Feed", "Messaging", "Notifications", "Community Features"],
        originalPrice: 1200,
        discountPrice: 960,
        discountPercent: 20,
        type: "dynamic",
        hasDiscount: true,
        image: "social.png"
    },
    {
        id: 7,
        name: "News/Media",
        description: "Sites for publishing articles, news, and timely content. Often includes subscription models and advertising.",
        examples: "WordPress, Drupal, Joomla, Custom CMS",
        features: ["Article Management", "Categories", "Search Function", "Subscription", "Advertising"],
        originalPrice: 750,
        discountPrice: 675,
        discountPercent: 10,
        type: "dynamic",
        hasDiscount: true,
        image: "news.png"
    },
    {
        id: 8,
        name: "Event",
        description: "Platforms to promote events, sell tickets, and manage registrations. Includes event details, calendars, and payment processing.",
        examples: "Eventbrite, WordPress with plugins, Cvent",
        features: ["Event Calendar", "Ticket Sales", "Registration", "Payment Processing", "Reminders"],
        originalPrice: 550,
        discountPrice: 495,
        discountPercent: 10,
        type: "dynamic",
        hasDiscount: true,
        image: "event.png"
    },
    {
        id: 9,
        name: "Forum/Community",
        description: "Discussion-based sites where users can create topics, reply to threads, and build online communities.",
        examples: "BuddyPress, Mighty Networks, Discourse, phpBB",
        features: ["User Registration", "Discussion Threads", "Moderation Tools", "Private Messaging", "User Groups"],
        originalPrice: 600,
        discountPrice: 540,
        discountPercent: 10,
        type: "dynamic",
        hasDiscount: true,
        image: "com.png"
    }
];

// Icon mapping for fallback when images don't load
const categoryIcons = {
    "E-commerce": "fa-shopping-cart",
    "Business/Brand": "fa-briefcase",
    "Blog": "fa-blog",
    "Portfolio": "fa-images",
    "Educational": "fa-graduation-cap",
    "Social Media": "fa-users",
    "News/Media": "fa-newspaper",
    "Event": "fa-calendar-alt",
    "Forum/Community": "fa-comments"
};

// Function to create product card HTML
function createProductCard(category) {
    const discountBadge = category.discountPercent > 0 
        ? `<span class="discount-badge">${category.discountPercent}% OFF</span>` 
        : '';
    
    const tagHtml = category.tag 
        ? `<div class="product-tag">${category.tag}</div>` 
        : '';
    
    // Image or fallback
    const imageHtml = category.image 
        ? `<div class="product-image" style="background-image: url('${category.image}')">
             ${tagHtml}
             <div class="category-title-overlay">${category.name}</div>
           </div>`
        : `<div class="product-image">
             ${tagHtml}
             <div class="image-placeholder">
                 <i class="fas ${categoryIcons[category.name] || 'fa-globe'}"></i>
                 ${category.name}
             </div>
           </div>`;
    
    return `
        <div class="product-card" data-type="${category.type}" data-discount="${category.hasDiscount}" data-id="${category.id}">
            ${imageHtml}
            <div class="product-content">
                <h3 class="product-title">${category.name} Website</h3>
                <p class="product-description">${category.description}</p>
                
                <div class="product-examples">
                    <strong>Examples:</strong> <span>${category.examples}</span>
                </div>
                
                <div class="product-features">
                    ${category.features.map(feature => `<div class="feature-tag">${feature}</div>`).join('')}
                </div>
                
                <div class="product-footer">
                    <div class="product-pricing">
                        ${category.discountPercent > 0 
                            ? `<div class="original-price">$${category.originalPrice.toFixed(2)}</div>` 
                            : ''}
                        <div class="discount-price">
                            $${category.discountPrice.toFixed(2)}
                            ${discountBadge}
                        </div>
                    </div>
                    <button class="order-template-btn" data-id="${category.id}" data-name="${category.name}" data-price="${category.discountPrice}">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to render all products
function renderProducts(categories) {
    const container = document.getElementById('product-container');
    container.innerHTML = categories.map(createProductCard).join('');
    
    // Add click event to product cards for detail view
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on order button
            if (e.target.closest('.order-template-btn')) {
                return;
            }
            
            const productId = parseInt(this.getAttribute('data-id'));
            const category = websiteCategories.find(cat => cat.id === productId);
            if (category) {
                openTemplateDetail(category);
            }
        });
    });
    
    // Add event listeners to order buttons
    document.querySelectorAll('.order-template-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = this.getAttribute('data-price');
            
            // Store selected template info
            localStorage.setItem('selectedTemplate', JSON.stringify({
                id: productId,
                name: productName,
                price: productPrice
            }));
            
            // Redirect to login/registration
            document.getElementById('templateMarketplaceSection').style.display = 'none';
            document.getElementById('loginSection').style.display = 'block';
            showStage(1);
            
            showNotification(`You selected: ${productName} template. Please complete registration to proceed.`, 'info', 6000);
        });
    });
    
    // Add image error handling
    document.querySelectorAll('.product-image').forEach(img => {
        const bgImage = img.style.backgroundImage;
        if (bgImage) {
            const imageUrl = bgImage.replace('url("', '').replace('")', '');
            const tempImg = new Image();
            tempImg.onerror = function() {
                // If image fails to load, show placeholder
                const categoryName = img.querySelector('.category-title-overlay').textContent;
                img.style.backgroundImage = 'none';
                img.innerHTML = `
                    <div class="image-placeholder">
                        <i class="fas ${categoryIcons[categoryName] || 'fa-globe'}"></i>
                        ${categoryName}
                    </div>
                    ${img.innerHTML}
                `;
            };
            tempImg.src = imageUrl;
        }
    });
}

// Initialize template marketplace
function initializeMarketplace() {
    renderProducts(websiteCategories);
    
    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            let filteredCategories = websiteCategories;
            
            if (filter === 'dynamic') {
                filteredCategories = websiteCategories.filter(cat => cat.type === 'dynamic');
            } else if (filter === 'static') {
                filteredCategories = websiteCategories.filter(cat => cat.type === 'static');
            } else if (filter === 'discount') {
                filteredCategories = websiteCategories.filter(cat => cat.hasDiscount);
            }
            // 'all' shows all categories
            
            renderProducts(filteredCategories);
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    createBackgroundEffects();
    updateProgressBar();
    
    // Navigation functions
    document.getElementById('exploreBtn').addEventListener('click', function() {
        document.querySelector('.aboutme').style.display = 'none';
        document.getElementById('servicesSection').style.display = 'block';
        showNotification('Welcome to our services! Choose an option to get started.', 'info');
    });
    
    // Custom Website button opens chatbot
    document.getElementById('customWebsite').addEventListener('click', function() {
        openChatbot();
    });
    
    // Close chatbot button
    document.getElementById('closeChatbot').addEventListener('click', closeChatbot);
    
    // Close template detail button
    document.getElementById('closeTemplateDetail').addEventListener('click', closeTemplateDetail);
    
    // Close modal when clicking outside
    document.getElementById('templateDetailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeTemplateDetail();
        }
    });
    
    // Close chatbot when clicking outside
    document.getElementById('chatbotContainer').addEventListener('click', function(e) {
        if (e.target === this) {
            closeChatbot();
        }
    });
    
    // Registration stage navigation
    document.getElementById('stage1Btn').addEventListener('click', function() {
        showStage(2);
        showNotification('Great! Let\'s start with your name.', 'info');
    });
    
    document.getElementById('stage2Btn').addEventListener('click', function() {
        if (validateStage(2)) {
            showStage(3);
            showNotification('Nice to meet you! Now tell me about yourself.', 'success');
        }
    });
    
    document.getElementById('stage3Btn').addEventListener('click', function() {
        if (validateStage(3)) {
            showStage(4);
            showNotification('Thanks! When is your special day?', 'success');
        }
    });
    
    document.getElementById('stage4Btn').addEventListener('click', function() {
        if (validateStage(4)) {
            showStage(5);
            showNotification('Perfect! How can I reach you?', 'success');
        }
    });
    
    document.getElementById('stage5Btn').addEventListener('click', function() {
        if (validateStage(5)) {
            showStage(6);
            showNotification('Almost done! Let\'s secure your account.', 'success');
        }
    });
    
    document.getElementById('stage6Btn').addEventListener('click', function() {
        if (validateStage(6)) {
            // Hide login section and show services
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('servicesSection').style.display = 'block';
            
            // Check if user came from template marketplace
            const selectedTemplate = localStorage.getItem('selectedTemplate');
            if (selectedTemplate) {
                const templateData = JSON.parse(selectedTemplate);
                showNotification(`Registration successful! Your ${templateData.name} template order is pending.`, 'success', 6000);
            } else {
                showNotification('Registration successful! Welcome to our services.', 'success');
            }
        }
    });
    
    // Template option - show marketplace
    document.getElementById('template').addEventListener('click', function() {
        document.getElementById('servicesSection').style.display = 'none';
        document.getElementById('templateMarketplaceSection').style.display = 'block';
        initializeMarketplace();
        showNotification('Browse our template categories and select one to get started.', 'info');
    });
    
    document.getElementById('testimonials').addEventListener('click', function() {
        showNotification('Customer testimonials will be displayed here.', 'info');
    });
    
    // Back to services from marketplace
    document.getElementById('backToServicesFromMarketplace').addEventListener('click', function() {
        document.getElementById('templateMarketplaceSection').style.display = 'none';
        document.getElementById('servicesSection').style.display = 'block';
    });
});