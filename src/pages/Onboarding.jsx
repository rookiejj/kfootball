import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEAMS, setMyTeam, setMyTeams, setOnboarded } from '../data.js';
import { TeamBadge, Modal, useToast } from '../ui.jsx';

const STEPS = ['intro', 'teams', 'notify', 'done'];

const TEAM_PICKS = ['ulsan','jeonbuk','pohang','seoul','gwangju','daegu','suwon','jeju','gimcheon','gangwon','incheon','daejeon'];

export default function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState([]);
  const [notifModal, setNotifModal] = useState(false);
  const [toast, showToast] = useToast();

  const togglePick = (id) => {
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const finish = () => {
    setMyTeams(picked);
    setMyTeam(picked[0]);
    setOnboarded();
    nav('/home', { replace: true });
  };

  return (
    <div className="screen no-tabbar">
      {step === 0 && (
        <>
          <div className="onb-screen">
            <div className="onb-brand">K</div>
            <h1 className="onb-title">K리그와 해외파,<br/>내 팀만 깔끔하게.</h1>
            <p className="onb-sub">직관러를 위한 K League가 시작됐습니다.<br/>응원팀 일정·경기장·하이라이트를 한눈에.</p>
            <div style={{ flex: 1 }} />
            <p className="muted" style={{ fontSize: 12, marginBottom: 16 }}>1 / 3</p>
          </div>
          <div className="onb-footer">
            <button className="btn btn-brand btn-block btn-lg" onClick={() => setStep(1)}>시작하기</button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="onb-screen" style={{ padding: '24px 22px 16px' }}>
            <p className="onb-step">2 / 3</p>
            <h1 className="onb-title" style={{ marginTop: 12 }}>응원하는 팀을 골라주세요</h1>
            <p className="onb-sub">복수 선택 가능 · 국가대표팀은 기본 구독됩니다.</p>
          </div>
          <div className="team-grid">
            {TEAM_PICKS.map((id) => {
              const t = TEAMS[id];
              const selected = picked.includes(id);
              return (
                <button
                  key={id}
                  className={'team-choice' + (selected ? ' selected' : '')}
                  onClick={() => togglePick(id)}
                >
                  <TeamBadge teamId={id} size="md" />
                  <span className="team-choice-name">{t.short}</span>
                </button>
              );
            })}
          </div>
          <div className="onb-footer">
            <button
              className="btn btn-brand btn-block btn-lg"
              disabled={picked.length === 0}
              style={picked.length === 0 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
              onClick={() => setStep(2)}
            >
              {picked.length === 0 ? '팀을 선택해주세요' : `${picked.length}개 팀 선택 · 계속`}
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="onb-screen">
            <p className="onb-step">3 / 3</p>
            <div style={{ fontSize: 56, marginTop: 16 }}>🔔</div>
            <h1 className="onb-title" style={{ marginTop: 12 }}>알림을 받으시겠어요?</h1>
            <p className="onb-sub">
              킥오프 1시간 전, 라인업 공개, 골, 종료 스코어를<br/>
              가장 빠르게 받아볼 수 있어요.
            </p>
            <div style={{ flex: 1 }} />
          </div>
          <div className="onb-footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-brand btn-block btn-lg" onClick={() => { setNotifModal(true); }}>알림 허용</button>
            <button className="btn btn-ghost btn-block" onClick={finish}>나중에 설정</button>
          </div>
        </>
      )}

      <Modal
        open={notifModal}
        title="알림 권한"
        body="실제 배포에선 OS의 알림 권한 다이얼로그가 표시됩니다. 프로토타입에서는 이 단계를 생략합니다."
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setNotifModal(false)}>취소</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setNotifModal(false);
                showToast('알림 허용됨');
                setTimeout(finish, 400);
              }}
            >
              알림 허용
            </button>
          </>
        }
        onClose={() => setNotifModal(false)}
      />
      {toast}
    </div>
  );
}
