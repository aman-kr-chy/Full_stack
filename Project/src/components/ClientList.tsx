import React, { useState } from 'react';
import { Search, Filter, Users, RefreshCw } from 'lucide-react';
import type { ClientProfile } from '../types';
import { ClientCard } from './ClientCard';

interface ClientListProps {
  clients: ClientProfile[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  selectedClientId,
  onSelectClient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  const stages = [
    'All',
    'Onboarding',
    'Profile Verification',
    'Searching Matches',
    'Intro Sent',
    'First Date',
    'Success'
  ];

  const filteredClients = clients.filter((client) => {
    const matchesSearch = `${client.firstName} ${client.lastName} ${client.city} ${client.caste} ${client.designation}`.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || client.journeyStage === selectedStage;
    const matchesGender = selectedGender === 'All' || client.gender === selectedGender;

    return matchesSearch && matchesStage && matchesGender;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStage('All');
    setSelectedGender('All');
  };

  return (
    <div className="client-list-section">
      {/* Top Filter Controls Bar */}
      <div className="list-controls-bar glass-card">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assigned clients by name, location, profession..."
          />
        </div>

        <div className="filters-wrapper">
          <div className="filter-select-group">
            <Filter size={14} className="filter-icon" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="All">All Journey Stages</option>
              {stages.slice(1).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <Users size={14} className="filter-icon" />
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="All">All Genders</option>
              <option value="Male">Males</option>
              <option value="Female">Females</option>
            </select>
          </div>

          <button
            className="btn btn-secondary btn-icon-only"
            onClick={clearFilters}
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      {filteredClients.length === 0 ? (
        <div className="empty-state-card glass-card">
          <Users size={36} className="empty-state-icon" />
          <h4>No Clients Found</h4>
          <p>We couldn't find any clients matching your filter criteria. Try resetting filters.</p>
          <button className="btn btn-primary btn-sm" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="client-cards-grid">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              isSelected={client.id === selectedClientId}
              onSelect={() => onSelectClient(client.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
