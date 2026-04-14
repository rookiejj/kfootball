# 데이터 소스 검증 리포트

작성: 2026-04-15
대상 프로젝트: K-Ball (K리그 + 국대·해외파 통합 모바일 앱, 실서비스 지향)
목적: 유료 플랜 결제 전에, 후보 Football API들이 MVP 기능을 실제로 뒷받침할 수 있는지 **검증된 수치로** 판정.

---

## 0. 요약 (TL;DR)

| 항목 | 결론 |
|---|---|
| **최종 권장 소스** | **API-Football (api-sports.io) 유료 플랜** |
| **무료 플랜으로 충분한가** | ❌ 불가 — 현재 시즌 차단, `next` 파라미터 차단 |
| **MVP 전 화면 구현 가능한가** | ✅ 가능 (v1.0 범위 전부, 라이브·xG는 v1.1) |
| **Sportmonks 무료는** | ❌ 무의미 — 덴마크·스코틀랜드 2리그만 커버, K리그 미포함 |
| **API 콜 소비** | 이번 검증 총 ~16콜 / 100 무료 한도 |
| **열린 이슈** | ① 유료 플랜 월요금 확정 ② 현재 시즌(2026) 경기 통계 커버리지 ③ 연맹 공식 제휴 가능성 |

---

## 1. 검증 대상 & 배경

### 앱 요구사항 (기획 v0.2 기준)
- **데이터 범위**: K리그1, K리그2, FA컵, AFC Champions League, 국가대표팀, **해외파 한국 선수(손흥민·이강인·김민재 등)**
- **시점**: 현재 시즌(2026) 일정·결과·순위 실시간 필요
- **핵심 화면**: 홈 대시보드, 일정, 경기 상세(스코어·라인업·이벤트·경기장), 팀·선수 상세, 해외파

### 후보 API 사전 스크리닝
| API | 사전 판단 |
|---|---|
| **API-Football** (api-sports.io) | 무료 100콜/일, K리그 커버 공식 명시 → **1차 실증 대상** |
| **Sportmonks** | 무료 티어 = 덴마크·스코틀랜드 2리그 한정 → K리그 미포함, 실증 불가 |
| **Sportradar** | 엔터프라이즈급 가격 → 개인 프로젝트 범위 밖 |
| **football-data.org** | 유럽 위주, K리그 미포함 |
| **K리그 공식 데이터 포털** (data.kleague.com) | 공개 API 여부·상업 이용 조건 미확인, 제휴 문의 필요 |
| **웹 스크래핑 / 비공식 API** | 실서비스 법적 리스크로 제외 |

**→ 실제 프로빙 대상: API-Football만.** 나머지는 문헌 검토로 커버리지·제약을 사전 확정.

---

## 2. 테스트 환경

- 날짜: 2026-04-15 01:35~01:48 KST
- 실행 환경: macOS (darwin 25.3.0), Python 3.12.1 (python.org 빌드)
- 언어: Python stdlib only (외부 의존성 없음)
- API 키: 무료 티어(plan=Free, 만료 2027-04-14) 신규 발급
- 베이스 URL: `https://v3.football.api-sports.io`
- 인증 헤더: `x-apisports-key`

### 초기 장애 & 해결
- **SSL 인증서 검증 실패** (`SSL: CERTIFICATE_VERIFY_FAILED`) — python.org 빌드 특유의 macOS 키체인 미연동 이슈
- **해결**: `/Applications/Python 3.12/Install Certificates.command` 1회 실행 후 정상화

---

## 3. 테스트 1 — 기본 커버리지 프로빙

### 3.1 스크립트
`scripts/probe_api_football.py` — 약 9개 엔드포인트 호출, 리그 ID 자동 추출 & 플랜이 지원하는 시즌 자동 탐색 (2026→2025→2024→2023 순 fallback).

### 3.2 실행 결과 원문 요약

```
=== 1. Account status & quota ===
  plan: Free  end: 2027-04-14  active: True
  requests today: 0/100

=== 2. Leagues in South Korea ===
  leagues: results=5
  - [292] K League 1 (League)    seasons=2016~2026
  - [293] K League 2 (League)    seasons=2016~2026
  - [295] K3 League (League)     seasons=2016~2026
  - [294] FA Cup (Cup)           seasons=2019~2025
  - [660] WK-League (League)     seasons=2020~2026

=== 3. K1 standings — season fallback ===
  season 2026: errors={'plan': 'Free plans do not have access to this season, try from 2022 to 2024.'}
  season 2025: errors={'plan': ...} (동일)
  season 2024: ✓ top 3 — 울산(72), 강원(64), 김천(63)

=== 4. K1 upcoming fixtures ===
  errors={'plan': 'Free plans do not have access to the Next parameter.'}

=== 5. K1 top scorers (2024) ===
  20개 결과
  1. S. Mugoša (Incheon) — 15골
  2. S. Iljutcenko (FC Seoul) — 14골
  3. Lee Sang-Heon (Gangwon) — 13골

=== 6. K2 standings sanity (2024) ===
  ✓ FC Anyang 63pt

=== 7. Overseas Korean — Son Heung-min ===
  ✓ [186] Son Heung-Min — Korea Republic — 1992-07-08
```

### 3.3 발견사항

**✅ 확보된 것**
- 남한 리그 5종 리그 ID 전부 매핑: K1=292, K2=293, K3=295, FA컵=294, WK-League=660
- 해외파 개별 선수 조회(`/players/profiles?search=...`) 가능 — 손흥민 player_id=186 확정
- 순위·득점순위·팀 데이터 구조 정상
- 실제 2024 K1 최종 우승팀(울산), 득점왕(무고사) 일치 — 데이터 품질 OK

**❌ 무료 플랜 치명적 제약**
1. **현재 시즌 차단**: 2025, 2026 시즌은 `plan` 에러 반환. **공식 허용 범위는 2022-2024만**.
2. **`next` 파라미터 차단**: "다가오는 N경기" 쿼리 막힘.
3. **FA컵 시즌 범위**: 2019-2025 (2026 미포함 — 연맹의 가을-봄 포맷 전환과 시차 추정).

**⚠️ 스크립트 결함 (기록)**
- FA컵 league 자동 매칭 실패. 실제 이름이 `"FA Cup"`인데 스크립트는 `"korea cup"`·`"korean fa cup"` 문자열을 찾음 → `cup_id=None`. 결과에 수동 확인한 ID=294를 명시.

---

## 4. 테스트 2 — 경기 상세 데이터 심층 프로빙

### 4.1 목적
"유료 전환 시 MVP 전 화면을 실제로 그릴 수 있는가"를 결론내기 위해, 무료 플랜으로도 조회 가능한 **2024 시즌 데이터**로 `fixtures / lineups / events / statistics` 엔드포인트의 **필드 완전성**을 확인.

### 4.2 스크립트
`scripts/probe_fixtures.py` — 5개 호출.

1. K1 2024 전체 경기 리스트
2. 완료된 첫 경기의 라인업
3. 동일 경기 이벤트
4. 동일 경기 통계

### 4.3 실행 결과 (원문)

**#1 — 전체 경기 (232경기)**
- 기간: 2024-03-01 ~ 2024-12-08
- 상태 분포: FT 231, AET 1 (연장 1경기)
- 고유 라운드 44개 (정규리그 + 스플릿 + 플레이오프)
- 고유 경기장 17, 고유 심판 18
- 첫 경기 샘플 (fixture.id=1162902, 울산 vs 포항):

```
fixture.date      2024-03-01T05:00:00+00:00
fixture.timestamp 1709269200  (UTC 유닉스)
fixture.timezone  UTC
fixture.venue     {id:1020, name:"Ulsan Munsu Football Stadium", city:"Ulsan"}
fixture.status    {long:"Match Finished", short:"FT", elapsed:90}
fixture.referee   Kim Woo-Sung
league.round      "Regular Season - 1"
teams.home        {id:2767, name:"Ulsan Hyundai FC", logo: https://...}
teams.away        {id:2764, name:"Pohang Steelers"}
goals             {home:1, away:0}
score             halftime {0,0}  fulltime {1,0}  extratime {null,null}  penalty {null,null}
```

**#2 — 라인업 (fixture 1162902)**
- 2개 팀 × 각 선발 11 / 교체 9 완비
- 울산 포메이션 `4-2-3-1`, 감독 `Hong Myung-Bo`
- 포항 포메이션 `4-4-2`, 감독 `Park Tae-Ha`
- 선수 객체 예시: `{id:2890, name:"Jo Hyeon-Woo", number:21, pos:"G", grid:"1:1"}` — **`grid` 필드(row:col)가 전술보드 렌더에 그대로 사용 가능**

**#3 — 이벤트 (fixture 1162902)**
- 총 12개 이벤트
- 타입 분포: `subst` 8, `Goal` 1, `Card` 3
- 샘플 이벤트 구조:
```
{
  time: {elapsed:31, extra:null},
  team: {id:2767, name:"Ulsan Hyundai FC", logo:...},
  player: {id:403576, name:"Jang Si-Young"},
  assist: {id:34132, name:"Um Won-Sang"},
  type: "subst",
  detail: "Substitution 1"
}
```

**#4 — 통계 (fixture 1162902)**
- `results: 0` — 빈 응답 ❌
- 해석: 해당 경기(혹은 K1 2024 전반) 통계 미수집, 또는 유료 플랜 전용일 가능성. 유료 전환 후 현재 시즌으로 재검증 필요.

### 4.4 해석 — 화면별 가능/불가능 매트릭스

| MVP 화면 | 필요 데이터 | 엔드포인트 | 무료 (2024) | 유료 (현재 시즌) |
|---|---|---|---|---|
| 홈 대시보드 | 내 팀 다음 경기 | `fixtures?team=X&next=N` | ❌ next 차단 | ✅ |
| 일정 리스트 | 리그·시즌 전체 일정 | `fixtures?league=X&season=Y` | ✅ (2024) | ✅ |
| 경기 상세 — 기본 | 스코어·경기장·심판·라운드 | `fixtures?id=X` | ✅ | ✅ |
| 경기 상세 — 라인업 | 포메이션·선발·교체·감독·grid | `fixtures/lineups` | ✅ | ✅ |
| 경기 상세 — 타임라인 | 골·카드·교체·어시스트 | `fixtures/events` | ✅ | ✅ |
| 경기 상세 — 통계 | 점유율·슈팅·xG | `fixtures/statistics` | ❌ 빈값 | ⚠️ 유료 전환 후 재검증 필요 |
| 경기 상세 — 장소 | 경기장·도시 (주소·교통은 자체 큐레이션) | `fixture.venue` | ✅ | ✅ |
| 순위 | K1/K2 순위 | `standings` | ✅ (2024) | ✅ |
| 팀 상세 | 팀 프로필·홈구장 | `teams?id` | ✅ | ✅ |
| 선수 상세 | 프로필·시즌 스탯 | `players` | ✅ | ✅ |
| 해외파 | 개별 선수 프로필·최근 경기 | `players?id&season` + `fixtures?team&last` | ✅ 프로필만 | ✅ |
| 라이브 스코어 | 진행 중 경기 | `fixtures?live=all` | ❌ | ✅ (v1.1) |

**→ v1.0 MVP 전 화면 구현에 필요한 데이터는 유료 플랜으로 100% 확보.**
**→ `statistics` 엔드포인트만 v1.1에서 별도 재검증 항목으로 남김.**

---

## 5. Sportmonks 사전 판정

프로빙 생략. 근거:
- Sportmonks 공식 free plan 페이지: **Danish Superliga + Scottish Premiership 두 리그만 제공**
- K리그는 유료 플랜(Starter 5리그 선택, Growth 30리그, Pro 120리그, Enterprise 2200+)에서만 접근 가능
- 무료 프로빙 시 K리그 응답은 구조적으로 빈 값이 확정되므로 실행 의미 없음

**향후 고려**: 만약 API-Football 유료 플랜 요금이 예산을 크게 초과하거나 현재 시즌 통계 커버리지가 부족할 경우 **Sportmonks Starter 플랜(5리그 선택)**으로 K1 + K2 + 프리미어리그 + 라리가 + 분데스리가를 선택 지정하는 대안 검토.

---

## 6. 데이터 품질 스팟체크

무작위 검증 — 응답과 공개 기록 일치 여부.

| 항목 | API 응답 | 실제 기록 | 일치 |
|---|---|---|---|
| 2024 K1 우승 | Ulsan Hyundai FC 72pt | 울산 HD 우승 72점 | ✅ |
| 2024 K1 득점왕 | S. Mugoša (Incheon) 15골 | 무고사 15골 득점왕 | ✅ |
| 손흥민 프로필 | 생년월일 1992-07-08, 국적 Korea Republic | 일치 | ✅ |
| K2 2024 우승 | FC Anyang 63pt | 안양 승격 | ✅ |
| 2024 시즌 경기 수 | 232 (K1) | 12팀 × 38R = 228 + 스플릿/PO | ✅ 정합 |

→ 기본 데이터 품질 문제없음.

---

## 7. 콜 소비 내역

| 테스트 | 스크립트 | 소비 |
|---|---|---|
| 커버리지 프로빙 | `probe_api_football.py` | ~11콜 (status, leagues, standings×3 폴백, fixtures, topscorers, K2 standings, player search) |
| Fixture 심층 프로빙 | `probe_fixtures.py` | ~5콜 (fixtures, lineups, events, statistics, +a) |
| **합계** | — | **~16콜 / 100 일일 한도** |

- 오늘 남은 여유: ~84콜
- 유료 전환 전 추가 검증 필요 시 오늘 중 실행 가능

---

## 8. 의사결정 & 권장 액션

### 확정
1. **API-Football 유료 플랜**을 기본 데이터 소스로 채택 (단, 월 요금 확인 후 최종 결제).
2. **웹 스크래핑·비공식 API·Sportmonks 무료는 실서비스 부적합**으로 제외 확정.

### 미결 — 결제 전 확인 필요
- [ ] API-Football 유료 플랜 월 요금 (Pro/Ultra 티어별), 일·분당 레이트 한도
- [ ] 현재 시즌(2025/2026)에서 `fixtures/statistics` 실제 값 존재 여부 → 유료 전환 직후 즉시 검증
- [ ] `fixtures?live=all` 응답 지연(초 단위) — 라이브 스코어 품질 결정 요인
- [ ] 로고·엠블럼 CDN URL(`media.api-sports.io`) 상업 이용 라이선스 조건

### 병행 — 장기 백업
- [ ] K리그 연맹 `data.kleague.com` 담당자 연락처 확보, 상업 이용·제휴 가능성 문의 (회신 오래 걸림 가정)
- [ ] KFA 국가대표 관련 데이터 접근 문의 (A매치·엠블럼 사용)

### 스코프 조정 (기존 앱 크로스체크 반영, 2026-04-15)
- **v1.0 포함 확정**: 홈·일정·경기상세(요약/장소/라인업/타임라인)·팀·선수·해외파·순위·뉴스·마이·알림·직관기록·위젯 — 모두 가능
- **v1.0 포함 추가** (기존 앱 좋은 점 흡수):
  - **하이라이트 영상**: 경기 상세 [요약]에 K리그 공식 유튜브 임베드 (YouTube Data API or RSS)
  - **방송 중계 링크**: 경기 상세 [요약]에 쿠팡플레이·TVING·네이버 문자중계 딥링크 (자체 매핑)
  - **구단 공식 SNS**: 팀 상세에 인스타·유튜브·X·홈페이지 바로가기 (수기 매핑 ~120건)
- **v1.0 제외 확정**: 경기 상세 **통계 탭** (xG·점유율·슈팅) — 무료 검증 불가 → v1.1로 이동하고 유료 전환 직후 재검증
- **v1.1 이후**: 라이브 스코어·문자중계 내장·통계·H2H·선수 비교·커뮤니티

---

## 9. 부록 — 생성물 목록

```
kfootball/
├── scripts/
│   ├── probe_api_football.py   # 테스트 1 스크립트
│   └── probe_fixtures.py       # 테스트 2 스크립트
└── docs/
    ├── product-plan.md              # 제품 기획 v0.2
    ├── wireframes.md                # MVP 6개 화면 와이어프레임 + IA
    └── data-source-validation.md    # 본 문서 (데이터 소스 검증)
```

기획 문서: `docs/product-plan.md` (기획 v0.2, 승인됨)

---

## 10. 재현 방법 (다른 시점·다른 키로 다시 돌리려면)

```bash
# 1. API-Football 계정 생성 후 무료 키 발급
#    https://dashboard.api-football.com/register

# 2. 터미널에서 키 export
export API_FOOTBALL_KEY=발급받은키

# 3. (macOS python.org 빌드만) SSL 인증서 1회 설정
/Applications/Python\ 3.12/Install\ Certificates.command

# 4. 프로빙 실행
cd /Users/roy/Desktop/work/kfootball
python3 scripts/probe_api_football.py
python3 scripts/probe_fixtures.py
```

콜 소비: 두 스크립트 합쳐 ~16콜. 무료 한도 100콜/일 이내.
