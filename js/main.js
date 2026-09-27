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
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    const toggleNav = () => {
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    const closeNav = () => {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger?.addEventListener('click', toggleNav);
    overlay?.addEventListener('click', closeNav);
    closeBtn?.addEventListener('click', closeNav);
    
    // Close nav when clicking a link
    links.forEach(link => link.addEventListener('click', closeNav));
    
    // Close nav when clicking dropdown menu links
    document.querySelectorAll('.mobile-dropdown-menu a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Dropdown toggles
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = toggle.closest('.mobile-dropdown');
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-dropdown')) {
            document.querySelectorAll('.mobile-dropdown.active').forEach(d => {
                d.classList.remove('active');
            });
        }
    });
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

// ---------------------------------------------------------------------------
// Visual-viewport pinning for modals.
//
// .modal-overlay is position:fixed with top:0/bottom:0, so it is sized to the
// LAYOUT viewport. On a phone the browser toolbar and the on-screen keyboard
// cover part of that area, which leaves the bottom of the dialog (the submit
// button) in a region the user cannot scroll to: the scroll range ends at the
// layout viewport, not at the visible edge. Pinning the overlay to the visual
// viewport makes its scroll area end exactly where the user's screen ends, so
// the button can always be scrolled into view.
// ---------------------------------------------------------------------------
function pinToVisualViewport(el) {
    var vv = window.visualViewport;
    if (!vv || !el) return function () {};

    function sync() {
        el.style.top = vv.offsetTop + 'px';
        el.style.height = vv.height + 'px';
        el.style.bottom = 'auto';
    }

    sync();
    // visualViewport.resize is what fires when the on-screen keyboard opens on
    // iOS; window.resize covers browsers that resize the layout viewport
    // instead (Android with interactive-widget=resizes-content).
    vv.addEventListener('resize', sync);
    vv.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);

    return function unpin() {
        vv.removeEventListener('resize', sync);
        vv.removeEventListener('scroll', sync);
        window.removeEventListener('resize', sync);
        window.removeEventListener('orientationchange', sync);
        el.style.top = '';
        el.style.height = '';
        el.style.bottom = '';
    };
}

// WhatsApp Inquiry Modal
function initWhatsAppModal() {
    const whatsappBtn = document.getElementById('whatsappFloatBtn');
    const modal = document.getElementById('whatsappModal');
    const closeBtn = modal?.querySelector('.modal-close');
    const form = document.getElementById('whatsappForm');
    
    if (!whatsappBtn || !modal) return;

    // Tracks the visual-viewport binding while the modal is open
    let unpinOverlay = null;

    // Open modal
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        unpinOverlay = pinToVisualViewport(modal);
    });

    // Close modal
    const closeModal = () => {
        if (unpinOverlay) {
            unpinOverlay();
            unpinOverlay = null;
        }
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Keep the field being edited visible once the on-screen keyboard has
    // animated in - otherwise the keyboard hides what is being typed.
    form?.addEventListener('focusin', (e) => {
        if (!e.target || e.target.tagName !== 'INPUT') return;
        setTimeout(function () {
            if (e.target.isConnected) {
                e.target.scrollIntoView({ block: 'center' });
            }
        }, 300);
    });

    // Form submission - redirect to WhatsApp with details
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            pincode: formData.get('pincode'),
            city: formData.get('city'),
            state: formData.get('state')
        };

        // Validate required fields
        if (!data.fullName || !data.phone || !data.email || !data.pincode || !data.city || !data.state) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Build WhatsApp message
        const message = `Hello Trackship Logistics,

I would like to inquire about your services.

*Full Name:* ${data.fullName}
*Phone:* ${data.phone}
*Email:* ${data.email}
*Pincode:* ${data.pincode}
*City:* ${data.city}
*State:* ${data.state}

Please contact me regarding my logistics requirements.`;

        const whatsappUrl = 'https://wa.me/919136601185?text=' + encodeURIComponent(message);

        // window.open() is frequently vetoed by popup blockers and privacy
        // extensions (Brave/uBlock block wa.me), and some browsers refuse it
        // from a submit handler. Detect the failure and fall back instead of
        // silently doing nothing.
        let opened = null;
        try {
            opened = window.open(whatsappUrl, '_blank');
        } catch (err) {
            opened = null;
        }

        const blocked = !opened || opened.closed || typeof opened.closed === 'undefined';

        if (blocked) {
            // Keep the modal open and hand the user a real link they can tap.
            showWhatsAppFallback(whatsappUrl, form);
            showToast('Tap the green button to open WhatsApp', 'error');
            return;
        }

        closeModal();
        removeWhatsAppFallback();
        showToast('Opening WhatsApp...', 'success');
        form.reset();
    });
}

// Render a tappable WhatsApp link inside the modal when a popup is blocked.
// A real anchor click is a direct user gesture and cannot be popup-blocked.
function showWhatsAppFallback(url, form) {
    const existing = document.getElementById('waFallback');
    if (existing) {
        existing.querySelector('a').href = url;
        return;
    }

    const wrap = document.createElement('div');
    wrap.id = 'waFallback';
    wrap.className = 'wa-fallback';

    const note = document.createElement('p');
    note.className = 'wa-fallback-note';
    note.textContent = 'Your browser blocked the automatic redirect. Tap below to send your details on WhatsApp:';

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'btn wa-fallback-btn';
    link.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i> Open WhatsApp';

    wrap.appendChild(note);
    wrap.appendChild(link);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertBefore(wrap, submitBtn);
    } else {
        form.appendChild(wrap);
    }

    // On short screens the fallback lands below the fold - bring it into view.
    // Use a plain instant scroll on a timer: requestAnimationFrame can be
    // throttled (background/hidden tabs) and smooth scrolling can be
    // interrupted, either of which leaves the button off-screen.
    var overlay = wrap.closest('.modal-overlay');
    if (overlay) {
        setTimeout(function () {
            overlay.scrollTop = overlay.scrollHeight;
        }, 60);
    }
}

function removeWhatsAppFallback() {
    const el = document.getElementById('waFallback');
    if (el) el.remove();
}

// Interactive Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => observer.observe(item));
}

// Parallax Scroll Effect
function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    if (parallaxSections.length === 0) return;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = section.offsetHeight;
            
            // Only apply parallax when section is in viewport
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const bg = section.querySelector('.parallax-bg');
                if (bg) {
                    const speed = 0.5;
                    const yPos = -(scrollY - sectionTop) * speed;
                    bg.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            }
        });
    };

    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
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
    initInstagramFloat();
    initWhatsAppModal();
    initTimelineAnimation();
    initWelcomeAudio();
    initCookieConsent();
    initParallax();
});

// Welcome Audio - Play on first visit (index.html only)
function initWelcomeAudio() {
    // Only run on index.html
    const isIndex = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname === '/' || 
                    window.location.pathname === '/index.html';
    if (!isIndex) return;

    const hasVisited = sessionStorage.getItem('trackship_welcome_played');
    if (hasVisited) return;

    const audio = new Audio('assets/audio/welcome.mp3');
    audio.volume = 0.7;
    
    // Try to play on first user interaction
    const playAudio = () => {
        audio.play().catch(() => {
            // Autoplay blocked, wait for interaction
        });
        document.removeEventListener('click', playAudio);
        document.removeEventListener('keydown', playAudio);
    };

    document.addEventListener('click', playAudio, { once: true });
    document.addEventListener('keydown', playAudio, { once: true });
    
    // Also try immediate play (works if user has interacted with site before)
    audio.play().then(() => {
        sessionStorage.setItem('trackship_welcome_played', 'true');
    }).catch(() => {
        // Will play on first interaction via playAudio
    });

    // Mark as played when audio ends or after 30 seconds
    audio.addEventListener('ended', () => {
        sessionStorage.setItem('trackship_welcome_played', 'true');
    });
    
    setTimeout(() => {
        sessionStorage.setItem('trackship_welcome_played', 'true');
    }, 30000);
}

// Cookie Consent Management
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (!cookieConsent) return;

    const acceptAllBtn = document.getElementById('cookieAcceptAll');
    const rejectBtn = document.getElementById('cookieReject');
    const preferencesBtn = document.getElementById('cookiePreferences');
    const savePreferencesBtn = document.getElementById('cookieSavePreferences');
    const preferencesPanel = document.getElementById('cookiePreferencesPanel');
    const toggles = {
        analytics: document.getElementById('toggleAnalytics'),
        marketing: document.getElementById('toggleMarketing'),
        functional: document.getElementById('toggleFunctional')
    };

    // Check if consent already given
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
        applyConsent(JSON.parse(consent));
        return;
    }

    // Show consent banner after a short delay
    setTimeout(() => {
        cookieConsent.classList.add('show');
    }, 1000);

    // Accept all
    acceptAllBtn?.addEventListener('click', () => {
        const consent = {
            essential: true,
            analytics: true,
            marketing: true,
            functional: true,
            timestamp: Date.now()
        };
        saveConsent(consent);
        cookieConsent.classList.remove('show');
    });

    // Reject non-essential
    rejectBtn?.addEventListener('click', () => {
        const consent = {
            essential: true,
            analytics: false,
            marketing: false,
            functional: false,
            timestamp: Date.now()
        };
        saveConsent(consent);
        cookieConsent.classList.remove('show');
    });

    // Toggle preferences panel
    preferencesBtn?.addEventListener('click', () => {
        preferencesPanel.classList.toggle('show');
    });

    // Save preferences
    savePreferencesBtn?.addEventListener('click', () => {
        const consent = {
            essential: true,
            analytics: toggles.analytics?.classList.contains('active') || false,
            marketing: toggles.marketing?.classList.contains('active') || false,
            functional: toggles.functional?.classList.contains('active') || false,
            timestamp: Date.now()
        };
        saveConsent(consent);
        cookieConsent.classList.remove('show');
        preferencesPanel.classList.remove('show');
    });

    // Toggle handlers
    Object.keys(toggles).forEach(key => {
        const toggle = toggles[key];
        toggle?.addEventListener('click', () => {
            if (!toggle.disabled) {
                toggle.classList.toggle('active');
                toggle.setAttribute('aria-pressed', toggle.classList.contains('active'));
            }
        });
    });

    // Close on outside click
    cookieConsent?.addEventListener('click', (e) => {
        if (e.target === cookieConsent) {
            preferencesPanel.classList.remove('show');
        }
    });

    function saveConsent(consent) {
        localStorage.setItem('cookieConsent', JSON.stringify(consent));
        applyConsent(consent);
    }

    function applyConsent(consent) {
        // Apply analytics
        if (consent.analytics) {
            enableAnalytics();
        } else {
            disableAnalytics();
        }
        
        // Apply marketing
        if (consent.marketing) {
            enableMarketing();
        } else {
            disableMarketing();
        }
        
        // Apply functional
        if (consent.functional) {
            enableFunctional();
        } else {
            disableFunctional();
        }
    }

    function enableAnalytics() {
        // Add Google Analytics, etc.
        console.log('Analytics enabled');
    }

    function disableAnalytics() {
        console.log('Analytics disabled');
    }

    function enableMarketing() {
        console.log('Marketing enabled');
    }

    function disableMarketing() {
        console.log('Marketing disabled');
    }

    function enableFunctional() {
        console.log('Functional enabled');
    }

    function disableFunctional() {
        console.log('Functional disabled');
    }
}
