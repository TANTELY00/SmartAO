import React, { useState, useEffect } from 'react';
import logos from '/src/assets/logo.png';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  User, 
  Settings,
  BarChart3,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Shield,
  Bot,
  Mail,
  MessageSquare,
  Calendar,
  Paperclip,
  ArrowRight,
  Edit3,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  Eye,
  FileText,
  AlertCircle,
  Send,
  Menu,
  LogOut,
  LifeBuoy,
  Bell,
  Palette,
  Smile,
  Image,
  Video,
  Mic,
  Home,
  FolderOpen,
  TrendingUp,
  Mailbox
} from 'lucide-react';

const IFBTicketing = () => {
  // États pour la gestion des données
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Nouveaux états pour le thème et la navigation fixe
  const [theme, setTheme] = useState({
    primary: '#3b82f6',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    isDark: true
  });

  const [isNavFixed, setIsNavFixed] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // États pour la communication
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Données mockées étendues
  const mockTickets = [
    {
      id: 'TICKET-001',
      title: 'Problème de connexion API Gateway',
      description: 'Impossible de se connecter à l\'API de gestion des utilisateurs, erreur 503 sur les endpoints principaux. Impact sur les services de facturation.',
      type: 'incident',
      service: 'Développement',
      status: 'en_cours',
      priority: 'haute',
      createdBy: 'Jean Dupont',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      assignedTo: 'Pierre Lambert',
      dueDate: '2024-01-17T18:00:00Z',
      tags: ['api', 'urgent', 'backend'],
      validations: {
        administratif: { status: 'validé', by: 'Marie Martin', date: '2024-01-15T11:00:00Z' },
        technique: { status: 'en_cours', by: 'Pierre Lambert', date: null },
        rh: { status: 'en_attente', by: null, date: null }
      },
      comments: [
        { 
          id: 1,
          user: 'Jean Dupont', 
          message: 'Le problème persiste depuis ce matin, impacte toute l\'équipe commerciale', 
          date: '2024-01-15T10:35:00Z',
          avatar: 'JD'
        },
        { 
          id: 2,
          user: 'Pierre Lambert', 
          message: 'Je regarde le problème, semble lié au load balancer. J\'ai redémarré les services.', 
          date: '2024-01-15T10:40:00Z',
          avatar: 'PL'
        }
      ],
      attachments: ['log_api.txt', 'screenshot_error.png'],
      timeSpent: '2h 30m'
    },
    {
      id: 'TICKET-002',
      title: 'Demande de formation IA Avancée',
      description: 'Besoin de formation approfondie sur les modèles Mistral et l\'orchestration des agents MCP pour l\'équipe R&D. Formation de 3 jours recommandée.',
      type: 'formation',
      service: 'Ressources Humaines',
      status: 'en_attente',
      priority: 'moyenne',
      createdBy: 'Sophie Bernard',
      createdAt: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      assignedTo: null,
      dueDate: '2024-02-01T18:00:00Z',
      tags: ['formation', 'ia', 'rd'],
      validations: {
        administratif: { status: 'en_attente', by: null, date: null },
        technique: { status: 'en_attente', by: null, date: null },
        rh: { status: 'en_attente', by: null, date: null }
      },
      comments: [],
      attachments: ['besoin_formation.pdf'],
      timeSpent: '0h'
    },
    {
      id: 'TICKET-003',
      title: 'Migration PostgreSQL 15 - Optimisation Performance',
      description: 'Migration des données vers PostgreSQL 15 avec optimisation des indexes et requêtes pour améliorer les performances de 40%. Tests de charge requis.',
      type: 'maintenance',
      service: 'Administratif',
      status: 'validé',
      priority: 'basse',
      createdBy: 'Paul Durand',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T16:30:00Z',
      assignedTo: 'Pierre Lambert',
      dueDate: '2024-01-20T18:00:00Z',
      tags: ['bdd', 'migration', 'performance'],
      validations: {
        administratif: { status: 'validé', by: 'Marie Martin', date: '2024-01-14T15:00:00Z' },
        technique: { status: 'validé', by: 'Pierre Lambert', date: '2024-01-14T16:30:00Z' },
        rh: { status: 'non_requis', by: null, date: null }
      },
      comments: [
        { 
          id: 1,
          user: 'Paul Durand', 
          message: 'Migration planifiée pour ce weekend, fenêtre de maintenance approuvée', 
          date: '2024-01-14T14:25:00Z',
          avatar: 'PD'
        }
      ],
      attachments: ['plan_migration.pdf', 'test_performance.xlsx'],
      timeSpent: '8h 15m'
    },
    {
      id: 'TICKET-004',
      title: 'Refonte Interface Tableau de Bord Analytics',
      description: 'Redesign complet de l\'interface du tableau de bord avec intégration de nouvelles métriques et amélioration UX/UI pour les rapports financiers.',
      type: 'evolution',
      service: 'Développement',
      status: 'en_cours',
      priority: 'haute',
      createdBy: 'Laura Martinez',
      createdAt: '2024-01-13T11:20:00Z',
      updatedAt: '2024-01-15T15:45:00Z',
      assignedTo: 'UI/UX Team',
      dueDate: '2024-01-25T18:00:00Z',
      tags: ['frontend', 'ui/ux', 'refonte'],
      validations: {
        administratif: { status: 'validé', by: 'Marie Martin', date: '2024-01-13T12:00:00Z' },
        technique: { status: 'en_cours', by: 'Pierre Lambert', date: null },
        rh: { status: 'non_requis', by: null, date: null }
      },
      comments: [
        { 
          id: 1,
          user: 'Laura Martinez', 
          message: 'Maquettes Figma finalisées, en attente de validation technique', 
          date: '2024-01-14T10:15:00Z',
          avatar: 'LM'
        }
      ],
      attachments: ['maquettes.fig', 'specs_techniques.pdf'],
      timeSpent: '12h 45m'
    },
    {
      id: 'TICKET-005',
      title: 'Bug Interface Mobile - Menu Navigation',
      description: 'Le menu de navigation ne s\'affiche pas correctement sur les appareils mobiles iOS Safari. Problème de responsive design.',
      type: 'bug',
      service: 'Développement',
      status: 'en_attente',
      priority: 'moyenne',
      createdBy: 'Jean Dupont',
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
      assignedTo: null,
      dueDate: '2024-01-22T18:00:00Z',
      tags: ['mobile', 'ios', 'bug'],
      validations: {
        administratif: { status: 'en_attente', by: null, date: null },
        technique: { status: 'en_attente', by: null, date: null },
        rh: { status: 'non_requis', by: null, date: null }
      },
      comments: [],
      attachments: [],
      timeSpent: '0h'
    },
    {
      id: 'TICKET-006',
      title: 'Sécurité - Audit des permissions utilisateurs',
      description: 'Audit complet des permissions utilisateurs suite à des anomalies détectées dans le système d\'autorisation.',
      type: 'securite',
      service: 'Technique',
      status: 'en_cours',
      priority: 'critique',
      createdBy: 'Security Team',
      createdAt: '2024-01-14T16:00:00Z',
      updatedAt: '2024-01-15T11:20:00Z',
      assignedTo: 'Admin System',
      dueDate: '2024-01-18T18:00:00Z',
      tags: ['securité', 'audit', 'urgent'],
      validations: {
        administratif: { status: 'validé', by: 'Marie Martin', date: '2024-01-14T16:30:00Z' },
        technique: { status: 'en_cours', by: 'Pierre Lambert', date: null },
        rh: { status: 'non_requis', by: null, date: null }
      },
      comments: [
        { 
          id: 1,
          user: 'Security Team', 
          message: 'Début de l\'audit, premières anomalies identifiées', 
          date: '2024-01-14T16:15:00Z',
          avatar: 'ST'
        }
      ],
      attachments: ['rapport_audit.pdf'],
      timeSpent: '6h 00m'
    }
  ];

  const mockUsers = [
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@ifb.com', role: 'employé', avatar: 'JD', service: 'Commercial' },
    { id: 2, name: 'Marie Martin', email: 'marie.martin@ifb.com', role: 'admin', avatar: 'MM', service: 'Administratif' },
    { id: 3, name: 'Pierre Lambert', email: 'pierre.lambert@ifb.com', role: 'technicien', avatar: 'PL', service: 'Technique' },
    { id: 4, name: 'Sophie Bernard', email: 'sophie.bernard@ifb.com', role: 'rh', avatar: 'SB', service: 'Ressources Humaines' },
    { id: 5, name: 'Paul Durand', email: 'paul.durand@ifb.com', role: 'employé', avatar: 'PD', service: 'Développement' },
    { id: 6, name: 'Laura Martinez', email: 'laura.martinez@ifb.com', role: 'designer', avatar: 'LM', service: 'Design' }
  ];

  // Données mockées pour les équipes de communication
  const mockTeams = [
    {
      id: 1,
      name: 'Équipe Développement',
      members: ['Jean Dupont', 'Pierre Lambert', 'Laura Martinez'],
      avatar: '👨‍💻',
      color: '#3b82f6',
      messages: [
        {
          id: 1,
          user: 'Pierre Lambert',
          message: 'Bonjour à tous ! J\'ai déployé la nouvelle version de l\'API ce matin.',
          timestamp: '2024-01-15T09:30:00Z',
          avatar: 'PL'
        },
        {
          id: 2,
          user: 'Laura Martinez',
          message: 'Super ! J\'ai terminé les maquettes pour le nouveau tableau de bord.',
          timestamp: '2024-01-15T09:32:00Z',
          avatar: 'LM'
        },
        {
          id: 3,
          user: 'Jean Dupont',
          message: 'Je vais tester l\'intégration côté frontend cet après-midi.',
          timestamp: '2024-01-15T09:35:00Z',
          avatar: 'JD'
        }
      ]
    },
    {
      id: 2,
      name: 'Équipe Support',
      members: ['Sophie Bernard', 'Paul Durand'],
      avatar: '🔧',
      color: '#10b981',
      messages: [
        {
          id: 1,
          user: 'Sophie Bernard',
          message: 'Nous avons reçu plusieurs tickets concernant l\'interface mobile.',
          timestamp: '2024-01-15T10:00:00Z',
          avatar: 'SB'
        },
        {
          id: 2,
          user: 'Paul Durand',
          message: 'Je regarde ça immédiatement. C\'est probablement lié au responsive.',
          timestamp: '2024-01-15T10:05:00Z',
          avatar: 'PD'
        }
      ]
    },
    {
      id: 3,
      name: 'Équipe Direction',
      members: ['Marie Martin', 'Jean Dupont', 'Pierre Lambert'],
      avatar: '👔',
      color: '#8b5cf6',
      messages: [
        {
          id: 1,
          user: 'Marie Martin',
          message: 'Réunion stratégique demain à 10h pour discuter des objectifs trimestriels.',
          timestamp: '2024-01-15T08:00:00Z',
          avatar: 'MM'
        }
      ]
    },
    {
      id: 4,
      name: 'Équipe Projet IA',
      members: ['Pierre Lambert', 'Laura Martinez', 'Paul Durand'],
      avatar: '🤖',
      color: '#ec4899',
      messages: [
        {
          id: 1,
          user: 'Pierre Lambert',
          message: 'Les modèles d\'IA sont entraînés et prêts pour les tests.',
          timestamp: '2024-01-15T11:00:00Z',
          avatar: 'PL'
        },
        {
          id: 2,
          user: 'Laura Martinez',
          message: 'Je prépare l\'interface pour l\'intégration des résultats.',
          timestamp: '2024-01-15T11:15:00Z',
          avatar: 'LM'
        }
      ]
    }
  ];

  // Données pour le graphique d'activité
  const activityData = [
    { date: '2024-01-08', tickets: 12 },
    { date: '2024-01-09', tickets: 18 },
    { date: '2024-01-10', tickets: 15 },
    { date: '2024-01-11', tickets: 22 },
    { date: '2024-01-12', tickets: 19 },
    { date: '2024-01-13', tickets: 8 },
    { date: '2024-01-14', tickets: 11 },
    { date: '2024-01-15', tickets: 16 }
  ];

  // Services disponibles
  const services = ['Développement', 'Ressources Humaines', 'Administratif', 'Technique', 'Support', 'Design', 'Commercial'];
  
  // Types de tickets
  const ticketTypes = ['incident', 'evolution', 'maintenance', 'formation', 'support', 'bug', 'securite'];
  
  // Priorités
  const priorities = [
    { value: 'basse', label: 'Basse', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { value: 'moyenne', label: 'Moyenne', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'haute', label: 'Haute', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { value: 'critique', label: 'Critique', color: 'bg-red-100 text-red-700 border-red-300' }
  ];

  // Palettes de couleurs épurées
  const colorPalettes = [
    { 
      name: 'Bleu Épuré', 
      primary: '#3b82f6', 
      background: '#0f172a',
      textColor: '#f8fafc'
    },
    { 
      name: 'Gris Professionnel', 
      primary: '#6b7280', 
      background: '#111827',
      textColor: '#f9fafb'
    },
    { 
      name: 'Sombre Neutre', 
      primary: '#9ca3af', 
      background: '#1f2937',
      textColor: '#f9fafb'
    },
    { 
      name: 'Clair Professionnel', 
      primary: '#2563eb', 
      background: '#f9fafb',
      textColor: '#111827'
    }
  ];

  // Fonction pour changer le thème
  const changeTheme = (newPrimaryColor, newBackgroundColor) => {
    const isDark = newBackgroundColor !== '#f9fafb';
    const textColor = isDark ? '#f8fafc' : '#111827';
    
    setTheme({
      primary: newPrimaryColor,
      backgroundColor: newBackgroundColor,
      textColor: textColor,
      isDark: isDark
    });
  };

  // Chargement initial
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setTeams(mockTeams);
      setSelectedTeam(mockTeams[0]);
      setLoading(false);
    };
    
    loadTickets();
  }, []);

  // Effet pour la navigation fixe
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsNavFixed(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtrage des tickets
  useEffect(() => {
    let filtered = tickets;
    
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.tags && ticket.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }
    
    if (filterService !== 'all') {
      filtered = filtered.filter(ticket => ticket.service === filterService);
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }
    
    setFilteredTickets(filtered);
  }, [searchTerm, filterStatus, filterService, filterPriority, tickets]);

  // Statistiques
  const stats = {
    total: tickets.length,
    en_cours: tickets.filter(t => t.status === 'en_cours').length,
    validés: tickets.filter(t => t.status === 'validé').length,
    rejetés: tickets.filter(t => t.status === 'rejeté').length,
    en_attente: tickets.filter(t => t.status === 'en_attente').length,
    haute_priorite: tickets.filter(t => t.priority === 'haute' || t.priority === 'critique').length
  };

  // Fonctions de gestion
  const handleCreateTicket = (newTicket) => {
    const ticket = {
      ...newTicket,
      id: `TICKET-${String(tickets.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'en_attente',
      tags: [],
      validations: {
        administratif: { status: 'en_attente', by: null, date: null },
        technique: { status: 'en_attente', by: null, date: null },
        rh: { status: 'en_attente', by: null, date: null }
      },
      comments: [],
      attachments: [],
      timeSpent: '0h'
    };
    
    setTickets(prev => [...prev, ticket]);
    setShowCreateModal(false);
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    ));
    setSelectedTicket(null);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
  };

  const handleAddComment = (ticketId, comment) => {
    if (!comment.trim()) return;
    
    const newCommentObj = {
      id: Date.now(),
      user: 'Utilisateur Actuel',
      message: comment,
      date: new Date().toISOString(),
      avatar: 'UA'
    };
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            comments: [...ticket.comments, newCommentObj],
            updatedAt: new Date().toISOString()
          }
        : ticket
    ));
    
    setNewComment('');
  };

  const handleValidation = (ticketId, validationType, status) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? {
            ...ticket,
            validations: {
              ...ticket.validations,
              [validationType]: {
                status: status,
                by: 'Utilisateur Actuel',
                date: new Date().toISOString()
              }
            },
            updatedAt: new Date().toISOString()
          }
        : ticket
    ));
  };

  const handleAssignTicket = (ticketId, user) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            assignedTo: user.name,
            updatedAt: new Date().toISOString()
          }
        : ticket
    ));
  };

  const handleDeleteTicket = (ticketId) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    setSelectedTicket(null);
  };

  // Fonctions pour la communication
  const handleSendMessage = (teamId, message) => {
    if (!message.trim()) return;
    
    const newMessageObj = {
      id: Date.now(),
      user: 'Utilisateur Actuel',
      message: message,
      timestamp: new Date().toISOString(),
      avatar: 'UA'
    };
    
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            messages: [...team.messages, newMessageObj]
          }
        : team
    ));
    
    setNewMessage('');
  };

  // Composant pour le sélecteur de thème
  const ThemeSelector = () => (
    <div className="relative">
      <button
        onClick={() => setShowThemePicker(!showThemePicker)}
        className="flex items-center px-3 py-2 space-x-2 border rounded-md hover:bg-gray-50"
        style={{ 
          color: theme.textColor,
          borderColor: theme.isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db',
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'
        }}
      >
        <Palette className="w-4 h-4" />
        <span>Thème</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showThemePicker && (
        <div 
          className="absolute right-0 z-50 w-64 p-4 mt-2 border rounded-lg shadow-lg top-full"
          style={{ 
            backgroundColor: theme.isDark ? '#1f2937' : '#ffffff',
            borderColor: theme.isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
            color: theme.textColor
          }}
        >
          <h4 className="mb-3 font-medium">Choisir un thème</h4>
          <div className="grid grid-cols-2 gap-3">
            {colorPalettes.map((palette, index) => (
              <button
                key={index}
                onClick={() => {
                  changeTheme(palette.primary, palette.background);
                  setShowThemePicker(false);
                }}
                className="flex flex-col items-center p-3 border rounded-lg hover:border-gray-300"
                style={{ 
                  borderColor: theme.isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                }}
              >
                <div className="flex items-center justify-center w-8 h-8 mb-2 rounded-full" 
                  style={{ backgroundColor: palette.primary }}>
                  <div 
                    className="w-6 h-6 border-2 border-white rounded-full"
                    style={{ backgroundColor: palette.background }}
                  ></div>
                </div>
                <span className="text-xs" style={{ color: theme.textColor }}>{palette.name}</span>
              </button>
            ))}
          </div>
          
          <div className="pt-4 mt-4 border-t" style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb' }}>
            <h5 className="mb-2 text-sm font-medium">Personnalisé</h5>
            <div className="flex space-x-2">
              <input
                type="color"
                value={theme.primary}
                onChange={(e) => changeTheme(e.target.value, theme.backgroundColor)}
                className="w-8 h-8 border-0 rounded cursor-pointer"
              />
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => changeTheme(theme.primary, e.target.value)}
                className="w-8 h-8 border-0 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Composant pour l'affichage des statistiques épuré
  const DashboardStats = () => (
    <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
      <div 
        className="p-4 border rounded-lg"
        style={{ 
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">Total Tickets</p>
            <p className="text-xl font-bold" style={{ color: theme.textColor }}>{stats.total}</p>
          </div>
          <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-100'}`}>
            <Ticket className="w-5 h-5" style={{ color: theme.isDark ? '#3b82f6' : '#2563eb' }} />
          </div>
        </div>
      </div>
      
      <div 
        className="p-4 border rounded-lg"
        style={{ 
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">En Cours</p>
            <p className="text-xl font-bold" style={{ color: theme.isDark ? '#f59e0b' : '#ea580c' }}>{stats.en_cours}</p>
          </div>
          <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-100'}`}>
            <Clock className="w-5 h-5" style={{ color: theme.isDark ? '#f59e0b' : '#ea580c' }} />
          </div>
        </div>
      </div>
      
      <div 
        className="p-4 border rounded-lg"
        style={{ 
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">Validés</p>
            <p className="text-xl font-bold" style={{ color: theme.isDark ? '#10b981' : '#059669' }}>{stats.validés}</p>
          </div>
          <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-100'}`}>
            <CheckCircle className="w-5 h-5" style={{ color: theme.isDark ? '#10b981' : '#059669' }} />
          </div>
        </div>
      </div>
      
      <div 
        className="p-4 border rounded-lg"
        style={{ 
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">Haute Priorité</p>
            <p className="text-xl font-bold" style={{ color: theme.isDark ? '#ef4444' : '#dc2626' }}>{stats.haute_priorite}</p>
          </div>
          <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-100'}`}>
            <AlertCircle className="w-5 h-5" style={{ color: theme.isDark ? '#ef4444' : '#dc2626' }} />
          </div>
        </div>
      </div>
    </div>
  );

  // Composant pour le tableau Kanban avec design épuré
  const KanbanBoard = () => {
    const columns = [
      { 
        id: 'en_attente', 
        title: 'En Attente', 
        borderColor: theme.isDark ? 'border-yellow-500/30' : 'border-yellow-200',
        textColor: theme.isDark ? 'text-yellow-400' : 'text-yellow-800',
        bgColor: theme.isDark ? 'bg-yellow-500/5' : 'bg-yellow-50'
      },
      { 
        id: 'en_cours', 
        title: 'En Cours', 
        borderColor: theme.isDark ? 'border-blue-500/30' : 'border-blue-200',
        textColor: theme.isDark ? 'text-blue-400' : 'text-blue-800',
        bgColor: theme.isDark ? 'bg-blue-500/5' : 'bg-blue-50'
      },
      { 
        id: 'validé', 
        title: 'Validé', 
        borderColor: theme.isDark ? 'border-green-500/30' : 'border-green-200',
        textColor: theme.isDark ? 'text-green-400' : 'text-green-800',
        bgColor: theme.isDark ? 'bg-green-500/5' : 'bg-green-50'
      },
      { 
        id: 'rejeté', 
        title: 'Rejeté', 
        borderColor: theme.isDark ? 'border-red-500/30' : 'border-red-200',
        textColor: theme.isDark ? 'text-red-400' : 'text-red-800',
        bgColor: theme.isDark ? 'bg-red-500/5' : 'bg-red-50'
      }
    ];

    const handleDragStart = (e, ticketId) => {
      e.dataTransfer.setData('ticketId', ticketId);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e, status) => {
      e.preventDefault();
      const ticketId = e.dataTransfer.getData('ticketId');
      handleStatusChange(ticketId, status);
    };

    const getPriorityBadgeStyle = (priority) => {
      if (theme.isDark) {
        return {
          'critique': 'border border-red-500/50 text-red-400 bg-red-500/10',
          'haute': 'border border-orange-500/50 text-orange-400 bg-orange-500/10',
          'moyenne': 'border border-blue-500/50 text-blue-400 bg-blue-500/10',
          'basse': 'border border-gray-500/50 text-gray-400 bg-gray-500/10'
        }[priority];
      } else {
        return {
          'critique': 'bg-red-100 text-red-800 border border-red-300',
          'haute': 'bg-orange-100 text-orange-800 border border-orange-300',
          'moyenne': 'bg-blue-100 text-blue-800 border border-blue-300',
          'basse': 'bg-gray-100 text-gray-800 border border-gray-300'
        }[priority];
      }
    };

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {columns.map(column => (
          <div
            key={column.id}
            className={`p-4 rounded-lg border-2 ${column.borderColor} ${theme.isDark ? 'bg-gray-900/20' : column.bgColor}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <h3 className={`mb-4 font-semibold ${column.textColor}`}>
              {column.title} 
              <span 
                className="px-2 py-1 ml-2 text-sm rounded-full border"
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#ffffff',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                  color: theme.textColor
                }}
              >
                {filteredTickets.filter(t => t.status === column.id).length}
              </span>
            </h3>
            
            <div className="space-y-3">
              {filteredTickets
                .filter(ticket => ticket.status === column.id)
                .map(ticket => (
                  <div
                    key={ticket.id}
                    className="p-3 transition-all border rounded-lg cursor-move hover:shadow-md hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                      borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                      color: theme.textColor
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ticket.id)}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityBadgeStyle(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span 
                        className="text-xs opacity-60"
                      >
                        {ticket.id}
                      </span>
                    </div>
                    
                    <h4 
                      className="mb-2 font-medium text-sm"
                      style={{ color: theme.textColor }}
                    >
                      {ticket.title}
                    </h4>
                    <p 
                      className="text-xs line-clamp-2 opacity-70"
                    >
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t"
                      style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
                    >
                      <span 
                        className="text-xs opacity-60"
                      >
                        {ticket.service}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div 
                          className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full border"
                          style={{ 
                            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                            color: theme.textColor
                          }}
                        >
                          {ticket.createdBy.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Composant Graphique d'activité épuré
  const ActivityChart = () => {
    const maxTickets = Math.max(...activityData.map(d => d.tickets));
    
    return (
      <div 
        className="p-4 border rounded-lg"
        style={{ 
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
        }}
      >
        <h3 className="mb-4 text-lg font-semibold" style={{ color: theme.textColor }}>
          Activité des 7 derniers jours
        </h3>
        <div className="flex items-end justify-between h-48">
          {activityData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-6 rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${(day.tickets / maxTickets) * 160}px`,
                  backgroundColor: theme.isDark ? 'rgba(59, 130, 246, 0.3)' : theme.primary,
                  border: theme.isDark ? '1px solid rgba(59, 130, 246, 0.5)' : 'none',
                  minHeight: '4px'
                }}
                title={`${day.tickets} tickets`}
              ></div>
              <span 
                className="mt-2 text-xs opacity-60"
              >
                {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
              <span 
                className="text-sm font-semibold mt-1"
                style={{ color: theme.textColor }}
              >
                {day.tickets}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm opacity-60">
          <span>Total: {activityData.reduce((sum, day) => sum + day.tickets, 0)} tickets</span>
          <span>Moyenne: {Math.round(activityData.reduce((sum, day) => sum + day.tickets, 0) / activityData.length)}/jour</span>
        </div>
      </div>
    );
  };

  // Composant pour la communication
  const CommunicationTab = () => {
    const [searchTeam, setSearchTeam] = useState('');

    const filteredTeams = teams.filter(team =>
      team.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
      team.members.some(member => member.toLowerCase().includes(searchTeam.toLowerCase()))
    );

    const handleSendMessageToTeam = () => {
      if (selectedTeam && newMessage.trim()) {
        handleSendMessage(selectedTeam.id, newMessage);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>Communication d'Équipe</h2>
          <p style={{ color: theme.isDark ? '#9ca3af' : '#6b7280' }}>Discutez et collaborez avec vos équipes en temps réel</p>
        </div>

        <div className="flex h-[600px] border rounded-lg"
          style={{ 
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
          }}
        >
          {/* Liste des équipes */}
          <div className="w-1/3 border-r"
            style={{ 
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#f9fafb'
            }}
          >
            <div className="p-4 border-b"
              style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
            >
              <h2 className="text-lg font-semibold" style={{ color: theme.textColor }}>Équipes</h2>
              <div className="relative mt-3">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2" 
                  style={{ color: theme.isDark ? '#9ca3af' : '#9ca3af' }} 
                />
                <input
                  type="text"
                  placeholder="Rechercher une équipe..."
                  value={searchTeam}
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[500px]">
              {filteredTeams.map(team => (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedTeam?.id === team.id 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  style={{ 
                    borderColor: selectedTeam?.id === team.id 
                      ? theme.primary 
                      : (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'),
                    backgroundColor: selectedTeam?.id === team.id 
                      ? (theme.isDark ? 'rgba(59, 130, 246, 0.1)' : '#dbeafe')
                      : (theme.isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent')
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="flex items-center justify-center w-12 h-12 text-xl rounded-full border"
                      style={{ 
                        backgroundColor: team.color + '20', 
                        color: team.color,
                        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db'
                      }}
                    >
                      {team.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate" style={{ color: theme.textColor }}>
                        {team.name}
                      </h3>
                      <p className="text-sm truncate opacity-60">
                        {team.members.length} membres
                      </p>
                      {team.messages.length > 0 && (
                        <p className="text-xs truncate mt-1 opacity-60">
                          {team.messages[team.messages.length - 1].message}
                        </p>
                      )}
                    </div>
                    {team.messages.length > 0 && (
                      <span className="text-xs opacity-60">
                        {new Date(team.messages[team.messages.length - 1].timestamp).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedTeam ? (
              <>
                {/* En-tête du chat */}
                <div className="p-4 border-b flex items-center space-x-3"
                  style={{ 
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#f9fafb'
                  }}
                >
                  <div 
                    className="flex items-center justify-center w-10 h-10 text-lg rounded-full border"
                    style={{ 
                      backgroundColor: selectedTeam.color + '20', 
                      color: selectedTeam.color,
                      borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db'
                    }}
                  >
                    {selectedTeam.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: theme.textColor }}>{selectedTeam.name}</h3>
                    <p className="text-sm opacity-60">
                      {selectedTeam.members.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff' }}
                >
                  {selectedTeam.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex space-x-3 ${
                        message.user === 'Utilisateur Actuel' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div 
                        className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white rounded-full flex-shrink-0 border"
                        style={{ 
                          backgroundColor: message.user === 'Utilisateur Actuel' 
                            ? theme.primary 
                            : selectedTeam.color,
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        {message.avatar}
                      </div>
                      <div className={`max-w-xs lg:max-w-md ${
                        message.user === 'Utilisateur Actuel' ? 'text-right' : ''
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium" style={{ color: theme.textColor }}>
                            {message.user}
                          </span>
                          <span className="text-xs opacity-60">
                            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div 
                          className="p-3 rounded-lg border"
                          style={{
                            backgroundColor: message.user === 'Utilisateur Actuel'
                              ? theme.primary
                              : (theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6'),
                            color: message.user === 'Utilisateur Actuel' ? '#ffffff' : theme.textColor,
                            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                          }}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input de message */}
                <div className="p-4 border-t"
                  style={{ 
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#f9fafb'
                  }}
                >
                  <div className="flex space-x-2">
                    <div className="flex space-x-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Image className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessageToTeam()}
                      className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                        color: theme.textColor
                      }}
                    />
                    <div className="flex space-x-1">
                      <button className="p-2 rounded-lg hover:bg-gray-100 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSendMessageToTeam}
                        disabled={!newMessage.trim()}
                        className="p-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed border"
                        style={{ 
                          backgroundColor: theme.primary, 
                          color: '#ffffff',
                          borderColor: theme.primary
                        }}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-40" />
                  <h3 className="text-lg font-medium mb-2" style={{ color: theme.textColor }}>
                    Sélectionnez une équipe
                  </h3>
                  <p className="opacity-60">
                    Choisissez une équipe dans la liste pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Composant pour la liste des tickets
  const TicketList = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>Gestion des Tickets</h2>
        <p className="opacity-60">Consultez et gérez tous les tickets du système</p>
      </div>

      <div 
        className="border rounded-lg"
        style={{ 
          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
        }}
      >
        <div 
          className="px-6 py-4 border-b"
          style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.textColor }}>Liste des Tickets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb' }}>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase opacity-60">
                  Ticket
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase opacity-60">
                  Statut
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase opacity-60">
                  Priorité
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase opacity-60">
                  Service
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase opacity-60">
                  Assigné à
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase opacity-60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff' }}>
              {filteredTickets.map(ticket => (
                <tr 
                  key={ticket.id} 
                  className="hover:bg-gray-50 border-b"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                    color: theme.textColor,
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                  }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium" style={{ color: theme.textColor }}>
                        {ticket.title}
                      </div>
                      <div className="text-sm opacity-60">
                        {ticket.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                      ticket.status === 'validé' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                      ticket.status === 'rejeté' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      ticket.status === 'en_cours' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                      ticket.priority === 'critique' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      ticket.priority === 'haute' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      ticket.priority === 'moyenne' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/30'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: theme.textColor }}>
                    {ticket.service}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: theme.textColor }}>
                    {ticket.assignedTo || 'Non assigné'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowCreateModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Composant pour la validation
  const ValidationTab = () => {
    const pendingTickets = tickets.filter(ticket => 
      Object.values(ticket.validations).some(validation => validation.status === 'en_attente')
    );

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>Validation des Tickets</h2>
          <p className="opacity-60">Validez ou rejetez les tickets en attente de validation</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { 
              title: 'En Attente', 
              value: pendingTickets.length, 
              color: 'text-yellow-600', 
              icon: Clock,
              bgColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff'
            },
            { 
              title: 'Validés Aujourd\'hui', 
              value: tickets.filter(t => 
                Object.values(t.validations).some(v => 
                  v.date && new Date(v.date).toDateString() === new Date().toDateString() && v.status === 'validé'
                )
              ).length, 
              color: 'text-green-600', 
              icon: CheckCircle,
              bgColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff'
            },
            { 
              title: 'Rejetés Aujourd\'hui', 
              value: tickets.filter(t => 
                Object.values(t.validations).some(v => 
                  v.date && new Date(v.date).toDateString() === new Date().toDateString() && v.status === 'rejeté'
                )
              ).length, 
              color: 'text-red-600', 
              icon: XCircle,
              bgColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-6 border rounded-lg"
              style={{ 
                backgroundColor: stat.bgColor,
                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-60">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div 
          className="border rounded-lg"
          style={{ 
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
          }}
        >
          <div 
            className="px-6 py-4 border-b"
            style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
          >
            <h3 className="text-lg font-semibold" style={{ color: theme.textColor }}>Tickets en Attente de Validation</h3>
          </div>
          <div className="divide-y" style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
            {pendingTickets.map(ticket => (
              <div 
                key={ticket.id} 
                className="p-6 hover:bg-gray-50"
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                  color: theme.textColor
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3 space-x-3">
                      <h4 className="font-semibold" style={{ color: theme.textColor }}>{ticket.title}</h4>
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full border"
                        style={{ 
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#dbeafe',
                          color: theme.isDark ? '#93c5fd' : '#1e40af',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db'
                        }}
                      >
                        {ticket.id}
                      </span>
                    </div>
                    
                    <p className="mb-4 opacity-60">{ticket.description}</p>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {Object.entries(ticket.validations).map(([type, validation]) => (
                        validation.status === 'en_attente' && (
                          <div 
                            key={type} 
                            className="flex items-center justify-between p-3 rounded-lg border"
                            style={{ 
                              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
                              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                            }}
                          >
                            <span className="text-sm font-medium capitalize" style={{ color: theme.textColor }}>
                              {type}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleValidation(ticket.id, type, 'validé')}
                                className="px-3 py-1 text-xs text-green-700 bg-green-100 rounded-md hover:bg-green-200 border border-green-300"
                              >
                                Valider
                              </button>
                              <button
                                onClick={() => handleValidation(ticket.id, type, 'rejeté')}
                                className="px-3 py-1 text-xs text-red-700 bg-red-100 rounded-md hover:bg-red-200 border border-red-300"
                              >
                                Rejeter
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center ml-4 space-x-2">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="p-2 rounded-lg hover:bg-gray-100 border"
                      style={{ 
                        color: theme.isDark ? '#9ca3af' : '#9ca3af',
                        backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Composant pour l'affectation
  const AffectationTab = () => {
    const unassignedTickets = tickets.filter(ticket => !ticket.assignedTo);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>Affectation des Tickets</h2>
          <p className="opacity-60">Assignez les tickets non attribués aux membres de l'équipe</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div 
            className="border rounded-lg"
            style={{ 
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
            }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
            >
              <h3 className="text-lg font-semibold" style={{ color: theme.textColor }}>Tickets Non Assignés</h3>
              <p className="opacity-60">{unassignedTickets.length} tickets en attente</p>
            </div>
            <div className="divide-y" style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
              {unassignedTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className="p-4 hover:bg-gray-50"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                    color: theme.textColor
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="mb-1 font-medium" style={{ color: theme.textColor }}>{ticket.title}</h4>
                      <p className="mb-2 text-sm opacity-60">{ticket.service}</p>
                      <div className="flex items-center space-x-2 text-xs opacity-60">
                        <span>{ticket.id}</span>
                        <span>•</span>
                        <span>Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        onChange={(e) => {
                          const user = mockUsers.find(u => u.id === parseInt(e.target.value));
                          if (user) handleAssignTicket(ticket.id, user);
                        }}
                        className="px-2 py-1 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        style={{ 
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                          color: theme.textColor
                        }}
                      >
                        <option value="">Assigner à...</option>
                        {mockUsers.filter(user => user.role !== 'employé').map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.service})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-1 hover:text-gray-600 opacity-60"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="border rounded-lg"
            style={{ 
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
            }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
            >
              <h3 className="text-lg font-semibold" style={{ color: theme.textColor }}>Équipe</h3>
              <p className="opacity-60">{mockUsers.length} membres</p>
            </div>
            <div className="divide-y" style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
              {mockUsers.map(user => {
                const userTickets = tickets.filter(ticket => ticket.assignedTo === user.name);
                
                return (
                  <div 
                    key={user.id} 
                    className="p-4 hover:bg-gray-50"
                    style={{ 
                      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                      color: theme.textColor
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white rounded-full border"
                        style={{ 
                          backgroundColor: theme.primary,
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium" style={{ color: theme.textColor }}>{user.name}</h4>
                        <p className="opacity-60">{user.service} • {user.role}</p>
                        <div className="flex items-center mt-1 space-x-4 text-xs opacity-60">
                          <span>{userTickets.length} tickets</span>
                          <span>•</span>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour le reporting
  const ReportingTab = () => {
    const serviceData = services.map(service => ({
      name: service,
      value: tickets.filter(t => t.service === service).length
    }));

    const priorityData = priorities.map(priority => ({
      name: priority.label,
      value: tickets.filter(t => t.priority === priority.value).length
    }));

    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>Reporting & Analytics</h2>
            <p className="opacity-60">Analyses et statistiques détaillées sur les tickets</p>
          </div>
          <button 
            className="flex items-center px-4 py-2 space-x-2 border rounded-md hover:bg-gray-50"
            style={{ 
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
              color: theme.textColor
            }}
          >
            <Download className="w-4 h-4" />
            <span>Exporter Rapport</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityChart />

          <div 
            className="p-6 border rounded-lg"
            style={{ 
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
            }}
          >
            <h3 className="mb-4 text-lg font-semibold" style={{ color: theme.textColor }}>Répartition par Service</h3>
            <div className="space-y-3">
              {serviceData.map(service => (
                <div key={service.name} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: theme.textColor }}>{service.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium" style={{ color: theme.textColor }}>{service.value}</span>
                    <div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(service.value / Math.max(...serviceData.map(s => s.value))) * 100}%`,
                          backgroundColor: theme.primary
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div 
          className="p-6 border rounded-lg"
          style={{ 
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
          }}
        >
          <h3 className="mb-4 text-lg font-semibold" style={{ color: theme.textColor }}>Répartition par Priorité</h3>
          <div className="space-y-3">
            {priorityData.map(priority => (
              <div key={priority.name} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: theme.textColor }}>{priority.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium" style={{ color: theme.textColor }}>{priority.value}</span>
                  <div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(priority.value / Math.max(...priorityData.map(p => p.value))) * 100}%`,
                        backgroundColor: theme.primary
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Composant pour l'administration
  const AdministrationTab = () => {
    const [activeAdminTab, setActiveAdminTab] = useState('users');
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'employé', service: 'Commercial' });
    const [newService, setNewService] = useState('');

    const handleAddUser = () => {
      if (!newUser.name || !newUser.email) return;
      
      const user = {
        id: mockUsers.length + 1,
        ...newUser,
        avatar: newUser.name.split(' ').map(n => n[0]).join('')
      };
      
      // Dans une vraie application, on enverrait les données à l'API
      alert(`Utilisateur ${newUser.name} créé avec succès!`);
      setNewUser({ name: '', email: '', role: 'employé', service: 'Commercial' });
    };

    const handleAddService = () => {
      if (!newService.trim()) return;
      
      // Dans une vraie application, on enverrait les données à l'API
      alert(`Service ${newService} créé avec succès!`);
      setNewService('');
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>Administration</h2>
          <p className="opacity-60">Gérez les utilisateurs, services et paramètres de l'application</p>
        </div>

        <div 
          className="flex p-1 space-x-1 rounded-lg border"
          style={{ 
            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
          }}
        >
          {[
            { id: 'users', label: 'Utilisateurs' },
            { id: 'services', label: 'Services' },
            { id: 'types', label: 'Types de Tickets' },
            { id: 'settings', label: 'Paramètres' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors border ${
                activeAdminTab === tab.id
                  ? 'shadow-sm'
                  : 'hover:text-gray-900'
              }`}
              style={{ 
                backgroundColor: activeAdminTab === tab.id 
                  ? (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#ffffff')
                  : 'transparent',
                color: activeAdminTab === tab.id 
                  ? theme.primary 
                  : (theme.isDark ? '#9ca3af' : '#6b7280'),
                borderColor: activeAdminTab === tab.id 
                  ? theme.primary 
                  : 'transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeAdminTab === 'users' && (
          <div 
            className="border rounded-lg"
            style={{ 
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
            }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: theme.textColor }}>Gestion des Utilisateurs</h3>
                <button 
                  className="flex items-center px-4 py-2 space-x-2 text-white rounded-md hover:opacity-90"
                  style={{ backgroundColor: theme.primary }}
                  onClick={handleAddUser}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvel Utilisateur</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                >
                  <option value="employé">Employé</option>
                  <option value="technicien">Technicien</option>
                  <option value="admin">Administrateur</option>
                  <option value="rh">RH</option>
                </select>
                <select
                  value={newUser.service}
                  onChange={(e) => setNewUser({...newUser, service: e.target.value})}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                >
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
              {mockUsers.map(user => (
                <div 
                  key={user.id} 
                  className="p-6 hover:bg-gray-50"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                    color: theme.textColor
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="flex items-center justify-center w-12 h-12 text-sm font-medium text-white rounded-full border"
                        style={{ 
                          backgroundColor: theme.primary,
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: theme.textColor }}>{user.name}</h4>
                        <p className="opacity-60">{user.email}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full border"
                            style={{ 
                              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#dbeafe',
                              color: theme.isDark ? '#93c5fd' : '#1e40af',
                              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db'
                            }}
                          >
                            {user.role}
                          </span>
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full border"
                            style={{ 
                              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6',
                              color: theme.isDark ? '#9ca3af' : '#374151',
                              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db'
                            }}
                          >
                            {user.service}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 rounded-lg hover:bg-blue-50 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg hover:bg-red-50 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeAdminTab === 'services' && (
          <div 
            className="border rounded-lg"
            style={{ 
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
            }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: theme.textColor }}>Gestion des Services</h3>
                <button 
                  className="flex items-center px-4 py-2 space-x-2 text-white rounded-md hover:opacity-90"
                  style={{ backgroundColor: theme.primary }}
                  onClick={handleAddService}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Service</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Nom du nouveau service"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                />
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="p-6 hover:bg-gray-50"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
                    color: theme.textColor
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{service}</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 rounded-lg hover:bg-blue-50 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg hover:bg-red-50 border"
                        style={{ 
                          color: theme.isDark ? '#9ca3af' : '#9ca3af',
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeAdminTab === 'settings' && (
          <div 
            className="border rounded-lg"
            style={{ 
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
            }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}
            >
              <h3 className="text-lg font-semibold" style={{ color: theme.textColor }}>Paramètres Généraux</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium" style={{ color: theme.textColor }}>Notifications par email</h4>
                  <p className="opacity-60">Recevoir des notifications par email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium" style={{ color: theme.textColor }}>Délai de réponse maximum</h4>
                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                >
                  <option>24 heures</option>
                  <option>48 heures</option>
                  <option>72 heures</option>
                  <option>1 semaine</option>
                </select>
              </div>

              <div>
                <h4 className="mb-2 font-medium" style={{ color: theme.textColor }}>Workflow de validation</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span style={{ color: theme.textColor }}>Validation administrative requise</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span style={{ color: theme.textColor }}>Validation technique requise</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span style={{ color: theme.textColor }}>Validation RH requise</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Modal de création/édition de ticket
  const TicketModal = ({ ticket, onSave, onClose }) => {
    const [formData, setFormData] = useState(ticket || {
      title: '',
      description: '',
      type: 'incident',
      service: 'Développement',
      priority: 'moyenne'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div 
          className="rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border"
          style={{ 
            backgroundColor: theme.isDark ? '#1f2937' : '#ffffff',
            color: theme.textColor,
            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
          }}
        >
          <h2 className="mb-4 text-xl font-bold">
            {ticket ? 'Modifier le Ticket' : 'Créer un Nouveau Ticket'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.textColor }}>
                Titre du Ticket
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez brièvement le problème ou la demande..."
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                  color: theme.textColor
                }}
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.textColor }}>
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez en détail le problème, les étapes pour le reproduire, l'impact..."
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                  color: theme.textColor
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: theme.textColor }}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                >
                  {ticketTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: theme.textColor }}>
                  Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                >
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: theme.textColor }}>
                  Priorité
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                    color: theme.textColor
                  }}
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                  color: theme.textColor
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md hover:opacity-90"
                style={{ backgroundColor: theme.primary }}
              >
                {ticket ? 'Mettre à jour' : 'Créer le Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Composant de détail du ticket
  const TicketDetail = ({ ticket, onClose, onUpdate }) => {
    const [activeDetailTab, setActiveDetailTab] = useState('discussion');

    if (!ticket) return null;

    const handleSendComment = () => {
      if (!newComment.trim()) return;
      
      const newCommentObj = {
        id: Date.now(),
        user: 'Utilisateur Actuel',
        message: newComment,
        date: new Date().toISOString(),
        avatar: 'UA'
      };
      
      // Mettre à jour le ticket avec le nouveau commentaire
      const updatedTicket = {
        ...ticket,
        comments: [...ticket.comments, newCommentObj],
        updatedAt: new Date().toISOString()
      };
      
      // Mettre à jour l'état global
      setTickets(prev => prev.map(t => 
        t.id === ticket.id ? updatedTicket : t
      ));
      
      // Mettre à jour le ticket sélectionné pour voir immédiatement le commentaire
      setSelectedTicket(updatedTicket);
      
      // Vider le champ de commentaire
      setNewComment('');
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div 
          className="rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border"
          style={{ 
            backgroundColor: theme.isDark ? '#1f2937' : '#ffffff',
            color: theme.textColor,
            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: theme.textColor }}>{ticket.title}</h2>
              <p className="opacity-60">{ticket.id}</p>
            </div>
            <button
              onClick={onClose}
              className="hover:text-gray-600 opacity-60"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div 
                className="flex p-1 mb-6 space-x-1 rounded-lg border"
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                }}
              >
                {[
                  { id: 'discussion', label: 'Discussion' },
                  { id: 'details', label: 'Détails' },
                  { id: 'validation', label: 'Validation' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors border ${
                      activeDetailTab === tab.id
                        ? 'shadow-sm'
                        : 'hover:text-gray-900'
                    }`}
                    style={{ 
                      backgroundColor: activeDetailTab === tab.id 
                        ? (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#ffffff')
                        : 'transparent',
                      color: activeDetailTab === tab.id 
                        ? theme.primary 
                        : (theme.isDark ? '#9ca3af' : '#6b7280'),
                      borderColor: activeDetailTab === tab.id 
                        ? theme.primary 
                        : 'transparent'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeDetailTab === 'discussion' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {ticket.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div 
                            className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white rounded-full border"
                            style={{ 
                              backgroundColor: theme.primary,
                              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)'
                            }}
                          >
                            {comment.avatar}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div 
                            className="p-4 rounded-lg border"
                            style={{ 
                              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
                              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium" style={{ color: theme.textColor }}>{comment.user}</span>
                              <span className="text-sm opacity-60">
                                {new Date(comment.date).toLocaleString('fr-FR')}
                              </span>
                            </div>
                            <p style={{ color: theme.textColor }}>{comment.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div 
                          className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white rounded-full border"
                          style={{ 
                            backgroundColor: '#059669',
                            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          UA
                        </div>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          rows="3"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ 
                            backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                            color: theme.textColor
                          }}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button 
                              className="p-2 rounded-lg hover:bg-gray-100 border"
                              style={{ 
                                color: theme.isDark ? '#9ca3af' : '#9ca3af',
                                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'
                              }}
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={handleSendComment}
                            disabled={!newComment.trim()}
                            className="flex items-center px-4 py-2 space-x-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed border"
                            style={{ 
                              backgroundColor: theme.primary,
                              borderColor: theme.primary
                            }}
                          >
                            <Send className="w-4 h-4" />
                            <span>Envoyer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold" style={{ color: theme.textColor }}>Description</h3>
                    <p 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
                        color: theme.textColor,
                        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                      }}
                    >
                      {ticket.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="mb-2 font-medium" style={{ color: theme.textColor }}>Informations</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="opacity-60">Type:</span>
                          <span className="font-medium capitalize" style={{ color: theme.textColor }}>{ticket.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">Service:</span>
                          <span className="font-medium" style={{ color: theme.textColor }}>{ticket.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">Créé par:</span>
                          <span className="font-medium" style={{ color: theme.textColor }}>{ticket.createdBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">Date création:</span>
                          <span className="font-medium" style={{ color: theme.textColor }}>
                            {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="mb-2 font-medium" style={{ color: theme.textColor }}>Suivi</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="opacity-60">Temps passé:</span>
                          <span className="font-medium" style={{ color: theme.textColor }}>{ticket.timeSpent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">Date d'échéance:</span>
                          <span className="font-medium" style={{ color: theme.textColor }}>
                            {new Date(ticket.dueDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'validation' && (
                <div className="space-y-6">
                  <h3 className="font-semibold" style={{ color: theme.textColor }}>Processus de Validation</h3>
                  <div className="space-y-4">
                    {Object.entries(ticket.validations).map(([type, validation]) => (
                      <div 
                        key={type} 
                        className="flex items-center justify-between p-4 rounded-lg border"
                        style={{ 
                          backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
                          borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                        }}
                      >
                        <div>
                          <h4 className="font-medium capitalize" style={{ color: theme.textColor }}>{type}</h4>
                          {validation.by && (
                            <p className="opacity-60">Par {validation.by}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          {validation.status === 'en_attente' && (
                            <>
                              <button
                                onClick={() => handleValidation(ticket.id, type, 'validé')}
                                className="px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200 border border-green-300"
                              >
                                Valider
                              </button>
                              <button
                                onClick={() => handleValidation(ticket.id, type, 'rejeté')}
                                className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 border border-red-300"
                              >
                                Rejeter
                              </button>
                            </>
                          )}
                          {validation.status === 'validé' && (
                            <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full border border-green-300">
                              ✅ Validé
                            </span>
                          )}
                          {validation.status === 'rejeté' && (
                            <span className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full border border-red-300">
                              ❌ Rejeté
                            </span>
                          )}
                          {validation.status === 'non_requis' && (
                            <span className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full border border-gray-300">
                              ⏸️ Non requis
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                }}
              >
                <h3 className="mb-3 font-semibold" style={{ color: theme.textColor }}>Statut du Ticket</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="opacity-60">Statut:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      ticket.status === 'en_attente' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                      ticket.status === 'en_cours' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      ticket.status === 'validé' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                      'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="opacity-60">Priorité:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      ticket.priority === 'basse' ? 'bg-gray-500/10 text-gray-400 border-gray-500/30' :
                      ticket.priority === 'moyenne' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      ticket.priority === 'haute' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="opacity-60">Assigné à:</span>
                    <span className="text-sm font-medium" style={{ color: theme.textColor }}>
                      {ticket.assignedTo || 'Non assigné'}
                    </span>
                  </div>
                </div>
              </div>

              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
                }}
              >
                <h3 className="mb-3 font-semibold" style={{ color: theme.textColor }}>Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onUpdate(ticket);
                      onClose();
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 border border-blue-300"
                  >
                    Modifier le ticket
                  </button>
                  <select
                    onChange={(e) => {
                      const user = mockUsers.find(u => u.id === parseInt(e.target.value));
                      if (user) handleAssignTicket(ticket.id, user);
                    }}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    style={{ 
                      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                      borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                      color: theme.textColor
                    }}
                  >
                    <option value="">Assigner à un agent...</option>
                    {mockUsers.filter(user => user.role !== 'employé').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.service})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div 
              className="w-8 h-8 border-4 rounded-full border-t-blue-600 animate-spin"
              style={{ 
                borderColor: theme.primary + '20',
                borderTopColor: theme.primary
              }}
            ></div>
          </div>
          <p className="font-medium" style={{ color: theme.textColor }}>Chargement d'IFB Ticketing...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      {/* Header */}
      <header 
        className={`border-b shadow-sm transition-all duration-300 ${
          isNavFixed ? 'fixed top-0 left-0 right-0 z-40' : 'relative'
        }`}
        style={{ 
          backgroundColor: theme.isDark ? theme.backgroundColor : '#ffffff',
          borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
        }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 mr-2 rounded-md lg:hidden hover:bg-gray-100"
                style={{ 
                  color: theme.isDark ? '#9ca3af' : '#9ca3af',
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'transparent'
                }}
              >
                <Menu className="w-6 h-6" />
              </button>
              <img className="w-20 h-12" src={logos} alt="Logo"/>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              
              <button 
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ 
                  color: theme.isDark ? '#9ca3af' : '#9ca3af',
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'transparent'
                }}
              >
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <div 
                    className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white rounded-full border"
                    style={{ 
                      backgroundColor: theme.primary,
                      borderColor: theme.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'
                    }}
                  >
                    AD
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: theme.isDark ? '#9ca3af' : '#9ca3af' }} />
                </button>
                
                {profileMenuOpen && (
                  <div 
                    className="absolute right-0 z-50 w-48 mt-2 border rounded-lg shadow-lg top-full"
                    style={{ 
                      backgroundColor: theme.isDark ? '#1f2937' : '#ffffff',
                      borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
                    }}
                  >
                    <div 
                      className="p-4 border-b"
                      style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
                    >
                      <p className="text-sm font-medium" style={{ color: theme.textColor }}>Admin User</p>
                      <p className="opacity-60">admin@ifb.com</p>
                    </div>
                    <div className="p-2">
                      <button 
                        className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        style={{ 
                          color: theme.textColor,
                          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mon Profil
                      </button>
                      <button 
                        className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        style={{ 
                          color: theme.textColor,
                          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres
                      </button>
                      <button 
                        className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                        style={{ 
                          color: theme.textColor,
                          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }}
                      >
                        <LifeBuoy className="w-4 h-4 mr-2" />
                        Support
                      </button>
                    </div>
                    <div 
                      className="p-2 border-t"
                      style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
                    >
                      <button 
                        className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50"
                        style={{ 
                          color: '#dc2626',
                          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Espace lorsque la nav est fixe */}
      {isNavFixed && <div className="h-16"></div>}

      {/* Navigation mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div 
            className="px-2 pt-2 pb-3 space-y-1 border-b shadow-sm"
            style={{ 
              backgroundColor: theme.isDark ? '#1f2937' : '#ffffff',
              borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
            }}
          >
            {[
              { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
              { id: 'tickets', label: 'Tickets', icon: Ticket },
              { id: 'validation', label: 'Validation', icon: CheckCircle },
              { id: 'affectation', label: 'Affectation', icon: Users },
              { id: 'reporting', label: 'Reporting', icon: Download },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
              { id: 'administration', label: 'Administration', icon: Settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === item.id
                    ? 'text-blue-700'
                    : 'hover:text-gray-900'
                }`}
                style={{ 
                  backgroundColor: activeTab === item.id 
                    ? (theme.isDark ? 'rgba(255,255,255,0.1)' : '#dbeafe') 
                    : 'transparent',
                  color: activeTab === item.id 
                    ? theme.primary 
                    : (theme.isDark ? '#9ca3af' : '#6b7280')
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation desktop */}
      <nav 
        className={`hidden shadow-sm lg:block transition-all duration-300 ${
          isNavFixed ? 'fixed top-16 left-0 right-0 z-30' : 'relative'
        }`}
        style={{ 
          backgroundColor: theme.isDark ? theme.backgroundColor : '#ffffff',
          color: theme.textColor
        }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
              { id: 'tickets', label: 'Tickets', icon: Ticket },
              { id: 'validation', label: 'Validation', icon: CheckCircle },
              { id: 'affectation', label: 'Affectation', icon: Users },
              { id: 'reporting', label: 'Reporting', icon: Download },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
              { id: 'administration', label: 'Administration', icon: Settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === item.id
                    ? 'text-blue-600'
                    : 'hover:text-gray-700'
                }`}
                style={{ 
                  borderBottomColor: activeTab === item.id ? theme.primary : 'transparent',
                  color: activeTab === item.id 
                    ? theme.primary 
                    : (theme.isDark ? '#9ca3af' : '#6b7280')
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Espace supplémentaire quand la navigation est fixe */}
      {isNavFixed && <div className="hidden h-12 lg:block"></div>}

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Barre d'outils */}
        <div className="flex flex-col mb-6 space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 opacity-60" />
              <input
                type="text"
                placeholder="Rechercher un ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                  color: theme.textColor
                }}
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                color: theme.textColor
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="validé">Validé</option>
              <option value="rejeté">Rejeté</option>
            </select>
            
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                color: theme.textColor
              }}
            >
              <option value="all">Tous les services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                color: theme.textColor
              }}
            >
              <option value="all">Toutes priorités</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 space-x-2 text-white rounded-md hover:opacity-90"
              style={{ backgroundColor: theme.primary }}
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Ticket</span>
            </button>
            
            <button 
              className="flex items-center px-4 py-2 space-x-2 border rounded-md hover:bg-gray-50"
              style={{ 
                backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.2)' : '#d1d5db',
                color: theme.textColor
              }}
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'dashboard' && (
          <>
            <DashboardStats />
            <KanbanBoard />
          </>
        )}

        {activeTab === 'tickets' && <TicketList />}
        {activeTab === 'validation' && <ValidationTab />}
        {activeTab === 'affectation' && <AffectationTab />}
        {activeTab === 'reporting' && <ReportingTab />}
        {activeTab === 'communication' && <CommunicationTab />}
        {activeTab === 'administration' && <AdministrationTab />}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <TicketModal
          ticket={selectedTicket}
          onSave={selectedTicket ? handleUpdateTicket : handleCreateTicket}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTicket(null);
          }}
        />
      )}

      {selectedTicket && !showCreateModal && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={(ticket) => {
            setSelectedTicket(ticket);
            setShowCreateModal(true);
          }}
        />
      )}
    </div>
  );
};

export default IFBTicketing;