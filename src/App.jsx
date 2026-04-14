import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { isOnboarded } from './data.js';
import Onboarding from './pages/Onboarding.jsx';
import Home from './pages/Home.jsx';
import Fixtures from './pages/Fixtures.jsx';
import Match from './pages/Match.jsx';
import Team from './pages/Team.jsx';
import Player from './pages/Player.jsx';
import Standings from './pages/Standings.jsx';
import Overseas from './pages/Overseas.jsx';
import News from './pages/News.jsx';
import My from './pages/My.jsx';
import Notifications from './pages/Notifications.jsx';
import Checkins from './pages/Checkins.jsx';
import Widgets from './pages/Widgets.jsx';
import SavedNews from './pages/SavedNews.jsx';

const TABS = [
  { path: '/home',     label: '홈',     icon: '🏠' },
  { path: '/fixtures', label: '일정',   icon: '📅' },
  { path: '/overseas', label: '해외파', icon: '🌍' },
  { path: '/my',       label: '마이',   icon: '👤' },
];

function TabBar() {
  const location = useLocation();
  const nav = useNavigate();
  const active = TABS.find((t) => location.pathname === t.path || location.pathname.startsWith(t.path + '/'));
  return (
    <nav className="tabbar" aria-label="기본 탭">
      {TABS.map((t) => (
        <button
          key={t.path}
          className={'tab' + (active?.path === t.path ? ' active' : '')}
          onClick={() => nav(t.path)}
        >
          <span className="tab-icon" aria-hidden>{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function RootRedirect() {
  return isOnboarded() ? <Navigate to="/home" replace /> : <Navigate to="/onboarding" replace />;
}

const HIDE_TAB_PATHS = ['/onboarding', '/match/', '/team/', '/player/', '/my/'];

export default function App() {
  const location = useLocation();
  const hideTab = HIDE_TAB_PATHS.some((p) => location.pathname.startsWith(p)) || location.pathname === '/';

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/overseas" element={<Overseas />} />
          <Route path="/news" element={<News />} />
          <Route path="/match/:id" element={<Match />} />
          <Route path="/team/:id" element={<Team />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/my" element={<My />} />
          <Route path="/my/notifications" element={<Notifications />} />
          <Route path="/my/checkins" element={<Checkins />} />
          <Route path="/my/widgets" element={<Widgets />} />
          <Route path="/my/saved-news" element={<SavedNews />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        {!hideTab && <TabBar />}
      </div>
    </div>
  );
}
