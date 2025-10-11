/**
 * Utility functions for handling image URLs
 */

export const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    // If already absolute URL or blob URL, return as is
    if (imageUrl.startsWith('http') || imageUrl.startsWith('blob:')) {
        return imageUrl;
    }
    
    // Convert relative URL to absolute
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://task-management-app-ma8h.onrender.com'
        : 'http://localhost:3001';
    
    return `${baseUrl}${imageUrl}`;
};

export const isValidImageUrl = (imageUrl) => {
    if (!imageUrl) return false;
    
    // Check if it's a blob URL (for previews)
    if (imageUrl.startsWith('blob:')) return true;
    
    // Check if it's a valid HTTP(S) URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return true;
    
    // Check if it's a relative URL starting with /
    if (imageUrl.startsWith('/')) return true;
    
    return false;
};
