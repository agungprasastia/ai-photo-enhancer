import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
}

const defaultOptions: CompressionOptions = {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
};

/**
 * Compress image before upload for faster upload speed
 * Only compresses if file is larger than threshold
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const mergedOptions = { ...defaultOptions, ...options };

    // Skip compression for small files (< 1MB)
    if (file.size < 1 * 1024 * 1024) {
        return file;
    }

    try {
        const compressedFile = await imageCompression(file, {
            maxSizeMB: mergedOptions.maxSizeMB!,
            maxWidthOrHeight: mergedOptions.maxWidthOrHeight!,
            useWebWorker: mergedOptions.useWebWorker!,
            fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
        });

        console.log(
            `Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
        );

        return compressedFile;
    } catch (error) {
        console.warn('Compression failed, using original file:', error);
        return file;
    }
}
