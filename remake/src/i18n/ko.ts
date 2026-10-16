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
];

export function newsKo(line: string): { date: string; text: string } {
  const m = line.match(/^(\d+)-([A-Za-z]+)-(\d{4}):(.*)$/);
  if (!m) return { date: '', text: applyRules(NEWS_RULES, line) ?? line };
  const month = MONTH_NUM[m[2]] ?? 0;
  return { date: dateKo(Number(m[3]), month, Number(m[1])), text: applyRules(NEWS_RULES, m[4].trim()) ?? m[4].trim() };
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
