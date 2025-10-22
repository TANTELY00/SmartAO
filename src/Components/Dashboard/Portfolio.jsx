import React, { useState } from 'react';
import logos from '/src/assets/logo.png';
import { Download, ExternalLink, Menu, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';

import {
  Code, Brain, Zap, Mail, Phone, MapPin,
  Send, Calendar, Github, Linkedin,
  BarChart3, Bot, ShoppingCart, LineChart, 
  Smartphone, Layers, Briefcase,
  FolderOpen, User, Home
} from 'lucide-react';

// Composant principal - Page Unique
const Portfolio = () => {
  const [formData, setFormData] = useState({ 
    nom: '', 
    email: '', 
    sujet: '', 
    message: '' 
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [experiencePage, setExperiencePage] = useState(0);
  const [projectPage, setProjectPage] = useState(0);

  const handleFormChange = (e) => setFormData({ 
    ...formData, 
    [e.target.name]: e.target.value 
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Message envoyé avec succès !');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'experiences', label: 'Expériences', icon: User },
    { id: 'projets', label: 'Projets', icon: FolderOpen },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  // Données des expériences (réduites à 8 maximum pour 2 pages)
  const allExperiences = [
    {
      year: "2025",
      title: "Expert Fullstack • IA • No‑Code",
      company: "LOHARANONTSOA - Temps Partiel",
      duration: "Actif depuis juin 2025",
      location: "Antananarivo, Madagascar",
      achievements: [
        "8+ projets IA livrés",
        "8 workflows d'automatisation",
        "50+ heures économisées",
        "100% de satisfaction client"
      ],
      technologies: ['FastAPI', 'React', 'PostgreSQL', 'n8n', 'Docker']
    },
    {
      year: "2025",
      title: "Expert Fullstack • IA • No‑Code",
      company: "KOTEV - Stage",
      duration: "Actif depuis juin 2025",
      location: "Antananarivo, Madagascar",
      achievements: [
        "5+ projets IA livrés",
        "5 workflows d'automatisation",
        "50+ heures économisées"
      ],
      technologies: ['FastAPI', 'React', 'PostgreSQL', 'n8n']
    },
    {
      year: "2025",
      title: "Expert Fullstack • IA • No‑Code",
      company: "Freelance",
      duration: "janv 2025 - Mai 2025",
      location: "Maurice",
      achievements: [
        "10+ projets IA livrés",
        "10 workflows d'automatisation",
        "50+ heures économisées"
      ],
      technologies: ['FastAPI', 'React', 'PostgreSQL', 'OpenAI', 'n8n']
    },
    {
      year: "2024",
      title: "Expert Fullstack • IA • No‑Code",
      company: "ENI - Stage",
      duration: "nov 2024 - janv 2025",
      location: "Fianarantsoa, Madagascar",
      achievements: [
        "4+ projets IA livrés",
        "4 workflows d'automatisation",
        "50+ heures économisées"
      ],
      technologies: ['FastAPI', 'React', 'PostgreSQL', 'OpenAI', 'n8n']
    },
    {
      year: "2022",
      title: "Expert Fullstack",
      company: "NIR'INFO - Stage",
      duration: "juin 2022 - sept 2022",
      location: "Antananarivo, Madagascar",
      achievements: [
        "6+ projets IA livrés",
        "6 workflows d'automatisation",
        "50+ heures économisées"
      ],
      technologies: ['FastAPI', 'React', 'PostgreSQL', 'LLMs', 'GitHub']
    },
    {
      year: "2021",
      title: "Expert Fullstack",
      company: "IST Ambositra - Stage",
      duration: "Mai 2021 - Juil 2021",
      location: "Ambositra, Madagascar",
      achievements: [
        "3+ projets IA livrés",
        "3 workflows d'automatisation",
        "50+ heures économisées"
      ],
      technologies: ['Java', 'Spring Boot', 'Angular', 'MySQL']
    }
  ];

  // Données des projets
  const allProjects = [
    {
      title: "LOHARANONTSOA — Smart AO",
      description: "Scraping intelligent d'offres d'emploi et visualisation des données dans un dashboard interactif.",
      technologies: ['React', 'FastAPI', 'PostgreSQL', 'n8n'],
      status: "En cours",
      icon: BarChart3
    },
    {
      title: "Chatbot Intelligent Support 24/7",
      description: "Assistant client connecté CRM avec détection d'intention et escalade humaine.",
      technologies: ['FastAPI', 'OpenAI', 'n8n', 'PostgreSQL'],
      status: "Terminé",
      icon: Bot
    },
    {
      title: "Automatisation E‑commerce",
      description: "Commandes, stock, notifications et reporting automatisés multi‑canaux.",
      technologies: ['n8n', 'Zapier', 'Shopify API', 'Slack'],
      status: "En cours",
      icon: ShoppingCart
    },
    {
      title: "n8n Workflows Automations",
      description: "60+ workflows n8n modulaires pour automatiser des tâches répétitives.",
      technologies: ['n8n', 'API REST', 'Webhooks'],
      status: "Terminé",
      icon: Layers
    },
    {
      title: "Plateforme Analytics IA",
      description: "Insights IA + prédictions avec visualisations pour décisions rapides.",
      technologies: ['React', 'FastAPI', 'TensorFlow', 'D3.js'],
      status: "Planifié",
      icon: LineChart
    },
    {
      title: "Application Mobile No‑Code",
      description: "Gestion de tâches avec sync cloud et notifications push natives.",
      technologies: ['Flutter Flow', 'Firebase', 'Stripe'],
      status: "Terminé",
      icon: Smartphone
    }
  ];

  // Données mockées pour les avis clients
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      company: "TechSolutions Inc.",
      role: "CEO",
      rating: 5,
      comment: "Tanteli a révolutionné notre processus de recrutement avec son système d'automatisation IA. Nous avons économisé plus de 20 heures par semaine !",
      project: "Système de recrutement intelligent",
      avatar: "SM"
    },
    {
      id: 2,
      name: "Pierre D.",
      company: "EcomPro",
      role: "Directeur Technique",
      rating: 5,
      comment: "L'automatisation mise en place pour notre e-commerce a boosté nos ventes de 30%. Un travail exceptionnel et une réactivité remarquable.",
      project: "Automatisation E-commerce",
      avatar: "PD"
    },
    {
      id: 3,
      name: "Marie L.",
      company: "StartUp Innov",
      role: "Product Manager",
      rating: 5,
      comment: "Le chatbot développé par Tanteli gère 80% de notre support client. Nos équipes peuvent maintenant se concentrer sur les cas complexes.",
      project: "Chatbot Intelligent",
      avatar: "ML"
    },
    {
      id: 4,
      name: "Jean K.",
      company: "DataCorp",
      role: "CTO",
      rating: 5,
      comment: "Expertise technique impressionnante en IA et automatisation. Les workflows n8n créés ont optimisé tous nos processus métiers.",
      project: "Workflows Automatisation",
      avatar: "JK"
    },
    {
      id: 5,
      name: "Sophie R.",
      company: "DigitalAgency",
      role: "Directrice Marketing",
      rating: 5,
      comment: "Résultats dépassant nos attentes ! L'application mobile no-code développée a été livrée avant la date prévue.",
      project: "Application Mobile",
      avatar: "SR"
    },
    {
      id: 6,
      name: "Thomas B.",
      company: "FinanceTech",
      role: "Directeur Innovation",
      rating: 5,
      comment: "L'analyse prédictive mise en place nous a permis d'anticiper les tendances marché avec une précision remarquable.",
      project: "Plateforme Analytics IA",
      avatar: "TB"
    }
  ];

  // Pagination - 4 éléments par page
  const experiencesPerPage = 4;
  const projectsPerPage = 4;

  const totalExperiencePages = Math.ceil(allExperiences.length / experiencesPerPage);
  const totalProjectPages = Math.ceil(allProjects.length / projectsPerPage);

  const currentExperiences = allExperiences.slice(
    experiencePage * experiencesPerPage,
    (experiencePage + 1) * experiencesPerPage
  );

  const currentProjects = allProjects.slice(
    projectPage * projectsPerPage,
    (projectPage + 1) * projectsPerPage
  );

  const nextExperiencePage = () => {
    setExperiencePage(prev => (prev + 1) % totalExperiencePages);
  };

  const prevExperiencePage = () => {
    setExperiencePage(prev => (prev - 1 + totalExperiencePages) % totalExperiencePages);
  };

  const nextProjectPage = () => {
    setProjectPage(prev => (prev + 1) % totalProjectPages);
  };

  const prevProjectPage = () => {
    setProjectPage(prev => (prev - 1 + totalProjectPages) % totalProjectPages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Animated Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header avec Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 shadow-sm bg-slate-900/80 backdrop-blur-xl">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={logos} alt="Logo" className="w-13 h-13 mt-[-2px]" />
              <div>
                <h1 className="text-xl font-bold text-white">TANTELI</h1>
                <p className="hidden text-sm text-white/70 sm:block">Fullstack • AI • No‑Code Expert</p>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="items-center hidden space-x-8 md:flex">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-1 font-medium text-white/80 transition-colors duration-200 hover:text-cyan-400"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://drive.google.com/uc?export=download&id=1f23dlW7XioF1Yg-oOXzupR-iU8a5D4LI" 
                download
                className="items-center hidden px-4 py-2 text-sm font-semibold text-white transition-all rounded-lg sm:flex bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger CV
              </a>

              {/* Bouton Hamburger Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white/80 transition-colors md:hidden hover:text-cyan-400"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="py-4 bg-slate-900/95 border-t border-white/10 backdrop-blur-xl md:hidden">
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center px-4 py-3 space-x-3 text-white/80 transition-all duration-200 rounded-lg hover:text-cyan-400 hover:bg-white/10"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                {/* CTA Mobile */}
                <div className="px-4 pt-4 border-t border-white/10">
                  <a 
                    href="https://drive.google.com/uc?export=download&id=1f23dlW7XioF1Yg-oOXzupR-iU8a5D4LI" 
                    download
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger CV
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="container relative px-4 py-8 mx-auto z-10">
        {/* Section Hero */}
        <section id="accueil" className="pt-8 mb-20 text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 border border-white/20 rounded-full bg-white/5 backdrop-blur">
            <div className="w-2 h-2 mr-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white/80">Ouvert aux nouveaux projets</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-black leading-tight md:text-5xl lg:text-6xl text-white">
            Expert en <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Automatisation IA</span> & Développement Full-Stack
          </h1>
          
          <p className="max-w-3xl mx-auto mb-8 text-lg text-white/70 md:text-xl">
            Je crée des solutions IA et des automatisations qui réduisent le temps opératoire, 
            fiabilisent les processus et génèrent un ROI mesurable dès les premières semaines.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row">
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 font-semibold text-white transition-transform bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:scale-105 hover:shadow-xl"
            >
              Démarrer un projet
            </button>
            <button 
              onClick={() => scrollToSection('projets')}
              className="px-8 py-4 font-semibold text-white/80 transition-colors border border-white/20 rounded-xl hover:bg-white/10 hover:text-white"
            >
              Voir mes réalisations
            </button>
          </div>

          {/* Stats */}
          <div className="grid max-w-2xl grid-cols-2 gap-6 mx-auto md:grid-cols-4">
            <Stat label="Projets livrés" value="20+" />
            <Stat label="Clients satisfaits" value="100%" />
            <Stat label="Heures économisées" value="50+" />
            <Stat label="Technos maîtrisées" value="15+" />
          </div>
        </section>

        {/* Section Services */}
        <section id="services" className="mb-20 scroll-mt-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Mes Services</h2>
            <p className="text-lg text-white/70 md:text-xl">Des solutions complètes pour automatiser et optimiser votre business</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ServiceCard 
              icon={Code} 
              title="Développement Full‑Stack" 
              desc="Apps web performantes avec React + FastAPI, prêtes à scaler."
              color="cyan"
              features={['API RESTful', 'Interfaces React', 'Base de données', 'Déploiement']}
            />
            <ServiceCard 
              icon={Brain} 
              title="Intelligence Artificielle" 
              desc="Solutions IA sur mesure intégrées à vos outils métier."
              color="purple"
              features={['Chatbots intelligents', 'Agents IA', 'Traitement de données', 'Automatisations']}
            />
            <ServiceCard 
              icon={Zap} 
              title="Automatisation No‑Code" 
              desc="Workflows n8n, Zapier et Make pour des gains immédiats."
              color="green"
              features={['Workflows n8n', 'Intégrations API', 'Automatisation CRM', 'Process métier']}
            />
          </div>
        </section>

        {/* Section Technologies */}
        <section className="mb-20">
          <div className="mb-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">Technologies & Outils</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'React', 'Python', 'FastAPI', 'PostgreSQL', 
              'Docker', 'Git', 'Git Hub' , 'AI Agents', 'Machine Learning','n8n','Xano' ,'Weweb',
              'Lowable','Zapier', 'Make', 'Tailwind CSS', 'LLMs', 'LangChain'
            ].map((tech, i) => (
              <span key={i} className="px-4 py-2 font-medium text-white/80 transition-shadow bg-white/5 border border-white/10 rounded-lg hover:shadow-lg hover:bg-white/10">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Section Expériences avec Pagination */}
        <section id="experiences" className="mb-20 scroll-mt-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Mon Parcours</h2>
            <p className="text-lg text-white/70 md:text-xl">2 ans d'expérience en développement Full-Stack, IA et automatisation</p>
          </div>

          {/* Grille en 2 colonnes - 4 cartes maximum */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            {currentExperiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                year={exp.year}
                title={exp.title}
                company={exp.company}
                duration={exp.duration}
                location={exp.location}
                achievements={exp.achievements}
                technologies={exp.technologies}
              />
            ))}
          </div>

          {/* Navigation Expériences */}
          {totalExperiencePages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevExperiencePage}
                disabled={experiencePage === 0}
                className="flex items-center gap-2 px-6 py-3 text-white/80 transition-all border border-white/20 rounded-xl hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              
              <span className="px-4 py-2 text-sm text-white/60">
                Page {experiencePage + 1} sur {totalExperiencePages}
              </span>
              
              <button
                onClick={nextExperiencePage}
                disabled={experiencePage === totalExperiencePages - 1}
                className="flex items-center gap-2 px-6 py-3 text-white/80 transition-all border border-white/20 rounded-xl hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* KPI en bas de la section */}
          <div className="grid grid-cols-2 gap-6 mt-12 md:grid-cols-4">
            {[
              { label: 'Projets livrés', value: '20+' },
              { label: 'Clients satisfaits', value: '100%' },
              { label: 'Heures économisées', value: '50+' },
              { label: 'Technos maîtrisées', value: '15+' }
            ].map((m, i) => (
              <div key={i} className="p-6 text-center bg-white/5 border border-white/10 shadow-lg rounded-2xl backdrop-blur-sm">
                <div className="mb-2 text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">{m.value}</div>
                <p className="font-medium text-white/70">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section Projets avec Pagination */}
        <section id="projets" className="mb-20 scroll-mt-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Mes Réalisations</h2>
            <p className="text-lg text-white/70 md:text-xl">Des projets concrets avec des résultats mesurables</p>
          </div>

          {/* Grille de projets - 4 cartes maximum */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 mb-8">
            {currentProjects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                status={project.status}
                icon={project.icon}
              />
            ))}
          </div>

          {/* Navigation Projets */}
          {totalProjectPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevProjectPage}
                disabled={projectPage === 0}
                className="flex items-center gap-2 px-6 py-3 text-white/80 transition-all border border-white/20 rounded-xl hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              
              <span className="px-4 py-2 text-sm text-white/60">
                Page {projectPage + 1} sur {totalProjectPages}
              </span>
              
              <button
                onClick={nextProjectPage}
                disabled={projectPage === totalProjectPages - 1}
                className="flex items-center gap-2 px-6 py-3 text-white/80 transition-all border border-white/20 rounded-xl hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Section Avis Clients - Pleine Largeur */}
      <section className="mb-20 w-full overflow-hidden">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ce que disent mes clients</h2>
          <p className="text-lg text-white/70 md:text-xl">Ils m'ont fait confiance pour leurs projets</p>
        </div>

        <div className="relative w-full">
          {/* Container pour l'animation infinie */}
          <div className="flex animate-infinite-scroll">
            {/* Dupliquer les avis pour l'effet infini */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 mx-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg"
              >
                {/* En-tête avec avatar et nom */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-cyan-400 text-sm">{testimonial.company}</p>
                    <p className="text-white/60 text-xs">{testimonial.role}</p>
                  </div>
                </div>

                {/* Étoiles */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Commentaire */}
                <p className="text-white/70 text-sm leading-relaxed mb-3">
                  "{testimonial.comment}"
                </p>

                {/* Projet */}
                <div className="text-xs text-white/50 border-t border-white/10 pt-3">
                  Projet: {testimonial.project}
                </div>
              </div>
            ))}
          </div>

          {/* Overlay gradients pour un effet de fondu */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="mb-20 scroll-mt-16 container px-4 mx-auto">
        <div className="overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Informations de contact */}
            <div className="p-8 text-white bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
              <h3 className="mb-6 text-2xl font-bold">Parlons de votre projet</h3>
              <p className="mb-8 text-cyan-100">
                Un appel d'exploration de 20 minutes pour cadrer le besoin, 
                le périmètre et les objectifs de votre projet.
              </p>

              <div className="space-y-4">
                <ContactInfo 
                  icon={Mail} 
                  label="Email" 
                  value="tanteli.ia.engineer@gmail.com" 
                />
                <ContactInfo 
                  icon={Phone} 
                  label="Téléphone" 
                  value="+261 34 61 454 97" 
                />
                <ContactInfo 
                  icon={MapPin} 
                  label="Localisation" 
                  value="Antananarivo, Madagascar" 
                />
              </div>

              <div className="pt-6 mt-8 border-t border-cyan-500/30">
                <div className="flex items-center space-x-4">
                  <a href="https://github.com/TANTELY00" className="text-white transition-colors hover:text-cyan-400">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="https://www.linkedin.com/in/tantelinirina-ravoson-ia-engineer" className="text-white transition-colors hover:text-cyan-400">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/80">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/80">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">
                    Sujet du projet *
                  </label>
                  <select
                    name="sujet"
                    required
                    value={formData.sujet}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  >
                    <option value="" className="text-gray-900">Sélectionnez un service</option>
                    <option value="fullstack" className="text-gray-900">Développement Full‑Stack / React / Fast API</option>
                    <option value="ia" className="text-gray-900">Intelligence Artificielle / No‑Code / Automatisation</option>
                    <option value="consulting" className="text-gray-900">Conseil & Audit</option>
                    <option value="autre" className="text-gray-900">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">
                    Décrivez votre projet *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-white/40"
                    placeholder="Objectifs, contraintes, budget indicatif, délais..."
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center w-full gap-2 px-6 py-4 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-slate-900/80 backdrop-blur-xl border-t border-white/10">
        <div className="container px-4 mx-auto text-center">
          <div className="flex items-center justify-center mb-6 space-x-3">
            <img src={logos} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">TANTELI</span>
          </div>
          <p className="mb-4 text-white/70">
            © 2025 TANTELI – Expert Fullstack • IA • No‑Code
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50">
            <span>No-code automation expert</span>
            <span>n8n developer</span>
            <span>AI integration</span>
            <span>React FastAPI developer</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Composants de soutien
const Stat = ({ label, value }) => (
  <div className="p-4 text-center">
    <div className="mb-2 text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
      {value}
    </div>
    <div className="text-sm font-medium text-white/70 md:text-base">{label}</div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, desc, color, features }) => (
  <div className="p-6 transition-shadow bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg rounded-2xl hover:shadow-xl hover:bg-white/10">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
      color === 'cyan' ? 'bg-cyan-500/20' : color === 'purple' ? 'bg-purple-500/20' : 'bg-green-500/20'
    }`}>
      <Icon className={`w-6 h-6 ${
        color === 'cyan' ? 'text-cyan-400' : color === 'purple' ? 'text-purple-400' : 'text-green-400'
      }`} />
    </div>
    <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
    <p className="mb-4 text-white/70">{desc}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-sm text-white/70">
          <div className={`w-2 h-2 mr-3 rounded-full ${
            color === 'cyan' ? 'bg-cyan-400' : color === 'purple' ? 'bg-purple-400' : 'bg-green-400'
          }`} />
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

// Composant ExperienceCard
const ExperienceCard = ({ year, title, company, duration, location, achievements, technologies }) => (
  <div className="h-full p-6 transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg rounded-2xl hover:shadow-xl hover:bg-white/10">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 text-sm font-medium text-cyan-400 bg-cyan-500/20 rounded-full whitespace-nowrap">
            {year}
          </span>
          <h3 className="text-lg font-bold leading-tight text-white">{title}</h3>
        </div>
        <p className="text-sm font-medium text-white/80">{company}</p>
        <p className="mt-1 text-xs text-white/60">{duration} • {location}</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div>
        <h4 className="flex items-center mb-2 text-sm font-semibold text-white">
          <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
          Résultats clés
        </h4>
        <ul className="space-y-1">
          {achievements.map((achievement, index) => (
            <li key={index} className="text-xs leading-relaxed text-white/70">
              • {achievement}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="flex items-center mb-2 text-sm font-semibold text-white">
          <div className="w-2 h-2 mr-2 bg-cyan-400 rounded-full"></div>
          Technologies utilisées
        </h4>
        <div className="flex flex-wrap gap-1">
          {technologies.map((tech, index) => (
            <span key={index} className="px-2 py-1 text-xs text-white/80 bg-white/10 rounded-md">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ProjectCard simplifié sans couleurs
const ProjectCard = ({ title, description, technologies, status, icon: Icon }) => (
  <div className="overflow-hidden transition-shadow bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg rounded-2xl hover:shadow-xl hover:bg-white/10">
    <div className="h-32 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Terminé' ? 'bg-green-500/20 text-green-400' : 
          status === 'En cours' ? 'bg-yellow-500/20 text-yellow-400' : 
          'bg-blue-500/20 text-blue-400'
        }`}>
          {status}
        </span>
      </div>
      <Icon className="w-12 h-12 text-white/60" />
    </div>
    
    <div className="p-6">
      <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-white/70">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech, index) => (
          <span key={index} className="px-2 py-1 text-xs text-white/80 bg-white/10 rounded-md">
            {tech}
          </span>
        ))}
      </div>
      
      <button className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300">
        <span>Voir les détails</span>
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
      <Icon className="w-5 h-5 text-cyan-400" />
    </div>
    <div>
      <p className="text-sm text-cyan-200">{label}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  </div>
);

export default Portfolio;