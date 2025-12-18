export const generateEdlHtml = (data: any) => {
  const { info, compteurs, pieces, signatures } = data;

  // COULEURS DE LA MARQUE (Bleu Roi / Slate)
  const BRAND_COLOR = "#0f172a"; // Slate-900 (Foncé pro)
  const ACCENT_COLOR = "#2563eb"; // Blue-600 (Le bleu de ton site)
  const BG_LIGHT = "#f8fafc"; // Slate-50

  // Badges d'état (Style plus "Corporate")
  const getEtatBadge = (etat: string) => {
    let style = "background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;";
    
    switch (etat) {
      case 'Neuf': style = "background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;"; break;
      case 'Bon état': style = "background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;"; break;
      case 'État d\'usage': style = "background: #fffbeb; color: #92400e; border: 1px solid #fde68a;"; break;
      case 'Mauvais état': style = "background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;"; break;
      case 'Non fonctionnel': style = "background: #000; color: #fff; border: 1px solid #000;"; break;
    }
    return `<span style="${style} padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">${etat}</span>`;
  };

  const compteursHtml = compteurs.map((c: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: ${BRAND_COLOR}; font-weight: 600;">${c.type}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${c.num || '—'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 700; color: ${ACCENT_COLOR}; font-size: 13px;">${c.valeur || '—'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${c.loc || '—'}</td>
    </tr>
  `).join('');

  const piecesHtml = pieces.map((p: any) => {
    const elementsHtml = p.elements.map((el: any) => {
      const photosHtml = el.photos && el.photos.length > 0 
        ? `<div style="margin-top: 8px; display: flex; gap: 4px; flex-wrap: wrap;">
            ${el.photos.map((photo: string) => 
              `<div style="width: 50px; height: 50px; border: 1px solid #e2e8f0; padding: 2px; background: white;">
                  <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover;" />
               </div>`
            ).join('')}
           </div>`
        : '';

      return `
      <tr style="page-break-inside: avoid;">
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; width: 30%; vertical-align: top;">
          <strong style="color: ${BRAND_COLOR}; font-size: 12px;">${el.nom}</strong>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; width: 20%; vertical-align: top;">
          ${getEtatBadge(el.etat)}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; width: 50%; vertical-align: top; color: #4b5563; font-size: 11px; line-height: 1.4;">
          ${el.com ? `<div>${el.com}</div>` : ''}
          ${photosHtml}
        </td>
      </tr>
    `;
    }).join('');

    return `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <div style="border-bottom: 2px solid ${BRAND_COLOR}; margin-bottom: 10px; padding-bottom: 5px; display: flex; justify-content: space-between; align-items: flex-end;">
          <h3 style="margin: 0; color: ${BRAND_COLOR}; font-size: 14px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">${p.nom}</h3>
          <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Inventaire détaillé</span>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: ${BG_LIGHT};">
            <tr>
              <th style="text-align: left; padding: 8px 12px; font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Élément</th>
              <th style="text-align: left; padding: 8px 12px; font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">État Constaté</th>
              <th style="text-align: left; padding: 8px 12px; font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Observations & Photos</th>
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
  const signImgLoc = signatures?.locataire ? `<img src="${signatures.locataire}" style="height: 45px;" />` : '';
  const signImgBail = signatures?.bailleur ? `<img src="${signatures.bailleur}" style="height: 45px;" />` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; padding: 40px 50px; font-size: 12px; line-height: 1.5; }
        
        /* HEADER PREMIUM */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
        .brand-logo { font-size: 20px; font-weight: 900; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: -0.5px; }
        .brand-accent { color: ${ACCENT_COLOR}; }
        .doc-meta { text-align: right; }
        .doc-type-badge { background: ${BRAND_COLOR}; color: white; padding: 5px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block; border-radius: 2px; }
        
        /* GRID INFO */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; background: ${BG_LIGHT}; padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; }
        .info-col h4 { margin: 0 0 15px 0; font-size: 10px; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; letter-spacing: 1px; }
        .field { margin-bottom: 10px; }
        .label { font-size: 9px; text-transform: uppercase; color: #64748b; margin-bottom: 2px; font-weight: 600; }
        .value { font-size: 13px; font-weight: 600; color: ${BRAND_COLOR}; }

        /* LEGAL FOOTER */
        .legal-footer { margin-top: 60px; font-size: 8px; color: #94a3b8; text-align: justify; border-top: 1px solid #e2e8f0; padding-top: 15px; line-height: 1.3; }
        
        .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: ${BRAND_COLOR}; background: #e2e8f0; padding: 8px 12px; margin-bottom: 0; border-left: 3px solid ${ACCENT_COLOR}; }
        .compteurs-table { width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 40px; }
        .compteurs-header { background: #fff; text-align: left; padding: 10px; font-size: 10px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }

        .signature-section { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
        .signature-box { width: 48%; border: 1px solid #cbd5e1; height: 100px; padding: 10px; position: relative; background: #fff; }
        .signature-role { font-weight: 800; font-size: 11px; color: ${BRAND_COLOR}; text-transform: uppercase; }
        .signature-legal { font-size: 8px; color: #64748b; margin-top: 2px; font-style: italic; }
      </style>
    </head>
    <body>

      <div class="header">
        <div>
          <div class="brand-logo">EDL Lille<span class="brand-accent">.Expert</span></div>
          <div style="font-size: 10px; color: #64748b; margin-top: 5px;">Rapport d'expertise locative</div>
        </div>
        <div class="doc-meta">
          <div class="doc-type-badge">État des lieux ${info.type.toUpperCase()}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 5px; font-weight: 500;">Fait à Lille, le ${info.date}</div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-col">
          <h4>Le Bien Objet du Constat</h4>
          <div class="field">
            <div class="label">Adresse Complète</div>
            <div class="value">${info.adresse}</div>
          </div>
          <div class="field">
            <div class="label">Mandataire / Propriétaire</div>
            <div class="value">${info.bailleur}</div>
          </div>
        </div>
        <div class="info-col">
          <h4>La Partie Locataire</h4>
          <div class="field">
            <div class="label">Nom(s) et Prénom(s)</div>
            <div class="value">${info.locataire}</div>
          </div>
          <div class="field">
            <div class="label">Dossier N°</div>
            <div class="value">${Math.floor(Math.random() * 10000) + 2024} - REF</div>
          </div>
        </div>
      </div>

      <div class="section-title">Relevé des Index</div>
      <table class="compteurs-table">
        <thead>
          <tr>
            <th class="compteurs-header">Énergie / Fluide</th>
            <th class="compteurs-header">N° Compteur</th>
            <th class="compteurs-header">Index Relevé</th>
            <th class="compteurs-header">Emplacement</th>
          </tr>
        </thead>
        <tbody>
          ${compteursHtml}
        </tbody>
      </table>

      ${piecesHtml}

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-role">Le Locataire</div>
          <div class="signature-legal">Reconnait l'exactitude des constatations ci-dessus. Mention "Lu et approuvé".</div>
          <div style="display: flex; justify-content: center; margin-top: 10px;">${signImgLoc}</div>
        </div>
        <div class="signature-box">
          <div class="signature-role">Le Mandataire</div>
          <div class="signature-legal">Pour le compte du propriétaire. Mention "Lu et approuvé".</div>
          <div style="display: flex; justify-content: center; margin-top: 10px;">${signImgBail}</div>
        </div>
      </div>

      <div class="legal-footer">
        <strong>MENTIONS LÉGALES ET JURIDIQUES :</strong><br/>
        Le présent état des lieux est établi contradictoirement entre les parties conformément à la <strong>Loi n° 89-462 du 6 juillet 1989</strong> tendant à améliorer les rapports locatifs et au <strong>Décret n° 2016-382 du 30 mars 2016</strong> fixant les modalités d'établissement de l'état des lieux et de prise en compte de la vétusté.<br/>
        En cas de modification de l'état des lieux d'entrée, le locataire peut demander au bailleur ou à son représentant de le compléter dans un délai de dix jours à compter de son établissement. Pour les éléments de chauffage, ce délai est étendu au premier mois de la période de chauffe.<br/>
        Document généré électroniquement via la plateforme EDL Lille Expert. L'original numérique est conservé sur serveur sécurisé.
      </div>

    </body>
    </html>
  `;
};
