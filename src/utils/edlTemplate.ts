export const generateEdlHtml = (data: any) => {
  const { info, compteurs, pieces, signatures } = data;

  // Vert du modèle (environ)
  const PRIMARY_COLOR = "#059669"; // Un vert émeraude pro
  const BG_HEADER = "#ecfdf5"; // Fond vert très clair pour les en-têtes

  // Fonction pour les badges d'état (couleurs douces)
  const getEtatBadge = (etat: string) => {
    let color = "#374151";
    let bg = "#f3f4f6";
    
    switch (etat) {
      case 'Neuf': color = "#065f46"; bg = "#d1fae5"; break; // Vert
      case 'Bon état': color = "#1e40af"; bg = "#dbeafe"; break; // Bleu
      case 'État d\'usage': color = "#92400e"; bg = "#fef3c7"; break; // Jaune
      case 'Mauvais état': color = "#991b1b"; bg = "#fee2e2"; break; // Rouge
      case 'Non fonctionnel': color = "#fff"; bg = "#ef4444"; break; // Rouge vif
    }
    return `<span style="background: ${bg}; color: ${color}; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; text-transform: uppercase;">${etat}</span>`;
  };

  // Lignes Compteurs
  const compteursHtml = compteurs.map((c: any) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">${c.type}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb;">${c.num || ''}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace; font-weight: bold; color: ${PRIMARY_COLOR};">${c.valeur || ''}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb;">${c.loc || ''}</td>
    </tr>
  `).join('');

  // Blocs Pièces
  const piecesHtml = pieces.map((p: any) => {
    const elementsHtml = p.elements.map((el: any) => {
      const photosHtml = el.photos && el.photos.length > 0 
        ? `<div style="margin-top: 8px; display: flex; gap: 5px; flex-wrap: wrap;">
            ${el.photos.map((photo: string) => 
              `<img src="${photo}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" />`
            ).join('')}
           </div>`
        : '';

      return `
      <tr style="page-break-inside: avoid;">
        <td style="padding: 12px; border: 1px solid #e5e7eb; width: 30%; vertical-align: top;">
          <strong>${el.nom}</strong>
        </td>
        <td style="padding: 12px; border: 1px solid #e5e7eb; width: 20%; vertical-align: top; text-align: center;">
          ${getEtatBadge(el.etat)}
        </td>
        <td style="padding: 12px; border: 1px solid #e5e7eb; width: 50%; vertical-align: top; color: #4b5563;">
          ${el.com || ''}
          ${photosHtml}
        </td>
      </tr>
    `;
    }).join('');

    return `
      <div style="margin-bottom: 25px; page-break-inside: avoid;">
        <div style="background: ${PRIMARY_COLOR}; color: white; padding: 8px 15px; border-radius: 6px 6px 0 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
          ${p.nom}
        </div>
        <table style="width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <thead>
            <tr style="background: ${BG_HEADER};">
              <th style="padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; color: ${PRIMARY_COLOR}; border: 1px solid #e5e7eb;">Élément</th>
              <th style="padding: 8px; text-align: center; font-size: 11px; text-transform: uppercase; color: ${PRIMARY_COLOR}; border: 1px solid #e5e7eb;">État</th>
              <th style="padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; color: ${PRIMARY_COLOR}; border: 1px solid #e5e7eb;">Observations / Photos</th>
            </tr>
          </thead>
          <tbody>
            ${elementsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  // Signatures
  const signImgLoc = signatures?.locataire ? `<img src="${signatures.locataire}" style="height: 50px;" />` : '';
  const signImgBail = signatures?.bailleur ? `<img src="${signatures.bailleur}" style="height: 50px;" />` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; padding: 40px; font-size: 12px; line-height: 1.5; }
        h1 { text-align: center; color: ${PRIMARY_COLOR}; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid ${PRIMARY_COLOR}; display: inline-block; padding-bottom: 5px; }
        .header-checkbox { display: inline-block; width: 12px; height: 12px; border: 1px solid #000; margin-right: 5px; }
        .checked { background: #000; }
        
        /* BOXES INFOS */
        .box { border: 1px solid ${PRIMARY_COLOR}; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
        .box-title { background: ${BG_HEADER}; color: ${PRIMARY_COLOR}; font-weight: bold; padding: 8px 15px; border-bottom: 1px solid ${PRIMARY_COLOR}; text-transform: uppercase; font-size: 11px; }
        .box-content { padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #fff; }
        
        .field-label { font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 2px; }
        .field-value { font-weight: bold; font-size: 13px; }

        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        
        .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 10px; color: #9ca3af; text-align: center; }
        .legend { font-size: 10px; color: #6b7280; margin-top: 5px; font-style: italic; }
      </style>
    </head>
    <body>

      <div style="text-align: center;">
        <h1>ÉTAT DES LIEUX</h1>
        <div style="margin-bottom: 30px; font-weight: bold;">
          <span class="header-checkbox ${info.type === 'Entrée' ? 'checked' : ''}"></span> ENTRÉE &nbsp;&nbsp;&nbsp;
          <span class="header-checkbox ${info.type === 'Sortie' ? 'checked' : ''}"></span> SORTIE
        </div>
      </div>

      <div class="box">
        <div class="box-title">Informations Générales</div>
        <div class="box-content">
          <div>
            <div class="field-label">Adresse du logement</div>
            <div class="field-value">${info.adresse}</div>
          </div>
          <div>
            <div class="field-label">Date de l'état des lieux</div>
            <div class="field-value">${info.date}</div>
          </div>
          <div>
            <div class="field-label">Bailleur / Mandataire</div>
            <div class="field-value">${info.bailleur}</div>
          </div>
           <div>
            <div class="field-label">Locataire(s)</div>
            <div class="field-value">${info.locataire}</div>
          </div>
        </div>
      </div>

      <div class="box">
        <div class="box-title">Relevé des Compteurs</div>
        <div style="padding: 0;">
          <table style="border: none;">
            <thead style="background: #f9fafb;">
              <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Type</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">N° Série</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Index</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Localisation</th>
              </tr>
            </thead>
            <tbody>
              ${compteursHtml}
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-top: 30px;">
        ${piecesHtml}
      </div>
      
      <div class="legend">
        Abréviations : TB = Très Bon état, B = Bon état, C = État moyen, M = Mauvais état, HS = Hors Service.
      </div>

      <div style="margin-top: 40px; border: 1px solid ${PRIMARY_COLOR}; border-radius: 8px; padding: 20px; page-break-inside: avoid;">
        <table style="border: none;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 20px; border-right: 1px dashed #ccc;">
              <div style="font-weight: bold; margin-bottom: 5px;">Le Locataire</div>
              <div style="font-size: 10px; color: #666; margin-bottom: 15px;">"Lu et approuvé"</div>
              <div style="height: 60px; display: flex; align-items: center;">${signImgLoc}</div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 20px;">
              <div style="font-weight: bold; margin-bottom: 5px;">Le Bailleur / Mandataire</div>
              <div style="font-size: 10px; color: #666; margin-bottom: 15px;">"Lu et approuvé"</div>
              <div style="height: 60px; display: flex; align-items: center;">${signImgBail}</div>
            </td>
          </tr>
        </table>
      </div>

      <div class="footer">
        Document généré via EDL Expert - Conformément à la loi ALUR n°2014-366 du 24 mars 2014.
      </div>

    </body>
    </html>
  `;
};
