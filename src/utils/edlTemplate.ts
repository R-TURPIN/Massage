import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { generateEdlHtml } from './utils/edlTemplate';
import { downloadPdf } from './utils/pdfGenerator';
import { compressImage } from './utils/imageUtils';
import { 
  FileText, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Home, 
  Zap, 
  User, 
  Save,
  Camera,
  XCircle,
  PenTool,
  Eraser,
  MapPin, // AJOUTÉ
  Search  // AJOUTÉ
} from 'lucide-react';

interface Element {
  nom: string;
  etat: string;
  com: string;
  photos: string[];
}

interface Piece {
  nom: string;
  elements: Element[];
}

// AJOUTÉ : Pour l'autocomplétion
interface AddressResult {
  properties: {
    label: string;
    context: string;
  }
}

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // AJOUTÉ : États Autocomplétion
  const [addressSuggestions, setAddressSuggestions] = useState<AddressResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Refs pour les signatures
  const sigLocataireRef = useRef<any>(null);
  const sigBailleurRef = useRef<any>(null);

  const [data, setData] = useState({
    info: {
      type: "Entrée",
      date: new Date().toLocaleDateString('fr-FR'),
      adresse: "",
      bailleur: "",
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
          { nom: "Porte palière", etat: "Bon état", com: "", photos: [] },
          { nom: "Murs", etat: "Bon état", com: "", photos: [] },
          { nom: "Sol", etat: "Bon état", com: "", photos: [] }
        ]
      }
    ] as Piece[]
  });

  // --- LOGIQUE AUTOCOMPLÉTION (AJOUTÉ) ---
  const handleAddressInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData({ ...data, info: { ...data.info, adresse: value } });

    if (value.length > 3) {
      try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`);
        const json = await response.json();
        setAddressSuggestions(json.features || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const selectAddress = (address: string) => {
    setData({ ...data, info: { ...data.info, adresse: address } });
    setShowSuggestions(false);
  };

  // --- LOGIQUE MÉTIER EXISTANTE (PAS TOUCHÉ) ---
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, pieceIndex: number, elIndex: number) => {
    if (e.target.files && e.target.files[0]) {
      setIsCompressing(true);
      try {
        const file = e.target.files[0];
        const compressedBase64 = await compressImage(file);
        
        const newPieces = [...data.pieces];
        newPieces[pieceIndex].elements[elIndex].photos.push(compressedBase64);
        setData({ ...data, pieces: newPieces });
      } catch (err) {
        console.error("Erreur compression", err);
        alert("Impossible d'ajouter la photo.");
      } finally {
        setIsCompressing(false);
        e.target.value = '';
      }
    }
  };

  const removePhoto = (pieceIndex: number, elIndex: number, photoIndex: number) => {
    if(confirm("Supprimer cette photo ?")) {
        const newPieces = [...data.pieces];
        newPieces[pieceIndex].elements[elIndex].photos = newPieces[pieceIndex].elements[elIndex].photos.filter((_, i) => i !== photoIndex);
        setData({ ...data, pieces: newPieces });
    }
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, info: { ...data.info, [e.target.name]: e.target.value } });
  };

  const updateCompteur = (index: number, field: string, value: string) => {
    const newCompteurs = [...data.compteurs];
    newCompteurs[index] = { ...newCompteurs[index], [field]: value };
    setData({ ...data, compteurs: newCompteurs });
  };

  const addCompteur = () => {
    setData({ ...data, compteurs: [...data.compteurs, { type: "Nouveau", num: "", valeur: "", loc: "" }] });
  };

  const removeCompteur = (index: number) => {
    const newCompteurs = data.compteurs.filter((_, i) => i !== index);
    setData({ ...data, compteurs: newCompteurs });
  };

  const addPiece = () => {
    const nomPiece = prompt("Nom de la nouvelle pièce ?");
    if (nomPiece) {
      setData({
        ...data,
        pieces: [...data.pieces, { 
          nom: nomPiece, 
          elements: [
            { nom: "Sol", etat: "Bon état", com: "", photos: [] }, 
            { nom: "Murs", etat: "Bon état", com: "", photos: [] },
            { nom: "Plafond", etat: "Bon état", com: "", photos: [] }
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

  const updateElement = (pieceIndex: number, elIndex: number, field: keyof Element, value: string) => {
    const newPieces = [...data.pieces];
    // @ts-ignore
    newPieces[pieceIndex].elements[elIndex][field] = value;
    setData({ ...data, pieces: newPieces });
  };

  const addElement = (pieceIndex: number) => {
    const newPieces = [...data.pieces];
    newPieces[pieceIndex].elements.push({ nom: "Nouvel élément", etat: "Bon état", com: "", photos: [] });
    setData({ ...data, pieces: newPieces });
  };

  const removeElement = (pieceIndex: number, elIndex: number) => {
    const newPieces = [...data.pieces];
    newPieces[pieceIndex].elements = newPieces[pieceIndex].elements.filter((_, i) => i !== elIndex);
    setData({ ...data, pieces: newPieces });
  };

  const handleGenerate = async () => {
    if (!data.info.locataire || !data.info.adresse) {
      alert("⚠️ Merci de remplir au moins le nom du locataire et l'adresse.");
      return;
    }
    setIsGenerating(true);
    try {
      const signatures = {
        locataire: sigLocataireRef.current && !sigLocataireRef.current.isEmpty() ? sigLocataireRef.current.toDataURL() : null,
        bailleur: sigBailleurRef.current && !sigBailleurRef.current.isEmpty() ? sigBailleurRef.current.toDataURL() : null
      };
      const html = generateEdlHtml({ ...data, signatures });
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
    <div className="min-h-screen bg-slate-100 pb-20 font-sans" onClick={() => setShowSuggestions(false)}>
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"><ArrowLeft size={20}/></a>
            <h1 className="font-bold text-slate-800 text-lg md:text-xl flex items-center gap-2">
              <span className="bg-brand-100 text-brand-700 p-1.5 rounded-md"><FileText size={18}/></span>
              Éditeur EDL
            </h1>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || isCompressing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 text-sm disabled:opacity-70">
            {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18}/>}
            <span className="hidden sm:inline">Générer PDF</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        
        {/* INFOS AVEC AUTOCOMPLETE */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2 font-bold text-slate-700"><User size={20}/> Informations Générales</div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label><select name="type" value={data.info.type} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"><option>Entrée</option><option>Sortie</option><option>Pré-état des lieux</option></select></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label><input type="text" name="date" value={data.info.date} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" /></div>
            
            {/* CHAMP MODIFIÉ */}
            <div className="md:col-span-2 relative z-20">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                Adresse <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><Search size={10}/> Auto-complétion</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="adresse" 
                  placeholder="Tapez l'adresse..." 
                  value={data.info.adresse} 
                  onChange={handleAddressInput} 
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" 
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50">
                    {addressSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); selectAddress(suggestion.properties.label); }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 text-slate-700 text-sm border-b border-slate-100 last:border-0 flex items-center gap-2"
                      >
                        <MapPin size={14} className="shrink-0 opacity-50"/>
                        <div>
                           <span className="font-bold">{suggestion.properties.label}</span>
                           <div className="text-xs text-slate-400 font-normal">{suggestion.properties.context}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* FIN CHAMP MODIFIÉ */}

            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Locataire(s)</label><input type="text" name="locataire" placeholder="Nom..." value={data.info.locataire} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bailleur / Mandataire</label><input type="text" name="bailleur" value={data.info.bailleur} onChange={handleInfoChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" /></div>
          </div>
        </section>

        {/* RESTE DU DASHBOARD (COMPTEURS, PIECES, SIGNATURES) - IDENTIQUE */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-700"><Zap size={20}/> Compteurs</div>
            <button onClick={addCompteur} className="text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md flex items-center gap-1 transition"><Plus size={16}/> Ajouter</button>
          </div>
          <div className="p-6 space-y-4">
            {data.compteurs.map((c, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                 <input type="text" value={c.type} onChange={(e) => updateCompteur(idx, 'type', e.target.value)} className="font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-32 md:w-40" />
                 <input type="text" placeholder="N° Série" value={c.num} onChange={(e) => updateCompteur(idx, 'num', e.target.value)} className="flex-1 p-2 border border-slate-200 rounded text-sm w-full" />
                 <input type="text" placeholder="Index" value={c.valeur} onChange={(e) => updateCompteur(idx, 'valeur', e.target.value)} className="flex-1 p-2 border border-slate-200 rounded text-sm w-full font-mono text-blue-600 font-bold" />
                 <input type="text" placeholder="Emplacement" value={c.loc} onChange={(e) => updateCompteur(idx, 'loc', e.target.value)} className="flex-1 p-2 border border-slate-200 rounded text-sm w-full" />
                 <button onClick={() => removeCompteur(idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Home size={24} className="text-blue-600"/> Pièces & Équipements</h2>
            <button onClick={addPiece} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow transition flex items-center gap-2"><Plus size={18}/> Nouvelle Pièce</button>
          </div>
          {data.pieces.map((piece, pIdx) => (
            <div key={pIdx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <input type="text" value={piece.nom} onChange={(e) => { const n = [...data.pieces]; n[pIdx].nom = e.target.value; setData({...data, pieces: n}); }} className="font-bold text-lg bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-slate-800" />
                <div className="flex gap-2">
                   <button onClick={() => addElement(pIdx)} className="text-xs bg-white border border-slate-300 hover:bg-blue-50 text-slate-600 px-3 py-1.5 rounded-md flex items-center gap-1 transition"><Plus size={14}/> Élément</button>
                   <button onClick={() => removePiece(pIdx)} className="text-slate-400 hover:text-red-600 p-1.5 transition"><Trash2 size={18}/></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr><th className="px-6 py-3 w-1/4">Élément</th><th className="px-6 py-3 w-1/4">État</th><th className="px-6 py-3 w-1/2">Commentaires & Photos</th><th className="px-2 py-3"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {piece.elements.map((el, eIdx) => (
                      <tr key={eIdx} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3 align-top"><input type="text" value={el.nom} onChange={(e) => updateElement(pIdx, eIdx, 'nom', e.target.value)} className="w-full bg-transparent font-medium text-slate-900 border-b border-transparent focus:border-blue-400 outline-none" /></td>
                        <td className="px-6 py-3 align-top">
                          <select value={el.etat} onChange={(e) => updateElement(pIdx, eIdx, 'etat', e.target.value)} className={`w-full p-1.5 rounded border ${el.etat === 'Neuf' ? 'bg-green-50 border-green-200 text-green-700' : el.etat === 'Bon état' ? 'bg-blue-50 border-blue-200 text-blue-700' : el.etat === 'État d\'usage' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            <option>Neuf</option><option>Bon état</option><option>État d'usage</option><option>Mauvais état</option><option>Non fonctionnel</option>
                          </select>
                        </td>
                        <td className="px-6 py-3">
                          <input type="text" placeholder="Commentaire..." value={el.com} onChange={(e) => updateElement(pIdx, eIdx, 'com', e.target.value)} className="w-full bg-transparent text-slate-600 border-b border-slate-200 focus:border-blue-400 outline-none mb-3" />
                          <div className="flex flex-wrap gap-2 items-center">
                            {el.photos.map((photo, photoIdx) => (
                              <div key={photoIdx} className="relative group w-12 h-12">
                                <img src={photo} alt="miniature" className="w-full h-full object-cover rounded border border-slate-300" />
                                <button onClick={() => removePhoto(pIdx, eIdx, photoIdx)} className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition"><XCircle size={16} fill="white" /></button>
                              </div>
                            ))}
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-500 rounded border border-slate-300 w-12 h-12 flex items-center justify-center transition"><Camera size={20} /><input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, pIdx, eIdx)} /></label>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-right align-top"><button onClick={() => removeElement(pIdx, eIdx)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2 font-bold text-slate-700"><PenTool size={20}/> Signatures</div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-2"><label className="text-sm font-bold text-slate-600">Locataire (Lu et approuvé)</label><button onClick={() => sigLocataireRef.current?.clear()} className="text-xs text-red-500 flex items-center gap-1 hover:underline"><Eraser size={12}/> Effacer</button></div>
              <div className="border border-slate-300 rounded-lg bg-slate-50 touch-none"><SignatureCanvas ref={sigLocataireRef} penColor="black" canvasProps={{className: 'w-full h-40 rounded-lg'}} backgroundColor="rgba(248, 250, 252, 1)" /></div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2"><label className="text-sm font-bold text-slate-600">Bailleur / Mandataire</label><button onClick={() => sigBailleurRef.current?.clear()} className="text-xs text-red-500 flex items-center gap-1 hover:underline"><Eraser size={12}/> Effacer</button></div>
              <div className="border border-slate-300 rounded-lg bg-slate-50 touch-none"><SignatureCanvas ref={sigBailleurRef} penColor="black" canvasProps={{className: 'w-full h-40 rounded-lg'}} backgroundColor="rgba(248, 250, 252, 1)" /></div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-8 pb-12">
           <button onClick={handleGenerate} disabled={isGenerating || isCompressing} className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold shadow-lg transition flex items-center gap-3 text-lg disabled:opacity-70">
            {isGenerating || isCompressing ? <Loader2 className="animate-spin" /> : <Save />} Générer et Signer le PDF
          </button>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
