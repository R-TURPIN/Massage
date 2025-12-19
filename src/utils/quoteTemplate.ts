export const generateQuoteHtml = (data: any, results: any) => {
  const { client, params } = data;
  const date = new Date().toLocaleDateString('fr-FR');
  const validite = new Date();
  validite.setDate(validite.getDate() + 30); // Validité 30 jours

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
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .box { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        h3 { margin-top: 0; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; }
        .client-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { text-align: left; padding: 15px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; font-size: 12px; text-transform: uppercase; }
        td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .total-row td { border-bottom: none; font-weight: bold; font-size: 16px; background: #f8fafc; }
        
        .footer { margin-top: 60px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; pt: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">AXOM<span class="accent">.MANUFACTURE</span></div>
        <div style="text-align: right;">
          <h1 style="margin: 0; font-size: 30px; color: #0f172a;">DEVIS</h1>
          <p style="margin: 5px 0 0 0; color: #64748b;">Date : ${date}</p>
          <p style="margin: 0; color: #64748b;">Valable jusqu'au : ${validite.toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div class="grid">
        <div class="box">
          <h3>Émetteur</h3>
          <div class="client-name">Axom Manufacture</div>
          <div>Atelier de Fabrication</div>
          <div>36000 Châteauroux</div>
          <div>contact@axom.fr</div>
        </div>
        <div class="box" style="border-color: #2563eb; background: #eff6ff;">
          <h3>Client</h3>
          <div class="client-name">${client.name}</div>
          <div>Projet : <strong>${client.project}</strong></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 50%;">Description</th>
            <th style="width: 20%;">Détails</th>
            <th style="width: 30%; text-align: right;">Prix HT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Fabrication Additive / Usinage</strong><br/>
              <span style="font-size: 12px; color: #64748b;">Exécution sur machine ${params.printer}</span>
            </td>
            <td>${params.printTime}h x ${params.filamentWeight}g</td>
            <td style="text-align: right;">${(results.machineCost + results.materialCost * params.margin).toFixed(2)} €</td>
          </tr>
          <tr>
            <td>
              <strong>Post-traitement & Finitions</strong><br/>
              <span style="font-size: 12px; color: #64748b;">Nettoyage, ébavurage, contrôle qualité</span>
            </td>
            <td>${params.laborTime}h</td>
            <td style="text-align: right;">${(results.laborCost * params.margin).toFixed(2)} €</td>
          </tr>
          
          <tr class="total-row">
            <td colspan="2" style="text-align: right; padding-top: 30px;">TOTAL HT</td>
            <td style="text-align: right; padding-top: 30px; color: #0f172a;">${results.sellPrice.toFixed(2)} €</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; border: none; padding: 5px 15px; font-size: 12px; color: #64748b;">TVA (20%)</td>
            <td style="text-align: right; border: none; padding: 5px 15px; font-size: 12px; color: #64748b;">${(results.sellPrice * 0.2).toFixed(2)} €</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; border: none;"><strong>NET À PAYER</strong></td>
            <td style="text-align: right; border: none; font-size: 18px; font-weight: 900; color: #2563eb;">${(results.sellPrice * 1.2).toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 40px; font-size: 12px; color: #475569;">
        <strong>Conditions de règlement :</strong> 30% à la commande, solde à la livraison.<br/>
        Délai de fabrication estimé : 2 à 5 jours ouvrés selon charge atelier.
      </div>

      <div class="footer">
        AXOM MANUFACTURE - SIRET : 000 000 000 00000 - Châteauroux (36)<br/>
        Devis généré informatiquement le ${date}
      </div>
    </body>
    </html>
  `;
};
