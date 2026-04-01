import { useState } from 'react';
import { ROLES, GOALS } from '../config/constants';

export default function Onboarding({ onComplete }) {
  const [step,  setStep]  = useState(0);
  const [name,  setName]  = useState('');
  const [role,  setRole]  = useState('');
  const [goals, setGoals] = useState([]);

  const toggle = g => setGoals(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);

  return (
    <div className="ob-bg">
      <div className="ob-card">
        <div className="ob-header">
          <div className="ob-logo">🤖</div>
          <h1 className="ob-title">AI Board</h1>
          <p className="ob-sub">Personalized AI summarize for development team</p>
        </div>

        {step === 0 && (
          <div className="ob-box">
            <h2>Who are you on the team? 👋</h2>
            <input
              className="name-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (optional)"
            />
            <h3>Select your role:</h3>
            <div className="roles-grid">
              {ROLES.map(r => (
                <div
                  key={r.id}
                  className={`role-card ${role === r.id ? 'sel' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  <div className="rc-icon">{r.icon}</div>
                  <div className="rc-title">{r.label}</div>
                  <div className="rc-desc">{r.desc}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" disabled={!role} onClick={() => role && setStep(1)}>
              Next →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="ob-box">
            <button className="btn-back" onClick={() => setStep(0)}>← Back</button>
            <h2>What do you want to track?</h2>
            <h3>Choose one or more goals:</h3>
            <div className="goals-list">
              {GOALS.map(g => (
                <button
                  key={g}
                  className={`goal-btn ${goals.includes(g) ? 'sel' : ''}`}
                  onClick={() => toggle(g)}
                >
                  {goals.includes(g) ? '✓  ' : ''}{g}
                </button>
              ))}
            </div>
            <button
              className="btn-primary"
              onClick={() => onComplete({ name: name.trim() || 'User', role, goals })}
            >
              Enter board →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
