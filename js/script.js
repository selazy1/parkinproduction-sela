// Main JavaScript for CV. Parkin Production

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const backToTopBtn = document.getElementById('backToTop');
const scrollProgress = document.querySelector('.scroll-progress');
const loadingScreen = document.querySelector('.loading-screen');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initTheme();
    initMobileMenu();
    initScrollProgress();
    initBackToTop();
    initAnimations();
    initFormValidation();
    
    // Remove loading screen
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        updateThemeIcons('dark');
    } else {
        html.classList.remove('dark');
        updateThemeIcons('light');
    }
    
    // Add event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    // Toggle theme
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcons('light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcons('dark');
    }
    
    // Add transition class for smooth theme change
    html.classList.add('theme-transition');
    setTimeout(() => {
        html.classList.remove('theme-transition');
    }, 500);
}

function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('#themeToggle i, #themeToggleMobile i');
    icons.forEach(icon => {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Mobile Menu Management
function initMobileMenu() {
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuButton.querySelector('i');
    
    if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
}

// Scroll Progress
function initScrollProgress() {
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', updateScrollProgress);
}

function updateScrollProgress() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
    }
}

// Back to Top Button
function initBackToTop() {
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', toggleBackToTop);
    backToTopBtn.addEventListener('click', scrollToTop);
}

function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Animations
function initAnimations() {
    // Add animation classes to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            
            // Reset previous states
            inputs.forEach(input => {
                input.classList.remove('border-red-500', 'border-green-500');
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
            
            // Validate each input
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'This field is required');
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email address');
                } else {
                    showSuccess(input);
                }
            });
            
            if (isValid) {
                submitForm(this);
            }
        });
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    input.classList.add('border-red-500');
    
    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-message text-red-500 text-sm mt-1';
    errorMsg.textContent = message;
    
    input.parentNode.appendChild(errorMsg);
    
    // Remove error on input
    input.addEventListener('input', function() {
        input.classList.remove('border-red-500');
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
}

function showSuccess(input) {
    input.classList.add('border-green-500');
    
    // Remove success class after 3 seconds
    setTimeout(() => {
        input.classList.remove('border-green-500');
    }, 3000);
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message bg-green-500 text-white p-4 rounded-xl mt-4 animate-fade-in';
        successMsg.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-3 text-xl"></i>
                <div>
                    <h4 class="font-bold">Message Sent Successfully!</h4>
                    <p class="text-sm">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
            </div>
        `;
        
        form.appendChild(successMsg);
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            successMsg.remove();
            
            // Reset all success borders
            form.querySelectorAll('.border-green-500').forEach(el => {
                el.classList.remove('border-green-500');
            });
        }, 3000);
    }, 1500);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') return;
        
        if (href.startsWith('#') && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMobileMenu();
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Portfolio gallery filter (for portfolio page)
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize portfolio filter if on portfolio page
if (document.querySelector('.portfolio-filter')) {
    initPortfolioFilter();
}

// Service cards hover effect enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Current year for footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Add CSS for theme transition
const style = document.createElement('style');
style.textContent = `
    .theme-transition * {
        transition: background-color 0.5s ease, 
                    border-color 0.5s ease, 
                    color 0.5s ease !important;
    }
    
    .header-scroll.scrolled {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .dark .header-scroll.scrolled {
        background: rgba(10, 10, 15, 0.95);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);