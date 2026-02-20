
import path from 'path';
import fs from 'fs';

export async function handleFileUpload(file: File, subdir: string = 'uploads'): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();

    // Get original filename and extension
    const originalName = file.name;
    
    // Extract extension (everything after the last dot)
    const lastDotIndex = originalName.lastIndexOf('.');
    let ext = '';
    let basename = originalName;
    
    if (lastDotIndex > 0 && lastDotIndex < originalName.length - 1) {
        ext = originalName.substring(lastDotIndex).toLowerCase();
        basename = originalName.substring(0, lastDotIndex);
    } else {
        ext = '.jpg'; // Default if no extension
    }

    // Sanitize basename (allow alphanumeric, dots, hyphens, and underscores)
    // Replace spaces and other special chars with hyphens, but keep dots, hyphens, underscores
    const sanitizedBasename = basename
        .replace(/[^a-zA-Z0-9.\-_]/g, '-') // Replace invalid chars with hyphens
        .replace(/\.+/g, '.') // Replace multiple consecutive dots with single dot
        .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
        .replace(/^[-.]+|[-.]+$/g, ''); // Remove leading/trailing dots and hyphens

    // Ensure basename is not empty
    const finalBasename = sanitizedBasename || 'image';
    const filename = `${finalBasename}-${timestamp}${ext}`;

    // Construct paths
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, subdir);
    const uploadPath = path.join(uploadDir, filename);

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
        await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    // Write file and wait for it to complete
    await fs.promises.writeFile(uploadPath, buffer);

    // Verify file was written successfully
    if (!fs.existsSync(uploadPath)) {
        throw new Error('Failed to write file to disk');
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
