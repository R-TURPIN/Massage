import React, { useState } from 'react';
import { generateEdlHtml } from './utils/edlTemplate';
import { downloadPdf } from './utils/pdfGenerator';
import { 
  FileText, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Home, 
  Zap, 
  User, 
  MapPin,
  Save
} from 'lucide-react';

// Type definition (pour aider TypeScript)
interface Element {
  nom: string;
  etat: string;
  com: string;
}

interface Piece {
  nom: string;
  elements: Element[];
}

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // ÉTAT PRINCIPAL : C'est ici que sont stockées toutes les données de l'EDL
  const [data, setData] = useState({
    info: {
      type: "Entrée",
      date: new Date().toLocaleDateString('fr-FR'),
      adresse: "",
      bailleur: "Agence Immo",
      locataire: ""
    },
    compteurs: [
      { type: "Électricité", num: "", valeur: "", loc: "" },
      { type: "Eau Froide", num: "", valeur: "", loc: "" }
    ],
    pieces: [
      {
        nom: "Entrée",
        elements: [
          { nom: "Porte", etat: "Bon état", com: "" },
          { nom: "Murs", etat: "Bon état", com: "" },
          { nom: "Sol", etat: "Bon état", com: "" }
        ]
      }
    ] as Piece[]
  });

  // --- GESTION DES INFOS GÉNÉRALES ---
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, info: { ...data.info, [e.target.name]: e.target.value } });
  };

  // --- GESTION DES COMPTEURS ---
  const updateCompteur = (index: number, field: string, value: string) => {
    const newCompteurs = [...data.compteurs];
    newCompteurs[index] = { ...newCompteurs[index], [field]: value };
    setData({ ...data, compteurs: newCompteurs });
  };

  const addCompteur = () => {
    setData({
      ...data,
      compteurs: [...data.compteurs, { type: "Nouveau Compteur", num: "", valeur: "", loc: "" }]
    });
  };

  const removeCompteur = (index: number) => {
    const newCompteurs = data.compteurs.filter((_, i) => i !== index);
    setData({ ...data, compteurs: newCompteurs });
  };

  // --- GESTION DES PIÈCES ---
  const addPiece = () => {
    const nomPiece = prompt("Nom de la nouvelle pièce (ex: Cuisine, Chambre 1...)");
    if (nomPiece) {
      setData({
        ...data,
        pieces: [...data.pieces, { 
          nom: nomPiece, 
          elements: [
            { nom: "Sol", etat: "Bon état", com: "" }, 
            { nom: "Murs", etat: "Bon état", com: "" },
            { nom: "Plafond", etat: "Bon état", com: "" }
          ] 
        }]
      });
    }
  };

  const removePiece = (index: number) => {
    if (confirm("Supprimer cette pièce ?")) {
      const newPieces = data.pieces.filter((_, i) => i !== index);
      setData({ ...data, pieces: newPieces });
    }
  };

  // --- GESTION DES ÉLÉMENTS DANS UNE PIÈCE ---
  const updateElement = (pieceIndex: number, elIndex: number, field: keyof Element, value: string) => {
    const newPieces = [...data.pieces];
    newPieces[pieceIndex].elements[elIndex] = { 
      ...newPieces[pieceIndex].elements[elIndex], 
      [field]: value 
    };
    setData({ ...data, pieces: newPieces });
  };

  const addElement = (pieceIndex: number) => {
    const newPieces = [...data.pieces];
    newPieces[pieceIndex].elements.push({ nom: "Nouvel élément", etat: "Bon état", com: "" });
    setData({ ...data, pieces: newPieces });
  };

  const removeElement = (pieceIndex: number, elIndex: number) => {
    const newPieces = [...data.pieces];
    newPieces[pieceIndex].elements = newPieces[pieceIndex].elements.filter((_, i) => i !== elIndex);
    setData({ ...data, pieces: newPieces });
  };

  // --- GÉNÉRATION PDF ---
  const handleGenerate = async () => {
    if (!data.info.locataire || !data.info.adresse) {
      alert("⚠️ Merci de remplir au moins le nom du locataire et l'adresse.");
      return;
    }

    setIsGenerating(true);
    try {
      const html = generateEdlHtml(data);
      // Nom du fichier : EDL_NomLocataire_Date.pdf
      const filename = `EDL_${data.info.locataire.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      await downloadPdf(html, filename);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans">
      
      {/* HEADER FIXE */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
              <ArrowLeft size={20}/>
            </a>
            <h1 className="font-bold text-slate-800 text-lg md:text-xl flex items-center gap-2">
              <span className="bg-brand-100 text-brand-700 p-1.5 rounded-md"><FileText size={18}/></span>
              Éditeur EDL
            </h1>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 text-sm disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18}/>}
            <span className="hidden sm:inline">Générer PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">

        {/* 1. INFOS GÉNÉRALES */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2 font-bold text-slate-700">
            <User size={20}/> Informations Générales
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type d'état des lieux</label>
              <select name="type" value={data.info.type} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <option>Entrée</option>
                <option>Sortie</option>
                <option>Pré-état des lieux</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
              <input type="text" name="date" value={data.info.date} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Adresse du bien</label>
              <input type="text" name="adresse" placeholder="123 Rue de Lille..." value={data.info.adresse} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Locataire(s)</label>
              <input type="text" name="locataire" placeholder="M. Dupont..." value={data.info.locataire} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bailleur / Agence</label>
              <input type="text" name="bailleur" value={data.info.bailleur} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" />
            </div>
          </div>
        </section>

        {/* 2. COMPTEURS */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Zap size={20}/> Relevé des Compteurs
            </div>
            <button onClick={addCompteur} className="text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md flex items-center gap-1 transition">
              <Plus size={16}/> Ajouter
            </button>
          </div>
          <div className="p-6 space-y-4">
            {data.compteurs.map((c, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <input 
                  type="text" 
                  value={c.type} 
                  onChange={(e) => updateCompteur(idx, 'type', e.target.value)} 
                  className="font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-32 md:w-40"
                />
                <input 
                  type="text" 
                  placeholder="N° Série" 
                  value={c.num} 
                  onChange={(e) => updateCompteur(idx, 'num', e.target.value)} 
                  className="flex-1 p-2 border border-slate-200 rounded text-sm w-full"
                />
                <input 
                  type="text" 
                  placeholder="Index / Valeur" 
                  value={c.valeur} 
                  onChange={(e) => updateCompteur(idx, 'valeur', e.target.value)} 
                  className="flex-1 p-2 border border-slate-200 rounded text-sm w-full font-mono text-blue-600 font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Emplacement" 
                  value={c.loc} 
                  onChange={(e) => updateCompteur(idx, 'loc', e.target.value)} 
                  className="flex-1 p-2 border border-slate-200 rounded text-sm w-full"
                />
                <button onClick={() => removeCompteur(idx)} className="text-red-400 hover:text-red-600 p-2">
                  <Trash2 size={18}/>
                </button>
              </div>
            ))}
            {data.compteurs.length === 0 && <p className="text-slate-400 text-sm italic text-center">Aucun compteur ajouté.</p>}
          </div>
        </section>

        {/* 3. PIÈCES ET ÉTATS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Home size={24} className="text-blue-600"/>
              Pièces & Équipements
            </h2>
            <button onClick={addPiece} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow transition flex items-center gap-2">
              <Plus size={18}/> Nouvelle Pièce
            </button>
          </div>

          {data.pieces.map((piece, pIdx) => (
            <div key={pIdx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Entête de la pièce */}
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between group">
                <input 
                  type="text" 
                  value={piece.nom} 
                  onChange={(e) => {
                    const newPieces = [...data.pieces];
                    newPieces[pIdx].nom = e.target.value;
                    setData({...data, pieces: newPieces});
                  }}
                  className="font-bold text-lg bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-slate-800"
                />
                <div className="flex gap-2">
                  <button onClick={() => addElement(pIdx)} className="text-xs bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 px-3 py-1.5 rounded-md flex items-center gap-1 transition">
                    <Plus size={14}/> Élément
                  </button>
                  <button onClick={() => removePiece(pIdx)} className="text-slate-400 hover:text-red-600 p-1.5 transition">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>

              {/* Tableau des éléments */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 w-1/4">Élément</th>
                      <th className="px-6 py-3 w-1/4">État</th>
                      <th className="px-6 py-3 w-1/2">Commentaires</th>
                      <th className="px-2 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {piece.elements.map((el, eIdx) => (
                      <tr key={eIdx} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3">
                          <input 
                            type="text" 
                            value={el.nom} 
                            onChange={(e) => updateElement(pIdx, eIdx, 'nom', e.target.value)} 
                            className="w-full bg-transparent font-medium text-slate-900 border-b border-transparent focus:border-blue-400 outline-none"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <select 
                            value={el.etat} 
                            onChange={(e) => updateElement(pIdx, eIdx, 'etat', e.target.value)} 
                            className={`w-full p-1.5 rounded border ${
                              el.etat === 'Neuf' ? 'bg-green-50 border-green-200 text-green-700' :
                              el.etat === 'Bon état' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              el.etat === 'État d\'usage' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                              'bg-red-50 border-red-200 text-red-700'
                            }`}
                          >
                            <option>Neuf</option>
                            <option>Bon état</option>
                            <option>État d'usage</option>
                            <option>Mauvais état</option>
                            <option>Non fonctionnel</option>
                          </select>
                        </td>
                        <td className="px-6 py-3">
                          <input 
                            type="text" 
                            placeholder="..." 
                            value={el.com} 
                            onChange={(e) => updateElement(pIdx, eIdx, 'com', e.target.value)} 
                            className="w-full bg-transparent text-slate-600 border-b border-slate-200 focus:border-blue-400 outline-none"
                          />
                        </td>
                        <td className="px-2 py-3 text-right">
                          <button onClick={() => removeElement(pIdx, eIdx)} className="text-slate-300 hover:text-red-500">
                            <Trash2 size={16}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {piece.elements.length === 0 && (
                  <div className="p-6 text-center text-slate-400 italic text-sm">
                    Aucun élément dans cette pièce. Cliquez sur "Élément" pour en ajouter.
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Bouton de sauvegarde final (aussi présent dans le header) */}
        <div className="flex justify-end pt-8">
           <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold shadow-lg transition flex items-center gap-3 text-lg disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Save />}
            Générer et Signer le PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
