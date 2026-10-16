// Place names for every map hex that carries an icon in the original game (urban, port, airfield,
// Communist supply point), matched to the present-day map. This is our own data (public geography),
// not extracted from the original files, so it is safe to publish.
//
// How the hexes were identified: docs/places.md. In short, the hex grid was fitted to real
// coordinates (affine least squares over the control points below, RMS about 9 km, one hex = 15 km)
// and every icon hex was matched to the nearest real place, checked against Korean War sources
// (K-site airfield list, Chinese crossing points over the Yalu).

export type PlaceRank = 1 | 2 | 3; // 1 major city, 2 town / port, 3 airfield / supply point

export interface PlaceName {
  x: number;
  y: number;
  /** Label on the map: present-day Korean name (historical name in parentheses if it changed). */
  label: string;
  /** Present-day name, for the panel. */
  ko: string;
  /** Former name if it changed since the war (e.g. 이리, 웅기). */
  historic?: string;
  /** Spelling used by the original game (map.json / manual), if any. */
  original?: string;
  /** One line shown in the hex panel. */
  note?: string;
  rank: PlaceRank;
  /** Only in Tomorrow's War (1995 map) / only in the 1950s scenarios. */
  only1995?: boolean;
  only1950?: boolean;
  /** Present-day coordinates (city hall or landmark). Present on the georeference control points. */
  lat?: number;
  lon?: number;
}

export const PLACE_NAMES: PlaceName[] = [
  // ---------- urban hexes ----------
  { x: 7, y: 29, label: '평양', ko: '평양', original: "P'yongYang", rank: 1, note: '공산군 보급 거점, 평양 비행장(K-23)', lat: 39.0392, lon: 125.7625 },
  { x: 14, y: 40, label: '서울', ko: '서울', original: 'Seoul', rank: 1, lat: 37.5665, lon: 126.978 },
  { x: 17, y: 51, label: '대전', ko: '대전', original: 'Taejon', rank: 1, lat: 36.3504, lon: 127.3845 },
  { x: 24, y: 54, label: '대구', ko: '대구', original: 'Taegu', rank: 1, note: '대구 비행장(K-2), 현 대구국제공항', lat: 35.8714, lon: 128.6014 },
  { x: 13, y: 59, label: '광주', ko: '광주', original: 'Kwangju', rank: 1, lat: 35.1595, lon: 126.8526 },
  { x: 26, y: 59, label: '부산', ko: '부산', original: 'Pusan', rank: 1, note: '부산항, 서부산 비행장(K-1), 현 김해국제공항', lat: 35.1796, lon: 129.0756 },
  { x: 17, y: 24, label: '함흥', ko: '함흥', original: 'Hamhung/Hungnam', rank: 1, lat: 39.9183, lon: 127.5364 },
  // 1995 map: the capital region and the south coast industrial cities
  { x: 12, y: 41, label: '인천', ko: '인천', original: "Inch'on", rank: 2, note: '인천항', lat: 37.4563, lon: 126.7052 },
  { x: 14, y: 41, label: '서울 남부', ko: '서울 강남', original: 'Seoul-South', rank: 2, only1995: true, note: '한강 이남 시가지' },
  { x: 13, y: 42, label: '부천', ko: '부천', original: "Puch'on", rank: 2, only1995: true, lat: 37.5034, lon: 126.766 },
  { x: 14, y: 42, label: '안양·수원', ko: '안양·수원', original: 'Anyang/Suwon', rank: 2, only1995: true, note: '수원 비행장(K-13)' },
  { x: 14, y: 42, label: '수원', ko: '수원', original: 'Suwon', rank: 3, only1950: true, note: '수원 비행장(K-13), 현 공군 제10전투비행단', lat: 37.2636, lon: 127.0286 },
  { x: 13, y: 53, label: '익산(이리)', ko: '익산', historic: '이리', original: 'Kunsan/Iri', rank: 2, only1995: true, note: '1995년 이리시와 익산군이 통합해 익산시', lat: 35.9483, lon: 126.9577 },
  { x: 24, y: 59, label: '창원(마산)', ko: '창원', historic: '마산·창원', original: "Masan/Ch'angwon", rank: 2, only1995: true, note: '2010년 마산·창원·진해 통합 창원시' },

  // ---------- ports ----------
  { x: 5, y: 31, label: '남포', ko: '남포', historic: '진남포', original: "Namp'o", rank: 2, note: '평양의 외항', lat: 38.7356, lon: 125.4089 },
  { x: 12, y: 52, label: '군산', ko: '군산', original: 'Kunsan', rank: 2, note: '군산항, 군산 비행장(K-8), 현 군산공항', lat: 35.9676, lon: 126.7366 },
  { x: 10, y: 61, label: '목포', ko: '목포', original: "Mokp'o", rank: 2, lat: 34.8118, lon: 126.3922 },
  { x: 18, y: 62, label: '여수', ko: '여수', original: 'Yosu', rank: 2, lat: 34.7604, lon: 127.6622 },
  { x: 28, y: 56, label: '울산', ko: '울산', original: 'Ulsan', rank: 2, lat: 35.5384, lon: 129.3114 },
  { x: 16, y: 29, label: '원산', ko: '원산', original: 'Wonsan', rank: 2, lat: 39.1528, lon: 127.4436 },
  { x: 17, y: 25, label: '흥남', ko: '흥남', original: 'Hungnam', rank: 2, note: '함흥의 외항', lat: 39.8317, lon: 127.6186 },
  { x: 20, y: 22, label: '신포', ko: '신포', original: "Sinp'o", rank: 2 },
  { x: 30, y: 9, label: '청진', ko: '청진', original: "Ch'ongjin", rank: 2, lat: 41.7956, lon: 129.7758 },
  { x: 33, y: 6, label: '선봉(웅기)', ko: '선봉 (라선시)', historic: '웅기', original: 'Unggi', rank: 2, note: '1981년 웅기군을 선봉군으로 개칭, 현 라선시 선봉구역. 공산군 보급 거점', lat: 42.3396, lon: 130.3966 },

  // ---------- airfields (K-sites) ----------
  { x: 13, y: 40, label: '김포', ko: '김포', original: 'Kimpo', rank: 3, note: '김포 비행장(K-14), 현 김포국제공항(서울 강서구)', lat: 37.5583, lon: 126.7906 },
  { x: 28, y: 52, label: '포항', ko: '포항', original: 'Pohang', rank: 2, note: '포항 비행장(K-3), 현 포항경주공항', lat: 36.019, lon: 129.3435 },
  { x: 27, y: 59, label: '해운대', ko: '부산 해운대', original: 'Pusan East', rank: 3, note: '동부산 비행장(K-9, 수영비행장), 현 센텀시티·벡스코 자리' },
  { x: 25, y: 60, label: '진해', ko: '창원 진해구', historic: '진해', original: 'Chinhae', rank: 3, note: '진해 비행장(K-10), 현 해군 진해비행장' },

  // ---------- Communist supply points: Yalu and Tumen crossings ----------
  { x: 0, y: 22, label: '신의주', ko: '신의주', rank: 2, only1950: true, note: '압록강 철교(단둥 맞은편). 공산군 보급 거점' },
  { x: 2, y: 20, label: '삭주', ko: '삭주 (청성교)', rank: 3, only1950: true, note: '창뎬허커우(长甸河口) 맞은편 청성교. 1950년 중공군 도하 지점. 공산군 보급 거점' },
  { x: 9, y: 17, label: '만포', ko: '만포', rank: 3, only1950: true, note: '지안(集安) 맞은편. 1950년 중공군 도하 지점. 공산군 보급 거점', lat: 41.157, lon: 126.29 },
  { x: 14, y: 10, label: '중강', ko: '중강 (중강진)', rank: 3, only1950: true, note: '린장(临江) 맞은편. 1950년 11월 중공군 제9병단 도하 지점. 공산군 보급 거점' },
  { x: 29, y: 5, label: '회령', ko: '회령', rank: 3, only1950: true, note: '두만강 연안 국경 도시. 공산군 보급 거점' },
];

export function placesFor(is1995: boolean): PlaceName[] {
  return PLACE_NAMES.filter((p) => (is1995 ? !p.only1950 : !p.only1995));
}

// ---------- mountains, lakes and ranges (docs/places.md "산과 호수") ----------

export type NaturalKind = 'peak' | 'lake' | 'range';

export interface NaturalFeature {
  kind: NaturalKind;
  /** Hexes the name covers (original mountain / reservoir hexes). The label goes on the first one. */
  hexes: [number, number][];
  /** Map label. */
  label: string;
  /** Full name for the panel (with the province when the name is not unique). */
  ko: string;
  /** Summit elevation in metres (peaks). */
  elevation?: number;
  /** Summit / lake centre (GeoNames). Ranges have none. */
  lat?: number;
  lon?: number;
  /** Lakes: the dam was completed in this year (every lake on the map existed in 1950). */
  built?: number;
  /** Name at the time of the war, if it changed. */
  historic?: string;
  note?: string;
  /** No clear match: the nearest notable summit is more than about 25 km from the hex. */
  estimated?: boolean;
}

/**
 * Every mountain hex (terrain 0x92) and reservoir hex (0xF4-0xFF) of the original map, named after the
 * nearest summit / lake of the real map (GeoNames, checked 2026-10-16), plus Paektu-san on the border and a
 * few range names for the overview. Matching: docs/places.md. Our own data from public geography.
 */
export const NATURAL_FEATURES: NaturalFeature[] = [
  // ---------- North Korea ----------
  { kind: 'peak', hexes: [[20, 8]], label: '백두산', ko: '백두산', elevation: 2744, lat: 41.994, lon: 128.078, note: '한반도 최고봉(장군봉)과 천지. 원작 지도에서는 작전 지역 밖(국경) 헥스' },
  { kind: 'peak', hexes: [[30, 2]], label: '증산', ko: '증산 (함경북도)', elevation: 1041, lat: 42.753, lon: 130.005, note: '한반도 최북단 온성 일대' },
  { kind: 'peak', hexes: [[32, 4]], label: '송진산', ko: '송진산', elevation: 1140, lat: 42.409, lon: 130.28, note: '두만강 하류' },
  { kind: 'peak', hexes: [[28, 9]], label: '고성산', ko: '고성산 (함경북도)', elevation: 1756, lat: 41.973, lon: 129.512, note: '청진 서쪽' },
  { kind: 'peak', hexes: [[26, 11]], label: '관모봉', ko: '관모봉', elevation: 2541, lat: 41.705, lon: 129.241, note: '함경산맥 최고봉, 한반도에서 두 번째로 높다. 헥스 중심은 관모연봉의 투구봉(2335m)에 더 가깝다' },
  { kind: 'peak', hexes: [[22, 10]], label: '남포태산', ko: '남포태산', elevation: 2428, lat: 41.736, lon: 128.409, note: '백두산 남동쪽 약 40km' },
  { kind: 'peak', hexes: [[23, 13]], label: '관두봉', ko: '관두봉 (양강도)', elevation: 2136, lat: 41.368, lon: 128.579, note: '백사봉(2099m) 인접' },
  { kind: 'peak', hexes: [[24, 15]], label: '두류산', ko: '두류산 (양강도·함경도)', elevation: 2309, lat: 41.165, lon: 128.779 },
  { kind: 'peak', hexes: [[22, 15]], label: '희사봉', ko: '희사봉 (함경남도)', elevation: 1760, lat: 40.764, lon: 128.363, estimated: true, note: '가장 가까운 1,000m 이상 봉우리가 30km가량 떨어져 있다 (달원봉은 더 가깝지만 높이 자료 없음)' },
  { kind: 'peak', hexes: [[16, 15]], label: '대암산', ko: '대암산 (자강도)', elevation: 2205, lat: 40.88, lon: 127.623, estimated: true, note: '강원도 양구의 대암산과 다른 산. 낭림산맥 북부로, 두운봉·삼파두산도 비슷한 거리' },
  { kind: 'peak', hexes: [[18, 15]], label: '두운봉', ko: '두운봉', elevation: 2487, lat: 41.0, lon: 127.7 },
  { kind: 'peak', hexes: [[18, 16], [19, 16]], label: '백산', ko: '백산 (양강도)', elevation: 2476, lat: 40.816, lon: 127.761 },
  { kind: 'peak', hexes: [[16, 17], [16, 18]], label: '연화산', ko: '연화산', elevation: 2355, lat: 40.779, lon: 127.376 },
  { kind: 'peak', hexes: [[18, 18]], label: '북수백산', ko: '북수백산', elevation: 2522, lat: 40.71, lon: 127.748, note: '한반도에서 세 번째로 높은 산' },
  { kind: 'peak', hexes: [[10, 17], [10, 18]], label: '장산', ko: '장산 (자강도)', elevation: 1005, lat: 40.982, lon: 126.425, note: '강계 서쪽. 만포 주변은 원작 지도가 남북으로 눌려 있어 판정이 덜 확실하다' },
  { kind: 'peak', hexes: [[3, 22]], label: '천마산', ko: '천마산 (평안북도)', elevation: 1169, lat: 40.197, lon: 125.029 },
  { kind: 'peak', hexes: [[10, 23]], label: '묘향산', ko: '묘향산', elevation: 1909, lat: 40.019, lon: 126.333, note: '비로봉, 보현사' },
  { kind: 'peak', hexes: [[13, 25]], label: '철옹산', ko: '철옹산 (평안남도)', elevation: 1094, lat: 39.672, lon: 126.579, estimated: true, note: '가장 가까운 1,000m 이상 봉우리가 25km가량 떨어져 있다' },
  { kind: 'peak', hexes: [[12, 27]], label: '백산', ko: '백산 (평안남도)', elevation: 1452, lat: 39.472, lon: 126.745 },
  { kind: 'peak', hexes: [[14, 30]], label: '매봉산', ko: '매봉산 (법동)', elevation: 1571, lat: 38.987, lon: 127.148 },
  { kind: 'peak', hexes: [[18, 30]], label: '황룡산', ko: '황룡산 (강원도)', elevation: 1268, lat: 38.993, lon: 127.62 },
  { kind: 'peak', hexes: [[16, 31]], label: '추애산', ko: '추애산', elevation: 1530, lat: 38.835, lon: 127.279 },
  { kind: 'peak', hexes: [[10, 32]], label: '언진산', ko: '언진산', elevation: 1150, lat: 38.831, lon: 126.446 },
  { kind: 'peak', hexes: [[20, 33]], label: '금강산', ko: '금강산', elevation: 1638, lat: 38.656, lon: 128.105, note: '비로봉' },
  // ---------- South Korea ----------
  { kind: 'peak', hexes: [[20, 36]], label: '대암산', ko: '대암산 (양구·인제)', elevation: 1304, lat: 38.211, lon: 128.135, note: '동쪽 기슭에 펀치볼(해안분지). 1951년 격전지' },
  { kind: 'peak', hexes: [[22, 37]], label: '설악산', ko: '설악산', elevation: 1708, lat: 38.119, lon: 128.467, note: '대청봉' },
  { kind: 'peak', hexes: [[23, 40]], label: '오대산', ko: '오대산', elevation: 1563, lat: 37.793, lon: 128.542, note: '비로봉. 계방산(1577m) 인접' },
  { kind: 'peak', hexes: [[25, 44]], label: '함백산', ko: '함백산', elevation: 1573, lat: 37.161, lon: 128.917 },
  { kind: 'peak', hexes: [[26, 45]], label: '태백산', ko: '태백산', elevation: 1567, lat: 37.096, lon: 128.916, note: '장군봉' },
  { kind: 'peak', hexes: [[24, 45]], label: '소백산', ko: '소백산', elevation: 1439, lat: 36.958, lon: 128.485, note: '비로봉' },
  { kind: 'peak', hexes: [[19, 48]], label: '속리산', ko: '속리산', elevation: 1058, lat: 36.543, lon: 127.871, note: '천왕봉' },
  { kind: 'peak', hexes: [[19, 53]], label: '민주지산', ko: '민주지산', elevation: 1242, lat: 36.04, lon: 127.849 },
  { kind: 'peak', hexes: [[20, 53]], label: '가야산', ko: '가야산', elevation: 1430, lat: 35.823, lon: 128.12, note: '상왕봉, 해인사' },
  { kind: 'peak', hexes: [[19, 54], [18, 54]], label: '덕유산', ko: '덕유산', elevation: 1614, lat: 35.86, lon: 127.746, note: '향적봉' },
  { kind: 'peak', hexes: [[16, 54]], label: '마이산', ko: '마이산', elevation: 686, lat: 35.761, lon: 127.416, note: '진안고원. 북서쪽에 운장산(1126m)' },
  { kind: 'peak', hexes: [[23, 55]], label: '비슬산', ko: '비슬산', elevation: 1084, lat: 35.716, lon: 128.525 },
  { kind: 'peak', hexes: [[26, 56]], label: '가지산', ko: '가지산', elevation: 1241, lat: 35.62, lon: 129.003, note: '영남알프스 최고봉. 신불산(1208m) 인접' },
  { kind: 'peak', hexes: [[18, 57], [17, 58], [18, 58]], label: '지리산', ko: '지리산', elevation: 1915, lat: 35.337, lon: 127.731, note: '천왕봉. 남한 내륙 최고봉, 전쟁 전후 빨치산 근거지' },

  // ---------- lakes (all hydroelectric reservoirs of the Japanese colonial period) ----------
  { kind: 'lake', hexes: [[15, 19]], label: '장진호', ko: '장진호 (Chosin Reservoir)', lat: 40.498, lon: 127.202, note: '장진강 수력발전용 저수지. 1950년 11~12월 장진호 전투' },
  { kind: 'lake', hexes: [[17, 19]], label: '부전호', ko: '부전호 (Fusen Reservoir)', lat: 40.611, lon: 127.542, note: '부전강 수력발전용 저수지' },
  { kind: 'lake', hexes: [[19, 17]], label: '황수원저수지', ko: '황수원저수지 (허천강)', lat: 40.699, lon: 128.073, note: '허천강 수력발전용 저수지' },
  { kind: 'lake', hexes: [[19, 37]], label: '파로호', ko: '파로호', historic: '화천저수지', built: 1944, lat: 38.105, lon: 127.783, note: '화천댐(1944) 북한강. 1951년 전투 뒤 "오랑캐를 깨뜨린 호수"라는 뜻의 파로호로 개명' },
  { kind: 'lake', hexes: [[18, 39]], label: '청평호', ko: '청평호', built: 1943, lat: 37.705, lon: 127.483, note: '청평댐(1943) 북한강. 원작 지도의 저수지 헥스는 실제 호수보다 동쪽으로 약 한 칸 치우쳐 있다 (의암호·소양호는 전쟁 뒤에 생김)' },

  // ---------- ranges and plateaus (overview zoom only) ----------
  { kind: 'range', hexes: [[18, 17]], label: '개마고원', ko: '개마고원' },
  { kind: 'range', hexes: [[12, 21]], label: '낭림산맥', ko: '낭림산맥' },
  { kind: 'range', hexes: [[23, 16]], label: '함경산맥', ko: '함경산맥' },
  { kind: 'range', hexes: [[23, 41]], label: '태백산맥', ko: '태백산맥' },
  { kind: 'range', hexes: [[21, 50]], label: '소백산맥', ko: '소백산맥' },
];

/** Peak or lake on a hex (ranges are labels only). */
export function featureAt(x: number, y: number): NaturalFeature | undefined {
  return NATURAL_FEATURES.find((f) => f.kind !== 'range' && f.hexes.some(([hx, hy]) => hx === x && hy === y));
}

export function placeAt(x: number, y: number, is1995: boolean): PlaceName | undefined {
  return placesFor(is1995).find((p) => p.x === x && p.y === y);
}

// ---------- georeference: hex -> approximate latitude / longitude ----------

const SQRT3 = Math.sqrt(3);
const hexXY = (col: number, row: number): [number, number] => [1.5 * col, SQRT3 * (row + ((col & 1) === 0 ? 0.5 : 0))];

function solve3(rows: number[][], ys: number[]): number[] {
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const B = [0, 0, 0];
  rows.forEach((r, i) => {
    for (let a = 0; a < 3; a++) {
      B[a] += r[a] * ys[i];
      for (let b = 0; b < 3; b++) A[a][b] += r[a] * r[b];
    }
  });
  const M = A.map((row, i) => [...row, B[i]]);
  for (let i = 0; i < 3; i++) {
    let p = i;
    for (let k = i + 1; k < 3; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;
    [M[i], M[p]] = [M[p], M[i]];
    for (let k = 0; k < 3; k++) {
      if (k === i) continue;
      const f = M[k][i] / M[i][i];
      for (let j = i; j < 4; j++) M[k][j] -= f * M[i][j];
    }
  }
  return M.map((row, i) => row[3] / row[i]);
}

/** Control points: places with present-day coordinates, excluding the compressed far north border. */
export const GEO_CONTROL = PLACE_NAMES.filter((p) => p.lat !== undefined && p.lon !== undefined && p.y >= 9 && !(p.x === 9 && p.y === 17));

const rows = GEO_CONTROL.map((p) => [...hexXY(p.x, p.y), 1]);
const LAT = solve3(rows, GEO_CONTROL.map((p) => p.lat!));
const LON = solve3(rows, GEO_CONTROL.map((p) => p.lon!));

function affine(x: number, y: number): { lat: number; lon: number } {
  const [px, py] = hexXY(x, y);
  return { lat: LAT[0] * px + LAT[1] * py + LAT[2], lon: LON[0] * px + LON[1] * py + LON[2] };
}

/**
 * The original map squeezes the north (Manpo sits about 4 rows too far south), so north of row 30 the
 * affine fit is corrected by the residuals of identified hexes (inverse distance weighting): the border
 * crossings, the Chosin Reservoir and the northern control points.
 */
const NORTH_ANCHORS: { x: number; y: number; lat: number; lon: number }[] = [
  { x: 9, y: 17, lat: 41.157, lon: 126.29 }, // 만포
  { x: 14, y: 10, lat: 41.78, lon: 126.88 }, // 중강진
  { x: 0, y: 22, lat: 40.1, lon: 124.4 }, // 신의주
  { x: 29, y: 5, lat: 42.44, lon: 129.75 }, // 회령
  { x: 15, y: 19, lat: 40.498, lon: 127.202 }, // 장진호
  ...GEO_CONTROL.filter((p) => p.y <= 30).map((p) => ({ x: p.x, y: p.y, lat: p.lat!, lon: p.lon! })),
];
const RESIDUALS = NORTH_ANCHORS.map((a) => { const e = affine(a.x, a.y); return { x: a.x, y: a.y, dLat: a.lat - e.lat, dLon: a.lon - e.lon }; });

/** Approximate real position of a hex centre (affine fit, about 10 km; corrected locally in the north). */
export function hexToLatLon(x: number, y: number): { lat: number; lon: number } {
  const e = affine(x, y);
  const fade = Math.max(0, Math.min(1, (30 - y) / 6)); // full correction from row 24 northwards
  if (!fade) return e;
  let w = 0, dLat = 0, dLon = 0;
  for (const r of RESIDUALS) {
    const k = 1 / (Math.hypot(r.x - x, r.y - y) + 1) ** 2;
    w += k; dLat += k * r.dLat; dLon += k * r.dLon;
  }
  return { lat: e.lat + (fade * dLat) / w, lon: e.lon + (fade * dLon) / w };
}

/** Great-circle-ish distance in km (equirectangular, fine at this scale). */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLat = (a.lat - b.lat) * 111.2;
  const dLon = (a.lon - b.lon) * 111.2 * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
  return Math.hypot(dLat, dLon);
}
