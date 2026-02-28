/* ==========================================================================
   DOM Elements & Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initCustomCursor();
    initScrollAnimations();
    initHeaderScroll();
    
    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

/* ==========================================================================
   Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    
    if (!themeBtn) return;
    
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    // Apply saved theme or default to dark (if no saved theme and body has dark-mode class)
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }
    
    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            // Switch to Dark
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            // Switch to Light
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
}

/* ==========================================================================
   Mobile Menu Navigation
   ========================================================================== */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeBtn = document.querySelector('.theme-btn');
    
    if (!mobileToggle || !navMenu) return;
    
    // Toggle Menu
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            // Ensure theme button is visible in mobile menu
            if(themeBtn) themeBtn.style.display = 'block'; 
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });
}

/* ==========================================================================
   Smooth Header on Scroll
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   Intersection Observer (Scroll Animations)
   ========================================================================== */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    
    // Options for the observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // visible amount before triggering
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    
    // Observe each element
    fadeElements.forEach(el => observer.observe(el));
    
    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const navObserver = new IntersectionObserver((entries) => {
        let currentSectionId = '';
        
        // Find the section that is currently most visible
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                currentSectionId = entry.target.getAttribute('id');
            }
        });
        
        // Update active class on nav links
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, { threshold: 0.5 }); // 50% of section needs to be visible
    
    sections.forEach(section => navObserver.observe(section));
}

/* ==========================================================================
   Custom Cursor Logic
   ========================================================================== */
function initCustomCursor() {
    // Only init on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Update target mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Make sure cursor elements are visible once mouse moves
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        
        // Dot follows instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    // Hide cursors when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    // Smooth animation loop for outer circle
    function animateCursor() {
        // Easing factor (lower = smoother/slower)
        const ease = 0.2; 
        
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    requestAnimationFrame(animateCursor);
    
    // Hover Effects for Interactive Elements
    const interactives = document.querySelectorAll('a, button, .hover-lift, input, textarea');
    
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}
