export const generateEdlHtml = (data: any) => {
  const { info, compteurs, pieces } = data;

  // On crée les lignes des compteurs
  const compteursHtml = compteurs.map((c: any) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>${c.type}</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${c.num || '-'}</td>
      <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-weight: bold;">${c.valeur || '-'}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${c.loc || '-'}</td>
    </tr>
  `).join('');

  // On crée les blocs pour chaque pièce
  const piecesHtml = pieces.map((p: any) => {
    const elementsHtml = p.elements.map((el: any) => {
      // Gestion des photos pour cet élément
      const photosHtml = el.photos && el.photos.length > 0 
        ? `<div style="margin-top: 5px; display: flex; gap: 5px; flex-wrap: wrap;">
            ${el.photos.map((photo: string) => 
              `<img src="${photo}" style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #ccc; border-radius: 4px;" />`
            ).join('')}
           </div>`
        : '';

      return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${el.nom}</td>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: ${
          el.etat === 'Neuf' ? '#dcfce7' :
          el.etat === 'Bon état' ? '#dbeafe' :
          el.etat === 'État d\'usage' ? '#fef9c3' : '#fee2e2'
        }">${el.etat}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${el.com || ''}
          ${photosHtml}
        </td>
      </tr>
    `;
    }).join('');

    return `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="background-color: #f1f5f9; padding: 10px; border-radius: 5px; margin-bottom: 10px; border-left: 5px solid #2563eb;">${p.nom}</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="width: 25%; text-align: left; padding: 8px; border: 1px solid #ddd;">Élément</th>
              <th style="width: 25%; text-align: left; padding: 8px; border: 1px solid #ddd;">État</th>
              <th style="width: 50%; text-align: left; padding: 8px; border: 1px solid #ddd;">Commentaires & Photos</th>
            </tr>
          </thead>
          <tbody>
            ${elementsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  // LE HTML COMPLET
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Helvetica, Arial, sans-serif; color: #333; padding: 20px; }
        h1 { color: #2563eb; text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .info-box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
        .value { font-size: 14px; font-weight: bold; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <h1>ÉTAT DES LIEUX - ${info.type.toUpperCase()}</h1>
      
      <div class="info-grid">
        <div class="info-box">
          <div class="label">Adresse</div>
          <div class="value">${info.adresse}</div>
        </div>
        <div class="info-box">
          <div class="label">Date</div>
          <div class="value">${info.date}</div>
        </div>
        <div class="info-box">
          <div class="label">Locataire(s)</div>
          <div class="value">${info.locataire}</div>
        </div>
        <div class="info-box">
          <div class="label">Bailleur / Mandataire</div>
          <div class="value">${info.bailleur}</div>
        </div>
      </div>

      <div class="section">
        <h3>⚡ Relevé des Compteurs</h3>
        <table style="font-size: 12px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Type</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">N° Série</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Index</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Emplacement</th>
            </tr>
          </thead>
          <tbody>
            ${compteursHtml}
          </tbody>
        </table>
      </div>

      <div class="section">
        ${piecesHtml}
      </div>

      <div style="margin-top: 50px; border-top: 2px solid #ddd; padding-top: 20px; display: flex; justify-content: space-between;">
        <div style="width: 45%; height: 100px; border: 1px dashed #ccc; padding: 10px;">
          <div class="label">Signature Locataire</div>
          <div style="margin-top: 10px; font-size: 10px; color: #999;">(Mention "Lu et approuvé")</div>
        </div>
        <div style="width: 45%; height: 100px; border: 1px dashed #ccc; padding: 10px;">
          <div class="label">Signature Bailleur / Mandataire</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #94a3b8;">
        Document généré via EDL Lille Expert - ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;
};
