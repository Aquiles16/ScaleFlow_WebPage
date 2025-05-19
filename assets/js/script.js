/**
 * Scaleflow Technologies Website JavaScript
 * 
 * This file contains all interactive elements for the Scaleflow Technologies website,
 * including navigation, animations, form validation, and user experience enhancements.
 */

'use strict';

// Main initialization function when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initForms();
    enhanceAccessibility();
});

/**
 * Navigation functionality
 * Handles mobile menu toggle and navigation behavior
 */
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Apply styles when active
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = 'var(--shadow-md)';
                
                // Add ARIA attributes for accessibility
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                navLinks.setAttribute('aria-hidden', 'false');
            } else {
                navLinks.style.display = '';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Initialize ARIA attributes
        mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    }
    
    // Navbar scroll effect
    if (navbar) {
        const handleScroll = debounce(function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
    }
    
    // Add active class to current page nav link
    const currentLocation = window.location.pathname;
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Smooth scrolling and scroll-based effects
 */
function initScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

/**
 * Initialize animations and visual effects
 */
function initAnimations() {
    // Parallax effect for the hero section
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }
    
    // Interactive hover effects for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('i').style.transform = 'scale(1.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('i').style.transform = 'scale(1)';
        });
    });
}

/**
 * Form initialization and validation
 */
function initForms() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        const emailInput = document.getElementById('email-input');
        const messageContainer = newsletterForm.querySelector('.form-message');
        
        // Email validation function
        function validateEmail(email) {
            const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return re.test(email.trim());
        }
        
        // Form submission handler
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Security: Sanitize input
            const email = emailInput.value.trim();
            const sanitizedEmail = DOMPurify.sanitize(email);
            
            if (!validateEmail(sanitizedEmail)) {
                showFormMessage(messageContainer, 'Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (would be an API call in production)
            showFormMessage(messageContainer, 'Processing...', 'processing');
            
            // Simulate network delay
            setTimeout(function() {
                // Success simulation
                showFormMessage(messageContainer, 'Thank you for subscribing!', 'success');
                newsletterForm.reset();
                
                // Clear success message after delay
                setTimeout(() => {
                    messageContainer.textContent = '';
                    messageContainer.className = 'form-message';
                }, 3000);
                
            }, 1000);
        });
        
        // Form input validation on blur
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() !== '' && !validateEmail(this.value)) {
                showFormMessage(messageContainer, 'Please enter a valid email address.', 'error');
            } else {
                messageContainer.textContent = '';
                messageContainer.className = 'form-message';
            }
        });
    }
}

/**
 * Enhance accessibility features
 */
function enhanceAccessibility() {
    // Add appropriate ARIA roles
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.setAttribute('role', 'main');
    
    // Make focus visible for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });
    
    // Remove class when mouse is used
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-user');
    });
}

/**
 * Utility Functions
 */

// Display form messages with appropriate styling
function showFormMessage(container, message, type) {
    if (!container) return;
    
    container.textContent = message;
    container.className = 'form-message';
    container.classList.add(type);
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// DOM Purify minimal implementation for demo purposes
// Note: In production, use the actual DOMPurify library instead
const DOMPurify = {
    sanitize: function(str) {
        // This is a simplified version for demo - not for production use
        return String(str).replace(/[&<>"']/g, function(match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }
};

// Check for browser dark mode preference and adapt
function checkColorSchemePreference() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkModeMediaQuery.matches) {
        document.documentElement.classList.add('dark-mode');
    }
    
    // Listen for changes
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    });
}

// Execute on load
checkColorSchemePreference();
