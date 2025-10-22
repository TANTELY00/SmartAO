import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Calendar, Bookmark, Settings, LogOut, 
  Filter, MapPin, Briefcase, DollarSign, Clock, Star,
  ChevronDown, ChevronUp, ExternalLink, Send, X,
  BarChart3, User, Mail, Phone, Download, Plus,
  CheckCircle, Clock as ClockIcon, AlertCircle, Crown,
  MessageSquare, Zap, CreditCard, Sparkles
} from 'lucide-react';

// Données simulées pour les offres d'emploi
const mockJobOffers = [
  {
    id: 1,
    title: "Développeur Fullstack React/Node.js",
    company: "TechCorp",
    location: "Paris, France",
    salary: "45k-60k €",
    type: "CDI",
    experience: "3-5 ans",
    description: "Nous recherchons un développeur fullstack expérimenté pour rejoindre notre équipe technique. Vous travaillerez sur des projets innovants avec les dernières technologies.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    postedDate: "2023-10-15",
    deadline: "2023-11-15",
    logo: "TC",
    status: "available",
    source: "LinkedIn",
    subscriptionRequired: "premium" // gratuit, basic, premium
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataInsights",
    location: "Lyon, France",
    salary: "50k-65k €",
    type: "CDI",
    experience: "2-4 ans",
    description: "Rejoignez notre équipe data pour développer des modèles prédictifs et des solutions d'IA pour nos clients.",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    postedDate: "2023-10-14",
    deadline: "2023-11-10",
    logo: "DI",
    status: "applied",
    applicationDate: "2023-10-16",
    source: "Indeed",
    subscriptionRequired: "basic" // gratuit, basic, premium
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudSolutions",
    location: "Toulouse, France",
    salary: "55k-70k €",
    type: "CDI",
    experience: "4-6 ans",
    description: "Nous cherchons un ingénieur DevOps pour optimiser notre infrastructure cloud et nos pipelines de déploiement.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    postedDate: "2023-10-13",
    deadline: "2023-11-05",
    logo: "CS",
    status: "saved",
    source: "Monster",
    subscriptionRequired: "premium" // gratuit, basic, premium
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Bordeaux, France",
    salary: "40k-55k €",
    type: "CDI",
    experience: "3-5 ans",
    description: "Rejoignez notre équipe créative pour concevoir des interfaces utilisateur exceptionnelles pour nos produits digitaux.",
    skills: ["Figma", "Sketch", "Prototyping", "User Research"],
    postedDate: "2023-10-12",
    deadline: "2023-11-20",
    logo: "DS",
    status: "available",
    source: "Welcome to the Jungle",
    subscriptionRequired: "basic" // gratuit, basic, premium
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateTech",
    location: "Nantes, France",
    salary: "60k-75k €",
    type: "CDI",
    experience: "5-7 ans",
    description: "Nous recherchons un Product Manager pour diriger notre roadmap produit et travailler avec nos équipes techniques et design.",
    skills: ["Product Strategy", "Agile", "Analytics", "Roadmapping"],
    postedDate: "2023-10-11",
    deadline: "2023-11-18",
    logo: "IT",
    status: "available",
    source: "LinkedIn",
    subscriptionRequired: "gratuit" // gratuit, basic, premium
  }
];

// Plans d'abonnement
const subscriptionPlans = [
  {
    id: "gratuit",
    name: "Gratuit",
    price: 0,
    features: [
      "Accès aux offres basiques",
      "5 candidatures/mois",
      "Assistant IA limité",
      "Sauvegarde limitée (5 offres)"
    ],
    limitations: ["Offres premium masquées", "Pas de rappels automatiques"]
  },
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: [
      "Accès à toutes les offres Basic",
      "Candidatures illimitées",
      "Assistant IA standard",
      "Sauvegarde illimitée",
      "Rappels de deadline"
    ],
    popular: false
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    features: [
      "Accès à toutes les offres",
      "Candidatures illimitées",
      "Assistant IA avancé",
      "Sauvegarde illimitée",
      "Rappels de deadline",
      "Statistiques détaillées",
      "Poste d'offres d'emploi"
    ],
    popular: true
  }
];

// Données simulées pour les statistiques
const mockStats = {
  totalOffers: 1247,
  appliedOffers: 23,
  savedOffers: 15,
  responseRate: "35%",
  newToday: 42
};

// Données simulées pour les événements de l'agenda
const mockEvents = [
  {
    id: 1,
    title: "Entretien TechCorp",
    date: "2023-10-20T10:00:00",
    type: "interview",
    company: "TechCorp",
    job: "Développeur Fullstack React/Node.js"
  },
  {
    id: 2,
    title: "Relance DataInsights",
    date: "2023-10-22T14:30:00",
    type: "followup",
    company: "DataInsights",
    job: "Data Scientist"
  },
  {
    id: 3,
    title: "Salon de l'emploi tech",
    date: "2023-10-25T09:00:00",
    type: "event",
    location: "Paris Expo Porte de Versailles"
  },
  {
    id: 4,
    title: "Deadline: DevOps Engineer - CloudSolutions",
    date: "2023-11-04T23:59:00",
    type: "deadline",
    company: "CloudSolutions",
    job: "DevOps Engineer"
  }
];

// Composant principal de l'application
const SmartAODashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Lalaina Raharintsalama",
    email: "jean.dupont@email.com",
    profileCompletion: 85,
    subscription: "basic", // gratuit, basic, premium
    subscriptionEnd: "2023-12-31"
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "12 nouvelles offres correspondent à votre profil", time: "2h", read: false },
    { id: 2, message: "Rappel: Entretien avec TechCorp demain", time: "5h", read: false },
    { id: 3, message: "Votre candidature a été vue par DataInsights", time: "1j", read: true },
    { id: 4, message: "Deadline approchante: DevOps Engineer chez CloudSolutions", time: "10j", read: false }
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Filtrer les offres selon l'abonnement
  const getOffersForSubscription = () => {
    return mockJobOffers.filter(offer => {
      if (user.subscription === "premium") return true;
      if (user.subscription === "basic") return offer.subscriptionRequired !== "premium";
      return offer.subscriptionRequired === "gratuit";
    });
  };

  const filteredOffers = getOffersForSubscription();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-purple-600">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">Smart AO</h1>
              <p className="text-xs text-gray-500">Assistant d'Offres Intelligent</p>
            </div>
          </div>
          <button className="p-1 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <div className="space-y-1">
            <SidebarItem 
              icon={BarChart3} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={Briefcase} 
              label="Offres d'emploi" 
              active={activeTab === 'jobs'} 
              onClick={() => setActiveTab('jobs')} 
            />
            <SidebarItem 
              icon={CheckCircle} 
              label="Mes candidatures" 
              active={activeTab === 'applications'} 
              onClick={() => setActiveTab('applications')} 
            />
            <SidebarItem 
              icon={Bookmark} 
              label="Offres sauvegardées" 
              active={activeTab === 'saved'} 
              onClick={() => setActiveTab('saved')} 
            />
            <SidebarItem 
              icon={Calendar} 
              label="Agenda" 
              active={activeTab === 'calendar'} 
              onClick={() => setActiveTab('calendar')} 
            />
            <SidebarItem 
              icon={Crown} 
              label="Abonnement" 
              active={activeTab === 'subscription'} 
              onClick={() => setActiveTab('subscription')} 
            />
            <SidebarItem 
              icon={Settings} 
              label="Paramètres" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </div>

          <div className="pt-10 mt-10 border-t border-gray-200">
            <div className="flex items-center px-4 py-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.subscription} • {user.subscription === 'gratuit' ? 'Essai' : 'Actif'}</p>
              </div>
              <button className="ml-auto">
                <LogOut className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-800 bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Assistant IA flottant */}
      {aiAssistantOpen && (
        <AIAssistant onClose={() => setAiAssistantOpen(false)} />
      )}

      {/* Bouton assistant IA */}
      <button 
        onClick={() => setAiAssistantOpen(true)}
        className="fixed z-40 p-4 text-white rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 bottom-6 right-6"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button className="p-1 mr-2 text-gray-500 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('subscription')}
              className="items-center hidden px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full md:flex"
            >
              <Crown className="w-3 h-3 mr-1" />
              {user.subscription === 'premium' ? 'Premium' : user.subscription === 'basic' ? 'Basic' : 'Gratuit'}
            </button>

            <button className="relative p-2 text-gray-500 bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <div className="items-center hidden space-x-2 md:flex">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Profil complété à {user.profileCompletion}%</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'dashboard' && <DashboardTab stats={mockStats} events={mockEvents} offers={filteredOffers} user={user} />}
            {activeTab === 'jobs' && <JobsTab offers={filteredOffers} user={user} />}
            {activeTab === 'applications' && <ApplicationsTab offers={mockJobOffers.filter(o => o.status === 'applied')} />}
            {activeTab === 'saved' && <SavedTab offers={mockJobOffers.filter(o => o.status === 'saved')} user={user} />}
            {activeTab === 'calendar' && <CalendarTab events={mockEvents} />}
            {activeTab === 'subscription' && <SubscriptionTab user={user} plans={subscriptionPlans} />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </main>
      </div>
    </div>
  );
};

// Assistant IA
const AIAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant IA Smart AO. Comment puis-je vous aider dans votre recherche d'emploi aujourd'hui ?",
      sender: "ai"
    }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user"
    };
    
    setMessages([...messages, userMessage]);
    setInputText("");
    
    // Simuler une réponse de l'IA après un délai
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "Je peux vous aider à optimiser votre CV pour les offres tech, préparer vos entretiens, ou trouver des offres correspondant à votre profil. Dites-moi ce dont vous avez besoin !",
        sender: "ai"
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full max-w-md bg-white border border-gray-200 rounded-t-lg shadow-lg md:rounded-lg md:bottom-6 md:right-6 md:max-w-sm">
      <div className="flex items-center justify-between px-4 py-3 text-white rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Assistant IA Smart AO</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="h-64 p-4 overflow-y-auto">
        {messages.map(message => (
          <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center p-4 border-t border-gray-200">
        <input
          type="text"
          placeholder="Posez votre question..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          className="px-4 py-2 text-white rounded-r-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Composants sidebar
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </button>
);

// Barre de recherche
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          placeholder="Rechercher une offre, compétence, entreprise..."
          className="w-full py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {filtersOpen && (
        <div className="absolute left-0 right-0 z-10 p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Localisation</label>
              <div className="relative">
                <MapPin className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input 
                  type="text" 
                  placeholder="Ville, région..." 
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Type de contrat</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="">Tous</option>
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="freelance">Freelance</option>
                <option value="stage">Stage</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Salaire minimum</label>
              <div className="relative">
                <DollarSign className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input 
                  type="number" 
                  placeholder="Salaire min" 
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Expérience</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="">Tous</option>
                <option value="débutant">Débutant</option>
                <option value="1-3">1-3 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="5+">5+ ans</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Réinitialiser
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard Tab
const DashboardTab = ({ stats, events, offers, user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-600">Vue d'ensemble de votre recherche d'emploi</p>
      </div>

      {/* Bannière d'abonnement si nécessaire */}
      {user.subscription === 'gratuit' && (
        <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Crown className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Passez à l'abonnement Premium</h3>
              <p className="text-sm text-blue-600">Débloquez l'accès à toutes les offres exclusives et fonctionnalités avancées.</p>
            </div>
            <div className="ml-auto">
              <button className="px-3 py-1 text-xs font-medium text-white rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Voir les offres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Offres totales" value={stats.totalOffers} icon={Briefcase} color="blue" />
        <StatCard title="Candidatures" value={stats.appliedOffers} icon={Send} color="green" />
        <StatCard title="Offres sauvegardées" value={stats.savedOffers} icon={Bookmark} color="purple" />
        <StatCard title="Taux de réponse" value={stats.responseRate} icon={BarChart3} color="yellow" />
        <StatCard title="Nouvelles aujourd'hui" value={stats.newToday} icon={Clock} color="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dernières offres */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Dernières offres correspondantes</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {offers.slice(0, 3).map(offer => (
                <div key={offer.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-md">
                        <span className="font-medium text-blue-800">{offer.logo}</span>
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{offer.title}</h4>
                      <p className="text-sm text-gray-500">{offer.company} • {offer.location}</p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {offer.type}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {offer.experience}
                        </span>
                        {offer.subscriptionRequired !== 'gratuit' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {offer.subscriptionRequired === 'premium' ? 'Premium' : 'Basic'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 text-right bg-gray-50">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Voir toutes les offres
              </button>
            </div>
          </div>
        </div>

        {/* Prochains événements */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Prochains événements</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {events.map(event => (
                <div key={event.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-md ${
                        event.type === 'interview' ? 'bg-blue-100' : 
                        event.type === 'followup' ? 'bg-green-100' : 
                        event.type === 'deadline' ? 'bg-red-100' : 'bg-purple-100'
                      }`}>
                        <Calendar className={`w-5 h-5 ${
                          event.type === 'interview' ? 'text-blue-600' : 
                          event.type === 'followup' ? 'text-green-600' : 
                          event.type === 'deadline' ? 'text-red-600' : 'text-purple-600'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {event.company && (
                        <p className="mt-1 text-xs text-gray-500">{event.company} • {event.job}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 text-center bg-gray-50">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un événement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de carte statistique
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`rounded-md p-3 ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Jobs Tab
const JobsTab = ({ offers, user }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Offres d'emploi</h2>
          <p className="text-gray-600">{offers.length} offres correspondant à vos critères</p>
        </div>
        <div className="flex items-center mt-4 space-x-2 sm:mt-0">
          <div className="flex p-1 bg-gray-100 rounded-md">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
        </div>
      </div>

      {/* Bannière d'abonnement si nécessaire */}
      {user.subscription !== 'premium' && (
        <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Crown className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Débloquez les offres Premium</h3>
              <p className="text-sm text-blue-600">Passez à l'abonnement Premium pour accéder à toutes les offres exclusives.</p>
            </div>
            <div className="ml-auto">
              <button className="px-3 py-1 text-xs font-medium text-white rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Mettre à niveau
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map(offer => (
          <JobCard key={offer.id} offer={offer} view={view} />
        ))}
      </div>

      {offers.length === 0 && (
        <div className="py-12 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre disponible</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez d'ajuster vos filtres ou vérifiez votre abonnement pour voir plus d'offres.
          </p>
        </div>
      )}
    </div>
  );
};

// Composant de carte d'offre d'emploi
const JobCard = ({ offer, view }) => {
  const [expanded, setExpanded] = useState(false);
  const daysUntilDeadline = Math.ceil((new Date(offer.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm ${view === 'list' && 'sm:col-span-2 sm:flex-row'}`}>
      <div className={`p-5 ${view === 'list' && 'sm:flex-1'}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-md">
              <span className="font-medium text-blue-800">{offer.logo}</span>
            </div>
          </div>
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-medium text-gray-900">{offer.title}</h3>
            <p className="text-sm text-gray-500">{offer.company} • {offer.location}</p>
            <div className="flex flex-wrap items-center mt-2 space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {offer.type}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {offer.experience}
              </span>
              {offer.subscriptionRequired !== 'gratuit' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {offer.subscriptionRequired === 'premium' ? 'Premium' : 'Basic'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500 line-clamp-3">{offer.description}</p>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-1">
            {offer.skills.map((skill, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center mt-4 text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          Postée le {new Date(offer.postedDate).toLocaleDateString('fr-FR')}
          {daysUntilDeadline > 0 && (
            <>
              <span className="mx-2">•</span>
              <span className={daysUntilDeadline <= 3 ? "text-red-600 font-medium" : "text-gray-600"}>
                {daysUntilDeadline === 1 
                  ? "Dernier jour pour postuler" 
                  : `Expire dans ${daysUntilDeadline} jours`}
              </span>
            </>
          )}
        </div>
      </div>

      <div className={`px-5 py-4 bg-gray-50 ${view === 'list' && 'sm:w-48 sm:flex sm:flex-col sm:justify-between'}`}>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{offer.salary}</span>
          {offer.status === 'applied' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Déjà postulé
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 sm:mt-0">
          <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
            {offer.status === 'applied' ? 'Voir la candidature' : 'Postuler maintenant'}
          </button>
          
          <div className="flex space-x-2">
            <button className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              <Bookmark className="w-4 h-4 mr-2" />
              Sauvegarder
            </button>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Applications Tab
const ApplicationsTab = ({ offers }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mes candidatures</h2>
        <p className="text-gray-600">Suivi de vos candidatures envoyées</p>
      </div>

      {offers.length === 0 ? (
        <div className="py-12 text-center">
          <Send className="w-12 h-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vous n'avez pas encore postulé à des offres d'emploi.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
              <Briefcase className="w-4 h-4 mr-2" />
              Parcourir les offres
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {offers.map(offer => (
              <li key={offer.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-blue-600 truncate">{offer.title}</p>
                    <div className="flex flex-shrink-0 ml-2">
                      <p className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                        Candidature envoyée
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {offer.company}
                      </p>
                      <p className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {offer.location}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Postulé le <time dateTime={offer.applicationDate}>{new Date(offer.applicationDate).toLocaleDateString('fr-FR')}</time>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Saved Tab
const SavedTab = ({ offers, user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Offres sauvegardées</h2>
        <p className="text-gray-600">Vos offres d'emploi favorites</p>
      </div>

      {offers.length === 0 ? (
        <div className="py-12 text-center">
          <Bookmark className="w-12 h-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre sauvegardée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez à parcourir les offres et sauvegardez celles qui vous intéressent.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
              <Briefcase className="w-4 h-4 mr-2" />
              Parcourir les offres
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map(offer => (
            <JobCard key={offer.id} offer={offer} view="grid" />
          ))}
        </div>
      )}
    </div>
  );
};

// Calendar Tab
const CalendarTab = ({ events }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
        <p className="text-gray-600">Gérez vos entretiens et deadlines</p>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Octobre 2023</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Aujourd'hui
              </button>
              <button className="p-1 text-gray-400 bg-gray-100 rounded-md hover:text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button className="p-1 text-gray-400 bg-gray-100 rounded-md hover:text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mt-6 text-xs leading-6 text-center text-gray-500">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mer</div>
            <div>Jeu</div>
            <div>Ven</div>
            <div>Sam</div>
            <div>Dim</div>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-2 text-sm">
            {/* Days would be generated here */}
            {[...Array(31)].map((_, i) => (
              <div key={i} className={`py-2 ${i === 14 ? 'bg-blue-100 rounded-full' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Événements à venir</h3>
          <div className="mt-4">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Événement</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Entreprise</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{event.title}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{event.company || '-'}</td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          Voir<span className="sr-only">, {event.title}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subscription Tab
const SubscriptionTab = ({ user, plans }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Abonnement</h2>
        <p className="text-gray-600">Gérez votre abonnement Smart AO</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Votre abonnement actuel</h3>
          <div className="mt-4">
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 capitalize">{user.subscription}</h4>
                  <p className="text-sm text-gray-500">
                    {user.subscription === 'gratuit' 
                      ? "Plan gratuit avec limitations" 
                      : `Facturation mensuelle • Renouvellement le ${new Date(user.subscriptionEnd).toLocaleDateString('fr-FR')}`}
                  </p>
                </div>
                {user.subscription !== 'premium' && (
                  <button className="px-4 py-2 ml-auto text-sm font-medium text-white rounded-md shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Mettre à niveau
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Choisir un plan d'abonnement</h3>
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className={`rounded-lg border-2 ${plan.popular ? 'border-blue-500' : 'border-gray-200'} ${plan.id === user.subscription ? 'bg-blue-50' : 'bg-white'} p-6`}>
                {plan.popular && (
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-4 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price === 0 ? 'Gratuit' : `€${plan.price}`}</span>
                    {plan.price > 0 && <span className="ml-1 text-sm text-gray-500">/mois</span>}
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="ml-2 text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations && plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="ml-2 text-sm text-gray-600">{limitation}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button
                    className={`w-full rounded-md px-4 py-2 text-sm font-medium ${
                      plan.id === user.subscription
                        ? 'bg-blue-100 text-blue-700 cursor-default'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                    disabled={plan.id === user.subscription}
                  >
                    {plan.id === user.subscription ? 'Plan actuel' : 'Choisir ce plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
        <p className="text-gray-600">Gérez vos préférences et votre compte</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Profil</h3>
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="Jean"
                />
              </div>

              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="Dupont"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue={user.email}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="+33 6 12 34 56 78"
                />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences de notifications</h3>
          <div className="mt-4">
            <fieldset>
              <legend className="text-sm font-medium text-gray-900">Types de notifications</legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="new-offers"
                      name="new-offers"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="new-offers" className="font-medium text-gray-700">
                      Nouvelles offres correspondantes
                    </label>
                    <p className="text-gray-500">Recevez des notifications lorsque de nouvelles offres correspondant à votre profil sont disponibles.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="deadline-reminders"
                      name="deadline-reminders"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="deadline-reminders" className="font-medium text-gray-700">
                      Rappels de deadline
                    </label>
                    <p className="text-gray-500">Recevez des rappels 24h avant l'expiration des offres qui vous intéressent.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="application-updates"
                      name="application-updates"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="application-updates" className="font-medium text-gray-700">
                      Mises à jour de candidature
                    </label>
                    <p className="text-gray-500">Soyez informé lorsque vos candidatures sont consultées ou qu'il y a du mouvement.</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer les préférences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAODashboard;