const fs = require('fs');
const path = require('path');

const dir = 'd:/delta school/frontend/views';
const files = fs.readdirSync(dir).filter(f => f.startsWith('admin-') && f.endsWith('.html'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  
  // 1. Remove inline <style>...</style> block
  content = content.replace(/<style>[\s\S]*?<\/style>/, '');

  // 2. Inject CSS and JS links
  if (!content.includes('admin-layout.css')) {
      content = content.replace('</head>', '    <link rel="stylesheet" href="../assets/css/admin-layout.css">\n</head>');
  }
  if (!content.includes('admin-layout.js')) {
      content = content.replace('</body>', '    <script src="../assets/js/admin-layout.js"></script>\n</body>');
  }

  // 3. Add mobile toggle button to topbar
  if (!content.includes('mobileMenuToggle') && content.includes('<div class="topbar">')) {
      const titleMatch = content.match(/<h4[^>]*>.*?<\/h4>/);
      if (titleMatch) {
          const toggleHtml = `<button id="mobileMenuToggle" class="mobile-toggle-btn d-md-none"><i class="fa-solid fa-bars"></i></button>\n            `;
          content = content.replace(titleMatch[0], toggleHtml + titleMatch[0]);
      }
  }

  // 4. Add close button to sidebar
  if (!content.includes('sidebarCloseBtn') && content.includes('<div class="sidebar">')) {
      content = content.replace('<div class="sidebar">', '<div class="sidebar">\n        <button id="sidebarCloseBtn" class="sidebar-close-btn d-md-none"><i class="fa-solid fa-xmark"></i></button>');
  }

  // 5. Wrap text inside sidebar nav-items in <span> so we can hide it on tablet
  // Currently: <a href="admin-dashboard.html" class="nav-item active"><i class="fa-solid fa-table-columns"></i> Dashboard</a>
  // Target:    <a href="admin-dashboard.html" class="nav-item active"><i class="fa-solid fa-table-columns"></i> <span>Dashboard</span></a>
  content = content.replace(/(<a[^>]*class="[^"]*nav-item[^"]*"[^>]*>\s*<i[^>]*><\/i>\s*)([^<]+)(<\/a>)/g, (match, p1, p2, p3) => {
      // If p2 is just whitespace, ignore
      if (p2.trim() === '') return match;
      // Ensure we haven't already wrapped it
      if (p2.includes('<span>')) return match;
      return `${p1}<span>${p2.trim()}</span>${p3}`;
  });

  fs.writeFileSync(fp, content);
});

console.log(`Updated ${files.length} admin files.`);
