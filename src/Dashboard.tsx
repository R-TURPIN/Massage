import React, { useState } from 'react';
import { generateQuoteHtml } from './utils/quoteTemplate';
import { downloadPdf } from './utils/pdfGenerator';
import { Calculator, Save, Loader2, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState({
    client: { name: "", project: "" },
    params: { printer: "Bambu Lab A1", printTime: 0, weight: 0, priceKg: 20, laborTime: 0, laborRate: 30, margin: 1.5 }
  });
  const [res, setRes] = useState<any>(null);

  const calculate = () => {
    const { printer, printTime, weight, priceKg, laborTime, laborRate, margin } = data.params;
    const rates: any = { 'Bambu Lab A1': 0.17, 'Creality K1C': 0.29, 'CNC 6040': 5.00 };
    
    const machine = printTime * (rates[printer] || 0.5);
    const mat = (weight / 1000) * priceKg;
    const labor = laborTime * laborRate;
    const total = (machine + mat + labor) * margin;
    
    setRes({ machine, mat, labor, total, cost: machine + mat + labor });
  };

  const genPDF = async () => {
    if (!res || !data.client.name) return alert("Remplissez le client !");
    setIsGenerating(true);
    try {
      const html = generateQuoteHtml(data, res);
      await downloadPdf(html, `DEVIS_${data.client.name.replace(/\s/g,'_')}.pdf`);
    } catch(e) { alert("Erreur PDF"); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <a href="/" className="bg-white p-2 rounded-full text-slate-500 hover:text-brand-600"><ArrowLeft size={20}/></a>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Calculator className="text-brand-600"/> Calculateur AXOM</h1>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4 border-b pb-2">1. Projet</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Nom Client / Société" className="p-3 border rounded-lg bg-slate-50" value={data.client.name} onChange={e=>setData({...data, client:{...data.client, name:e.target.value}})}/>
                <input placeholder="Nom du Projet" className="p-3 border rounded-lg bg-slate-50" value={data.client.project} onChange={e=>setData({...data, client:{...data.client, project:e.target.value}})}/>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4 border-b pb-2">2. Fabrication</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Machine</label>
                  <select className="w-full p-3 border rounded-lg bg-slate-50" value={data.params.printer} onChange={e=>setData({...data, params:{...data.params, printer:e.target.value}})}>
                    <option>Bambu Lab A1</option><option>Creality K1C</option><option>CNC 6040</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Temps (h)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.printTime} onChange={e=>setData({...data, params:{...data.params, printTime:parseFloat(e.target.value)}})}/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Poids (g)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.weight} onChange={e=>setData({...data, params:{...data.params, weight:parseFloat(e.target.value)}})}/></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 mb-4 border-b pb-2">3. Finitions & Marge</h2>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase">Post-prod (h)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.laborTime} onChange={e=>setData({...data, params:{...data.params, laborTime:parseFloat(e.target.value)}})}/></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase">Taux (€/h)</label><input type="number" className="w-full p-3 border rounded-lg" value={data.params.laborRate} onChange={e=>setData({...data, params:{...data.params, laborRate:parseFloat(e.target.value)}})}/></div>
                <div><label className="text-xs font-bold text-brand-600 uppercase">Marge (x)</label><input type="number" step="0.1" className="w-full p-3 border rounded-lg font-bold text-brand-600" value={data.params.margin} onChange={e=>setData({...data, params:{...data.params, margin:parseFloat(e.target.value)}})}/></div>
              </div>
            </div>
            
            <button onClick={calculate} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition">CALCULER LE PRIX</button>
          </div>

          {/* Résultat */}
          <div className="lg:col-span-1">
            {res ? (
              <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-brand-500 sticky top-10">
                <h3 className="text-xl font-bold mb-6 text-slate-800">Estimation</h3>
                <div className="space-y-3 text-sm mb-8 border-b border-slate-100 pb-6">
                  <div className="flex justify-between"><span>Machine</span> <b>{res.machine.toFixed(2)} €</b></div>
                  <div className="flex justify-between"><span>Matière</span> <b>{res.mat.toFixed(2)} €</b></div>
                  <div className="flex justify-between"><span>Main d'œuvre</span> <b>{res.labor.toFixed(2)} €</b></div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2"><span>Coûtant (0 marge)</span> <span>{res.cost.toFixed(2)} €</span></div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-xs font-bold text-slate-500 uppercase">Prix de vente HT</div>
                  <div className="text-4xl font-bold text-brand-600">{res.total.toFixed(2)} €</div>
                  <div className="text-sm text-slate-400">TTC (20%) : {(res.total * 1.2).toFixed(2)} €</div>
                </div>

                <button onClick={genPDF} disabled={isGenerating} className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition flex items-center justify-center gap-2">
                  {isGenerating ? <Loader2 className="animate-spin"/> : <Save size={20}/>} Générer Devis PDF
                </button>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                En attente de calcul...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
