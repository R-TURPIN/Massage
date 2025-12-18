export const generateEdlHtml = (data: any) => {
  const { info, compteurs, pieces, signatures } = data;

  // On garde le style simple du début, sans fioritures
  
  const compteursHtml = compteurs.map((c: any) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #333;"><strong>${c.type}</strong></td>
      <td style="padding: 8px; border: 1px solid #333;">${c.num || ''}</td>
      <td style="padding: 8px; border: 1px solid #333; font-weight: bold;">${c.valeur || ''}</td>
      <td style="padding: 8px; border: 1px solid #333;">${c.loc || ''}</td>
    </tr>
  `).join('');

  const piecesHtml = pieces.map((p: any) => {
    const elementsHtml = p.elements.map((el: any) => {
      // Gestion des photos (ajouté proprement au design de base)
      const photosHtml = el.photos && el.photos.length > 0 
        ? `<div style="margin-top: 5px; display: flex; gap: 5px; flex-wrap: wrap;">
            ${el.photos.map((photo: string) => 
              `<img src="${photo}" style="width: 60px; height: 60px; object-fit: cover; border: 1px solid #ccc;" />`
            ).join('')}
           </div>`
        : '';

      return `
      <tr style="page-break-inside: avoid;">
        <td style="padding: 8px; border: 1px solid #333; width: 30%;">
          <strong>${el.nom}</strong>
        </td>
        <td style="padding: 8px; border: 1px solid #333; width: 20%;">
          ${el.etat}
        </td>
        <td style="padding: 8px; border: 1px solid #333; width: 50%;">
          ${el.com || ''}
          ${photosHtml}
        </td>
      </tr>
    `;
    }).join('');

    return `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="background-color: #eee; padding: 8px; border: 1px solid #333; border-bottom: none; margin: 0; text-transform: uppercase; font-size: 14px;">
          ${p.nom}
        </h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #333;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 8px; text-align: left; border: 1px solid #333; width: 30%;">Élément</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #333; width: 20%;">État</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #333; width: 50%;">Observations & Photos</th>
            </tr>
          </thead>
          <tbody>
            ${elementsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  // Signatures (intégrées simplement)
  const signLoc = signatures?.locataire 
    ? `<img src="${signatures.locataire}" style="max-height: 50px; display: block; margin-top: 5px;" />` 
    : '<div style="color: #999; font-style: italic; margin-top: 20px;">Non signé</div>';

  const signBail = signatures?.bailleur 
    ? `<img src="${signatures.bailleur}" style="max-height: 50px; display: block; margin-top: 5px;" />` 
    : '<div style="color: #999; font-style: italic; margin-top: 20px;">Non signé</div>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.4; color: #000; padding: 20px; }
        h1 { text-align: center; font-size: 20px; text-transform: uppercase; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        h2 { font-size: 14px; text-transform: uppercase; background: #333; color: #fff; padding: 5px 10px; margin-top: 20px; margin-bottom: 10px; }
        
        .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; border: 1px solid #333; padding: 10px; }
        .info-col { width: 48%; }
        .info-row { margin-bottom: 5px; }
        .label { font-weight: bold; display: inline-block; width: 120px; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        
        .footer { margin-top: 30px; font-size: 10px; text-align: center; border-top: 1px solid #ccc; padding-top: 10px; }
        
        .signatures { display: flex; justify-content: space-between; margin-top: 30px; page-break-inside: avoid; }
        .sig-box { width: 48%; border: 1px solid #333; padding: 10px; min-height: 80px; }
      </style>
    </head>
    <body>

      <h1>ÉTAT DES LIEUX - ${info.type.toUpperCase()}</h1>

      <div class="info-section">
        <div class="info-col">
          <div class="info-row"><span class="label">Date :</span> ${info.date}</div>
          <div class="info-row"><span class="label">Adresse :</span> ${info.adresse}</div>
        </div>
        <div class="info-col">
          <div class="info-row"><span class="label">Locataire(s) :</span> ${info.locataire}</div>
          <div class="info-row"><span class="label">Bailleur :</span> ${info.bailleur}</div>
        </div>
      </div>

      <h2>Relevé des Compteurs</h2>
      <table>
        <thead>
          <tr style="background-color: #eee;">
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">Type</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">N° Série</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">Index</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">Emplacement</th>
          </tr>
        </thead>
        <tbody>
          ${compteursHtml}
        </tbody>
      </table>

      <h2>Détail du Logement</h2>
      ${piecesHtml}

      <div class="signatures">
        <div class="sig-box">
          <div style="font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 5px;">Le Locataire</div>
          <div style="font-size: 10px;">"Lu et approuvé"</div>
          ${signLoc}
        </div>
        <div class="sig-box">
          <div style="font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 5px;">Le Bailleur / Mandataire</div>
          <div style="font-size: 10px;">"Lu et approuvé"</div>
          ${signBail}
        </div>
      </div>

      <div class="footer">
        Document établi selon la Loi n° 89-462 du 6 juillet 1989 et le Décret n° 2016-382 du 30 mars 2016.<br/>
        Généré via EDL Lille Expert.
      </div>

    </body>
    </html>
  `;
};
