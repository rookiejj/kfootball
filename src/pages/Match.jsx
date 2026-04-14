import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fixtureOf, teamOf, venueOf, playerOf, LINEUPS, formatKST,
  getCheckins, toggleCheckin,
} from '../data.js';
import { Header, TeamBadge, Tabs, Modal, useToast } from '../ui.jsx';

const TABS = [
  { value: 'summary',  label: '요약' },
  { value: 'venue',    label: '장소' },
  { value: 'lineup',   label: '라인업' },
  { value: 'timeline', label: '타임라인' },
];

const EVENT_ICON = { goal: '⚽', yellow: '🟨', red: '🟥', sub: '🔄' };

function eventText(ev) {
  const team = teamOf(ev.team);
  const name = ev.player ? playerOf(ev.player)?.name : ev.playerName;
  if (ev.type === 'goal') {
    const assist = ev.assist ? playerOf(ev.assist)?.name : null;
    return (
      <>
        <div><strong>{name}</strong> ({team?.short})</div>
        {assist && <div className="timeline-sub">어시스트 {assist}</div>}
      </>
    );
  }
  if (ev.type === 'sub') {
    const inName = ev.playerIn ? playerOf(ev.playerIn)?.name : ev.playerInName;
    const outName = ev.playerOut ? playerOf(ev.playerOut)?.name : ev.playerOutName;
    return (
      <>
        <div>IN <strong>{inName}</strong> / OUT {outName}</div>
        <div className="timeline-sub">{team?.short}</div>
      </>
    );
  }
  return (
    <>
      <div><strong>{name}</strong></div>
      <div className="timeline-sub">{team?.short}</div>
    </>
  );
}

export default function Match() {
  const { id } = useParams();
  const nav = useNavigate();
  const fixture = fixtureOf(id);
  const [tab, setTab] = useState('summary');
  const [externalModal, setExternalModal] = useState(null);
  const [checkins, setCheckins] = useState(getCheckins());
  const [alertOn, setAlertOn] = useState(true);
  const [toast, showToast] = useToast();

  if (!fixture) {
    return (
      <div className="screen">
        <Header title="경기" back />
        <div className="empty">경기 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const home = teamOf(fixture.home);
  const away = teamOf(fixture.away);
  const venue = venueOf(fixture.venue);
  const isLive = fixture.status === 'LIVE';
  const isFinished = fixture.status === 'FT' || fixture.status === 'AET';
  const checkedIn = checkins.includes(fixture.id);

  const handleCheckin = () => {
    const next = toggleCheckin(fixture.id);
    setCheckins(next);
    showToast(checkedIn ? '체크인 취소됨' : `체크인 완료 · 이번 시즌 ${next.length}경기`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'K League', text: `${home.name} vs ${away.name}` }).catch(() => {});
    } else {
      showToast('링크가 복사되었습니다');
    }
  };

  return (
    <div className="screen no-tabbar">
      <Header
        title="경기 상세"
        back
        actions={
          <>
            <button
              className={'icon-btn' + (alertOn ? '' : ' bare')}
              onClick={() => { setAlertOn(!alertOn); showToast(alertOn ? '알림 해제' : '알림 설정됨'); }}
              aria-label="알림"
            >
              {alertOn ? '🔔' : '🔕'}
            </button>
            <button className="icon-btn" aria-label="공유" onClick={handleShare}>📤</button>
          </>
        }
      />

      {/* Hero */}
      <section className="match-hero">
        <div className="meta">{fixture.round} {fixture.referee && `· 심판 ${fixture.referee}`}</div>
        <div className="teams-row">
          <div>
            <TeamBadge teamId={fixture.home} size="xl" />
            <div className="team-label" style={{ marginTop: 8 }}>{home.name}</div>
          </div>
          <div className="score">
            {fixture.goals ? (
              <>
                <span>{fixture.goals.home}</span>
                <span className="sep">-</span>
                <span>{fixture.goals.away}</span>
              </>
            ) : (
              <span style={{ fontSize: 24, color: 'var(--secondary-gray)' }}>VS</span>
            )}
          </div>
          <div>
            <TeamBadge teamId={fixture.away} size="xl" />
            <div className="team-label" style={{ marginTop: 8 }}>{away.name}</div>
          </div>
        </div>
        <div className="status">
          {isLive && <span className="badge badge-live">LIVE {fixture.minute}'</span>}
          {isFinished && `종료 · ${formatKST(fixture.date)}`}
          {fixture.status === 'NS' && `예정 · ${formatKST(fixture.date)}`}
        </div>

        {/* Check-in button — day of match ±6h */}
        <div style={{ marginTop: 16 }}>
          <button
            className={'btn btn-block ' + (checkedIn ? 'btn-ghost' : 'btn-brand')}
            onClick={handleCheckin}
          >
            🎫 {checkedIn ? '체크인 완료 (취소하려면 탭)' : '직관 체크인 +1'}
          </button>
        </div>
      </section>

      <Tabs options={TABS} value={tab} onChange={setTab} />

      {/* Tab 1: Summary */}
      {tab === 'summary' && (
        <div className="vstack" style={{ padding: '20px 22px 32px' }}>
          <div className="card card-compact">
            <div className="h-small" style={{ marginBottom: 10 }}>경기 정보</div>
            <Info label="일시" value={formatKST(fixture.date)} />
            <Info label="경기장" value={venue?.name} />
            <Info label="라운드" value={fixture.round} />
            {fixture.referee && <Info label="심판" value={fixture.referee} />}
          </div>

          {fixture.broadcasters?.length > 0 && (
            <div className="card card-compact">
              <div className="h-small" style={{ marginBottom: 10 }}>방송 · 중계</div>
              <div className="vstack" style={{ gap: 8 }}>
                {fixture.broadcasters.map((b) => (
                  <button
                    key={b.key}
                    className="btn btn-outline btn-block"
                    onClick={() => setExternalModal({ name: b.name, url: '방송 앱' })}
                  >
                    ▶ {b.name}에서 보기
                  </button>
                ))}
                <button
                  className="btn btn-ghost btn-block"
                  onClick={() => setExternalModal({ name: '네이버 문자중계', url: 'sports.naver.com' })}
                >
                  💬 네이버 문자중계
                </button>
              </div>
            </div>
          )}

          {isFinished && fixture.highlight && (
            <div className="card card-compact">
              <div className="h-small" style={{ marginBottom: 10 }}>하이라이트</div>
              <div
                onClick={() => setExternalModal({ name: 'YouTube', url: fixture.highlight.title })}
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 9',
                  background: 'linear-gradient(135deg, #1a1a1a, #333)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.95)' }}>▶</div>
                <div style={{ position: 'absolute', bottom: 8, left: 12, right: 12, color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>K리그 공식</span>
                  <span>{fixture.highlight.length}</span>
                </div>
              </div>
              <div className="body" style={{ marginTop: 10 }}>{fixture.highlight.title}</div>
            </div>
          )}

          {fixture.events.length > 0 && (
            <div className="card card-compact">
              <div className="h-small" style={{ marginBottom: 6 }}>주요 장면</div>
              {fixture.events
                .filter((e) => e.type === 'goal' || e.type === 'red')
                .map((e, i) => (
                  <div key={i} className="timeline-item" style={{ padding: '10px 0' }}>
                    <div className="timeline-minute">{e.min}'</div>
                    <div className="timeline-icon">{EVENT_ICON[e.type]}</div>
                    <div className="timeline-text">{eventText(e)}</div>
                  </div>
                ))}
            </div>
          )}

          {fixture.status === 'NS' && (
            <div className="empty" style={{ padding: 24 }}>
              <span className="empty-emoji">⏳</span>
              경기 시작 전입니다. 라인업은 킥오프 1시간 전 공개됩니다.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Venue */}
      {tab === 'venue' && venue && (
        <div style={{ padding: '20px 22px 32px' }}>
          <div className="card">
            <div className="h-card">{venue.name}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              {venue.address} · 수용 {venue.capacity.toLocaleString()}명
            </div>
            <div className="vstack" style={{ marginTop: 16, gap: 8 }}>
              <button className="btn btn-outline btn-block" onClick={() => setExternalModal({ name: '네이버 지도', url: venue.address })}>🗺 지도 열기</button>
              <button className="btn btn-outline btn-block" onClick={() => setExternalModal({ name: '대중교통', url: venue.transit })}>🚇 대중교통 안내</button>
              <button className="btn btn-outline btn-block" onClick={() => setExternalModal({ name: '주차 정보', url: venue.parking })}>🅿 주차 정보</button>
              <button className="btn btn-outline btn-block" onClick={() => setExternalModal({ name: '좌석 배치도', url: venue.name })}>🪑 좌석 배치도</button>
              <button className="btn btn-primary btn-block" onClick={() => setExternalModal({ name: '티켓 예매', url: '외부 예매 사이트' })}>🎫 외부 티켓 예매</button>
            </div>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div className="h-small" style={{ marginBottom: 10 }}>직관 팁</div>
            <Info label="교통" value={venue.transit} />
            <Info label="주차" value={venue.parking} />
            <Info label="막차" value={venue.lastTrain} />
          </div>
        </div>
      )}

      {/* Tab 3: Lineup */}
      {tab === 'lineup' && (
        <div style={{ padding: '20px 0 32px' }}>
          {LINEUPS[fixture.id] ? (
            <LineupView lineup={LINEUPS[fixture.id]} />
          ) : (
            <div className="empty">
              <span className="empty-emoji">👕</span>
              {fixture.status === 'NS' ? '라인업은 킥오프 1시간 전 공개됩니다.' : '이 경기의 라인업 데이터가 없습니다.'}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Timeline */}
      {tab === 'timeline' && (
        <div className="timeline">
          {fixture.events.length === 0 ? (
            <div className="empty">
              <span className="empty-emoji">⌛</span>
              아직 이벤트가 없습니다.
            </div>
          ) : (
            fixture.events
              .slice()
              .sort((a, b) => a.min - b.min)
              .map((e, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-minute">{e.min}'</div>
                  <div className="timeline-icon">{EVENT_ICON[e.type] || '•'}</div>
                  <div className="timeline-text">{eventText(e)}</div>
                </div>
              ))
          )}
        </div>
      )}

      <Modal
        open={!!externalModal}
        title={externalModal?.name}
        body={externalModal ? `실제 앱에선 외부 링크 (${externalModal.url})로 이동합니다. 프로토타입 시뮬레이션.` : ''}
        actions={<button className="btn btn-primary btn-block" onClick={() => setExternalModal(null)}>확인</button>}
        onClose={() => setExternalModal(null)}
      />
      {toast}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
      <span className="muted">{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '70%' }}>{value}</span>
    </div>
  );
}

function LineupView({ lineup }) {
  const nav = useNavigate();
  const team = teamOf(lineup.home.team);
  return (
    <>
      <div className="gutter-x" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="card card-compact">
          <div className="h-small" style={{ marginBottom: 4 }}>홈</div>
          <div className="body-strong">{teamOf(lineup.home.team).name}</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>포메이션 {lineup.home.formation}</div>
          <div className="muted" style={{ fontSize: 13 }}>감독 {lineup.home.coach}</div>
        </div>
        <div className="card card-compact">
          <div className="h-small" style={{ marginBottom: 4 }}>원정</div>
          <div className="body-strong">{teamOf(lineup.away.team).name}</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>포메이션 {lineup.away.formation}</div>
          <div className="muted" style={{ fontSize: 13 }}>감독 {lineup.away.coach}</div>
        </div>
      </div>

      <FormationPitch lineup={lineup.home} teamSide="home" />

      <div style={{ padding: '16px 22px' }}>
        <div className="h-small" style={{ marginBottom: 10 }}>{teamOf(lineup.home.team).name} 선발</div>
        <div className="vstack" style={{ gap: 0 }}>
          {lineup.home.startXI.map((p, i) => {
            const player = p.player ? playerOf(p.player) : null;
            const name = player?.name || p.playerName;
            return (
              <div
                key={i}
                className="row"
                style={{ padding: '10px 0', borderBottom: '1px solid var(--hairline)' }}
                onClick={() => player && nav('/player/' + player.id)}
              >
                <div className="row-leading">
                  <div className="pill mono">{p.pos}</div>
                  <div className="body">{name}</div>
                </div>
                {player?.number && <div className="muted mono">#{player.number}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function FormationPitch({ lineup }) {
  const team = teamOf(lineup.team);
  return (
    <div className="pitch">
      {lineup.startXI.map((p, i) => {
        const player = p.player ? playerOf(p.player) : null;
        const name = player?.name || p.playerName;
        const maxRow = 5;
        const maxCol = 6;
        const topPct = (p.grid.row / (maxRow + 1)) * 100;
        const leftPct = (p.grid.col / (maxCol + 1)) * 100;
        return (
          <div
            key={i}
            className="pitch-player"
            style={{ top: `${topPct}%`, left: `${leftPct}%` }}
            title={name}
          >
            <div className="jersey" style={{ color: team?.color }}>
              {player?.number ?? ''}
            </div>
            <div className="pname">{name}</div>
          </div>
        );
      })}
    </div>
  );
}
