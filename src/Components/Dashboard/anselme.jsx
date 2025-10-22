import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Calendar, Settings, LogOut, 
  Filter, MapPin, Package, DollarSign, Clock, 
  ChevronDown, ChevronUp, X, BarChart3, User, 
  Plus, CheckCircle, Clock as ClockIcon, AlertCircle,
  MessageSquare, Camera, Eye, EyeOff, Truck, Warehouse,
  Upload, Download, Play, StopCircle, RefreshCw, Database
} from 'lucide-react';

// Données simulées pour les BigBags
const mockBigBags = [
  {
    id: 1,
    reference: "BG-001-TOA",
    location: "Zone A, Rangée 3",
    status: "stock", // stock, transport, manquant, endommagé
    weight: "500 kg",
    content: "Farine de blé",
    supplier: "Fournisseur Alpha",
    lastDetection: "2023-10-15T08:30:00",
    detectionMethod: "automatique", // automatique, manuelle
    direction: "entrée", // entrée, sortie
    camion: "CAM-1234TA",
    image: "bg1",
    history: [
      { date: "2023-10-15T08:30:00", action: "Détection entrée automatique", location: "Porte Entrée", camion: "CAM-1234TA" },
      { date: "2023-10-10T14:22:00", action: "Ajout manuel", location: "Zone A, Rangée 3" }
    ]
  },
  {
    id: 2,
    reference: "BG-002-TOA",
    location: "Zone B, Rangée 1",
    status: "transport",
    weight: "1000 kg",
    content: "Ciment",
    supplier: "Fournisseur Bêta",
    lastDetection: "2023-10-14T11:45:00",
    detectionMethod: "automatique",
    direction: "sortie",
    camion: "CAM-5678TA",
    image: "bg2",
    history: [
      { date: "2023-10-14T11:45:00", action: "Détection sortie automatique", location: "Porte Sortie", camion: "CAM-5678TA" },
      { date: "2023-10-13T09:15:00", action: "Déplacé vers zone chargement", location: "Quai de chargement" }
    ]
  },
  {
    id: 3,
    reference: "BG-003-TOA",
    location: "Zone A, Rangée 2",
    status: "manquant",
    weight: "750 kg",
    content: "Sucre",
    supplier: "Fournisseur Gamma",
    lastDetection: "2023-10-12T16:20:00",
    detectionMethod: "manuelle",
    direction: "sortie",
    camion: "CAM-9012TA",
    image: "bg3",
    history: [
      { date: "2023-10-12T16:20:00", action: "Marqué comme manquant après inventaire", location: "Zone A, Rangée 2" },
      { date: "2023-10-11T10:30:00", action: "Détection entrée automatique", location: "Porte Entrée", camion: "CAM-3456TA" }
    ]
  },
  {
    id: 4,
    reference: "BG-004-TOA",
    location: "Zone C, Rangée 1",
    status: "endommagé",
    weight: "800 kg",
    content: "Engrais",
    supplier: "Fournisseur Delta",
    lastDetection: "2023-10-13T09:15:00",
    detectionMethod: "manuelle",
    direction: "entrée",
    camion: "CAM-7890TA",
    image: "bg4",
    history: [
      { date: "2023-10-13T09:15:00", action: "Marqué comme endommagé à l'arrivée", location: "Porte Entrée", camion: "CAM-7890TA" },
      { date: "2023-10-12T14:40:00", action: "Chargement chez fournisseur", location: "Site Fournisseur Delta" }
    ]
  }
];

// Données simulées pour les mouvements de camions
const mockMouvements = [
  {
    id: 1,
    date: "2023-10-15T08:30:00",
    type: "entrée",
    camion: "CAM-1234TA",
    chauffeur: "Jean Rakoto",
    fournisseur: "Fournisseur Alpha",
    bigbags: 40,
    statut: "complet",
    camera: "Caméra Entrée"
  },
  {
    id: 2,
    date: "2023-10-14T11:45:00",
    type: "sortie",
    camion: "CAM-5678TA",
    chauffeur: "Paul Randria",
    client: "Client Bêta",
    bigbags: 60,
    statut: "complet",
    camera: "Caméra Sortie"
  },
  {
    id: 3,
    date: "2023-10-13T09:15:00",
    type: "entrée",
    camion: "CAM-7890TA",
    chauffeur: "Marie Rasoa",
    fournisseur: "Fournisseur Delta",
    bigbags: 25,
    statut: "partiel",
    camera: "Caméra Entrée"
  },
  {
    id: 4,
    date: "2023-10-12T16:20:00",
    type: "sortie",
    camion: "CAM-9012TA",
    chauffeur: "Pierre Andry",
    client: "Client Gamma",
    bigbags: 35,
    statut: "complet",
    camera: "Caméra Sortie"
  }
];

// Données simulées pour les statistiques
const mockStats = {
  totalBigBags: 1247,
  entreesAujourdhui: 40,
  sortiesAujourdhui: 60,
  bigbagsManquants: 42,
  bigbagsEndommages: 15,
  precisionDetection: 98.7
};

// Données simulées pour les caméras
const mockCameras = [
  {
    id: 1,
    name: "Caméra Entrée Principale",
    location: "Porte d'Entrée Zone A",
    status: "active",
    lastActive: "2023-10-15T08:30:00",
    detectionCount: 1245
  },
  {
    id: 2,
    name: "Caméra Sortie Principale",
    location: "Porte de Sortie Zone B",
    status: "active",
    lastActive: "2023-10-15T10:15:00",
    detectionCount: 987
  },
  {
    id: 3,
    name: "Caméra Entrée Secondaire",
    location: "Porte d'Entrée Zone C",
    status: "maintenance",
    lastActive: "2023-10-14T16:45:00",
    detectionCount: 567
  }
];

// Composant principal de l'application
const BigBagDetectionSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Lalaina Raharintsalama",
    email: "lalaina@smmc-toamasina.mg",
    profileCompletion: 85,
    role: "administrateur",
    lastLogin: "2023-10-15T14:30:00"
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Entrée détectée: Camion CAM-1234TA avec 40 BigBags", time: "2h", read: false },
    { id: 2, message: "Sortie détectée: Camion CAM-5678TA avec 60 BigBags", time: "5h", read: false },
    { id: 3, message: "Rapport quotidien généré", time: "1j", read: true },
    { id: 4, message: "Caméra Entrée Secondaire nécessite maintenance", time: "2j", read: false }
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-purple-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">Système BigBag</h1>
              <p className="text-xs text-gray-500">Port de Toamasina</p>
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
              label="Tableau de bord" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={Package} 
              label="Inventaire BigBags" 
              active={activeTab === 'inventory'} 
              onClick={() => setActiveTab('inventory')} 
            />
            <SidebarItem 
              icon={Truck} 
              label="Mouvements" 
              active={activeTab === 'movements'} 
              onClick={() => setActiveTab('movements')} 
            />
            <SidebarItem 
              icon={Camera} 
              label="Surveillance" 
              active={activeTab === 'surveillance'} 
              onClick={() => setActiveTab('surveillance')} 
            />
            <SidebarItem 
              icon={Database} 
              label="Modèle IA" 
              active={activeTab === 'ai-model'} 
              onClick={() => setActiveTab('ai-model')} 
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
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
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
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'dashboard' && <DashboardTab stats={mockStats} movements={mockMouvements} />}
            {activeTab === 'inventory' && <InventoryTab bigBags={mockBigBags} />}
            {activeTab === 'movements' && <MovementsTab movements={mockMouvements} />}
            {activeTab === 'surveillance' && <SurveillanceTab cameras={mockCameras} />}
            {activeTab === 'ai-model' && <AIModelTab />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </main>
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

// Barre de recherches
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          placeholder="Rechercher un BigBag, camion, référence..."
          className="w-full py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

// Dashboard Tab
const DashboardTab = ({ stats, movements }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord - Port de Toamasina</h2>
        <p className="text-gray-600">Surveillance en temps réel des mouvements de BigBags</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard title="Total BigBags" value={stats.totalBigBags} icon={Package} color="blue" />
        <StatCard title="Entrées aujourd'hui" value={stats.entreesAujourdhui} icon={Download} color="green" />
        <StatCard title="Sorties aujourd'hui" value={stats.sortiesAujourdhui} icon={Upload} color="red" />
        <StatCard title="BigBags manquants" value={stats.bigbagsManquants} icon={AlertCircle} color="yellow" />
        <StatCard title="BigBags endommagés" value={stats.bigbagsEndommages} icon={AlertCircle} color="orange" />
        <StatCard title="Précision détection" value={`${stats.precisionDetection}%`} icon={BarChart3} color="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Derniers mouvements */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Derniers mouvements</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {movements.slice(0, 5).map(mouvement => (
                <div key={mouvement.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-md ${
                        mouvement.type === 'entrée' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {mouvement.type === 'entrée' ? <Download className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{mouvement.camion}</h4>
                      <p className="text-sm text-gray-500">
                        {mouvement.type === 'entrée' ? mouvement.fournisseur : mouvement.client} • {mouvement.chauffeur}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          mouvement.type === 'entrée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {mouvement.type === 'entrée' ? 'Entrée' : 'Sortie'}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {mouvement.bigbags} BigBags
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-xs text-gray-500">
                        {new Date(mouvement.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 text-right bg-gray-50">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Voir tous les mouvements
              </button>
            </div>
          </div>
        </div>

        {/* État des caméras */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">État du système</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between p-4 mb-4 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="ml-2 text-sm font-medium text-green-800">Système de détection actif</span>
                </div>
                <button className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                  <StopCircle className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-sm font-medium text-gray-800">Caméra Entrée</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-sm font-medium text-gray-800">Caméra Sortie</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-sm font-medium text-gray-800">Modèle IA</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Opérationnel
                  </span>
                </div>
              </div>
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
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
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

// Inventory Tab
const InventoryTab = ({ bigBags }) => {
  const [selectedBigBag, setSelectedBigBag] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBigBags = statusFilter === 'all' 
    ? bigBags 
    : bigBags.filter(bigBag => bigBag.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventaire des BigBags</h2>
          <p className="text-gray-600">{filteredBigBags.length} BigBags dans l'inventaire</p>
        </div>
        <div className="flex items-center mt-4 space-x-2 sm:mt-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="stock">En stock</option>
            <option value="transport">En transport</option>
            <option value="manquant">Manquant</option>
            <option value="endommagé">Endommagé</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter manuellement
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Référence</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contenu</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Emplacement</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dernière détection</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBigBags.map((bigBag) => (
                  <tr key={bigBag.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                      {bigBag.reference}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">{bigBag.content} ({bigBag.weight})</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{bigBag.location}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bigBag.status === 'stock' ? 'bg-green-100 text-green-800' :
                        bigBag.status === 'transport' ? 'bg-blue-100 text-blue-800' :
                        bigBag.status === 'manquant' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bigBag.status === 'stock' ? 'En stock' :
                         bigBag.status === 'transport' ? 'En transport' :
                         bigBag.status === 'manquant' ? 'Manquant' : 'Endommagé'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {new Date(bigBag.lastDetection).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                      <a href="#" className="text-blue-600 hover:text-blue-900">
                        Détails<span className="sr-only">, {bigBag.reference}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredBigBags.length === 0 && (
        <div className="py-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun BigBag trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos filtres ou ajoutez de nouveaux BigBags.
          </p>
        </div>
      )}
    </div>
  );
};

// Movements Tab
const MovementsTab = ({ movements }) => {
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMovements = typeFilter === 'all' 
    ? movements 
    : movements.filter(movement => movement.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mouvements de BigBags</h2>
          <p className="text-gray-600">Historique des entrées et sorties</p>
        </div>
        <div className="flex items-center mt-4 space-x-2 sm:mt-0">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les mouvements</option>
            <option value="entrée">Entrées seulement</option>
            <option value="sortie">Sorties seulement</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date/Heure</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Camion</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Chauffeur</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Partenaire</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">BigBags</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Caméra</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                      {new Date(movement.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === 'entrée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.type === 'entrée' ? 'Entrée' : 'Sortie'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.camion}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.chauffeur}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {movement.type === 'entrée' ? movement.fournisseur : movement.client}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.bigbags}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{movement.camera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Surveillance Tab
const SurveillanceTab = ({ cameras }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Surveillance en Temps Réel</h2>
        <p className="text-gray-600">Monitoring des caméras de détection</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cameras.map(camera => (
          <div key={camera.id} className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 ${
                    camera.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{camera.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{camera.location}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  camera.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {camera.status === 'active' ? 'Active' : 'Maintenance'}
                </span>
                <span className="text-gray-600">{camera.detectionCount} détections</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Flux vidéo en direct</h3>
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
            <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Caméra Entrée Principale</p>
                <button className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-1" />
                  Activer
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Caméra Sortie Principale</p>
                <button className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-1" />
                  Activer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Model Tab
const AIModelTab = () => {
  const [trainingHistory] = useState([
    { date: "2023-10-15", version: "v2.1", accuracy: 98.7, loss: 0.05, dataset: "12500 images" },
    { date: "2023-10-10", version: "v2.0", accuracy: 97.2, loss: 0.08, dataset: "12000 images" },
    { date: "2023-10-05", version: "v1.5", accuracy: 95.8, loss: 0.12, dataset: "11000 images" },
    { date: "2023-10-01", version: "v1.0", accuracy: 92.3, loss: 0.18, dataset: "10000 images" },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Modèle de Deep Learning</h2>
        <p className="text-gray-600">Gestion et performance du modèle IA de détection</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-blue-600 bg-blue-100 rounded-md">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Précision</dt>
                  <dd className="text-lg font-medium text-gray-900">98.7%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-green-600 bg-green-100 rounded-md">
                  <Database className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Taille dataset</dt>
                  <dd className="text-lg font-medium text-gray-900">12.5k images</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-purple-600 bg-purple-100 rounded-md">
                  <RefreshCw className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Détections/jour</dt>
                  <dd className="text-lg font-medium text-gray-900">245</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-yellow-600 bg-yellow-100 rounded-md">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Temps traitement</dt>
                  <dd className="text-lg font-medium text-gray-900">0.8s</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Historique d'entraînement</h3>
          <div className="mt-4">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Version</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Précision</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Perte</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dataset</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainingHistory.map((training, index) => (
                    <tr key={index}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {training.date}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.version}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.accuracy}%</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.loss}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.dataset}</td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          Télécharger<span className="sr-only">, {training.version}</span>
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

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Actions du modèle</h3>
          <div className="flex mt-4 space-x-4">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Nouvel entraînement
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Exporter les données
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
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
        <h2 className="text-2xl font-bold text-gray-900">Paramètres du Système</h2>
        <p className="text-gray-600">Configuration de l'application</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Paramètres de détection</h3>
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="detection-sensitivity" className="block text-sm font-medium text-gray-700">
                  Sensibilité de détection
                </label>
                <select
                  name="detection-sensitivity"
                  id="detection-sensitivity"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="medium"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
              </div>

              <div>
                <label htmlFor="scan-frequency" className="block text-sm font-medium text-gray-700">
                  Fréquence des analyses
                </label>
                <select
                  name="scan-frequency"
                  id="scan-frequency"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="realtime"
                >
                  <option value="realtime">Temps réel</option>
                  <option value="5">5 secondes</option>
                  <option value="10">10 secondes</option>
                  <option value="30">30 secondes</option>
                </select>
              </div>

              <div>
                <label htmlFor="alert-threshold" className="block text-sm font-medium text-gray-700">
                  Seuil d'alerte (écarts)
                </label>
                <input
                  type="number"
                  name="alert-threshold"
                  id="alert-threshold"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="5"
                />
              </div>

              <div>
                <label htmlFor="data-retention" className="block text-sm font-medium text-gray-700">
                  Rétention des données (jours)
                </label>
                <input
                  type="number"
                  name="data-retention"
                  id="data-retention"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="90"
                />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer les paramètres
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Paramètres de notification</h3>
          <div className="mt-4">
            <fieldset>
              <legend className="text-sm font-medium text-gray-900">Types de notifications</legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="bigbag-missing"
                      name="bigbag-missing"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="bigbag-missing" className="font-medium text-gray-700">
                      BigBags manquants
                    </label>
                    <p className="text-gray-500">Alertes lorsque des écarts sont détectés entre l'inventaire et les mouvements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="system-errors"
                      name="system-errors"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="system-errors" className="font-medium text-gray-700">
                      Erreurs système
                    </label>
                    <p className="text-gray-500">Alertes pour les problèmes techniques du système de détection.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="daily-reports"
                      name="daily-reports"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="daily-reports" className="font-medium text-gray-700">
                      Rapports quotidiens
                    </label>
                    <p className="text-gray-500">Résumé quotidien des mouvements et de l'état du stock.</p>
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

export default BigBagDetectionSystem;