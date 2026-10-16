// Korean localization: glossary + rule based translation of the original English names.

import type { Nation, TerrainKind, UnitKind } from '../data/types.ts';

export const TERRAIN_KO: Record<TerrainKind, string> = {
  open: '개활지', rough: '험지', mountain: '산악', urban: '도시', offmap: '작전 지역 밖 (만주)',
  ocean: '바다', estuary: '하구·갯벌', reservoir: '저수지·호수', undefined: '미정의', japan: '일본 (배치 지역)',
};

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
  [/^U\.N\. aircraft lightly interdict communist supply lines\.$/, () => '유엔 공군, 공산군 보급선 일부 차단'],
  [/^United Nations units enter North Korea\.$/, () => '유엔군, 38선 넘어 북한 진입'],
  [/^China pledges to halt imperialist aggression in Korea\.$/, () => "중국, '조선에서의 제국주의 침략 저지' 천명"],
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

export function newsKo(line: string): { date: string; text: string } {
  const m = line.match(/^(\d+)-([A-Za-z]+)-(\d{4}):(.*)$/);
  if (!m) return { date: '', text: applyRules(NEWS_RULES, line) ?? line };
  const month = MONTH_NUM[m[2]] ?? 0;
  return { date: dateKo(Number(m[3]), month, Number(m[1])), text: applyRules(NEWS_RULES, m[4].trim()) ?? m[4].trim() };
}

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

export const MOVE_MODE_KO = { tactical: '일반 이동', rail: '철도 이동' } as const;

export const BLOCK_KO: Record<string, string> = {
  offMap: '지도 밖',
  notAdjacent: '인접하지 않은 헥스',
  impassable: '통행할 수 없는 지형',
  water: '바다·하구 (해상 이동 필요)',
  noRail: '연결된 아군 철도 없음',
  stackFull: '아군 부대 2개로 꽉 참',
  enemy: '적 부대 (공격은 전투 시스템에서)',
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

export function combatEventKo(e: { kind: string; name?: string; to?: [number, number] }, forceName: (id: number) => string, leader?: number): string {
  switch (e.kind) {
    case 'eliminated': return `${unitNameKo(e.name ?? '')} 괴멸`;
    case 'retreat': return `${forceName(leader ?? 0)} 후퇴 → (${e.to?.[0]}, ${e.to?.[1]})`;
    case 'blocked': return `${forceName(leader ?? 0)} 후퇴로 막힘: 추가 손실`;
    case 'bugout': return `${unitNameKo(e.name ?? '')} 버그아웃 (장비 버리고 도주)`;
    case 'moveIn': return `${forceName(leader ?? 0)} 진입 → (${e.to?.[0]}, ${e.to?.[1]})`;
    case 'advance': return `${forceName(leader ?? 0)} 전진 → (${e.to?.[0]}, ${e.to?.[1]})`;
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
    default: return item.kind;
  }
}

/** NATO-style echelon marker from a unit or force name. */
export function echelonOf(name: string): string {
  if (/\bArmy\b|\bCorps\b|Mnvr Grp/.test(name)) return 'XXX';
  if (/\bDiv\b|Div-|\b\d+(st|nd|rd|th) Div/.test(name)) return 'XX';
  if (/\bBde\b/.test(name)) return 'X';
  if (/\bRgt\b|\bRCT\b|Army Arty|Div Arty|Cav Arty/.test(name)) return 'III';
  if (/\bBn\b|\bBCT\b|\bFAB\b|FAB\(H\)|\bCMB\b|TF /.test(name)) return 'II';
  return '';
}
