// src/utils/edlTemplate.ts

// On définit les types pour que TypeScript ne gueule pas
interface EdlData {
  info: {
    type: string;
    date: string;
    adresse: string;
    bailleur: string;
    locataire: string;
  };
  compteurs: Array<{ type: string; num: string; valeur: string; loc: string }>;
  pieces: Array<{
    nom: string;
    elements: Array<{ nom: string; etat: string; com: string }>;
  }>;
}

export const generateEdlHtml = (data: EdlData) => {
  // On construit les lignes des compteurs
  const compteursHtml = data.compteurs.map(c => `
    <tr>
      <td><strong>${c.type}</strong></td>
      <td>${c.num}</td>
      <td>${c.loc}</td>
      <td class="highlight">${c.valeur}</td>
    </tr>
  `).join('');

  // On construit les blocs pour chaque pièce (La boucle magique)
  const piecesHtml = data.pieces.map(piece => {
    const elementsRows = piece.elements.map(el => `
      <tr>
        <td style="width: 25%"><strong>${el.nom}</strong></td>
        <td style="width: 15%">${el.etat}</td>
        <td style="width: 60%">${el.com}</td>
      </tr>
    `).join('');

    return `
      <div class="room-section">
        <h3 class="room-title">${piece.nom}</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Élément</th>
              <th>État</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            ${elementsRows}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  // Le Template HTML Complet
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>État des Lieux</title>
      <style>
        /* RESET & BASE - Optimisé pour A4 */
        @page { margin: 0; size: A4; }
        body { 
          font-family: 'Helvetica', 'Arial', sans-serif; 
          margin: 0; 
          padding: 40px; 
          color: #333; 
          font-size: 12px;
          line-height: 1.4;
        }
        
        /* HEADER */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #1e293b; }
        .logo span { color: #2563eb; }
        .doc-title { text-align: right; }
        .doc-title h1 { margin: 0; font-size: 20px; text-transform: uppercase; color: #2563eb; }
        .doc-title p { margin: 5px 0 0; font-size: 14px; color: #64748b; }

        /* INFO BOXES */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; }
        .box h4 { margin: 0 0 10px 0; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .box p { margin: 0; font-weight: bold; font-size: 14px; }

        /* TABLES */
        table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
        th { text-align: left; background: #f1f5f9; padding: 8px; font-size: 10px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        .highlight { font-weight: bold; color: #2563eb; }

        /* ROOM SECTIONS */
        .room-section { margin-bottom: 25px; break-inside: avoid; } /* break-inside: avoid empêche de couper un tableau en deux pages */
        .room-title { background: #1e293b; color: white; padding: 8px 15px; margin: 0 0 0 0; border-radius: 4px 4px 0 0; font-size: 14px; }
        .data-table { border: 1px solid #e2e8f0; border-top: none; }

        /* SIGNATURES */
        .signatures { margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid; }
        .sig-box { width: 45%; height: 100px; border: 1px dashed #cbd5e1; background: #f8fafc; padding: 10px; position: relative; }
        .sig-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
        
        /* FOOTER */
        .footer { position: fixed; bottom: 20px; left: 40px; right: 40px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="logo">EDL Lille<span>.Expert</span></div>
        <div class="doc-title">
          <h1>État des lieux - ${data.info.type}</h1>
          <p>Date : ${data.info.date}</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="box">
          <h4>Bien concerné</h4>
          <p>${data.info.adresse}</p>
        </div>
        <div class="box">
          <h4>Parties</h4>
          <p><strong>Bailleur :</strong> ${data.info.bailleur}</p>
          <p><strong>Locataire :</strong> ${data.info.locataire}</p>
        </div>
      </div>

      <div class="room-section">
        <h3 class="room-title" style="background: #2563eb;">Relevé des Compteurs</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Numéro</th>
              <th>Emplacement</th>
              <th>Index / Valeur</th>
            </tr>
          </thead>
          <tbody>
            ${compteursHtml}
          </tbody>
        </table>
      </div>

      ${piecesHtml}

      <div class="signatures">
        <div class="sig-box">
          <div class="sig-label">Le Bailleur (ou mandataire)</div>
          <div style="font-size: 9px; margin-top: 5px; color: #94a3b8;">"Lu et approuvé"</div>
        </div>
        <div class="sig-box">
          <div class="sig-label">Le Locataire</div>
          <div style="font-size: 9px; margin-top: 5px; color: #94a3b8;">"Lu et approuvé"</div>
        </div>
      </div>

      <div class="footer">
        Document généré par EDL Lille Expert - Certifié conforme Loi ALUR - Page 1/X
      </div>

    </body>
    </html>
  `;
};
