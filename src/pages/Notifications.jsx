import { useState } from 'react';
import { getNotifSettings, setNotifSettings, getMyTeams, TEAMS } from '../data.js';
import { Header, Switch, TeamBadge, Modal, useToast } from '../ui.jsx';

export default function Notifications() {
  const [s, setS] = useState(getNotifSettings());
  const [dndOpen, setDndOpen] = useState(false);
  const [toast, showToast] = useToast();
  const myTeams = getMyTeams();

  const update = (key, val) => {
    const next = { ...s, [key]: val };
    setS(next);
    setNotifSettings(next);
  };

  return (
    <div className="screen no-tabbar">
      <Header title="알림 설정" back />

      <div style={{ padding: '8px 0' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <div>
            <div className="row-title">전체 알림</div>
            <div className="row-sub">모든 알림을 한 번에 켜고 끕니다</div>
          </div>
          <Switch on={s.all} onChange={(v) => update('all', v)} />
        </div>
      </div>

      <SectionTitle>내 팀</SectionTitle>
      {myTeams.map((id) => (
        <div key={id} className="row">
          <div className="row-leading">
            <TeamBadge teamId={id} size="sm" />
            <div>
              <div className="row-title">{TEAMS[id].name}</div>
              <div className="row-sub">킥오프·라인업·골·종료·이적</div>
            </div>
          </div>
          <Switch
            on={s.all && s.team_kickoff_60}
            onChange={(v) => {
              update('team_kickoff_60', v);
              update('team_lineup', v);
              update('team_goal', v);
              update('team_final', v);
            }}
          />
        </div>
      ))}

      <div style={{ padding: '8px 0', background: 'var(--softer-surface)' }}>
        <SubRow label="킥오프 1시간 전" on={s.team_kickoff_60} onChange={(v) => update('team_kickoff_60', v)} />
        <SubRow label="킥오프 10분 전" on={s.team_kickoff_10} onChange={(v) => update('team_kickoff_10', v)} />
        <SubRow label="라인업 공개" on={s.team_lineup} onChange={(v) => update('team_lineup', v)} />
        <SubRow label="골 알림" on={s.team_goal} onChange={(v) => update('team_goal', v)} />
        <SubRow label="경기 종료 스코어" on={s.team_final} onChange={(v) => update('team_final', v)} />
        <SubRow label="이적·부상 뉴스" on={s.team_transfer} onChange={(v) => update('team_transfer', v)} />
      </div>

      <SectionTitle>국가대표</SectionTitle>
      <div className="row">
        <div className="row-leading">
          <div style={{ fontSize: 22 }}>🇰🇷</div>
          <div>
            <div className="row-title">대한민국</div>
            <div className="row-sub">A매치 알림</div>
          </div>
        </div>
        <Switch on={s.national} onChange={(v) => update('national', v)} />
      </div>

      <SectionTitle>해외파</SectionTitle>
      <div>
        {[
          { key: 'overseas_son', label: '손흥민 (토트넘)', emoji: '🌟' },
          { key: 'overseas_lee', label: '이강인 (PSG)', emoji: '✨' },
          { key: 'overseas_kim', label: '김민재 (바이에른)', emoji: '🛡️' },
        ].map((x) => (
          <div key={x.key} className="row">
            <div className="row-leading">
              <div style={{ fontSize: 22 }}>{x.emoji}</div>
              <div className="row-title">{x.label}</div>
            </div>
            <Switch on={s[x.key]} onChange={(v) => update(x.key, v)} />
          </div>
        ))}
      </div>

      <SectionTitle>방해 금지 시간</SectionTitle>
      <div className="row" onClick={() => setDndOpen(true)} style={{ cursor: 'pointer' }}>
        <div>
          <div className="row-title">설정하기</div>
          <div className="row-sub">{s.dnd ? '평일 23:00 — 07:00 (주말 없음)' : '미설정'}</div>
        </div>
        <div className="row-trailing">›</div>
      </div>

      <Modal
        open={dndOpen}
        title="방해 금지 시간"
        body="이 시간 동안은 긴급 알림(경기 시작·내 팀 골)만 전송됩니다."
        onClose={() => setDndOpen(false)}
      >
        <div style={{ margin: '12px 0 20px' }}>
          <div className="row" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="row-title">평일 방해 금지</div>
            <Switch on={s.dnd} onChange={(v) => { update('dnd', v); }} />
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
            시간 편집은 다음 업데이트에서 제공됩니다.
          </div>
        </div>
        <button className="btn btn-primary btn-block" onClick={() => { setDndOpen(false); showToast('저장됨'); }}>
          저장
        </button>
      </Modal>

      {toast}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      padding: '20px 22px 6px',
      fontSize: 11, fontWeight: 700, letterSpacing: '0.4px',
      color: 'var(--secondary-gray)', textTransform: 'uppercase',
    }}>{children}</div>
  );
}

function SubRow({ label, on, onChange }) {
  return (
    <div className="row" style={{ paddingLeft: 48, background: 'transparent' }}>
      <div className="row-title" style={{ fontWeight: 400 }}>{label}</div>
      <Switch on={on} onChange={onChange} />
    </div>
  );
}
