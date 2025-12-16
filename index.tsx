import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  CheckCircle, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  Star,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Calculator,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
              <div className="bg-brand-800 p-2.5 rounded-lg text-white group-hover:bg-brand-700 transition shadow-lg shadow-brand-900/10">
                <Briefcase size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-slate-900 leading-none">
                  EDL Lille<span className="text-brand-600">.Expert</span>
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">ÉTAT DES LIEUX INDÉPENDANT</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('tarifs')} className="text-slate-900 hover:text-brand-700 font-bold transition flex items-center gap-1">
                Nos Tarifs
              </button>
              <button onClick={() => scrollToSection('expertise')} className="text-slate-600 hover:text-brand-700 font-medium transition">
                Expertise
              </button>
              <button onClick={() => scrollToSection('secteur')} className="text-slate-600 hover:text-brand-700 font-medium transition">
                Secteur
              </button>
              <button 
                onClick={() => scrollToSection('tarifs')}
                className="bg-brand-700 text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-800 transition shadow-lg shadow-brand-700/20 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                Voir les Prix
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <button onClick={() => scrollToSection('tarifs')} className="flex items-center justify-between w-full text-left px-4 py-3 bg-brand-50 rounded-lg text-brand-800 font-bold border border-brand-100">
                  <span>Consulter les Tarifs</span>
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollToSection('expertise')} className="block w-full text-left px-4 py-2 text-slate-600 font-medium border-l-2 border-transparent hover:border-brand-300 hover:bg-slate-50 hover:text-brand-700 transition">Notre Expertise</button>
                <button onClick={() => scrollToSection('secteur')} className="block w-full text-left px-4 py-2 text-slate-600 font-medium border-l-2 border-transparent hover:border-brand-300 hover:bg-slate-50 hover:text-brand-700 transition">Zone d'intervention</button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-center bg-brand-800 text-white px-4 py-3 rounded-lg font-bold shadow-md">Prendre Rendez-vous</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" 
            alt="Lille Grand Place Architecture" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-1.5 mb-8 backdrop-blur-md shadow-lg">
              <MapPin size={16} className="text-brand-400" />
              <span className="text-sm font-semibold text-white tracking-wide">Intervention sur Lille & Métropole</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-tight tracking-tight">
              L'État des Lieux <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-white">Professionnel & Sécurisé</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Ne prenez plus de risques avec vos locations. Nous réalisons des états des lieux certifiés, détaillés et impartiaux pour sécuriser propriétaires et locataires.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button 
                onClick={() => scrollToSection('tarifs')}
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <Calculator size={20} />
                Voir nos Tarifs Forfaitaires
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 hover:border-white/40"
              >
                Nous Contacter
              </button>
            </div>
            
            <div className="mt-16 flex justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition duration-500">
               {/* Trust signals / Logos text */}
               <div className="text-center">
                 <span className="block font-bold text-2xl text-white">100%</span>
                 <span className="text-xs uppercase tracking-widest text-brand-200">Loi Alur</span>
               </div>
               <div className="text-center">
                 <span className="block font-bold text-2xl text-white">48h</span>
                 <span className="text-xs uppercase tracking-widest text-brand-200">Rapport PDF</span>
               </div>
               <div className="text-center">
                 <span className="block font-bold text-2xl text-white">7/7</span>
                 <span className="text-xs uppercase tracking-widest text-brand-200">Intervention</span>
               </div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30 hidden md:block">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Pricing Section - MOVED UP as requested */}
      <section id="tarifs" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Tarifs Clairs & Sans Surprise</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nos prix sont forfaitaires selon la surface. Le déplacement est inclus sur Lille et la proche couronne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative z-10">
            {/* 20m2 */}
            <PricingCard 
              title="Studio / T1"
              subtitle="Surface < 20m²"
              price="120"
              features={['État des lieux Entrée ou Sortie', 'Rapport PDF avec photos', 'Signature électronique', 'Déplacement Lille inclus']}
              onClick={() => scrollToSection('contact')}
            />
            {/* 40m2 */}
            <PricingCard 
              title="Appartement T2"
              subtitle="Surface < 40m²"
              price="150"
              popular
              features={['État des lieux Entrée ou Sortie', 'Rapport PDF avec photos', 'Signature électronique', 'Déplacement Lille inclus']}
              onClick={() => scrollToSection('contact')}
            />
            {/* 70m2 */}
            <PricingCard 
              title="Grand Appt / T3"
              subtitle="Surface < 70m²"
              price="190"
              features={['État des lieux Entrée ou Sortie', 'Rapport PDF avec photos', 'Signature électronique', 'Déplacement Lille inclus']}
              onClick={() => scrollToSection('contact')}
            />
            {/* 100m2+ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col hover:border-brand-300 transition-all duration-300 h-full">
              <div className="mb-4">
                <span className="bg-slate-100 text-slate-600 font-bold tracking-wider text-xs uppercase px-3 py-1 rounded-full">Sur Mesure</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4">T4 / Maison</h3>
                <p className="text-slate-500 text-sm mt-2">Surface > 100m²</p>
              </div>
              <div className="my-6">
                <span className="text-3xl font-bold text-slate-900">Sur Devis</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600 text-sm">
                  <CheckCircle size={18} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>Maisons individuelles</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 text-sm">
                  <CheckCircle size={18} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>Locaux Commerciaux</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 text-sm">
                  <CheckCircle size={18} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>Jardins, Caves & Annexes</span>
                </li>
              </ul>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-brand-600 hover:text-brand-600 transition bg-transparent"
              >
                Demander un devis
              </button>
            </div>
          </div>

          {/* Bundle Section */}
          <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 rounded-3xl p-8 md:p-14 text-white relative overflow-hidden shadow-2xl mx-auto max-w-6xl">
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-500 rounded-full blur-[100px] opacity-30"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-block bg-yellow-400 text-yellow-950 font-bold px-4 py-1.5 rounded-full text-sm mb-6 shadow-lg shadow-yellow-400/20">
                  Offre Spéciale Bailleurs
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
                  Vous gérez plusieurs biens ? <br/>
                  <span className="text-brand-300">Groupez et Économisez.</span>
                </h3>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Idéal pour les multipropriétaires ou les agences. Commandez un pack de 3 états des lieux et bénéficiez d'un tarif préférentiel.
                </p>
                
                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-300 font-bold">3x</div>
                      <div>
                        <p className="font-bold text-white">Pack Studios (20m²)</p>
                        <p className="text-slate-400 text-sm">Prix unitaire normal : 360€</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">300€</p>
                      <p className="text-sm font-bold text-green-400">-60€ d'économie</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center shadow-xl">
                <ShieldCheck size={48} className="mx-auto text-brand-300 mb-6" />
                <h4 className="text-2xl font-bold mb-3">Réservez votre Pack</h4>
                <p className="text-slate-300 mb-8">
                  Paiement sécurisé en ligne. Vos crédits d'intervention sont valables 12 mois sur toute la métropole.
                </p>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-white text-brand-900 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition shadow-lg hover:shadow-white/20"
                >
                  Commander ce Pack (300€)
                </button>
                <p className="text-xs text-slate-400 mt-4 italic">
                  Facture immédiate pour votre comptabilité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Pourquoi passer par un Expert ?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              L'état des lieux est le document juridique le plus important de votre location. Une erreur peut vous coûter cher à la sortie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<ShieldCheck size={36} />}
              title="Conformité Loi ALUR"
              description="Nos rapports sont rédigés sur des logiciels professionnels agrées, respectant les dernières normes juridiques pour garantir vos droits."
            />
            <FeatureCard 
              icon={<Briefcase size={36} />}
              title="Expertise Technique"
              description="Nous vérifions méthodiquement plus de 100 points de contrôle : plomberie, électricité, menuiseries, sols et murs."
            />
            <FeatureCard 
              icon={<MapPin size={36} />}
              title="Ancrage Local"
              description="Basés à Lille, nous connaissons les spécificités du bâti local (Vieux-Lille, 1930, résidences récentes)."
            />
          </div>
        </div>
      </section>

      {/* Secteur Section */}
      <section id="secteur" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 text-brand-600 font-bold mb-4 uppercase tracking-wider text-sm">
                <MapPin size={18} />
                Zone d'intervention
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">Lille & Métropole</h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Nous intervenons 6j/7 sur l'ensemble de la métropole. Notre tarification est transparente : aucun frais caché pour le déplacement dans la zone principale.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-5 p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition group">
                  <div className="bg-green-100 p-3 rounded-lg text-green-700 h-fit group-hover:bg-green-600 group-hover:text-white transition">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Zone Inclus (0€)</h4>
                    <p className="text-slate-600 mt-1">Lille, La Madeleine, Marcq-en-Barœul, Saint-André, Lambersart, Lomme, Hellemmes.</p>
                  </div>
                </div>
                
                <div className="flex gap-5 p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition group">
                  <div className="bg-brand-100 p-3 rounded-lg text-brand-700 h-fit group-hover:bg-brand-600 group-hover:text-white transition">
                    <Building size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Zone Métropole (+15€)</h4>
                    <p className="text-slate-600 mt-1">Roubaix, Tourcoing, Villeneuve d'Ascq, Croix, Wasquehal, Mouvaux, Mons-en-Barœul.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 h-[400px] bg-slate-200 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-white">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Lille_OpenStreetMap.png/1200px-Lille_OpenStreetMap.png" 
                className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition duration-700"
                alt="Carte Lille"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-xl border-l-4 border-brand-600 shadow-lg">
                  <p className="font-bold text-slate-900">Vous êtes hors zone ?</p>
                  <p className="text-sm text-slate-600">Contactez-nous pour un devis personnalisé incluant les frais kilométriques.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Réserver un Expert</h2>
              <p className="text-slate-500 text-lg">
                Remplissez ce formulaire pour valider une intervention ou obtenir des renseignements.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Nom Complet</label>
                  <div className="relative">
                    <input type="text" className="w-full pl-4 pr-4
