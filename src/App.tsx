import React, { useState } from 'react';
import { 
  Printer, Settings, Zap, MapPin, ShieldCheck, Clock, ChevronRight, Menu, X, Phone, Mail, Linkedin, CheckCircle2, ArrowRight
} from 'lucide-react';
import { pb } from './pocketbase';

// --- Composants UI (Intégrés pour éviter les bugs) ---
const SectionTitle = ({ title, subtitle, light = false }: any) => (
  <div className="mb-12 md:mb-20">
    <h2 className={`text-3xl md:text-5xl font-serif font-bold mb-6 ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
    <div className={`h-1 w-24 mb-6 ${light ? 'bg-brand-500' : 'bg-brand-600'}`}></div>
    <p className={`text-lg md:text-xl max-w-2xl font-light leading-relaxed ${light ? 'text-slate-400' : 'text-slate-600'}`}>{subtitle}</p>
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "inline-flex items-center justify-center px-8 py-4 rounded-none text-sm font-bold tracking-widest uppercase transition-all duration-300";
  const styles = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg hover:-translate-y-1",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-white/30 text-white hover:bg-white hover:text-slate-900"
  };
  // @ts-ignore
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" {...props} />
  </div>
);

// --- Page Principale ---
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await pb.collection('demandes').create({ ...formData, pack: 'Contact Site AXOM', ville: 'France' });
      alert("✅ Demande reçue ! Nos ingénieurs vous recontactent sous 24h.");
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
    } catch (err) { alert("Erreur technique. Appelez-nous."); }
    finally { setIsSubmitting(false); }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-600 selection:text-white bg-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="font-serif text-2xl font-bold tracking-tighter text-slate-900">
            AXOM<span className="text-brand-600">.MANUFACTURE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button onClick={() => scrollTo('services')} className="hover:text-brand-600 transition">SOLUTIONS</button>
            <button onClick={() => scrollTo('expertise')} className="hover:text-brand-600 transition">ATELIER</button>
            <Button onClick={() => scrollTo('contact')} className="!py-3 !px-6 text-xs">Devis Projet</Button>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-6 space-y-4">
            <button onClick={() => scrollTo('services')} className="block font-bold">Solutions</button>
            <button onClick={() => scrollTo('contact')} className="block font-bold text-brand-600">Devis</button>
          </div>
        )}
      </nav>

      {/* Hero Section - Image Abstraite Tech */}
      <section className="relative h-screen min-h-[700px] flex items-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" className="w-full h-full object-cover" alt="Industrial Abstract" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase mb-8 text-slate-300">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Production Française
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8">
              L'industrie agile <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">à la demande.</span>
            </h1>
            <p className="text-xl text-slate-300 font-light mb-12 max-w-xl leading-relaxed">
              De l'unité à la série. Nous transformons vos fichiers numériques en pièces physiques grâce à un parc machine de dernière génération.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button onClick={() => scrollTo('contact')}>Lancer une production</Button>
              <Button variant="outline" onClick={() => scrollTo('services')}>Nos Capacités</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Expertise Industrielle" subtitle="Une réponse technique agnostique : nous sélectionnons le procédé le plus adapté à vos contraintes de coût et de résistance." />
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Printer size={32}/>, title: "Fabrication Additive", desc: "Production de pièces complexes sans outillage. Idéal pour le prototypage fonctionnel et les petites séries en thermoplastiques techniques." },
              { icon: <Settings size={32}/>, title: "Usinage de Précision", desc: "Soustraction de matière numérique (CNC) pour les matériaux denses (Bois, Composites, Métaux tendres). Tolérances serrées." },
              { icon: <Zap size={32}/>, title: "Découpe & Gravure Laser", desc: "Finitions haute définition pour la signalétique, le marquage industriel et les projets événementiels sur-mesure." }
            ].map((s, i) => (
              <div key={i} className="group cursor-default">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-600 mb-8 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-500">{s.icon}</div>
                <h3 className="text-2xl font-bold mb-4 font-serif">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="expertise" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-900/20 blur-3xl rounded-full translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionTitle light title="L'Exigence AXOM" subtitle="Nous ne sommes pas un simple service d'impression en ligne. Nous sommes votre atelier déporté." />
            <div className="space-y-8">
              {[
                { title: "Confidentialité Totale", desc: "Vos fichiers sont sécurisés. NDA signé sur simple demande." },
                { title: "Réactivité J+1", desc: "Devis express. Lancement production immédiat après validation." },
                { title: "Contrôle Qualité", desc: "Chaque pièce est inspectée manuellement et post-traitée avant expédition." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="mt-1 text-brand-500"><CheckCircle2/></div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-slate-400 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 border-2 border-white/10 translate-x-4 translate-y-4"></div>
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" alt="Atelier" className="relative w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-32 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white shadow-2xl p-8 md:p-16 flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h3 className="text-3xl font-serif font-bold mb-6">Démarrons<br/>le projet.</h3>
              <p className="text-slate-600 mb-8">Envoyez-nous vos détails. Si vous avez des fichiers 3D, nous vous enverrons un lien de dépôt sécurisé.</p>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center gap-3"><Mail className="text-brand-600"/> contact@axom.fr</div>
                <div className="flex items-center gap-3"><Phone className="text-brand-600"/> 06 XX XX XX XX</div>
                <div className="flex items-center gap-3"><MapPin className="text-brand-600"/> Châteauroux, France</div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="md:w-2/3 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Nom Complet" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} required />
                <Input label="Société" value={formData.company} onChange={(e:any) => setFormData({...formData, company: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Email Pro" type="email" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} required />
                <Input label="Téléphone" type="tel" value={formData.phone} onChange={(e:any) => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Détails du projet</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Matériau souhaité, quantité, échéance..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full py-5 text-lg">
                {isSubmitting ? 'Envoi...' : 'Demander mon chiffrage'} <ArrowRight className="ml-2"/>
              </Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-12 text-center text-xs text-slate-400 uppercase tracking-widest">
        &copy; 2025 AXOM Manufacture. Tous droits réservés.
      </footer>
    </div>
  );
};

export default App;
