import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCheckins, fixtureOf, teamOf, venueOf, VENUES, formatKST, getMyTeam } from '../data.js';
import { Header, TeamBadge, Modal, useToast } from '../ui.jsx';

export default function Checkins() {
  const nav = useNavigate();
  const myTeam = getMyTeam();
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, showToast] = useToast();

  const list = useMemo(() => {
    return getCheckins().map((id) => fixtureOf(id)).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  const stats = useMemo(() => {
    let home = 0, away = 0, w = 0, d = 0, l = 0;
    for (const f of list) {
      if (!f.goals) continue;
      if (f.home === myTeam) home++;
      else if (f.away === myTeam) away++;
      const myG = f.home === myTeam ? f.goals.home : f.goals.away;
      const oppG = f.home === myTeam ? f.goals.away : f.goals.home;
      if (myG > oppG) w++;
      else if (myG < oppG) l++;
      else d++;
    }
    const winRate = (w + d + l) > 0 ? Math.round((w / (w + d + l)) * 100) : 0;
    return { total: list.length, home, away, w, d, l, winRate };
  }, [list, myTeam]);

  const visitedVenues = new Set(list.map((f) => f.venue));
  const k1Venues = Object.values(VENUES).slice(0, 12);

  return (
    <div className="screen no-tabbar">
      <Header
        title="직관 기록"
        back
        actions={<button className="icon-btn" aria-label="공유" onClick={() => setShareOpen(true)}>📤</button>}
      />

      <div style={{ padding: '20px 22px 32px' }}>
        <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>2026 시즌</div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.6px' }}>⚽ {stats.total}<span style={{ fontSize: 16, fontWeight: 500, marginLeft: 4 }}>경기</span></div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>홈 {stats.home} · 원정 {stats.away}</div>
          </div>
          <div className="divider" />
          <div className="hstack" style={{ justifyContent: 'space-around' }}>
            <Stat v={stats.w} l="승" c="var(--success)" />
            <Stat v={stats.d} l="무" c="var(--secondary-gray)" />
            <Stat v={stats.l} l="패" c="var(--rausch)" />
            <Stat v={`${stats.winRate}%`} l="승률" />
          </div>
        </div>

        <div className="h-small" style={{ margin: '24px 0 10px' }}>방문 경기장 ({visitedVenues.size}/{k1Venues.length})</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {k1Venues.map((v) => (
            <div
              key={v.id}
              style={{
                padding: '12px 8px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--hairline)',
                textAlign: 'center',
                background: visitedVenues.has(v.id) ? 'rgba(255,56,92,0.06)' : 'var(--white)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 20 }}>🏟</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, lineHeight: 1.2 }}>
                {v.name.replace(/(축구)?경기장|종합운동장|축구전용구장/g, '').trim()}
              </div>
              {visitedVenues.has(v.id) && (
                <div style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--rausch)', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✓</div>
              )}
            </div>
          ))}
        </div>

        <div className="h-small" style={{ margin: '24px 0 10px' }}>최근 직관</div>
        <div className="vstack">
          {list.length === 0 && <div className="empty" style={{ padding: 16 }}>아직 체크인한 경기가 없습니다. 경기 상세에서 체크인 할 수 있어요.</div>}
          {list.map((f) => {
            const oppTeam = f.home === myTeam ? f.away : f.home;
            const venue = venueOf(f.venue);
            return (
              <article key={f.id} className="card card-compact clickable" onClick={() => nav('/match/' + f.id)}>
                <div className="hstack" style={{ justifyContent: 'space-between' }}>
                  <div className="hstack">
                    <TeamBadge teamId={oppTeam} size="sm" />
                    <div>
                      <div className="body-strong">
                        {f.goals ? `${f.goals.home}-${f.goals.away}` : ''} vs {teamOf(oppTeam)?.short}
                      </div>
                      <div className="muted" style={{ fontSize: 12 }}>{formatKST(f.date)} · {venue?.name}</div>
                    </div>
                  </div>
                  <span className="pill">{f.home === myTeam ? '홈' : '원정'}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Modal
        open={shareOpen}
        title="시즌 카드 공유"
        body={`2026 시즌 ${stats.total}경기 직관 · 승률 ${stats.winRate}%의 카드를 이미지로 생성해 공유합니다. (구현 예정)`}
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setShareOpen(false)}>닫기</button>
            <button className="btn btn-primary" onClick={() => { setShareOpen(false); showToast('카드가 생성되었습니다'); }}>카드 생성</button>
          </>
        }
        onClose={() => setShareOpen(false)}
      />
      {toast}
    </div>
  );
}

function Stat({ v, l, c }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: c || 'var(--near-black)' }}>{v}</div>
      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{l}</div>
    </div>
  );
}
