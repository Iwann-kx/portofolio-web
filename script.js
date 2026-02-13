// ===========================
// PORTFOLIO JAVASCRIPT
// ===========================

// 1. SMOOTH SCROLL & ACTIVE NAV
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
});

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// ===========================
// 2. ANIMATED COUNTING STATS
// ===========================
function animateCounter(element, finalValue, duration = 2000) {
    let currentValue = 0;
    const increment = finalValue / (duration / 16);
    const startTime = Date.now();

    const updateCounter = () => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            element.textContent = finalValue;
        } else {
            element.textContent = Math.floor(currentValue);
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
}

const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            const finalValue = parseInt(entry.target.textContent);
            animateCounter(entry.target, finalValue);
        }
    });
});

document.querySelectorAll('.counter').forEach(counter => {
    countersObserver.observe(counter);
});

// ===========================
// 3. PARTICLE BACKGROUND ANIMATION
// ===========================
function createParticleBackground(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const ctx = canvas.getContext('2d');
    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    container.style.position = 'relative';
    container.appendChild(canvas);

    // Responsive canvas
    window.addEventListener('resize', () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });
}

// ===========================
// 4. LAZY LOAD IMAGES
// ===========================
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imgObserver.observe(img));
}

// ===========================
// 5. FORM VALIDATION & SUBMISSION
// ===========================
function initializeFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.querySelector('[name="name"]').value;
        const email = form.querySelector('[name="email"]').value;
        const message = form.querySelector('[name="message"]').value;

        // Validation
        if (!name || !email || !message) {
            showNotification('Semua field harus diisi!', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Email tidak valid!', 'error');
            return;
        }

        // Simulate sending
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';

        setTimeout(() => {
            showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===========================
// 6. DARK MODE TOGGLE
// ===========================
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;

    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isNowDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isNowDark);
        darkModeToggle.innerHTML = isNowDark
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    });
}

// ===========================
// 7. PORTFOLIO FILTER
// ===========================
function initializePortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.dataset.category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('show'), 10);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => (item.style.display = 'none'), 300);
                }
            });
        });
    });
}

// ===========================
// 8. SCROLL TO TOP BUTTON
// ===========================
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===========================
// 9. TYPING EFFECT
// ===========================
function typeEffect(element, text, speed = 100) {
    let charIndex = 0;
    element.textContent = '';

    function type() {
        if (charIndex < text.length) {
            element.textContent += text[charIndex];
            charIndex++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===========================
// 10. MODAL HANDLER
// ===========================
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.init();
    }

    init() {
        if (!this.modal) return;

        this.closeBtn?.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open() {
        if (this.modal) {
            this.modal.style.display = 'block';
            setTimeout(() => this.modal.classList.add('show'), 10);
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('show');
            setTimeout(() => (this.modal.style.display = 'none'), 300);
        }
    }
}

// ===========================
// 11. SKILL BARS ANIMATION
// ===========================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.level-bar');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    });

    skillBars.forEach(bar => barObserver.observe(bar));
}

// ===========================
// 12. SOCIAL SHARE
// ===========================
function shareOnSocial(platform, title, url = window.location.href) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// ===========================
// INITIALIZE ALL FEATURES
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    initializeFormHandler();
    initializeDarkMode();
    initializePortfolioFilter();
    initializeScrollToTop();
    animateSkillBars();

    // Optional: Uncomment to use particle background
    // createParticleBackground('hero');

    console.log('🎨 Portfolio JavaScript loaded successfully!');
});

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Get current time with greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

// Format currency
function formatCurrency(amount, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Berhasil disalin ke clipboard!', 'success');
    });
}

console.log('%c Portfolio Portfolio Admin Panel', 'color: #6366f1; font-size: 16px; font-weight: bold;');
