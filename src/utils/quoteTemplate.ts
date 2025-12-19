export const generateQuoteHtml = (data: any, results: any) => {
  const { client, params } = data;
  const date = new Date().toLocaleDateString('fr-FR');
  const validite = new Date();
  validite.setDate(validite.getDate() + 30); 

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; font-size: 14px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 50px; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
        .accent { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { text-align: left; padding: 15px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; }
        td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .footer { margin-top: 60px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; pt: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">AXOM<span class="accent">.MANUFACTURE</span></div>
        <div>
          <h1 style="margin: 0; font-size: 30px; color: #0f172a;">DEVIS</h1>
          <p style="margin: 5px 0 0 0; color: #64748b;">Date : ${date}</p>
        </div>
      </div>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 40px;">
        <h3 style="margin-top:0;">Client</h3>
        <div style="font-size: 18px; font-weight: bold;">${client.name}</div>
        <div>Projet : <strong>${client.project}</strong></div>
      </div>
      <table>
        <thead>
          <tr><th style="width: 50%;">Description</th><th style="width: 20%;">Détails</th><th style="width: 30%; text-align: right;">Prix HT</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Fabrication / Usinage</strong><br/><span style="font-size: 12px; color: #64748b;">Machine ${params.printer}</span></td>
            <td>${params.printTime}h x ${params.filamentWeight}g</td>
            <td style="text-align: right;">${(results.machineCost + results.materialCost * params.margin).toFixed(2)} €</td>
          </tr>
          <tr>
            <td><strong>Finition & Main d'œuvre</strong></td>
            <td>${params.laborTime}h</td>
            <td style="text-align: right;">${(results.laborCost * params.margin).toFixed(2)} €</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; border: none; font-weight: bold;">TOTAL HT</td>
            <td style="text-align: right; border: none; font-weight: bold;">${results.sellPrice.toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>
      <div class="footer">AXOM MANUFACTURE - Châteauroux (36)</div>
    </body>
    </html>
  `;
};
