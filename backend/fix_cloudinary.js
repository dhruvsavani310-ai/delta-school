const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace imageUrl = `/uploads/media/${req.file.filename}`; with req.file.path
    content = content.replace(/`\/uploads\/media\/\$\{req\.file\.filename\}`/g, 'req.file.path');
    
    // Remove deleteLocalFile lines
    content = content.replace(/if\s*\(req\.file\)\s*deleteLocalFile\([^)]+\);/g, '// if (req.file) { /* delete Cloudinary logic if needed */ }');
    
    fs.writeFileSync(filePath, content);
});

console.log('Routes updated for Cloudinary req.file.path');
