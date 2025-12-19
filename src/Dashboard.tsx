import React, { useState } from 'react';
import { generateQuoteHtml } from './utils/quoteTemplate'; // On va créer ce fichier
import { downloadPdf } from './utils/pdfGenerator';
import { 
  Calculator, 
  FileText, 
  Loader2, 
  Printer, 
  DollarSign, 
  Clock, 
  Weight, 
  ArrowLeft,
  Save
} from 'lucide-react';

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Configuration des machines (Prix/heure)
  const printers = {
    'Creality K1C': 0.29,
    'Bambu Lab A1': 0.17,
    'Elegoo Neptune 4 Max': 0.31,
    'CNC 6040': 5.00, // Estimation coût horaire CNC (fraise + élec)
    'Laser Engraver': 2.00
  };

  const [data, setData] = useState({
    client: { name: "", email: "", project: "" },
    params: {
      printer: "Bambu Lab A1",
      printTime: 0,    // Heures
      filamentWeight: 0, // Grammes
      filamentPrice: 20, // €/kg (Standard PLA/PETG)
      laborTime: 0,    // Heures (Post-traitement)
      laborRate: 30,   // €/h (Ton taux horaire)
      margin: 1.5      // Marge commerciale (x1.5 par défaut)
    }
  });

  const [results, setResults] = useState<any>(null);

  // Calcul dynamique
  const calculate = () => {
    const { printer, printTime, filamentWeight, filamentPrice, laborTime, laborRate, margin } = data.params;
    
    // Coûts
    // @ts-ignore
    const machineCost = printTime * (printers[printer] || 0.5);
    const materialCost = (filamentWeight / 1000) * filamentPrice;
    const laborCost = laborTime * laborRate;
    
    const costPrice = machineCost + materialCost + laborCost; // Prix coûtant
    const sellPrice = costPrice * margin; // Prix de vente
    
    setResults({
      machineCost,
      materialCost,
      laborCost,
      costPrice,
      sellPrice,
      tva: sellPrice * 0.2
    });
  };

  const handleGeneratePDF = async () => {
    if (!results || !data.client.name) {
      alert("Veuillez remplir le nom du client et faire un calcul.");
      return;
    }
    setIsGenerating(true);
    try {
      // Génération du HTML pour le PDF
      const html = generateQuoteHtml(data, results);
      const filename = `DEVIS_${data.client.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      await downloadPdf(html, filename);
    } catch (e) {
      console.error(e);
      alert("Erreur PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ArrowLeft size={20}/></a>
            <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Calculator className="text-brand-600"/> Calculateur de Devis
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 grid md:grid-cols-2 gap-8">
        
        {/* COLONNE GAUCHE : PARAMÈTRES */}
        <div className="space-y-6">
          
          {/* CLIENT */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><FileText size={18}/> Projet & Client</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Nom du Client / Société" className="w-full p-2 border rounded" 
                value={data.client.name} onChange={e => setData({...data, client: {...data.client, name: e.target.value}})} />
              <input type="text" placeholder="Nom du Projet (ex: Lot 50 Trophées)" className="w-full p-2 border rounded" 
                value={data.client.project} onChange={e => setData({...data, client: {...data.client, project: e.target.value}})} />
            </div>
          </div>

          {/* PARAMÈTRES DE FABRICATION */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Printer size={18}/> Fabrication</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500">Machine</label>
                <select className="w-full p-2 border rounded font-bold"
                  value={data.params.printer} onChange={e => setData({...data, params: {...data.params, printer: e.target.value}})}>
                  {Object.keys(printers).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> Temps (h)</label>
                <input type="number" step="0.5" className="w-full p-2 border rounded"
                  value={data.params.printTime} onChange={e => setData({...data, params: {...data.params, printTime: parseFloat(e.target.value)}})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Weight size={12}/> Poids (g)</label>
                <input type="number" className="w-full p-2 border rounded"
                  value={data.params.filamentWeight} onChange={e => setData({...data, params: {...data.params, filamentWeight: parseFloat(e.target.value)}})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">Prix Matière (€/kg)</label>
                <input type="number" className="w-full p-2 border rounded"
                  value={data.params.filamentPrice} onChange={e => setData({...data, params: {...data.params, filamentPrice: parseFloat(e.target.value)}})} />
              </div>
            </div>
          </div>

          {/* MAIN D'OEUVRE & MARGE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><DollarSign size={18}/> Finition & Marge</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Temps H (Post-prod)</label>
                <input type="number" step="0.25" className="w-full p-2 border rounded"
                  value={data.params.laborTime} onChange={e => setData({...data, params: {...data.params, laborTime: parseFloat(e.target.value)}})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Taux Horaire (€/h)</label>
                <input type="number" className="w-full p-2 border rounded"
                  value={data.params.laborRate} onChange={e => setData({...data, params: {...data.params, laborRate: parseFloat(e.target.value)}})} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500">Coefficient Marge (x)</label>
                <input type="number" step="0.1" className="w-full p-2 border rounded font-bold text-brand-600"
                  value={data.params.margin} onChange={e => setData({...data, params: {...data.params, margin: parseFloat(e.target.value)}})} />
              </div>
            </div>
          </div>

          <button onClick={calculate} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition">
            Calculer le Prix
          </button>

        </div>

        {/* COLONNE DROITE : RÉSULTATS */}
        <div className="space-y-6">
          {results ? (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-brand-200 sticky top-24">
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Estimation</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Coût Machine</span>
                  <span className="font-medium">{results.machineCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Coût Matière</span>
                  <span className="font-medium">{results.materialCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Main d'oeuvre</span>
                  <span className="font-medium">{results.laborCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between pt-2 text-slate-400 text-xs">
                  <span>Prix Coûtant (0 marge)</span>
                  <span>{results.costPrice.toFixed(2)} €</span>
                </div>
              </div>

              <div className="bg-brand-50 p-6 rounded-xl text-center mb-6">
                <span className="block text-slate-500 text-sm uppercase tracking-wide font-bold mb-1">Prix de Vente HT</span>
                <span className="block text-4xl font-bold text-brand-600">{results.sellPrice.toFixed(2)} €</span>
                <span className="text-xs text-slate-400">Soit {(results.sellPrice * 1.2).toFixed(2)} € TTC</span>
              </div>

              <button 
                onClick={handleGeneratePDF} 
                disabled={isGenerating}
                className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
              >
                {isGenerating ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                Générer Devis PDF
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 italic">
              Remplissez les paramètres à gauche pour voir le prix.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
