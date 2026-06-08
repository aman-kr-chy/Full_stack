import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, Search, RefreshCw, Send, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Profile, ClientProfile, CompatibilityScore } from '../types';
import { calculateCompatibility } from '../services/matching';
import { generateMatchExplanation } from '../services/ai';
import { dummyPool } from '../data/dummyPool';

interface MatchEngineProps {
  client: ClientProfile;
  sentMatches: string[];
  onSendProposal: (match: Profile, score: number) => void;
}

interface MatchCandidate {
  profile: Profile;
  compatibility: CompatibilityScore;
}

export const MatchEngine: React.FC<MatchEngineProps> = ({
  client,
  sentMatches,
  onSendProposal
}) => {
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [minAge, setMinAge] = useState<number>(21);
  const [maxAge, setMaxAge] = useState<number>(40);
  const [minIncome, setMinIncome] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'age' | 'income'>('score');

  // AI Explanation Cache
  const [explanations, setExplanations] = useState<{ [matchId: string]: string }>({});
  const [loadingExpl, setLoadingExpl] = useState<{ [matchId: string]: boolean }>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    // Generate ranked list of opposite-gender candidates
    const oppositeGender = client.gender === 'Male' ? 'Female' : 'Male';
    const pool = dummyPool.filter(p => p.gender === oppositeGender);

    const calculated = pool.map(candidate => {
      const compatibility = calculateCompatibility(client, candidate);
      return { profile: candidate, compatibility };
    });

    setCandidates(calculated);
    setExplanations({});
    setExpandedCard(null);
  }, [client]);

  // Handle explanation generation on expand
  const handleToggleExpand = async (matchId: string, cand: MatchCandidate) => {
    if (expandedCard === matchId) {
      setExpandedCard(null);
      return;
    }

    setExpandedCard(matchId);

    if (!explanations[matchId]) {
      setLoadingExpl(prev => ({ ...prev, [matchId]: true }));
      try {
        const text = await generateMatchExplanation(client, cand.profile, cand.compatibility);
        setExplanations(prev => ({ ...prev, [matchId]: text }));
      } catch (e) {
        console.error(e);
        setExplanations(prev => ({ ...prev, [matchId]: 'Failed to generate AI analysis. Please check your network connection.' }));
      } finally {
        setLoadingExpl(prev => ({ ...prev, [matchId]: false }));
      }
    }
  };

  // Filter & Sort Logic
  const filteredCandidates = candidates.filter(cand => {
    const p = cand.profile;
    const matchSearch = `${p.firstName} ${p.lastName} ${p.designation} ${p.company} ${p.caste}`.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchAge = p.age >= minAge && p.age <= maxAge;
    const matchIncome = p.income >= minIncome;
    const matchCity = selectedCity === '' || p.city === selectedCity;
    const matchReligion = selectedReligion === '' || p.religion === selectedReligion;
    const matchDiet = selectedDiet === '' || p.diet === selectedDiet;

    return matchSearch && matchAge && matchIncome && matchCity && matchReligion && matchDiet;
  }).sort((a, b) => {
    if (sortBy === 'score') {
      return b.compatibility.score - a.compatibility.score;
    } else if (sortBy === 'age') {
      return a.profile.age - b.profile.age;
    } else {
      return b.profile.income - a.profile.income;
    }
  });

  const resetFilters = () => {
    setSearchQuery('');
    setMinAge(21);
    setMaxAge(40);
    setMinIncome(0);
    setSelectedCity('');
    setSelectedReligion('');
    setSelectedDiet('');
    setSortBy('score');
  };

  return (
    <div className="match-engine-container">
      {/* Search and Filters Header */}
      <div className="search-filters-header">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matching pool by name, company, designation, caste..."
          />
        </div>
        <div className="header-actions">
          <button 
            className={`btn btn-secondary btn-icon-only ${filtersOpen ? 'active' : ''}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
            title="Toggle Filters"
          >
            <SlidersHorizontal size={18} />
          </button>
          <button className="btn btn-secondary btn-icon-only" onClick={resetFilters} title="Reset Controls">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {filtersOpen && (
        <div className="advanced-filters-panel glass-card">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Age Range: {minAge} - {maxAge}</label>
              <div className="range-inputs">
                <input
                  type="range"
                  min={21}
                  max={40}
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                />
                <input
                  type="range"
                  min={21}
                  max={40}
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Min Income: {minIncome} LPA</label>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={minIncome}
                onChange={(e) => setMinIncome(Number(e.target.value))}
              />
            </div>

            <div className="filter-group">
              <label>City Proximity</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Religion</label>
              <select value={selectedReligion} onChange={(e) => setSelectedReligion(e.target.value)}>
                <option value="">All Religions</option>
                <option value="Hindu">Hindu</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Dietary Preference</label>
              <select value={selectedDiet} onChange={(e) => setSelectedDiet(e.target.value)}>
                <option value="">All Diets</option>
                <option value="Veg">Pure Veg</option>
                <option value="Jain">Jain Veg</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sorting Priority</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="score">Matchmaker Match Score</option>
                <option value="age">Age: Young to Old</option>
                <option value="income">Income: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Candidates List */}
      <div className="candidates-list">
        {filteredCandidates.length === 0 ? (
          <div className="empty-results glass-card">
            <AlertCircle size={28} className="empty-icon" />
            <p>No compatible matches found in the pool matching your active filter criteria.</p>
            <button className="btn btn-secondary" onClick={resetFilters}>Clear Filters</button>
          </div>
        ) : (
          filteredCandidates.map(cand => {
            const isSent = sentMatches.includes(cand.profile.id);
            const isExpanded = expandedCard === cand.profile.id;
            const score = cand.compatibility.score;

            return (
              <div key={cand.profile.id} className={`candidate-card glass-card ${isSent ? 'proposal-sent' : ''}`}>
                
                {/* Main Card Header */}
                <div className="candidate-card-header">
                  <div className="avatar-with-details">
                    <div className="cand-avatar-initials" data-seed={cand.profile.avatarSeed}>
                      {cand.profile.firstName[0]}
                      {cand.profile.lastName[0]}
                    </div>
                    <div className="cand-text-meta">
                      <div className="cand-name-row">
                        <h3>{cand.profile.firstName} {cand.profile.lastName}</h3>
                        <span className="diet-tag" data-diet={cand.profile.diet}>{cand.profile.diet}</span>
                        {cand.profile.manglik === 'Yes' && <span className="manglik-tag">Manglik</span>}
                      </div>
                      <p className="cand-location-age">
                        {cand.profile.age} yrs • {cand.profile.height} (${cand.profile.heightCm}cm) • {cand.profile.city}
                      </p>
                      <p className="cand-career">
                        <strong>{cand.profile.designation}</strong> at {cand.profile.company} • <span className="income-text">{cand.profile.income} LPA</span>
                      </p>
                    </div>
                  </div>

                  <div className="candidate-actions">
                    <div className="score-badge-wrapper">
                      <div className="score-percent" data-level={score >= 85 ? 'exceptional' : score >= 72 ? 'strong' : 'moderate'}>
                        {score}%
                      </div>
                      <span className="score-label">{cand.compatibility.level}</span>
                    </div>

                    {isSent ? (
                      <div className="sent-indicator">
                        <CheckCircle2 size={16} />
                        Sent
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm btn-match-action"
                        onClick={() => onSendProposal(cand.profile, score)}
                      >
                        <Send size={14} className="btn-icon" />
                        Send Match
                      </button>
                    )}
                  </div>
                </div>

                {/* Match Highlights / Bullet points */}
                <div className="match-compatibility-summary">
                  <div className="highlights-pills">
                    {cand.compatibility.highlights.slice(0, 4).map((highlight, idx) => (
                      <span key={idx} className="pill pill-success">{highlight}</span>
                    ))}
                  </div>
                  {cand.compatibility.conflicts.length > 0 && (
                    <div className="conflicts-warning-pills">
                      {cand.compatibility.conflicts.map((conflict, idx) => (
                        <span key={idx} className="pill pill-danger">
                          <AlertCircle size={10} className="pill-icon" />
                          {conflict}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Analyst Section Trigger */}
                <div className="ai-analyst-section">
                  <button 
                    className="ai-expand-trigger"
                    onClick={() => handleToggleExpand(cand.profile.id, cand)}
                  >
                    <div className="trigger-label">
                      <Sparkles size={14} className="sparkle-icon" />
                      <span>Matchmaker AI Fit Analysis</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="ai-expand-body">
                      {loadingExpl[cand.profile.id] ? (
                        <div className="ai-loading">
                          <div className="small-spinner"></div>
                          <span>Consulting AI analyst for profile compatibility...</span>
                        </div>
                      ) : (
                        <p className="ai-explanation-text">
                          {explanations[cand.profile.id]}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
