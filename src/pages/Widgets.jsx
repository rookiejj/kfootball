import { Header, TeamBadge } from '../ui.jsx';
import { FIXTURES, teamOf, venueOf, formatKST, getMyTeam, STANDINGS_K1, daysUntil } from '../data.js';

export default function Widgets() {
  const myTeam = getMyTeam();
  const me = teamOf(myTeam);
  const next = FIXTURES.find((f) => f.status === 'NS' && (f.home === myTeam || f.away === myTeam));
  const last = [...FIXTURES].reverse().find((f) => (f.status === 'FT' || f.status === 'AET') && (f.home === myTeam || f.away === myTeam));
  const rank = STANDINGS_K1.find((r) => r.team === myTeam);

  if (!next) return (
    <div className="screen no-tabbar">
      <Header title="위젯 미리보기" back />
      <div className="empty">다가오는 경기가 없어 위젯 미리보기를 만들 수 없어요.</div>
    </div>
  );

  const opp = next.home === myTeam ? next.away : next.home;
  const oppTeam = teamOf(opp);
  const venue = venueOf(next.venue);

  return (
    <div className="screen no-tabbar">
      <Header title="위젯 미리보기" back />

      <div style={{ padding: '20px 22px 32px' }}>
        <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
          앱 설치 후 iOS/Android 홈·잠금화면에 추가할 수 있는 위젯 미리보기예요.
        </p>

        {/* Small */}
        <div className="widget-preview">
          <div className="widget-label">iOS · Small (2×2)</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="widget-small">
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>K-BALL</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.6px', marginTop: 4 }}>
                  D-{Math.max(daysUntil(next.date), 0)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {me.short} vs {oppTeam.short}
                </div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                  {formatKST(next.date, false)} · {venue?.city}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medium */}
        <div className="widget-preview">
          <div className="widget-label">iOS · Medium (4×2)</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="widget-medium">
              <div>
                <div className="hstack" style={{ justifyContent: 'space-between' }}>
                  <div className="muted" style={{ fontSize: 11, fontWeight: 600 }}>다가오는 경기</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--rausch)' }}>D-{Math.max(daysUntil(next.date), 0)}</div>
                </div>
                <div className="hstack" style={{ justifyContent: 'space-around', marginTop: 10 }}>
                  <div className="hstack" style={{ gap: 6 }}>
                    <TeamBadge teamId={next.home} size="sm" />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{teamOf(next.home).short}</span>
                  </div>
                  <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>VS</span>
                  <div className="hstack" style={{ gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{teamOf(next.away).short}</span>
                    <TeamBadge teamId={next.away} size="sm" />
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, textAlign: 'center' }} className="muted">
                {formatKST(next.date)} · {venue?.name}
              </div>
            </div>
          </div>
        </div>

        {/* Large */}
        <div className="widget-preview">
          <div className="widget-label">iOS · Large (4×4)</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="widget-large">
              <div className="hstack" style={{ justifyContent: 'space-between' }}>
                <div className="hstack" style={{ gap: 8 }}>
                  <TeamBadge teamId={myTeam} size="sm" />
                  <span className="body-strong" style={{ fontSize: 14 }}>{me.name}</span>
                </div>
                {rank && <span className="pill">순위 {rank.rank}</span>}
              </div>

              <div className="divider" />

              <div>
                <div className="h-small" style={{ marginBottom: 6 }}>다가오는 경기</div>
                <div className="body-strong" style={{ fontSize: 14 }}>
                  {formatKST(next.date)}
                </div>
                <div className="hstack" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                  <span className="body">{teamOf(next.home).short} vs {teamOf(next.away).short}</span>
                  <span className="muted" style={{ fontSize: 12 }}>🏟 {venue?.name}</span>
                </div>
              </div>

              {last && (
                <>
                  <div className="divider" />
                  <div>
                    <div className="h-small" style={{ marginBottom: 6 }}>최근 결과</div>
                    <div className="body-strong" style={{ fontSize: 14 }}>
                      {last.goals.home}-{last.goals.away} vs {teamOf(last.home === myTeam ? last.away : last.home).short}
                    </div>
                  </div>
                </>
              )}

              {rank && (
                <>
                  <div className="divider" />
                  <div className="body" style={{ fontSize: 13 }}>
                    {rank.played}경기 {rank.w}-{rank.d}-{rank.l} · {rank.pts}pt · {rank.gf - rank.ga >= 0 ? '+' : ''}{rank.gf - rank.ga}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lock screen */}
        <div className="widget-preview" style={{ background: 'linear-gradient(180deg, #1a1a2e, #16213e)', color: '#fff' }}>
          <div className="widget-label" style={{ color: 'rgba(255,255,255,0.7)' }}>iOS · 잠금화면 위젯</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', padding: 12 }}>
            <div style={{ fontSize: 12, color: '#fff', opacity: 0.9 }}>
              {me.short} vs {oppTeam.short} · D-{Math.max(daysUntil(next.date), 0)} {formatKST(next.date, false)}
            </div>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700,
              flexDirection: 'column',
              fontSize: 11,
            }}>
              <span style={{ fontSize: 18, letterSpacing: '-0.4px' }}>D-{Math.max(daysUntil(next.date), 0)}</span>
              <span style={{ fontSize: 9, opacity: 0.8, marginTop: 2 }}>{me.short}·{oppTeam.short}</span>
            </div>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 10,
              fontSize: 12,
              color: '#fff',
            }}>
              D-{Math.max(daysUntil(next.date), 0)} · {formatKST(next.date, false)} · {me.short} vs {oppTeam.short}
            </div>
          </div>
        </div>

        <p className="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 8 }}>
          실제 위젯은 WidgetKit(iOS) / AppWidget(Android)로 구현되며, OS가 갱신 주기를 관리합니다.
        </p>
      </div>
    </div>
  );
}
