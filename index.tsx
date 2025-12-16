import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// --- Composants SVG Icones (Pour éviter les dépendances externes) ---
interface IconProps {
  className?: string;
}

const PhoneIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const CheckIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const ClipboardIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);
const KeyIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.75m.25-2.25l1-1 3 3"></path></svg>
);
const CubeIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const ClockIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const MapPinIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const ChevronRightIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
);

// --- Composants UI ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 border text-base font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "border-transparent text-dark bg-gold hover:bg-goldhover shadow-sm focus:ring-gold",
    secondary: "border-white text-white hover:bg-white hover:text-forest focus:ring-white",
    outline: "border-forest text-forest bg-transparent hover:bg-forest hover:text-white",
    ghost: "border-transparent text-dark hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Sections ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo Text */}
        <div className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-forest' : 'text-white'}`}>
          Lille<span className={isScrolled ? 'text-gold' : 'text-gold'}>Inventaire</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#services" className={`font-medium hover:text-gold transition-colors ${isScrolled ? 'text-dark' : 'text-white'}`}>Services</a>
          <a href="#process" className={`font-medium hover:text-gold transition-colors ${isScrolled ? 'text-dark' : 'text-white'}`}>Processus</a>
          <a href="#about" className={`font-medium hover:text-gold transition-colors ${isScrolled ? 'text-dark' : 'text-white'}`}>Zone d'intervention</a>
          
          <div className="flex items-center space-x-4 ml-4">
            <a href="tel:0600000000" className={`font-semibold flex items-center ${isScrolled ? 'text-dark' : 'text-white'}`}>
              <PhoneIcon className="w-4 h-4 mr-2" />
              06 00 00 00 00
            </a>
            <Button variant="primary" className="py-2 px-4 text-sm">
              Devis Rapide
            </Button>
          </div>
        </div>

        {/* Mobile Menu Icon (Placeholder) */}
        <div className="md:hidden">
             <Button variant="primary" className="py-2 px-3 text-xs">Devis</Button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative bg-forest pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Abstract Pattern */}
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#fff" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
        <div className="lg:w-2/3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            L’expert de vos états des lieux sur la <span className="text-gold">Métropole Lilloise</span>.
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0">
            Sécurisez vos locations grâce à une expertise indépendante à Lille, Roubaix, Tourcoing et environs. Conformité Loi Alur garantie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="primary" className="shadow-lg transform hover:-translate-y-1">
              Obtenir un devis gratuit
            </Button>
            <Button variant="secondary">
              Découvrir nos services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const MainService = () => {
  return (
    <section id="services" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Illustration Area */}
          <div className="relative mb-12 lg:mb-0">
            <div className="absolute top-0 left-0 -ml-4 -mt-4 w-full h-full bg-gold rounded-lg transform translate-x-4 translate-y-4 opacity-20"></div>
            <div className="relative bg-white rounded-lg shadow-xl p-8 border-l-4 border-forest">
              <div className="flex items-center mb-6">
                <div className="bg-forest/10 p-3 rounded-full mr-4">
                  <ClipboardIcon className="w-8 h-8 text-forest" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark">Rapport d'État des Lieux</h3>
                  <p className="text-sm text-gray-500">Document certifié conforme</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "Inventaire détaillé pièce par pièce",
                  "Relevé des compteurs inclus",
                  "Photos HD illimitées des dégradations",
                  "Signature électronique sécurisée",
                  "Comparatif Entrée / Sortie"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copy Area */}
          <div>
            <h2 className="text-3xl font-bold text-forest mb-6">
              L’état des lieux professionnel : votre meilleure protection locative.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Que vous soyez propriétaire bailleur ou administrateur de biens, nous garantissons un constat impartial et exhaustif pour apaiser la relation locataire-propriétaire.
            </p>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-forest text-white">
                    <span className="font-bold text-xl">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-dark">Neutralité absolue</h4>
                  <p className="mt-1 text-gray-500">Un tiers de confiance expert pour éviter tout litige au moment de la sortie.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-forest text-white">
                    <span className="font-bold text-xl">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-dark">Gain de temps précieux</h4>
                  <p className="mt-1 text-gray-500">Fini les déplacements et les rendez-vous conflictuels, nous gérons tout pour vous.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
               <a href="#" className="text-forest font-semibold hover:text-gold transition-colors inline-flex items-center">
                 Planifier un état des lieux <ChevronRightIcon className="w-5 h-5 ml-1" />
               </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const SecondaryServices = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-dark">Services Complémentaires</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Pour une gestion locative 100% déléguée et sereine.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-gold rounded-xl p-8 text-dark shadow-soft transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-white/20 w-32 h-32 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
            <KeyIcon className="w-10 h-10 mb-6 text-forest relative z-10" />
            <h3 className="text-2xl font-bold mb-4 relative z-10">Délégation de visites</h3>
            <p className="mb-6 text-dark/90 relative z-10">
              Ne perdez plus votre temps dans les transports. Nous assurons l'accueil des candidats locataires, la présentation du bien et la remontée des dossiers complets.
            </p>
            <a href="#" className="inline-block border-b-2 border-forest pb-1 font-semibold hover:text-white transition-colors relative z-10">
              Voir les forfaits visites
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-gold rounded-xl p-8 text-dark shadow-soft transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-white/20 w-32 h-32 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
            <CubeIcon className="w-10 h-10 mb-6 text-forest relative z-10" />
            <h3 className="text-2xl font-bold mb-4 relative z-10">Visites Virtuelles & 3D</h3>
            <p className="mb-6 text-dark/90 relative z-10">
              Valorisez votre bien avec une immersion 3D haute définition (technologie Matterport). Idéal pour louer plus vite et limiter les visites inutiles.
            </p>
            <a href="#" className="inline-block border-b-2 border-forest pb-1 font-semibold hover:text-white transition-colors relative z-10">
              Découvrir la technologie 3D
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const features = [
    {
      title: "Expertise 100% Locale",
      desc: "Une connaissance parfaite du marché locatif de la métropole lilloise.",
      icon: <MapPinIcon className="w-6 h-6 text-white" />
    },
    {
      title: "Flexibilité Horaire",
      desc: "Des créneaux adaptés aux disponibilités de vos locataires (y compris le samedi).",
      icon: <ClockIcon className="w-6 h-6 text-white" />
    },
    {
      title: "Réactivité Immédiate",
      desc: "Devis et prise de rendez-vous sous 24h. Rapports envoyés instantanément.",
      icon: <CheckIcon className="w-6 h-6 text-white" />
    }
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-forest">Pourquoi nous faire confiance ?</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 bg-forest rounded-full flex items-center justify-center mb-6 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-dark mb-16">Un processus simple en 4 étapes</h2>
        
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              { title: "Contact & Devis", desc: "Appel ou formulaire en 2 min." },
              { title: "Planification", desc: "Nous fixons le RDV locataire." },
              { title: "Intervention", desc: "État des lieux sur tablette." },
              { title: "Réception", desc: "Rapport PDF immédiat." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm md:shadow-none md:border-none flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-gold text-forest font-bold text-xl flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  return (
    <section id="about" className="flex flex-col md:flex-row bg-forest text-white">
      <div className="md:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-6">Zone d'intervention & À Propos</h2>
        <p className="text-lg text-gray-300 mb-6">
          Basés au cœur de Lille, nous intervenons sur l'ensemble de la métropole : Lille Centre, Vieux-Lille, La Madeleine, Marcq-en-Barœul, Lambersart, Roubaix, Tourcoing et Villeneuve d'Ascq.
        </p>
        <p className="text-gray-300 mb-8">
          Structure indépendante et réactive, Lille Inventaire s'adapte aux contraintes des professionnels de l'immobilier et des particuliers exigeants.
        </p>
        <div className="flex items-center space-x-2 text-gold font-semibold">
          <MapPinIcon className="w-5 h-5" />
          <span>Aucun frais de déplacement sur la MEL</span>
        </div>
      </div>
      <div className="md:w-1/2 bg-gray-200 min-h-[400px] relative">
         {/* Abstract Map Representation */}
         <div className="absolute inset-0 bg-gray-300 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e4/Lille_Metropole_map.png')] bg-cover bg-center opacity-40 grayscale"></div>
             <div className="absolute inset-0 bg-forest/20"></div>
             <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg text-dark">
                <p className="font-bold flex items-center"><MapPinIcon className="w-4 h-4 text-gold mr-2"/> Lille Métropole</p>
             </div>
         </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:justify-between lg:items-center mb-12 border-b border-gray-700 pb-12">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold mb-2">Prêt à sécuriser votre location ?</h2>
            <p className="text-gray-400">Confiez vos états des lieux à un spécialiste lillois.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" className="font-bold text-dark">
              06 00 00 00 00
            </Button>
            <Button className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-dark">
              Demander mon devis
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Lille Inventaire</h4>
            <p>Expert en états des lieux indépendants pour particuliers et professionnels.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Contact</h4>
            <p className="mb-2">Lille, France</p>
            <p className="mb-2">contact@lille-inventaire.fr</p>
            <p>Lun - Sam : 08h - 20h</p>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Légal</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-gold">Mentions Légales</a></li>
               <li><a href="#" className="hover:text-gold">CGV</a></li>
               <li><a href="#" className="hover:text-gold">Politique de confidentialité</a></li>
             </ul>
          </div>
        </div>

        <div className="text-center text-xs text-gray-600 pt-8 border-t border-gray-800">
          © {new Date().getFullYear()} Lille Inventaire. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

const StickyMobileFooter = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <a href="tel:0600000000" className="flex-1 bg-forest text-white py-4 flex justify-center items-center font-bold text-sm">
        <PhoneIcon className="w-4 h-4 mr-2" /> Appeler
      </a>
      <button className="flex-1 bg-gold text-dark py-4 flex justify-center items-center font-bold text-sm">
        <ClipboardIcon className="w-4 h-4 mr-2" /> Devis Gratuit
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div className="font-sans text-dark antialiased bg-white selection:bg-gold selection:text-dark pb-16 md:pb-0">
      <Navbar />
      <main>
        <Hero />
        <MainService />
        <SecondaryServices />
        <WhyUs />
        <Process />
        <MapSection />
      </main>
      <Footer />
      <StickyMobileFooter />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);