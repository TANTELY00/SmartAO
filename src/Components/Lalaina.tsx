import React, { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  Search, Bell, Calendar, Bookmark, Settings, LogOut, 
  Filter, MapPin, Briefcase, DollarSign, Clock,
  ChevronDown, ChevronUp, Send, X,
  BarChart3, User, Plus,
  CheckCircle, Clock as ClockIcon, Crown,
  MessageSquare, Sparkles,
  RefreshCw,
  Wifi,
  WifiOff,
  CreditCard,
  Save,
  Eye
} from 'lucide-react';

// Types pour les données
interface JobOffer {
  id: number;
  titre: string;
  lien: string;
  datePublication: string;
  organisme: string;
  description: string;
  dateLimite: string;
  categorie: string;
  dateExtraction: string;
  source: string;
  type: string;
  location?: string;
  salary?: string;
  typeContrat?: string;
  experience?: string;
  skills?: string[];
  logo?: string;
  status: 'available' | 'applied' | 'saved';
  subscriptionRequired: 'gratuit' | 'basic' | 'premium';
  applicationDate?: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limitations?: string[];
  popular?: boolean;
}

interface Stats {
  totalOffers: number;
  appliedOffers: number;
  savedOffers: number;
  responseRate: string;
  newToday: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  type: 'interview' | 'followup' | 'event' | 'deadline';
  company?: string;
  job?: string;
  location?: string;
  description?: string;
}

interface User {
  name: string;
  email: string;
  profileCompletion: number;
  subscription: 'gratuit' | 'basic' | 'premium';
  subscriptionEnd: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  type: 'new_offer' | 'application_update' | 'deadline_reminder';
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Types pour les données n8n
interface N8nJobData {
  annonces_completes?: Array<{
    titre?: string;
    lien?: string;
    datePublication?: string;
    organisme?: string;
    description?: string;
    dateLimite?: string;
    categorie?: string;
    dateExtraction?: string;
    source?: string;
    type?: string;
    location?: string;
    salary?: string;
    typeContrat?: string;
    experience?: string;
    skills?: string | number | string[] | number[];
    logo?: string;
  }>;
}

// Types pour les formulaires
interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
}

interface SubscriptionForm {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface AddJobOfferForm {
  titre: string;
  organisme: string;
  location: string;
  salary: string;
  typeContrat: string;
  experience: string;
  description: string;
  skills: string[];
  dateLimite: string;
  file?: File;
}

interface AddEventForm {
  title: string;
  date: string;
  time: string;
  type: 'interview' | 'followup' | 'event' | 'deadline';
  company?: string;
  job?: string;
  location?: string;
  description?: string;
}

// Données simulées pour les offres d'emploi
const mockJobOffers: JobOffer[] = [
  {
    id: 1,
    titre: "Développeur Fullstack React/Node.js",
    lien: "https://example.com/offer/1",
    datePublication: "2023-10-15",
    organisme: "TechCorp",
    description: "Nous recherchons un développeur fullstack expérimenté pour rejoindre notre équipe technique. Vous travaillerez sur des projets innovants avec les dernières technologies.",
    dateLimite: "2023-11-15",
    categorie: "Développement",
    dateExtraction: "2023-10-15T10:00:00Z",
    source: "LinkedIn",
    type: "Privé",
    location: "Paris, France",
    salary: "45k-60k €",
    typeContrat: "CDI",
    experience: "3-5 ans",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    logo: "TC",
    status: "available",
    subscriptionRequired: "premium"
  },
  {
    id: 2,
    titre: "Data Scientist",
    lien: "https://example.com/offer/2",
    datePublication: "2023-10-14",
    organisme: "DataInsights",
    description: "Rejoignez notre équipe data pour développer des modèles prédictifs et des solutions d'IA pour nos clients.",
    dateLimite: "2023-11-10",
    categorie: "Data Science",
    dateExtraction: "2023-10-14T09:30:00Z",
    source: "Indeed",
    type: "Privé",
    location: "Lyon, France",
    salary: "50k-65k €",
    typeContrat: "CDI",
    experience: "2-4 ans",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    logo: "DI",
    status: "applied",
    applicationDate: "2023-10-16",
    subscriptionRequired: "basic"
  },
  {
    id: 3,
    titre: "DevOps Engineer",
    lien: "https://example.com/offer/3",
    datePublication: "2023-10-16",
    organisme: "CloudSolutions",
    description: "Nous cherchons un ingénieur DevOps pour optimiser notre infrastructure cloud et nos pipelines de déploiement.",
    dateLimite: "2023-11-20",
    categorie: "DevOps",
    dateExtraction: "2023-10-16T14:15:00Z",
    source: "Welcome to the Jungle",
    type: "Privé",
    location: "Toulouse, France",
    salary: "55k-70k €",
    typeContrat: "CDI",
    experience: "4-6 ans",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    logo: "CS",
    status: "available",
    subscriptionRequired: "premium"
  },
  {
    id: 4,
    titre: "Frontend Developer",
    lien: "https://example.com/offer/4",
    datePublication: "2023-10-13",
    organisme: "WebInnovation",
    description: "Rejoignez notre équipe frontend pour créer des interfaces utilisateur modernes et réactives.",
    dateLimite: "2023-11-05",
    categorie: "Développement",
    dateExtraction: "2023-10-13T11:20:00Z",
    source: "LinkedIn",
    type: "Privé",
    location: "Remote",
    salary: "40k-55k €",
    typeContrat: "CDI",
    experience: "2-3 ans",
    skills: ["React", "TypeScript", "CSS", "Next.js"],
    logo: "WI",
    status: "saved",
    subscriptionRequired: "gratuit"
  }
];

// Plans d'abonnement
const subscriptionPlans: SubscriptionPlan[] = [
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

// Données simulées pour les événements de l'agenda
const mockEvents: Event[] = [
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
    title: "Deadline WebInnovation",
    date: "2023-11-05T23:59:00",
    type: "deadline",
    company: "WebInnovation",
    job: "Frontend Developer"
  }
];

// Props pour les composants
interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

interface JobCardProps {
  offer: JobOffer;
  view: 'grid' | 'list';
  onApply: (offer: JobOffer) => void;
  onSave: (offer: JobOffer) => void;
  onView?: (offer: JobOffer) => void;
}

interface DashboardTabProps {
  stats: Stats;
  events: Event[];
  offers: JobOffer[];
  user: User;
  isOnline: boolean;
  onViewAllOffers: () => void;
  onViewOffer: (offer: JobOffer) => void;
  onAddEvent: (event: Event) => void;
}

interface JobsTabProps {
  offers: JobOffer[];
  user: User;
  onRefresh: (query?: string, useCache?: boolean) => void;
  loading: boolean;
  refreshCount: number;
  lastUpdate: string;
  isOnline: boolean;
  n8nStatus: 'connected' | 'error' | 'checking';
  onApply: (offer: JobOffer) => void;
  onSave: (offer: JobOffer) => void;
  onAddJobOffer: (offer: JobOffer) => void;
}

interface ApplicationsTabProps {
  offers: JobOffer[];
}

interface SavedTabProps {
  offers: JobOffer[];
  user: User;
  onApply: (offer: JobOffer) => void;
  onRemove: (offer: JobOffer) => void;
}

interface CalendarTabProps {
  events: Event[];
  savedOffers: JobOffer[];
  onAddEvent: (event: Event) => void;
}

interface SubscriptionTabProps {
  user: User;
  plans: SubscriptionPlan[];
  onSubscribe: (planId: string) => void;
}

interface SettingsTabProps {
  user: User;
  onUpdateProfile: (user: User) => void;
}

interface AIAssistantProps {
  onClose: () => void;
}

// Composants modals
interface ConfirmApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  offer: JobOffer | null;
}

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ApplicationForm) => void;
  offer: JobOffer | null;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: SubscriptionForm) => void;
  plan: SubscriptionPlan | null;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (user: User) => void;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Event) => void;
  selectedDate?: Date;
}

interface AddJobOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (offer: JobOffer) => void;
}

interface ViewOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: JobOffer | null;
  onApply: (offer: JobOffer) => void;
  onSave: (offer: JobOffer) => void;
}

// Service pour appeler n8n avec gestion complète des erreurs
class N8nService {
  private static readonly N8N_WEBHOOK_URL = '/api';
  private static readonly N8N_EMAIL_WEBHOOK_URL = 'http://localhost:5678/webhook/email';
  private static cache: { data: JobOffer[]; timestamp: number; source: 'n8n' | 'mock' } | null = null;
  private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private static readonly SCRAPING_TIMEOUT = 5 * 60 * 1000; // 5 minutes en millisecondes

  static async scrapeJobOffers(query?: string, useCache: boolean = true): Promise<{data: JobOffer[]; source: 'n8n' | 'cache' | 'mock'}> {
    if (useCache && this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      console.log('📦 Utilisation des données en cache');
      return { data: this.cache.data, source: 'cache' };
    }

    try {
      console.log('🔄 Tentative de scraping n8n...');
      const result = await this.scrapeWithTimeout(query, this.SCRAPING_TIMEOUT);
      
      this.cache = {
        data: result,
        timestamp: Date.now(),
        source: 'n8n'
      };
      
      console.log('✅ Scraping n8n réussi et données mises en cache');
      return { data: result, source: 'n8n' };
    } catch (error) {
      console.warn('❌ Scraping n8n échoué:', error);
      
      if (this.cache) {
        console.log('📦 Retour au cache en fallback');
        return { data: this.cache.data, source: 'cache' };
      }

      console.log('🎭 Utilisation des données mockées');
      this.cache = {
        data: mockJobOffers,
        timestamp: Date.now(),
        source: 'mock'
      };
      
      return { data: mockJobOffers, source: 'mock' };
    }
  }

  private static async scrapeWithTimeout(query?: string, timeoutMs: number = this.SCRAPING_TIMEOUT): Promise<JobOffer[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`⏰ Timeout après ${timeoutMs/1000} secondes`);
      controller.abort();
    }, timeoutMs);

    try {
      console.log('📡 Envoi de la requête de scraping à:', this.N8N_WEBHOOK_URL);
      console.log(`⏱️  Timeout configuré à ${timeoutMs/1000} secondes`);
      
      const response = await fetch(this.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'scrape_jobs',
          query: query || '',
          timestamp: new Date().toISOString(),
          timeout: timeoutMs
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: N8nJobData = await response.json();
      console.log('✅ Données n8n reçues avec succès:', data);
      
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Réponse vide du serveur n8n');
      }
      
      return this.validateAndTransformJobData(data);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Timeout: Le scraping a dépassé ${timeoutMs/1000} secondes`);
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Impossible de contacter le serveur n8n. Vérifiez que n8n est démarré sur le port 5678.');
        }
        throw error;
      }
      throw new Error('Erreur inconnue lors du scraping');
    }
  }

  private static validateAndTransformJobData(data: N8nJobData): JobOffer[] {
    console.log('🔍 Traitement des données n8n:', data);
    
    if (!data || typeof data !== 'object') {
      console.warn('❌ Format de données invalide depuis n8n, utilisation des données mockées');
      return mockJobOffers;
    }

    if (data.annonces_completes && Array.isArray(data.annonces_completes)) {
      console.log(`📊 ${data.annonces_completes.length} offres reçues de n8n`);
      
      if (data.annonces_completes.length === 0) {
        console.warn('⚠️ Tableau d\'offres vide reçu de n8n, utilisation des données mockées');
        return mockJobOffers;
      }

      const transformedJobs = data.annonces_completes.map((job, index: number) => {
        console.log(`🔄 Transformation de l'offre ${index + 1}:`, job);
        
        let skillsArray: string[] = [];
        
        if (Array.isArray(job.skills)) {
          skillsArray = job.skills.map(skill => String(skill));
        } else if (typeof job.skills === 'string') {
          skillsArray = job.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
        } else if (typeof job.skills === 'number') {
          skillsArray = [String(job.skills)];
        } else if (job.skills) {
          skillsArray = [String(job.skills)];
        } else {
          skillsArray = ['Compétences non spécifiées'];
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const jobOffer: JobOffer = {
          id: index + 1,
          titre: job.titre || 'Titre non spécifié',
          lien: job.lien || 'Lien non disponible',
          datePublication: job.datePublication || currentDate,
          organisme: job.organisme || 'Organisme non spécifié',
          description: job.description || 'Aucune description disponible',
          dateLimite: job.dateLimite || defaultDeadline,
          categorie: job.categorie || 'Non spécifié',
          dateExtraction: job.dateExtraction || new Date().toISOString(),
          source: job.source || 'n8n',
          type: job.type || 'Gouvernement | ONG | Privé | Public',
          location: job.location || 'Localisation non spécifiée',
          salary: job.salary || 'Non spécifié',
          typeContrat: job.typeContrat || 'CDI',
          experience: job.experience || 'Non spécifié',
          skills: skillsArray,
          logo: job.organisme ? job.organisme.substring(0, 2).toUpperCase() : 'JD',
          status: 'available',
          subscriptionRequired: 'gratuit'
        };

        console.log(`✅ Offre ${index + 1} transformée:`, jobOffer);
        return jobOffer;
      });

      console.log(`🎉 ${transformedJobs.length} offres transformées avec succès`);
      return transformedJobs;
    }

    console.warn('⚠️ Aucune donnée valide reçue de n8n, utilisation des données mockées');
    return mockJobOffers;
  }

  static async forceRefresh(query?: string): Promise<{data: JobOffer[]; source: 'n8n' | 'cache' | 'mock'}> {
    console.log('🔄 Forcer le rafraîchissement des données');
    return this.scrapeJobOffers(query, false);
  }

  static clearCache(): void {
    this.cache = null;
    console.log('🗑️ Cache vidé');
  }

  static getCacheInfo(): { hasCache: boolean; timestamp: number | null; source: 'n8n' | 'mock' | null } {
    return {
      hasCache: this.cache !== null,
      timestamp: this.cache?.timestamp || null,
      source: this.cache?.source || null
    };
  }

  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.N8N_WEBHOOK_URL, {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Test de connexion échoué:', error);
      return false;
    }
  }

  // Nouvelle méthode pour envoyer les candidatures par email via n8n
  static async sendApplicationEmail(applicationData: {
    jobOffer: JobOffer;
    userData: ApplicationForm;
    userProfile: User;
  }): Promise<boolean> {
    try {
      console.log('📧 Envoi de la candidature par email via n8n...');
      
      const emailData = {
        action: 'send_application',
        timestamp: new Date().toISOString(),
        application: {
          candidate: {
            fullName: applicationData.userData.fullName,
            email: applicationData.userData.email,
            phone: applicationData.userData.phone,
            profileCompletion: applicationData.userProfile.profileCompletion,
            subscription: applicationData.userProfile.subscription
          },
          job: {
            title: applicationData.jobOffer.titre,
            company: applicationData.jobOffer.organisme,
            location: applicationData.jobOffer.location,
            contractType: applicationData.jobOffer.typeContrat,
            salary: applicationData.jobOffer.salary,
            experience: applicationData.jobOffer.experience,
            deadline: applicationData.jobOffer.dateLimite,
            description: applicationData.jobOffer.description.substring(0, 500) + '...',
            skills: applicationData.jobOffer.skills,
            source: applicationData.jobOffer.source,
            link: applicationData.jobOffer.lien
          },
          application: {
            coverLetter: applicationData.userData.coverLetter.substring(0, 1000) + (applicationData.userData.coverLetter.length > 1000 ? '...' : ''),
            resumeFileName: applicationData.userData.resume?.name || 'Non fourni',
            applicationDate: new Date().toISOString()
          }
        }
      };

      console.log('📤 Données envoyées au webhook email:', emailData);

      const response = await fetch(this.N8N_EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Candidature envoyée avec succès via n8n:', result);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la candidature par email:', error);
      
      // En mode développement, on simule un envoi réussi même si le serveur n'est pas disponible
      // Correction : utilisation d'une vérification différente pour éviter l'erreur process
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        console.warn('⚠️ Mode développement: simulation d\'envoi réussi');
        return true;
      }
      
      return false;
    }
  }
}

// Composants Modals
const ConfirmApplyModal: React.FC<ConfirmApplyModalProps> = ({ isOpen, onClose, onConfirm, offer }) => {
  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Confirmer la candidature</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900">{offer.titre}</h4>
            <p className="text-sm text-gray-600">{offer.organisme} • {offer.location}</p>
            <p className="mt-2 text-sm text-gray-700">{offer.description.substring(0, 150)}...</p>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Prêt à postuler ?</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end px-6 py-4 space-x-3 rounded-b-lg bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({ isOpen, onClose, onSubmit, offer }) => {
  const [formData, setFormData] = useState<ApplicationForm>({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Postuler à l'offre</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">{offer.titre} - {offer.organisme}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Nom complet *
              </label>
              <input
                type="text"
                id="fullName"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                CV *
              </label>
              <input
                type="file"
                id="resume"
                required
                accept=".pdf,.doc,.docx"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                Lettre de motivation *
              </label>
              <textarea
                id="coverLetter"
                required
                rows={4}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.coverLetter}
                onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Postuler'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubmit, plan }) => {
  const [formData, setFormData] = useState<SubscriptionForm>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données de paiement:', formData);
    onSubmit(formData);
    onClose();
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Souscrire à {plan.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">{plan.price === 0 ? 'Gratuit' : `${plan.price}€/mois`}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Numéro de carte
              </label>
              <div className="relative mt-1">
                <CreditCard className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                Titulaire de la carte
              </label>
              <input
                type="text"
                id="cardHolder"
                placeholder="JEAN DUPONT"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.cardHolder}
                onChange={(e) => setFormData(prev => ({ ...prev, cardHolder: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  placeholder="MM/AA"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="123"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.cvv}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Confirmer l'abonnement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState<User>(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Modifier le profil</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, notifications, onMarkAsRead }) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_offer':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'application_update':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'deadline_reminder':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
      <div className="overflow-y-auto bg-white rounded-lg shadow-xl w-80 max-h-96">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto text-gray-300" />
            <p className="mt-2 text-sm">Aucune notification</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSubmit, selectedDate }) => {
  const [formData, setFormData] = useState<AddEventForm>({
    title: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'event',
    company: '',
    job: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const event: Event = {
      id: Date.now(),
      title: formData.title,
      date: `${formData.date}T${formData.time}:00`,
      type: formData.type,
      company: formData.company || undefined,
      job: formData.job || undefined,
      location: formData.location || undefined,
      description: formData.description || undefined
    };
    onSubmit(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Ajouter un événement</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre de l'événement *
              </label>
              <input
                type="text"
                id="title"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Heure *
                </label>
                <input
                  type="time"
                  id="time"
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type d'événement *
              </label>
              <select
                id="type"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'interview' | 'followup' | 'event' | 'deadline' }))}
              >
                <option value="interview">Entretien</option>
                <option value="followup">Relance</option>
                <option value="event">Événement</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Entreprise
              </label>
              <input
                type="text"
                id="company"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="job" className="block text-sm font-medium text-gray-700">
                Poste concerné
              </label>
              <input
                type="text"
                id="job"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.job}
                onChange={(e) => setFormData(prev => ({ ...prev, job: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Lieu
              </label>
              <input
                type="text"
                id="location"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Ajouter l'événement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddJobOfferModal: React.FC<AddJobOfferModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<AddJobOfferForm>({
    titre: '',
    organisme: '',
    location: '',
    salary: '',
    typeContrat: 'CDI',
    experience: '',
    description: '',
    skills: [],
    dateLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    file: undefined
  });

  const [currentSkill, setCurrentSkill] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobOffer: JobOffer = {
      id: Date.now(),
      titre: formData.titre,
      lien: `https://example.com/offer/${Date.now()}`,
      datePublication: new Date().toISOString().split('T')[0],
      organisme: formData.organisme,
      description: formData.description,
      dateLimite: formData.dateLimite,
      categorie: "Personnalisée",
      dateExtraction: new Date().toISOString(),
      source: "Utilisateur",
      type: "Privé",
      location: formData.location,
      salary: formData.salary,
      typeContrat: formData.typeContrat,
      experience: formData.experience,
      skills: formData.skills,
      logo: formData.organisme ? formData.organisme.substring(0, 2).toUpperCase() : 'JD',
      status: 'available',
      subscriptionRequired: 'gratuit'
    };
    onSubmit(jobOffer);
    onClose();
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Ajouter une offre d'emploi</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
                Titre du poste *
              </label>
              <input
                type="text"
                id="titre"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.titre}
                onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="organisme" className="block text-sm font-medium text-gray-700">
                Organisme *
              </label>
              <input
                type="text"
                id="organisme"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.organisme}
                onChange={(e) => setFormData(prev => ({ ...prev, organisme: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Localisation *
              </label>
              <input
                type="text"
                id="location"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salaire
              </label>
              <input
                type="text"
                id="salary"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="45k-60k €"
              />
            </div>
            
            <div>
              <label htmlFor="typeContrat" className="block text-sm font-medium text-gray-700">
                Type de contrat *
              </label>
              <select
                id="typeContrat"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.typeContrat}
                onChange={(e) => setFormData(prev => ({ ...prev, typeContrat: e.target.value }))}
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Freelance">Freelance</option>
                <option value="Stage">Stage</option>
                <option value="Alternance">Alternance</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Expérience requise
              </label>
              <input
                type="text"
                id="experience"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="3-5 ans"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="dateLimite" className="block text-sm font-medium text-gray-700">
                Date limite de candidature
              </label>
              <input
                type="date"
                id="dateLimite"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.dateLimite}
                onChange={(e) => setFormData(prev => ({ ...prev, dateLimite: e.target.value }))}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Compétences requises
              </label>
              <div className="flex mt-1">
                <input
                  type="text"
                  id="skills"
                  className="block w-full px-3 py-2 border border-gray-300 shadow-sm rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ajouter une compétence"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent shadow-sm rounded-r-md hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description du poste *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez les responsabilités, missions et avantages du poste..."
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Fichier joint (optionnel)
              </label>
              <input
                type="file"
                id="file"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Ajouter l'offre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewOfferModal: React.FC<ViewOfferModalProps> = ({ isOpen, onClose, offer, onApply, onSave }) => {
  if (!isOpen || !offer) return null;

  const daysUntilDeadline = offer.dateLimite 
    ? Math.ceil((new Date(offer.dateLimite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : -1;

  const safeSkills = Array.isArray(offer.skills) ? offer.skills : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Détails de l'offre</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
                <span className="text-xl font-bold text-blue-800">
                  {offer.logo || (offer.organisme ? offer.organisme.substring(0, 2).toUpperCase() : 'JD')}
                </span>
              </div>
            </div>
            <div className="flex-1 ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{offer.titre}</h2>
              <p className="text-lg text-gray-600">{offer.organisme} • {offer.location}</p>
              <div className="flex flex-wrap items-center mt-2 space-x-2">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                  {offer.typeContrat}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  {offer.experience}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                  {offer.salary}
                </span>
                {offer.subscriptionRequired !== 'gratuit' && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                    {offer.subscriptionRequired === 'premium' ? 'Premium' : 'Basic'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900">Description du poste</h4>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{offer.description}</p>
          </div>

          {safeSkills.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900">Compétences requises</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {safeSkills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
            <div>
              <h4 className="text-lg font-medium text-gray-900">Informations</h4>
              <dl className="mt-2 space-y-2">
                <div className="flex">
                  <dt className="w-32 text-sm font-medium text-gray-500">Date de publication:</dt>
                  <dd className="text-sm text-gray-900">
                    {offer.datePublication ? new Date(offer.datePublication).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-sm font-medium text-gray-500">Date limite:</dt>
                  <dd className={`text-sm ${daysUntilDeadline <= 3 ? "text-red-600 font-medium" : "text-gray-900"}`}>
                    {offer.dateLimite ? new Date(offer.dateLimite).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                    {daysUntilDeadline > 0 && (
                      <span className="ml-2">
                        ({daysUntilDeadline === 1 ? "Dernier jour" : `Dans ${daysUntilDeadline} jours`})
                      </span>
                    )}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-sm font-medium text-gray-500">Catégorie:</dt>
                  <dd className="text-sm text-gray-900">{offer.categorie}</dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-sm font-medium text-gray-500">Type:</dt>
                  <dd className="text-sm text-gray-900">{offer.type}</dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-sm font-medium text-gray-500">Source:</dt>
                  <dd className="text-sm text-gray-900">{offer.source}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900">Organisme</h4>
              <dl className="mt-2 space-y-2">
                <div className="flex">
                  <dt className="w-32 text-sm font-medium text-gray-500">Nom:</dt>
                  <dd className="text-sm text-gray-900">{offer.organisme}</dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-sm font-medium text-gray-500">Localisation:</dt>
                  <dd className="text-sm text-gray-900">{offer.location}</dd>
                </div>
                {offer.lien && (
                  <div className="flex">
                    <dt className="w-32 text-sm font-medium text-gray-500">Lien:</dt>
                    <dd className="text-sm text-blue-600">
                      <a href={offer.lien} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Voir l'offre originale
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button 
              type="button"
              onClick={() => onApply(offer)}
              disabled={offer.status === 'applied'}
              className={`flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                offer.status === 'applied' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {offer.status === 'applied' ? 'Déjà postulé' : 'Postuler maintenant'}
            </button>
            
            <button 
              type="button"
              onClick={() => onSave(offer)}
              className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {offer.status === 'saved' ? (
                <>
                  <Save className="w-4 h-4 mr-2 text-green-600" />
                  Sauvegardé
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant SidebarItem
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
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

// Barre de recherche améliorée avec recherche par titre, nom, date, etc.
const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    location: '',
    contractType: '',
    minSalary: '',
    experience: '',
    publicationDate: ''
  });

  const handleSearch = () => {
    let query = searchQuery;
    
    if (filters.location) query += ` location:${filters.location}`;
    if (filters.contractType) query += ` type:${filters.contractType}`;
    if (filters.minSalary) query += ` salary:${filters.minSalary}`;
    if (filters.experience) query += ` experience:${filters.experience}`;
    if (filters.publicationDate) query += ` date:${filters.publicationDate}`;
    
    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      contractType: '',
      minSalary: '',
      experience: '',
      publicationDate: ''
    });
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search className="absolute w-5 h-5 text-gray-400 left-3" />
        <input
          type="text"
          placeholder="Rechercher par titre, organisme, compétence, localisation..."
          className="w-full py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="absolute text-gray-400 right-3 hover:text-gray-600"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {filtersOpen && (
        <div className="absolute left-0 right-0 z-10 p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Localisation</label>
              <div className="relative">
                <MapPin className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input 
                  type="text" 
                  placeholder="Ville, région..." 
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Type de contrat</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={filters.contractType}
                onChange={(e) => handleFilterChange('contractType', e.target.value)}
              >
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
                  value={filters.minSalary}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Expérience</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
              >
                <option value="">Tous</option>
                <option value="débutant">Débutant</option>
                <option value="1-3">1-3 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="5+">5+ ans</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Date de publication</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={filters.publicationDate}
                onChange={(e) => handleFilterChange('publicationDate', e.target.value)}
              >
                <option value="">Toutes les dates</option>
                <option value="1">Dernières 24h</option>
                <option value="7">Dernière semaine</option>
                <option value="30">Dernier mois</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                type="button"
                onClick={handleSearch}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Appliquer la recherche
              </button>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <button 
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Réinitialiser tous les filtres
            </button>
            <div className="text-sm text-gray-500">
              {searchQuery && <span>Recherche: "{searchQuery}"</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Assistant IA
const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant IA Smart AO. Comment puis-je vous aider dans votre recherche d'emploi aujourd'hui ?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessageToN8n = async (message: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:5678/webhook/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chat',
          message: message,
          timestamp: new Date().toISOString(),
          context: 'job_search_assistant'
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response) {
        return data.response;
      } else if (data.message) {
        return data.message;
      } else if (typeof data === 'string') {
        return data;
      } else {
        return "Je comprends votre demande. En tant qu'assistant IA Smart AO, je peux vous aider à optimiser votre recherche d'emploi, préparer vos entretiens, ou analyser vos compétences.";
      }
    } catch (error) {
      console.error('Erreur de communication avec n8n:', error);
      
      const fallbackResponses = [
        "Je suis désolé, je rencontre actuellement des difficultés techniques. Voici ce que je peux vous suggérer pour votre recherche d'emploi :",
        "En attendant la connexion avec mon système, voici quelques conseils généraux :",
        "Pour optimiser votre recherche d'emploi, je vous recommande de :"
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return `${randomFallback}

• Personnaliser votre CV pour chaque offre
• Préparer des questions pour les entretiens
• Utiliser des mots-clés spécifiques dans vos candidatures
• Suivre vos candidatures dans l'onglet "Mes candidatures"
• Configurer des alertes pour de nouvelles offres correspondantes`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    
    try {
      const loadingMessage: Message = {
        id: messages.length + 2,
        text: "Je réfléchis...",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, loadingMessage]);
      
      const aiResponseText = await sendMessageToN8n(inputText);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, text: aiResponseText }
            : msg
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Je suis désolé, je rencontre des difficultés techniques. Pouvez-vous réessayer dans quelques instants ?",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => 
        prev.filter(msg => msg.id !== messages.length + 2).concat(errorMessage)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full max-w-md bg-white border border-gray-200 rounded-t-lg shadow-lg md:rounded-lg md:bottom-6 md:right-6 md:max-w-sm">
      <div className="flex items-center justify-between px-4 py-3 text-white rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Assistant IA Smart AO</h3>
        </div>
        <button 
          onClick={onClose} 
          className="text-white hover:text-gray-200"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="h-64 p-4 overflow-y-auto">
        {messages.map(message => (
          <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-blue-100 text-blue-900' 
                : message.text === "Je réfléchis..."
                  ? 'bg-gray-100 text-gray-500 italic'
                  : 'bg-gray-100 text-gray-900'
            }`}>
              <div className="whitespace-pre-wrap">{message.text}</div>
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-700' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && messages[messages.length - 1]?.text !== "Je réfléchis..." && (
          <div className="mb-4 text-left">
            <div className="inline-block max-w-[80%] px-4 py-2 rounded-lg bg-gray-100 text-gray-500 italic">
              Je réfléchis...
              <div className="mt-1 text-xs text-gray-500">
                {formatTime(new Date())}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center p-4 border-t border-gray-200">
        <input
          type="text"
          placeholder="Posez votre question..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2 text-white rounded-r-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

// Composant de carte statistique
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
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

// Composant de carte d'offre d'emploi avec vue liste corrigée
const JobCard: React.FC<JobCardProps> = ({ offer, view, onApply, onSave, onView }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  const daysUntilDeadline = offer.dateLimite 
    ? Math.ceil((new Date(offer.dateLimite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : -1;

  const safeSkills = Array.isArray(offer.skills) ? offer.skills : [];

  const handleApply = () => {
    onApply(offer);
  };

  const handleSave = () => {
    onSave(offer);
  };

  const handleView = () => {
    if (onView) {
      onView(offer);
    }
  };

  if (view === 'list') {
    return (
      <div className="flex flex-col w-full transition-shadow duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md sm:flex-row">
        <div className="flex-1 p-5">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-md">
                <span className="font-medium text-blue-800">
                  {offer.logo || (offer.organisme ? offer.organisme.substring(0, 2).toUpperCase() : 'JD')}
                </span>
              </div>
            </div>
            <div className="flex-1 ml-4">
              <h3 
                className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                onClick={handleView}
              >
                {offer.titre}
              </h3>
              <p className="text-sm text-gray-500">
                {offer.organisme} • {offer.location}
              </p>
              <div className="flex flex-wrap items-center mt-2 space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {offer.typeContrat}
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

              <div className="mt-3">
                <p className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
                  {offer.description}
                </p>
              </div>

              {safeSkills.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {safeSkills.slice(0, 4).map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {safeSkills.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                        +{safeSkills.length - 4} autres
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center mt-3 text-sm text-gray-500">
                <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                Postée le {offer.datePublication ? new Date(offer.datePublication).toLocaleDateString('fr-FR') : 'Date inconnue'}
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
          </div>
        </div>

        <div className="w-full p-5 bg-gray-50 sm:w-64 sm:flex sm:flex-col sm:justify-between">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <span className="text-lg font-bold text-gray-900">{offer.salary}</span>
            {offer.status === 'applied' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Déjà postulé
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-3">
            <button 
              type="button"
              onClick={handleApply}
              disabled={offer.status === 'applied'}
              className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                offer.status === 'applied' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {offer.status === 'applied' ? 'Déjà postulé' : 'Postuler maintenant'}
            </button>
            
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {offer.status === 'saved' ? (
                  <>
                    <Save className="w-4 h-4 mr-2 text-green-600" />
                    Sauvegardé
                </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={handleView}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue grid (par défaut)
  return (
    <div className="flex flex-col h-full overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
      <div className="flex-1 p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-md">
              <span className="font-medium text-blue-800">
                {offer.logo || (offer.organisme ? offer.organisme.substring(0, 2).toUpperCase() : 'JD')}
              </span>
            </div>
          </div>
          <div className="flex-1 ml-4">
            <h3 
              className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={handleView}
            >
              {offer.titre}
            </h3>
            <p className="text-sm text-gray-500">
              {offer.organisme} • {offer.location}
            </p>
            <div className="flex flex-wrap items-center mt-2 space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {offer.typeContrat}
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
          <p className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-3'}`}>
            {offer.description}
          </p>
        </div>

        {safeSkills.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {safeSkills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {safeSkills.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                  +{safeSkills.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center mt-4 text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          Postée le {offer.datePublication ? new Date(offer.datePublication).toLocaleDateString('fr-FR') : 'Date inconnue'}
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

      <div className="px-5 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">{offer.salary}</span>
          {offer.status === 'applied' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Déjà postulé
            </span>
          )}
        </div>

        <div className="space-y-2">
          <button 
            type="button"
            onClick={handleApply}
            disabled={offer.status === 'applied'}
            className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              offer.status === 'applied' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {offer.status === 'applied' ? 'Déjà postulé' : 'Postuler maintenant'}
          </button>
          
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {offer.status === 'saved' ? (
                <>
                  <Save className="w-4 h-4 mr-2 text-green-600" />
                  Sauvegardé
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={handleView}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de statut de connexion
const ConnectionStatus: React.FC<{ isOnline: boolean; lastUpdate: string; n8nStatus: 'connected' | 'error' | 'checking' }> = ({ 
  isOnline, 
  lastUpdate,
  n8nStatus
}) => {
  const cacheInfo = N8nService.getCacheInfo();
  const dataSource: 'n8n' | 'cache' | 'mock' = cacheInfo.source === 'n8n' ? 'n8n' : 
                                               cacheInfo.source === 'mock' ? 'mock' : 'cache';

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-600 bg-red-50 border-red-200';
    if (n8nStatus === 'error') return 'text-orange-600 bg-orange-50 border-orange-200';
    if (dataSource === 'n8n') return 'text-green-600 bg-green-50 border-green-200';
    if (dataSource === 'cache') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Hors ligne - Données mockées';
    if (n8nStatus === 'error') return 'n8n non disponible - Données mockées';
    if (dataSource === 'n8n') return 'En ligne - Données en direct';
    if (dataSource === 'cache') return 'En ligne - Données en cache';
    return 'En ligne - Données mockées';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (n8nStatus === 'error') return <WifiOff className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  return (
    <div className={`flex items-center px-3 py-2 text-sm border rounded-lg ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="ml-2 font-medium">{getStatusText()}</span>
      <span className="ml-2 text-xs opacity-75">• Mise à jour: {lastUpdate}</span>
    </div>
  );
};

// Dashboard Tab avec modal corrigé
const DashboardTab: React.FC<DashboardTabProps> = ({ 
  stats, 
  events, 
  offers, 
  user, 
  isOnline, 
  onViewAllOffers, 
  onViewOffer,
  onAddEvent 
}) => {
  const [addEventModalOpen, setAddEventModalOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-600">Vue d'ensemble de votre recherche d'emploi</p>
        </div>
      </div>

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
              <button 
                type="button"
                className="px-3 py-1 text-xs font-medium text-white rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Voir les offres
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOnline && (
        <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WifiOff className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Mode hors ligne</h3>
              <p className="text-sm text-orange-600">
                Vous êtes actuellement hors ligne. Les données affichées sont issues du cache local ou sont mockées.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Offres totales" value={stats.totalOffers} icon={Briefcase} color="blue" />
        <StatCard title="Candidatures" value={stats.appliedOffers} icon={Send} color="green" />
        <StatCard title="Offres sauvegardées" value={stats.savedOffers} icon={Bookmark} color="purple" />
        <StatCard title="Taux de réponse" value={stats.responseRate} icon={BarChart3} color="yellow" />
        <StatCard title="Nouvelles aujourd'hui" value={stats.newToday} icon={Clock} color="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                        <span className="font-medium text-blue-800">
                          {offer.logo || (offer.organisme ? offer.organisme.substring(0, 2).toUpperCase() : 'JD')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => onViewOffer(offer)}
                      >
                        {offer.titre}
                      </h4>
                      <p className="text-sm text-gray-500">{offer.organisme} • {offer.location}</p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {offer.typeContrat}
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
                      <button 
                        type="button"
                        onClick={() => onViewOffer(offer)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 text-right bg-gray-50">
              <button 
                type="button"
                onClick={onViewAllOffers}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Voir toutes les offres
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Prochains événements</h3>
                <button 
                  type="button"
                  onClick={() => setAddEventModalOpen(true)}
                  className="inline-flex items-center px-2 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </button>
              </div>
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
              <button 
                type="button"
                onClick={() => setAddEventModalOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un événement
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={addEventModalOpen}
        onClose={() => setAddEventModalOpen(false)}
        onSubmit={onAddEvent}
      />
    </div>
  );
};

// Jobs Tab avec meilleur feedback utilisateur et vue liste corrigée
const JobsTab: React.FC<JobsTabProps> = ({ 
  offers, 
  user, 
  onRefresh, 
  loading, 
  refreshCount, 
  lastUpdate, 
  isOnline,
  n8nStatus,
  onApply,
  onSave,
  onAddJobOffer
}) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addJobOfferModalOpen, setAddJobOfferModalOpen] = useState<boolean>(false);
  const [viewOfferModalOpen, setViewOfferModalOpen] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onRefresh(query, false);
  };

  const handleRefresh = (useCache: boolean = false) => {
    onRefresh(searchQuery, useCache);
  };

  const handleViewOffer = (offer: JobOffer) => {
    setSelectedOffer(offer);
    setViewOfferModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Offres d'emploi</h2>
          <p className="text-gray-600">
            {loading ? 'Recherche en cours...' : `${offers.length} offres correspondant à vos critères`}
          </p>
          {loading && (
            <p className="mt-1 text-sm text-blue-600">
              Veuillez patienter...
            </p>
          )}
        </div>
        <div className="flex items-center mt-4 space-x-2 sm:mt-0">
          <ConnectionStatus 
            isOnline={isOnline} 
            lastUpdate={lastUpdate}
            n8nStatus={n8nStatus}
          />
          
          <div className="flex p-1 bg-gray-100 rounded-md">
            <button 
              type="button"
              onClick={() => setView('grid')}
              className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button 
              type="button"
              onClick={() => setView('list')}
              className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          
          <button 
            type="button"
            onClick={() => setAddJobOfferModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une offre
          </button>
          
          <button 
            type="button"
            onClick={() => handleRefresh(false)}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? `Scraping... (${refreshCount})` : 'Actualiser'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      {n8nStatus === 'error' && (
        <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div className="flex items-center">
            <WifiOff className="w-5 h-5 text-orange-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Serveur n8n non disponible</h3>
              <p className="text-sm text-orange-600">
                Impossible de contacter le serveur n8n. Vérifiez que n8n est démarré sur le port 5678.
                Les données affichées sont mockées pour la démonstration.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <div className="flex flex-col items-center justify-center">
            <RefreshCw className="w-12 h-12 mb-4 text-blue-600 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900">Scraping des offres en cours</h3>
            <p className="max-w-md mt-2 text-gray-600">
              Nous recherchons les dernières offres d'emploi sur toutes les plateformes. 
              Cette opération peut prendre quelques minutes selon le nombre d'offres disponibles.
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-blue-600">
              <Clock className="w-4 h-4" />
              <span>Veuillez patienter, le traitement peut prendre quelques minutes...</span>
            </div>
            <div className="w-full h-2 max-w-md mt-4 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {!loading && !isOnline && (
        <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div className="flex items-center">
            <WifiOff className="w-5 h-5 text-orange-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Mode hors ligne activé</h3>
              <p className="text-sm text-orange-600">
                Les données affichées proviennent du cache local. Certaines fonctionnalités peuvent être limitées.
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
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
                  <button 
                    type="button"
                    className="px-3 py-1 text-xs font-medium text-white rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Mettre à niveau
                  </button>
                </div>
              </div>
            </div>
          )}

          {offers.length > 0 && (
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {offers.length} offre{offers.length > 1 ? 's' : ''} trouvée{offers.length > 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Voici les offres d'emploi correspondant à votre recherche
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Dernière mise à jour: {lastUpdate}
                </div>
              </div>
            </div>
          )}

          <div className={view === 'grid' 
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
          }>
            {offers.map(offer => (
              <JobCard 
                key={offer.id} 
                offer={offer} 
                view={view} 
                onApply={onApply}
                onSave={onSave}
                onView={handleViewOffer}
              />
            ))}
          </div>

          {offers.length === 0 && (
            <div className="py-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre disponible</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez d'ajuster vos filtres ou vérifiez votre abonnement pour voir plus d'offres.
              </p>
              <div className="mt-6">
                <button 
                  type="button"
                  onClick={() => handleRefresh(false)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rechercher des offres
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AddJobOfferModal
        isOpen={addJobOfferModalOpen}
        onClose={() => setAddJobOfferModalOpen(false)}
        onSubmit={onAddJobOffer}
      />

      <ViewOfferModal
        isOpen={viewOfferModalOpen}
        onClose={() => setViewOfferModalOpen(false)}
        offer={selectedOffer}
        onApply={onApply}
        onSave={onSave}
      />
    </div>
  );
};

// Applications Tab
const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ offers }) => {
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
            <button 
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
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
                    <p className="text-lg font-medium text-blue-600 truncate">{offer.titre}</p>
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
                        {offer.organisme}
                      </p>
                      <p className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {offer.location}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Postulé le <time dateTime={offer.applicationDate}>{new Date(offer.applicationDate!).toLocaleDateString('fr-FR')}</time>
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
const SavedTab: React.FC<SavedTabProps> = ({ offers, onApply, onRemove }) => {
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
            <button 
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Parcourir les offres
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map(offer => (
            <div key={offer.id} className="relative">
              <JobCard 
                offer={offer} 
                view="grid" 
                onApply={onApply}
                onSave={onRemove}
              />
              <button
                onClick={() => onRemove(offer)}
                className="absolute p-1 text-red-600 bg-white rounded-full shadow top-2 right-2 hover:bg-red-50"
                title="Retirer des sauvegardés"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Calendar Tab avec dates des offres sauvegardées et modal corrigé
const CalendarTab: React.FC<CalendarTabProps> = ({ events, savedOffers, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [addEventModalOpen, setAddEventModalOpen] = useState<boolean>(false);

  const calendarEvents = [
    ...events,
    ...savedOffers.map(offer => ({
      id: offer.id + 1000,
      title: `Deadline: ${offer.titre}`,
      date: offer.dateLimite ? `${offer.dateLimite}T23:59:00` : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'deadline' as const,
      company: offer.organisme,
      job: offer.titre
    }))
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setFullYear(prev.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setAddEventModalOpen(true);
  };

  const handleAddEvent = (event: Event) => {
    onAddEvent(event);
    setAddEventModalOpen(false);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = [];

  // Ajouter les jours vides du mois précédent
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Ajouter les jours du mois actuel
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const hasEventsOnDay = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return calendarEvents.some(event => event.date.split('T')[0] === dateStr);
  };

  const hasDeadlinesOnDay = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return calendarEvents.some(event => event.type === 'deadline' && event.date.split('T')[0] === dateStr);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
        <p className="text-gray-600">Gérez vos entretiens et deadlines</p>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button 
                type="button"
                onClick={() => navigateYear('prev')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button 
                type="button"
                onClick={() => navigateYear('next')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button 
                type="button"
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Aujourd'hui
              </button>
              <button 
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs leading-6 text-center text-gray-500">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mer</div>
            <div>Jeu</div>
            <div>Ven</div>
            <div>Sam</div>
            <div>Dim</div>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-2 text-sm">
            {days.map((day, index) => {
              const isToday = day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() && 
                            currentDate.getFullYear() === new Date().getFullYear();
              
              return day ? (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[60px] p-2 text-left border rounded-md hover:bg-gray-50 relative ${
                    isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                  } ${hasEventsOnDay(day) ? 'bg-green-50' : ''}`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday ? 'bg-blue-600 text-white' : 'text-gray-900'
                  }`}>
                    {day}
                  </span>
                  {hasEventsOnDay(day) && (
                    <div className="absolute flex space-x-1 transform -translate-x-1/2 bottom-1 left-1/2">
                      {hasDeadlinesOnDay(day) && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ) : (
                <div key={index} className="min-h-[60px] p-2 border border-transparent rounded-md"></div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Événements à venir</h3>
            <button 
              type="button"
              onClick={() => setAddEventModalOpen(true)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </button>
          </div>
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
                  {calendarEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {event.type === 'deadline' && (
                            <Clock className="w-4 h-4 mr-2 text-red-500" />
                          )}
                          {event.type === 'interview' && (
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          )}
                          {event.type === 'followup' && (
                            <Send className="w-4 h-4 mr-2 text-green-500" />
                          )}
                          {event.type === 'event' && (
                            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                          )}
                          {event.title}
                        </div>
                      </td>
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

      <AddEventModal
        isOpen={addEventModalOpen}
        onClose={() => setAddEventModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
};


// Subscription Tab avec modal d'abonnement
const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ user, plans, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState<boolean>(false);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      onSubscribe(plan.id);
      alert('Abonnement gratuit activé avec succès !');
    } else {
      setSelectedPlan(plan);
      setSubscriptionModalOpen(true);
    }
  };

  const handleSubscriptionSubmit = () => {
    if (selectedPlan) {
      onSubscribe(selectedPlan.id);
      setSubscriptionModalOpen(false);
      alert(`Abonnement ${selectedPlan.name} activé avec succès !`);
    }
  };

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
                  <button 
                    type="button"
                    onClick={() => handleSubscribe(plans.find(p => p.id === 'premium')!)}
                    className="px-4 py-2 ml-auto text-sm font-medium text-white rounded-md shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
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
                    type="button"
                    onClick={() => handleSubscribe(plan)}
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

      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        onSubmit={handleSubscriptionSubmit}
        plan={selectedPlan}
      />
    </div>
  );
};

// Settings Tab avec confirmation
const SettingsTab: React.FC<SettingsTabProps> = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState<User>(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Êtes-vous sûr de vouloir enregistrer les modifications ?')) {
      onUpdateProfile(formData);
      alert('Profil mis à jour avec succès !');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
        <p className="text-gray-600">Gérez vos préférences et votre compte</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Profil</h3>
          <form onSubmit={handleSubmit} className="mt-4">
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
                  value={formData.name.split(' ')[0] || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    name: `${e.target.value} ${prev.name.split(' ')[1] || ''}`.trim()
                  }))}
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
                  value={formData.name.split(' ')[1] || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    name: `${prev.name.split(' ')[0] || ''} ${e.target.value}`.trim()
                  }))}
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
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
            <div className="mt-5">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
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
              onClick={() => alert('Préférences enregistrées avec succès !')}
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

// Composant principal de l'application
const SmartAODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    name: "Lalaina Raharintsalama",
    email: "jean.dupont@email.com",
    profileCompletion: 85,
    subscription: "basic",
    subscriptionEnd: "2023-12-31"
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "12 nouvelles offres correspondent à votre profil", time: "2h", read: false, type: 'new_offer' },
    { id: 2, message: "Rappel: Entretien avec TechCorp demain", time: "5h", read: false, type: 'deadline_reminder' },
    { id: 3, message: "Votre candidature a été vue par DataInsights", time: "1j", read: true, type: 'application_update' },
    { id: 4, message: "Deadline approchante: DevOps Engineer chez CloudSolutions", time: "10j", read: false, type: 'deadline_reminder' }
  ]);

  const [jobOffers, setJobOffers] = useState<JobOffer[]>(mockJobOffers);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>('Jamais');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [n8nStatus, setN8nStatus] = useState<'connected' | 'error' | 'checking'>('checking');

  // États pour les modals
  const [confirmApplyModalOpen, setConfirmApplyModalOpen] = useState<boolean>(false);
  const [applicationFormModalOpen, setApplicationFormModalOpen] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState<boolean>(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState<boolean>(false);
  const [viewOfferModalOpen, setViewOfferModalOpen] = useState<boolean>(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Calculer les statistiques en temps réel
  const stats: Stats = {
    totalOffers: jobOffers.length,
    appliedOffers: jobOffers.filter(offer => offer.status === 'applied').length,
    savedOffers: jobOffers.filter(offer => offer.status === 'saved').length,
    responseRate: "35%",
    newToday: jobOffers.filter(offer => {
      const offerDate = new Date(offer.datePublication);
      const today = new Date();
      return offerDate.toDateString() === today.toDateString();
    }).length
  };

  // Surveiller la connexion réseau
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fonction pour rafraîchir les offres via n8n
  const refreshJobOffers = async (query?: string, useCache: boolean = true) => {
    setLoading(true);
    setRefreshCount(prev => prev + 1);
    
    try {
      const result = await N8nService.scrapeJobOffers(query, useCache);
      setJobOffers(result.data);
      console.log(`✅ Données chargées depuis: ${result.source}`);
      setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
      
      if (result.source === 'n8n') {
        setN8nStatus('connected');
      }
    } catch (error) {
      console.error('❌ Erreur lors du scraping:', error);
      setJobOffers(mockJobOffers);
      setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
      setN8nStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Charger les offres au premier rendu avec cache
  useEffect(() => {
    refreshJobOffers(undefined, true);
  }, []);

  // Filtrer les offres selon l'abonnement
  const getOffersForSubscription = (): JobOffer[] => {
    return jobOffers.filter(offer => {
      if (user.subscription === "premium") return true;
      if (user.subscription === "basic") return offer.subscriptionRequired !== "premium";
      return offer.subscriptionRequired === "gratuit";
    });
  };

  const filteredOffers = getOffersForSubscription();
  const appliedOffers = jobOffers.filter(offer => offer.status === 'applied');
  const savedOffers = jobOffers.filter(offer => offer.status === 'saved');

  // Gestion de la candidature avec envoi vers n8n
  const handleApply = (offer: JobOffer) => {
    setSelectedOffer(offer);
    setConfirmApplyModalOpen(true);
  };

  const handleConfirmApply = () => {
    setConfirmApplyModalOpen(false);
    setApplicationFormModalOpen(true);
  };

  const handleApplicationSubmit = async (formData: ApplicationForm) => {
    if (selectedOffer) {
      try {
        // Envoyer les données de candidature vers n8n
        const emailSent = await N8nService.sendApplicationEmail({
          jobOffer: selectedOffer,
          userData: formData,
          userProfile: user
        });

        if (emailSent) {
          console.log('✅ Candidature envoyée avec succès via n8n');
          
          // Mettre à jour l'état local
          const updatedOffers = jobOffers.map(offer => 
            offer.id === selectedOffer.id 
              ? { 
                  ...offer, 
                  status: 'applied' as const,
                  applicationDate: new Date().toISOString().split('T')[0]
                }
              : offer
          );
          setJobOffers(updatedOffers);
          
          // Ajouter une notification
          const newNotification: Notification = {
            id: notifications.length + 1,
            message: `Candidature envoyée pour ${selectedOffer.titre} chez ${selectedOffer.organisme}`,
            time: "À l'instant",
            read: false,
            type: 'application_update'
          };
          setNotifications(prev => [newNotification, ...prev]);
          
          alert('Candidature envoyée avec succès ! Un email de confirmation a été envoyé.');
        } else {
          throw new Error('Échec de l\'envoi de l\'email via n8n');
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de la candidature:', error);
        
        // En cas d'erreur, on sauvegarde quand même localement
        const updatedOffers = jobOffers.map(offer => 
          offer.id === selectedOffer.id 
            ? { 
                ...offer, 
                status: 'applied' as const,
                applicationDate: new Date().toISOString().split('T')[0]
              }
            : offer
        );
        setJobOffers(updatedOffers);
        
        const newNotification: Notification = {
          id: notifications.length + 1,
          message: `Candidature envoyée pour ${selectedOffer.titre} (erreur d'envoi email)`,
          time: "À l'instant",
          read: false,
          type: 'application_update'
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        alert('Candidature enregistrée localement, mais erreur lors de l\'envoi de l\'email. Veuillez vérifier votre connexion.');
      }
    }
    
    setApplicationFormModalOpen(false);
  };

  // Gestion de la sauvegarde
  const handleSave = (offer: JobOffer) => {
    const updatedOffers = jobOffers.map(job => {
      if (job.id === offer.id) {
        const newStatus: 'available' | 'saved' = job.status === 'saved' ? 'available' : 'saved';
        return {
          ...job,
          status: newStatus
        };
      }
      return job;
    });
    setJobOffers(updatedOffers);
    
    if (offer.status !== 'saved') {
      const newNotification: Notification = {
        id: notifications.length + 1,
        message: `Offre "${offer.titre}" sauvegardée`,
        time: "À l'instant",
        read: false,
        type: 'new_offer'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleRemoveSaved = (offer: JobOffer) => {
    const updatedOffers = jobOffers.map(job => 
      job.id === offer.id ? { ...job, status: 'available' as const } : job
    );
    setJobOffers(updatedOffers);
  };

  // Gestion de l'abonnement
  const handleSubscribe = (planId: string) => {
    setUser(prev => ({
      ...prev,
      subscription: planId as 'gratuit' | 'basic' | 'premium',
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  // Gestion du profil utilisateur
  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Gestion des notifications
  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Gestion de la recherche
  const handleSearch = (query: string) => {
    refreshJobOffers(query, false);
  };

  // Gestion des événements
  const handleAddEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
    
    // Ajouter une notification
    const newNotification: Notification = {
      id: notifications.length + 1,
      message: `Nouvel événement ajouté: ${event.title}`,
      time: "À l'instant",
      read: false,
      type: 'deadline_reminder'
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    alert('Événement ajouté avec succès !');
  };

  // Gestion des offres d'emploi ajoutées
  const handleAddJobOffer = (offer: JobOffer) => {
    setJobOffers(prev => [...prev, offer]);
    
    // Ajouter une notification
    const newNotification: Notification = {
      id: notifications.length + 1,
      message: `Nouvelle offre ajoutée: ${offer.titre}`,
      time: "À l'instant",
      read: false,
      type: 'new_offer'
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    alert('Offre d\'emploi ajoutée avec succès !');
  };

  // Navigation vers les offres
  const handleViewAllOffers = () => {
    setActiveTab('jobs');
  };

  const handleViewOffer = (offer: JobOffer) => {
    setSelectedOffer(offer);
    setViewOfferModalOpen(true);
  };

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
          <button 
            type="button"
            className="p-1 text-gray-400 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
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
            <div 
              className="flex items-center px-4 py-3 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => setUserProfileModalOpen(true)}
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.subscription} • {user.subscription === 'gratuit' ? 'Essai' : 'Actif'}</p>
              </div>
              <button 
                type="button"
                className="ml-auto"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-800 bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modals */}
      <ConfirmApplyModal
        isOpen={confirmApplyModalOpen}
        onClose={() => setConfirmApplyModalOpen(false)}
        onConfirm={handleConfirmApply}
        offer={selectedOffer}
      />

      <ApplicationFormModal
        isOpen={applicationFormModalOpen}
        onClose={() => setApplicationFormModalOpen(false)}
        onSubmit={handleApplicationSubmit}
        offer={selectedOffer}
      />

      <UserProfileModal
        isOpen={userProfileModalOpen}
        onClose={() => setUserProfileModalOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />

      <ViewOfferModal
        isOpen={viewOfferModalOpen}
        onClose={() => setViewOfferModalOpen(false)}
        offer={selectedOffer}
        onApply={handleApply}
        onSave={handleSave}
      />

      {/* Assistant IA flottant */}
      {aiAssistantOpen && (
        <AIAssistant onClose={() => setAiAssistantOpen(false)} />
      )}

      {/* Bouton assistant IA */}
      <button 
        type="button"
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
            <button 
              type="button"
              className="p-1 mr-2 text-gray-500 lg:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              type="button"
              onClick={() => setActiveTab('subscription')}
              className="items-center hidden px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full md:flex"
            >
              <Crown className="w-3 h-3 mr-1" />
              {user.subscription === 'premium' ? 'Premium' : user.subscription === 'basic' ? 'Basic' : 'Gratuit'}
            </button>

            <button 
              type="button"
              className="relative p-2 text-gray-500 bg-gray-100 rounded-full"
              onClick={() => setNotificationsModalOpen(true)}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <div 
              className="items-center hidden space-x-2 cursor-pointer md:flex"
              onClick={() => setUserProfileModalOpen(true)}
            >
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
            {activeTab === 'dashboard' && (
              <DashboardTab 
                stats={stats} 
                events={events} 
                offers={filteredOffers} 
                user={user} 
                isOnline={isOnline}
                onViewAllOffers={handleViewAllOffers}
                onViewOffer={handleViewOffer}
                onAddEvent={handleAddEvent}
              />
            )}
            {activeTab === 'jobs' && (
              <JobsTab 
                offers={filteredOffers} 
                user={user} 
                onRefresh={refreshJobOffers} 
                loading={loading} 
                refreshCount={refreshCount}
                lastUpdate={lastUpdate}
                isOnline={isOnline}
                n8nStatus={n8nStatus}
                onApply={handleApply}
                onSave={handleSave}
                onAddJobOffer={handleAddJobOffer}
              />
            )}
            {activeTab === 'applications' && <ApplicationsTab offers={appliedOffers} />}
            {activeTab === 'saved' && (
              <SavedTab 
                offers={savedOffers} 
                user={user} 
                onApply={handleApply}
                onRemove={handleRemoveSaved}
              />
            )}
            {activeTab === 'calendar' && (
              <CalendarTab 
                events={events} 
                savedOffers={savedOffers} 
                onAddEvent={handleAddEvent}
              />
            )}
            {activeTab === 'subscription' && (
              <SubscriptionTab 
                user={user} 
                plans={subscriptionPlans} 
                onSubscribe={handleSubscribe}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsTab 
                user={user} 
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SmartAODashboard;