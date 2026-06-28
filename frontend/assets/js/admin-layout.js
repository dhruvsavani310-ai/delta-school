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
