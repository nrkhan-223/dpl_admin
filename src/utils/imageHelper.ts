export const DEFAULT_PROPERTY_FALLBACK =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

export const DEFAULT_AVATAR_FALLBACK =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export const PROPERTY_FALLBACKS: Record<string, string> = {
  penthouse:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  studio:
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  condo:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  villa:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Resolves an image URL so it works reliably in both local Vite dev and Vercel production.
 * Normalizes obsolete /src/assets/images/, bare filenames, and relative image paths.
 */
export function resolveImageUrl(
  url: string | null | undefined,
  fallback: string = DEFAULT_PROPERTY_FALLBACK
): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }
  const clean = url.trim();

  // If already absolute remote URL or base64 data URI
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // Handle /src/assets/images/ or src/assets/images/ -> /assets/images/
  if (clean.startsWith('/src/assets/images/')) {
    return clean.replace('/src/assets/images/', '/assets/images/');
  }
  if (clean.startsWith('src/assets/images/')) {
    return clean.replace('src/assets/images/', '/assets/images/');
  }

  // Handle /images/ or images/ -> /assets/images/
  if (clean.startsWith('/images/')) {
    return clean.replace('/images/', '/assets/images/');
  }
  if (clean.startsWith('images/')) {
    return clean.replace('images/', '/assets/images/');
  }

  // Handle bare filenames like prop_studio_loft... or avatar_...
  if (clean.startsWith('prop_') || clean.startsWith('avatar_')) {
    return `/assets/images/${clean}`;
  }

  // Handle root filenames /prop_... or /avatar_...
  if (clean.startsWith('/prop_') || clean.startsWith('/avatar_')) {
    return `/assets/images/${clean.substring(1)}`;
  }

  return clean;
}

/**
 * Handles image load errors gracefully by falling back to high-res CDN images.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_PROPERTY_FALLBACK
) {
  const target = event.currentTarget;
  if (target.dataset.hasFailed === 'true') {
    return;
  }
  target.dataset.hasFailed = 'true';
  target.src = fallback;
}
