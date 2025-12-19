import React, { useState, useEffect } from 'react';
import { generateQuoteHtml } from './utils/quoteTemplate';
import { downloadPdf } from './utils/pdfGenerator';
import { Calculator, Save, Loader2, ArrowLeft, TrendingUp, Package } from 'lucide-react';

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [data, setData] = useState({
    client: { name: "", project: "" },
    params: { 
      printer: "Standard FDM", // Nom générique
      material: "PLA", 
      printTime: 0, 
      weight: 0, 
      setupFee: 10, // Frais de dossier par défaut (rentabilité !)
      laborTime: 0.25, // 15min de main d'oeuvre par défaut
      laborRate: 40, // Taux horaire pro
      margin: 2.0 
    }
  });
  
  const [res, setRes] = useState<any>(null);

  // Configuration (Tu peux changer les prix ici)
  const materials: any = {
    'PLA (Standard)': 20,
    'PETG (Résistant)': 25,
    'ABS/ASA (Tech)': 30,
    'TPU (Flexible)': 40,
    'Nylon-CF (Indus)': 80,
    'Résine (Détail)': 50
  };

  const machines: any = {
    'Standard FDM': 0.25,
    'Haute Vitesse': 0.40,
    'Grand Format': 0.60,
    'CNC': 5.00,
    'Laser': 2.00
  };

  const calculate = () => {
    const { printer, material, printTime, weight, setupFee, laborTime, laborRate, margin } = data.params;
    
    const machineCost = printTime * (machines[printer] || 0.25);
    const materialPrice = materials[material] || 20;
    const materialCost = (weight / 1000) * materialPrice;
    const laborCost = laborTime * laborRate;
    
    // Coût sec (ce que tu sors de ta poche)
    const dryCost = machineCost + materialCost;
    
    // Coût complet (avec ton temps)
    const totalCost = dryCost + laborCost;
    
    // Prix de vente
    const sellPrice = (totalCost * margin) + setupFee;
    
    setRes({ machineCost, materialCost, laborCost, totalCost, sellPrice, materialPrice });
  };

  useEffect(() => { calculate(); }, [data.params]);

  const genPDF = async () => {
    if (!data.client.name) return alert("Nom du client manquant !");
    setIsGenerating(true);
    try {
      const html = generateQuoteHtml(data, res);
      await downloadPdf(html, `DEVIS_${data.client.name.replace(/\s/g,'_')}.pdf`);
    } catch(e) { alert("Erreur PDF"); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <a href="/" className="bg-white p-2 rounded-full text-slate-400 hover:text-brand-600 transition shadow-sm"><ArrowLeft/></a>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Calculator className="text-brand-600"/> Pricing AXOM</h1>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Client */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Projet</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Client / Société" className="p-3 border rounded bg-slate-50 w-full" value={data.client.name} onChange={e=>setData({...data, client:{...data.client, name:e.target.value}})}/>
                <input placeholder="Référence Projet" className="p-3 border rounded bg-slate-50 w-full" value={data.client.project} onChange={e=>setData({...data, client:{...data.client, project:e.target.value}})}/>
              </div>
            </div>

            {/* 2. Technique */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Paramètres Fabrication</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs font-bold mb-1 block">Technologie</label>
                  <select className="w-full p-3 border rounded font-medium" value={data.params.printer} onChange={e=>setData({...data, params:{...data.params, printer:e.target.value}})}>
                    {Object.keys(machines).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block">Matériau</label>
                  <select className="w-full p-3 border rounded font-medium" value={data.params.material} onChange={e=>setData({...data, params:{...data.params, material:e.target.value}})}>
                    {Object.keys(materials).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-slate-500">Temps (h)</label><input type="number" className="w-full p-3 border rounded" value={data.params.printTime} onChange={e=>setData({...data, params:{...data.params, printTime:parseFloat(e.target.value)}})}/></div>
                <div><label className="text-xs text-slate-500">Poids (g)</label><input type="number" className="w-full p-3 border rounded" value={data.params.weight} onChange={e=>setData({...data, params:{...data.params, weight:parseFloat(e.target.value)}})}/></div>
                <div><label className="text-xs text-slate-500">Post-prod (h)</label><input type="number" step="0.25" className="w-full p-3 border rounded" value={data.params.laborTime} onChange={e=>setData({...data, params:{...data.params, laborTime:parseFloat(e.target.value)}})}/></div>
              </div>
            </div>

            {/* 3. Business */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-600">
              <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Rentabilité</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Frais Dossier (€)</label>
                  <input type="number" className="w-full p-3 border rounded font-bold text-brand-600" value={data.params.setupFee} onChange={e=>setData({...data, params:{...data.params, setupFee:parseFloat(e.target.value)}})}/>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Taux Horaire (€)</label>
                  <input type="number" className="w-full p-3 border rounded" value={data.params.laborRate} onChange={e=>setData({...data, params:{...data.params, laborRate:parseFloat(e.target.value)}})}/>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Coeff. Marge</label>
                  <input type="number" step="0.1" className="w-full p-3 border rounded font-bold" value={data.params.margin} onChange={e=>setData({...data, params:{...data.params, margin:parseFloat(e.target.value)}})}/>
                </div>
              </div>
            </div>
          </div>

          {/* Résultat Live */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl sticky top-6">
              <h3 className="text-lg font-serif italic mb-6 opacity-80">Estimation Finale</h3>
              
              <div className="space-y-3 text-sm opacity-70 mb-8 border-b border-white/10 pb-6">
                <div className="flex justify-between"><span>Machine + Matière</span> <span>{(res?.machineCost + res?.materialCost).toFixed(2)} €</span></div>
                <div className="flex justify-between"><span>Main d'œuvre</span> <span>{res?.laborCost.toFixed(2)} €</span></div>
                <div className="flex justify-between text-brand-300"><span>Frais Fixes</span> <span>{data.params.setupFee.toFixed(2)} €</span></div>
              </div>

              <div className="text-center mb-8">
                <div className="text-xs font-bold uppercase tracking-widest opacity-50">Total HT Client</div>
                <div className="text-5xl font-bold mt-2 text-white">{res?.sellPrice.toFixed(2)}<span className="text-xl">€</span></div>
                <div className="text-xs opacity-50 mt-2">TTC: {(res?.sellPrice * 1.2).toFixed(2)} €</div>
              </div>

              <div className="bg-white/10 p-4 rounded-lg mb-6 text-center">
                <div className="text-xs uppercase tracking-widest mb-1 opacity-60">Marge Nette</div>
                <div className="text-xl font-bold text-green-400">
                  {((res?.sellPrice || 0) - (res?.totalCost || 0)).toFixed(2)} €
                </div>
              </div>

              <button onClick={genPDF} disabled={isGenerating} className="w-full bg-brand-600 text-white font-bold py-4 rounded-lg hover:bg-brand-500 transition flex items-center justify-center gap-2">
                {isGenerating ? <Loader2 className="animate-spin"/> : <Save size={20}/>} Générer le PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Dashboard;
