import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FIXTURES, dayKey, getMyTeam } from '../data.js';
import { Header, ChipRow, MatchCard } from '../ui.jsx';

const LEAGUES = [
  { value: 'k1',   label: 'K리그1' },
  { value: 'k2',   label: 'K리그2' },
  { value: 'cup',  label: 'FA컵' },
  { value: 'acl',  label: 'ACL' },
  { value: 'nt',   label: 'A매치' },
];

const DAY_NAME = ['일', '월', '화', '수', '목', '금', '토'];

export default function Fixtures() {
  const nav = useNavigate();
  const myTeam = getMyTeam();
  const [league, setLeague] = useState('k1');
  const [myOnly, setMyOnly] = useState(false);

  const filtered = useMemo(() => {
    return FIXTURES
      .filter((f) => f.league === league)
      .filter((f) => !myOnly || f.home === myTeam || f.away === myTeam)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [league, myOnly, myTeam]);

  const byDate = useMemo(() => {
    const map = {};
    filtered.forEach((f) => {
      const k = dayKey(f.date);
      if (!map[k]) map[k] = [];
      map[k].push(f);
    });
    return map;
  }, [filtered]);

  const sortedDates = Object.keys(byDate).sort();

  return (
    <div className="screen">
      <Header title="일정" />
      <ChipRow options={LEAGUES} value={league} onChange={setLeague} />

      <div className="gutter-x" style={{ padding: '12px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="muted" style={{ fontSize: 13 }}>2026년 4월</div>
        <label className="hstack" style={{ gap: 6, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={myOnly} onChange={(e) => setMyOnly(e.target.checked)} />
          <span className="body" style={{ fontSize: 13 }}>내 팀만</span>
        </label>
      </div>

      <div style={{ padding: '8px 0 24px' }}>
        {sortedDates.length === 0 && (
          <div className="empty">
            <span className="empty-emoji">🗓</span>
            해당 조건의 경기가 없습니다.
          </div>
        )}
        {sortedDates.map((d) => {
          const date = new Date(d);
          const label = `${date.getMonth() + 1}월 ${date.getDate()}일 (${DAY_NAME[date.getDay()]})`;
          return (
            <section key={d} style={{ marginBottom: 8 }}>
              <div className="gutter-x" style={{ padding: '16px 22px 8px' }}>
                <div className="h-small">◆ {label}</div>
              </div>
              <div className="gutter-x">
                {byDate[d].map((f) => (
                  <MatchCard key={f.id} fixture={f} onClick={() => nav('/match/' + f.id)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
