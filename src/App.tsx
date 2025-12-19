import React, { useState } from 'react';
import { 
  CheckCircle, 
  Printer, 
  Cpu, 
  Zap, 
  Menu, 
  X, 
  ArrowRight, 
  Box, 
  Loader2,
  Settings,
  Phone,
  Mail
} from 'lucide-react';
import { pb } from './pocketbase';

// On définit les composants AVANT pour être sûr qu'ils existent
const ServiceCard = ({ icon, title, subtitle, features, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-500 hover:shadow-xl transition cursor-pointer group">
    <div className="text-brand-600 mb-6 bg-brand-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">{icon}</div>
    <h3 className="text-2xl font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-brand-600 font-medium mb-6 text-sm uppercase tracking-wide">{subtitle}</p>
    <ul className="space-y-3 mb-8">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
          <CheckCircle size={16} className="text-brand-500 mt-0.5" /> <span>{f}</span>
        </li>
      ))}
    </ul>
    <div className="text-brand-700 font-bold flex items-center gap-2 text-sm group-hover:translate-x-2 transition">
      Demander un prix <ArrowRight size={16}/>
    </div>
  </div>
);

const MachineItem = ({ name, desc }: { name: string, desc: string }) => (
  <li className="flex gap-4 items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
    <div className="bg-white p-2 rounded shadow-sm text-brand-600"><Settings size={20} /></div>
    <div>
      <h4 className="font-bold text-slate-900">{name}</h4>
      <p className="text-sm text-slate-600 leading-snug">{desc}</p>
    </div>
  </li>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    societe: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleBooking = (serviceName: string) => {
    setSelectedService(serviceName);
    scrollToSection('contact');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await pb.collection('demandes').create({
        ...formData,
        pack: selectedService || 'Projet Sur Mesure',
        ville: 'France' 
      });

      alert("✅ Projet reçu ! Nous analysons votre demande et vous envoyons un devis sous 24h.");
      setFormData({ nom_complet: '', email: '', telephone: '', societe: '', message: '' });
      setSelectedService("");
      
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue. Contactez-nous directement par téléphone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <div className="bg-brand-900 p-2.5 rounded-lg text-white group-hover:bg-brand-700 transition">
                <Box size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-slate-900 leading-none">
                  AXOM<span className="text-brand-600">.Manufacture</span>
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">FABRICATION ADDITIVE & USINAGE</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-slate-900 hover:text-brand-700 font-bold transition">Nos Services</button>
              <button onClick={() => scrollToSection('machines')} className="text-slate-600 hover:text-brand-700 font-medium transition">Le Parc Machine</button>
              <button onClick={() => scrollToSection('contact')} className="bg-brand-700 text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-800 transition shadow-lg flex items-center gap-2">
                Demander un Devis
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=2000&auto=format&fit=crop" alt="3D Printer" className="w-full h-full object-cover opacity-20"/>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-1.5 mb-8 backdrop-blur-md">
              <Settings size={16} className="text-brand-400 animate-spin-slow" />
              <span className="text-sm font-semibold text-white tracking-wide">Atelier basé à Châteauroux - Livraison France J+2</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-tight">
              De l'idée à l'objet <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-white">Industriel & Événementiel</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Prototypage rapide, petite série et objets sur-mesure. 
              Nous transformons vos fichiers 3D en réalité grâce à un parc machines performant (FDM, CNC, Laser).
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button onClick={() => scrollToSection('contact')} className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl flex items-center justify-center gap-3">
                <Box size={20} />
                Lancer un Projet
              </button>
              <button onClick={() => scrollToSection('services')} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
                Découvrir nos solutions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Nos Domaines d'Expertise</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Nous accompagnons les professionnels et l'événementiel sur des projets à forte valeur ajoutée.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Printer size={40} />}
              title="Impression 3D FDM"
              subtitle="Prototypage & Série"
              features={['PLA, PETG, TPU, ABS', 'Volume max 256x256x256mm', 'Haute vitesse (Bambu/Creality)', 'Précision dimensionnelle']}
              onClick={() => handleBooking('Impression 3D')}
            />
            <ServiceCard 
              icon={<Cpu size={40} />}
              title="Usinage CNC"
              subtitle="Gravure & Découpe"
              features={['Bois & MDF', 'Plastiques Techniques', 'Aluminium (Gravure)', 'Usinage 6040 (60x40cm)']}
              onClick={() => handleBooking('Usinage CNC')}
            />
            <ServiceCard 
              icon={<Zap size={40} />}
              title="Laser & Goodies"
              subtitle="Personnalisation"
              features={['Gravure précise', 'Découpe acrylique/bois', 'Trophées événementiels', 'Signalétique sur mesure']}
              onClick={() => handleBooking('Laser / Goodies')}
            />
          </div>
        </div>
      </section>

      {/* Parc Machine */}
      <section id="machines" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Un Parc Machine Fiabilisé</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Nous avons sélectionné des machines modernes et rapides pour garantir des délais courts sans sacrifier la qualité.
              </p>
              <ul className="space-y-4">
                <MachineItem name="Bambu Lab A1" desc="La référence actuelle. Idéale pour le PLA/PETG, multicolore possible, rapidité extrême." />
                <MachineItem name="Creality K1C" desc="Imprimante fermée haute vitesse. Parfaite pour les matériaux techniques (ABS, ASA)." />
                <MachineItem name="CNC 6040" desc="Fraiseuse numérique robuste pour le travail du bois, des plastiques durs et la gravure métal." />
                <MachineItem name="Gravure Laser" desc="Pour le marquage permanent et la découpe fine de matériaux organiques." />
              </ul>
            </div>
            <div className="relative h-[400px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                <span className="text-9xl opacity-10 font-bold">ATELIER</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-bold text-xl">Production à Châteauroux</p>
                <p className="text-sm opacity-80">Expédition France & Europe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Parlez-nous de votre projet</h2>
              <p className="text-slate-500">
                Devis gratuit sous 24h. Pour les fichiers 3D (STL, STEP), merci de préciser un lien WeTransfer dans le message si besoin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">Nom Complet</label>
                  <input name="nom_complet" value={formData.nom_complet} onChange={handleChange} type="text" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">Société (Optionnel)</label>
                  <input name="societe" value={formData.societe} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Votre entreprise" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="contact@email.com" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 ml-1">Téléphone</label>
                  <input name="telephone" value={formData.telephone} onChange={handleChange} type="tel" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="06 XX XX XX XX" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Type de prestation</label>
                <select name="pack" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none">
                  <option value="" disabled>Choisir un service...</option>
                  <option>Impression 3D (FDM)</option>
                  <option>Usinage CNC</option>
                  <option>Gravure Laser</option>
                  <option>Projet Événementiel / Goodies</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Description du projet</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Matériaux souhaités, quantités, délais, lien vers fichiers 3D..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-700 transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Envoyer la demande <ArrowRight size={20} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-center">
        <div className="flex flex-col items-center gap-4">
          <p>&copy; {new Date().getFullYear()} AXOM Manufacture. Atelier situé à Châteauroux (36).</p>
          <div className="flex gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-brand-500" />
              <span>contact@axom.fr</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-brand-500" />
              <span>06 XX XX XX XX</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
