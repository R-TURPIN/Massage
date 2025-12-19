import React, { useState } from 'react';
import { 
  Printer, Cpu, Zap, Menu, ArrowRight, Box, Loader2, Mail, Phone, Layers, ShieldCheck, Clock 
} from 'lucide-react';
import { pb } from './pocketbase';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ nom_complet: '', email: '', telephone: '', societe: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await pb.collection('demandes').create({ ...formData, pack: 'Contact Web AXOM', ville: 'France' });
      alert("✅ Projet transmis à l'atelier ! Nous analysons votre demande.");
      setFormData({ nom_complet: '', email: '', telephone: '', societe: '', message: '' });
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion. Contactez-nous par téléphone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }); setIsMenuOpen(false); }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-brand-600 text-white p-2.5 rounded-lg group-hover:bg-brand-700 transition shadow-lg shadow-brand-500/30"><Box size={24}/></div>
            <div className="leading-tight">
              <span className="font-bold text-xl block">AXOM<span className="text-brand-600">.Manufacture</span></span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Atelier 4.0</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 items-center font-medium text-slate-600">
            <button onClick={() => scrollTo('services')} className="hover:text-brand-600 transition">Expertises</button>
            <button onClick={() => scrollTo('process')} className="hover:text-brand-600 transition">Notre Approche</button>
            <button onClick={() => scrollTo('contact')} className="bg-brand-600 text-white px-6 py-2.5 rounded-full hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 flex items-center gap-2">
              Chiffrage Projet <ArrowRight size={18}/>
            </button>
          </div>
          <button className="md:hidden text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={28}/></button>
        </div>
      </nav>

      {/* HERO SECTION - Nouvelle Image Tech/Abstraite */}
      <header className="relative bg-slate-900 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          {/* Image abstraite géométrique sombre, très pro */}
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop" className="w-full h-full object-cover" alt="Background Tech" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></span> Production Française & Réactive
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            Façonnez l'avenir <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">sans limites techniques</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Partenaire industriel pour vos prototypes et petites séries.
            Nous maîtrisons la chaîne numérique complète : de la modélisation à la pièce finie.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => scrollTo('contact')} className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-900/50 transition transform hover:-translate-y-1">
              Soumettre un fichier
            </button>
            <button onClick={() => scrollTo('services')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-md transition">
              Nos capacités
            </button>
          </div>
        </div>
      </header>

      {/* SERVICES - Texte flou sur les machines */}
      <section id="services" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Solutions de Fabrication</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Un parc machine polyvalent capable de répondre aux exigences de l'industrie, du design et de l'événementiel.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Printer size={32}/>} 
              title="Impression 3D FDM" 
              desc="Production de pièces fonctionnelles avec des thermoplastiques techniques. Idéal pour valider une forme ou produire en série sans moule."
              tags={['Prototypage Rapide', 'Petite Série', 'Matériaux Techniques']}
            />
            <ServiceCard 
              icon={<Layers size={32}/>} 
              title="Usinage Numérique" 
              desc="Découpe et gravure par enlèvement de matière. Précision millimétrique pour le bois, les composites et les métaux tendres."
              tags={['Découpe 2.5D', 'Sur-mesure', 'Finitions Soignées']}
            />
            <ServiceCard 
              icon={<Zap size={32}/>} 
              title="Gravure Laser" 
              desc="Marquage inaltérable et découpe fine. La solution privilégiée pour la signalétique, l'identification industrielle et les goodies."
              tags={['Personnalisation', 'Signalétique', 'Découpe Acrylique']}
            />
          </div>
        </div>
      </section>

      {/* PROCESS - Remplaçant de la section "Machines" */}
      <section id="process" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Pourquoi choisir AXOM ?</h2>
            <p className="text-slate-600 mb-8 text-lg">
              Au-delà des machines, nous apportons une expertise technique pour optimiser vos coûts et vos délais.
            </p>
            <div className="space-y-6">
              <FeatureRow icon={<Clock className="text-brand-600"/>} title="Réactivité Extrême" desc="Devis sous 24h. Production lancée dès validation. Expédition express partout en France." />
              <FeatureRow icon={<ShieldCheck className="text-brand-600"/>} title="Qualité Garantie" desc="Chaque pièce est contrôlée manuellement. Nous garantissons la conformité dimensionnelle et esthétique." />
              <FeatureRow icon={<Box className="text-brand-600"/>} title="Capacité Industrielle" desc="Notre ferme d'impression tourne 24/7 pour absorber vos pics de production." />
            </div>
          </div>
          <div className="relative h-[500px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl group">
            {/* Image atelier sombre/mystérieux */}
            <img src="https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=1936&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" alt="Atelier" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 border border-white/20 bg-black/40 backdrop-blur-md rounded-xl">
                <span className="text-4xl font-bold text-white block mb-2">Made in France</span>
                <span className="text-xs uppercase tracking-widest text-slate-300">Atelier basé à Châteauroux</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-slate-900 text-white relative">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-brand-600 p-10 md:w-2/5 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">Parlez-nous de votre projet</h3>
              <p className="text-brand-100 mb-8">Vous avez un fichier 3D ou une simple idée ? Remplissez ce formulaire, nous revenons vers vous avec une solution chiffrée.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Mail className="text-brand-200"/> contact@axom.fr</div>
                <div className="flex items-center gap-3"><Phone className="text-brand-200"/> 06 XX XX XX XX</div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-brand-500/30 text-sm text-brand-200">
              Réponse garantie sous 24h ouvrées.
            </div>
          </div>
          
          <div className="p-10 md:w-3/5 bg-white text-slate-900">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Demande de Chiffrage</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Nom complet" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 outline-none transition" value={formData.nom_complet} onChange={e => setFormData({...formData, nom_complet: e.target.value})} required />
                <input placeholder="Société (Optionnel)" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 outline-none transition" value={formData.societe} onChange={e => setFormData({...formData, societe: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="email" placeholder="Email pro" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 outline-none transition" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="tel" placeholder="Téléphone" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 outline-none transition" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} required />
              </div>
              <textarea rows={4} placeholder="Description du besoin (Matériau, Quantité, Délais, Lien WeTransfer...)" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-500 outline-none transition" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
              <button disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin"/> : <>Envoyer la demande <ArrowRight size={18}/></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-12 text-center border-t border-slate-900">
        <p>&copy; 2025 AXOM Manufacture. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, tags }: any) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-500 transition group cursor-default">
    <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition shadow-sm">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-600 mb-6 leading-relaxed text-sm">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((t: string) => <span key={t} className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">{t}</span>)}
    </div>
  </div>
);

const FeatureRow = ({ icon, title, desc }: any) => (
  <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
    <div className="bg-brand-50 p-3 h-fit rounded-lg">{icon}</div>
    <div>
      <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default App;
