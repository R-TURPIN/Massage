import React, { useState, useEffect } from 'react';
import { generateQuoteHtml } from './utils/quoteTemplate';
import { downloadPdf } from './utils/pdfGenerator';
import { Calculator, Save, Loader2, ArrowLeft, Settings, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Données de base
  const [data, setData] = useState({
    client: { name: "", project: "" },
    params: { 
      printer: "FDM Standard", 
      material: "PLA", // Nouveau
      printTime: 0, 
      weight: 0, 
      setupFee: 5, // Frais de lancement par défaut
      laborTime: 0, 
      laborRate: 30, 
      margin: 2.0 // Marge plus agressive par défaut
    }
  });
  
  const [res, setRes] = useState<any>(null);

  // Configuration des prix (Facile à changer ici)
  const materials: any = {
    'PLA': 20,    // €/kg
    'PETG': 25,
    'ABS': 25,
    'TPU (Flexible)': 35,
    'ASA': 30,
    'Résine': 45
  };

  const machines: any = {
    'FDM Standard': 0.20, // Coût élec + amortissement /h
    'FDM Haute Vitesse': 0.35,
    'CNC': 5.00
  };

  // Calcul automatique dès qu'une valeur change
  const calculate = () => {
    const { printer, material, printTime, weight, setupFee, laborTime, laborRate, margin } = data.params;
    
    const machineCost = printTime * (machines[printer] || 0.20);
    const materialPrice = materials[material] || 20;
    const materialCost = (weight / 1000) * materialPrice;
    const laborCost = laborTime * laborRate;
    
    // Coût de revient (Ce que ça te coûte vraiment)
    const costPrice = machineCost + materialCost + laborCost;
    
    // Prix de vente (Ce que le client paie)
    // On applique la marge sur la prod, et on ajoute les frais fixes à la fin (ou avant marge, au choix. Ici avant pour marger dessus).
    const subTotal = costPrice + setupFee; 
    const sellPrice = subTotal * margin;
    
    setRes({ machineCost, materialCost, laborCost, costPrice, sellPrice, materialPrice });
  };

  // Recalculer automatiquement quand les params changent
  useEffect(() => {
    calculate();
  }, [data.params]);

  const genPDF = async () => {
    if (!data.client.name) return alert("Nom du client manquant !");
    setIsGenerating(true);
    try {
      const html = generateQuoteHtml(data, res);
      await downloadPdf(html, `DEVIS_${data.client.name.replace(/\s/g,'_')}.pdf`);
    } catch(e) { alert("Erreur PDF"); }
    finally { setIsGenerating(false); }
  };

  const getMarginLabel = (m: number) => {
    if (m < 1.5) return { text: "Faible", color: "text-red-500" };
    if (m < 2.5) return { text: "Standard", color: "text-blue-500" };
    return { text: "Excellente", color: "text-green-500" };
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <a href="/" className="bg-slate-100 p-2 rounded-lg text-slate-500 hover:text-brand-600 transition"><ArrowLeft size={20}/></a>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Calculator className="text-brand-600"/> Calculateur AXOM</h1>
              <p className="text-xs text-slate-500">Outil de chiffrage interne</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-slate-400 uppercase font-bold">Date</div>
            <div className="font-mono text-sm">{new Date().toLocaleDateString()}</div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* COLONNE GAUCHE : Paramètres */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Client */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18} className="text-slate-400"/> Projet</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Nom Client / Société" className="p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none" value={data.client.name} onChange={e=>setData({...data, client:{...data.client, name:e.target.value}})}/>
                <input placeholder="Nom du Projet" className="p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none" value={data.client.project} onChange={e=>setData({...data, client:{...data.client, project:e.target.value}})}/>
              </div>
            </div>

            {/* 2. Fabrication */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Printer size={18} className="text-slate-400"/> Fabrication</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Machine</label>
                  <select className="w-full p-2.5 border rounded-lg bg-slate-50 font-medium" value={data.params.printer} onChange={e=>setData({...data, params:{...data.params, printer:e.target.value}})}>
                    {Object.keys(machines).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Matériau</label>
                  <select className="w-full p-2.5 border rounded-lg bg-slate-50 font-medium" value={data.params.material} onChange={e=>setData({...data, params:{...data.params, material:e.target.value}})}>
                    {Object.keys(materials).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Frais Lancement (€)</label>
                  <input type="number" className="w-full p-2.5 border rounded-lg font-bold text-brand-600 bg-brand-50" value={data.params.setupFee} onChange={e=>setData({...data, params:{...data.params, setupFee:parseFloat(e.target.value)}})}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 uppercase">Temps (h)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.printTime} onChange={e=>setData({...data, params:{...data.params, printTime:parseFloat(e.target.value)}})}/></div>
                <div><label className="text-xs text-slate-500 uppercase">Poids (g)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.weight} onChange={e=>setData({...data, params:{...data.params, weight:parseFloat(e.target.value)}})}/></div>
              </div>
            </div>

            {/* 3. Rentabilité */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-slate-400"/> Rentabilité</h2>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-slate-500 uppercase">Post-prod (h)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.laborTime} onChange={e=>setData({...data, params:{...data.params, laborTime:parseFloat(e.target.value)}})}/></div>
                <div><label className="text-xs text-slate-500 uppercase">Taux Horaire (€)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.laborRate} onChange={e=>setData({...data, params:{...data.params, laborRate:parseFloat(e.target.value)}})}/></div>
                <div>
                  <label className="text-xs font-bold text-brand-600 uppercase flex justify-between">Marge (x) <span className={getMarginLabel(data.params.margin).color}>{getMarginLabel(data.params.margin).text}</span></label>
                  <input type="number" step="0.1" className="w-full p-3 border-2 border-brand-100 rounded-lg font-bold text-brand-600" value={data.params.margin} onChange={e=>setData({...data, params:{...data.params, margin:parseFloat(e.target.value)}})}/>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Résultat Live */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-brand-600 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Structure du Prix</h3>
              
              <div className="space-y-3 text-sm text-slate-600 mb-6">
                <div className="flex justify-between"><span>Matière ({data.params.material})</span> <span>{res?.materialCost.toFixed(2)} €</span></div>
                <div className="flex justify-between"><span>Machine</span> <span>{res?.machineCost.toFixed(2)} €</span></div>
                <div className="flex justify-between"><span>Main d'œuvre</span> <span>{res?.laborCost.toFixed(2)} €</span></div>
                <div className="flex justify-between font-bold text-brand-600 bg-brand-50 p-2 rounded"><span>Frais Fixes</span> <span>{data.params.setupFee.toFixed(2)} €</span></div>
                <div className="border-t pt-2 mt-2 flex justify-between text-xs text-slate-400"><span>Coûtant (Break-even)</span> <span>{(res?.costPrice + data.params.setupFee).toFixed(2)} €</span></div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-xl text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prix de vente HT</span>
                <div className="text-4xl font-bold mt-2">{res?.sellPrice.toFixed(2)} €</div>
                <div className="text-xs text-slate-400 mt-1">TTC (20%) : {(res?.sellPrice * 1.2).toFixed(2)} €</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-500 mb-6">
                <div className="bg-slate-100 p-2 rounded">Net Pocket : {((res?.sellPrice || 0) - (res?.costPrice || 0) - data.params.setupFee).toFixed(2)} €</div>
                <div className="bg-slate-100 p-2 rounded">Marge : {(((res?.sellPrice || 0) - (res?.costPrice || 0) - data.params.setupFee) / (res?.sellPrice || 1) * 100).toFixed(0)}%</div>
              </div>

              <button onClick={genPDF} disabled={isGenerating} className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20">
                {isGenerating ? <Loader2 className="animate-spin"/> : <Save size={20}/>} Générer Devis PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Dashboard;
