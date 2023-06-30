export function imageToWebp(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = imageUrl;

    const canvas = document.createElement('canvas');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        const webpDataURL = canvas.toDataURL('image/webp');

        resolve(webpDataURL);
      } else {
        reject(new Error('Failed to get canvas context.'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image.'));
    };
  });
}
