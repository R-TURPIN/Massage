export const generateEdlHtml = (data: any) => {
  const { info, compteurs, pieces, signatures } = data;

  // Style des badges d'état : Couleurs pastels pro et texte sombre
  const getEtatStyle = (etat: string) => {
    switch (etat) {
      case 'Neuf': return 'background-color: #ecfdf5; color: #064e3b; border: 1px solid #d1fae5;'; // Vert très pâle
      case 'Bon état': return 'background-color: #eff6ff; color: #1e3a8a; border: 1px solid #dbeafe;'; // Bleu très pâle
      case 'État d\'usage': return 'background-color: #fefce8; color: #713f12; border: 1px solid #fef9c3;'; // Jaune très pâle
      case 'Mauvais état': return 'background-color: #fef2f2; color: #7f1d1d; border: 1px solid #fee2e2;'; // Rouge très pâle
      default: return 'background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;'; // Gris
    }
  };

  const compteursHtml = compteurs.map((c: any) => `
    <tr>
      <td class="td-cell" style="width: 20%; font-weight: bold;">${c.type}</td>
      <td class="td-cell" style="width: 30%;">${c.num || '—'}</td>
      <td class="td-cell" style="width: 20%; font-family: 'Courier New', monospace; font-weight: bold;">${c.valeur || '—'}</td>
      <td class="td-cell" style="width: 30%;">${c.loc || '—'}</td>
    </tr>
  `).join('');

  const piecesHtml = pieces.map((p: any) => {
    const elementsHtml = p.elements.map((el: any) => {
      // Photos en grille propre
      const photosHtml = el.photos && el.photos.length > 0 
        ? `<div style="margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap;">
            ${el.photos.map((photo: string) => 
              `<div style="width: 70px; height: 70px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
                 <img src="${photo}" style="width: 100%; height: 100%; object-fit: contain;" />
               </div>`
            ).join('')}
           </div>`
        : '';

      const badgeStyle = getEtatStyle(el.etat);

      return `
      <tr style="page-break-inside: avoid;">
        <td class="td-cell" style="width: 25%; vertical-align: top;">
          <div style="font-weight: 600;">${el.nom}</div>
        </td>
        <td class="td-cell" style="width: 20%; vertical-align: top;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; ${badgeStyle}">
            ${el.etat}
          </span>
        </td>
        <td class="td-cell" style="width: 55%; vertical-align: top; color: #4b5563;">
          ${el.com ? `<div style="margin-bottom: 4px; font-style: italic;">"${el.com}"</div>` : ''}
          ${photosHtml}
        </td>
      </tr>
    `;
    }).join('');

    return `
      <div style="margin-bottom: 25px; page-break-inside: avoid;">
        <div style="border-bottom: 2px solid #000; margin-bottom: 10px; padding-bottom: 4px;">
          <h3 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; color: #000;">${p.nom}</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th class="th-cell">Élément</th>
              <th class="th-cell">État</th>
              <th class="th-cell">Observations & Photos</th>
            </tr>
          </thead>
          <tbody>
            ${elementsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  // Gestion signatures
  const signLocataire = signatures?.locataire 
    ? `<img src="${signatures.locataire}" style="max-height: 60px; display: block; margin: 5px auto;" />` 
    : '<div style="color: #d1d5db; font-size: 10px; text-align: center; margin-top: 25px;">Non signé</div>';

  const signBailleur = signatures?.bailleur 
    ? `<img src="${signatures.bailleur}" style="max-height: 60px; display: block; margin: 5px auto;" />` 
    : '<div style="color: #d1d5db; font-size: 10px; text-align: center; margin-top: 25px;">Non signé</div>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
          color: #111827; 
          padding: 40px; 
          font-size: 12px; 
          line-height: 1.4; 
        }
        
        /* UTILITAIRES TABLEAUX */
        table { width: 100%; border-collapse: collapse; }
        .th-cell { text-align: left; padding: 6px 8px; border-bottom: 1px solid #000; font-weight: bold; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; }
        .td-cell { padding: 8px; border-bottom: 1px solid #e5e7eb; }

        /* EN-TÊTE */
        .header-title { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin: 0; }
        .header-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; margin-top: 2px; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px 0; }
        .info-group { margin-bottom: 8px; }
        .info-label { font-size: 9px; text-transform: uppercase; color: #6b7280; font-weight: bold; letter-spacing: 0.5px; }
        .info-value { font-size: 13px; font-weight: 500; color: #000; }

        .section-header { font-size: 14px; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #000; display: inline-block; }

        /* SIGNATURES */
        .signature-box { width: 48%; border: 1px solid #d1d5db; height: 120px; position: relative; }
        .signature-label { position: absolute; top: 0; left: 0; background: #f3f4f6; padding: 4px 8px; font-size: 9px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #d1d5db; border-right: 1px solid #d1d5db; }
        .signature-mention { position: absolute; bottom: 5px; right: 5px; font-size: 8px; color: #9ca3af; font-style: italic; }
      </style>
    </head>
    <body>
      
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <h1 class="header-title">État des Lieux</h1>
          <div class="header-subtitle">Conforme Loi ALUR</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; font-size: 14px; text-transform: uppercase;">${info.type}</div>
          <div style="color: #6b7280;">Date : ${info.date}</div>
        </div>
      </div>
      
      <div class="info-grid">
        <div>
          <div class="info-group">
            <div class="info-label">Adresse du bien</div>
            <div class="info-value">${info.adresse}</div>
          </div>
          <div class="info-group">
            <div class="info-label">Bailleur / Mandataire</div>
            <div class="info-value">${info.bailleur}</div>
          </div>
        </div>
        <div>
          <div class="info-group">
            <div class="info-label">Locataire(s)</div>
            <div class="info-value">${info.locataire}</div>
          </div>
          <div class="info-group">
            <div class="info-label">Réalisé par</div>
            <div class="info-value">EDL Lille Expert</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 40px;">
        <div class="section-header">Relevé des Compteurs</div>
        <table style="border-top: 1px solid #000;">
          <thead>
            <tr>
              <th class="th-cell">Type</th>
              <th class="th-cell">N° Série</th>
              <th class="th-cell">Index Relevé</th>
              <th class="th-cell">Emplacement</th>
            </tr>
          </thead>
          <tbody>
            ${compteursHtml}
          </tbody>
        </table>
      </div>

      ${piecesHtml}

      <div style="margin-top: 50px; page-break-inside: avoid;">
        <div class="section-header">Signatures</div>
        <div style="display: flex; justify-content: space-between;">
          
          <div class="signature-box">
            <div class="signature-label">Le Locataire</div>
            <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
              ${signLocataire}
            </div>
            <div class="signature-mention">Lu et approuvé</div>
          </div>

          <div class="signature-box">
            <div class="signature-label">Le Bailleur / Expert</div>
            <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
              ${signBailleur}
            </div>
            <div class="signature-mention">Certifié exact</div>
          </div>

        </div>
      </div>

      <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; pt: 10px; text-align: center; color: #9ca3af; font-size: 9px;">
        Document généré le ${new Date().toLocaleString('fr-FR')} — Page 1/1
      </div>

    </body>
    </html>
  `;
};
