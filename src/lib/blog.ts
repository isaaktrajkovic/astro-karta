export const normalizeExternalImageUrl = (value: string) => {
  const url = String(value || '').trim();
  if (!url) return '';

  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//i);
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/i);
  const driveUcMatch = url.match(/drive\.google\.com\/uc\?[^#]*id=([^&]+)/i);
  const fileId = driveFileMatch?.[1] || driveOpenMatch?.[1] || driveUcMatch?.[1];
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url;
};
