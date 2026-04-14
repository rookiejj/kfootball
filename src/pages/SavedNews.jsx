import { useState } from 'react';
import { NEWS, getSavedNews, toggleSaved } from '../data.js';
import { Header, Modal, useToast } from '../ui.jsx';

export default function SavedNews() {
  const [saved, setSaved] = useState(getSavedNews());
  const [externalModal, setExternalModal] = useState(null);
  const [toast, showToast] = useToast();

  const items = NEWS.filter((n) => saved.includes(n.id));

  const remove = (id) => {
    const next = toggleSaved(id);
    setSaved(next);
    showToast('저장 취소');
  };

  return (
    <div className="screen no-tabbar">
      <Header title="저장한 뉴스" back />

      <div style={{ padding: '20px 22px 32px' }}>
        {items.length === 0 ? (
          <div className="empty" style={{ padding: 48 }}>
            <span className="empty-emoji">🔖</span>
            저장한 뉴스가 없습니다.<br />
            <span style={{ fontSize: 12 }}>뉴스 피드에서 📑 아이콘을 탭해 저장하세요.</span>
          </div>
        ) : (
          items.map((n) => (
            <article key={n.id} className="news-card" style={{ position: 'relative' }}>
              <div className="news-thumb">{n.thumb}</div>
              <div className="news-body" onClick={() => setExternalModal({ name: n.source, url: n.title })}>
                <div className="news-title">{n.title}</div>
                <div className="news-meta">{n.source} · {n.time}</div>
              </div>
              <button
                className="icon-btn bare"
                style={{ alignSelf: 'flex-start' }}
                onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                aria-label="저장 취소"
              >
                🔖
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
