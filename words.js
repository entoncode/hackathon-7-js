import fs from 'node:fs/promises';

export default async function readFile(filePath) {
    try {
        // Read the file content
        return await fs.readFile(filePath, 'utf-8');
    } catch (err) {
        console.error('Error reading file:', err);
    }
}
