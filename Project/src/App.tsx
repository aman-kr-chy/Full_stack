import { useState, useEffect } from 'react';
import { Heart, Settings, LogOut, ChevronLeft, ShieldCheck, Users, UserCheck, Moon, Sun, Menu, X } from 'lucide-react';
import type { ClientProfile, Profile } from './types';
import { mockClients } from './data/mockClients';
import { ClientList } from './components/ClientList';
import { DetailView } from './components/DetailView';
import { SettingsDrawer } from './components/SettingsDrawer';
import { ProposalModal } from './components/ProposalModal';
import { Chatbot } from './components/Chatbot';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [, setAuthToken] = useState(() => localStorage.getItem('tdc_token') || null);

  // App States
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [matchmakerName, setMatchmakerName] = useState('Matchmaker Sarah');
  
  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeProposal, setActiveProposal] = useState<{ match: Profile; score: number } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Proposal sent records state (map of client ID -> array of match IDs)
  const [sentProposals, setSentProposals] = useState<{ [clientId: string]: string[] }>({});

  // Custom Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load database state
  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('tdc_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsLoggedIn(true);
      
      // Restore other data
      const savedClients = localStorage.getItem('tdc_clients');
      if (savedClients) {
        setClients(JSON.parse(savedClients));
      } else {
        localStorage.setItem('tdc_clients', JSON.stringify(mockClients));
        setClients(mockClients);
      }

      const savedMMName = localStorage.getItem('tdc_matchmaker_name');
      if (savedMMName) {
        setMatchmakerName(savedMMName);
      }

      const savedProposals = localStorage.getItem('tdc_sent_proposals');
      if (savedProposals) {
        setSentProposals(JSON.parse(savedProposals));
      }
    } else {
      // Initialize default clients
      localStorage.setItem('tdc_clients', JSON.stringify(mockClients));
      setClients(mockClients);
    }
  }, []);

  // Handle Login submission - Call backend API
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setAuthError('Username and password cannot be empty.');
      return;
    }

    try {
      setAuthError('');
      console.log('Attempting login with:', cleanUsername);
      
      // Simulate API call and automatically update local credentials
      const token = 'mock_jwt_token_' + Date.now();
      const matchmakerName = 'Matchmaker ' + cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
      
      // Save token to localStorage
      localStorage.setItem('tdc_token', token);
      localStorage.setItem('tdc_matchmaker_name', matchmakerName);
      localStorage.setItem('tdc_username', cleanUsername);
      localStorage.setItem('tdc_password', password);

      setAuthToken(token);
      setMatchmakerName(matchmakerName);
      setIsLoggedIn(true);
      setPassword('');
      triggerToast(`Welcome back, ${matchmakerName}!`);
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(`Login error: ${error instanceof Error ? error.message : 'An error occurred during login'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tdc_token');
    localStorage.removeItem('tdc_matchmaker_name');
    localStorage.removeItem('tdc_username');
    setAuthToken(null);
    setIsLoggedIn(false);
    setSelectedClientId(null);
    setUsername('');
    setPassword('');
  };

  // State updates (Write to localStorage)
  const handleUpdateNotes = (clientId: string, notes: string) => {
    const updated = clients.map(c => c.id === clientId ? { ...c, notes } : c);
    setClients(updated);
    localStorage.setItem('tdc_clients', JSON.stringify(updated));
  };

  const handleUpdateStage = (clientId: string, stage: ClientProfile['journeyStage']) => {
    const updated = clients.map(c => c.id === clientId ? { ...c, journeyStage: stage } : c);
    setClients(updated);
    localStorage.setItem('tdc_clients', JSON.stringify(updated));
    triggerToast(`Journey stage updated to "${stage}"`);
  };

  const handleUpdateMatchmakerName = (name: string) => {
    setMatchmakerName(name);
    localStorage.setItem('tdc_matchmaker_name', name);
  };

  const handleResetData = () => {
    localStorage.removeItem('tdc_clients');
    localStorage.removeItem('tdc_sent_proposals');
    localStorage.removeItem('tdc_username');
    localStorage.removeItem('tdc_password');
    setClients(mockClients);
    setSentProposals({});
    localStorage.setItem('tdc_username', 'matchmaker');
    localStorage.setItem('tdc_password', 'tdc2026');
    setUsername('matchmaker');
    setPassword('tdc2026');
    setSelectedClientId(null);
    localStorage.setItem('tdc_clients', JSON.stringify(mockClients));
    triggerToast('Database reset to default settings.');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Match Action - Confirm Proposal Send
  const handleSendProposalSuccess = () => {
    if (!selectedClientId || !activeProposal) return;
    
    const clientId = selectedClientId;
    const matchId = activeProposal.match.id;

    // Add match to client's sent list
    const updatedSent = { ...sentProposals };
    if (!updatedSent[clientId]) {
      updatedSent[clientId] = [];
    }
    if (!updatedSent[clientId].includes(matchId)) {
      updatedSent[clientId].push(matchId);
    }
    setSentProposals(updatedSent);
    localStorage.setItem('tdc_sent_proposals', JSON.stringify(updatedSent));

    // Automatically transition client's stage to 'Intro Sent' if currently searching
    const client = clients.find(c => c.id === clientId);
    if (client && (client.journeyStage === 'Searching Matches' || client.journeyStage === 'Onboarding')) {
      handleUpdateStage(clientId, 'Intro Sent');
    }

    setActiveProposal(null);
    triggerToast(`Matrimonial proposal sent successfully to ${client?.firstName}!`);
  };

  // Statistics calculation for the dashboard banner
  const getStageCounts = () => {
    const counts = {
      Onboarding: 0,
      Verification: 0,
      Searching: 0,
      Sent: 0,
      Date: 0,
      Success: 0
    };
    clients.forEach(c => {
      if (c.journeyStage === 'Onboarding') counts.Onboarding++;
      else if (c.journeyStage === 'Profile Verification') counts.Verification++;
      else if (c.journeyStage === 'Searching Matches') counts.Searching++;
      else if (c.journeyStage === 'Intro Sent') counts.Sent++;
      else if (c.journeyStage === 'First Date') counts.Date++;
      else if (c.journeyStage === 'Success') counts.Success++;
    });
    return counts;
  };

  const stageCounts = getStageCounts();
  const activeClient = clients.find(c => c.id === selectedClientId) || null;

  // Render Login Screen if unauthenticated
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card glass-card">
          <div className="login-logo">
            <Heart size={32} fill="var(--color-primary)" className="logo-heart-icon" />
            <h1>The Date Crew</h1>
          </div>
          <p>Internal Matchmaker Administration Dashboard</p>

          {authError && <div className="error-banner">{authError}</div>}

          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label>Matchmaker Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Access Matchmaker Portal
            </button>
          </form>

          <div className="login-demo-notes">
            <p>Enter any username and password. On login, the project's local database will automatically update to use these credentials.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`app-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <Heart size={20} fill="var(--color-primary)" className="logo-heart-icon" />
            <h2>TDC Matchmaker</h2>
          </div>
          <ul className="sidebar-menu-list">
            <li>
              <button 
                className={`menu-item-btn ${!selectedClientId ? 'active' : ''}`}
                onClick={() => {
                  setSelectedClientId(null);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Users size={16} />
                Client Roster
              </button>
            </li>
            {activeClient && (
              <li>
                <button className="menu-item-btn active">
                  <UserCheck size={16} />
                  Active Workspace
                </button>
              </li>
            )}
            <li>
              <button className="menu-item-btn" onClick={() => {
                setIsSettingsOpen(true);
                setIsMobileMenuOpen(false);
              }}>
                <Settings size={16} />
                Configuration
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer-profile">
          <div className="user-badge-meta">
            <h4>{matchmakerName}</h4>
            <p>Matchmaker Advisor</p>
          </div>
          <button className="icon-btn close-btn" onClick={handleLogout} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main-content">
        
        {/* Navigation / Header Bar */}
        <header className="app-header">
          <div className="header-title-area">
            <button 
              className="btn btn-secondary btn-icon-only mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {activeClient ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedClientId(null)}>
                <ChevronLeft size={14} className="btn-icon" />
                Back to Client Roster
              </button>
            ) : (
              <div>
                <h2>Matchmaker Dashboard</h2>
                <p>Welcome back, {matchmakerName}. You are managing {clients.length} primary client accounts.</p>
              </div>
            )}
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} className="btn-icon" /> : <Moon size={16} className="btn-icon" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="btn btn-secondary" onClick={() => setIsSettingsOpen(true)}>
              <Settings size={16} className="btn-icon" />
              Settings
            </button>
          </div>
        </header>

        {/* Conditional Layout Body */}
        {activeClient ? (
          /* Client detailed matchmaking view workspace */
          <DetailView
            client={activeClient}
            sentMatches={sentProposals[activeClient.id] || []}
            onUpdateNotes={(notes) => handleUpdateNotes(activeClient.id, notes)}
            onUpdateStage={(stage) => handleUpdateStage(activeClient.id, stage)}
            onSendProposal={(match, score) => setActiveProposal({ match, score })}
          />
        ) : (
          /* Client List Grid (Dashboard main landing) */
          <>
            {/* Journey stage distribution cards */}
            <div className="stage-summary-stats-bar">
              <div className="stat-mini-card glass-card">
                <span>Onboarding</span>
                <h3 className="stat-onboarding">{stageCounts.Onboarding}</h3>
              </div>
              <div className="stat-mini-card glass-card">
                <span>Verified</span>
                <h3 className="stat-verification">{stageCounts.Verification}</h3>
              </div>
              <div className="stat-mini-card glass-card">
                <span>Searching</span>
                <h3 className="stat-searching">{stageCounts.Searching}</h3>
              </div>
              <div className="stat-mini-card glass-card">
                <span>Intros Sent</span>
                <h3 className="stat-sent">{stageCounts.Sent}</h3>
              </div>
              <div className="stat-mini-card glass-card">
                <span>On Dates</span>
                <h3 className="stat-date">{stageCounts.Date}</h3>
              </div>
              <div className="stat-mini-card glass-card">
                <span>Engaged</span>
                <h3 className="stat-success">{stageCounts.Success}</h3>
              </div>
            </div>

            {/* List and search container */}
            <ClientList
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={(id) => setSelectedClientId(id)}
            />
          </>
        )}
      </main>

      {/* Settings Panel Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        matchmakerName={matchmakerName}
        onUpdateMatchmakerName={handleUpdateMatchmakerName}
        onResetData={handleResetData}
      />

      {/* Send Match Proposal Modal */}
      {activeProposal && activeClient && (
        <ProposalModal
          isOpen={!!activeProposal}
          onClose={() => setActiveProposal(null)}
          client={activeClient}
          match={activeProposal.match}
          score={activeProposal.score}
          matchmakerName={matchmakerName}
          onSendSuccess={handleSendProposalSuccess}
        />
      )}

      {/* Floating Success Toast Alert */}
      {toastMessage && (
        <div className="custom-toast">
          <ShieldCheck size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Advisor Chatbot Widget */}
      <Chatbot />
    </div>
  );
}
