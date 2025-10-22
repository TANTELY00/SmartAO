import React, { useState, useEffect } from 'react';
import logos from '/src/assets/logos.png';
import { Download } from 'lucide-react';

import {
  Home, User, Briefcase, FolderOpen, Mail,
  Code, Brain, Zap, Database, Globe,
  MapPin, Phone, Send, Star, Calendar,
  ExternalLink, Github, Linkedin, Twitter,
  Layers, BarChart3, Bot, ShoppingCart, LineChart, Smartphone, Sparkles
} from 'lucide-react';

// Utilitaire format nombre
const formatNumber = (number, options = {}) => {
  const defaultOptions = {
    notation: 'standard',
    maximumFractionDigits: 2,
    ...options
  };
  return new Intl.NumberFormat('fr-FR', defaultOptions).format(number);
};

// Spinner de chargement
const LoadingSpinner = ({ size = 'medium', message = 'Chargement...', center = true }) => {
  const sizeClasses = { small: 'w-4 h-4', medium: 'w-8 h-8', large: 'w-12 h-12' };
  const textSizeClasses = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };

  const content = (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-blue-200 border-t-blue-600`}></div>
      </div>
      {message && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{message}</p>
      )}
    </div>
  );

  if (center) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">{content}</div>
    );
  }
  return content;
};

// Composant principal
const Portfolio = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('accueil');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ nom: '', email: '', sujet: '', message: '' });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const sidebarItems = [
    { id: 'accueil', label: 'Accueil', icon: Home, tagline: 'Vision • promesse' },
    { id: 'experiences', label: 'Expériences', icon: User, tagline: 'Crédibilité • preuves' },
    { id: 'services', label: 'Services', icon: Briefcase, tagline: 'Offres claires' },
    { id: 'projets', label: 'Projets', icon: FolderOpen, tagline: 'Cas concrets' },
    { id: 'contact', label: 'Contact', icon: Mail, tagline: 'Passer à l’action' },
   
  ];

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Message envoyé avec succès !');
  };

  if (isLoading) return <LoadingSpinner size="large" message="Chargement du portfolio..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar FIXE (desktop) + Drawer (mobile) */}
      <aside
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center text-white">
            <div className="flex items-center justify-center mr-3 w-11 h-11 ">
               <img src={logos} alt="Logo" className="object-contain w-full h-full" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-wide">TANTELI</h1>
              <p className="text-[11px] opacity-90 font-medium">Fullstack • AI • No‑Code Expert</p>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
               className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-l-lg transition-all duration-200 ${
                 activeTab === item.id
                 ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700"
                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              <span className="text-[11px] text-gray-400 hidden xl:block">{item.tagline}</span>
            </button>
          ))}
        </nav>

       <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            {/* Icônes réseaux sociaux */}
            <div className="flex items-center space-x-3">
             <a href="https://github.com/TANTELY00" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
              <Github className="w-4 h-4" />
             </a>
             <a href="https://www.linkedin.com/in/tantelinirina-ravoson-ia-engineer" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
              <Linkedin className="w-4 h-4" />
             </a>
            </div>

            {/* Lien téléchargement CV */}
           <a href="https://drive.google.com/uc?export=download&id=1f23dlW7XioF1Yg-oOXzupR-iU8a5D4LI"   download 
           className="flex items-center px-3 py-1.5 text-sm font-semibold text-white 
                      bg-gradient-to-r from-blue-600 to-purple-600 
                      rounded-lg 
                    hover:from-blue-700 hover:to-purple-700 
                      transition-all transform hover:scale-105 animate-pulse">
              <Download className="w-4 h-4 mr-2" />
                Télécharger  CV
            </a>
          </div>
       </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-800/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* CONTENU décalé à droite de la sidebar fixe */}
      <div className="md:ml-72">
        {/* Navbar FIXE */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="ml-2">
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  {activeTab === 'accueil' && 'Accueil'}
                  {activeTab === 'experiences' && 'Mes Expériences'}
                  {activeTab === 'services' && 'Mes Services'}
                  {activeTab === 'projets' && 'Mes Projets'}
                  {activeTab === 'contact' && 'Contact'}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTab === 'accueil' && 'Créer de la valeur avec l’IA — vite, bien, mesurable.'}
                  {activeTab === 'experiences' && 'Des livrables prouvés, des résultats quantifiés.'}
                  {activeTab === 'services' && 'Offres nettes, ROI tangible, exécution rapide.'}
                  {activeTab === 'projets' && 'Études de cas courtes et orientées impact.'}
                  {activeTab === 'contact' && 'Explorons votre besoin en 20 minutes.'}
                </p>
              </div>
            </div>
            <div className="items-center hidden text-sm text-gray-600 md:flex">
              <div className="w-2 h-2 mr-2 bg-green-500 rounded-full" />
              <span className="font-medium text-green-600">Disponible</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 overflow-y-auto min-h-[calc(100vh-64px)]">
          {activeTab === 'accueil' && <AccueilTab />}
          {activeTab === 'experiences' && <ExperienceTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'projets' && <ProjetsTab />}
          {activeTab === 'contact' && (
            <ContactTab
              formData={formData}
              handleFormChange={handleFormChange}
              handleFormSubmit={handleFormSubmit}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// ========= Accueil =========
const AccueilTab = () => {
  return (
    <div className="space-y-12">
      {/* Vision (résumé 1‑vue) */}
      <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Vision</h3>
        </div>
        <p className="mt-2 text-gray-600">Concevoir des systèmes IA/no‑code qui réduisent le temps opératoire, fiabilisent les processus et génèrent un ROI mesurable dès les premières semaines.</p>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 rounded-3xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          <div className="absolute top-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 w-96 h-96 bg-purple-500/30 filter blur-3xl"></div>
        </div>
        <div className="relative px-8 py-16 text-center text-white sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 mb-6 border rounded-full bg-white/10 backdrop-blur border-white/20">
              <div className="w-2 h-2 mr-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Ouvert aux nouveaux projets</span>
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Des workflows <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">IA n8n</span> prêts pour la production
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-lg text-gray-200 sm:text-xl">
              Intégrations robustes, automatisations utiles, interfaces propres. Focus: rapidité de mise en œuvre et valeur métier.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="px-6 py-3 font-semibold transition shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:scale-105">Démarrer un projet</button>
              <button className="px-6 py-3 font-semibold transition border bg-white/10 rounded-xl border-white/20 hover:bg-white/20">Voir les cas d’usage</button>
            </div>

            <div className="grid max-w-2xl grid-cols-3 gap-6 mx-auto mt-10 text-sm">
              <Stat label="Projets livrés" value="20+" />
              <Stat label="Clients satisfaits" value="100%" />
              <Stat label="Heures économisées" value="50+" />
            </div>
          </div>
        </div>
      </div>

      {/* Tech */}
      <div className="text-center">
        <h3 className="mb-6 text-2xl font-bold text-gray-900">Stack & Outils</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {['HTML' , 'CSS' , 'Tailwind CSS' , 'JS', 'React', 'Python', 'FastAPI', 'n8n', 'Zapier', 'Make' , 'Postgresql' , 'Mysql' , 'NocoDB' , 'Docker' , 'Git' ,'Github' , 'AI', 'AI Generative' , 'AI Agent' , 'Prompt Engineering' , 'Machine Learning' , 'Deep Learning' ].map((tech, i) => (
            <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium hover:bg-blue-100 transition-colors">{tech}</span>
          ))}
        </div>
      </div>

      {/* Offres flash */}
      <div className="grid gap-6 md:grid-cols-3">
        <ServiceCard icon={Code} title="Dév. Full‑Stack" desc="Apps web propres (API FastAPI + UI React) prêtes à scaler." color="blue" badge="SPÉCIALITÉ"/>
        <ServiceCard icon={Brain} title="IA appliquée" desc="Agents, RAG, résumés & copilotes, intégrés à vos outils." color="purple" badge="SPÉCIALITÉ" />
        <ServiceCard icon={Zap} title="No‑Code" desc="Workflows n8n • Zapier • Make pour des gains immédiats." color="green" badge="SPÉCIALITÉ" />
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="p-4 text-center bg-white/5 rounded-xl">
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-gray-300">{label}</div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, desc, color = 'blue', badge }) => (
  <div className={`group p-6 bg-white rounded-2xl border ${color === 'purple' ? 'border-purple-200' : 'border-gray-100'} hover:shadow-xl transition-all relative`}>
    {badge && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-[11px] font-medium">
        {badge}
      </div>
    )}
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
      color === 'blue' ? 'bg-blue-100' : color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
    }`}>
      <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : color === 'purple' ? 'text-purple-600' : 'text-green-600'}`} />
    </div>
    <h4 className="mb-2 text-lg font-bold text-gray-900">{title}</h4>
    <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
  </div>
);

// ========= Expérience =========
const ExperienceTab = () => {
  return (
    <div className="space-y-8">
      {/* Résumé 1‑vue */}
      <Summary title="Expériences" icon={Star} text="2 ans d’implémentations Fullstack • IA • No‑Code avec des KPI suivis : délais réduits, erreurs diminuées, cycles de vente accélérés." />

      
      {/* Carte parcours */}

      <div className="max-w-4xl mx-auto">
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 mr-6 bg-white rounded-2xl">
                <span className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">2025</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold sm:text-3xl">Expert Fullstack • IA • No‑Code</h4>
                <p className="text-base text-blue-100">Temps Partiel  • Actif depuis juin. 2025 • LOHARANONTSOA Antananarivo Madagascar</p>
              </div>
            </div>

            <div className="grid gap-8 mt-8 md:grid-cols-2">
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">🚀 Résultats clés</h5>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• 8+ projets IA livrés</li>
                  <li>• 8 workflows d’automatisation</li>
                  <li>• 50+ heures économisées</li>
                  <li>• 100% de satisfaction</li>
                </ul>
              </div>
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">⚡ Stack</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['FastAPI', 'React', 'PostgreSQL', 'NocoDB' , 'LLMs', 'n8n', 'Docker' , 'GitHub'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 mr-6 bg-white rounded-2xl">
                <span className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">2025</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold sm:text-3xl">Expert Fullstack • IA • No‑Code</h4>
                <p className="text-base text-blue-100">Stage • Actif depuis juin. 2025 • KOTEV Antananarivo Madagascar</p>
              </div>
            </div>

            <div className="grid gap-8 mt-8 md:grid-cols-2">
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">🚀 Résultats clés</h5>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• 5+ projets IA livrés</li>
                  <li>• 5 workflows d’automatisation</li>
                  <li>• 50+ heures économisées</li>
                  <li>• 100% de satisfaction</li>
                </ul>
              </div>
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">⚡ Stack</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['FastAPI', 'React', 'PostgreSQL', 'NocoDB' , 'LLMs', 'n8n', 'Docker' , 'GitHub'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 mr-6 bg-white rounded-2xl">
                <span className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">2025</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold sm:text-3xl">Expert Fullstack • IA • No‑Code</h4>
                <p className="text-base text-blue-100">Freelance • janv 2025 - Mai 2025 • Maurice </p>
              </div>
            </div>

            <div className="grid gap-8 mt-8 md:grid-cols-2">
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">🚀 Résultats clés</h5>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• 10+ projets IA livrés</li>
                  <li>• 10 workflows d’automatisation</li>
                  <li>• 50+ heures économisées</li>
                  <li>• 100% de satisfaction</li>
                </ul>
              </div>
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">⚡ Stack</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['FastAPI', 'React', 'PostgreSQL', 'OpenAI', 'n8n', 'Docker'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 mr-6 bg-white rounded-2xl">
                <span className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">2024</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold sm:text-3xl">Expert Fullstack • IA • No‑Code</h4>
                <p className="text-base text-blue-100">Stage • nov 2024 - janv 2025 • ENI Fianarantsoa Madagascar</p>
              </div>
            </div>

            <div className="grid gap-8 mt-8 md:grid-cols-2">
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">🚀 Résultats clés</h5>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• 4+ projets IA livrés</li>
                  <li>• 4 workflows d’automatisation</li>
                  <li>• 50+ heures économisées</li>
                  <li>• 100% de satisfaction</li>
                </ul>
              </div>
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">⚡ Stack</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['FastAPI', 'React', 'PostgreSQL', 'OpenAI', 'n8n', 'Docker'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 mr-6 bg-white rounded-2xl">
                <span className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">2022</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold sm:text-3xl">Expert Fullstack</h4>
                <p className="text-base text-blue-100">Stage • juin 2022 - sept 2022 • NIR'INFO Antananarivo Madagascar</p>
              </div>
            </div>

            <div className="grid gap-8 mt-8 md:grid-cols-2">
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">🚀 Résultats clés</h5>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• 6+ projets IA livrés</li>
                  <li>• 6 workflows d’automatisation</li>
                  <li>• 50+ heures économisées</li>
                  <li>• 100% de satisfaction</li>
                </ul>
              </div>
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">⚡ Stack</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['FastAPI', 'React', 'PostgreSQL', 'LLMs', 'GitHub', 'Docker'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10"></div>
          <div className="relative">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 mr-6 bg-white rounded-2xl">
                <span className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">2021</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold sm:text-3xl">Expert Fullstack</h4>
                <p className="text-base text-blue-100">Stage • Mai 2021 - Juil 2021 • IST Ambositra Madagascar</p>
              </div>
            </div>

            <div className="grid gap-8 mt-8 md:grid-cols-2">
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">🚀 Résultats clés</h5>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>• 3+ projets IA livrés</li>
                  <li>• 3 workflows d’automatisation</li>
                  <li>• 50+ heures économisées</li>
                  <li>• 100% de satisfaction</li>
                </ul>
              </div>
              <div>
                <h5 className="mb-3 text-lg font-semibold text-yellow-300">⚡ Stack</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['Java','Spring Boot', 'Angular', 'MySQL'].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-white/20">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Projets livrés', value: '20+' },
          { label: 'Clients satisfaits', value: '100%' },
          { label: 'Heures économisées', value: '50+' },
          { label: 'Technos maîtrisées', value: '15+' }
        ].map((m, i) => (
          <div key={i} className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="mb-2 text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{m.value}</div>
            <p className="font-medium text-gray-600">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Summary = ({ title, icon: Icon, text }) => (
  <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="mt-2 text-gray-600">{text}</p>
  </div>
);

// ========= Services =========
const ServicesTab = () => {
  return (
    <div className="space-y-8">
      <Summary title="Services" icon={Briefcase} text="Trois offres simples : développement, IA appliquée, automatisation. Objectif : livrer vite, propre, mesurable." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ServiceCard icon={Code} title="Développement Full‑Stack" desc="API FastAPI + UI React • Sécurité, performance, scalabilité." color="blue" badge="POPULAIRE"/>
        <ServiceCard icon={Brain} title="Intelligence Artificielle" desc="Agents, RAG, extraction, copilotes métier intégrés à vos outils." color="purple" badge="POPULAIRE" />
        <ServiceCard icon={Zap} title="Automatisation No‑Code" desc="n8n / Zapier / Make • Workflows personnalisés & maintenables." color="green" badge="POPULAIRE"/>
      </div>

      <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
        <div className="grid max-w-4xl gap-6 mx-auto text-center md:grid-cols-3">
          <div><div className="mb-1 text-3xl font-bold">24h</div><p className="text-blue-100">Temps de réponse</p></div>
          <div><div className="mb-1 text-3xl font-bold">100%</div><p className="text-blue-100">Satisfaction</p></div>
          <div><div className="mb-1 text-3xl font-bold">2 ans</div><p className="text-blue-100">Focus IA/No‑Code</p></div>
        </div>
      </div>
    </div>
  );
};

// ========= Projets =========
const ProjetsTab = () => {
  const projets = [
    {
      id: 1,
      titre: 'LOHARANONTSOA — Smart AO',
      description: 'Scraping intelligent d’offres d’emploi et visualisation des données dans un dashboard interactif(latence, coût, succès).',
      technologies: ['React', 'Recharts', 'Tailwind', 'PostgreSQL' ,'Fast API','NocoDB','n8n'],
      image: 'bg-gradient-to-br from-red-600 to-purple-300',
      statut: 'En cours ',
      lien: '#',
      icon: BarChart3
    },
    {
      id: 1,
      titre: 'Dashboard IA — Smart Workflow',
      description: 'Pilotage temps réel des workflows IA avec métriques clés (latence, coût, succès).',
      technologies: ['React', 'Recharts', 'Tailwind', 'PostgreSQL','Fast API','NocoDB','n8n'],
      image: 'bg-gradient-to-br from-blue-500 to-purple-600',
      statut: 'Terminé',
      lien: '#',
      icon: BarChart3
    },
    {
      id: 2,
      titre: 'Chatbot Intelligent Support 24/7',
      description: 'Assistant client connecté CRM, détection d’intention, escalade humaine.',
      technologies: ['FastAPI', 'OpenAI', 'n8n', 'PostgreSQL'],
      image: 'bg-gradient-to-br from-green-500 to-teal-600',
      statut: 'Terminé',
      lien: '#',
      icon: Bot
    },
    {
      id: 3,
      titre: 'Automatisation E‑commerce',
      description: 'Commandes, stock, notifications et reporting automatisés multi‑canaux.',
      technologies: ['n8n', 'Zapier', 'Shopify API', 'Slack'],
      image: 'bg-gradient-to-br from-orange-500 to-red-600',
      statut: 'En cours',
      lien: '#',
      icon: ShoppingCart
    },
    {
      id: 4,
      titre: 'Plateforme Analytics IA',
      description: 'Insights IA + prédictions, visualisations claires pour décisions rapides.',
      technologies: ['React', 'FastAPI', 'TensorFlow', 'D3.js'],
      image: 'bg-gradient-to-br from-purple-500 to-pink-600',
      statut: 'Planifié',
      lien: '#',
      icon: LineChart
    },
    {
      id: 5,
      titre: 'Application Mobile No‑Code',
      description: 'Gestion de tâches, sync cloud, notifications push natives.',
      technologies: ['Flutter Flow', 'Firebase', 'Stripe', 'Push'],
      image: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      statut: 'Terminé',
      lien: '#',
      icon: Smartphone
    },
    {
      id: 6,
      titre: 'Moteur de Recommandation',
      description: 'Personnalisation de contenus e‑learning basée sur le comportement.',
      technologies: ['Python', 'scikit‑learn', 'Redis', 'FastAPI'],
      image: 'bg-gradient-to-br from-yellow-500 to-orange-600',
      statut: 'Terminé',
      lien: '#',
      icon: Layers
    },
    {
      id: 7,
      titre: 'n8n Workflows Automations',
      description: 'Réalisation de plus de 60 workflows n8n modulaires et réutilisables, conçus pour automatiser des tâches répétitives et servir de base à des intégrations avancées.',
      technologies: ['n8n'],
      image: 'bg-gradient-to-br from-orange-400 to-pink-500',
      statut: 'Terminé',
      lien: '#',
      icon: Layers
    }
  ];

  return (
    <div className="space-y-8">
      <Summary title="Projets" icon={FolderOpen} text="Sélection courte et orientée impact. Chaque carte indique le statut, l’icône métier et les techno clés." />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projets.map((p) => (
          <div key={p.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
            <div className={`h-48 ${p.image} flex items-center justify-center relative`}>
              <div className="absolute flex items-center gap-1 px-2 py-1 text-xs text-white rounded-md top-3 left-3 bg-white/20 backdrop-blur">
                <p.icon className="w-4 h-4" />
                <span>Projet</span>
              </div>
              <div className="p-6 text-center text-white">
                <h4 className="mb-2 text-xl font-bold">{p.titre}</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  p.statut === 'Terminé' ? 'bg-green-100/20 text-green-100' : p.statut === 'En cours' ? 'bg-yellow-100/20 text-yellow-100' : 'bg-blue-100/20 text-blue-100'
                }`}>
                  {p.statut}
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="mb-4 text-sm text-gray-700">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.technologies.map((t, i) => (
                  <span key={i} className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <a href={p.lien} className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700">
                  <span>Voir le projet</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h4 className="mb-6 text-xl font-bold text-center text-gray-900 sm:text-2xl">Impact en chiffres</h4>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Kpi value="20+" label="Projets réalisés" accent="text-blue-600" />
          <Kpi value="50+" label="Heures économisées" accent="text-green-600" />
          <Kpi value="98%" label="Taux de réussite" accent="text-purple-600" />
          <Kpi value="12" label="Clients satisfaits" accent="text-orange-600" />
        </div>
      </div>
    </div>
  );
};

const Kpi = ({ value, label, accent }) => (
  <div className="p-4 text-center">
    <div className={`text-2xl sm:text-3xl font-bold mb-1 ${accent}`}>{value}</div>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

// ========= Contact =========
const ContactTab = ({ formData, handleFormChange, handleFormSubmit }) => {
  return (
    <div className="space-y-8">
      <Summary title="Contact" icon={Mail} text="Un appel d’exploration de 20 minutes pour cadrer le besoin, le périmètre, le délai et les KPI de succès." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Coordonnées */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Coordonnées</h4>
            <div className="space-y-4 text-sm">
              <InfoRow icon={Mail} label="Email" value="tanteli.ia.engineer@gmail.com" color="blue" />
              <InfoRow icon={Phone} label="Téléphone" value="+261 34 61 454 97" color="green" />
              <InfoRow icon={MapPin} label="Localisation" value="Antananarivo, Madagascar" color="purple" />
            </div>
          </div>

          <div className="p-6 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
            <h4 className="mb-3 text-lg font-semibold">Disponibilité</h4>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-green-400 rounded-full" /><span>Disponible pour nouveaux projets</span></div>
            <p className="text-sm text-blue-100">Temps de réponse moyen : 24h</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 shadow-sm sm:p-8 rounded-xl">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="Nom complet *" id="nom" name="nom" value={formData.nom} onChange={handleFormChange} placeholder="Votre nom" />
                <Input label="Email *" id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="votre@email.com" />
              </div>
              <div>
                <label htmlFor="sujet" className="block mb-2 text-sm font-medium text-gray-700">Sujet du projet *</label>
                <select id="sujet" name="sujet" required value={formData.sujet} onChange={handleFormChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Sélectionnez un service</option>
                  <option value="fullstack">Développement Full‑Stack</option>
                  <option value="ia">Intelligence Artificielle</option>
                  <option value="nocode">Solutions No‑Code</option>
                  <option value="consulting">Conseil & Audit</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Décrivez votre projet *</label>
                <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleFormChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Objectifs, contraintes, budget indicatif, délais…" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-[1.02]">
                <Send className="w-5 h-5" />
                <span>Envoyer</span>
              </button>
              <p className="text-xs text-center text-gray-500">Réponse sous 24h • Données confidentielles</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, color = 'blue' }) => (
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
      color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : 'bg-purple-100'
    }`}>
      <Icon className={`w-5 h-5 ${
        color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : 'text-purple-600'
      }`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  </div>
);

const Input = ({ label, id, name, type = 'text', value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    <input id={id} name={name} type={type} required value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
  </div>
);

export default Portfolio;
