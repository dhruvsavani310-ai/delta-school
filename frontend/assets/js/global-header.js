class GlobalHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <!-- Announcement Bar -->
            <div id="announcementBar">
                <div class="marquee-content" id="marqueeContent"></div>
            </div>

            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg navbar-light navbar-custom fixed-top">
                <div class="container">
                    <a class="navbar-brand d-flex align-items-center" href="index.html">
                        <img src="../assets/images/logo.png" alt="Delta School Logo" height="50" class="me-2" style="border-radius: 5px;">
                        <span class="fs-4 fw-bold" style="color: var(--primary-color);">Delta School</span>
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul class="navbar-nav align-items-center">
                            <li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="index.html#about">About</a></li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="communityDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    School Community
                                </a>
                                <ul class="dropdown-menu border-0 shadow-sm" aria-labelledby="communityDropdown">
                                    <li><a class="dropdown-item py-2" href="teachers.html">Teachers</a></li>
                                    <li><a class="dropdown-item py-2" href="top-students.html">Top Students</a></li>
                                </ul>
                            </li>
                            <li class="nav-item"><a class="nav-link" href="index.html#events">Events</a></li>
                            <li class="nav-item"><a class="nav-link" href="index.html#gallery">Gallery</a></li>
                            <li class="nav-item ms-lg-3 mt-2 mt-lg-0">
                                <a href="index.html#admission" class="btn btn-secondary-custom btn-sm px-4 py-2"
                                    style="color: white !important;">Apply Now</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;

        this.initStickyScroll();
        this.loadAnnouncements();
        this.initMobileMenuAutoClose(); // Initialize mobile menu auto-close functionality
        
        // Ensure Back to Top button is only injected once even if multiple global-headers exist
        if (!document.querySelector('.back-to-top-wrapper')) {
            this.initBackToTop(); 
        }
    }

    initStickyScroll() {
        const navbar = this.querySelector('.navbar-custom');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
        
        // Trigger once on load in case the page is already scrolled
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        }
    }

    initMobileMenuAutoClose() {
        // Select all links that should trigger the menu to close.
        // This includes standard nav links, dropdown items, and the 'Apply Now' button.
        // We specifically exclude '.dropdown-toggle' so clicking a dropdown parent doesn't close the menu prematurely.
        const navLinks = this.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item, .btn-secondary-custom');
        const navbarCollapse = this.querySelector('.navbar-collapse');

        if (!navbarCollapse) return;

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only attempt to close if the menu is currently open (indicated by the 'show' class in Bootstrap)
                if (navbarCollapse.classList.contains('show')) {
                    // Use Bootstrap's official Collapse API to hide the menu gracefully with animations
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        // Get the existing Bootstrap Collapse instance, or create a new one without immediately toggling it
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                        bsCollapse.hide();
                    } else {
                        // Fallback: manually remove the class if the Bootstrap API is somehow unavailable
                        navbarCollapse.classList.remove('show');
                    }
                }
            });
        });
    }

    async loadAnnouncements() {
        try {
            const res = await fetch('/api/announcements');
            if (res.ok) {
                const announcements = await res.json();
                if (announcements.length > 0) {
                    const bar = this.querySelector('#announcementBar');
                    bar.style.display = 'flex';
                    document.body.classList.add('has-announcement');
                    
                    const marquee = this.querySelector('#marqueeContent');
                    let html = '';
                    announcements.forEach(a => {
                        const content = a.linkUrl 
                            ? `<a href="${a.linkUrl}" style="color: ${a.color};"><i class="fa-solid fa-bullhorn me-2"></i>${a.text}</a>` 
                            : `<span style="color: ${a.color};"><i class="fa-solid fa-bullhorn me-2"></i>${a.text}</span>`;
                        html += `<div class="announcement-item">${content}</div>`;
                    });
                    
                    // Duplicate items to ensure smooth scrolling loop
                    marquee.innerHTML = html + html + html; 
                }
            }
        } catch(e) { console.error('Failed to load announcements', e); }
    }

    initBackToTop() {
        // Create and inject HTML for the Back to Top button
        const wrapper = document.createElement('div');
        wrapper.className = 'back-to-top-wrapper';
        wrapper.innerHTML = `
            <button id="backToTopBtn" class="back-to-top" aria-label="Back to Top">
                <i class="fa-solid fa-arrow-up"></i>
            </button>
        `;
        document.body.appendChild(wrapper);

        const btn = wrapper.querySelector('#backToTopBtn');

        // Throttle scroll event using requestAnimationFrame for high performance
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    // Show button after scrolling down 300px
                    if (window.scrollY > 300) {
                        wrapper.classList.add('show');
                    } else {
                        wrapper.classList.remove('show');
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        // Check visibility immediately on load
        if (window.scrollY > 300) {
            wrapper.classList.add('show');
        }

        // Smooth scroll to top on click
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

customElements.define('global-header', GlobalHeader);

// Global Preloader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('global-preloader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => loader.remove(), 500);
    }
});
