import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamOf, formatKST, daysUntil } from './data.js';

/** Team color/initials circle badge. */
export function TeamBadge({ teamId, size = 'md' }) {
  const t = teamOf(teamId);
  if (!t) return <div className={`team-badge ${size}`} style={{ background: '#ccc' }}>?</div>;
  return (
    <div className={`team-badge ${size}`} style={{ background: t.color }}>
      {t.short.slice(0, 2)}
    </div>
  );
}

/** Top header with optional back button and icon buttons. */
export function Header({ title, back, actions, plain }) {
  const nav = useNavigate();
  return (
    <header className={`app-header ${back ? 'with-back' : ''} ${plain ? 'plain' : ''}`}>
      {back && (
        <button className="icon-btn bare" aria-label="뒤로" onClick={() => nav(-1)}>←</button>
      )}
      <h1>{title}</h1>
      {actions}
    </header>
  );
}

/** A horizontal row of selectable chips. */
export function ChipRow({ options, value, onChange }) {
  return (
    <div className="chip-row">
      {options.map((o) => (
        <button
          key={o.value}
          className={'chip' + (value === o.value ? ' active' : '')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Underline tabs for detail screens. */
export function Tabs({ options, value, onChange }) {
  return (
    <div className="tabs">
      {options.map((o) => (
        <button
          key={o.value}
          className={'tab-item' + (value === o.value ? ' active' : '')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Match card used in lists and home recent section. */
export function MatchCard({ fixture, onClick }) {
  const home = teamOf(fixture.home);
  const away = teamOf(fixture.away);
  const isLive = fixture.status === 'LIVE';
  const isFinal = fixture.status === 'FT' || fixture.status === 'AET';
  const isScheduled = fixture.status === 'NS';

  return (
    <article className="match-card" onClick={onClick}>
      <div className="match-card-header">
        <span>{formatKST(fixture.date, false)}</span>
        {isLive && <span className="badge badge-live">LIVE {fixture.minute}'</span>}
        {isFinal && <span className="badge badge-final">종료</span>}
        {isScheduled && <span className="badge badge-scheduled">예정</span>}
      </div>
      <div className="match-card-teams">
        <div className="match-team">
          <TeamBadge teamId={home.id} />
          <span className="team-name">{home.name}</span>
        </div>
        <div>
          {fixture.goals ? (
            <div className="match-score">
              <span>{fixture.goals.home}</span>
              <span className="sep">-</span>
              <span>{fixture.goals.away}</span>
            </div>
          ) : (
            <div className="match-time">VS</div>
          )}
        </div>
        <div className="match-team">
          <TeamBadge teamId={away.id} />
          <span className="team-name">{away.name}</span>
        </div>
      </div>
      <div className="match-venue">🏟 {venueName(fixture.venue)}</div>
    </article>
  );
}

import { VENUES } from './data.js';
function venueName(id) {
  return VENUES[id]?.name || '';
}

/** Form pills (W/D/L). */
export function FormPills({ items }) {
  return (
    <div className="form-pills">
      {items.map((x, i) => (
        <span key={i} className={`form-pill ${x}`}>{x}</span>
      ))}
    </div>
  );
}

/** On/off switch toggle. */
export function Switch({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      className={'switch' + (on ? ' on' : '')}
      onClick={() => onChange(!on)}
    />
  );
}

/** Bottom-sheet style modal, dismissible. */
export function Modal({ open, title, body, actions, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        {title && <h3 className="modal-title">{title}</h3>}
        {body && <p className="modal-body">{body}</p>}
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

/** Transient toast. Uses a simple state reset after ~2s. */
export function useToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(t);
  }, [msg]);
  const view = msg ? <div className="toast">{msg}</div> : null;
  return [view, setMsg];
}

/** Days-until countdown used in hero card. */
export function Countdown({ iso }) {
  const d = daysUntil(iso);
  if (d < 0) return <span className="hero-countdown">종료</span>;
  if (d === 0) return <span className="hero-countdown">오늘</span>;
  return <span className="hero-countdown">D-{d}</span>;
}
