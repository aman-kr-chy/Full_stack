import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Heart, Flame, MessageSquare, ClipboardList, CheckCircle, Sparkles } from 'lucide-react';
import type { ClientProfile, Profile } from '../types';
import { MatchEngine } from './MatchEngine';

interface DetailViewProps {
  client: ClientProfile;
  sentMatches: string[];
  onUpdateNotes: (notes: string) => void;
  onUpdateStage: (stage: ClientProfile['journeyStage']) => void;
  onSendProposal: (match: Profile, score: number) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  client,
  sentMatches,
  onUpdateNotes,
  onUpdateStage,
  onSendProposal
}) => {
  const [notesInput, setNotesInput] = useState(client.notes);

  useEffect(() => {
    setNotesInput(client.notes);
  }, [client]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotesInput(val);
    onUpdateNotes(val); // Bubbles up to trigger LocalStorage save
  };

  const stages: ClientProfile['journeyStage'][] = [
    'Onboarding',
    'Profile Verification',
    'Searching Matches',
    'Intro Sent',
    'First Date',
    'Success'
  ];

  return (
    <div className="detail-view-container">
      {/* Client Overview Card */}
      <div className="client-detail-header glass-card">
        <div className="client-avatar-row">
          <div className="client-avatar-large" data-seed={client.avatarSeed}>
            {client.firstName[0]}
            {client.lastName[0]}
          </div>
          <div className="client-header-meta">
            <h2>
              {client.firstName} {client.lastName}
              <span className="client-gender-badge" data-gender={client.gender}>
                {client.gender[0]}
              </span>
            </h2>
            <p className="client-quick-desc">
              {client.age} yrs • {client.city}, {client.country} • {client.maritalStatus}
            </p>
            <p className="client-job-summary">
              {client.designation} at {client.company} ({client.income} LPA)
            </p>
          </div>
        </div>

        {/* Journey Stepper Progress Bar */}
        <div className="journey-stepper-wrapper">
          <label className="section-label">Matrimonial Journey Stage</label>
          <div className="stepper-track">
            {stages.map((stage, idx) => {
              const isActive = client.journeyStage === stage;
              const isCompleted = stages.indexOf(client.journeyStage) >= idx;

              return (
                <button
                  key={stage}
                  className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => onUpdateStage(stage)}
                  title={`Update stage to ${stage}`}
                >
                  <div className="node-circle">
                    {isCompleted && !isActive ? <CheckCircle size={12} /> : idx + 1}
                  </div>
                  <span className="node-label">{stage}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Split Columns Workspace */}
      <div className="workspace-columns">
        
        {/* Left Column: Profile Info & Matchmaker Meeting Notes */}
        <div className="workspace-left-pane">
          
          {/* Notes Journal Card */}
          <div className="notes-journal-card glass-card">
            <h3>
              <MessageSquare size={18} className="header-icon" />
              Matchmaker Meeting & Call Notes
            </h3>
            <textarea
              value={notesInput}
              onChange={handleNotesChange}
              placeholder="Record quick summaries here from calls, client expectations, family preferences, or face-to-face meetings..."
              rows={5}
            />
            <span className="save-indicator">Changes auto-save instantly to local cache.</span>
          </div>

          {/* Full Biodata Breakdown */}
          <div className="biodata-breakdown-card glass-card">
            <h3>
              <ClipboardList size={18} className="header-icon" />
              Full Biodata Details
            </h3>

            {/* Profile Categories Grid */}
            <div className="biodata-sections">
              
              {/* Category: Personal details */}
              <div className="biodata-group">
                <h4>
                  <User size={14} className="group-icon" />
                  Personal Information
                </h4>
                <div className="info-list">
                  <div className="info-item"><span className="lbl">First Name:</span><span className="val">{client.firstName}</span></div>
                  <div className="info-item"><span className="lbl">Last Name:</span><span className="val">{client.lastName}</span></div>
                  <div className="info-item"><span className="lbl">Gender:</span><span className="val">{client.gender}</span></div>
                  <div className="info-item"><span className="lbl">Date of Birth:</span><span className="val">{client.dob}</span></div>
                  <div className="info-item"><span className="lbl">Height:</span><span className="val">{client.height}</span></div>
                  <div className="info-item"><span className="lbl">Languages Known:</span><span className="val">{client.languages.join(', ')}</span></div>
                  <div className="info-item"><span className="lbl">Siblings:</span><span className="val">{client.siblings}</span></div>
                </div>
              </div>

              {/* Category: Education & Career */}
              <div className="biodata-group">
                <h4>
                  <GraduationCap size={14} className="group-icon" />
                  Education & Profession
                </h4>
                <div className="info-list">
                  <div className="info-item"><span className="lbl">College:</span><span className="val">{client.college}</span></div>
                  <div className="info-item"><span className="lbl">Degree:</span><span className="val">{client.degree}</span></div>
                  <div className="info-item"><span className="lbl">Current Company:</span><span className="val">{client.company}</span></div>
                  <div className="info-item"><span className="lbl">Designation:</span><span className="val">{client.designation}</span></div>
                  <div className="info-item"><span className="lbl">Annual Income:</span><span className="val">{client.income} LPA</span></div>
                </div>
              </div>

              {/* Category: Cultural Parameters */}
              <div className="biodata-group">
                <h4>
                  <Flame size={14} className="group-icon" />
                  Culture & Religion
                </h4>
                <div className="info-list">
                  <div className="info-item"><span className="lbl">Religion:</span><span className="val">{client.religion}</span></div>
                  <div className="info-item"><span className="lbl">Caste / Community:</span><span className="val">{client.caste}</span></div>
                  <div className="info-item"><span className="lbl">Mother Tongue:</span><span className="val">{client.motherTongue}</span></div>
                  <div className="info-item"><span className="lbl">Manglik Status:</span><span className="val">{client.manglik}</span></div>
                  <div className="info-item"><span className="lbl">Horoscope Matching:</span><span className="val">{client.horoscopeRequired ? 'Required' : 'Not Needed'}</span></div>
                </div>
              </div>

              {/* Category: Preferences & Lifestyle */}
              <div className="biodata-group">
                <h4>
                  <Heart size={14} className="group-icon" />
                  Lifestyle & Preferences
                </h4>
                <div className="info-list">
                  <div className="info-item"><span className="lbl">Diet:</span><span className="val">{client.diet}</span></div>
                  <div className="info-item"><span className="lbl">Want Kids:</span><span className="val">{client.wantKids}</span></div>
                  <div className="info-item"><span className="lbl">Open to Relocate:</span><span className="val">{client.openToRelocate}</span></div>
                  <div className="info-item"><span className="lbl">Open to Pets:</span><span className="val">{client.openToPets}</span></div>
                  <div className="info-item"><span className="lbl">Drinking:</span><span className="val">{client.drinking}</span></div>
                  <div className="info-item"><span className="lbl">Smoking:</span><span className="val">{client.smoking}</span></div>
                </div>
              </div>

            </div>

            {/* Self Bio */}
            <div className="client-bio-section">
              <span className="bio-label">Self Description:</span>
              <p className="bio-text">"{client.bio}"</p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Match Recommendations */}
        <div className="workspace-right-pane">
          <div className="matches-pane-header">
            <h3>
              <Sparkles size={18} className="header-icon text-accent" />
              Recommended Matrimonial Profiles
            </h3>
            <span className="pool-size-label">120 opposite-gender candidates matched</span>
          </div>

          <MatchEngine
            client={client}
            sentMatches={sentMatches}
            onSendProposal={onSendProposal}
          />
        </div>

      </div>
    </div>
  );
};
