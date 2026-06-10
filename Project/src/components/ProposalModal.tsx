import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Mail } from 'lucide-react';
import type { Profile, ClientProfile } from '../types';
import { generateEmailProposal } from '../services/ai';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfile;
  match: Profile;
  score: number;
  matchmakerName: string;
  onSendSuccess: (introText: string) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  client,
  match,
  score,
  matchmakerName,
  onSendSuccess
}) => {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadEmail = async () => {
        setLoading(true);
        try {
          const email = await generateEmailProposal(client, match, score, matchmakerName);
          setEmailText(email);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      loadEmail();
    }
  }, [isOpen, client, match, score, matchmakerName]);

  if (!isOpen) return null;

  const handleSend = async () => {
    setLoading(true);
    try {
      const toEmail = "amanpc847101@gmail.com"; // Hardcoded to your email for testing

      // Using FormSubmit for zero-config email sending
      const response = await fetch(`https://formsubmit.co/ajax/${toEmail}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Match Recommendation for ${client.firstName}`,
          _template: 'box', // Clean email template
          _replyto: client.email,
          message: emailText
        })
      });

      const result = await response.json();
      
      if (result.success === "true") {
        onSendSuccess(emailText);
        // Note: First time only, they will need to click the activation link in their email
        alert("Success! Check your email inbox. (Note: The first time, FormSubmit might send an activation link to verify your email).");
      } else {
        alert("Failed to send automatically. Check console.");
        console.error(result);
      }
    } catch (error) {
      console.error(error);
      alert(`Error sending message: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Mail size={20} className="header-icon" />
            Send Proposal Recommendation
          </h3>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Candidate Overview Card */}
          <div className="candidate-summary-bar">
            <div className="cand-avatar-initials" data-seed={match.avatarSeed}>
              {match.firstName[0]}
              {match.lastName[0]}
            </div>
            <div className="cand-info">
              <h4>
                {match.firstName} {match.lastName}
              </h4>
              <p>
                {match.age} yrs • {match.city} • {match.religion} ({match.caste})
              </p>
              <p className="cand-subtitle">
                {match.designation} at {match.company}
              </p>
            </div>
            <div className="compat-pill-badge" data-level={score >= 85 ? 'exceptional' : score >= 72 ? 'strong' : 'moderate'}>
              {score}% Fit
            </div>
          </div>

          {/* Email Editor Area */}
          <div className="email-editor-section">
            <div className="email-meta-inputs">
              <div className="meta-row">
                <span className="meta-label">From:</span>
                <span className="meta-value">{matchmakerName} &lt;team@thedatecrew.com&gt;</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">To:</span>
                <span className="meta-value">
                  {client.firstName} {client.lastName} &lt;{client.email}&gt;
                </span>
              </div>
            </div>

            <div className="email-body-editor">
              {loading ? (
                <div className="loader-container">
                  <Loader2 className="spinner" size={32} />
                  <p>AI is drafting a highly personalized introduction email...</p>
                  <span className="loader-note">Analyzing bios, careers, location and dietary preferences...</span>
                </div>
              ) : (
                <div className="editor-textarea-wrapper">
                  <div className="editor-ribbon">
                    <span className="ribbon-text">
                      <Sparkles size={14} className="sparkle-icon" />
                      AI-Optimized Matrimonial Proposal
                    </span>
                  </div>
                  <textarea
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    rows={12}
                    placeholder="Enter email message body..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
            <Send size={16} className="btn-icon" />
            Send Match Recommendation
          </button>
        </div>
      </div>
    </div>
  );
};
