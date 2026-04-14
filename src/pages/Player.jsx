import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playerOf, teamOf, FIXTURES, formatKST } from '../data.js';
import { Header, Tabs, TeamBadge } from '../ui.jsx';

const TABS = [
  { value: 'season',   label: '시즌 기록' },
  { value: 'career',   label: '통산' },
  { value: 'transfer', label: '이적' },
  { value: 'injury',   label: '부상' },
];

export default function Player() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tab, setTab] = useState('season');
  const player = playerOf(id);

  if (!player) {
    return <div className="screen"><Header title="선수" back /><div className="empty">선수를 찾을 수 없습니다.</div></div>;
  }

  const team = teamOf(player.team);
  const recentMatches = FIXTURES
    .filter((f) => (f.home === player.team || f.away === player.team) && (f.status === 'FT' || f.status === 'AET'))
    .slice(0, 3);

  const age = Math.floor((Date.now() - new Date(player.birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <div className="screen no-tabbar">
      <Header title="선수 상세" back />

      <div style={{ padding: '24px 22px', textAlign: 'center' }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: `linear-gradient(135deg, ${team?.color || '#333'} 0%, ${team?.color || '#333'}80 100%)`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, boxShadow: 'var(--shadow-card)',
        }}>{player.photo}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 14, letterSpacing: '-0.3px' }}>{player.name}</h2>
        <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{player.eng}</div>

        <div className="hstack" style={{ justifyContent: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <span className="pill">{player.pos}</span>
          <span className="pill">#{player.number}</span>
          {team && (
            <button className="pill" onClick={() => team.league !== 'national' && nav('/team/' + team.id)}>
              <TeamBadge teamId={team.id} size="xs" /> {team.name}
            </button>
          )}
          <span className="pill">🇰🇷 {player.nat}</span>
        </div>

        <div className="muted" style={{ fontSize: 13, marginTop: 14 }}>
          {player.height}cm · {player.birth} · 만 {age}세
        </div>
      </div>

      <Tabs options={TABS} value={tab} onChange={setTab} />

      {tab === 'season' && (
        <div style={{ padding: '20px 22px 32px' }}>
          <div className="card card-compact">
            <div className="h-small" style={{ marginBottom: 12 }}>2026 시즌</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {Object.entries(player.seasonStats).map(([key, val]) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.44px' }}>{val}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{statLabel(key)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-small" style={{ margin: '20px 0 10px' }}>최근 경기</div>
          {recentMatches.length === 0 ? (
            <div className="empty" style={{ padding: 16 }}>최근 경기 없음</div>
          ) : (
            recentMatches.map((f) => {
              const opp = f.home === player.team ? f.away : f.home;
              return (
                <article key={f.id} className="card card-compact clickable" onClick={() => nav('/match/' + f.id)} style={{ marginBottom: 8 }}>
                  <div className="hstack" style={{ justifyContent: 'space-between' }}>
                    <div>
                      <div className="body-strong">vs {teamOf(opp)?.short}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{formatKST(f.date)}</div>
                    </div>
                    <div className="mono body-strong">{f.goals.home}-{f.goals.away}</div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {tab === 'career' && (
        <div className="empty" style={{ padding: 32 }}>
          <span className="empty-emoji">📜</span>
          통산 기록은 다음 업데이트에 제공됩니다.
        </div>
      )}
      {tab === 'transfer' && (
        <div className="empty" style={{ padding: 32 }}>
          <span className="empty-emoji">↔️</span>
          이적 히스토리는 다음 업데이트에 제공됩니다.
        </div>
      )}
      {tab === 'injury' && (
        <div className="empty" style={{ padding: 32 }}>
          <span className="empty-emoji">🩹</span>
          현재 보고된 부상이 없습니다.
        </div>
      )}
    </div>
  );
}

function statLabel(key) {
  const map = {
    games: '경기', goals: '골', assists: '도움',
    clean: '클린시트', saves: '세이브', conceded: '실점', passes: '패스', rating: '평점',
  };
  return map[key] || key;
}
