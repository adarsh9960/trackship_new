/* 
 * Trackship Logistics - Premium Redesign
 * Pure Vanilla JS
 */

// Header Scroll Effect
function initHeader() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-overlay');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const links = document.querySelectorAll('.mobile-nav-links a');

    const toggleNav = () => {
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    hamburger?.addEventListener('click', toggleNav);
    overlay?.addEventListener('click', toggleNav);
    closeBtn?.addEventListener('click', toggleNav);
    links.forEach(link => link.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) toggleNav();
    }));
}

// Scroll Reveal Animations
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => observer.observe(reveal));
}

// Counting Animation
function initCounters() {
    const counterItems = document.querySelectorAll('[data-count]');
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counterItems.forEach(item => observer.observe(item));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50; // Adjust speed
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target.toLocaleString() + (el.dataset.suffix || "");
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current).toLocaleString() + (el.dataset.suffix || "");
            }
        }, 30);
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close others
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Form Handling (AJAX)
// Form Handling (Universal API)
function initForms() {
    window.submitToAPI = function (formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        const formData = new FormData(form);

        fetch("https://itzadarsh.co.in/api/v1/post", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    form.reset();
                    // Mark as submitted in this session
                    sessionStorage.setItem('trackship_session_submitted', 'true');
                    localStorage.setItem('trackship_submitted', 'true');
                    // Close modal if open
                    const modal = form.closest('.modal-overlay');
                    if (modal) closeModal();
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(err => {
                alert("Network error — please try again.");
                console.error(err);
            });
    };

    // ===== POPUP FORM =====
    document.getElementById("popupForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        submitToAPI("popupForm");
    });

    // ===== CONTACT FORM =====
    document.getElementById("contactForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        submitToAPI("contactForm");
    });

    // ===== QUICK INQUIRY FORM =====
    document.getElementById("quickInquiryForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        submitToAPI("quickInquiryForm");
    });
}

// Toast Notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Modal Logic
function initModal() {
    const modal = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal) return;

    const isSubmitted = sessionStorage.getItem('trackship_session_submitted');

    if (!isSubmitted) {
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 2000);
    }

    // Manual triggers
    const triggerBtns = document.querySelectorAll('.quick-form-btn');
    triggerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    });

    closeBtn?.addEventListener('click', closeModal);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.display = 'none';
        localStorage.setItem('trackship_modal_closed', new Date().getTime());
    }
}

// Back to Top
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    btn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Highlight Active Link
function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
}

// Instagram Deep Linking
function initInstagramFloat() {
    const instaBtn = document.querySelector('.instagram-float');
    if (!instaBtn) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const username = "trackshiplogistics";

    if (isMobile) {
        instaBtn.setAttribute('href', `instagram://user?username=${username}`);
    } else {
        instaBtn.setAttribute('href', `https://instagram.com/${username}`);
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
        if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.dot'));

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Responsive adjustment
    window.addEventListener('resize', () => {
        track.style.transition = 'none';
        goToSlide(currentIndex);
        setTimeout(() => {
            track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initScrollReveal();
    initCounters();
    initFAQ();
    initForms();
    initModal();
    initBackToTop();
    highlightActiveLink();
    initTestimonialSlider();
    initInstagramFloat();
});
