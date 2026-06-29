/**
 * Admin Panel Layout Script
 * Handles mobile sidebar toggling, backdrop, and responsive navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const mobileToggleBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    
    // Create and append backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    function openSidebar() {
        sidebar.classList.add('show');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling on body when sidebar is open on mobile
    }

    function closeSidebar() {
        sidebar.classList.remove('show');
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Toggle on Hamburger Click
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', openSidebar);
    }

    // Close on Close Button Click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    // Close on Backdrop Click
    backdrop.addEventListener('click', closeSidebar);

    // Auto-close when clicking a nav-item (on mobile)
    const navItems = document.querySelectorAll('.admin-sidebar .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeSidebar();
            }
        });
    });

    // Handle window resize to clean up state
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeSidebar(); // Ensure backdrop is removed and body scroll restored if resized to desktop
        }
    });
});

// --- GLOBAL ADMIN FORM LOADING STATE ---
// Automatically adds a loading spinner to any form's submit button to prevent double-clicks
// and give users visual feedback during Cloudinary uploads or database saves.
document.addEventListener('submit', (e) => {
    if (e.target.tagName === 'FORM') {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            // Prevent double submission
            if (submitBtn.dataset.loading === 'true') {
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }
            // Store original state
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.dataset.loading = 'true';
            
            // Apply loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Processing...';
            submitBtn.disabled = true;
        }
    }
});

// Intercept fetch to reset any loading buttons once the network request finishes
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    try {
        return await originalFetch.apply(this, args);
    } finally {
        // Once any fetch completes, restore the submit buttons
        document.querySelectorAll('button[type="submit"][data-loading="true"]').forEach(btn => {
            if (document.body.contains(btn)) {
                btn.innerHTML = btn.dataset.originalText;
                btn.dataset.loading = 'false';
                btn.disabled = false;
            }
        });
    }
};
