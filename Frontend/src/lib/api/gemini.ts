/**
 * Convert a data URL to a base64 string
 * Removes the data:image/xxx;base64, prefix
 */
export function dataURLToBase64(dataURL: string): string {
  return dataURL.split(',')[1];
}

/**
 * Convert a base64 string to a data URL
 */
export function base64ToDataURL(base64: string, mimeType = 'image/jpeg'): string {
  return `data:${mimeType};base64,${base64}`;
}