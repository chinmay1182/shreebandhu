import path from 'path';
import fs from 'fs';

export async function handleFileUpload(file: File, subdir: string = 'uploads'): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    // Sanitize filename (allow alphanumeric, dots, hyphens, and underscores)
    const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');

    // Get extension and normalize to lowercase
    let ext = path.extname(cleanName);
    if (!ext) {
        ext = '.jpg'; // Default if no extension
    }
    ext = ext.toLowerCase();

    // Get basename without extension
    const basename = path.basename(cleanName, path.extname(cleanName));

    const filename = `${basename}-${timestamp}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', subdir);
    const uploadPath = path.join(uploadDir, filename);

    await fs.promises.mkdir(uploadDir, { recursive: true });
    console.log(`Writing file to: ${uploadPath}`);
    await fs.promises.writeFile(uploadPath, buffer);

    return `/${subdir}/${filename}`;
}

export async function deleteFile(filePath: string) {
    if (!filePath) return;
    try {
        const fullPath = path.join(process.cwd(), 'public', filePath);
        await fs.promises.unlink(fullPath);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}
