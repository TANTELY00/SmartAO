import React, { useState } from 'react';
import {  AlertTriangle, Search, Lock, Activity, CheckCircle, Eye, FileText  } from 'lucide-react';

// Types TypeScript
interface Vulnerability {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  cve: string;
}

interface ScanResult {
  url: string;
  timestamp: string;
  vulnerabilities: Vulnerability[];
  securityScore: number;
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

type TabType = 'scanner' | 'history';
type SeverityType = 'critical' | 'high' | 'medium' | 'low';

const SecurityScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [history, setHistory] = useState<ScanResult[]>([]);

  // Détection de vulnérabilités avec typage strict
  const detectVulnerabilities = (url: string): Vulnerability[] => {
    const vulnerabilities: Vulnerability[] = [];
    const lowerUrl = url.toLowerCase();

    // SQL Injection
    if (lowerUrl.includes('id=') || lowerUrl.includes('user=') || 
        lowerUrl.includes('select') || lowerUrl.includes('union')) {
      vulnerabilities.push({
        type: 'SQL Injection',
        severity: 'critical',
        description: 'Paramètres suspects détectés dans l\'URL pouvant permettre une injection SQL',
        recommendation: 'Utiliser des requêtes préparées et valider toutes les entrées utilisateur',
        cve: 'CWE-89'
      });
    }

    // XSS (Cross-Site Scripting)
    if (lowerUrl.includes('<script>') || lowerUrl.includes('javascript:') || 
        lowerUrl.includes('onerror=') || lowerUrl.includes('alert(')) {
      vulnerabilities.push({
        type: 'Cross-Site Scripting (XSS)',
        severity: 'high',
        description: 'Scripts malveillants détectés dans l\'URL',
        recommendation: 'Encoder toutes les sorties et implémenter une politique CSP stricte',
        cve: 'CWE-79'
      });
    }

    // Path Traversal
    if (lowerUrl.includes('../') || lowerUrl.includes('..\\') || lowerUrl.includes('%2e%2e')) {
      vulnerabilities.push({
        type: 'Path Traversal',
        severity: 'high',
        description: 'Tentative d\'accès aux fichiers système détectée',
        recommendation: 'Valider et assainir tous les chemins de fichiers',
        cve: 'CWE-22'
      });
    }

    // Open Redirect
    if (lowerUrl.includes('redirect=') || lowerUrl.includes('url=') || lowerUrl.includes('next=')) {
      vulnerabilities.push({
        type: 'Open Redirect',
        severity: 'medium',
        description: 'Paramètre de redirection détecté pouvant être exploité',
        recommendation: 'Valider les URLs de redirection avec une liste blanche',
        cve: 'CWE-601'
      });
    }

    // SSRF (Server-Side Request Forgery)
    if (lowerUrl.includes('localhost') || lowerUrl.includes('127.0.0.1') || 
        lowerUrl.includes('0.0.0.0') || lowerUrl.includes('169.254')) {
      vulnerabilities.push({
        type: 'Server-Side Request Forgery (SSRF)',
        severity: 'critical',
        description: 'Tentative d\'accès aux ressources internes détectée',
        recommendation: 'Filtrer les adresses IP privées et localhost',
        cve: 'CWE-918'
      });
    }

    // Sensitive Data Exposure
    if (lowerUrl.includes('password=') || lowerUrl.includes('pwd=') || 
        lowerUrl.includes('token=') || lowerUrl.includes('api_key=')) {
      vulnerabilities.push({
        type: 'Sensitive Data Exposure',
        severity: 'high',
        description: 'Données sensibles exposées dans l\'URL',
        recommendation: 'Ne jamais transmettre de credentials dans l\'URL, utiliser POST avec HTTPS',
        cve: 'CWE-598'
      });
    }

    // Command Injection
    if (lowerUrl.includes('|') || lowerUrl.includes(';') || 
        lowerUrl.includes('&&') || lowerUrl.includes('`')) {
      vulnerabilities.push({
        type: 'Command Injection',
        severity: 'critical',
        description: 'Caractères de commande système détectés',
        recommendation: 'Ne jamais passer d\'entrées utilisateur directement aux commandes système',
        cve: 'CWE-78'
      });
    }

    // Insecure Protocol
    if (url.startsWith('http://') && !url.startsWith('http://localhost')) {
      vulnerabilities.push({
        type: 'Insecure Protocol',
        severity: 'medium',
        description: 'Connexion non sécurisée (HTTP au lieu de HTTPS)',
        recommendation: 'Toujours utiliser HTTPS pour chiffrer les communications',
        cve: 'CWE-319'
      });
    }

    // Local File Inclusion (LFI)
    if (lowerUrl.includes('file=') || lowerUrl.includes('page=') || lowerUrl.includes('include=')) {
      vulnerabilities.push({
        type: 'Local File Inclusion (LFI)',
        severity: 'high',
        description: 'Paramètres suspects pouvant permettre l\'inclusion de fichiers locaux',
        recommendation: 'Valider strictement les noms de fichiers avec une liste blanche',
        cve: 'CWE-98'
      });
    }

    return vulnerabilities;
  };

  const calculateSecurityScore = (vulnerabilities: Vulnerability[]): number => {
    if (vulnerabilities.length === 0) return 100;
    
    const severityWeights: Record<SeverityType, number> = {
      critical: 30,
      high: 20,
      medium: 10,
      low: 5
    };

    const totalDeduction = vulnerabilities.reduce((sum, vuln) => {
      return sum + (severityWeights[vuln.severity] || 0);
    }, 0);

    return Math.max(0, 100 - totalDeduction);
  };

  const startScan = (): void => {
    if (!inputUrl.trim()) {
      alert('Veuillez entrer une URL à scanner');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const vulnerabilities = detectVulnerabilities(inputUrl);
          const securityScore = calculateSecurityScore(vulnerabilities);
          
          const result: ScanResult = {
            url: inputUrl,
            timestamp: new Date().toLocaleString('fr-FR'),
            vulnerabilities,
            securityScore,
            totalVulnerabilities: vulnerabilities.length,
            criticalCount: vulnerabilities.filter(v => v.severity === 'critical').length,
            highCount: vulnerabilities.filter(v => v.severity === 'high').length,
            mediumCount: vulnerabilities.filter(v => v.severity === 'medium').length,
            lowCount: vulnerabilities.filter(v => v.severity === 'low').length
          };

          setScanResults(result);
          
          // Vérifier si l'URL existe déjà dans l'historique
          setHistory(prev => {
            const urlExists = prev.some(scan => scan.url === inputUrl);
            if (urlExists) {
              // Remplacer l'ancienne version par la nouvelle
              return [result, ...prev.filter(scan => scan.url !== inputUrl).slice(0, 9)];
            }
            // Ajouter une nouvelle entrée
            return [result, ...prev.slice(0, 9)];
          });
          
          setIsScanning(false);
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getSeverityColor = (severity: SeverityType): string => {
    const colors: Record<SeverityType, string> = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-blue-500 text-white'
    };
    return colors[severity];
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const exampleUrls: string[] = [
    'https://example.com/user?id=1 OR 1=1',
    'http://site.com/page?file=../../etc/passwd',
    'https://app.com/search?q=<script>alert("XSS")</script>',
    'https://api.com/data?url=http://localhost:8080/admin',
    'https://shop.com/login?redirect=https://evil.com',
    'https://web.com/cmd?exec=ls;cat /etc/passwd'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/30">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-2xl font-bold text-white">VulnScanner Pro</h1>
                <p className="text-sm text-purple-300">Détecteur de Vulnérabilités Web</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/20 px-4 py-2">
              <div className="size-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-400">Système Actif</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex gap-2 rounded-xl border border-purple-500/30 bg-black/30 p-1.5 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
              activeTab === 'scanner' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50' 
                : 'text-purple-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Search className="size-5" />
            Scanner
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
              activeTab === 'history' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50' 
                : 'text-purple-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText className="size-5" />
            Historique ({history.length})
          </button>
        </div>

        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-500/30 bg-black/40 p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">Analyser une URL</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium text-purple-300">URL à analyser</label>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/page?param=value"
                    className="w-full rounded-xl border border-purple-500/30 bg-black/50 px-4 py-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    onKeyPress={(e) => e.key === 'Enter' && startScan()}
                  />
                </div>

                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Activity className="size-5 animate-spin" />
                      Scan en cours... {scanProgress}%
                    </>
                  ) : (
                    <>
                      <Search className="size-5" />
                      Lancer le Scan de Sécurité
                    </>
                  )}
                </button>
              </div>

              {isScanning && (
                <div className="mt-6">
                  <div className="h-3 w-full overflow-hidden rounded-full border border-purple-500/30 bg-black/50">
                    <div 
                      className="h-full animate-pulse rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <p className="mb-3 font-medium text-purple-300">URLs de test (cliquez pour essayer) :</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {exampleUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputUrl(url)}
                      className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-left text-sm text-purple-200 transition-all hover:border-purple-500/50 hover:bg-purple-500/20"
                    >
                      {url.length > 50 ? url.substring(0, 50) + '...' : url}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {scanResults && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 backdrop-blur-sm">
                    <div className={`mb-2 text-4xl font-bold ${getScoreColor(scanResults.securityScore)}`}>{scanResults.securityScore}/100</div>
                    <p className="text-sm text-purple-200">Score de Sécurité</p>
                  </div>
                  
                  <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/20 to-orange-500/20 p-6 backdrop-blur-sm">
                    <div className="mb-2 text-4xl font-bold text-red-400">{scanResults.criticalCount}</div>
                    <p className="text-sm text-red-200">Vulnérabilités Critiques</p>
                  </div>
                  
                  <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 p-6 backdrop-blur-sm">
                    <div className="mb-2 text-4xl font-bold text-orange-400">{scanResults.highCount}</div>
                    <p className="text-sm text-orange-200">Vulnérabilités Élevées</p>
                  </div>
                  
                  <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-green-500/20 p-6 backdrop-blur-sm">
                    <div className="mb-2 text-4xl font-bold text-yellow-400">{scanResults.totalVulnerabilities}</div>
                    <p className="text-sm text-yellow-200">Total Détecté</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-500/30 bg-black/40 p-8 backdrop-blur-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <AlertTriangle className="size-6 text-red-400" />
                    <h2 className="text-2xl font-bold text-white">Vulnérabilités Détectées</h2>
                  </div>

                  {scanResults.vulnerabilities.length === 0 ? (
                    <div className="py-12 text-center">
                      <CheckCircle className="mx-auto mb-4 size-16 text-green-400" />
                      <h3 className="mb-2 text-xl font-bold text-green-400">Aucune vulnérabilité détectée !</h3>
                      <p className="text-purple-300">L'URL analysée semble sécurisée.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scanResults.vulnerabilities.map((vuln, idx) => (
                        <div key={idx} className="rounded-xl border border-purple-500/20 bg-black/30 p-6 transition-all hover:border-purple-500/40">
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="rounded-lg bg-red-500/20 p-3">
                                <Lock className="size-6 text-red-400" />
                              </div>
                              <div>
                                <h3 className="mb-1 text-xl font-bold text-white">{vuln.type}</h3>
                                <p className="text-sm text-purple-200">{vuln.description}</p>
                              </div>
                            </div>
                            <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="space-y-3 pl-16">
                            <div>
                              <p className="mb-1 text-sm font-semibold text-purple-300">Recommandation :</p>
                              <p className="text-sm text-purple-200">{vuln.recommendation}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-purple-400">
                              <span className="rounded bg-purple-500/20 px-2 py-1">CVE: {vuln.cve}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="rounded-2xl border border-purple-500/30 bg-black/40 p-8 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="size-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Historique des Scans</h2>
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center">
                <Eye className="mx-auto mb-4 size-16 text-purple-400 opacity-50" />
                <p className="text-purple-300">Aucun scan effectué pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((scan) => (
                  <div key={`${scan.url}-${scan.timestamp}`} className="rounded-xl border border-purple-500/20 bg-black/30 p-6 transition-all hover:border-purple-500/40">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <p className="mb-1 break-all font-semibold text-white">{scan.url}</p>
                        <p className="text-sm text-purple-400">{scan.timestamp}</p>
                      </div>
                      <div className={`ml-4 text-2xl font-bold ${getScoreColor(scan.securityScore)}`}>
                        {scan.securityScore}/100
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      {scan.criticalCount > 0 && (
                        <span className="rounded-full bg-red-500/20 px-3 py-1 text-red-400">
                          {scan.criticalCount} Critique(s)
                        </span>
                      )}
                      {scan.highCount > 0 && (
                        <span className="rounded-full bg-orange-500/20 px-3 py-1 text-orange-400">
                          {scan.highCount} Élevée(s)
                        </span>
                      )}
                      {scan.mediumCount > 0 && (
                        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400">
                          {scan.mediumCount} Moyenne(s)
                        </span>
                      )}
                      {scan.totalVulnerabilities === 0 && (
                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-400">
                          ✓ Sécurisé
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityScanner;