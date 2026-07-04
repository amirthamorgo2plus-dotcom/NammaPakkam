// Client-side image compression — no dependency, keeps the free tier safe.
// Resizes to <=maxDim px on the long edge and re-encodes as JPEG at `quality`,
// so a phone photo (3–5 MB) becomes ~100–250 KB before it ever hits storage.

export interface CompressOptions {
  maxDim?: number; // longest edge in px
  quality?: number; // 0..1 JPEG quality
}

export async function compressImage(
  file: File,
  { maxDim = 1000, quality = 0.7 }: CompressOptions = {}
): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file; // browser can't decode — fall back to original

  let { width, height } = bitmap;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
  );
  // If compression somehow produced a bigger file, keep the smaller one.
  if (!blob) return file;
  return blob.size < file.size ? blob : file;
}
