// Mock data for K League prototype.
// Mirrors the shape we confirmed from API-Football, with trimmed fields.

export const TODAY = new Date('2026-04-15T10:00:00+09:00');

export const TEAMS = {
  ulsan:    { id: 'ulsan',    name: '울산 현대',   short: '울산',   color: 'var(--t-ulsan)',    initials: 'ULS', founded: 1983, city: '울산', venue: 'ulsan-munsu', league: 'k1' },
  jeonbuk:  { id: 'jeonbuk',  name: '전북 현대',   short: '전북',   color: 'var(--t-jeonbuk)',  initials: 'JBK', founded: 1994, city: '전주', venue: 'jeonju-world', league: 'k1' },
  pohang:   { id: 'pohang',   name: '포항 스틸러스', short: '포항',  color: 'var(--t-pohang)',   initials: 'POH', founded: 1973, city: '포항', venue: 'pohang-steelyard', league: 'k1' },
  seoul:    { id: 'seoul',    name: 'FC서울',      short: '서울',   color: 'var(--t-seoul)',    initials: 'SEO', founded: 1983, city: '서울', venue: 'seoul-world', league: 'k1' },
  gwangju:  { id: 'gwangju',  name: '광주 FC',     short: '광주',   color: 'var(--t-gwangju)',  initials: 'GWJ', founded: 2011, city: '광주', venue: 'gwangju-football', league: 'k1' },
  daegu:    { id: 'daegu',    name: '대구 FC',     short: '대구',   color: 'var(--t-daegu)',    initials: 'DGU', founded: 2002, city: '대구', venue: 'daegu-forest', league: 'k1' },
  suwon:    { id: 'suwon',    name: '수원 FC',     short: '수원FC', color: 'var(--t-suwon)',    initials: 'SWN', founded: 2003, city: '수원', venue: 'suwon-sports', league: 'k1' },
  jeju:     { id: 'jeju',     name: '제주 SK',     short: '제주',   color: 'var(--t-jeju)',     initials: 'JEJ', founded: 1982, city: '서귀포', venue: 'jeju-world', league: 'k1' },
  gimcheon: { id: 'gimcheon', name: '김천 상무',    short: '김천',   color: 'var(--t-gimcheon)', initials: 'GCN', founded: 1984, city: '김천', venue: 'gimcheon-stadium', league: 'k1' },
  gangwon:  { id: 'gangwon',  name: '강원 FC',     short: '강원',   color: 'var(--t-gangwon)',  initials: 'GWN', founded: 2008, city: '춘천', venue: 'chuncheon-stadium', league: 'k1' },
  incheon:  { id: 'incheon',  name: '인천 유나이티드', short: '인천', color: 'var(--t-incheon)', initials: 'ICN', founded: 2003, city: '인천', venue: 'incheon-football', league: 'k1' },
  daejeon:  { id: 'daejeon',  name: '대전 하나',    short: '대전',   color: 'var(--t-daejeon)',  initials: 'DJN', founded: 1997, city: '대전', venue: 'daejeon-world', league: 'k1' },

  // Overseas clubs (for international players)
  spurs:    { id: 'spurs',    name: '토트넘',       short: 'Spurs',  color: 'var(--t-spurs)',    initials: 'TOT', founded: 1882, city: 'London', venue: 'tottenham', league: 'epl' },
  psg:      { id: 'psg',      name: 'PSG',          short: 'PSG',    color: 'var(--t-psg)',      initials: 'PSG', founded: 1970, city: 'Paris',  venue: 'parc-princes', league: 'ligue1' },
  bayern:   { id: 'bayern',   name: '바이에른 뮌헨', short: 'FCB',    color: 'var(--t-bayern)',   initials: 'BAY', founded: 1900, city: 'München', venue: 'allianz', league: 'bundesliga' },
  wolves:   { id: 'wolves',   name: '울버햄튼',     short: 'Wolves', color: 'var(--t-wolves)',   initials: 'WOL', founded: 1877, city: 'Wolverhampton', venue: 'molineux', league: 'epl' },
  korea:    { id: 'korea',    name: '대한민국',     short: '한국',   color: 'var(--t-kr)',       initials: 'KOR', founded: 1928, city: '', venue: '', league: 'national' },
};

export const VENUES = {
  'ulsan-munsu':   { id: 'ulsan-munsu',  name: '울산 문수축구경기장', city: '울산',      address: '울산광역시 남구 문수로 44',      capacity: 44102, parking: '2,400대 수용', transit: '지하철 없음 · 시내버스 134·401번', lastTrain: '평일 23:30 기준 시내버스 막차 안내' },
  'jeonju-world':  { id: 'jeonju-world', name: '전주월드컵경기장',  city: '전주',      address: '전라북도 전주시 덕진구 기린대로 1055', capacity: 42477, parking: '3,800대', transit: '시내버스 79·109번', lastTrain: '시내버스 기준 23:20' },
  'pohang-steelyard': { id: 'pohang-steelyard', name: '포항 스틸야드', city: '포항',    address: '경상북도 포항시 남구 형산로 683',  capacity: 17443, parking: '1,200대', transit: '시내버스 206·302번', lastTrain: '22:50' },
  'seoul-world':   { id: 'seoul-world',  name: '서울월드컵경기장',  city: '서울',      address: '서울특별시 마포구 월드컵로 240',   capacity: 66704, parking: '1,800대 (혼잡)', transit: '6호선 월드컵경기장역 1번 출구', lastTrain: '24:00' },
  'gwangju-football': { id: 'gwangju-football', name: '광주 축구전용구장', city: '광주', address: '광주광역시 서구 금화로 240',    capacity: 7442,  parking: '900대', transit: '시내버스 순환01·518번', lastTrain: '22:40' },
  'daegu-forest':  { id: 'daegu-forest', name: 'DGB대구은행파크',   city: '대구',      address: '대구광역시 북구 고성로 191',      capacity: 12419, parking: '420대 (협소)', transit: '지하철 3호선 북구청역', lastTrain: '23:30' },
  'suwon-sports':  { id: 'suwon-sports', name: '수원종합운동장',   city: '수원',      address: '경기도 수원시 장안구 경수대로 893', capacity: 11808, parking: '800대', transit: '지하철 1호선 성균관대역', lastTrain: '24:10' },
  'jeju-world':    { id: 'jeju-world',   name: '제주월드컵경기장', city: '서귀포',    address: '제주특별자치도 서귀포시 월드컵로 33', capacity: 29791, parking: '1,600대', transit: '시내버스 202·281번', lastTrain: '22:30' },
  'gimcheon-stadium':{ id: 'gimcheon-stadium', name: '김천종합운동장', city: '김천',   address: '경상북도 김천시 운동장길 1',      capacity: 30000, parking: '충분', transit: '시내버스 11·12번', lastTrain: '22:00' },
  'chuncheon-stadium':{id:'chuncheon-stadium', name: '강릉종합운동장', city: '강릉',   address: '강원특별자치도 강릉시 종합운동장길 84', capacity: 22333, parking: '1,500대', transit: '시내버스 302·310번', lastTrain: '22:50' },
  'incheon-football': { id: 'incheon-football', name: '인천축구전용경기장', city: '인천', address: '인천광역시 중구 참외전로 246', capacity: 20891, parking: '800대', transit: '지하철 1호선 도원역', lastTrain: '24:00' },
  'daejeon-world': { id: 'daejeon-world',name: '대전월드컵경기장',  city: '대전',      address: '대전광역시 유성구 월드컵대로 32', capacity: 40535, parking: '2,100대', transit: '지하철 1호선 노은역', lastTrain: '23:15' },
};

// Team SNS / homepage links (mock; real URLs in production)
export const TEAM_LINKS = {
  ulsan:    { instagram: 'https://instagram.com/ulsanhyundaifc',   youtube: 'https://youtube.com/@ulsanhyundaifc',  x: 'https://x.com/ulsanhyundaifc',  homepage: 'https://uhfc.tv' },
  jeonbuk:  { instagram: 'https://instagram.com/jeonbuk_fc',       youtube: 'https://youtube.com/@jeonbukfc',        x: 'https://x.com/jeonbukfc',       homepage: 'https://hyundai-motorsfc.com' },
  pohang:   { instagram: 'https://instagram.com/steelers1973',     youtube: 'https://youtube.com/@pohangsteelers',   x: null,                            homepage: 'https://www.steelers.co.kr' },
  seoul:    { instagram: 'https://instagram.com/fcseoulofficial',  youtube: 'https://youtube.com/@fcseoul',          x: 'https://x.com/fcseoul',         homepage: 'https://www.fcseoul.com' },
  // ... 나머지는 위 4팀 패턴과 동일. 프로토타입 범위는 상단 팀 위주.
};

export const PLAYERS = {
  'jo-hyeon-woo':   { id: 'jo-hyeon-woo',   name: '조현우',      eng: 'Jo Hyeon-Woo',   pos: 'GK', number: 21, team: 'ulsan',   nat: 'KOR', birth: '1991-09-25', height: 187, photo: '🧤', seasonStats: { games: 14, clean: 8, saves: 38, conceded: 7 } },
  'kim-min-woo':    { id: 'kim-min-woo',    name: '김민우',      eng: 'Kim Min-Woo',    pos: 'MF', number: 8,  team: 'ulsan',   nat: 'KOR', birth: '1990-02-25', height: 173, photo: '⚽', seasonStats: { games: 13, goals: 2, assists: 4, passes: 720 } },
  'jang-si-young':  { id: 'jang-si-young',  name: '장시영',      eng: 'Jang Si-Young',  pos: 'FW', number: 11, team: 'ulsan',   nat: 'KOR', birth: '2001-03-16', height: 180, photo: '🔥', seasonStats: { games: 14, goals: 7, assists: 3 } },
  'um-won-sang':    { id: 'um-won-sang',    name: '엄원상',      eng: 'Um Won-Sang',    pos: 'FW', number: 7,  team: 'ulsan',   nat: 'KOR', birth: '1999-01-06', height: 171, photo: '⚡', seasonStats: { games: 13, goals: 4, assists: 6 } },
  'mugosa':         { id: 'mugosa',         name: '무고사',      eng: 'Stefan Mugoša',  pos: 'FW', number: 9,  team: 'incheon', nat: 'MNE', birth: '1992-02-26', height: 194, photo: '🎯', seasonStats: { games: 14, goals: 9, assists: 2 } },
  'iljutcenko':     { id: 'iljutcenko',     name: '일류첸코',    eng: 'Stanislav Iljutcenko', pos: 'FW', number: 15, team: 'seoul', nat: 'GER', birth: '1990-08-13', height: 188, photo: '💫', seasonStats: { games: 14, goals: 7, assists: 1 } },
  'hwang-in-jae':   { id: 'hwang-in-jae',   name: '황인재',      eng: 'Hwang In-Jae',   pos: 'GK', number: 21, team: 'pohang',  nat: 'KOR', birth: '1994-04-22', height: 192, photo: '🧤', seasonStats: { games: 14, clean: 5, saves: 44, conceded: 11 } },
  'son-heung-min':  { id: 'son-heung-min',  name: '손흥민',      eng: 'Son Heung-Min',  pos: 'FW', number: 7,  team: 'spurs',   nat: 'KOR', birth: '1992-07-08', height: 183, photo: '🌟', seasonStats: { games: 31, goals: 22, assists: 9 } },
  'lee-kang-in':    { id: 'lee-kang-in',    name: '이강인',      eng: 'Lee Kang-In',    pos: 'MF', number: 19, team: 'psg',     nat: 'KOR', birth: '2001-02-19', height: 173, photo: '✨', seasonStats: { games: 28, goals: 6, assists: 8, rating: 7.4 } },
  'kim-min-jae':    { id: 'kim-min-jae',    name: '김민재',      eng: 'Kim Min-Jae',    pos: 'DF', number: 3,  team: 'bayern',  nat: 'KOR', birth: '1996-11-15', height: 190, photo: '🛡️', seasonStats: { games: 26, goals: 1, assists: 0 } },
  'hwang-hee-chan': { id: 'hwang-hee-chan', name: '황희찬',      eng: 'Hwang Hee-Chan', pos: 'FW', number: 11, team: 'wolves',  nat: 'KOR', birth: '1996-01-26', height: 177, photo: '🐺', seasonStats: { games: 29, goals: 13, assists: 4 } },
};

// Fixtures — mix of past, live, and upcoming around TODAY (2026-04-15)
export const FIXTURES = [
  // ------- PAST -------
  { id: 101, date: '2026-04-12T14:00:00+09:00', league: 'k1', round: '정규리그 5R', home: 'pohang',  away: 'ulsan',   venue: 'pohang-steelyard', referee: '김우성', status: 'FT',  goals: { home: 0, away: 1 }, score: { ht: { h: 0, a: 0 }, ft: { h: 0, a: 1 } }, events: [
      { min: 47, type: 'goal', team: 'ulsan', player: 'jang-si-young', assist: 'um-won-sang' },
      { min: 63, type: 'yellow', team: 'pohang', player: null, playerName: '김인성' },
      { min: 75, type: 'sub', team: 'ulsan', playerIn: 'kim-min-woo', playerOut: 'um-won-sang' },
      { min: 93, type: 'red', team: 'ulsan', playerName: '김기희' },
  ], broadcasters: [ { key: 'coupangplay', name: '쿠팡플레이', url: '#' }, { key: 'tving', name: 'TVING', url: '#' } ], highlight: { title: '하이라이트 · 포항 0-1 울산', url: '#', length: '3:24' } },

  { id: 100, date: '2026-04-05T16:30:00+09:00', league: 'k1', round: '정규리그 4R', home: 'ulsan',  away: 'seoul',    venue: 'ulsan-munsu',      referee: '이동준', status: 'FT',  goals: { home: 2, away: 1 }, score: { ht: { h: 1, a: 0 }, ft: { h: 2, a: 1 } }, events: [
      { min: 23, type: 'goal', team: 'ulsan', player: 'jang-si-young' },
      { min: 55, type: 'goal', team: 'seoul', player: 'iljutcenko' },
      { min: 78, type: 'goal', team: 'ulsan', player: 'um-won-sang', assist: 'kim-min-woo' },
  ], broadcasters: [ { key: 'coupangplay', name: '쿠팡플레이', url: '#' } ], highlight: { title: '하이라이트 · 울산 2-1 서울', url: '#', length: '4:12' } },

  { id: 99, date: '2026-04-05T19:00:00+09:00', league: 'k1', round: '정규리그 4R', home: 'jeonbuk', away: 'gwangju', venue: 'jeonju-world', referee: '박진호', status: 'FT', goals: { home: 1, away: 1 }, score: { ht: { h: 1, a: 0 }, ft: { h: 1, a: 1 } }, events: [], broadcasters: [], highlight: null },

  // ------- LIVE TODAY (2026-04-15) -------
  { id: 150, date: '2026-04-15T19:30:00+09:00', league: 'k1', round: '정규리그 6R', home: 'seoul',   away: 'daegu',    venue: 'seoul-world',      referee: '최현재', status: 'LIVE', minute: 67, goals: { home: 1, away: 1 }, score: { ht: { h: 1, a: 0 }, ft: null }, events: [
      { min: 34, type: 'goal', team: 'seoul', player: 'iljutcenko' },
      { min: 58, type: 'goal', team: 'daegu', playerName: '세징야' },
  ], broadcasters: [ { key: 'coupangplay', name: '쿠팡플레이', url: '#' }, { key: 'tving', name: 'TVING', url: '#' } ], highlight: null },

  // ------- UPCOMING -------
  { id: 200, date: '2026-04-18T20:15:00+09:00', league: 'k1', round: '정규리그 6R', home: 'ulsan',   away: 'jeonbuk',  venue: 'ulsan-munsu',      referee: null,     status: 'NS', goals: null, score: null, events: [], broadcasters: [ { key: 'coupangplay', name: '쿠팡플레이', url: '#' }, { key: 'tving', name: 'TVING', url: '#' } ], highlight: null },

  { id: 201, date: '2026-04-18T16:30:00+09:00', league: 'k1', round: '정규리그 6R', home: 'pohang',  away: 'gwangju',  venue: 'pohang-steelyard', referee: null,     status: 'NS', goals: null, score: null, events: [], broadcasters: [ { key: 'tving', name: 'TVING', url: '#' } ], highlight: null },

  { id: 202, date: '2026-04-19T14:00:00+09:00', league: 'k1', round: '정규리그 6R', home: 'jeju',    away: 'daejeon',  venue: 'jeju-world',       referee: null,     status: 'NS', goals: null, score: null, events: [], broadcasters: [], highlight: null },

  { id: 203, date: '2026-04-19T16:30:00+09:00', league: 'k1', round: '정규리그 6R', home: 'incheon', away: 'suwon',    venue: 'incheon-football', referee: null,     status: 'NS', goals: null, score: null, events: [], broadcasters: [ { key: 'coupangplay', name: '쿠팡플레이', url: '#' } ], highlight: null },

  { id: 204, date: '2026-04-25T20:15:00+09:00', league: 'k1', round: '정규리그 7R', home: 'jeonbuk', away: 'pohang',   venue: 'jeonju-world',     referee: null,     status: 'NS', goals: null, score: null, events: [], broadcasters: [], highlight: null },

  { id: 205, date: '2026-04-25T16:30:00+09:00', league: 'k1', round: '정규리그 7R', home: 'seoul',   away: 'ulsan',    venue: 'seoul-world',      referee: null,     status: 'NS', goals: null, score: null, events: [], broadcasters: [ { key: 'coupangplay', name: '쿠팡플레이', url: '#' } ], highlight: null },

  // ------- K2 sample -------
  { id: 300, date: '2026-04-19T15:00:00+09:00', league: 'k2', round: '정규리그 5R', home: 'gimcheon', away: 'gangwon', venue: 'gimcheon-stadium', referee: null, status: 'NS', goals: null, score: null, events: [], broadcasters: [], highlight: null },
];

// Lineups for past finished matches
export const LINEUPS = {
  101: {
    home: { team: 'pohang', formation: '4-4-2', coach: '박태하', startXI: [
      { player: 'hwang-in-jae', pos: 'GK', grid: { row: 1, col: 3 } },
      { playerName: '박승욱', pos: 'DF', grid: { row: 2, col: 2 } },
      { playerName: '하창래', pos: 'DF', grid: { row: 2, col: 3 } },
      { playerName: '김인성', pos: 'DF', grid: { row: 2, col: 4 } },
      { playerName: '전민광', pos: 'DF', grid: { row: 2, col: 5 } },
      { playerName: '오베르단', pos: 'MF', grid: { row: 3, col: 2 } },
      { playerName: '완델손', pos: 'MF', grid: { row: 3, col: 3 } },
      { playerName: '홍윤상', pos: 'MF', grid: { row: 3, col: 4 } },
      { playerName: '김승대', pos: 'MF', grid: { row: 3, col: 5 } },
      { playerName: '제카', pos: 'FW', grid: { row: 4, col: 3 } },
      { playerName: '이호재', pos: 'FW', grid: { row: 4, col: 4 } },
    ] },
    away: { team: 'ulsan', formation: '4-2-3-1', coach: '홍명보', startXI: [
      { player: 'jo-hyeon-woo', pos: 'GK', grid: { row: 1, col: 3 } },
      { playerName: '설영우', pos: 'DF', grid: { row: 2, col: 2 } },
      { playerName: '김기희', pos: 'DF', grid: { row: 2, col: 3 } },
      { playerName: '김영권', pos: 'DF', grid: { row: 2, col: 4 } },
      { playerName: '이명재', pos: 'DF', grid: { row: 2, col: 5 } },
      { playerName: '박용우', pos: 'MF', grid: { row: 3, col: 2 } },
      { player: 'kim-min-woo', pos: 'MF', grid: { row: 3, col: 4 } },
      { player: 'um-won-sang', pos: 'MF', grid: { row: 4, col: 2 } },
      { playerName: '루빅손', pos: 'MF', grid: { row: 4, col: 3 } },
      { playerName: '바코', pos: 'MF', grid: { row: 4, col: 4 } },
      { player: 'jang-si-young', pos: 'FW', grid: { row: 5, col: 3 } },
    ] },
  },
};

// K1 standings — 14R done (mock)
export const STANDINGS_K1 = [
  { rank: 1,  team: 'ulsan',    played: 14, w: 9, d: 3, l: 2, gf: 23, ga: 8,  pts: 30, form: ['W','W','D','L','W'] },
  { rank: 2,  team: 'jeonbuk',  played: 14, w: 8, d: 4, l: 2, gf: 20, ga: 10, pts: 28, form: ['W','D','W','W','D'] },
  { rank: 3,  team: 'pohang',   played: 14, w: 7, d: 3, l: 4, gf: 18, ga: 12, pts: 24, form: ['L','W','W','L','W'] },
  { rank: 4,  team: 'seoul',    played: 14, w: 6, d: 4, l: 4, gf: 19, ga: 13, pts: 22, form: ['W','L','W','L','D'] },
  { rank: 5,  team: 'gwangju',  played: 14, w: 5, d: 5, l: 4, gf: 14, ga: 11, pts: 20, form: ['D','W','D','D','W'] },
  { rank: 6,  team: 'daegu',    played: 14, w: 5, d: 4, l: 5, gf: 15, ga: 15, pts: 19, form: ['L','D','W','L','W'] },
  { rank: 7,  team: 'suwon',    played: 14, w: 4, d: 5, l: 5, gf: 12, ga: 15, pts: 17, form: ['D','D','L','W','D'] },
  { rank: 8,  team: 'jeju',     played: 14, w: 4, d: 4, l: 6, gf: 11, ga: 14, pts: 16, form: ['L','W','D','L','D'] },
  { rank: 9,  team: 'gimcheon', played: 14, w: 4, d: 3, l: 7, gf: 13, ga: 18, pts: 15, form: ['W','L','L','D','L'] },
  { rank: 10, team: 'gangwon',  played: 14, w: 3, d: 5, l: 6, gf: 10, ga: 15, pts: 14, form: ['D','L','D','W','L'] },
  { rank: 11, team: 'incheon',  played: 14, w: 3, d: 3, l: 8, gf: 11, ga: 20, pts: 12, form: ['L','W','L','L','L'] },
  { rank: 12, team: 'daejeon',  played: 14, w: 2, d: 3, l: 9, gf: 9,  ga: 22, pts: 9,  form: ['L','L','D','L','L'] },
];

export const STANDINGS_K2 = [
  { rank: 1, team: 'gimcheon', played: 12, w: 8, d: 2, l: 2, gf: 19, ga: 8,  pts: 26, form: ['W','W','D','W','W'] },
  { rank: 2, team: 'gangwon',  played: 12, w: 7, d: 3, l: 2, gf: 17, ga: 10, pts: 24, form: ['W','D','W','W','D'] },
];

export const TOP_SCORERS_K1 = [
  { rank: 1, player: 'mugosa',        goals: 9, assists: 2 },
  { rank: 2, player: 'iljutcenko',    goals: 7, assists: 1 },
  { rank: 3, player: 'jang-si-young', goals: 7, assists: 3 },
  { rank: 4, player: 'um-won-sang',   goals: 4, assists: 6 },
  { rank: 5, player: 'kim-min-woo',   goals: 2, assists: 4 },
];

// Squad lists (truncated — just enough for team detail screen)
export const SQUADS = {
  ulsan: [
    { playerId: 'jo-hyeon-woo', pos: 'GK', number: 21 },
    { playerId: 'jang-si-young', pos: 'FW', number: 11 },
    { playerId: 'um-won-sang', pos: 'FW', number: 7 },
    { playerId: 'kim-min-woo', pos: 'MF', number: 8 },
  ],
  pohang: [
    { playerId: 'hwang-in-jae', pos: 'GK', number: 21 },
  ],
  incheon: [ { playerId: 'mugosa', pos: 'FW', number: 9 } ],
  seoul:   [ { playerId: 'iljutcenko', pos: 'FW', number: 15 } ],
};

// News
export const NEWS = [
  { id: 1, title: '울산 현대, 전북전 앞두고 주포 엄원상 컨디션 의문', source: '스포츠조선', time: '2시간 전', category: 'k1', team: 'ulsan',  thumb: '📰' },
  { id: 2, title: '손흥민 시즌 22호골 폭발… 토트넘 리버풀 격파',       source: '인터풋볼',   time: '3시간 전', category: 'overseas', team: 'spurs', thumb: '🌟' },
  { id: 3, title: '이강인 라리가 클라시코 선발 출전',                 source: '스포츠서울', time: '5시간 전', category: 'overseas', team: 'psg', thumb: '✨' },
  { id: 4, title: '포항, 오베르단과 2년 재계약 임박',                  source: '포포투',     time: '7시간 전', category: 'k1', team: 'pohang',  thumb: '✍️' },
  { id: 5, title: '김민재 발목 부상 복귀 시점 언제?',                  source: 'OSEN',       time: '9시간 전', category: 'overseas', team: 'bayern', thumb: '🩹' },
  { id: 6, title: 'K리그1 6라운드 프리뷰 — 울산 vs 전북 빅매치',        source: '인터풋볼',   time: '10시간 전', category: 'k1', team: null, thumb: '⚔️' },
  { id: 7, title: '대표팀 6월 A매치 파라과이·튀르키예와 맞대결',        source: 'SPOTV뉴스',  time: '12시간 전', category: 'national', team: 'korea', thumb: '🇰🇷' },
  { id: 8, title: '황희찬 울버햄튼 이적 시장 주요 타깃으로',            source: '스포츠경향', time: '1일 전',   category: 'overseas', team: 'wolves', thumb: '🐺' },
];

// Overseas schedule
export const OVERSEAS_ITEMS = [
  { playerId: 'son-heung-min',  league: 'EPL',        leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', teamName: '토트넘',    last: { opp: '리버풀', gf: 3, ga: 1, goals: 2, assists: 1, rating: 9.1 }, next: { date: '2026-04-18', opp: '맨시티' } },
  { playerId: 'lee-kang-in',    league: '리그앙',     leagueFlag: '🇫🇷', teamName: 'PSG',       last: { opp: '바르사(챔스)', gf: 2, ga: 2, goals: 0, assists: 1, rating: 7.4 }, next: { date: '2026-04-19', opp: '레알 소시에다드' } },
  { playerId: 'kim-min-jae',    league: '분데스',     leagueFlag: '🇩🇪', teamName: '바이에른', last: { opp: '도르트문트', gf: 2, ga: 0, goals: 0, assists: 0, rating: 7.8 }, next: { date: '2026-04-20', opp: '레버쿠젠' } },
  { playerId: 'hwang-hee-chan', league: 'EPL',        leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', teamName: '울버햄튼', last: { opp: '아스톤 빌라', gf: 1, ga: 1, goals: 1, assists: 0, rating: 7.6 }, next: { date: '2026-04-21', opp: '브라이튼' } },
];

// ---------------- Helpers ----------------
export const teamOf = (id) => TEAMS[id];
export const playerOf = (id) => PLAYERS[id];
export const venueOf = (id) => VENUES[id];
export const fixtureOf = (id) => FIXTURES.find((f) => f.id === Number(id));

export const formatKST = (isoString, withDate = true) => {
  const d = new Date(isoString);
  const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return withDate ? `${mm}/${dd} (${day}) ${hh}:${mi}` : `${hh}:${mi}`;
};

export const dayKey = (isoString) => {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const daysUntil = (isoString, base = TODAY) => {
  const d = new Date(isoString);
  const diff = Math.ceil((d - base) / (1000 * 60 * 60 * 24));
  return diff;
};

export const getMyTeam = () => localStorage.getItem('myTeam') || 'ulsan';
export const setMyTeam = (id) => localStorage.setItem('myTeam', id);
export const getMyTeams = () => {
  const raw = localStorage.getItem('myTeams');
  return raw ? JSON.parse(raw) : ['ulsan'];
};
export const setMyTeams = (ids) => localStorage.setItem('myTeams', JSON.stringify(ids));

export const isOnboarded = () => localStorage.getItem('onboarded') === 'true';
export const setOnboarded = () => localStorage.setItem('onboarded', 'true');

export const getCheckins = () => {
  const raw = localStorage.getItem('checkins');
  return raw ? JSON.parse(raw) : [5, 9, 99, 100]; // seed with a few past matches
};
export const toggleCheckin = (fixtureId) => {
  const list = getCheckins();
  const next = list.includes(fixtureId) ? list.filter((x) => x !== fixtureId) : [...list, fixtureId];
  localStorage.setItem('checkins', JSON.stringify(next));
  return next;
};

export const getSavedNews = () => {
  const raw = localStorage.getItem('savedNews');
  return raw ? JSON.parse(raw) : [];
};
export const toggleSaved = (newsId) => {
  const list = getSavedNews();
  const next = list.includes(newsId) ? list.filter((x) => x !== newsId) : [...list, newsId];
  localStorage.setItem('savedNews', JSON.stringify(next));
  return next;
};

export const getNotifSettings = () => {
  const raw = localStorage.getItem('notifSettings');
  return raw ? JSON.parse(raw) : {
    all: true,
    team_kickoff_60: true,
    team_kickoff_10: true,
    team_lineup: true,
    team_goal: true,
    team_final: true,
    team_transfer: false,
    national: true,
    overseas_son: true,
    overseas_lee: true,
    overseas_kim: false,
    dnd: true,
  };
};
export const setNotifSettings = (obj) => {
  localStorage.setItem('notifSettings', JSON.stringify(obj));
};
