import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TEAMS, getMyTeam, getMyTeams, setMyTeam, setMyTeams, getCheckins,
} from '../data.js';
import { Header, TeamBadge, Modal, useToast } from '../ui.jsx';

export default function My() {
  const nav = useNavigate();
  const [myTeams, setMyTeamsState] = useState(getMyTeams());
  const [currentTeam, setCurrentTeam] = useState(getMyTeam());
  const [editModal, setEditModal] = useState(false);
  const [themeModal, setThemeModal] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [toast, showToast] = useToast();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ko');

  const checkins = getCheckins();

  const pickTeam = (id) => {
    setMyTeam(id);
    setCurrentTeam(id);
    setEditModal(false);
    showToast(`${TEAMS[id].short} 대표 팀으로 설정`);
  };

  const pickTheme = (v) => {
    localStorage.setItem('theme', v);
    setTheme(v);
    setThemeModal(false);
    showToast(`테마: ${v === 'system' ? '시스템' : v === 'dark' ? '다크' : '라이트'}`);
  };

  return (
    <div className="screen no-tabbar">
      <Header title="마이" />

      <div style={{ padding: '24px 22px', textAlign: 'center', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--rausch), var(--rausch-deep))',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, color: '#fff', fontWeight: 700,
        }}>🙂</div>
        <h2 className="h-card" style={{ marginTop: 10 }}>프로필</h2>
        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
          {currentTeam && <><TeamBadge teamId={currentTeam} size="xs" /> {TEAMS[currentTeam].name} 팬</>}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => showToast('프로필 편집은 다음 업데이트')}>
          프로필 편집
        </button>

        <div style={{
          marginTop: 20,
          background: 'var(--softer-surface)',
          borderRadius: 'var(--r-lg)',
          padding: '14px 16px',
          textAlign: 'left',
        }}>
          <div className="h-small" style={{ marginBottom: 6 }}>이번 시즌</div>
          <div className="hstack" style={{ justifyContent: 'space-between', fontSize: 14 }}>
            <span>⚽ 직관 <strong>{checkins.length}경기</strong></span>
            <button className="link-arrow" onClick={() => nav('/my/checkins')}>기록 →</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 0' }}>
        <Row label="내 팀 관리" value={`${myTeams.length}개 구독`} onClick={() => setEditModal(true)} />
        <Row label="알림 설정" onClick={() => nav('/my/notifications')} />
        <Row label="직관 기록" value={`${checkins.length}경기`} onClick={() => nav('/my/checkins')} />
        <Row label="저장한 뉴스" onClick={() => nav('/my/saved-news')} />
        <Row label="위젯 미리보기" onClick={() => nav('/my/widgets')} />

        <div className="divider" style={{ margin: '12px 22px' }} />

        <Row label="테마" value={theme === 'system' ? '시스템' : theme === 'dark' ? '다크' : '라이트'} onClick={() => setThemeModal(true)} />
        <Row label="언어" value={lang === 'ko' ? '한국어' : 'English'} onClick={() => setLangModal(true)} />

        <div className="divider" style={{ margin: '12px 22px' }} />

        <Row label="공지사항" onClick={() => setInfoModal('공지사항은 다음 업데이트에서 제공됩니다.')} />
        <Row label="이용약관" onClick={() => setInfoModal('이용약관 전문은 실서비스 출시 시 게재됩니다.')} />
        <Row label="개인정보 처리방침" onClick={() => setInfoModal('개인정보 처리방침 전문은 실서비스 출시 시 게재됩니다.')} />
        <Row label="데이터 출처·라이선스" onClick={() => setInfoModal('경기 데이터: API-Football (api-sports.io). 뉴스: 각 매체 RSS. 구단 로고·엠블럼: 해당 구단 소유.')} />
        <Row label="문의하기" onClick={() => setInfoModal('문의는 support@kball.app 으로 보내주세요. (프로토타입)')} />
      </div>

      <div style={{ padding: '16px 22px', textAlign: 'center' }}>
        <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>버전 0.1.0 (프로토타입)</div>
        <button className="btn btn-outline" onClick={() => setLogoutModal(true)}>로그아웃</button>
      </div>

      {/* Edit my teams */}
      <Modal
        open={editModal}
        title="내 팀 관리"
        body="대표 팀 하나를 선택하세요. 홈 대시보드에 이 팀이 기본으로 표시됩니다."
        onClose={() => setEditModal(false)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '4px 0 20px' }}>
          {myTeams.map((id) => (
            <button
              key={id}
              className={'team-choice' + (id === currentTeam ? ' selected' : '')}
              onClick={() => pickTeam(id)}
            >
              <TeamBadge teamId={id} size="md" />
              <span className="team-choice-name">{TEAMS[id].short}</span>
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-block" onClick={() => setEditModal(false)}>닫기</button>
      </Modal>

      {/* Theme */}
      <Modal open={themeModal} title="테마" onClose={() => setThemeModal(false)}>
        {['system', 'light', 'dark'].map((v) => (
          <div key={v} className="row" onClick={() => pickTheme(v)}>
            <div className="row-title">{v === 'system' ? '시스템 기본값' : v === 'light' ? '라이트' : '다크 (v1.1)'}</div>
            {theme === v && <div style={{ color: 'var(--rausch)' }}>✓</div>}
          </div>
        ))}
        <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={() => setThemeModal(false)}>닫기</button>
      </Modal>

      {/* Language */}
      <Modal open={langModal} title="언어" onClose={() => setLangModal(false)}>
        {[{ v: 'ko', l: '한국어' }, { v: 'en', l: 'English (v1.1)' }].map((x) => (
          <div
            key={x.v}
            className="row"
            onClick={() => {
              localStorage.setItem('lang', x.v);
              setLang(x.v);
              setLangModal(false);
              showToast(`언어: ${x.l}`);
            }}
          >
            <div className="row-title">{x.l}</div>
            {lang === x.v && <div style={{ color: 'var(--rausch)' }}>✓</div>}
          </div>
        ))}
        <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={() => setLangModal(false)}>닫기</button>
      </Modal>

      <Modal
        open={!!infoModal}
        title="안내"
        body={infoModal}
        actions={<button className="btn btn-primary btn-block" onClick={() => setInfoModal(null)}>확인</button>}
        onClose={() => setInfoModal(null)}
      />

      <Modal
        open={logoutModal}
        title="로그아웃"
        body="로그아웃하면 온보딩 화면으로 돌아갑니다. 계속하시겠어요?"
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => setLogoutModal(false)}>취소</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.clear();
                nav('/onboarding', { replace: true });
              }}
            >
              로그아웃
            </button>
          </>
        }
        onClose={() => setLogoutModal(false)}
      />

      {toast}
    </div>
  );
}

function Row({ label, value, onClick }) {
  return (
    <div className="row" onClick={onClick}>
      <div className="row-title">{label}</div>
      <div className="row-trailing">
        {value && <span className="muted" style={{ fontSize: 13 }}>{value}</span>}
        <span>›</span>
      </div>
    </div>
  );
}
