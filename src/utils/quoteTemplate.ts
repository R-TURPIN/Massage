export const generateQuoteHtml = (data: any, res: any) => {
  const date = new Date().toLocaleDateString('fr-FR');
  const validite = new Date(); validite.setDate(validite.getDate()+30);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -1px; }
        .box { background: #f1f5f9; padding: 25px; border-radius: 12px; margin-bottom: 40px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { text-align: left; padding: 15px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; font-size: 12px; text-transform: uppercase; color: #64748b; }
        td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .total-row td { border-top: 2px solid #0f172a; border-bottom: none; font-weight: bold; font-size: 16px; padding-top: 20px; }
        .highlight { color: #2563eb; font-size: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">AXOM<span style="color:#2563eb">.MANUFACTURE</span></div>
        <div style="text-align:right">
          <h1 style="margin:0; font-size:32px; color:#0f172a;">DEVIS</h1>
          <p style="margin:5px 0 0 0; color:#64748b; font-size:14px;">Date : ${date}</p>
        </div>
      </div>

      <div class="box">
        <h3 style="margin-top:0; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing: 1px;">Destinataire</h3>
        <div style="font-size:20px; font-weight:bold; margin-bottom: 5px;">${data.client.name}</div>
        <div>Projet : <strong>${data.client.project}</strong></div>
      </div>

      <table>
        <thead><tr><th>Désignation</th><th style="text-align:right">Montant HT</th></tr></thead>
        <tbody>
          <tr>
            <td>
              <strong>Fabrication Additive / Usinage</strong><br/>
              <span style="font-size:13px; color:#64748b">
                Technologie : ${data.params.printer} <br/>
                Matériau : ${data.params.material} (${data.params.weight}g)
              </span>
            </td>
            <td style="text-align:right">${((res.machineCost + res.materialCost) * data.params.margin).toFixed(2)} €</td>
          </tr>
          <tr>
            <td>
              <strong>Préparation & Lancement</strong><br/>
              <span style="font-size:13px; color:#64748b">Frais fixes de dossier et setup machine</span>
            </td>
            <td style="text-align:right">${(data.params.setupFee * data.params.margin).toFixed(2)} €</td>
          </tr>
          <tr>
            <td>
              <strong>Finitions & Main d'œuvre</strong><br/>
              <span style="font-size:13px; color:#64748b">Post-traitement et contrôle qualité (${data.params.laborTime}h)</span>
            </td>
            <td style="text-align:right">${(res.laborCost * data.params.margin).toFixed(2)} €</td>
          </tr>
          
          <tr class="total-row">
            <td style="text-align:right;">TOTAL HT</td>
            <td style="text-align:right;">${res.sellPrice.toFixed(2)} €</td>
          </tr>
          <tr>
            <td style="text-align:right; border:none; padding-top:5px; color:#64748b;">TVA (20%)</td>
            <td style="text-align:right; border:none; padding-top:5px; color:#64748b;">${(res.sellPrice * 0.2).toFixed(2)} €</td>
          </tr>
          <tr>
            <td style="text-align:right; border:none; padding-top:10px;"><strong>NET À PAYER</strong></td>
            <td style="text-align:right; border:none; padding-top:10px;" class="highlight">${(res.sellPrice * 1.2).toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:80px; text-align:center; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:20px;">
        Validité de l'offre : 1 mois • AXOM MANUFACTURE - Châteauroux (36) <br/>
        SIRET : EN COURS D'IMMATRICULATION
      </div>
    </body>
    </html>
  `;
};
