const fs = require('fs');
const path = require('path');
const viewsDir = 'd:\\delta school\\frontend\\views';

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // Navbar replacements
            const navAbout = /<a class="nav-link" href="#about">About<\/a>/g;
            if (navAbout.test(content)) { content = content.replace(navAbout, '<a class="nav-link" href="index.html#about">About</a>'); updated = true; }

            const navEvents = /<a class="nav-link" href="events\.html">Events<\/a>/g;
            if (navEvents.test(content)) { content = content.replace(navEvents, '<a class="nav-link" href="index.html#events">Events</a>'); updated = true; }

            const navGallery = /<a class="nav-link" href="gallery\.html">Gallery<\/a>/g;
            if (navGallery.test(content)) { content = content.replace(navGallery, '<a class="nav-link" href="index.html#gallery">Gallery</a>'); updated = true; }

            const navAdmissions = /<a href="admissions\.html" class="btn btn-secondary-custom/g;
            if (navAdmissions.test(content)) { content = content.replace(navAdmissions, '<a href="index.html#admission" class="btn btn-secondary-custom'); updated = true; }

            // Footer Quick Links replacements
            const footerAbout = /<a href="#about">About Us<\/a>/g;
            if (footerAbout.test(content)) { content = content.replace(footerAbout, '<a href="index.html#about">About Us</a>'); updated = true; }

            const footerAdmissions = /<a href="admissions\.html">Admissions<\/a>/g;
            if (footerAdmissions.test(content)) { content = content.replace(footerAdmissions, '<a href="index.html#admission">Admissions</a>'); updated = true; }

            const footerEvents = /<a href="events\.html">Events<\/a>/g;
            if (footerEvents.test(content)) { content = content.replace(footerEvents, '<a href="index.html#events">Events</a>'); updated = true; }

            const footerContact = /<a href="contact\.html">Contact<\/a>/g;
            if (footerContact.test(content)) { content = content.replace(footerContact, '<a href="index.html#contact">Contact</a>'); updated = true; }

            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${file}`);
            }
        }
    }
}

processDir(viewsDir);
console.log("Done.");
