// Korean localization: glossary + rule based translation of the original English names.

import type { Nation, TerrainKind, UnitKind } from '../data/types.ts';

export const TERRAIN_KO: Record<TerrainKind, string> = {
  open: '개활지', rough: '험지', mountain: '산악', urban: '도시', offmap: '작전 지역 밖 (만주)',
  ocean: '바다', estuary: '하구·갯벌', reservoir: '저수지·호수', undefined: '미정의', japan: '일본 (배치 지역)',
};

/** Parts of the original terrain code names (map.json hex.label, e.g. "Rough/RR/River"). */
const TERRAIN_CODE_PART_KO: Record<string, string> = {
  Open: '개활지', Rough: '험지', Mountain: '산악', Urban: '도시', River: '강', Road: '도로', RR: '철도',
  Estuary: '하구', Reservoir: '저수지', 'Deep Ocean': '깊은 바다', 'Map edge': '지도 끝', 'Off Map': '지도 밖',
};

export function terrainCodeKo(label: string): string {
  return label.split('/').map((p) => TERRAIN_CODE_PART_KO[p.trim()] ?? p.trim()).join('·');
}

export const NATION_KO: Record<Nation, string> = {
  US: '미군', USMC: '미 해병대', CW: '영연방군', UN: '유엔군', ROK: '국군', NKPA: '북한군', CPLA: '중공군',
};

export const SIDE_OF: Record<Nation, 'un' | 'communist'> = {
  US: 'un', USMC: 'un', CW: 'un', UN: 'un', ROK: 'un', NKPA: 'communist', CPLA: 'communist',
};

export const SIDE_KO = { un: '유엔군', communist: '공산군' } as const;
export const POSSESSION_KO: Record<number, string> = { 0: '없음', 1: '유엔군 점령', 2: '공산군 점령' };

export const KIND_KO: Record<UnitKind, string> = {
  armor: '기갑·기병', infantry: '보병', airborne: '공수·특수전', heavy_artillery: '중포병', artillery: '포병',
};

export const EXPERIENCE_KO: Record<number, string> = { 1: '신병', 2: '숙련', 3: '정예' };
export const TEMPERATURE_KO: Record<number, string> = { 1: '추위', 2: '온화', 3: '더위' };
export const SKY_KO: Record<number, string> = { 1: '맑음', 2: '흐림', 3: '폭풍' };

export const EQUIPMENT_KO: Record<string, string> = {
  'Light Tank': '경전차', 'Medium Tank': '중형 전차', 'Heavy Tank': '중전차',
  'Light Artillery': '경야포', 'Medium Artillery': '중형 야포', 'Heavy Artillery': '대형 야포',
  'Light SP Gun': '경자주포', 'Medium SP Gun': '중형 자주포', 'Heavy SP Gun': '대형 자주포',
  Gunship: '공격헬기', 'Medium MRL': '중형 다연장로켓', 'Heavy MRL': '대형 다연장로켓',
  'Rifle Platoon': '소총소대', 'Weapons Platoon': '화기소대', 'Mech Platoon': '기계화소대', 'Mech Wx Platoon': '기계화 화기소대',
  nothing: '-',
};

export const AIRCRAFT_KO: Record<string, string> = {
  Invader: 'B-26 인베이더', Superfortress: 'B-29 슈퍼포트리스', 'Shooting Star': 'F-80 슈팅스타',
  Firefly: '파이어플라이', Seafire: '시파이어', Corsair: 'F4U 코세어', Tigercat: 'F7F 타이거캣',
  'Twin Mustang': 'F-82 트윈 머스탱', Mustang: 'F-51 머스탱', 'Sea Fury': '시퓨리', Skyraider: 'AD 스카이레이더',
  Thunderjet: 'F-84 선더제트', Panther: 'F9F 팬서', Sabre: 'F-86 세이버',
  // 1995
  'H-5': 'H-5 (Il-28) 폭격기', 'J-5': 'J-5 (MiG-17)', 'J-6': 'J-6 (MiG-19)', 'MiG-21/J-7': 'MiG-21 / J-7', 'F-18': 'F/A-18 호넷',
  'MiG-23': 'MiG-23 플로거', 'MiG-29': 'MiG-29 펄크럼', 'F-4': 'F-4 팼텀 II', 'F-5': 'F-5 타이거 II', 'F-14': 'F-14 톰캣',
  'F-15': 'F-15 이글', 'F-16': 'F-16 파이팅 팰컨', 'F-111': 'F-111 아드바크', 'A-10': 'A-10 썬더볼트 II',
  'B-52': 'B-52 스트래토포트리스',
};

export const PLACE_KO: Record<string, string> = {
  Seoul: '서울', Taejon: '대전', Kwangju: '광주', Taegu: '대구', Pusan: '부산', "P'yongYang": '평양',
  'Hamhung/Hungnam': '함흥·흥남', "Inch'on": '인천', Kunsan: '군산', Wonsan: '원산',
};

const UN_COUNTRY: Record<string, string> = {
  Thai: '태국', Dutch: '네덜란드', French: '프랑스', Greek: '그리스', Belgian: '벨기에', Ethiopian: '에티오피아',
};

type Rule = [RegExp, (m: RegExpMatchArray) => string];

const UNIT_RULES: Rule[] = [
  // 1950s North Korea
  [/^NKPA (\d+)\/(\d+) Inf Rgt$/, (m) => `북한군 제${m[2]}사단 ${m[1]}연대`],
  [/^NKPA (\d+)\/(\d+) Arty Rgt$/, (m) => `북한군 제${m[2]}사단 ${m[1]}포병연대`],
  [/^NKPA (\d+) Arty Rgt$/, (m) => `북한군 ${m[1]}포병연대`],
  [/^NKPA (\d+) Tank Rgt$/, (m) => `북한군 ${m[1]}전차연대`],
  [/^NKPA (\d+) MC Rgt$/, (m) => `북한군 ${m[1]}모터사이클연대`],
  [/^NKPA (\d+) Marine Rgt$/, (m) => `북한군 ${m[1]}해병연대`],
  // China
  [/^CPLA (\d+)\/(\d+) Inf Div$/, (m) => `중공군 제${m[2]}군 ${m[1]}사단`],
  [/^CPLA (\d+)\/(\d+) Arty Rgt$/, (m) => `중공군 제${m[2]}군 ${m[1]}포병연대`],
  [/^CPLA Cav Rgt$/, () => '중공군 기병연대'],
  // Republic of Korea
  [/^ROK (\d+)\/Cap Inf Rgt$/, (m) => `국군 수도사단 ${m[1]}연대`],
  [/^ROK (\d+)\/(\d+) Inf Rgt$/, (m) => `국군 제${m[2]}사단 ${m[1]}연대`],
  [/^ROK Marine Rgt$/, () => '한국 해병대 연대'],
  // United States
  [/^US TF Smith$/, () => '미군 스미스 특수임무부대'],
  [/^US TF McClean$/, () => '미군 매클린 특수임무부대'],
  [/^US (\d+)\/(\d+) Cav RCT$/, (m) => `미군 제${m[2]}기병사단 ${m[1]}연대전투단`],
  [/^US (\d+)\/(\d+) Cav Tank Bn$/, (m) => `미군 제${m[2]}기병사단 ${m[1]}전차대대`],
  [/^US (\d+)\/(\d+) Cav FAB\(H\)$/, (m) => `미군 제${m[2]}기병사단 ${m[1]}포병대대(중)`],
  [/^US (\d+)\/(\d+) Inf RCT$/, (m) => `미군 제${m[2]}사단 ${m[1]}연대전투단`],
  [/^US (\d+)\/(\d+) Tank Bn$/, (m) => `미군 제${m[2]}사단 ${m[1]}전차대대`],
  [/^US (\d+)\/(\d+) FAB\(H\)$/, (m) => `미군 제${m[2]}사단 ${m[1]}포병대대(중)`],
  [/^US (\d+) FAB\(H\)$/, (m) => `미군 ${m[1]}포병대대(중)`],
  [/^US (\d+) FAB$/, (m) => `미군 ${m[1]}포병대대`],
  [/^US (\d+) Inf RCT$/, (m) => `미군 ${m[1]}연대전투단`],
  [/^US (\d+) RCT$/, (m) => `미군 ${m[1]}공수연대전투단`],
  [/^US (\d+) CMB$/, (m) => `미군 ${m[1]}화학박격포대대`],
  [/^USMC (\d+) Inf RCT$/, (m) => `미 해병 ${m[1]}연대전투단`],
  [/^USMC (\d+) Tank Bn$/, (m) => `미 해병 ${m[1]}전차대대`],
  // Commonwealth and other UN contingents
  [/^CW (\d+) Inf Bde$/, (m) => `영연방 제${m[1]}보병여단`],
  [/^CW Tank Bn$/, () => '영연방 전차대대'],
  [/^Philippines (\d+) BCT$/, (m) => `필리핀 제${m[1]}대대전투단`],
  [/^Turkish Bde$/, () => '튀르키예 여단'],
  [/^(Thai|Dutch|French|Greek|Belgian|Ethiopian) Inf Bn$/, (m) => `${UN_COUNTRY[m[1]]} 보병대대`],
  // 1995 scenario
  [/^NKPA (\d+) Mot Inf Div$/, (m) => `북한군 제${m[1]}차량화보병사단`],
  [/^NKPA (\d+) Inf Div$/, (m) => `북한군 제${m[1]}보병사단`],
  [/^NKPA (\d+) Mot Inf Bde$/, (m) => `북한군 제${m[1]}차량화보병여단`],
  [/^NKPA (\d+) Inf Bde$/, (m) => `북한군 제${m[1]}보병여단`],
  [/^NKPA (\d+) Tank Bde$/, (m) => `북한군 제${m[1]}전차여단`],
  [/^NKPA (\d+) Arty Bde$/, (m) => `북한군 제${m[1]}포병여단`],
  [/^NKPA (\d+) Cdo Bde$/, (m) => `북한군 제${m[1]}특수작전여단`],
  [/^ROK (\d+) Inf Div$/, (m) => `국군 제${m[1]}보병사단`],
  [/^ROK (\d+) Inf Bde$/, (m) => `국군 제${m[1]}보병여단`],
  [/^ROK (\d+) Mech Bde$/, (m) => `국군 제${m[1]}기계화여단`],
  [/^ROK (\d+) Arty Bde$/, (m) => `국군 제${m[1]}포병여단`],
  [/^US (\d+)\/(\d+) Inf Bde$/, (m) => `미군 제${m[2]}사단 ${m[1]}여단`],
  [/^US (\d+)\/(\d+) Arm Bde$/, (m) => `미군 제${m[2]}사단 ${m[1]}기갑여단`],
  [/^US (\d+)\/(\d+) Cav Bde$/, (m) => `미군 제${m[2]}기병사단 ${m[1]}여단`],
  [/^US (\d+) Arm Cav Rgt$/, (m) => `미군 제${m[1]}기갑기병연대`],
  [/^US (\d+) Inf Bde$/, (m) => `미군 제${m[1]}보병여단`],
  [/^US (\d+) Army Arty$/, (m) => `미군 제${m[1]}군 포병`],
  [/^US (\d+) Arty Bde$/, (m) => `미군 제${m[1]}포병여단`],
  [/^US (\d+) Cav Arty$/, (m) => `미군 제${m[1]}기병사단 포병`],
  [/^US (\d+) Div Arty$/, (m) => `미군 제${m[1]}사단 포병`],
  [/^USMC (\d+) Inf Rgt$/, (m) => `미 해병 제${m[1]}연대`],
  [/^USMC (\d+) Arty Rgt$/, (m) => `미 해병 제${m[1]}포병연대`],
];

const FORCE_RULES: Rule[] = [
  [/^NKPA (\d+)(?:st|nd|rd|th) Div$/, (m) => `북한군 제${m[1]}사단`],
  [/^NKPA (\d+) Corps$/, (m) => `북한군 제${m[1]}군단`],
  [/^NKPA (\d+) Arty Corps$/, (m) => `북한군 제${m[1]}포병군단`],
  [/^NKPA (\d+) Mnvr Grp$/, (m) => `북한군 제${m[1]}기동집단`],
  [/^CPLA (\d+)(?:st|nd|rd|th) Army$/, (m) => `중공군 제${m[1]}군`],
  [/^ROK (\d+) Mech Div$/, (m) => `국군 제${m[1]}기계화사단`],
  [/^US (\d+) Inf Div(-?)$/, (m) => `미군 제${m[1]}보병사단${m[2] ? ' (일부)' : ''}`],
  [/^USMC (\d+) Mar Div-?$/, (m) => `미 해병 제${m[1]}사단 (일부)`],
];

const TOKENS: [RegExp, string][] = [
  [/^NKPA\b/, '북한군'], [/^CPLA\b/, '중공군'], [/^ROK\b/, '국군'], [/^USMC\b/, '미 해병'], [/^US\b/, '미군'], [/^CW\b/, '영연방'],
  [/\bInf\b/g, '보병'], [/\bRgt\b/g, '연대'], [/\bDiv\b/g, '사단'], [/\bBde\b/g, '여단'], [/\bBn\b/g, '대대'],
  [/\bCorps\b/g, '군단'], [/\bArmy\b/g, '군'], [/\bTank\b/g, '전차'], [/\bArty\b/g, '포병'], [/\bCav\b/g, '기병'],
  [/\bMech\b/g, '기계화'], [/\bMot\b/g, '차량화'], [/\bArm\b/g, '기갑'], [/\bMarine\b/g, '해병'], [/\bRCT\b/g, '연대전투단'],
];

function applyRules(rules: Rule[], s: string): string | null {
  for (const [re, fn] of rules) {
    const m = s.match(re);
    if (m) return fn(m);
  }
  return null;
}

export function unitNameKo(name: string): string {
  const s = name.trim();
  return applyRules(UNIT_RULES, s) ?? TOKENS.reduce((acc, [re, ko]) => acc.replace(re, ko), s);
}

export function forceNameKo(name: string): string {
  const s = name.replace(/\+$/, '').trim();
  return applyRules(FORCE_RULES, s) ?? unitNameKo(s);
}

const MONTH_NUM: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, Aug: 8,
  September: 9, Sept: 9, October: 10, November: 11, December: 12,
};

export function dateKo(year: number, month: number, day: number): string {
  return `${year}년 ${month}월 ${day}일`;
}

const NEWS_RULES: Rule[] = [
  [/^North Korean forces invade South Korea\.$/, () => '북한군, 남침 개시'],
  [/^U\.N\. requests aid for South Korea\.$/, () => '유엔, 회원국에 한국 지원 요청'],
  [/^Civilian refugees clog Korean roads\.$/, () => '피란민 행렬로 도로 마비'],
  [/^Communist forces occupy (.+)\.$/, (m) => `공산군, ${PLACE_KO[m[1]] ?? m[1]} 점령`],
  [/^U\.N\. forces occupy (.+)\.$/, (m) => `유엔군, ${PLACE_KO[m[1]] ?? m[1]} 점령`],
  [/^(U\.N\.|Communist) aircraft (lightly|moderately|strongly) interdict (U\.N\.|Communist|communist) supply lines\.$/,
    (m) => `${m[1] === 'U.N.' ? '유엔' : '공산'} 공군, ${m[3] === 'U.N.' ? '유엔군' : '공산군'} 보급선 ${INTERDICT_ADV_KO[m[2]]} 차단`],
  [/^(North Korean|United Nations) air force has been neutralized\.$/, (m) => `${m[1] === 'North Korean' ? '북한' : '유엔'} 공군 무력화`],
  [/^United Nations units enter North Korea\.$/, () => '유엔군, 38선 넘어 북한 진입'],
  [/^China pledges to halt imperialist aggression in Korea\.$/, () => "중국, '조선에서의 제국주의 침략 저지' 천명"],
  [/^Red Chinese army units have intervened in Korea!$/, () => '중공군 부대, 한국전쟁에 참전!'],
  [/^North Korean commandos attack South Korean supply dumps\.$/, () => '북한 특수부대, 한국군 보급 기지 습격'],
  [/^United Nations forces occupy (.+)\.$/, (m) => `유엔군, ${PLACE_KO[m[1]] ?? m[1]} 점령`],
  [/^U\.N\. forces discover bodies of POW's executed by NKPA\.$/, () => '유엔군, 북한군이 처형한 포로 시신 발견'],
  [/^U\.N\. forces uncover mass graves of executed civilians\.$/, () => '유엔군, 민간인 집단 학살 매장지 발견'],
  [/^Additional U\.S\. reinforcements due next week\.$/, () => '다음 주 미군 증원 병력 추가 도착 예정'],
  [/^Communist guerrillas active behind U\.N\. lines\.$/, () => '유엔군 후방에서 공산 게릴라 활동'],
  [/^U\.N\. forces engaged in counter guerrilla operations\.$/, () => '유엔군, 게릴라 소탕 작전 전개'],
  [/^Stalemate in Korea\.$/, () => '한국전쟁, 교착 상태로 종전'],
  [/^(Marginal|Significant|Decisive) United Nations victory in Korea\.$/, (m) => `유엔군 ${VICTORY_ADJ_KO[m[1]]} 승리`],
  [/^(Marginal|Significant|Decisive) Communist victory in Korea\.$/, (m) => `공산군 ${VICTORY_ADJ_KO[m[1]]} 승리`],
  [/^Korea to be unified under United Nations supervision\.$/, () => '유엔 감독 아래 한반도 통일 결정'],
  [/^American press demands President's resignation\.$/, () => '미국 언론, 대통령 사임 요구'],
  [/^Peace groups insist on withdrawal of U\.S\. forces from overseas\.$/, () => '평화 단체들, 해외 미군 철수 요구'],
  [/^Seoul is to be renamed "Kim Il-Sung City"\.$/, () => "서울, '김일성시'로 개명 예정"],
  [/^\*+Player has elected to continue past end of game\*+$/, () => '플레이어가 종전 이후에도 전쟁을 계속하기로 함'],
  [/^\*+Victory conditions are no longer valid\*+$/, () => '이제부터 승리 조건은 적용되지 않음'],
];

const VICTORY_ADJ_KO: Record<string, string> = { Marginal: '근소한', Significant: '뚜렷한', Decisive: '결정적' };
const INTERDICT_ADV_KO: Record<string, string> = { lightly: '일부', moderately: '상당 부분', strongly: '대부분' };

export function newsKo(line: string): { date: string; text: string } {
  const m = line.match(/^(\d+)-([A-Za-z]+)-(\d{4}):(.*)$/);
  if (!m) return { date: '', text: applyRules(NEWS_RULES, line) ?? line };
  const month = MONTH_NUM[m[2]] ?? 0;
  return { date: dateKo(Number(m[3]), month, Number(m[1])), text: applyRules(NEWS_RULES, m[4].trim()) ?? m[4].trim() };
}

// ---------- mountains and lakes (src/data/places.ts NATURAL_FEATURES) ----------

export const NATURE_KO = {
  peak: '산',
  lake: '호수',
  range: '산맥·고원',
  elevation: (m: number) => `해발 ${m.toLocaleString('ko-KR')}m`,
  built: (year: number) => `${year}년 완공`,
  historic: (name: string) => `전쟁 당시 ${name}`,
  estimated: '추정',
  source: '산 정상·호수 위치는 GeoNames, 헥스 대응은 위치 보정 추정',
} as const;

// ---------- turn sequence (docs/rules/turn.md) ----------

export const PLAYER_KO: Record<number, string> = { 1: '공산군', 2: '유엔군' };
export const PHASE_KO: Record<number, string> = { 0: '턴 준비', 1: '1차 명령 단계', 2: '전투 단계', 3: '2차 명령 단계', 4: '정리 단계' };

export const END_REASON_KO: Record<string, string> = {
  lastTurn: '1951년 5월 22일, 정해진 마지막 턴이 끝났습니다.',
  noIntervention: '중국이 개입하지 않은 채 1951년 1월 8일이 되었습니다. 미국 여론은 "크리스마스 전 귀국"을 기대합니다.',
  lastTurn1995: '1995년 10월 15일, 정해진 마지막 턴이 끝났습니다.',
  unHoldsAll: '유엔군이 지도 전체를 장악했습니다.',
  communistHoldsCities: '공산군이 한국의 모든 도시를 장악했습니다.',
};

export const TURN_UI_KO = {
  endPhase: '단계 종료',
  endPhaseTitle: '이 단계의 명령을 마치고 다음 단계로',
  endPhaseConfirm: (side: string, phase: string) => `${side} ${phase}를 끝낼까요?`,
  begin: '시작',
  beginPhase: (side: string, phase: string) => `${side} ${phase}`,
  handover: '두 사람이 번갈아 할 때는 상대가 화면을 보지 않도록 자리를 바꾸세요.',
  noFirstPhase: '이번 턴에는 유엔군의 1차 명령 단계가 없습니다 (기습).',
  computerPhase: '컴퓨터 진영은 아직 AI가 없어 움직이지 않습니다.',
  computerOrders: (side: string, phase: string, moved: number, assaults: number) =>
    `컴퓨터(${side}) ${phase}: 부대 ${moved}개 이동${assaults ? `, 공격 ${assaults}건 계획` : ''}.`,
  computerMerged: (n: number) => `컴퓨터가 같은 헥스의 부대 ${n}쌍을 하나로 합쳤습니다.`,
  computerNotice: (unit: string, hex: string) => `${unit}: (${hex}) 헥스가 돌파되어 제거되었습니다.`,
  reinforcements: '증원 부대가 도착했습니다.',
  notYourForce: '지금은 상대 진영의 명령 단계입니다',
  enemyForce: '상대 진영',
  turnReport: '턴 정리 결과',
  combatReport: '전투 결과',
  supply: '보급',
  resupplied: '재보급',
  airSupplied: '공중 보급',
  unsupplied: '보급 실패',
  attrition: '보급 두절로 장비 손실',
  interdiction: '유엔 항공 차단 수준',
  stockpile: '보급 비축',
  shipments: '이번 턴 수송량',
  reinforcementsArrived: '증원 도착',
  heldOff: '도착 지연 (진입 헥스 없음)',
  rebuilt: '재편성 (다음 턴 이후 복귀)',
  replaced: '보충 장비',
  patrols: '정찰대가 확보한 헥스',
  guerrillas: '게릴라',
  reverted: '공산군에 반환된 도시',
  mined: '기뢰 부설',
  swept: '기뢰 제거',
  refugees: '피란민이 도로를 막습니다 (다음 턴 유엔군 도로 이동 불가)',
  news: '소식',
  weather: '날씨',
  forecast: '예보',
  freezeLine: '결빙선',
  victory: '승리 수준',
  victoryNone: '무승부 수준',
  peaceTalks: '평화 회담이 시작되었습니다',
  endGame: '게임 끝내기',
  override: '계속 싸우기',
  overrideNote: '계속하면 승리 조건은 더 이상 적용되지 않습니다.',
  gameOver: '게임 종료',
  result: '최종 결과',
  supplyLayer: '보급망',
  inNet: (side: string) => `${side} 보급망 안`,
  outOfNet: '보급망 밖 (보급 끊김)',
  phaseLabel: (turn: number, phase: string, side: string) => `${turn}턴 · ${phase} · ${side}`,
} as const;

export function victoryKo(level: number): string {
  if (level > 0) return `유엔군 ${level}`;
  if (level < 0) return `공산군 ${-level}`;
  return '균형';
}

// ---------- movement (docs/rules/movement.md) ----------

export const MOVE_MODE_KO = { tactical: '일반 이동', rail: '철도 이동', sea: '해상 이동', air: '공수 낙하' } as const;

export const BLOCK_KO: Record<string, string> = {
  offMap: '지도 밖',
  notAdjacent: '인접하지 않은 헥스',
  impassable: '통행할 수 없는 지형',
  water: '바다·하구 (해상 이동 필요)',
  noRail: '연결된 아군 철도 없음',
  stackFull: '아군 부대 2개로 꽉 참',
  enemy: '적 부대 있음',
  allowance: '이동력 부족',
  notOnMap: '지도에 배치되지 않은 부대',
  notEnemy: '적 부대가 없는 헥스',
  blocked: '들어갈 수 없는 헥스',
  needSixPoints: '공격에는 모든 유닛에 이동력 6점 필요',
  phase: '지금 단계에서는 불가',
  noAllowance: '이번 턴 이동력을 모두 씀',
  cannotEntrain: '철도 이동 조건이 맞지 않음',
  cannotStop: '그 헥스에서는 멈출 수 없음',
  emptyPath: '경로 없음',
  // sea and airborne movement (docs/rules/naval.md)
  atSea: '바다 위의 부대는 해상 이동만 가능',
  mined: '기뢰가 깔린 항구에는 상륙할 수 없음',
  seaRoute: '해상 이동은 먼저 바다로 나가야 함',
  notCoastal: '해안(깊은 바다에 닿은 헥스)이 아님',
  moved: '이번 턴에 이미 움직임',
  storm: '폭풍 턴에는 불가',
  notUn: '유엔군만 가능',
  sealift: '이번 턴 해상 수송 여유 부족 (턴당 4점)',
  sealift1995: '1995년: 이번 턴 해상 수송을 이미 씀',
  usmcOnly: '1995년: 단독 미 해병 유닛만 가능',
  notAirborne: '공수 부대(미 187 공정연대전투단)만 가능',
  scenario: '1995년 시나리오에는 공수 부대가 없음',
  notAirfield: '비행장이나 일본에 있어야 함',
  notAlone: '다른 유닛이 붙어 있지 않아야 함',
  noLaunch: '그 옆에 들어갈 수 있는 바다 헥스가 없음',
  seaAssaultLimit: '상륙 공격 명령은 턴당 2개까지 (돌파도 불가)',
  // intelligence (docs/rules/intel.md)
  enemyFound: '숨어 있던 적 부대를 발견했습니다 (정찰 1단계)',
};

export const MOVE_UI_KO = {
  orders: '이동 명령',
  remaining: '남은 이동력',
  readiness: '준비도',
  moved: '이번 턴 이동함',
  notMoved: '아직 이동 안 함',
  assaultPlotted: '공격 계획 있음 (이동하면 취소, 예약 5점 반환)',
  confirm: '이동 확정',
  cancel: '취소',
  undo: '되돌리기',
  bugOut: '버그아웃 (장비 손실, 6점 이동)',
  bugOutConfirm: '버그아웃을 명령할까요? 장비 일부를 잃고 준비도가 50 이하로 떨어집니다.',
  select: '이동',
  selected: '선택됨',
  preview: '경로 미리보기',
  destination: '목적지',
  steps: '이동 칸',
  cost: '소모',
  after: '이동 후 남음',
  readinessLoss: '준비도 감소',
  capturesWarn: '적 점령지에 들어갑니다. 이 이동은 되돌릴 수 없어요.',
  railWarn: '철도 이동 후에는 이번 턴에 더 움직일 수 없고, 되돌릴 수도 없어요. 적 항공 차단에 걸리면 선두 유닛이 손실을 입습니다.',
  minMoveNote: '아직 움직이지 않은 부대는 이동력이 모자라도 한 칸은 들어갈 수 있어요 (원작 규칙).',
  hint: '목적지를 클릭하면 경로가 고정되고, 같은 헥스를 한 번 더 클릭하면 이동합니다. 오른쪽 클릭으로 취소.',
  cycleHint: '같은 헥스를 다시 클릭하면 다른 부대를 고릅니다.',
  railStops: '철도로 갈 수 있는 헥스',
  reachable: '갈 수 있는 헥스',
  breakdown: '비용 내역',
  done: '이동 완료',
  undone: '이동을 되돌렸습니다',
  failed: '이동할 수 없음',
  interdicted: '철도 수송 중 적 항공 차단으로 선두 유닛 장비 손실',
  bugOutDone: '버그아웃: 장비를 버리고 후퇴합니다 (6점 이동 가능)',
  bugOutMoving: '전선을 따라 이동하던 신병 유닛이 버그아웃 (후퇴했던 부대, 장비 손실)',
  points: '점',
  unlimited: '무제한',
  cannotStopHere: '멈출 수 없음 (통과만)',
} as const;

// ---------- sea and airborne movement (docs/rules/naval.md) ----------

export const NAVAL_UI_KO = {
  seaHint: '바다 헥스는 거리와 상관없이 지나갈 수 있고, 해안 헥스를 클릭하면 상륙합니다. 상륙하면 이번 턴 이동이 끝나요. 적 부대가 있는 해안은 상륙 공격입니다.',
  airHint: '아무 육지 헥스나 골라 낙하합니다. 낙하하면 이번 턴 이동이 끝나요.',
  landings: '상륙할 수 있는 헥스',
  drops: '낙하할 수 있는 헥스',
  seaTargets: '상륙 공격 가능한 적 해안',
  sealiftUsed: (used: number, max: number) => `이번 턴 해상 수송 ${used}/${max}점 사용`,
  sealiftLabel: '해상 수송 점수',
  sealift1995: '1995년: 턴당 단독 미 해병 1개',
  startCost: (pts: number) => (pts === 0 ? '바다에서 출발: 0점' : pts === 2 ? '항구에서 승선: 2점' : '해안에서 승선: 3점 (선두 유닛 버그아웃 손실)'),
  portRefund: '항구에 상륙: 1점 반환',
  seaAssaults: (n: number) => `이번 턴 상륙 공격 명령 ${n}/2`,
  airlift: '공수하면 턴 끝 유엔 비축이 2 줄어요 (공중 수송 수요)',
  embark: '승선',
  atSeaStep: '해상',
  landing: '상륙',
  drop: '낙하',
  dropLoss: '낙하 손실률',
  dropBreakdown: (terrain: number, weather: number, mig: number) =>
    `지형 ${terrain}%${weather ? ` · 흐림 +${weather}%` : ''}${mig ? ` · 미그 앨리 공산 요격 +${mig}%` : ''}`,
  friendlyAirfield: '아군 비행장: 손실 없음',
  enemyTerritory: '적 점령지에 낙하하면 그 헥스를 점령합니다.',
  dropOnEnemy: '적 부대가 있는 헥스: 원작 규칙에서는 낙하 직후 돌파에 필요한 이동력이 없어 공수 부대가 전멸합니다.',
  dropConfirmDanger: '낙하 (전멸 위험)',
  confirmSea: '상륙 확정',
  confirmAir: '낙하 확정',
  seaWarn: '해상 이동은 되돌릴 수 없고, 상륙하면 이번 턴에 더 움직일 수 없어요. 준비도는 줄지 않습니다.',
  beachWarn: '항구가 아닌 해안에서 승선하면 선두 유닛이 버그아웃 손실(장비 일부, 준비도 50 이하)을 입어요.',
  seaDone: (pts: number) => `상륙 완료 · 해상 수송 ${pts}점`,
  airDone: (loss: number) => `낙하 완료 · 장비 손실률 ${loss}%`,
  airDestroyed: '공수 부대가 적 부대 한가운데 낙하해 전멸했습니다',
  seaAssaultPreview: '상륙 공격 미리보기',
  seaAssaultNote: '전투 단계에서 바다에서 공격합니다. 방어 부대를 후퇴시키면 그 헥스로 상륙 전진, 못 하면 모든 유닛이 버그아웃 손실을 입고 일본으로 철수해요. 명령은 취소할 수 없어요.',
  seaAssaultLast: '이번 턴 상륙 공격 명령을 다 썼어요. 돌파에 실패하면 부대가 바다에 남고 이번 턴 이동이 끝납니다.',
  seaOverrun: '돌파 가능: 50% 확률로 방어 부대를 즉시 격멸하고 상륙, 실패하면 상륙 공격 명령',
  seaPlotted: '상륙 공격 명령을 내렸습니다. 부대는 바다에서 전투 단계를 기다립니다',
  seaOverran: '돌파 상륙 성공! 방어 부대를 격멸하고 해안을 점령했습니다',
  seaStranded: '돌파에 실패했고 상륙 공격 명령도 남지 않아 부대가 바다에 머뭅니다',
  seaPlot: '상륙 공격 명령',
  seaTry: '돌파 상륙 시도',
  atSea: '바다 위 (해상 수송 중)',
  noCancelAtSea: '바다에서 내린 상륙 공격 명령은 취소할 수 없어요',
} as const;

// ---------- ground combat (docs/rules/combat.md) ----------

export const COMBAT_UI_KO = {
  assault: '공격',
  assaultPreview: '공격 미리보기',
  plot: '공격 명령',
  tryOverrun: '돌파 시도',
  overrunChance: '돌파 가능: 50% 확률로 방어 부대를 즉시 격멸하고 진입, 실패하면 공격 명령',
  overrunNo: '돌파 불가 (전력 차이가 부족)',
  plotNote: '전투 단계에서 실행됩니다. 명령에 6점(예약 5 + 공격 1)이 들고, 취소하면 5점이 돌아옵니다.',
  needSix: '부대의 모든 유닛에 이동력이 6점 이상 남아 있어야 공격 명령을 내릴 수 있어요.',
  stopped: '2차 명령 단계에서는 공격 명령을 낼 수 없어 이동이 끝났습니다.',
  attackerSide: '공격',
  defenderSide: '방어',
  lethality: '살상력',
  survivability: '생존력',
  lossRatio: '예상 손실률',
  retreatChance: '방어 부대 후퇴 확률',
  artillery: '중포병 지원',
  naval: '함포 지원',
  joined: '같은 군의 다른 부대가 이미 같은 헥스를 공격 예정',
  plotted: '공격 명령',
  cancelPlot: '공격 취소 (1점은 소모됨)',
  cancelled: '공격 명령을 취소했습니다',
  overran: '돌파 성공! 방어 부대를 격멸하고 헥스를 점령했습니다',
  plottedDone: '공격 명령을 내렸습니다. 1차 명령 단계가 끝나면 전투 단계에서 실행됩니다',
  noAssaults: '실행할 공격 명령이 없습니다',
  results: '전투 결과',
  attacks: '공격',
  retreated: '방어 부대 후퇴',
  held: '방어 부대 고수',
  moveIn: '적 없음: 그대로 진입',
  hint: '인접한 적 부대 헥스를 클릭하면 공격 미리보기, 한 번 더 클릭하면 공격 명령(돌파 가능하면 돌파 시도)입니다.',
} as const;

export const ARMY_NAME_KO = ['북한군', '중공군', '국군', '유엔군'];

/** Step-by-step ground combat replay (ui/combatReplay.ts, docs/rules/combat.md 6). */
export const REPLAY_KO = {
  title: '지상전',
  battleOf: (i: number, n: number) => `전투 ${i} / ${n}`,
  oneBattle: (i: number) => `전투 ${i} 다시 보기`,
  close: '닫기',
  fighting: '전투 중',
  inProgress: (done: number, n: number) => `${done} / ${n}건 (재생 중)`,
  pending: (k: number) => `남은 전투 ${k}건은 재생이 끝나면 나옵니다.`,
  attacks: (army: string, place: string) => `${army}, ${place} 공격`,
  moveIn: (army: string, place: string) => `${army}, 비어 있는 ${place}로 진입`,
  attackers: '공격 부대',
  defenders: '방어 부대',
  fromDir: (d: string) => `${d}에서`,
  dirs: ['북쪽', '북동쪽', '남동쪽', '남쪽', '남서쪽', '북서쪽'],
  results: '전투 결과',
  attackerLoss: '공격 측 손실률',
  defenderLoss: '방어 측 손실률',
  retreatChance: (p: number) => `후퇴 확률 ${p}%`,
  retreated: '방어 부대 후퇴',
  held: '방어 부대 버틴',
  wipedOut: '방어 부대 괴멸',
  equipLost: (a: number, d: number) => `잃은 장비: 공격 측 ${a} · 방어 측 ${d}`,
  destroyed: '괴멸',
  none: '-',
  hidden: '?',
  forceEliminated: (name: string) => `${name} 괴멸: 부대가 소멸됐습니다`,
  unitEliminated: (name: string, force: string) => `${name} 제거됨${force && force !== name ? ` (${force})` : ''}`,
  retreat: (name: string, place: string) => `${name} 후퇴 → ${place}`,
  blocked: (name: string) => `${name}: 후퇴로가 막혀 추가 손실`,
  bugout: (name: string) => `${name} 버그아웃: 장비를 버리고 흩어짐`,
  advance: (name: string, place: string) => `${name} 전진 → ${place}`,
  moveInLine: (name: string, place: string) => `${name} 진입 → ${place}`,
  evacuated: (name: string) => `${name}: 상륙 실패, 장비를 잃고 일본으로 철수`,
  lostAtSea: (name: string) => `${name}: 상륙 실패, 일본에 자리가 없어 괴멸`,
  noChange: '양쪽 모두 제자리 (제거·후퇴 없음)',
  pause: '⏸ 일시정지',
  resume: '▶ 계속',
  next: '다음 ›',
  nextBattle: '다음 전투 ⏭',
  skip: '건너뛰기',
  keys: 'Enter·→ 다음 · Space 일시정지 · Esc 모두 건너뛰기. 속도는 ♪ 설정의 진행 속도',
  replayAll: '▶ 전투 다시 보기',
  replayOne: '다시 보기',
  mapEliminated: '괴멸',
  mapBlocked: '후퇴 불가',
  mapBugout: '버그아웃',
  mapRetreat: '후퇴',
};

// ---------- new game options (docs/rules/options.md) ----------

/** The four scenarios of the start menu (manual 2.111). */
export const SCENARIO_INFO_KO: { no: 1 | 2 | 3 | 4; title: string; en: string; date: string; desc: string }[] = [
  { no: 1, title: '용이 깨어나다', en: 'The Dragon Wakes', date: '1950년 6월 25일', desc: '북한군의 남침으로 시작합니다.' },
  { no: 2, title: '크로마이트 작전', en: 'Operation Chromite', date: '1950년 9월 15일', desc: '유엔군이 인천 상륙을 준비하는 시점입니다.' },
  { no: 3, title: '차가운 강철', en: 'Cold Steel', date: '1950년 11월 22일', desc: '중공군이 기습 반격에 나서는 시점입니다.' },
  // the original's "Tomorrow's War", renamed by the user (2026-10-17); `en` keeps the original title
  { no: 4, title: '영변 핵위기', en: "Tomorrow's War", date: '1995년 6월 25일', desc: '영변 핵위기로 인한 미군 공습 이후 시작된 제2차 한국전쟁입니다.' },
];

export const OPTIONS_UI_KO = {
  title: '새 게임',
  eyebrow: '시나리오와 게임 설정',
  button: '새 게임',
  buttonTitle: '시나리오와 게임 설정을 골라 새로 시작',
  scenario: '시나리오',
  ccf: '중공군 개입',
  ccfValues: ['역사적', '고정'],
  ccfHint: ['역사적: 유엔군이 북진해도 중국이 개입하지 않을 수 있어요(허세).', '고정: 국군이 아닌 유엔 부대가 38선을 넘으면 반드시 개입해요.'],
  ccfInProgress: '이미 개입함',
  ccfNotAllowed: '해당 없음',
  competence: '공산군 역량',
  competenceValues: ['허약', '보통', '역사적', '강함', '최강', '무작위'],
  competenceEn: ['Pushover', 'Moderate', 'Challenging', 'Hairy', 'Hideous!', 'Random'],
  competenceHint: '공산군 전투력·재보급·보급 비축에 영향을 줍니다. 역사적 수준은 "역사적"(Challenging).',
  playMode: '플레이 방식',
  playModeValues: ['두 사람', '유엔군으로', '공산군으로'],
  playModeEn: ['Two player', 'UN Solitaire', 'Red Solitaire'],
  playModeHint: ['두 사람이 한 화면에서 번갈아 합니다.', '컴퓨터가 공산군을 맡습니다.', '컴퓨터가 유엔군을 맡습니다.'],
  noAi: '이 진영을 맡을 컴퓨터 AI가 없어서 컴퓨터 쪽 지상군은 움직이지 않아요. 미리 정해진 공격 명령과 항공 자동 임무만 실행됩니다.',
  ai: '컴퓨터 AI',
  aiValues: ['원작', '개선판'],
  aiTitles: ['원작 프로그램(1992, Norm Koger)의 판단을 그대로 옮긴 것', '리메이크에서 새로 만들 AI (준비 중)'],
  aiHint: (player: number) => player === 2
    ? '원작: 1992년 원작의 유엔군 AI(WALTON)를 코드 그대로 옮겼어요. 부산 교두보 방어, 인천·군산 상륙, 일본에서 오는 증원 수송까지 합니다. 개선판은 준비 중입니다.'
    : '원작: 1992년 원작의 공산군 AI(KIM)를 코드 그대로 옮겼어요. 개선판은 준비 중입니다.',
  aiSoon: '준비 중',
  air: '항공 작전',
  airValues: ['직접 지휘', '프로그램에 맡김'],
  airHint: ['항공대 임무와 공습 목표를 직접 정합니다.', '프로그램이 양쪽 항공대의 임무와 목표를 정합니다(다소 역사적이고 조심스럽게).'],
  airShownProgram: '1950년대에 공산군은 항공대가 없고 유엔 항공대는 컴퓨터 몫이라, 원작도 이 조합은 "프로그램"으로 표시해요.',
  intel: '정보',
  intelValues: ['제한', '완전'],
  intelHint: ['정찰된 적 부대만 보입니다(역사적 설정).', '모든 적 부대와 전력이 보입니다. 컴퓨터 상대로는 크게 유리해요.'],
  advanced: '고급: 시나리오 데이터',
  variantLabel: '데이터',
  variantValues: ['자동', '기본판', '편성 배치판'],
  variantHint: '자동은 원작 규칙대로, "유엔군으로"면 공산군의 시작 이동·공격 명령이 들어 있는 편성 배치판(koreaNs.dat)을, 그 밖에는 기본판을 씁니다.',
  file: (id: string) => `읽을 파일: ${id}`,
  start: '게임 시작',
  cancel: '닫기',
  settings: '설정',
  randomRolled: (label: string) => `무작위 → ${label}`,
  deployment: '편성 배치판',
} as const;

// ---------- intelligence / fog of war (docs/rules/intel.md) ----------

export const INTEL_UI_KO = {
  level: (n: number) => `정찰 ${n}단계`,
  levelNote: ['적 부대가 있어도 알 수 없음', '부대 종류만 앎', '부대 이름과 완편 여부까지 앎'],
  scouting: '정찰',
  enemyType: (kind: string) => `적 ${kind}`,
  full: '완편',
  under: '정원 미달',
  fullShort: '완편',
  underShort: '약화',
  reportHint: '정원의 절반 미만이면 정원 미달. 정찰 보고는 3번에 1번꼴로 미달 부대를 완편으로 잘못 알려요 (전투를 치른 부대는 정확).',
  unitsUnknown: '유닛 구성 모름',
  stoppedRevealed: '이동 중 적 부대를 발견해 그 자리에서 멈췄습니다 (정찰 1단계)',
  stoppedBumped: '앞 헥스에 숨어 있던 적 부대와 마주쳐 멈췄습니다',
  spotted: (n: number) => `적 부대 ${n}곳 발견`,
  hiddenEstimate: '정보 제한: 적 전력을 몰라 예상 손실률과 후퇴 확률을 알 수 없어요.',
  overrunUnknown: '돌파 여부는 실제 전력으로 판정합니다 (가능하면 돌파를 먼저 시도).',
  plotOrTry: '공격 명령 (돌파 가능하면 돌파)',
  seaPlotOrTry: '상륙 공격 (돌파 가능하면 돌파 상륙)',
  dropUnknown: '정찰되지 않은 적 점령지: 적 부대가 숨어 있으면 낙하한 공수 부대가 전멸합니다.',
  enemyUnits: '?',
  summaryNote: '정보 제한: 정찰된 적 부대만 보입니다. 정찰 0단계는 숨김, 1단계는 부대 종류, 2단계는 이름과 완편 여부.',
  completeNote: '완전 정보: 모든 적 부대와 전력이 보입니다.',
  handoverHidden: '정보 제한: 교대 화면에서는 지도에 부대를 표시하지 않습니다.',
} as const;

export function combatEventKo(e: { kind: string; name?: string; to?: [number, number] }, forceName: (id: number) => string, leader?: number): string {
  switch (e.kind) {
    case 'eliminated': return `${unitNameKo(e.name ?? '')} 괴멸`;
    case 'retreat': return `${forceName(leader ?? 0)} 후퇴 → (${e.to?.[0]}, ${e.to?.[1]})`;
    case 'blocked': return `${forceName(leader ?? 0)} 후퇴로 막힘: 추가 손실`;
    case 'bugout': return `${unitNameKo(e.name ?? '')} 버그아웃 (장비 버리고 도주)`;
    case 'moveIn': return `${forceName(leader ?? 0)} 진입 → (${e.to?.[0]}, ${e.to?.[1]})`;
    case 'advance': return `${forceName(leader ?? 0)} 전진 → (${e.to?.[0]}, ${e.to?.[1]})`;
    case 'evacuated': return `${forceName(leader ?? 0)} 상륙 실패: 버그아웃 손실 후 일본으로 철수 (${e.to?.[0]}, ${e.to?.[1]})`;
    case 'lostAtSea': return `${forceName(leader ?? 0)} 상륙 실패: 일본에 자리가 없어 괴멸`;
    default: return '';
  }
}

/** Bubble over the destination of a previewed path. */
export function pathLabelKo(spent: number, remaining: number): string {
  return `−${spent}점 · 남음 ${remaining}`;
}

export function costItemKo(item: { kind: string; points: number; terrain?: string; road?: boolean; river?: boolean }): string {
  switch (item.kind) {
    case 'terrain': {
      const t = TERRAIN_KO[item.terrain as TerrainKind] ?? item.terrain ?? '';
      if (item.road && item.river) return `${t} · 다리(도로)`;
      if (item.road) return `${t} · 도로`;
      if (item.river) return `${t} · 강 (도로 밖)`;
      return t;
    }
    case 'river': return item.points === 0 ? '강 (결빙)' : item.points === 6 ? '강 도하 (폭풍)' : '강 도하';
    case 'cpla': return '중공군 험지 감면';
    case 'congestion': return '혼잡 (아군 부대)';
    case 'enemyTerritory': return '적 점령지 진입';
    case 'disengage': return '적 인접 이탈';
    case 'rail': return '철도';
    case 'amphibious': return '해병 상륙 (하구·저수지)';
    case 'sea': return '해상 (거리 무관)';
    case 'landing': return '상륙 (이동 종료)';
    case 'air': return '공수 (거리 무관)';
    default: return item.kind;
  }
}

// ---------- air operations (docs/rules/air.md) ----------

export const MISSION_KO = ['제공권', '지상 공격', '차단'];
export const MISSION_HINT_KO = [
  '적 공군과 싸움 (1950년대: 공산 요격 수준을 낮춤)',
  '전투 단계에서 지도의 적 헥스 하나를 공습',
  '적 보급선 공격: 적 비축 감소, 적 철도 이동·재보급 방해',
];
export const BASE_KO: Record<number, string> = { 0: '일본', 1: '한국', 2: '항공모함' };
/** EFFECTIVE_STRENGTH sky code as the Air Operations title ('good / poor / lousy weather'). */
export const AIR_WEATHER_KO: Record<number, string> = { 1: '좋은 날씨', 2: '나쁜 날씨', 3: '최악의 날씨' };
export const STRIKE_SEVERITY_KO = ['', '가벼운 피해', '중간 피해', '큰 피해'];

const ORD = '(?:st|nd|rd|th)';
const SHIP_KO: Record<string, string> = { Triumph: '트라이엄프', Theseus: '테세우스', Glory: '글로리', Nimitz: '니미츠', Vinson: '칼빈슨' };
const AIR_UNIT_RULES: Rule[] = [
  [new RegExp(`^(\\d+)${ORD} Ftr Bmbr Group$`), (m) => `제${m[1]}전투폭격비행전대`],
  [new RegExp(`^(\\d+)${ORD} Ftr Intrcptr Group$`), (m) => `제${m[1]}전투요격비행전대`],
  [new RegExp(`^(\\d+)${ORD} Ftr Escort Group$`), (m) => `제${m[1]}전투호위비행전대`],
  [new RegExp(`^(\\d+)${ORD} Bomb Group$`), (m) => `제${m[1]}폭격비행전대`],
  [new RegExp(`^(\\d+)${ORD} Bomb Wing \\(Light\\)$`), (m) => `제${m[1]}경폭격비행단`],
  [/^Carrier Air Group (\d+)$/, (m) => `미 해군 제${m[1]}항모비행전대`],
  [/^Carrier Air Grp (\w+)$/, (m) => `영국 해군 ${SHIP_KO[m[1]] ?? m[1]} 항모비행전대`],
  [/^Marine Air Group (\d+)$/, (m) => `미 해병 제${m[1]}비행전대`],
  [new RegExp(`^(\\d+)${ORD} Bomber Division$`), (m) => `북한 공군 제${m[1]}폭격비행사단`],
  [new RegExp(`^(\\d+)${ORD} Fighter Division$`), (m) => `북한 공군 제${m[1]}전투비행사단`],
  [new RegExp(`^(\\d+)${ORD} Fighter Regiment$`), (m) => `북한 공군 제${m[1]}전투비행연대`],
  [new RegExp(`^ROK (\\d+)${ORD} TFW$`), (m) => `한국 공군 제${m[1]}전투비행단`],
  [new RegExp(`^USAF (\\d+)${ORD} Air Division$`), (m) => `미 공군 제${m[1]}항공사단`],
  [new RegExp(`^USAF (\\d+)${ORD} TFW$`), (m) => `미 공군 제${m[1]}전술전투비행단`],
  [/^USAF (\d+) Prov Bomb Wing$/, (m) => `미 공군 제${m[1]}임시폭격비행단`],
  [new RegExp(`^US (\\d+)${ORD} Marine Air Wing$`), (m) => `미 해병 제${m[1]}항공단`],
  [/^USN CAW (\w+)$/, (m) => `미 해군 ${SHIP_KO[m[1]] ?? m[1]} 항모비행단`],
];

export function airUnitNameKo(name: string): string {
  const s = name.trim();
  return applyRules(AIR_UNIT_RULES, s) ?? s;
}

export const AIR_UI_KO = {
  button: '✈ 항공',
  buttonTitle: '항공대 임무 정하기 (1차 명령 단계)',
  title: '항공 작전',
  close: '닫기',
  hint: '항공대마다 임무 버튼을 누르세요. 바꾸면 아래 예상치가 바로 다시 계산됩니다. 기지는 비행장 상태에 따라 자동으로 배치됩니다.',
  a2a: '공대공',
  a2g: '공대지',
  longRange: '장거리',
  allWeather: '전천후',
  runwayAny: '활주로 무관',
  runwayImproved: '개량 활주로 필요',
  zero: '약화로 0',
  projections: '임무 효과 예상',
  strikesAvailable: '공습 가능',
  interdictionLevel: '차단 수준',
  cilNow: '이번 턴 공습 때 공산 요격 수준',
  cilNext: '다음 턴 시작 공산 요격 수준',
  superiority: '아군 제공 전력',
  withdrawals: '철수 예정',
  reinforcements: '증원 예정',
  noChanges: '증원이나 철수 예정인 항공대가 없습니다.',
  migAlley: '미그 앨리',
  migAlleyNote: '미그 앨리(14열·26행 이하, 지도 보라색 점선) 안의 공습과 모든 차단 임무는 공산 요격 수준에서 항공대 공대공을 뺀 만큼 공대지가 줄어듭니다.',
  migAlley1995: '1995년: 양쪽 제공권 전력을 비교해 전투 단계에서 손실률이 정해집니다 (적/아군 × 10%, 최대 90%, 손실은 영구).',
  communist1950s: '1950년대 공산군 항공력은 공산 요격 수준 하나로 나타냅니다. 공산 플레이어가 정할 항공 임무는 없습니다.',
  onlyFirstPhase: '임무는 1차 명령 단계에서만 바꿀 수 있습니다.',
  programControl: '항공 작전이 프로그램 제어로 설정되어 있습니다.',
  neutralized: '이 진영의 공군은 무력화되었습니다.',
  aircraft: '기종',
  // combat phase: airstrikes (manual 4.13)
  strikeTitle: (side: string) => `${side} 공습`,
  strikeLines: (n: number) => `공습 ${n}회. 지도에서 적 점령 헥스를 클릭해 항공대마다 목표를 고르세요.`,
  strikeN: (k: number, n: number) => `공습 ${k} / ${n}`,
  strikeHint: '적 점령 헥스를 클릭하면 이 항공대가 공습합니다. 빈 것처럼 보이는 헥스도 고를 수 있고, 적이 있으면 발견해 공격합니다.',
  strikeLethality: '공습 살상률',
  strikeLethalityNote: '험지·산악·도시 ×0.75, 진지(준비도 75+ 미이동) ×0.75. 장비마다 살상률 × (15 − 생존력)/15 확률로 파괴, 준비도는 살상률의 절반만큼 떨어집니다(최소 50).',
  aimAt: (pct: number) => `공습 목표 · 살상률 ${pct}%`,
  auto: '컴퓨터가 목표 선택',
  autoAll: '남은 공습 모두 맡기기',
  continue: '지상전으로 ▶',
  allFlown: '이 진영의 공습을 모두 마쳤습니다.',
  friendly: '아군 헥스입니다! 적 점령 헥스를 고르세요.',
  manchuria: '제3차 세계대전을 시작할 권한이 없습니다! (만주)',
  noTarget: '목표를 찾지 못함',
  enemyUnit: '적 부대',
  aaHit: '대공 사격에 맞음 (공대공·공대지 −1)',
  aaDestroyed: '항공대 소멸',
  equipmentLost: (n: number) => `장비 ${n}개 파괴`,
  readinessLost: (n: number) => `준비도 합계 −${n}`,
  autoTag: '자동',
  strikesSoFar: '이번 공습 결과',
  strikeDone: (place: string, result: string) => `${place}: ${result}`,
  endPhaseStrikes: (n: number) => `남은 공습 ${n}회는 컴퓨터가 목표를 고릅니다. 지상전으로 넘어갈까요?`,
  // results
  results: '항공 작전 결과',
  cil: (a: number, b: number) => `공산 요격 수준 ${a} → ${b} (유엔 제공권 임무)`,
  superiorityLoss: (side: string, loss: number, own: number, enemy: number) => `${side} 항공대 손실 ${loss}% (제공 전력 ${own} vs ${enemy})`,
  interdictionResult: (il: number, hit: number, enemy: string) => `차단 수준 ${il}${hit ? ` · ${enemy} 비축 −${hit}` : ''}`,
  noTargets: '공습 취소: 목표 없음',
  programMissions: '프로그램이 임무를 정함',
  missionsLine: (m: [number, number, number]) => `제공권 ${m[0]} · 지상 공격 ${m[1]} · 차단 ${m[2]}`,
  noStrikes: '공습 없음',
  // summary
  unil: '유엔 차단 수준',
  cilShort: '공산 요격 수준',
  communistIl: '공산 차단 수준',
  airLine: '항공',
} as const;

/** NATO-style echelon marker from a unit or force name. */
export function echelonOf(name: string): string {
  if (/\bArmy\b|\bCorps\b|Mnvr Grp/.test(name)) return 'XXX';
  if (/\bDiv\b|Div-|\b\d+(st|nd|rd|th) Div/.test(name)) return 'XX';
  if (/\bBde\b/.test(name)) return 'X';
  if (/\bRgt\b|\bRCT\b|Army Arty|Div Arty|Cav Arty/.test(name)) return 'III';
  if (/\bBn\b|\bBCT\b|\bFAB\b|FAB\(H\)|\bCMB\b|TF /.test(name)) return 'II';
  return '';
}

// ---------- save / load (docs/rules/save.md) ----------

export const SAVE_UI_KO = {
  button: '저장',
  buttonTitle: '게임 저장·불러오기',
  eyebrow: '저장한 게임',
  title: '저장 · 불러오기',
  slot: (k: string) => `슬롯 ${k}`,
  autoSlot: '자동 저장',
  empty: '비어 있음',
  autoEmpty: '아직 없음 (내 명령 단계가 시작될 때마다 저장)',
  broken: '읽을 수 없는 데이터',
  save: '저장',
  load: '불러오기',
  delete: '이 슬롯 지우기',
  deleteShort: '지우기',
  download: '파일로 내려받기',
  upload: '파일 불러오기…',
  fileHint: '.json 파일로 다른 브라우저나 PC에 옮길 수 있어요. 원작 .SAV는 node tools/extract/sav2json.ts로 바꾼 뒤 올리세요.',
  close: '닫기',
  vsComputer: (side: string) => `컴퓨터: ${side}`,
  blockedPhase: '저장은 명령 단계에서만 할 수 있어요 (원작과 같음).',
  blockedGameOver: '게임 종료 질문에 답한 뒤에 저장할 수 있어요.',
  noStorage: '이 환경에서는 브라우저 저장소를 쓸 수 없어요. 파일로 내려받아 저장하세요.',
  saved: (k: string) => `슬롯 ${k}에 저장했습니다.`,
  overwrite: (k: string) => `슬롯 ${k}의 저장을 덮어쓸까요?`,
  deleteConfirm: (k: string) => `슬롯 ${k}을(를) 지울까요?`,
  deleted: (k: string) => `슬롯 ${k}을(를) 지웠습니다.`,
  downloaded: '저장 파일을 내려받았습니다.',
  loadConfirm: '지금 게임을 버리고 저장한 게임을 불러올까요?',
  loaded: '저장한 게임을 불러왔습니다.',
  storageFull: '브라우저 저장소가 가득 찼어요. 다른 슬롯을 지우거나 파일로 내려받으세요.',
  errors: {
    notSave: '이 리메이크의 저장 파일이 아니에요.',
    newerVersion: '더 새 버전의 리메이크에서 만든 저장 파일이에요.',
    scenarioMismatch: '시나리오 데이터가 저장 파일과 맞지 않아요.',
    noScenario: '저장 파일의 시나리오 데이터를 찾을 수 없어요.',
    originalSav: '원작 저장 파일(.SAV)은 바로 올릴 수 없어요. remake 폴더에서 node tools/extract/sav2json.ts <파일.SAV>로 .json을 만든 뒤 그 파일을 올리세요.',
  } as Record<string, string>,
  fromNewGame: '저장한 게임 불러오기',
} as const;

// ---------- sound (docs/audio.md) ----------

/** Chart cards of the summary panel (ui/charts.ts). */
export const CHART_KO = {
  forces: '세력 현황',
  front: '전선 추이',
  un: '유엔군',
  communist: '공산군',
  waiting: '증원 대기',
  unHeld: '유엔 점령지',
  redHeld: '공산 점령지',
  frontHint: '턴마다 양쪽이 쥐고 있는 헥스 수 (도시 포함)',
};

/** The "조작" card of the summary panel. */
export const HELP_KO = {
  title: '조작',
  lines: (newGame: string, air: string, endPhase: string) => [
    `상단 ${newGame}: 시나리오와 게임 설정(개입·역량·플레이 방식·항공·정보)을 골라 새로 시작`,
    '자기 진영 부대가 있는 헥스 클릭: 부대 선택, 갈 수 있는 범위 표시',
    '범위 안 헥스에 마우스: 경로·비용 미리보기',
    '목적지 클릭: 경로 고정 → 한 번 더 클릭: 이동',
    '같은 헥스 다시 클릭: 겹친 다른 부대 선택 (겹친 부대는 말 오른쪽 위로 테두리가 보임)',
    '옆의 적 부대 클릭: 공격 미리보기 → 한 번 더: 공격 명령(또는 돌파)',
    '헥스 패널의 편성: 같은 헥스 두 부대 사이에서 유닛 옮기기·이름 바꾸기',
    `상단 ${air}: 항공대 임무(1차 명령 단계) → 전투 단계에서 지도의 적 헥스를 클릭해 공습`,
    `상단 ▶ ${endPhase}: 다음 진영·단계로 (1차 명령 → 전투 → 2차 명령 → 정리)`,
    '오른쪽 클릭 또는 Esc: 취소 · Ctrl+Z: 되돌리기 · C: 선택한 부대로 지도 이동',
    '드래그 또는 방향키: 지도 이동 (Shift+방향키: 빠르게) · 휠: 확대·축소',
    '상단 저장: 슬롯·자동 저장·파일 · 보고서: 전략 보고·항구와 비행장·날씨·전략 개관 · ♪ 설정: 음악·효과음·진행 속도·이동 따라가기',
  ],
  computer: (side: string, ai: string) => `컴퓨터가 ${side}을 맡습니다 (원작 AI ${ai}).`,
  twoPlayer: '두 사람이 번갈아 하는 방식입니다.',
  codeRow: '원본 코드',
};

export const SOUND_UI_KO = {
  button: '소리',
  buttonTitle: '배경 음악·효과음·진행 속도·이동 따라가기',
  title: '소리',
  musicOn: '음악 켜짐',
  musicOff: '음악 꺼짐',
  sfxOn: '효과음 켜짐',
  sfxOff: '효과음 꺼짐',
  musicVolume: '음악 음량',
  sfxVolume: '효과음 음량',
  nowPlaying: '재생 중',
  silent: '조용함',
  clickToStart: '화면을 한 번 누르면 음악이 시작됩니다',
  next: '다음 곡',
  medley: '메들리 (전체 연속)',
  medleyHint: '모든 곡을 차례로',
  bySide: '진영별',
  bySideHint: '공산군 단계는 인터내셔널가, 유엔군 단계는 유엔 쪽 곡',
  playTitle: '진행',
  speed: '진행 속도',
  speedValues: { 1: '빠름', 2: '보통', 3: '느림' } as Record<number, string>,
  followOn: '이동 따라가기 켜짐',
  followOff: '이동 따라가기 꺼짐',
  replayOn: '전투 재생 켜짐',
  replayOff: '전투 재생 꺼짐',
  playNote: '부대가 움직이는 속도입니다(원작 Speed). 따라가기를 켜면 지도가 움직이는 부대를 계속 가운데에 둡니다(원작 Mvmnt Centering). 꺼 두면 부대가 화면 밖으로 나갈 때만 옮깁니다. C 키: 선택한 부대로 지도 이동.',
  note: '1990년대 초 FM 사운드카드 느낌으로 직접 편곡한 연주곡(가사 없음)입니다. 저작권이 끝난 곡만 저장소에 들어 있고, 6.25의 노래는 개인 데이터(data/private)에 있을 때만 나옵니다.',
} as const;

// ---------- report screens (docs/rules/reports.md) ----------

export const REPORT_UI_KO = {
  button: '보고서',
  buttonTitle: '전략 보고·항구와 비행장·날씨·시나리오 정보·전략 개관',
  eyebrow: '보고서',
  close: '닫기',
  tabs: { strategic: '전략 보고', facilities: '항구·비행장', weather: '날씨', scenario: '시나리오 정보', overview: '전략 개관' } as Record<string, string>,
  general: '일반 정보',
  urban: '도시 헥스',
  other: '기타 헥스',
  stockpile: '보급 비축',
  unInterdiction: '유엔 차단 수준',
  redInterception: '공산 요격 수준',
  redInterdiction: '공산 차단 수준',
  points: '점령 점수',
  victory: '승리 수준',
  remakeAdded: '리메이크 추가',
  pool: (side: string) => `아군 보충 풀 (${side})`,
  poolHint: '보충을 기다리는 장비 수입니다. 적 진영의 보충 풀은 볼 수 없어요.',
  notAvailable: '이 시나리오에는 없음',
  ccf: '중공군 개입 상태',
  ccfValues: { undecided: '미정', willNotIntervene: '개입하지 않음', intervening: '개입' } as Record<string, string>,
  news: '최근 소식',
  gameTurn: (n: number) => `${n}번째 턴`,
  airfields: '비행장',
  ports: '항구',
  hex: '헥스',
  occupier: '점령',
  current: '현재 등급',
  best: '최고 등급',
  status: '상태',
  mined: '기뢰',
  clear: '안전',
  levelHint: '비행장 등급 0~3: 0은 쓸 수 없음, 3은 모든 항공기 운용. 유엔 점령 비행장은 턴마다 복구될 수 있어요.',
  forecastTitle: '예보',
  forecastRows: ['현재 날씨', '1주 뒤', '2주 뒤', '3주 뒤'],
  effects: '날씨 효과',
  readiness: '부대 준비도',
  readinessStd: '보통',
  readinessLoss: (n: number) => `전투마다 추가 ${n}`,
  movement: '부대 이동',
  movementStd: '보통',
  movementStorm: '도로·험지 헥스 +1',
  airOps: '항공 작전',
  airValues: ['', '정상 전력', '약화', '크게 약화'],
  freeze: '결빙선',
  freezeRow: (n: number) => `${n}행`,
  thawed: '해빙',
  forecastHint: '현재 날씨는 실제 날씨, 예보는 진영마다 다르고 틀릴 수 있어요(1주 85%, 2주 70%, 3주 55%).',
  scenarioTitle: '현재 게임 설정',
  mode: { terrain: '지형·부대', supply: '보급망' } as Record<string, string>,
  overviewHint: '지도의 헥스를 누르면 그곳으로 이동합니다. 적 부대는 정찰된 것만 보여요.',
  supplyHint: '진한 색은 보급망 안, 점만 있으면 보급망 밖(보급 두절)입니다. 파랑 유엔군, 빨강 공산군.',
  parallel: '38선',
} as const;

// ---------- force organisation (docs/rules/forces.md) ----------

export const FORCES_UI_KO = {
  button: '편성',
  buttonTitle: '이 헥스의 두 부대 사이에서 유닛을 옮기거나 부대 이름을 바꿉니다',
  eyebrow: '부대 편성',
  close: '닫기',
  prevHex: '◀ 이전 헥스',
  nextHex: '다음 헥스 ▶',
  hexNavTitle: '아군이 점령한 부대 헥스를 차례로(원작 +Hex / −Hex)',
  terrain: '지형 보정',
  lethality: '공격 살상',
  lethalityNote: '강 헥스에서 하는 공격(포병 제외, 결빙이면 없음)',
  hardSurvival: '방어 생존(장비)',
  softSurvival: '방어 생존(보병 소대)',
  force: (n: number) => `부대 ${n}`,
  newForce: '새 부대',
  newForceHint: '다른 부대의 유닛을 옮기면 이 헥스에 새 부대가 생깁니다.',
  units: (n: number) => `유닛 ${n}개`,
  strength: '살상-생존',
  readiness: '평균 준비도',
  movement: '남은 이동력',
  assault: '공격 계획',
  rename: '이름 바꾸기',
  renameOk: '확인',
  renameCancel: '취소',
  renameHint: '최대 20자. 비우면 선두 유닛 이름으로 보입니다.',
  renameLone: '유닛이 둘 이상인 부대만 이름을 붙일 수 있어요(혼자인 유닛은 자기 이름).',
  renamed: (name: string) => `부대 이름을 바꿨어요: ${name}`,
  moveTo: (n: number) => `부대 ${n}로`,
  splitTo: '새 부대로',
  leader: '선두',
  blocked: {
    atSea: '바다 위에서는 편성을 바꿀 수 없어요.',
    nationality: '국적이 맞지 않아요. 미군·미 해병·영연방·기타 유엔군끼리, 국군·북한군·중공군은 같은 군끼리만 합칠 수 있어요.',
    full: '받는 부대가 이미 유닛 6개로 꽉 찼어요.',
    infantry: '받는 부대에 보병이 이미 4개 있어요(보병이 아닌 유닛은 옮길 수 있음).',
    assaultMove: '공격 계획이 있는 부대에 들어가려면 이 유닛의 남은 이동력이 6 이상이어야 해요.',
    smithForce: '스미스 특수임무부대에는 다른 유닛을 붙일 수 없어요.',
    alone: '이 헥스의 유일한 부대에 혼자 있는 유닛이에요.',
    notHere: '이 헥스에 없는 유닛이에요.',
  } as Record<string, string>,
  blockedShort: {
    atSea: '바다 위', nationality: '국적이 달라 합칠 수 없음', full: '받는 부대 6개 꽉 참', infantry: '받는 부대 보병 4개 꽉 참',
    assaultMove: '공격 계획 부대: 이동력 6 필요', smithForce: '스미스 부대는 받을 수 없음', alone: '혼자인 부대', notHere: '',
  } as Record<string, string>,
  cost: (n: number) => `받는 부대 전체 이동력 −${n}`,
  joinsAssault: '공격 계획에 합류',
  dropsAssault: '이 유닛의 공격 계획은 취소(1점 소모)',
  merge: (name: string) => `${name}에 흡수(소총·화기 소대가 그 유닛으로)`,
  done: (unitName: string, slot: number) => `${unitName} → 부대 ${slot}로 옮겼어요.`,
  doneCost: (n: number) => `받는 부대가 함께 움직이도록 이동력 ${n}점을 맞췄어요.`,
  merged: (name: string) => `스미스 특수임무부대가 ${name}에 흡수됐어요.`,
  failed: '옮길 수 없어요',
  rules: '한 부대는 유닛 6개(보병은 4개)까지. 미군·미 해병·영연방·기타 유엔군은 함께, 국군·북한군·중공군은 같은 군끼리. 공격 계획이 있는 부대에 들어가려면 이동력 6이 필요하고, 들어간 유닛이 이동력을 더 썼으면 부대 전체가 그만큼 씁니다. 옮긴 뒤에는 이동을 되돌릴 수 없어요.',
  blockedOpen: {
    phase: '명령 단계에만 편성을 바꿀 수 있어요.',
    computer: '컴퓨터 진영의 차례예요.',
    noForces: '이 헥스에는 부대가 없어요.',
    notOwn: '아군이 점령한 헥스의 아군 부대만 편성할 수 있어요.',
  } as Record<string, string>,
} as const;
