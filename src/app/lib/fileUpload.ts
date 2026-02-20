
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

    // Construct paths - use absolute path resolution
    const cwd = process.cwd();
    const publicDir = path.resolve(cwd, 'public');
    const uploadDir = path.resolve(publicDir, subdir);
    const uploadPath = path.resolve(uploadDir, filename);

    console.log('File upload details:', {
        originalName,
        filename,
        cwd,
        publicDir,
        uploadDir,
        uploadPath,
        fileSize: buffer.length
    });

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
        console.log(`Creating directory: ${uploadDir}`);
        await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    // Write file and wait for it to complete
    console.log(`Writing file to: ${uploadPath}`);
    await fs.promises.writeFile(uploadPath, buffer, { mode: 0o644 });

    // Verify file was written successfully
    if (!fs.existsSync(uploadPath)) {
        console.error(`File verification failed: ${uploadPath} does not exist`);
        throw new Error(`Failed to write file to disk: ${uploadPath}`);
    }

    // Verify file size matches
    const stats = await fs.promises.stat(uploadPath);
    if (stats.size !== buffer.length) {
        console.error(`File size mismatch: expected ${buffer.length}, got ${stats.size}`);
        throw new Error(`File size mismatch: expected ${buffer.length}, got ${stats.size}`);
    }

    // Log file permissions for debugging
    console.log(`File written successfully. Size: ${stats.size}, Mode: ${stats.mode.toString(8)}`);

    const imageUrl = `/${subdir}/${filename}`;
    console.log(`File uploaded successfully: ${imageUrl}`);
    
    return imageUrl;
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
