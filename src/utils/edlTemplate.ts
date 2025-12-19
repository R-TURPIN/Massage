export const generateEdlHtml = (data: any) => {
  const { info, compteurs, pieces, signatures } = data;

  const compteursHtml = compteurs.map((c: any) => `
    <tr>
      <td style="padding: 5px; border: 1px solid #000;">${c.type}</td>
      <td style="padding: 5px; border: 1px solid #000;">${c.num || ''}</td>
      <td style="padding: 5px; border: 1px solid #000;">${c.loc || ''}</td>
      <td style="padding: 5px; border: 1px solid #000; font-weight: bold;">${c.valeur || ''}</td>
    </tr>
  `).join('');

  const piecesHtml = pieces.map((p: any) => {
    const elementsHtml = p.elements.map((el: any) => {
      // Photos
      const photosHtml = el.photos && el.photos.length > 0 
        ? `<div style="margin-top: 5px;">
            ${el.photos.map((photo: string) => 
              `<img src="${photo}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 5px; border: 1px solid #ccc;" />`
            ).join('')}
           </div>`
        : '';

      return `
      <tr style="page-break-inside: avoid;">
        <td style="padding: 5px; border: 1px solid #000; width: 25%;">${el.nom}</td>
        <td style="padding: 5px; border: 1px solid #000; width: 25%;">${el.etat}</td>
        <td style="padding: 5px; border: 1px solid #000; width: 50%;">
          ${el.com || ''}
          ${photosHtml}
        </td>
      </tr>
    `;
    }).join('');

    return `
      <div style="margin-top: 20px; page-break-inside: avoid;">
        <div style="font-weight: bold; margin-bottom: 5px; font-size: 14px; text-decoration: underline;">${p.nom}</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr>
              <th style="padding: 5px; border: 1px solid #000; text-align: left;">ÉLÉMENT</th>
              <th style="padding: 5px; border: 1px solid #000; text-align: left;">ÉTAT</th>
              <th style="padding: 5px; border: 1px solid #000; text-align: left;">OBSERVATIONS</th>
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
  const signLoc = signatures?.locataire ? `<img src="${signatures.locataire}" style="height: 40px; margin-top: 5px;" />` : '';
  const signBail = signatures?.bailleur ? `<img src="${signatures.bailleur}" style="height: 40px; margin-top: 5px;" />` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; padding: 30px; line-height: 1.3; }
        .brand { font-weight: bold; font-size: 16px; margin-bottom: 20px; }
        h1 { text-align: center; font-size: 18px; text-transform: uppercase; margin-bottom: 30px; text-decoration: underline; }
        
        .section-title { font-weight: bold; text-transform: uppercase; margin-bottom: 5px; margin-top: 15px; font-size: 12px; }
        .info-block { margin-bottom: 5px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        
        .signatures-section { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
        .signature-col { width: 45%; }
        
        .footer { margin-top: 50px; font-size: 10px; text-align: center; border-top: 1px solid #000; padding-top: 5px; }
      </style>
    </head>
    <body>

      <div class="brand">EDL Lille. Expert</div>

      <h1>ÉTAT DES LIEUX - ${info.type.toUpperCase()}</h1>

      <div class="section-title">BIEN CONCERNÉ</div>
      <div class="info-block">${info.adresse}</div>

      <div class="section-title">PARTIES</div>
      <div class="info-block"><strong>Bailleur :</strong> ${info.bailleur}</div>
      <div class="info-block"><strong>Locataire :</strong> ${info.locataire}</div>
      <div class="info-block"><strong>Date :</strong> ${info.date}</div>

      <div style="margin-top: 30px;">
        <div class="section-title">Relevé des Compteurs</div>
        <table style="font-size: 12px;">
          <thead>
            <tr>
              <th style="padding: 5px; border: 1px solid #000; text-align: left;">TYPE</th>
              <th style="padding: 5px; border: 1px solid #000; text-align: left;">NUMÉRO</th>
              <th style="padding: 5px; border: 1px solid #000; text-align: left;">EMPLACEMENT</th>
              <th style="padding: 5px; border: 1px solid #000; text-align: left;">INDEX/VALEUR</th>
            </tr>
          </thead>
          <tbody>
            ${compteursHtml}
          </tbody>
        </table>
      </div>

      ${piecesHtml}

      <div class="signatures-section">
        <div class="signature-col">
          <div style="font-weight: bold; text-decoration: underline;">LE BAILLEUR (OU MANDATAIRE)</div>
          <div style="font-size: 10px; margin-top: 2px;">"Lu et approuvé"</div>
          ${signBail}
        </div>
        <div class="signature-col">
          <div style="font-weight: bold; text-decoration: underline;">LE LOCATAIRE</div>
          <div style="font-size: 10px; margin-top: 2px;">"Lu et approuvé"</div>
          ${signLoc}
        </div>
      </div>

      <div class="footer">
        Document généré par EDL Lille Expert - Certifié conforme Loi ALUR
      </div>

    </body>
    </html>
  `;
};
