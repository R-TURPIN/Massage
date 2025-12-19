import React, { useState } from 'react';
import { 
  Printer, Cpu, Zap, Menu, X, ArrowRight, Box, Loader2, Mail, Phone, Settings, CheckCircle 
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
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-brand-600 text-white p-2.5 rounded-lg group-hover:bg-brand-700 transition"><Box size={24}/></div>
            <div className="leading-tight">
              <span className="font-bold text-xl block">AXOM<span className="text-brand-600">.Manufacture</span></span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Atelier 4.0</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 items-center font-medium text-slate-600">
            <button onClick={() => scrollTo('services')} className="hover:text-brand-600 transition">Expertises</button>
            <button onClick={() => scrollTo('machines')} className="hover:text-brand-600 transition">Parc Machine</button>
            <button onClick={() => scrollTo('contact')} className="bg-brand-600 text-white px-6 py-2.5 rounded-full hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 flex items-center gap-2">
              Devis Express <ArrowRight size={18}/>
            </button>
          </div>
          <button className="md:hidden text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={28}/></button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl">
            <button onClick={() => scrollTo('services')} className="block w-full text-left p-2 font-bold">Expertises</button>
            <button onClick={() => scrollTo('contact')} className="block w-full bg-brand-600 text-white p-3 rounded-lg text-center font-bold">Demander un Devis</button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <header className="relative bg-slate-900 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="3D Print" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Atelier opérationnel à Châteauroux
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            De l'idée à l'objet <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">Industriel & Événementiel</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Spécialiste de la fabrication additive (FDM) et de l'usinage numérique. 
            Nous produisons vos prototypes, petites séries et pièces techniques en délais courts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => scrollTo('contact')} className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-900/50 transition transform hover:-translate-y-1">
              Lancer une production
            </button>
            <button onClick={() => scrollTo('machines')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-md transition">
              Voir le parc machine
            </button>
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nos Solutions de Fabrication</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Une réponse technique adaptée à chaque besoin, du prototype unique à la série de 500 pièces.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Printer size={32}/>} 
              title="Impression 3D FDM" 
              desc="Idéal pour le prototypage rapide et les pièces fonctionnelles."
              tags={['PLA / PETG / TPU', 'Bambu Lab A1', 'Volume 256³ mm']}
            />
            <ServiceCard 
              icon={<Settings size={32}/>} 
              title="Usinage CNC" 
              desc="Découpe et gravure précise sur matériaux denses."
              tags={['Bois & MDF', 'Plastiques techniques', 'Format 6040']}
            />
            <ServiceCard 
              icon={<Zap size={32}/>} 
              title="Gravure Laser" 
              desc="Personnalisation et découpe fine pour l'événementiel."
              tags={['Marquage', 'Découpe Acrylique', 'Goodies']}
            />
          </div>
        </div>
      </section>

      {/* MACHINES */}
      <section id="machines" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Un Parc Machine Haute Performance</h2>
            <p className="text-slate-600 mb-8 text-lg">
              Nous investissons dans des machines fiables et rapides pour garantir des délais de production imbattables (J+2 possible).
            </p>
            <div className="space-y-4">
              <MachineRow name="Bambu Lab A1" desc="Vitesse d'impression extrême, changement de couleur, idéal pour le PLA/PETG." />
              <MachineRow name="Creality K1C" desc="Imprimante fermée pour les matériaux techniques (ABS, ASA) nécessitant une température stable." />
              <MachineRow name="CNC 6040" desc="Fraiseuse robuste pour l'usinage 2.5D de bois, composites et gravure alu." />
            </div>
          </div>
          <div className="relative h-[500px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1622340321330-d322b7999742?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Atelier" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 border border-white/20 bg-black/30 backdrop-blur-md rounded-xl">
                <span className="text-5xl font-bold text-white block mb-2">3+</span>
                <span className="text-sm uppercase tracking-widest text-slate-300">Machines Connectées</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-slate-900 text-white relative">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="bg-brand-600 p-10 md:w-2/5 flex flex-col justify-between text-white">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Atelier</h3>
              <p className="text-brand-100 mb-8">Décrivez votre projet. Si vous avez des fichiers 3D (STL, STEP), précisez-le, nous vous enverrons un lien sécurisé.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Mail className="text-brand-200"/> contact@axom.fr</div>
                <div className="flex items-center gap-3"><Phone className="text-brand-200"/> 06 XX XX XX XX</div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-brand-500/30 text-sm text-brand-200">
              Réponse sous 24h ouvrées.
            </div>
          </div>
          
          <div className="p-10 md:w-3/5 bg-white text-slate-900">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">Demande de Devis</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Nom complet" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full" value={formData.nom_complet} onChange={e => setFormData({...formData, nom_complet: e.target.value})} required />
                <input placeholder="Société (Optionnel)" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full" value={formData.societe} onChange={e => setFormData({...formData, societe: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="email" placeholder="Email pro" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="tel" placeholder="Téléphone" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} required />
              </div>
              <textarea rows={4} placeholder="Détails du projet (Matériau, Quantité, Délais...)" className="bg-slate-50 border border-slate-200 p-3 rounded-lg w-full" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
              <button disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2">
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
    <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-600 mb-6 leading-relaxed">{desc}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((t: string) => <span key={t} className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">{t}</span>)}
    </div>
  </div>
);

const MachineRow = ({ name, desc }: any) => (
  <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
    <div className="bg-brand-100 p-2 h-fit rounded text-brand-700"><Settings size={20}/></div>
    <div>
      <h4 className="font-bold text-slate-900">{name}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  </div>
);

export default App;
