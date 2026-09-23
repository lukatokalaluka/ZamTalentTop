const safeProtocols = new Set(['https:', 'http:']);

export function isSafeExternalUrl(value) {
  try {
    const url = new URL(value);
    return safeProtocols.has(url.protocol);
  } catch {
    return false;
  }
}

export function getProfileMedia(profile) {
  if (Array.isArray(profile.media) && profile.media.length > 0) {
    return profile.media.filter((item) => item && isSafeExternalUrl(item.url));
  }

  return (profile.portfolioImages || []).map((url, index) => ({
    id: `${profile.slug}-portfolio-${index}`,
    type: 'image',
    title: `Portfolio work ${index + 1}`,
    url,
    access: 'public',
  })).filter((item) => isSafeExternalUrl(item.url));
}

export function formatMediaType(type) {
  return {
    image: 'Image',
    audio: 'Audio',
    video: 'Video',
    document: 'File',
  }[type] || 'Media';
}
