import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NEWS, getSavedNews, toggleSaved } from '../data.js';
import { Header, ChipRow, Modal, useToast } from '../ui.jsx';

const CATEGORIES = [
  { value: 'all',      label: '전체' },
  { value: 'k1',       label: 'K리그' },
  { value: 'overseas', label: '해외파' },
  { value: 'national', label: '국대' },
];

export default function News() {
  const nav = useNavigate();
  const [cat, setCat] = useState('all');
  const [source, setSource] = useState('all');
  const [saved, setSaved] = useState(getSavedNews());
  const [externalModal, setExternalModal] = useState(null);
  const [toast, showToast] = useToast();

  const sources = useMemo(() => ['all', ...new Set(NEWS.map((n) => n.source))], []);

  const filtered = NEWS.filter((n) => (cat === 'all' || n.category === cat) && (source === 'all' || n.source === source));

  const toggleSave = (id) => {
    const next = toggleSaved(id);
    setSaved(next);
    showToast(next.includes(id) ? '뉴스 저장됨' : '저장 취소');
  };

  return (
    <div className="screen">
      <Header
        title="뉴스"
        back
        actions={
          <button className="icon-btn" onClick={() => nav('/my/saved-news')} aria-label="저장한 뉴스">🔖</button>
        }
      />
      <ChipRow options={CATEGORIES} value={cat} onChange={setCat} />

      <div style={{ padding: '12px 22px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{
            fontSize: 13, padding: '6px 10px', borderRadius: 8,
            border: '1px solid var(--hairline)', background: 'var(--white)',
          }}
        >
          {sources.map((s) => (
            <option key={s} value={s}>{s === 'all' ? '모든 매체' : s}</option>
          ))}
        </select>
        <div className="muted" style={{ fontSize: 12 }}>{filtered.length}건</div>
      </div>

      <div style={{ padding: '12px 22px 32px' }}>
        {filtered.length === 0 ? (
          <div className="empty" style={{ padding: 32 }}>
            <span className="empty-emoji">📰</span>
            해당 조건의 뉴스가 없습니다.
          </div>
        ) : (
          filtered.map((n) => (
            <article key={n.id} className="news-card" style={{ position: 'relative' }}>
              <div className="news-thumb">{n.thumb}</div>
              <div className="news-body" onClick={() => setExternalModal({ name: n.source, url: n.title })}>
                <div className="news-title">{n.title}</div>
                <div className="news-meta">{n.source} · {n.time}</div>
              </div>
              <button
                className="icon-btn bare"
                style={{ alignSelf: 'flex-start' }}
                onClick={(e) => { e.stopPropagation(); toggleSave(n.id); }}
                aria-label="저장"
              >
                {saved.includes(n.id) ? '🔖' : '📑'}
              </button>
            </article>
          ))
        )}
      </div>

      <Modal
        open={!!externalModal}
        title={externalModal?.name}
        body={externalModal ? `외부 링크 — ${externalModal.url}` : ''}
        actions={<button className="btn btn-primary btn-block" onClick={() => setExternalModal(null)}>확인</button>}
        onClose={() => setExternalModal(null)}
      />
      {toast}
    </div>
  );
}
