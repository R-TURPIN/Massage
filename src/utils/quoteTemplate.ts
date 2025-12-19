export const generateQuoteHtml = (data: any, res: any) => {
  const date = new Date().toLocaleDateString('fr-FR');
  const validite = new Date(); validite.setDate(validite.getDate()+30);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
        .box { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { text-align: left; padding: 15px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; }
        td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .total { font-size: 18px; font-weight: bold; color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">AXOM<span style="color:#2563eb">.MANUFACTURE</span></div>
        <div style="text-align:right">
          <h1 style="margin:0; font-size:28px;">DEVIS</h1>
          <p style="margin:5px 0 0 0; color:#64748b">Date : ${date}</p>
        </div>
      </div>

      <div class="box">
        <h3 style="margin-top:0; color:#64748b; font-size:12px; text-transform:uppercase;">Client</h3>
        <div style="font-size:18px; font-weight:bold;">${data.client.name}</div>
        <div>Projet : <strong>${data.client.project}</strong></div>
      </div>

      <table>
        <thead><tr><th>Description</th><th style="text-align:right">Montant HT</th></tr></thead>
        <tbody>
          <tr>
            <td>
              <strong>Fabrication & Usinage</strong><br/>
              <span style="font-size:12px; color:#64748b">Machine: ${data.params.printer} | Temps: ${data.params.printTime}h | Poids: ${data.params.weight}g</span>
            </td>
            <td style="text-align:right">${(res.machine + res.mat).toFixed(2)} €</td>
          </tr>
          <tr>
            <td><strong>Finition & Main d'œuvre</strong></td>
            <td style="text-align:right">${res.labor.toFixed(2)} €</td>
          </tr>
          <tr>
            <td style="text-align:right; padding-top:30px;"><strong>TOTAL HT</strong></td>
            <td style="text-align:right; padding-top:30px; font-weight:bold;">${res.total.toFixed(2)} €</td>
          </tr>
          <tr>
            <td style="text-align:right; border:none;">TVA (20%)</td>
            <td style="text-align:right; border:none;">${(res.total * 0.2).toFixed(2)} €</td>
          </tr>
          <tr>
            <td style="text-align:right; border:none;" class="total">NET À PAYER</td>
            <td style="text-align:right; border:none;" class="total">${(res.total * 1.2).toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:60px; text-align:center; font-size:10px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:20px;">
        Devis valable jusqu'au ${validite.toLocaleDateString('fr-FR')} - AXOM MANUFACTURE - Châteauroux (36)
      </div>
    </body>
    </html>
  `;
};
