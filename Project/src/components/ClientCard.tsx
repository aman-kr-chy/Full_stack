import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import type { ClientProfile } from '../types';

interface ClientCardProps {
  client: ClientProfile;
  isSelected: boolean;
  onSelect: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, isSelected, onSelect }) => {
  const stageBadgeColors: { [key in ClientProfile['journeyStage']]: string } = {
    'Onboarding': 'stage-onboarding',
    'Profile Verification': 'stage-verification',
    'Searching Matches': 'stage-searching',
    'Intro Sent': 'stage-sent',
    'First Date': 'stage-date', 
    'Success': 'stage-success'
  };

  return (
    <div
      className={`client-grid-card glass-card ${isSelected ? 'active-selection' : ''}`}
      onClick={onSelect}
    >
      <div className="card-top">
        <div className="avatar-initials" data-seed={client.avatarSeed}>
          {client.firstName[0]}
          {client.lastName[0]}
        </div>
        
        <div className="client-core-text">
          <div className="name-gender-row">
            <h4>
              {client.firstName} {client.lastName}
            </h4>
            <span className="gender-tag" data-gender={client.gender}>
              {client.gender === 'Male' ? 'M' : 'F'}
            </span>
          </div>
          
          <span className="client-subtitle-job">
            {client.designation}
          </span>
        </div>
      </div>

      <div className="card-middle">
        <div className="meta-info">
          <span>{client.age} yrs</span>
          <span className="bullet-separator">•</span>
          <span>{client.maritalStatus}</span>
        </div>
        <div className="location-info">
          <MapPin size={12} className="loc-icon" />
          <span>{client.city}</span>
        </div>
      </div>

      <div className="card-bottom">
        <span className={`stage-badge ${stageBadgeColors[client.journeyStage]}`}>
          {client.journeyStage}
        </span>
        
        <button className="card-arrow-btn">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
