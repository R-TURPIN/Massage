/**
 * Compresse une image pour qu'elle soit légère dans le PDF.
 * Redimensionne à max 800px de large et réduit la qualité à 60%.
 */
export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        
        // Si l'image est plus petite que 800px, on garde la taille originale
        const width = (scaleSize < 1) ? MAX_WIDTH : img.width;
        const height = (scaleSize < 1) ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject("Impossible de créer le contexte canvas");
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Compression JPEG qualité 0.6 (60%)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataUrl);
      };
      
      img.onerror = (err) => reject(err);
    };
    
    reader.onerror = (err) => reject(err);
  });
};
