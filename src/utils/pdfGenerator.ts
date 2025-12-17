// src/utils/pdfGenerator.ts

// REMPLACE ÇA par l'URL de ton Gotenberg sur Coolify (ex: https://gotenberg-xxx.sslip.io)
// Si tu es en HTTP, mets http. Mais attention aux images plus tard.
const GOTENBERG_URL = "http://p0socg8kgcs8w48o8sss8ogo.37.27.191.8.sslip.io"; 

export const downloadPdf = async (htmlContent: string, filename: string = "document.pdf") => {
  try {
    const formData = new FormData();
    // Gotenberg attend un fichier nommé "index.html"
    const blob = new Blob([htmlContent], { type: 'text/html' });
    formData.append('files', blob, 'index.html');

    // Options pour Gotenberg (marges, format...)
    formData.append('marginTop', '0');
    formData.append('marginBottom', '0');
    formData.append('marginLeft', '0');
    formData.append('marginRight', '0');

    console.log("🚀 Envoi à Gotenberg...");

    const response = await fetch(`${GOTENBERG_URL}/forms/chromium/convert/html`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erreur Gotenberg: ${response.statusText}`);
    }

    // On récupère le Blob (le fichier PDF)
    const pdfBlob = await response.blob();
    
    // On force le téléchargement dans le navigateur
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Requis pour Firefox
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // Nettoyage mémoire

    console.log("✅ PDF téléchargé !");
    return true;

  } catch (error) {
    console.error("Erreur PDF:", error);
    alert("Erreur lors de la génération du PDF. Vérifie l'URL Gotenberg !");
    return false;
  }
};
