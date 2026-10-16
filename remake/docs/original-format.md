# 원본 포맷과 역공학 결과

대상: Conflict: Korea – The First Year 1950-51, DOS v1.0 (SSI 1992, Norm Koger jr.)
모든 내용은 `tools/extract`, `tools/disasm`으로 재현할 수 있습니다.

## 1. KOREA.EXE

| 항목 | 값 |
|---|---|
| 형식 | DOS MZ, 압축 없음, 재배치 3,034개 |
| 컴파일러 | Turbo Pascal 6.0 (`Portions Copyright (c) 1983,90 Borland`), Graph 유닛 + BGI 드라이버 |
| 디버그 정보 | 로드 이미지 뒤 21,465바이트, TDInfo 2.8 (magic `0x52FB`) |
| 복원된 심볼 | 모듈 21개, 프로시저 285개, 데이터 세그먼트 변수 172개, 상수 254개, 레코드 타입 전체 |
| 데이터 세그먼트 | `2DFC` (파일 오프셋 = 헤더 12,176 + 세그먼트×16) |

### 모듈 구성 (코드 크기순)

| 모듈 | 코드 | 역할 (함수 이름 기준) |
|---|---:|---|
| WARRIORS | 26.1KB | AI 본체: `KIM`(공산군), `WALTON`(유엔군) |
| TACSUBS | 23.7KB | 그래픽/입출력: 타일 그리기, 저장/불러오기, `RND`, 시나리오 선택(`S_DATA`) |
| EURSUBS1 | 22.1KB | 공용 유틸: `GET_TERRAIN`, `SHOW_HEX`, `CALENDAR`, `DIST`, `ENEMY_ADJACENT`, `NEWS_FLASH` |
| MOVEUNIT | 19.0KB | 이동: `MOVE_COST`, `OVERRUN`, `BUGOUT`, `AMPHIBIOUS`, `CAN_ENTRAIN` |
| REPORTS | 15.0KB | 보고서 화면 |
| GRCMBT | 13.3KB | 지상전: `DO_GROUND_COMBAT`, `NAVAL_GUNS`, `CHECK_ELIM`, `ELIMINATE_UNIT` |
| ENDTURN | 8.6KB | 턴 정리: `GROUND_REINFORCEMENTS`, `DO_INTEL`, `DO_PATROLS`, `MINE_WARFARE`, `CHECK_CHINA` |
| AIRCMBT | 8.3KB | 공중전: `DO_AIR_COMBAT` |
| KOREA | 8.4KB | 메인 루프: `PHASE_PULSE`, `PLAYER_PHASE`, `EVENT_LOOP` |
| OPSSUBS | 7.8KB | 항공 작전: `AIR_OPERATIONS`, `EFFECTIVE_STRENGTH`, `DETERMINE_INTERDICTION` |
| AISUBS | 4.9KB | AI 보조: `WITHDRAW`, `MOVE_TO_OBJECTIVE`, `PLOT_ATTACK`, `SURROUNDED` |
| HEXSTUFF | 4.8KB | 헥스 정보/선택, `ROAD_HEX` |
| SUPPLY | 4.4KB | `DETERMINE_SUPPLY`, `REST_UP` |
| ILBM, MINMOUSE, TEST, GLOBALS | - | 그림 로더, 마우스, 전역변수 |

## 2. 시나리오/세이브 파일 (KOREA1-4.DAT, KOREA1S-4S.DAT)

33,792바이트 = GLOBALS 모듈의 전역변수 `UNITS`(DS:0806)부터 `VICTORY`(DS:8C05)까지를 그대로 덤프한 것.
파일 오프셋 = DS 오프셋 - 0x0806.

| 파일 오프셋 | 변수 | 타입 |
|---|---|---|
| 0x0000 | UNITS | array[255] of UNIT_TYPE (71B) |
| 0x46BA | AIR_UNITS | array[34] of AIR_UNIT_TYPE (36B) |
| 0x4B82 | AIR_NAMES | array[15] of string[13] (기종명) |
| 0x4C54 | EQ_STRINGS | array[15] of string[16] (장비명) |
| 0x4D54 | EQ_VALS | array[15] of (lethality, survivability: int16) |
| 0x4D90 | REPLACEMENTS | array[7 국적] of array[15 장비] of [턴당 보충량, 풀] (rules/supply.md 4) |
| 0x4E62 | TERRAIN | array[0..33] of array[0..65] of array[0..4] of byte |
| 0x7A36 | CORPS | array[5] of (첫 유닛, 끝 유닛) — 북한 1-86, 중공 87-155, 국군 156-186, 유엔 187-250 |
| 0x7A4A | STOCKPILE | DUAL: **[0] 공산, [1] 유엔** (REST_UP `02f2`, GROUND_REINFORCEMENTS `0721`/`0793`, TERRITORY_BALANCE로 확인) |
| 0x7A4E | WEATHER | 3×4 int16, 값 = 기온×10 + 하늘 (기온 1 추위/2 온화/3 더위, 하늘 1 맑음/2 흐림/3 폭풍). 0행 실제(이번 턴~+3), 1·2행 공산·유엔 예보 |
| 0x7A66 | NOTES | array[8] of string[255] (뉴스) |
| 0x8266 | SCENARIO | 8 bytes [시나리오, ?, 공산군 역량(1~5, 재보급률 +7), 컴퓨터 진영(0 두 사람, 1 공산, 2 유엔), ?, 99 = 게임 종료, 중공군 개입(0 역사적, 1 고정), ?]. 새 게임은 시작 메뉴 값으로 덮어씁 |
| 0x826E | REALITY | array[1..4] of boolean. [4] 정보 제한(거짓이면 모든 헥스 정찰 2), [2] Air Campaign Player Control(거짓이면 프로그램이 임무·공습 목표, rules/air.md 7), [1]·[3] 미확정 |
| 0x8272 | ROADS | 114 bytes: 타일 코드 0x0B~0x7C의 도로 방향 마스크 |
| 0x82E4 | RAILS | 129 bytes: 타일 코드 0x1E~0x9E의 철도 방향 마스크 |
| 0x8366 | PORTS | array[18] of (MINED, X, Y) — 한국 12 + 일본 6 |
| 0x839C | AIRFIELDS | array[9] of (CURRENT_STATUS, BEST_STATUS, X, Y) |
| 0x83C0~ | INTERCEPTION, INTERDICTION, RAIL_DEMAND, RED_AIR, SEALIFT/AIRLIFT_DEMAND, UN_HEXES, CCF_INTERVENTION, FREEZE_LINE, TURN, ... VICTORY | UN_HEXES = 100×유엔 도시 + 유엔 기타 헥스(지난 턴), CCF_INTERVENTION 99 미정 / 88 허세 / 그 외 개입 턴. VICTORY는 코드에서 쓰지 않음 |
| 0x83DE | UTILITY_SPACE | 20 bytes, 사건 플래그·카운터 (rules/turn.md 7) |
| 0x83F2 | FIRSTUNUNIT, LASTUNUNIT | 유엔 쪽 유닛 번호 범위: 1950년대 156~250, 1995 124~202 |

### AIR_UNIT_TYPE (36바이트)

NAME string[24], ENTRY_TURN, EXIT_TURN, TYPE1, TYPE2(AIR_NAMES 번호), AIR_TO_AIR, AIR_TO_GROUND, MISSION(0 제공권, 1 지상 공격, 2 차단),
BASE(0 일본, 1 한국, 2 항공모함), ALL_WEATHER, LONG_RANGE, POOR_RUNWAYS(참 = 열악한 활주로 가능). 항공 규칙 전체는 `docs/rules/air.md`.
1950년대 파일은 29개(유엔), 1995는 34개(1~13 북한, 14~34 유엔). 격추되면 EXIT_TURN = 0.

### UNIT_TYPE (71바이트, 필드 이름은 원본 소스 그대로)

| 오프셋 | 필드 | 의미 |
|---|---|---|
| 0 | SYMBOL: int16 | 국적×10 + 병과. 국적 0 미군, 1 미 해병, 2 영연방, 3 기타 유엔, 4 국군, 5 북한, 6 중공 / 병과 1 기갑·기병, 2 보병, 3 공수·특수전, 4 중포병, 5 포병 |
| 2 | NAME1: string[20] | 부대(Force) 이름. 부대 선두 유닛에서만 의미 있음 |
| 23 | NAME: string[20] | 유닛 이름 |
| 44 | EXPERIENCE: byte | 1 신병, 2 숙련(×1.25), 3 정예(×1.5) |
| 45 | STATUS: byte | 상태 비트: 0x01 재보급됨(증원 도착·재편성도 1), 0x02 이번 턴 후퇴, 0x04 이번 턴 이동함, 0x08 제거됨(BURY), 0x10 이번 턴 전력 보고가 거짓(GET_STRENGTH 모드 3이 처음 볼 때 1/3), 0x20 이번 턴 전력 보고가 정해짐(모드 3 처음 계산 또는 지상전 참가, 지상전은 0x10 해제), 0x40 준비도 75+ 미이동, 0x80 공중 보급. REST_UP이 턴마다 0으로 초기화 (rules/intel.md 2.4) |
| 46 | READINESS: int16 | 준비도 % |
| 48 | MOVE: int16 | **이번 턴에 쓴** 이동력. 남은 이동력 = 국가 이동력 − (MOVE mod 100). 100의 자리 = 공격 계획 방향(3·dy+dx+5) |
| 50 | ATTACHED: int16 | 같은 부대의 다음 유닛 번호 (연결 리스트, 0 = 끝) |
| 52 | MAP_X, MAP_Y: int16 | 위치. 증원 대기는 `MAP_X = −(도착 턴×100 + x 코드)`, x 코드 99/88/77 = 일반 진입 목록(공산 / 남한 도시 / 일본). 중공군 도착 턴은 50 + 개입 턴 기준 오프셋. 제거된 유닛은 (1, 0) |
| 56 | EQUIPMENT | array[5] of (EQUIP_TYPE, ASSIGNED, AUTHORIZED) |

검증: `NKPA 50/15 Inf Rgt`의 장비로 계산한 생존력 234, 살상력 418이 매뉴얼 부록 F 예시와 일치.

### 기본 파일 vs S 파일

`S_DATA`에서 플레이 모드 옵션이 1이거나 `TEST_BOTH_PLAYERS`일 때 `koreaNs.dat`, 아니면 `koreaN.dat`를 엽니다.
S 파일은 유닛이 사단·군 단위로 편성돼 있고 날씨 예보가 초기화돼 있습니다. 기본 파일은 유닛별 부대에 날씨가 미초기화 상태입니다.

## 3. 지도

- 34열 × 66행, 위아래가 평평한(flat-top) 헥스, **짝수 열이 반 칸 아래** (even-q). 헥스 한 칸 15km.
- 6방향 비트: N=1, NE=2, SE=4, S=8, SW=16, NW=32 (디버그 정보의 상수 이름 그대로).
- 헥스당 5바이트: [0] 지형 코드(= 타일 번호), [1] 점령(1 유엔, 2 공산), [2] 정찰 단계(REST_UP 중에는 보급 상태로 쓰임),
  [3] 첫째 부대 선두 유닛 번호, [4] 둘째 부대 선두 유닛 번호 (스택 최대 2, 모든 시나리오에서 부대 위치와 일치).
- DUAL 배열(INTERDICTION, RAIL_DEMAND 등)의 인덱스 0 = 공산 플레이어(PLAYER 1), 1 = 유엔 플레이어(PLAYER 2). 철도 차단 판정에서 공산군은 INTERDICTION[1]을 받음.

### 지형 코드 (EURSUBS1.GET_TERRAIN)

| 코드 | 지형 | 코드 | 지형 |
|---|---|---|---|
| 0x00 | 개활지 (x=33, y>58은 일본) | 0x58 | 험지 |
| 0x01-0x0A | 개활지+강 | 0x59-0x67 | 험지+강 |
| 0x0B-0x0F | 개활지+도로+강 | 0x68-0x70 | 험지+도로+강 |
| 0x10-0x1D | 개활지+도로 | 0x71-0x7E | 험지+도로 |
| 0x1E-0x46 | 개활지+도로+철도 | 0x7F-0x8B | 험지+철도 |
| 0x47-0x57 | 개활지+도로+철도+강 | 0x8C-0x8E | 험지+철도+강 |
| 0x95-0x9C | 개활지+철도 | 0x9D-0xA4 | 개활지+철도+강 |
| 0x8F | 지도 가장자리 (65행) | 0x90, 0x91 | 미정의 |
| 0x92 | 산악 | 0x93 | 도시 |
| 0x94 | 작전 지역 밖(만주) | 0xA5-0xDA | 바다 (해안 타일 포함) |
| 0xDB-0xF3 | 하구 | 0xF4-0xFF | 저수지 |

- 험한 지형(CLOSED_TERRAIN): 0x58-0x8E, 0x92
- 도로(ROAD_HEX): 0x0B-0x57, 0x68-0x7C. 1950년대 시나리오에서 폭풍이면 도로 무시.
- 도로/철도 방향: ROADS[code-0x0B], RAILS[code-0x1E]. 이웃과 맞물리는지 검증: 도로 604/611, 철도 460/480 (나머지는 도시·항구·지도 밖 연결).
- 강 방향: 별도 표가 없어 타일 그림의 강 색(팔레트 9)이 닿는 변으로 추출. 같은 방법을 도로에 적용하면 ROADS 표와 26/26 일치.
- 도시는 마스크가 없고 이웃에서 들어오는 도로/철도와 모두 연결.

### 타일 그래픽 (TACSUBS.DRAW_VGA_TOPTILE)

- 타일 40×18 픽셀, 시트 한 열에 11개씩 세로로 쌓임: 열 = 코드÷11, 행 = 코드%11
- 코드 < 0xA5: `K_HX_VGA.LBM`, 코드 ≥ 0xA5: `KCHX_VGA.LBM` (코드-0xA5)
- `*G*.LBM`은 격자선이 들어간 버전. 모든 LBM은 Deluxe Paint ILBM 640×200 16색.

### 이름 있는 장소

- 도시(GET_TERRAIN): 평양 (7,29), 서울 (14,40), 광주 (13,59), 대전 (17,51), 대구 (24,54), 부산 (26,59), 함흥·흥남 (17,24)
- 1995년 추가: 군산·이리, 마산·창원, 인천, 부천, 안양·수원, 서울 남부
- 항구 12: 남포, 인천, 군산, 목포, 여수, 부산, 울산, 원산, 흥남, 신포, 청진, 웅기 (+ 일본 6)
- 비행장 9: 대구 K-2, 포항 K-3, 부산 동부 K-9, 진해 K-10, 수원 K-13, 김포 K-14, 부산 K-1, 평양, 군산 K-8

## 4. 코드에서 확인한 규칙

- 날짜(CALENDAR): 0턴 = 6월 25일, 이후 매달 1·8·15·22일 4턴. 크로마이트 시나리오 11턴 = 1950년 9월 15일.
- 선공 결정(PHASE_PULSE): `RND(1,200)`과 `STOCKPILE[공산] + 100 - STOCKPILE[유엔]` 비교, 1차 명령 단계는 뒤집음 (매뉴얼 부록 F와 확률 일치, rules/turn.md 2).
- 결빙(FROZEN): `y ≤ FREEZE_LINE`이고, 결빙선 5행 이내라면 바다에 인접하지 않을 때만 결빙.
- 공산 항공력: 8턴 이후 매 턴 RED_AIR +10, 24턴 이후 +5 추가.
- 턴 정리 순서(KOREA 주 루프): UNSPOT_EVERYTHING → REST_UP → GROUND_REINFORCEMENTS → RED_AIR 증가 → CHECK_CHINA → MINE_WARFARE → DO_PATROLS → DO_INTEL → CHECK_BIGHEXES → END_TEST → NEXT_TURN. 자세한 내용은 `docs/rules/turn.md`, `docs/rules/supply.md`.
- 많은 프로시저의 TDInfo 길이에 다음 프로시저의 중첩 함수가 섞여 있음: CHECK_BIGHEXES 길이 안에 GROUND_REINFORCEMENTS의 중첩 5개(`0228` `0283` `02ff` `03ed` `056f`), DO_INTEL 길이 안에 DO_PATROLS의 중첩 4개, GROUND_REINFORCEMENTS 뒤 `1002`~는 NEXT_TURN의 중첩.

- 이동 규칙 전체는 `docs/rules/movement.md`.
- 중첩 프로시저: TDInfo는 최상위 프로시저만 기록한다. 중첩 함수는 부모 앞에 놓여 바로 앞 프로시저의 길이에 포함되어 보인다
  (OVERRUN 길이에 MOVE_COST의 도로/철도/강 함수, CAN_ENTRAIN 길이에 MOVE_UNIT의 이동 루프, SUPPLY 첫 프로시저 앞 3.7KB에 REST_UP의 본체).

## 5. 아직 모르는 것

- 38선 표시 데이터 위치 (그리기 코드 안에 있을 것으로 추정). 미그 앨리는 규칙 코드에서 x < 15, y < 27로 확인(GROUND_ATTACK_STRENGTH)
- SCENARIO[1], [4], [7], REALITY[1], [3]
