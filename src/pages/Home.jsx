import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FIXTURES, STANDINGS_K1, OVERSEAS_ITEMS, NEWS,
  teamOf, playerOf, venueOf, formatKST, getMyTeam,
} from '../data.js';
import { Header, TeamBadge, Countdown, Modal, useToast } from '../ui.jsx';

export default function Home() {
  const nav = useNavigate();
  const myTeam = getMyTeam();
  const me = teamOf(myTeam);
  const [externalModal, setExternalModal] = useState(null);
  const [toast, showToast] = useToast();

  const upcoming = FIXTURES
    .filter((f) => f.status === 'NS' && (f.home === myTeam || f.away === myTeam))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextMatch = upcoming[0] || FIXTURES.find((f) => f.status === 'NS');

  const finished = FIXTURES
    .filter((f) => (f.status === 'FT' || f.status === 'AET') && (f.home === myTeam || f.away === myTeam))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastMatch = finished[0];

  const top3 = STANDINGS_K1.slice(0, 3);
  const myRank = STANDINGS_K1.find((r) => r.team === myTeam);

  const topNews = NEWS.slice(0, 3);
  const topOverseas = OVERSEAS_ITEMS.slice(0, 2);

  return (
    <div className="screen">
      <Header
        title="K-Ball"
        actions={
          <>
            <button className="icon-btn" aria-label="검색" onClick={() => showToast('검색은 곧 추가됩니다')}>🔍</button>
            <button className="icon-btn" aria-label="알림" onClick={() => nav('/my/notifications')}>🔔</button>
          </>
        }
      />

      {/* HERO — next match */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">내 팀 · {me.name}</div>
          <button className="link-arrow" onClick={() => nav('/team/' + myTeam)}>팀 상세 →</button>
        </div>

        {nextMatch ? (
          <article className="hero-match" onClick={() => nav('/match/' + nextMatch.id)} style={{ cursor: 'pointer' }}>
            <div className="hero-match-top">
              <Countdown iso={nextMatch.date} />
              <span className="hero-time mono">{formatKST(nextMatch.date)}</span>
            </div>

            <div className="hero-teams">
              <div className="hero-team">
                <TeamBadge teamId={nextMatch.home} size="lg" />
                <div className="hero-team-name">{teamOf(nextMatch.home).name}</div>
              </div>
              <div className="hero-vs">VS</div>
              <div className="hero-team">
                <TeamBadge teamId={nextMatch.away} size="lg" />
                <div className="hero-team-name">{teamOf(nextMatch.away).name}</div>
              </div>
            </div>

            <div className="hero-meta">
              <div className="hero-meta-line">🏟 {venueOf(nextMatch.venue).name}</div>
              <div className="hero-meta-line">📍 {venueOf(nextMatch.venue).city} · {nextMatch.round}</div>
            </div>

            <div className="hero-actions" onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-outline" onClick={() => nav('/my/notifications')}>🔔 알림</button>
              <button className="btn btn-primary" onClick={() => setExternalModal({ name: '티켓 예매', url: '외부 티켓 사이트' })}>🎫 티켓</button>
            </div>
          </article>
        ) : (
          <div className="empty">
            <span className="empty-emoji">⚽</span>
            다가오는 경기가 없어요.
          </div>
        )}
      </div>

      {/* RECENT RESULT */}
      {lastMatch && (
        <div className="section">
          <div className="section-head">
            <div className="section-title">최근 결과</div>
            <button className="link-arrow" onClick={() => nav('/fixtures')}>더보기 →</button>
          </div>
          <article className="card card-compact clickable" onClick={() => nav('/match/' + lastMatch.id)}>
            <div className="hstack" style={{ justifyContent: 'space-between' }}>
              <div className="hstack">
                <TeamBadge teamId={lastMatch.home === myTeam ? lastMatch.away : lastMatch.home} size="sm" />
                <div>
                  <div className="body-strong">
                    vs {teamOf(lastMatch.home === myTeam ? lastMatch.away : lastMatch.home).name}
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {formatKST(lastMatch.date)} · {lastMatch.home === myTeam ? '홈' : '원정'}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <ResultBadge fixture={lastMatch} myTeam={myTeam} />
                <div className="muted mono" style={{ fontSize: 12, marginTop: 2 }}>
                  {lastMatch.goals.home} - {lastMatch.goals.away}
                </div>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* STANDINGS PREVIEW */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">K리그1 순위</div>
          <button className="link-arrow" onClick={() => nav('/standings')}>전체 순위 →</button>
        </div>
        <div className="card card-compact" style={{ padding: 0 }}>
          {top3.map((row) => (
            <div
              key={row.team}
              className={'standings-row' + (row.team === myTeam ? ' my' : '')}
              onClick={() => nav('/team/' + row.team)}
            >
              <div className="rank">{row.rank}</div>
              <div className="team">
                <TeamBadge teamId={row.team} size="xs" />
                <div className="team-name">{teamOf(row.team).name}</div>
              </div>
              <div className="muted mono">{row.played}</div>
              <div className="muted mono" style={{ fontSize: 12 }}>{row.w}-{row.d}-{row.l}</div>
              <div className="pts">{row.pts}</div>
            </div>
          ))}
          {myRank && myRank.rank > 3 && (
            <>
              <div className="standings-divider">내 팀</div>
              <div className="standings-row my" onClick={() => nav('/team/' + myTeam)}>
                <div className="rank">{myRank.rank}</div>
                <div className="team">
                  <TeamBadge teamId={myRank.team} size="xs" />
                  <div className="team-name">{me.name}</div>
                </div>
                <div className="muted mono">{myRank.played}</div>
                <div className="muted mono" style={{ fontSize: 12 }}>{myRank.w}-{myRank.d}-{myRank.l}</div>
                <div className="pts">{myRank.pts}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* OVERSEAS */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">해외파 이번 주</div>
          <button className="link-arrow" onClick={() => nav('/overseas')}>전체 →</button>
        </div>
        <div className="vstack">
          {topOverseas.map((o) => {
            const p = playerOf(o.playerId);
            return (
              <article
                key={o.playerId}
                className="card card-compact clickable"
                onClick={() => nav('/player/' + o.playerId)}
              >
                <div className="hstack" style={{ justifyContent: 'space-between' }}>
                  <div className="hstack">
                    <div style={{ fontSize: 28 }}>{p.photo}</div>
                    <div>
                      <div className="body-strong">{p.name} · {o.teamName}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {o.league} · vs {o.last.opp} {o.last.gf}-{o.last.ga}
                        {o.last.goals > 0 && ` · ⚽${o.last.goals}`}
                        {o.last.assists > 0 && ` · 🎯${o.last.assists}`}
                      </div>
                    </div>
                  </div>
                  <div className="muted" style={{ fontSize: 18 }}>›</div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* NEWS */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">오늘의 뉴스</div>
          <button className="link-arrow" onClick={() => nav('/news')}>전체 →</button>
        </div>
        <div className="vstack">
          {topNews.map((n) => (
            <article
              key={n.id}
              className="news-card"
              onClick={() => setExternalModal({ name: n.source, url: n.title })}
            >
              <div className="news-thumb">{n.thumb}</div>
              <div className="news-body">
                <div className="news-title">{n.title}</div>
                <div className="news-meta">{n.source} · {n.time}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div style={{ height: 16 }} />

      <Modal
        open={!!externalModal}
        title={externalModal ? `${externalModal.name}` : ''}
        body={externalModal ? `실제 배포에서는 외부 링크(${externalModal.url})로 이동합니다. 프로토타입에서는 시뮬레이션으로만 표시됩니다.` : ''}
        actions={
          <button className="btn btn-primary btn-block" onClick={() => setExternalModal(null)}>확인</button>
        }
        onClose={() => setExternalModal(null)}
      />
      {toast}
    </div>
  );
}

function ResultBadge({ fixture, myTeam }) {
  const myGoals = fixture.home === myTeam ? fixture.goals.home : fixture.goals.away;
  const oppGoals = fixture.home === myTeam ? fixture.goals.away : fixture.goals.home;
  const outcome = myGoals > oppGoals ? 'W' : myGoals < oppGoals ? 'L' : 'D';
  const color = outcome === 'W' ? 'var(--success)' : outcome === 'L' ? 'var(--rausch)' : 'var(--secondary-gray)';
  const label = { W: '승', D: '무', L: '패' }[outcome];
  return <span className="body-strong" style={{ color }}>● {label}</span>;
}
