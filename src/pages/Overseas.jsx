import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OVERSEAS_ITEMS, playerOf } from '../data.js';
import { Header, ChipRow } from '../ui.jsx';

const FILTERS = [
  { value: 'week', label: '이번 주' },
  { value: 'next', label: '다음 경기' },
  { value: 'all',  label: '전체' },
];

const BY_LEAGUE = OVERSEAS_ITEMS.reduce((acc, o) => {
  if (!acc[o.league]) acc[o.league] = [];
  acc[o.league].push(o);
  return acc;
}, {});

export default function Overseas() {
  const nav = useNavigate();
  const [filter, setFilter] = useState('week');

  return (
    <div className="screen">
      <Header title="해외파" />
      <ChipRow options={FILTERS} value={filter} onChange={setFilter} />

      <div style={{ padding: '16px 22px 32px' }}>
        {Object.entries(BY_LEAGUE).map(([league, items]) => (
          <section key={league} style={{ marginBottom: 24 }}>
            <div className="hstack" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{items[0].leagueFlag}</span>
              <div className="h-small">{league}</div>
            </div>
            <div className="vstack">
              {items.map((o) => {
                const p = playerOf(o.playerId);
                return (
                  <article
                    key={o.playerId}
                    className="card card-compact clickable"
                    onClick={() => nav('/player/' + o.playerId)}
                  >
                    <div className="hstack" style={{ gap: 14 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: 'var(--softer-surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, flexShrink: 0,
                      }}>{p.photo}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="hstack" style={{ justifyContent: 'space-between' }}>
                          <div className="body-strong" style={{ fontSize: 15 }}>{p.name}</div>
                          <div className="muted mono" style={{ fontSize: 11 }}>평점 {o.last.rating}</div>
                        </div>
                        <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{o.teamName}</div>
                        <div className="divider" style={{ margin: '8px 0' }} />
                        <div style={{ fontSize: 13 }}>
                          <div><span className="muted">지난 경기</span> vs {o.last.opp} <span className="mono">{o.last.gf}-{o.last.ga}</span>
                            {o.last.goals > 0 && <span style={{ color: 'var(--rausch)', marginLeft: 6 }}>⚽ {o.last.goals}골</span>}
                            {o.last.assists > 0 && <span className="muted" style={{ marginLeft: 6 }}>🎯 {o.last.assists}</span>}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <span className="muted">다음 경기</span> {o.next.date} vs {o.next.opp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <p className="muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 24 }}>
          관심 선수는 마이 · 알림 설정에서 추가/삭제할 수 있어요
        </p>
      </div>
    </div>
  );
}
