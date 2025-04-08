/**
 * Main JavaScript File for Roy Kimathi's Portfolio
 * Handles navigation, animations, and overall page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // General Page Setup
    // =============================================
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // =============================================
    // Mobile Navigation
    // =============================================
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // =============================================
    // Navigation Effects
    // =============================================
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // =============================================
    // Scroll Animations
    // =============================================
    
    const animateElements = document.querySelectorAll('[data-animate]');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.bottom >= 0
        );
    }
    
    // Add animation class when element is in view
    function checkScroll() {
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }
    
    // Initial check on page load
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // =============================================
    // Page Analytics Tracking
    // =============================================
    
    // Track page view
    function trackPageView() {
        const pageUrl = window.location.pathname + window.location.hash;
        const referrer = document.referrer;
        
        // In a production environment, you would call the API here
        // For now, we'll just log it
        console.log(`Tracking page view: ${pageUrl}, Referrer: ${referrer}`);
        
        // Example API call (uncomment when backend is ready)
        // fetch('/api/analytics/pageview', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ pageUrl, referrer })
        // });
    }
    
    // Track initial page view
    trackPageView();
    
    // Track subsequent page views when navigating with hash links
    window.addEventListener('hashchange', trackPageView);
    
    // =============================================
    // Skill Reactions Functionality
    // =============================================
    
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Handle skill reactions
    skillItems.forEach(item => {
        const reactionBtns = item.querySelectorAll('.reaction-btn');
        
        reactionBtns.forEach(btn => {
            btn.addEventListener('click', async function() {
                const skillName = item.dataset.skill;
                const reactionType = this.dataset.reaction;
                
                // Disable button temporarily to prevent spam
                this.disabled = true;
                
                // In a production environment, you would call the API here
                console.log(`Adding ${reactionType} reaction to skill: ${skillName}`);
                
                // Example API call (uncomment when backend is ready)
                // try {
                //     const response = await fetch(`/api/skills/${encodeURIComponent(skillName)}/reactions`, {
                //         method: 'POST',
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         body: JSON.stringify({ reactionType })
                //     });
                //     
                //     const result = await response.json();
                //     
                //     if (result.success) {
                //         // Update the UI with new counts
                //         const likeCount = item.querySelector('[data-reaction="like"] .count');
                //         const loveCount = item.querySelector('[data-reaction="love"] .count');
                //         
                //         if (likeCount) likeCount.textContent = result.counts.like;
                //         if (loveCount) loveCount.textContent = result.counts.love;
                //     } else {
                //         console.error(result.error);
                //     }
                // } catch (error) {
                //     console.error('Error adding reaction:', error);
                // } finally {
                //     this.disabled = false;
                // }
                
                // For demo purposes - increment count locally
                const countElement = this.querySelector('.count');
                if (countElement) {
                    const currentCount = parseInt(countElement.textContent) || 0;
                    countElement.textContent = currentCount + 1;
                }
                
                // Re-enable button after a short delay
                setTimeout(() => {
                    this.disabled = false;
                }, 1000);
            });
        });
    });
    
    // Load initial skill reactions (would call API in production)
    function loadSkillReactions() {
        console.log('Loading skill reactions...');
        
        // Example API call (uncomment when backend is ready)
        // fetch('/api/skills/reactions')
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.success) {
        //             data.skills.forEach(skill => {
        //                 const skillItem = document.querySelector(`.skill-item[data-skill="${skill.skill_name}"]`);
        //                 
        //                 if (skillItem) {
        //                     const likeCount = skillItem.querySelector('[data-reaction="like"] .count');
        //                     const loveCount = skillItem.querySelector('[data-reaction="love"] .count');
        //                     
        //                     if (likeCount) likeCount.textContent = skill.like_count;
        //                     if (loveCount) loveCount.textContent = skill.love_count;
        //                 }
        //             });
        //         }
        //     })
        //     .catch(error => console.error('Error loading skill reactions:', error));
    }
    
    // Initial load of skill reactions
    loadSkillReactions();
    
    // =============================================
    // Helper Functions
    // =============================================
    
    // Debounce function for scroll events
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Throttle function for scroll events
    function throttle(func, limit = 100) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
});