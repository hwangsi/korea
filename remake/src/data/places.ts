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

/** Approximate real position of a hex centre (affine fit, error about 10 km; worse along the Yalu). */
export function hexToLatLon(x: number, y: number): { lat: number; lon: number } {
  const [px, py] = hexXY(x, y);
  return { lat: LAT[0] * px + LAT[1] * py + LAT[2], lon: LON[0] * px + LON[1] * py + LON[2] };
}

/** Great-circle-ish distance in km (equirectangular, fine at this scale). */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLat = (a.lat - b.lat) * 111.2;
  const dLon = (a.lon - b.lon) * 111.2 * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
  return Math.hypot(dLat, dLon);
}
