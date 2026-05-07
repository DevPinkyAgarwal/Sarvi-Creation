/**
 * Appends Cloudinary optimization flags to a URL if it's a Cloudinary URL.
 * f_auto: Automatically choose the best format (WebP, AVIF, etc.)
 * q_auto: Automatically choose the best quality/compression
 */
export const optimizeImage = (url: string, options: { width?: number; height?: number; crop?: string; quality?: number } = {}) => {
    if (!url) return '';

    // Handle Cloudinary
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        const parts = url.split('/upload/');
        const flags = ['f_auto', 'q_auto'];
        
        if (options.width) flags.push(`w_${options.width}`);
        if (options.height) flags.push(`h_${options.height}`);
        if (options.crop) flags.push(`c_${options.crop}`);
        if (options.quality) flags.push(`q_${options.quality}`);
        
        return `${parts[0]}/upload/${flags.join(',')}/${parts[1]}`;
    }

    // Handle Unsplash
    if (url.includes('images.unsplash.com')) {
        const baseUrl = url.split('?')[0];
        const params = new URLSearchParams(url.split('?')[1] || '');
        
        params.set('auto', 'format,compress');
        if (options.width) params.set('w', options.width.toString());
        if (options.height) params.set('h', options.height.toString());
        if (options.crop) params.set('fit', options.crop === 'fill' ? 'crop' : options.crop);
        if (options.quality) params.set('q', options.quality.toString());
        else if (!params.has('q')) params.set('q', '75'); // Lower default for better speed
        
        return `${baseUrl}?${params.toString()}`;
    }

    return url;
};
