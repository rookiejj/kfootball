# K League

K리그 · 국가대표 · 해외파 한 번에 — 직관러를 위한 컴패니언 앱.

## 프로토타입 실행

```bash
npm install       # 최초 1회
npm run dev       # http://localhost:5173
```

## 빌드 & 프리뷰

```bash
npm run build
npm run preview
```

## Vercel 배포

1. 이 저장소를 GitHub에 push
2. Vercel에서 Import → 프레임워크 자동 감지(Vite)
3. Deploy — `vercel.json`에 SPA rewrite 설정됨

## 구조

```
kfootball/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── docs/                    # 기획·와이어프레임·검증 문서
├── scripts/                 # API-Football 프로빙 스크립트
└── src/
    ├── main.jsx
    ├── App.jsx              # 라우터 + 탭바 + 쉘
    ├── styles.css           # Airbnb-inspired 디자인 토큰 + 전 컴포넌트 스타일
    ├── data.js              # 목업 데이터 + localStorage 헬퍼
    ├── ui.jsx               # 공통 컴포넌트 (TeamBadge, Header, Tabs, Modal ...)
    └── pages/
        ├── Onboarding.jsx
        ├── Home.jsx
        ├── Fixtures.jsx
        ├── Match.jsx
        ├── Team.jsx
        ├── Player.jsx
        ├── Standings.jsx
        ├── Overseas.jsx
        ├── News.jsx
        ├── SavedNews.jsx
        ├── My.jsx
        ├── Notifications.jsx
        ├── Checkins.jsx
        └── Widgets.jsx
```

## 기획 문서

- `docs/product-plan.md` — 제품 기획 v0.2
- `docs/wireframes.md` — MVP 와이어프레임 + IA
- `docs/data-source-validation.md` — 데이터 소스 검증 (기술)
- `docs/feasibility-for-non-devs.md` — 비개발자용 요약
