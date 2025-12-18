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
  Check,
  ChevronRight
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

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

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
        nom: "Entrée / Couloir",
        elements: [
          { nom: "Porte palière", etat: "Bon état", com: "", photos: [] },
          { nom: "Murs", etat: "Bon état", com: "", photos: [] },
          { nom: "Sol", etat: "Bon état", com: "", photos: [] },
          { nom: "Plafond", etat: "Bon état", com: "", photos: [] }
        ]
      }
    ] as Piece[]
  });

  // --- LOGIQUE (Identique à avant, juste condensée pour la lisibilité) ---
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, pieceIndex: number, elIndex: number) => {
    if (e.target.files && e.target.files[0]) {
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImage(e.target.files[0]);
        const newPieces = [...data.pieces];
        newPieces[pieceIndex].elements[elIndex].photos.push(compressedBase64);
        setData({ ...data, pieces: newPieces });
      } catch (err) { alert("Erreur photo"); } finally { setIsCompressing(false); e.target.value = ''; }
    }
  };
  const removePhoto = (pIdx: number, eIdx: number, phIdx: number) => {
    if(confirm("Supprimer ?")) {
        const newPieces = [...data.pieces];
        newPieces[pIdx].elements[eIdx].photos = newPieces[pIdx].elements[eIdx].photos.filter((_, i) => i !== phIdx);
        setData({ ...data, pieces: newPieces });
    }
  };
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData({ ...data, info: { ...data.info, [e.target.name]: e.target.value } });
  const updateCompteur = (idx: number, field: string, val: string) => { const n = [...data.compteurs]; n[idx] = { ...n[idx], [field]: val }; setData({ ...data, compteurs: n }); };
  const addCompteur = () => setData({ ...data, compteurs: [...data.compteurs, { type: "Nouveau", num: "", valeur: "", loc: "" }] });
  const removeCompteur = (idx: number) => setData({ ...data, compteurs: data.compteurs.filter((_, i) => i !== idx) });
  const addPiece = () => { const n = prompt("Nom de la pièce ?"); if(n) setData({ ...data, pieces: [...data.pieces, { nom: n, elements: [{ nom: "Sol", etat: "Bon état", com: "", photos: [] }, { nom: "Murs", etat: "Bon état", com: "", photos: [] }] }] }); };
  const removePiece = (idx: number) => { if(confirm("Supprimer pièce ?")) setData({ ...data, pieces: data.pieces.filter((_, i) => i !== idx) }); };
  const updateElement = (pIdx: number, eIdx: number, field: keyof Element, val: string) => { const n = [...data.pieces]; (n[pIdx].elements[eIdx] as any)[field] = val; setData({ ...data, pieces: n }); };
  const addElement = (pIdx: number) => { const n = [...data.pieces]; n[pIdx].elements.push({ nom: "Nouvel élément", etat: "Bon état", com: "", photos: [] }); setData({ ...data, pieces: n }); };
  const removeElement = (pIdx: number, eIdx: number) => { const n = [...data.pieces]; n[pIdx].elements = n[pIdx].elements.filter((_, i) => i !== eIdx); setData({ ...data, pieces: n }); };
  
  const handleGenerate = async () => {
    if (!data.info.locataire || !data.info.adresse) { alert("⚠️ Nom et Adresse requis."); return; }
    setIsGenerating(true);
    try {
      const signatures = {
        locataire: sigLocataireRef.current?.isEmpty() ? null : sigLocataireRef.current.toDataURL(),
        bailleur: sigBailleurRef.current?.isEmpty() ? null : sigBailleurRef.current.toDataURL()
      };
      await downloadPdf(generateEdlHtml({ ...data, signatures }), `EDL_${data.info.locataire.replace(/\s+/g, '_')}.pdf`);
    } catch (e) { alert("Erreur PDF"); } finally { setIsGenerating(false); }
  };

  // --- COMPOSANTS UI "PREMIUM" ---
  
  // 1. Input Stylisé
  const PremiumInput = ({ label, ...props }: any) => (
    <div className="group">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 group-focus-within:text-brand-600 transition-colors">
        {label}
      </label>
      <input 
        {...props}
        className="w-full bg-slate-50 border-b-2 border-slate-200 px-3 py-2.5 text-slate-800 font-medium placeholder-slate-300 focus:bg-white focus:border-brand-600 outline-none transition-all duration-300 rounded-t-md hover:bg-slate-100"
      />
    </div>
  );

  // 2. Select Stylisé (Badge état)
  const StatusSelect = ({ value, onChange }: any) => {
    const styles = {
      'Neuf': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Bon état': 'bg-blue-50 text-blue-700 border-blue-200',
      'État d\'usage': 'bg-amber-50 text-amber-700 border-amber-200',
      'Mauvais état': 'bg-orange-50 text-orange-700 border-orange-200',
      'Non fonctionnel': 'bg-red-50 text-red-700 border-red-200'
    };
    // @ts-ignore
    const currentStyle = styles[value] || 'bg-slate-50 text-slate-700';

    return (
      <div className="relative">
        <select 
          value={value} 
          onChange={onChange}
          className={`appearance-none w-full py-2 pl-3 pr-8 rounded-lg text-xs font-bold uppercase tracking-wide border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-200 transition-all ${currentStyle}`}
        >
          <option>Neuf</option>
          <option>Bon état</option>
          <option>État d'usage</option>
          <option>Mauvais état</option>
          <option>Non fonctionnel</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <ChevronRight size={14} className="rotate-90" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 font-sans selection:bg-brand-100">
      
      {/* HEADER PREMIUM GLASSMORPHISM */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="group p-2 rounded-full hover:bg-slate-100 transition duration-300">
              <ArrowLeft size={22} className="text-slate-400 group-hover:text-slate-800 transition-colors"/>
            </a>
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                Éditeur <span className="text-brand-600">Expert</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">ÉTAT DES LIEUX NUMÉRIQUE</p>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isCompressing}
            className="group relative overflow-hidden bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2">
              {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18}/>}
              <span className="hidden sm:inline">Finaliser le Rapport</span>
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10 space-y-12">

        {/* 1. CARTE INFOS (Style "Carte de visite") */}
        <section className="bg-white rounded-2xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-brand-600">
              <User size={20}/> 
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-800">Dossier Locatif</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Type de constat</label>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                {['Entrée', 'Sortie', 'Pré-EDL'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setData({ ...data, info: { ...data.info, type: t === 'Pré-EDL' ? 'Pré-état des lieux' : t } })}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                      (t === 'Pré-EDL' && data.info.type === 'Pré-état des lieux') || data.info.type === t
                      ? 'bg-white text-brand-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <PremiumInput label="Date d'intervention" name="date" value={data.info.date} onChange={handleInfoChange} />
            <div className="md:col-span-2">
              <PremiumInput label="Adresse du bien" name="adresse" value={data.info.adresse} onChange={handleInfoChange} placeholder="Ex: 12 Résidence Vauban, 59000 Lille..." />
            </div>
            <PremiumInput label="Locataire(s)" name="locataire" value={data.info.locataire} onChange={handleInfoChange} placeholder="M. et Mme..." />
            <PremiumInput label="Bailleur / Mandataire" name="bailleur" value={data.info.bailleur} onChange={handleInfoChange} placeholder="Agence..." />
          </div>
        </section>

        {/* 2. COMPTEURS (Style "Tableau de bord") */}
        <section className="bg-white rounded-2xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-amber-500">
                <Zap size={20}/> 
              </div>
              <h2 className="font-serif text-xl font-bold text-slate-800">Relevés</h2>
            </div>
            <button onClick={addCompteur} className="text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition uppercase tracking-wide flex items-center gap-1">
              <Plus size={14}/> Ajouter
            </button>
          </div>
          <div className="p-6 grid gap-4">
            {data.compteurs.map((c, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 hover:border-brand-200 transition-colors group">
                 <input 
                    type="text" 
                    value={c.type} 
                    onChange={(e) => updateCompteur(idx, 'type', e.target.value)} 
                    className="bg-transparent font-bold text-slate-700 border-none focus:ring-0 w-full md:w-32 text-center md:text-left" 
                 />
                 <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                 <input type="text" placeholder="N° Série" value={c.num} onChange={(e) => updateCompteur(idx, 'num', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
                 <div className="relative flex-1 w-full">
                    <input type="text" placeholder="Index" value={c.valeur} onChange={(e) => updateCompteur(idx, 'valeur', e.target.value)} className="w-full bg-slate-900 text-white border-none rounded-lg px-3 py-2 text-sm font-mono tracking-wider text-center" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">RELEVÉ</span>
                 </div>
                 <input type="text" placeholder="Emplacement" value={c.loc} onChange={(e) => updateCompteur(idx, 'loc', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
                 <button onClick={() => removeCompteur(idx)} className="p-2 text-slate-300 hover:text-red-500 transition"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. PIÈCES (Style "Listing") */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="font-serif text-3xl font-bold text-slate-900">Inventaire</h2>
              <p className="text-slate-500 mt-1">Détail pièce par pièce</p>
            </div>
            <button onClick={addPiece} className="group flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-full font-bold shadow-sm hover:border-brand-300 hover:text-brand-600 transition-all">
              <span className="bg-slate-100 group-hover:bg-brand-100 p-1 rounded-full transition-colors"><Plus size={16}/></span>
              Nouvelle Pièce
            </button>
          </div>

          {data.pieces.map((piece, pIdx) => (
            <div key={pIdx} className="bg-white rounded-2xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <input 
                  type="text" 
                  value={piece.nom} 
                  onChange={(e) => { const n = [...data.pieces]; n[pIdx].nom = e.target.value; setData({...data, pieces: n}); }}
                  className="bg-transparent font-serif text-xl font-bold text-slate-800 border-none focus:ring-0 p-0 placeholder-slate-400"
                  placeholder="Nom de la pièce..."
                />
                <div className="flex gap-2">
                   <button onClick={() => addElement(pIdx)} className="text-xs font-bold text-brand-600 bg-white border border-brand-100 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><Plus size={14}/> Élément</button>
                   <button onClick={() => removePiece(pIdx)} className="text-slate-400 hover:text-red-500 p-1.5 transition"><Trash2 size={18}/></button>
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {piece.elements.map((el, eIdx) => (
                  <div key={eIdx} className="p-6 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      
                      {/* Colonne Gauche : Nom & État */}
                      <div className="w-full lg:w-1/3 space-y-3">
                        <input 
                          type="text" 
                          value={el.nom} 
                          onChange={(e) => updateElement(pIdx, eIdx, 'nom', e.target.value)} 
                          className="w-full bg-transparent font-bold text-slate-700 border-none p-0 focus:ring-0 placeholder-slate-300 text-lg"
                          placeholder="Nom (ex: Mur Nord)"
                        />
                        <StatusSelect value={el.etat} onChange={(e: any) => updateElement(pIdx, eIdx, 'etat', e.target.value)} />
                      </div>

                      {/* Colonne Droite : Commentaire & Photos */}
                      <div className="w-full lg:w-2/3 space-y-4">
                        <textarea 
                          rows={2}
                          placeholder="Observations particulières..." 
                          value={el.com} 
                          onChange={(e) => updateElement(pIdx, eIdx, 'com', e.target.value)} 
                          className="w-full bg-slate-50 border-none rounded-lg p-3 text-sm text-slate-600 focus:ring-2 focus:ring-brand-100 focus:bg-white transition resize-none"
                        />
                        
                        {/* Zone Photos Améliorée */}
                        <div className="flex flex-wrap gap-3">
                          {el.photos.map((photo, photoIdx) => (
                            <div key={photoIdx} className="relative group/photo w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                              <img src={photo} className="w-full h-full object-cover" />
                              <button onClick={() => removePhoto(pIdx, eIdx, photoIdx)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition backdrop-blur-sm">
                                <Trash2 size={16} className="text-white"/>
                              </button>
                            </div>
                          ))}
                          <label className="cursor-pointer w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-brand-400 hover:bg-brand-50 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-brand-500 transition group/add">
                            <Camera size={20} className="group-hover/add:scale-110 transition-transform"/>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, pIdx, eIdx)} />
                          </label>
                        </div>
                      </div>

                      {/* Delete Element Button */}
                      <button onClick={() => removeElement(pIdx, eIdx)} className="lg:self-center text-slate-200 hover:text-red-400 transition">
                         <XCircle size={20} />
                      </button>

                    </div>
                  </div>
                ))}
                {piece.elements.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-slate-100 m-4 rounded-xl">
                    <p className="text-slate-400 text-sm font-medium">Cette pièce est vide.</p>
                    <button onClick={() => addElement(pIdx)} className="mt-2 text-brand-600 font-bold text-sm hover:underline">Ajouter un premier élément</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* 4. SIGNATURES (Style "Papier Officiel") */}
        <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden print:break-before-page">
          <div className="bg-slate-900 px-8 py-6 flex items-center gap-3 text-white">
            <PenTool size={20} className="text-brand-400"/>
            <h2 className="font-serif text-xl font-bold">Approbation & Signatures</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Pad Locataire */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-slate-800">Le Locataire</h3>
                  <p className="text-xs text-slate-500">Lu et approuvé</p>
                </div>
                <button onClick={() => sigLocataireRef.current?.clear()} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition">
                  <Eraser size={14}/> Recommencer
                </button>
              </div>
              <div className="relative border-2 border-slate-200 rounded-xl bg-slate-50 overflow-hidden hover:border-brand-300 transition-colors cursor-crosshair h-48">
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
                   <h1 className="text-4xl font-serif font-bold text-slate-900 rotate-[-12deg]">SIGNER ICI</h1>
                </div>
                <SignatureCanvas 
                  ref={sigLocataireRef}
                  penColor="#1e293b"
                  velocityFilterWeight={0.7}
                  canvasProps={{className: 'w-full h-full'}}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                <Check size={14} /> Consentement numérique validé
              </div>
            </div>

            {/* Pad Bailleur */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-slate-800">L'Expert / Bailleur</h3>
                  <p className="text-xs text-slate-500">Pour valoir ce que de droit</p>
                </div>
                <button onClick={() => sigBailleurRef.current?.clear()} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition">
                  <Eraser size={14}/> Recommencer
                </button>
              </div>
              <div className="relative border-2 border-slate-200 rounded-xl bg-slate-50 overflow-hidden hover:border-brand-300 transition-colors cursor-crosshair h-48">
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
                   <h1 className="text-4xl font-serif font-bold text-slate-900 rotate-[-12deg]">SIGNER ICI</h1>
                </div>
                <SignatureCanvas 
                  ref={sigBailleurRef}
                  penColor="#1e293b"
                  velocityFilterWeight={0.7}
                  canvasProps={{className: 'w-full h-full'}}
                />
              </div>
            </div>

          </div>
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Certifié par EDL Lille Expert © {new Date().getFullYear()}</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
