import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { evaluatePassword } from '../../utils/validators';

export const PasswordStrengthMeter = ({ password = '', showRules = true }) => {
  const { criteria, score, label, color, isValid } = evaluatePassword(password);

  if (!password && !showRules) return null;

  return (
    <div className="password-strength-wrap" aria-live="polite">
      {/* Header with Strength Label and Score */}
      <div className="strength-header">
        <div className="strength-label" style={{ color }}>
          {isValid ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
          <span>{label}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {score}%
        </span>
      </div>

      {/* Visual Progress Bar */}
      <div className="strength-bar-track">
        <div
          className="strength-bar-fill"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Rules list with real-time feedback */}
      {showRules && (
        <ul className="strength-rules-list">
          {criteria.map((rule) => (
            <li
              key={rule.id}
              className={`strength-rule-item ${rule.met ? 'is-met' : ''}`}
            >
              <span className="strength-rule-icon">
                {rule.met ? (
                  <Check size={13} strokeWidth={2.5} />
                ) : (
                  <X size={13} strokeWidth={2} style={{ opacity: 0.6 }} />
                )}
              </span>
              <span>{rule.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
