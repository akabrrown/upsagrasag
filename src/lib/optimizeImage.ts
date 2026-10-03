export function optimizeCloudinaryUrl(url: string | null | undefined, options: { width?: number; height?: number; quality?: string } = {}): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;
  
  // If it already has some f_auto or similar transformations, don't duplicate
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
    return url;
  }

  const parts = url.split('/upload/');
  if (parts.length === 2) {
    let transformations = 'f_auto,q_auto';
    if (options.width) transformations += `,w_${options.width}`;
    if (options.height) transformations += `,h_${options.height}`;
    if (options.quality) transformations += `,q_${options.quality}`;
    
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }
  
  return url;
}
