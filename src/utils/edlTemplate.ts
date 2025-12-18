export const generateEdlHtml = (data: any) => {
  const { info, compteurs, pieces, signatures } = data;

  // Helper pour la couleur des badges
  const getEtatColor = (etat: string) => {
    switch (etat) {
      case 'Neuf': return 'background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;'; // Vert
      case 'Bon état': return 'background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe;'; // Bleu
      case 'État d\'usage': return 'background-color: #fef9c3; color: #854d0e; border: 1px solid #fde047;'; // Jaune
      case 'Mauvais état': return 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca;'; // Rouge
      default: return 'background-color: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;'; // Gris
    }
  };

  const compteursHtml = compteurs.map((c: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${c.type}</strong></td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${c.num || '-'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 14px; font-weight: bold;">${c.valeur || '-'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${c.loc || '-'}</td>
    </tr>
  `).join('');

  const piecesHtml = pieces.map((p: any) => {
    const elementsHtml = p.elements.map((el: any) => {
      const photosHtml = el.photos && el.photos.length > 0 
        ? `<div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${el.photos.map((photo: string) => 
              `<div style="width: 80px; height: 80px; border-radius: 4px; overflow: hidden; border: 1px solid #cbd5e1;">
                 <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover;" />
               </div>`
            ).join('')}
           </div>`
        : '';

      const badgeStyle = getEtatColor(el.etat);

      return `
      <tr style="page-break-inside: avoid;">
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; width: 25%; vertical-align: top;">
          <div style="font-weight: bold; color: #1e293b;">${el.nom}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; width: 20%; vertical-align: top;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; ${badgeStyle}">
            ${el.etat}
          </span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; width: 55%; vertical-align: top; color: #475569;">
          ${el.com ? `<div style="margin-bottom: 4px;">${el.com}</div>` : ''}
          ${photosHtml}
        </td>
      </tr>
    `;
    }).join('');

    return `
      <div style="margin-bottom: 30px; page-break-inside: avoid; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
          <h3 style="margin: 0; color: #0f172a; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">${p.nom}</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; background: white;">
          <thead>
            <tr style="background-color: #fff;">
              <th style="text-align: left; padding: 10px 12px; color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #f1f5f9;">Élément</th>
              <th style="text-align: left; padding: 10px 12px; color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #f1f5f9;">État</th>
              <th style="text-align: left; padding: 10px 12px; color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #f1f5f9;">Observations & Photos</th>
            </tr>
          </thead>
          <tbody>
            ${elementsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  const signLocataire = signatures?.locataire 
    ? `<img src="${signatures.locataire}" style="max-height: 80px; display: block; margin: 10px auto;" />` 
    : '<div style="color: #cbd5e1; font-style: italic; text-align: center; margin-top: 30px;">Signature manquante</div>';

  const signBailleur = signatures?.bailleur 
    ? `<img src="${signatures.bailleur}" style="max-height: 80px; display: block; margin: 10px auto;" />` 
    : '<div style="color: #cbd5e1; font-style: italic; text-align: center; margin-top: 30px;">Signature manquante</div>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; padding: 40px; font-size: 13px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #0f172a; }
        .logo { font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
        .doc-type { text-align: right; }
        .badge-type { background: #0f172a; color: white; padding: 6px 12px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 14px; display: inline-block; }
        
        .grid-infos { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .info-card { background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 14px; font-weight: 600; color: #0f172a; }

        .section-title { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }

        table { width: 100%; border-collapse: collapse; }
        
        .footer-legal { margin-top: 50px; font-size: 9px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
      </style>
    </head>
    <body>
      
      <div class="header">
        <div class="logo">
          EDL<span style="color: #2563eb;">.Expert</span>
        </div>
        <div class="doc-type">
          <div class="badge-type">${info.type}</div>
          <div style="margin-top: 5px; color: #64748b; font-size: 12px;">Réalisé le ${info.date}</div>
        </div>
      </div>
      
      <div class="grid-infos">
        <div class="info-card">
          <div class="label">Bien concerné</div>
          <div class="value">${info.adresse}</div>
        </div>
        <div class="info-card">
          <div class="label">Locataire(s)</div>
          <div class="value">${info.locataire}</div>
        </div>
      </div>

      <div style="margin-bottom: 40px;">
        <div class="section-title">⚡ Relevé des Compteurs</div>
        <table style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <thead style="background: #f1f5f9;">
            <tr>
              <th style="text-align: left; padding: 10px; width: 20%;">Type</th>
              <th style="text-align: left; padding: 10px; width: 30%;">N° Série</th>
              <th style="text-align: left; padding: 10px; width: 20%;">Index</th>
              <th style="text-align: left; padding: 10px; width: 30%;">Emplacement</th>
            </tr>
          </thead>
          <tbody>
            ${compteursHtml}
          </tbody>
        </table>
      </div>

      <div class="section-title">📋 Détail pièce par pièce</div>
      ${piecesHtml}

      <div style="margin-top: 50px; page-break-inside: avoid;">
        <div class="section-title">✍️ Signatures</div>
        <div style="display: flex; justify-content: space-between; gap: 20px;">
          
          <div style="width: 48%; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; background: #fdfdfd;">
            <div class="label">Le Locataire</div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 10px;">"Lu et approuvé" - Certifie l'exactitude des relevés.</div>
            <div style="height: 100px; display: flex; align-items: center; justify-content: center; border: 1px dashed #cbd5e1; border-radius: 4px; background: white;">
              ${signLocataire}
            </div>
          </div>

          <div style="width: 48%; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; background: #fdfdfd;">
            <div class="label">Le Mandataire / Bailleur</div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 10px;">Pour valoir ce que de droit.</div>
            <div style="height: 100px; display: flex; align-items: center; justify-content: center; border: 1px dashed #cbd5e1; border-radius: 4px; background: white;">
              ${signBailleur}
            </div>
          </div>

        </div>
      </div>

      <div class="footer-legal">
        Document généré électroniquement via EDL.Expert - Valeur juridique probante selon l'article 1367 du Code Civil.<br/>
        Certifié conforme à l'original le ${new Date().toLocaleString('fr-FR')}.
      </div>

    </body>
    </html>
  `;
};
