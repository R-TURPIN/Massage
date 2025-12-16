import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Calculator,
  ChevronDown,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleBooking = (packName: string) => {
    setSelectedPack(packName);
    scrollToSection('contact');
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
                <span className="text-xs text-slate-500 font-medium tracking-wide">EXPERTISE LOCATIVE</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('tarifs')} className="text-slate-900 hover:text-brand-700 font-bold transition flex items-center gap-1">
                Tarifs Forfaitaires
              </button>
              <button onClick={() => scrollToSection('expertise')} className="text-slate-600 hover:text-brand-700 font-medium transition">
                Expertise Loi ALUR
              </button>
              <button onClick={() => scrollToSection('secteur')} className="text-slate-600 hover:text-brand-700 font-medium transition">
                Secteur
              </button>
              <button 
                onClick={() => scrollToSection('tarifs')}
                className="bg-brand-700 text-white px-6 py-2.5 rounded-full font-bold hover:bg-brand-800 transition shadow-lg shadow-brand-700/20 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                Réserver en ligne
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
                  <span>Voir les Prix</span>
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => scrollToSection('expertise')} className="block w-full text-left px-4 py-2 text-slate-600 font-medium">Loi ALUR & Expertise</button>
                <button onClick={() => scrollToSection('secteur')} className="block w-full text-left px-4 py-2 text-slate-600 font-medium">Zone d'intervention</button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-center bg-brand-800 text-white px-4 py-3 rounded-lg font-bold shadow-md">Prendre Rendez-vous</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" 
            alt="Architecture Lille" 
            className="w-full h-full object-cover opacity-20"
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
              <span className="text-sm font-semibold text-white tracking-wide">Lille & Métropole (Déplacement Inclus)</span>
            </div>
            
            {/* SEO H1: Très important pour Google */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-tight tracking-tight">
              Votre Expert <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-white">État des Lieux à Lille</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Bailleurs, Agences, Propriétaires : sécurisez vos biens avec un rapport impartial, détaillé et certifié. Tarifs forfaitaires sans surprise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button 
                onClick={() => scrollToSection('tarifs')}
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <Calculator size={20} />
                Consulter les Tarifs
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 hover:border-white/40"
              >
                Contact Rapide
              </button>
            </div>
            
            <div className="mt-16 flex justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition duration-500">
