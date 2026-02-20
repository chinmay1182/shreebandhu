
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

    // Construct paths
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, subdir);
    const uploadPath = path.join(uploadDir, filename);

    // Debug logging
    const logMessage = `
--- Upload Attempt ---
Time: ${new Date().toISOString()}
Original Name: ${file.name}
Clean Name: ${cleanName}
Filename: ${filename}
Upload Dir: ${uploadDir}
Full Path: ${uploadPath}
Process CWD: ${process.cwd()}
File Size: ${buffer.length} bytes
----------------------
`;
    console.log(logMessage);

    // Write debug log to root
    try {
        await fs.promises.appendFile(path.join(process.cwd(), 'upload_debug.log'), logMessage);
    } catch (logError) {
        console.error("Failed to write debug log", logError);
    }

    try {
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            await fs.promises.mkdir(uploadDir, { recursive: true });
        }

        // Write file
        await fs.promises.writeFile(uploadPath, buffer);

        // Verify file exists immediately after write
        if (fs.existsSync(uploadPath)) {
            await fs.promises.appendFile(path.join(process.cwd(), 'upload_debug.log'), `SUCCESS: File confirmed at ${uploadPath}\n`);
        } else {
            await fs.promises.appendFile(path.join(process.cwd(), 'upload_debug.log'), `FAILURE: File NOT found at ${uploadPath} immediately after write\n`);
        }

    } catch (error) {
        await fs.promises.appendFile(path.join(process.cwd(), 'upload_debug.log'), `ERROR: ${error}\n`);
        throw error;
    }

    return `/${subdir}/${filename}`;
}

export async function deleteFile(filePath: string) {
    if (!filePath) return;
    try {
        const fullPath = path.join(process.cwd(), 'public', filePath);
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}
