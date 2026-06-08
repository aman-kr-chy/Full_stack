import React, { useState, useEffect } from 'react';
import { X, Key, User, RotateCcw, ShieldCheck } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  matchmakerName: string;
  onUpdateMatchmakerName: (name: string) => void;
  onResetData: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  matchmakerName,
  onUpdateMatchmakerName,
  onResetData
}) => {
  const [apiKey, setApiKey] = useState('');
  const [nameInput, setNameInput] = useState(matchmakerName);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key') || '';
    setApiKey(savedKey);
    setNameInput(matchmakerName);
  }, [isOpen, matchmakerName]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('openai_api_key', apiKey.trim());
    onUpdateMatchmakerName(nameInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>
            <User size={20} className="header-icon" />
            Matchmaker Settings
          </h3>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="drawer-body">
          <div className="form-group">
            <label>Matchmaker Profile Name</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Matchmaker Sarah"
                required
              />
            </div>
            <span className="help-text">Used as the email signature when sending proposal recommendations to clients.</span>
          </div>

          <div className="form-group">
            <label>OpenAI API Key (Optional)</label>
            <div className="input-with-icon">
              <Key size={16} className="input-icon" />
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <button
                type="button"
                className="show-hide-btn"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <span className="help-text font-accent">
              If provided, the system uses GPT-4o-mini to write custom intros and compatibilities. If left empty, it runs our smart client-side logic.
            </span>
          </div>

          <div className="settings-notice">
            <ShieldCheck size={16} className="notice-icon" />
            <p>Your API key is stored 100% locally in your browser's LocalStorage and is only sent directly to OpenAI's official API.</p>
          </div>

          <button type="submit" className="btn btn-primary btn-save">
            {isSaved ? 'Settings Saved!' : 'Save & Apply'}
          </button>

          <hr className="drawer-divider" />

          <div className="danger-zone">
            <h4>Maintenance Actions</h4>
            <p className="danger-text">If you want to clear all meeting notes, reset journey stages, and clear proposal history back to the original demo state:</p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all client records, meeting notes, and history? All current changes will be lost.')) {
                  onResetData();
                  onClose();
                }
              }}
            >
              <RotateCcw size={16} className="btn-icon" />
              Reset Local Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
