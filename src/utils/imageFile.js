function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Fayl oxunmadı'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function drawToDataUrl(source, maxSize, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(source);
    img.onload = () => {
      const longestSide = Math.max(img.width, img.height) || 1;
      const scale = Math.min(1, maxSize / longestSide);
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      try {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        resolve(source);
      }
    };
    img.src = source;
  });
}

export function readImageFile(file, { maxSize = 1400, quality = 0.85 } = {}) {
  if (!file) return Promise.resolve('');
  if (!file.type || !file.type.startsWith('image/')) {
    return Promise.reject(new Error('Yalnız şəkil faylı seçin'));
  }

  return readAsDataUrl(file).then((source) => drawToDataUrl(source, maxSize, quality));
}
