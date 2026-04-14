import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STANDINGS_K1, STANDINGS_K2, teamOf, getMyTeam } from '../data.js';
import { Header, ChipRow, TeamBadge, FormPills } from '../ui.jsx';

const LEAGUES = [
  { value: 'k1',  label: 'K리그1' },
  { value: 'k2',  label: 'K리그2' },
  { value: 'cup', label: 'FA컵' },
  { value: 'acl', label: 'ACL' },
];

const FILTERS = [
  { value: 'all',   label: '전체' },
  { value: 'home',  label: '홈' },
  { value: 'away',  label: '원정' },
  { value: 'form',  label: '최근5경기' },
];

export default function Standings() {
  const nav = useNavigate();
  const myTeam = getMyTeam();
  const [league, setLeague] = useState('k1');
  const [filter, setFilter] = useState('all');

  const source = league === 'k1' ? STANDINGS_K1 : league === 'k2' ? STANDINGS_K2 : [];

  return (
    <div className="screen">
      <Header title="순위" back />
      <ChipRow options={LEAGUES} value={league} onChange={setLeague} />
      <ChipRow options={FILTERS} value={filter} onChange={setFilter} />

      {source.length === 0 ? (
        <div className="empty" style={{ padding: 48 }}>
          <span className="empty-emoji">🏆</span>
          {league === 'cup' ? 'FA컵은 녹아웃 토너먼트입니다 · 브래킷 뷰 준비중' : 'ACL 순위는 다음 업데이트 제공'}
        </div>
      ) : (
        <div style={{ padding: '12px 16px 32px' }}>
          <div className="standings-head">
            <div>#</div>
            <div>팀</div>
            <div style={{ textAlign: 'right' }}>경기</div>
            <div style={{ textAlign: 'right', fontSize: 10 }}>승무패</div>
            <div style={{ textAlign: 'right' }}>승점</div>
          </div>

          {source.map((row, i) => {
            const prevLine = i === 0 ? null : zoneLine(i, league);
            return (
              <div key={row.team}>
                {prevLine && <div className="standings-divider">{prevLine}</div>}
                <div
                  className={'standings-row' + (row.team === myTeam ? ' my' : '')}
                  onClick={() => nav('/team/' + row.team)}
                >
                  <div className="rank">{row.rank}</div>
                  <div className="team">
                    <TeamBadge teamId={row.team} size="xs" />
                    <div className="team-name">{teamOf(row.team).short}</div>
                  </div>
                  <div className="muted mono" style={{ textAlign: 'right' }}>{row.played}</div>
                  <div className="muted mono" style={{ textAlign: 'right', fontSize: 11 }}>{row.w}-{row.d}-{row.l}</div>
                  <div className="pts">{row.pts}</div>
                </div>
                {filter === 'form' && (
                  <div style={{ padding: '0 12px 8px', display: 'flex', justifyContent: 'flex-end' }}>
                    <FormPills items={row.form} />
                  </div>
                )}
              </div>
            );
          })}

          <p className="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 16, padding: '0 16px' }}>
            필터 "{FILTERS.find((f) => f.value === filter)?.label}" 적용됨 · 실 구현시 API 응답의 home/away 필드 기반 재정렬
          </p>
        </div>
      )}
    </div>
  );
}

function zoneLine(i, league) {
  if (league !== 'k1') return null;
  if (i === 6) return '파이널 A / B 분할선';
  if (i === 11) return '강등 PO 존';
  return null;
}
