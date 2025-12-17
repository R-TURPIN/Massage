import React, { useState } from 'react';
import { generateEdlHtml } from './utils/edlTemplate';
import { downloadPdf } from './utils/pdfGenerator';
import { FileText, Loader2, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // DONNÉES DE TEST (Ton pote pourra modifier ça via des inputs plus tard)
  const [data, setData] = useState({
    info: {
      type: "Entrée",
      date: new Date().toLocaleDateString('fr-FR'),
      adresse: "123 Rue Nationale, 59000 Lille",
      bailleur: "SCPI Nord Immo",
      locataire: "Jean Dupont"
    },
    compteurs: [
      { type: "Électricité (Linky)", num: "8400293", valeur: "14590 kWh", loc: "Couloir entrée" },
      { type: "Eau Froide", num: "H772", valeur: "349 m3", loc: "Placard cuisine" },
      { type: "Gaz", num: "GZ99", valeur: "1200 m3", loc: "Cuisine" }
    ],
    pieces: [
      {
        nom: "Entrée / Couloir",
        elements: [
          { nom: "Porte d'entrée", etat: "Bon état", com: "Serrure 3 points fonctionne. 3 clés remises." },
          { nom: "Murs", etat: "État d'usage", com: "Quelques traces de frottement hauteur d'homme." },
          { nom: "Sol", etat: "Bon état", com: "Parquet flottant, pas de rayure majeure." },
          { nom: "Plafond", etat: "Bon état", com: "Peinture blanche récente." }
        ]
      },
      {
        nom: "Cuisine Équipée",
        elements: [
          { nom: "Sol", etat: "Très bon état", com: "Carrelage gris 60x60." },
          { nom: "Évier", etat: "Bon état", com: "Inox 1 bac + égouttoir. Mitigeur OK." },
          { nom: "Plaques", etat: "Neuf", com: "Induction Brandt. Fonctionne." },
          { nom: "Meubles hauts", etat: "Bon état", com: "2 portes. Charnières OK." }
        ]
      },
      {
        nom: "Salle de Bain",
        elements: [
          { nom: "Douche", etat: "Moyen", com: "Joints silicone à refaire (noircis)." },
          { nom: "Vasque", etat: "Bon état", com: "Céramique blanche, pas d'éclat." }
        ]
      }
    ]
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    // 1. On transforme les données JSON en HTML
    const html = generateEdlHtml(data);
    
    // 2. On envoie à Gotenberg
    await downloadPdf(html, `EDL-${data.info.locataire.replace(' ', '_')}.pdf`);
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* En-tête de l'App */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-lg"><FileText size={24}/></span>
            Outil Expert
          </h1>
          <a href="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16}/> Retour site
          </a>
        </div>

        {/* Carte de contrôle */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Résumé de l'intervention</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Adresse</p>
                <p className="font-medium">{data.info.adresse}</p>
              </div>
              <div>
                <p className="text-slate-500">Locataire</p>
                <p className="font-medium">{data.info.locataire}</p>
              </div>
              <div>
                <p className="text-slate-500">Pièces inspectées</p>
                <p className="font-medium">{data.pieces.length} pièces</p>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p className="font-medium">{data.info.date}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-blue-800 text-sm">
            💡 Ceci est une version de démonstration. Les données sont pré-remplies pour tester la génération du moteur PDF Gotenberg.
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                Génération en cours... (~3s)
              </>
            ) : (
              <>
                <FileText />
                Générer le rapport PDF
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
