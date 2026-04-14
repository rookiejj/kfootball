import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  teamOf, venueOf, FIXTURES, SQUADS, STANDINGS_K1, TEAM_LINKS, PLAYERS,
  formatKST, getMyTeams, setMyTeams, getMyTeam, setMyTeam,
} from '../data.js';
import { Header, TeamBadge, Tabs, Modal, useToast, FormPills } from '../ui.jsx';

const TABS = [
  { value: 'overview', label: '개요' },
  { value: 'squad',    label: '스쿼드' },
  { value: 'fixtures', label: '일정' },
  { value: 'venue',    label: '경기장' },
];

export default function Team() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tab, setTab] = useState('overview');
  const [myTeams, setMyTeamsState] = useState(getMyTeams());
  const [externalModal, setExternalModal] = useState(null);
  const [toast, showToast] = useToast();

  const team = teamOf(id);
  if (!team) {
    return (
      <div className="screen"><Header title="팀" back /><div className="empty">팀을 찾을 수 없습니다.</div></div>
    );
  }
  const isMyTeam = myTeams.includes(id);
  const venue = venueOf(team.venue);
  const standing = STANDINGS_K1.find((r) => r.team === id);
  const squad = SQUADS[id] || [];
  const links = TEAM_LINKS[id] || {};

  const past = FIXTURES
    .filter((f) => (f.status === 'FT' || f.status === 'AET') && (f.home === id || f.away === id))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  const next = FIXTURES
    .filter((f) => f.status === 'NS' && (f.home === id || f.away === id))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const toggleFav = () => {
    const nextList = isMyTeam ? myTeams.filter((x) => x !== id) : [...myTeams, id];
    setMyTeams(nextList);
    setMyTeamsState(nextList);
    if (!isMyTeam) {
      setMyTeam(id);
      showToast(`${team.short} 내 팀으로 설정`);
    } else {
      if (getMyTeam() === id && nextList[0]) setMyTeam(nextList[0]);
      showToast('내 팀에서 제거됨');
    }
  };

  return (
    <div className="screen no-tabbar">
      <Header title={team.name} back />

      {/* Team profile */}
      <div style={{
        background: `linear-gradient(180deg, ${team.color} 0%, ${team.color}aa 100%)`,
        padding: '32px 22px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <TeamBadge teamId={id} size="xl" />
        <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 12, letterSpacing: '-0.3px' }}>{team.name}</h2>
        <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>창단 {team.founded} · {team.city}</p>

        <button
          className={'btn btn-lg ' + (isMyTeam ? 'btn-ghost' : 'btn-primary')}
          style={{ marginTop: 16 }}
          onClick={toggleFav}
        >
          {isMyTeam ? '❤️ 내 팀' : '🤍 내 팀으로 설정'}
        </button>

        {standing && (
          <div className="hstack" style={{ justifyContent: 'center', gap: 16, marginTop: 18, fontSize: 13 }}>
            <div><span style={{ opacity: 0.75 }}>순위</span> <strong style={{ fontSize: 18 }}>{standing.rank}</strong></div>
            <div><span style={{ opacity: 0.75 }}>승점</span> <strong style={{ fontSize: 18 }}>{standing.pts}</strong></div>
            <div className="hstack" style={{ gap: 6 }}><span style={{ opacity: 0.75 }}>폼</span> <FormPills items={standing.form} /></div>
          </div>
        )}
      </div>

      {/* SNS / official channels */}
      <div className="section">
        <div className="h-small" style={{ marginBottom: 10 }}>공식 채널</div>
        <div className="hstack" style={{ gap: 8, flexWrap: 'wrap' }}>
          {links.instagram && (
            <button className="btn btn-outline btn-sm" onClick={() => setExternalModal({ name: 'Instagram', url: links.instagram })}>📷 Instagram</button>
          )}
          {links.youtube && (
            <button className="btn btn-outline btn-sm" onClick={() => setExternalModal({ name: 'YouTube', url: links.youtube })}>▶ YouTube</button>
          )}
          {links.x && (
            <button className="btn btn-outline btn-sm" onClick={() => setExternalModal({ name: 'X (Twitter)', url: links.x })}>𝕏 X</button>
          )}
          {links.homepage && (
            <button className="btn btn-outline btn-sm" onClick={() => setExternalModal({ name: '홈페이지', url: links.homepage })}>🌐 홈페이지</button>
          )}
          {!links.instagram && !links.youtube && !links.x && !links.homepage && (
            <div className="muted" style={{ fontSize: 13 }}>공식 채널 정보 준비중</div>
          )}
        </div>
      </div>

      <Tabs options={TABS} value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div style={{ padding: '20px 22px 32px' }}>
          {next[0] && (
            <>
              <div className="h-small" style={{ marginBottom: 8 }}>다음 경기</div>
              <article
                className="card card-compact clickable"
                onClick={() => nav('/match/' + next[0].id)}
                style={{ marginBottom: 16 }}
              >
                <div className="hstack" style={{ justifyContent: 'space-between' }}>
                  <div className="hstack">
                    <TeamBadge teamId={next[0].home === id ? next[0].away : next[0].home} size="sm" />
                    <div>
                      <div className="body-strong">vs {teamOf(next[0].home === id ? next[0].away : next[0].home).name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{formatKST(next[0].date)} · {next[0].home === id ? '홈' : '원정'}</div>
                    </div>
                  </div>
                  <div className="muted">›</div>
                </div>
              </article>
            </>
          )}

          <div className="h-small" style={{ marginBottom: 8 }}>최근 5경기</div>
          <div className="vstack">
            {past.map((f) => {
              const mine = f.goals[f.home === id ? 'home' : 'away'];
              const opp = f.goals[f.home === id ? 'away' : 'home'];
              const res = mine > opp ? 'W' : mine < opp ? 'L' : 'D';
              const oppTeam = f.home === id ? f.away : f.home;
              return (
                <article
                  key={f.id}
                  className="card card-compact clickable"
                  onClick={() => nav('/match/' + f.id)}
                >
                  <div className="hstack" style={{ justifyContent: 'space-between' }}>
                    <div className="hstack">
                      <FormPills items={[res]} />
                      <div>
                        <div className="body-strong">
                          {mine}-{opp} vs {teamOf(oppTeam).short}
                        </div>
                        <div className="muted" style={{ fontSize: 12 }}>{formatKST(f.date)} · {f.home === id ? '홈' : '원정'}</div>
                      </div>
                    </div>
                    <div className="muted">›</div>
                  </div>
                </article>
              );
            })}
          </div>

          {standing && (
            <>
              <div className="h-small" style={{ margin: '24px 0 8px' }}>시즌 통계</div>
              <div className="card card-compact">
                <div className="hstack" style={{ justifyContent: 'space-between', fontSize: 14 }}>
                  <div><span className="muted">경기</span> <strong>{standing.played}</strong></div>
                  <div><span className="muted">승</span> <strong>{standing.w}</strong></div>
                  <div><span className="muted">무</span> <strong>{standing.d}</strong></div>
                  <div><span className="muted">패</span> <strong>{standing.l}</strong></div>
                </div>
                <div className="divider" />
                <div className="hstack" style={{ justifyContent: 'space-between', fontSize: 14 }}>
                  <div><span className="muted">득점</span> <strong>{standing.gf}</strong></div>
                  <div><span className="muted">실점</span> <strong>{standing.ga}</strong></div>
                  <div><span className="muted">득실차</span> <strong>{standing.gf - standing.ga >= 0 ? '+' : ''}{standing.gf - standing.ga}</strong></div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'squad' && (
        <div style={{ padding: '20px 0 32px' }}>
          {squad.length === 0 ? (
            <div className="empty">스쿼드 정보 준비중</div>
          ) : (
            <div>
              {squad.map((s) => {
                const player = PLAYERS[s.playerId];
                if (!player) return null;
                return (
                  <div key={s.playerId} className="row" onClick={() => nav('/player/' + s.playerId)}>
                    <div className="row-leading">
                      <div style={{ fontSize: 28 }}>{player.photo}</div>
                      <div>
                        <div className="row-title">{player.name}</div>
                        <div className="row-sub">{player.pos} · #{player.number}</div>
                      </div>
                    </div>
                    <div className="row-trailing">›</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'fixtures' && (
        <div style={{ padding: '20px 22px 32px' }}>
          <div className="h-small" style={{ marginBottom: 10 }}>다가오는 경기</div>
          <div className="vstack">
            {next.length === 0 ? (
              <div className="empty">다가오는 경기 없음</div>
            ) : (
              next.map((f) => (
                <article key={f.id} className="card card-compact clickable" onClick={() => nav('/match/' + f.id)}>
                  <div className="hstack" style={{ justifyContent: 'space-between' }}>
                    <div className="hstack">
                      <TeamBadge teamId={f.home === id ? f.away : f.home} size="sm" />
                      <div>
                        <div className="body-strong">vs {teamOf(f.home === id ? f.away : f.home).short}</div>
                        <div className="muted" style={{ fontSize: 12 }}>{formatKST(f.date)}</div>
                      </div>
                    </div>
                    <span className="badge badge-scheduled">{f.home === id ? '홈' : '원정'}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'venue' && venue && (
        <div style={{ padding: '20px 22px 32px' }}>
          <div className="card">
            <div className="h-card">{venue.name}</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>{venue.address}</div>
            <div className="divider" />
            <div style={{ fontSize: 14 }}>
              <div><span className="muted">수용</span> <strong>{venue.capacity.toLocaleString()}명</strong></div>
              <div style={{ marginTop: 6 }}><span className="muted">교통</span> {venue.transit}</div>
              <div style={{ marginTop: 6 }}><span className="muted">주차</span> {venue.parking}</div>
            </div>
            <div className="vstack" style={{ gap: 8, marginTop: 16 }}>
              <button className="btn btn-outline btn-block" onClick={() => setExternalModal({ name: '네이버 지도', url: venue.address })}>🗺 지도 열기</button>
              <button className="btn btn-primary btn-block" onClick={() => setExternalModal({ name: '티켓 예매', url: '외부 예매' })}>🎫 외부 티켓 예매</button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={!!externalModal}
        title={externalModal?.name}
        body={externalModal ? `외부 링크 (${externalModal.url})로 이동 — 프로토타입 시뮬레이션.` : ''}
        actions={<button className="btn btn-primary btn-block" onClick={() => setExternalModal(null)}>확인</button>}
        onClose={() => setExternalModal(null)}
      />
      {toast}
    </div>
  );
}
