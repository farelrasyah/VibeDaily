/**
 * Image Quality Enhancement Utility
 * Automatically enhances image URLs to load HD/Full HD versions
 * without changing the visual UI or layout
 */

export interface ImageEnhancementOptions {
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}

/**
 * Image Quality Enhancement Utility
 * Automatically enhances image URLs to load HD/Full HD versions
 * without changing the visual UI or layout
 */

export interface ImageEnhancementOptions {
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}

/**
 * Enhance image URL to load higher quality version
 * Supports various image hosting services and CDNs
 * More aggressive approach for Indonesian news sources
 */
export function enhanceImageQuality(
  imageUrl: string | null,
  options: ImageEnhancementOptions = {}
): string | null {
  if (!imageUrl) return null;

  const {
    targetWidth = 1920, // Full HD width
    targetHeight = 1080, // Full HD height
    quality = 95,
    format = 'webp'
  } = options;

  try {
    const url = new URL(imageUrl);

    // Handle Indonesian news sources with more aggressive enhancement
    if (url.hostname.includes('cnnindonesia.com')) {
      // CNN Indonesia often has thumbnail versions, try to get larger version
      let path = url.pathname;
      if (path.includes('/thumbnail/') || path.includes('/small/')) {
        path = path.replace('/thumbnail/', '/large/').replace('/small/', '/large/');
        url.pathname = path;
      }
      // Remove any size constraints
      const params = new URLSearchParams(url.search);
      params.delete('width');
      params.delete('height');
      params.delete('w');
      params.delete('h');
      params.delete('size');
      url.search = params.toString();
      return url.toString();
    }

    if (url.hostname.includes('tempo.co')) {
      // Tempo.co images - try to get higher quality
      const params = new URLSearchParams(url.search);
      params.set('width', '1200');
      params.set('height', '675');
      params.set('quality', '90');
      url.search = params.toString();
      return url.toString();
    }

    if (url.hostname.includes('republika.co.id')) {
      // Republika - remove size constraints and try larger version
      let path = url.pathname;
      if (path.includes('/thumbnail/')) {
        path = path.replace('/thumbnail/', '/large/');
        url.pathname = path;
      }
      return url.toString();
    }

    if (url.hostname.includes('okezone.com') || url.hostname.includes('sindikasi.okezone.com')) {
      // Okezone - try to get larger images
      const params = new URLSearchParams(url.search);
      params.set('width', '800');
      params.set('height', '450');
      url.search = params.toString();
      return url.toString();
    }

    if (url.hostname.includes('kumparan.com')) {
      // Kumparan - try to get higher quality
      const params = new URLSearchParams(url.search);
      params.set('width', '1000');
      params.set('height', '563');
      params.set('quality', '85');
      url.search = params.toString();
      return url.toString();
    }

    if (url.hostname.includes('suara.com')) {
      // Suara.com - remove size constraints
      const params = new URLSearchParams(url.search);
      params.delete('width');
      params.delete('height');
      params.delete('w');
      params.delete('h');
      url.search = params.toString();
      return url.toString();
    }

    if (url.hostname.includes('jawapos.com')) {
      // Jawa Pos - try larger version
      let path = url.pathname;
      if (path.includes('/thumbnail/') || path.includes('/small/')) {
        path = path.replace('/thumbnail/', '/').replace('/small/', '/');
        url.pathname = path;
      }
      return url.toString();
    }

    if (url.hostname.includes('bbc.com') || url.hostname.includes('bbc.co.uk')) {
      // BBC - try to get larger images
      const params = new URLSearchParams(url.search);
      params.set('width', '976');
      params.set('height', '549');
      url.search = params.toString();
      return url.toString();
    }

    if (url.hostname.includes('vice.com')) {
      // Vice - try to get larger images
      const params = new URLSearchParams(url.search);
      params.set('width', '1200');
      params.set('height', '675');
      url.search = params.toString();
      return url.toString();
    }

    // Generic CDN enhancement
    if (url.hostname.includes('cdn') || url.hostname.includes('media') ||
        url.hostname.includes('img') || url.hostname.includes('image')) {
      const params = new URLSearchParams(url.search);
      // Only add if no existing size parameters
      if (!params.has('width') && !params.has('w') && !params.has('height') && !params.has('h')) {
        params.set('width', targetWidth.toString());
        params.set('height', targetHeight.toString());
        params.set('quality', quality.toString());
        url.search = params.toString();
        return url.toString();
      }
    }

    // NewsAPI enhancement
    if (url.hostname.includes('newsapi.org') || url.hostname.includes('newsapi')) {
      const params = new URLSearchParams(url.search);
      params.set('width', targetWidth.toString());
      params.set('height', targetHeight.toString());
      params.set('quality', quality.toString());
      params.set('format', format);
      url.search = params.toString();
      return url.toString();
    }

    // Unsplash enhancement
    if (url.hostname.includes('unsplash.com')) {
      const params = new URLSearchParams(url.search);
      params.set('w', targetWidth.toString());
      params.set('h', targetHeight.toString());
      params.set('q', quality.toString());
      params.set('fit', 'crop');
      params.set('fm', format);
      url.search = params.toString();
      return url.toString();
    }

    // Default: return original URL if no enhancement possible
    return imageUrl;

  } catch (error) {
    console.warn('Failed to enhance image URL:', imageUrl, error);
    return imageUrl; // Return original on error
  }
}

/**
 * Hook to get enhanced image URL with automatic quality improvement and fallbacks
 */
export function useEnhancedImage(imageUrl: string | null): string | null {
  return enhanceImageQuality(imageUrl, {
    targetWidth: 1920,
    targetHeight: 1080,
    quality: 95,
    format: 'webp'
  });
}

/**
 * Generate multiple fallback URLs for better image loading
 */
export function generateImageFallbacks(imageUrl: string | null): string[] {
  if (!imageUrl) return [];

  const fallbacks = [imageUrl]; // Original URL first

  // Add enhanced version
  const enhanced = enhanceImageQuality(imageUrl, {
    targetWidth: 1920,
    targetHeight: 1080,
    quality: 90
  });
  if (enhanced && enhanced !== imageUrl) {
    fallbacks.unshift(enhanced); // Put enhanced first
  }

  // Add alternative sizes for fallbacks
  const medium = enhanceImageQuality(imageUrl, {
    targetWidth: 1280,
    targetHeight: 720,
    quality: 85
  });
  if (medium && !fallbacks.includes(medium)) {
    fallbacks.push(medium);
  }

  const large = enhanceImageQuality(imageUrl, {
    targetWidth: 1600,
    targetHeight: 900,
    quality: 88
  });
  if (large && !fallbacks.includes(large)) {
    fallbacks.push(large);
  }

  return [...new Set(fallbacks)]; // Remove duplicates
}

/**
 * Generate srcset for responsive images with multiple quality levels
 */
export function generateImageSrcSet(imageUrl: string | null): string {
  if (!imageUrl) return '';

  const sizes = [
    { width: 640, height: 360, descriptor: '640w' },
    { width: 1280, height: 720, descriptor: '1280w' },
    { width: 1920, height: 1080, descriptor: '1920w' },
  ];

  return sizes
    .map(size => {
      const enhancedUrl = enhanceImageQuality(imageUrl, {
        targetWidth: size.width,
        targetHeight: size.height,
        quality: 90,
        format: 'webp'
      });
      return `${enhancedUrl} ${size.descriptor}`;
    })
    .join(', ');
}