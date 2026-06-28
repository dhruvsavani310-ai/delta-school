const fs = require('fs');
const path = require('path');

const viewsDir = 'd:\\delta school\\frontend\\views';
const publicPages = ['index.html', 'about.html', 'admissions.html', 'contact.html', 'events.html', 'gallery.html', 'notice.html', 'principal.html', 'teachers.html', 'top-students.html'];

publicPages.forEach(page => {
    const filePath = path.join(viewsDir, page);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Clean up announcement bar HTML (which usually is a div containing a div with marquee-content)
    content = content.replace(/<div id="announcementBar">[\s\S]*?<\/div>\s*<\/div>/gi, '');
    content = content.replace(/<script>\s*async function loadAnnouncements\(\)[\s\S]*?<\/script>/gi, '');
    
    // Clean up inline styles that have #announcementBar
    content = content.replace(/<style>[\s\S]*?#announcementBar[\s\S]*?<\/style>/gi, '');
    
    // Remove the navbar and replace with global-header
    content = content.replace(/<nav class="navbar[^>]*>[\s\S]*?<\/nav>/gi, '<global-header></global-header>');
    
    // Remove scroll script
    content = content.replace(/<script>\s*window\.addEventListener\('scroll', function \(\) \{\s*const navbar = document\.querySelector\('\.navbar-custom'\);[\s\S]*?<\/script>/gi, '');
    
    // Clean up comments
    content = content.replace(/<!-- Navbar Scroll Effect Script -->/gi, '');
    content = content.replace(/<!-- Announcement Bar -->/gi, '');
    content = content.replace(/<!-- End Announcement Bar -->/gi, '');
    content = content.replace(/<!-- Subpage Header -->/gi, '');
    content = content.replace(/<!-- Navbar -->/gi, '');
    content = content.replace(/<!-- Navbar injected by JS for simplicity in this artifact, or we just copy the standard navbar -->/gi, '');

    // Inject JS
    if (!content.includes('global-header.js')) {
        content = content.replace('</body>', '    <script src="../assets/js/global-header.js" defer></script>\n</body>');
    }

    // Fix multiple global-headers just in case
    const matchCount = (content.match(/<global-header><\/global-header>/g) || []).length;
    if (matchCount > 1) {
        let first = true;
        content = content.replace(/<global-header><\/global-header>/g, () => {
            if (first) { first = false; return '<global-header></global-header>'; }
            return '';
        });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + page);
});
