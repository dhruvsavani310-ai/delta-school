const fs = require('fs');
const path = require('path');

const deleteLocalFile = (fileUrl) => {
    if (!fileUrl) return;
    try {
        // e.g., fileUrl might be '/uploads/media/banner-12345.jpg'
        const absolutePath = path.join(__dirname, '../../', fileUrl);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    } catch (err) {
        console.error('Error deleting local file:', fileUrl, err.message);
    }
};

module.exports = { deleteLocalFile };
