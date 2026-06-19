document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY NAV HEADER EFFECT ---
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load

    // --- MOBILE MENU OVERLAY ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    const toggleMobileMenu = () => {
        const isOpen = mobileNav.classList.toggle('open');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    };

    menuToggle.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // --- INTERACTIVE MENU TABS ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.menu-tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle active classes on buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active classes on content panes
            tabContents.forEach(pane => {
                if (pane.id === targetTab) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // --- BOOKING MODAL LOGIC ---
    const bookButtons = document.querySelectorAll('.btn-book-trigger');
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const bookingForm = document.getElementById('bookingForm');

    const openModal = (e) => {
        if (e) e.preventDefault();
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    bookButtons.forEach(btn => btn.addEventListener('click', openModal));
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Form Submission Handler
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('guestName').value;
            const size = document.getElementById('partySize').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;

            alert(`Thank you, ${name}! Your table request for ${size} guests on ${date} at ${time} has been submitted. We will send a confirmation SMS shortly.`);
            
            bookingForm.reset();
            closeModal();
        });
    }

    // --- INTERSECTION OBSERVER FOR SCROLL REVEALS ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Unobserve to animate only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
