/**
 * Utility for compressing uploaded images on an off-screen HTML5 Canvas
 * Prevents localStorage QuotaExceededError while retaining 4K visual clarity.
 */
import { saveCloudStoreItem, isSupabaseConfigured } from '../services/supabase.js';



export function compressImageFile(file, maxWidth = 1400, maxHeight = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('لم يتم تحديد أي ملف'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('الملف المختار ليس صورة صالحة (يرجى اختيار JPG, PNG, WEBP)'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('تعذر قراءة ملف الصورة من جهازك'));
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('تعذر تحميل الصورة للمعالجة'));
      };

      img.onload = () => {
        let { width, height } = img;

        // Scale down while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context fails
          return resolve(e.target.result);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          // If canvas security or toDataURL fails, resolve original
          resolve(e.target.result);
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * High-Resolution 4K Image Processor:
 * Preserves ultra-high visual clarity (up to 2560x1600 / 4K UHD), using WebP/JPEG 
 * with GPU anti-aliasing and smart compression to fit smoothly in browser memory.
 */
export function compressHighResImageFile(file, maxWidth = 2560, maxHeight = 1600, quality = 0.88) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('لم يتم تحديد أي ملف'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('الملف المختار ليس صورة صالحة (يرجى اختيار JPG, PNG, WEBP)'));
    }

    const originalSize = file.size || 0;
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('تعذر قراءة ملف الصورة من جهازك'));
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('تعذر تحميل الصورة الأصلية للمعالجة الفائقة'));
      };

      img.onload = () => {
        const origWidth = img.naturalWidth || img.width;
        const origHeight = img.naturalHeight || img.height;

        let width = origWidth;
        let height = origHeight;

        // Determine resolution badge label
        let resolutionLabel = 'HD عالية الوضوح';
        if (origWidth >= 3840 || origHeight >= 2160) {
          resolutionLabel = '4K Ultra HD فائقة الدقة';
        } else if (origWidth >= 2560 || origHeight >= 1440) {
          resolutionLabel = '2.5K QHD سينمائية';
        } else if (origWidth >= 1920 || origHeight >= 1080) {
          resolutionLabel = '1080p Full HD عالية جداً';
        }

        // Scale down gracefully only if exceeding maximum bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            dataUrl: e.target.result,
            width: origWidth,
            height: origHeight,
            originalSize,
            compressedSize: originalSize,
            resolutionLabel
          });
        }

        // High-end bicubic smoothing for crisp sharp lines
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression-to-quality ratio, fallback to JPEG
        let dataUrl = '';
        let format = 'webp';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            throw new Error('WebP unsupported');
          }
        } catch {
          format = 'jpeg';
          try {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          } catch {
            dataUrl = e.target.result;
          }
        }

        // Approximate base64 payload size
        const compressedSize = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          width,
          height,
          origWidth,
          origHeight,
          format,
          originalSize,
          compressedSize,
          resolutionLabel
        });
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Safe localStorage setter with quota protection
 */
export function safeStorageSet(key, value) {
  let savedOk = false;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    savedOk = true;
  } catch (err) {
    console.warn(`[SafeStorage] Quota exceeded or storage error on ${key}:`, err);
    // If quota exceeded, try to clean old large temporary items
    try {
      localStorage.removeItem('portal-field-photos');
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      savedOk = true;
    } catch (e2) {
      console.error('[SafeStorage] Unable to save to localStorage:', e2);
    }
  }

  // Dispatch local window event so UI updates immediately
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }

  // Asynchronous background sync to Supabase Cloud
  if (isSupabaseConfigured()) {
    saveCloudStoreItem(key, value).catch(cloudErr => {
      console.warn(`[Supabase Cloud] فشل المزامنة السحابية لـ ${key}:`, cloudErr);
    });
  }

  return savedOk;
}


/**
 * Safe localStorage getter with fallback
 */
export function safeStorageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}
