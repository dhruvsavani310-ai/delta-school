const fs = require('fs');

const transcriptPath = 'C:\\Users\\dhruv\\.gemini\\antigravity-ide\\brain\\a01e1910-1df8-4b6e-9cbd-78bc7af74e39\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

for (const line of lines) {
    if (!line) continue;
    const data = JSON.parse(line);
    if (data.type === 'VIEW_FILE' && data.content && data.content.includes('<style>')) {
        const match = data.content.match(/File Path: `file:\/\/\/d:\/delta%20school\/frontend\/views\/(.*?)\.html`/);
        if (match) {
            const fileName = match[1];
            if (['gallery', 'teachers', 'events', 'top-students'].includes(fileName)) {
                console.log('--- Found style in ' + fileName + ' ---');
                const linesContent = data.content.split('\n');
                let inStyle = false;
                for (const lc of linesContent) {
                    const originalLine = lc.replace(/^\d+:\s?/, '');
                    if (originalLine.includes('<style>')) {
                        inStyle = true;
                    }
                    if (inStyle) console.log(originalLine);
                    if (originalLine.includes('</style>')) {
                        inStyle = false;
                    }
                }
            }
        }
    }
}
