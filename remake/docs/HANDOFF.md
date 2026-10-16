# 인계 문서 (HANDOFF)

새 환경이나 새 AI 세션에서 작업을 이어갈 때 **가장 먼저 읽는 문서**입니다.
작업을 마칠 때마다 2장(현재 상태)과 7장(다음 작업)을 갱신하세요.

- 마지막 갱신: 2026-10-16 17시, 노트북(C:\Users\hwang\AIprojects\korea). 턴 진행과 보급(정리 단계 전체) 완료 (테스트 36개 통과, standalone 브라우저 검증)
- 저장소: https://github.com/hwangsi/korea (Public, main 브랜치). Aside 샌드박스에서는 git이 돌지 않아 커밋·푸시는 사용자가 직접 한다
- 다음 세션 시작 문장 예: "korea/remake/docs/HANDOFF.md 읽고 7장 다음 작업부터 이어서 해줘"

## 1. 프로젝트와 확정된 방향

SSI의 1992년 DOS 워게임 **Conflict: Korea – The First Year 1950-51** (디자이너 Norm Koger)을 웹으로 리메이크합니다.

| 항목 | 결정 |
|---|---|
| 게임 성격 | **원작처럼 깊이 있는 작전급 시뮬레이션** (헥스 15km, 1턴 약 1주, 부대=유닛 묶음, 장비 단위 전력, 준비도·경험·보급·날씨·정보·항공 유지) |
| 재해석 범위 | UI/UX, 그래픽, 편의 기능은 자유롭게 현대화. 규칙은 원작을 기준으로 하고, 바꾸는 부분은 문서에 근거와 함께 기록 |
| 플랫폼 | 웹 브라우저 |
| 조작 | 대부분 마우스 클릭만으로 |
| 언어 | 한국어 필수 (모든 화면 문자열은 `src/i18n/ko.ts`) |
| 성격 | 개인 프로젝트. 원본 파일과 추출 데이터는 공개하지 않음 |

## 2. 현재 상태

완료
- 원본 실행 파일 분석: Turbo Pascal 6.0, 디버그 심볼(TDInfo)에서 프로시저 285개, 전역변수 172개, 상수 254개, 레코드 구조 복원
- 시나리오/세이브 포맷 완전 해독 → `docs/original-format.md`
- 추출기: 지도(지형, 강/도로/철도 6방향), 시나리오 8종(유닛, 부대 편성, 항공대, 장비, 보충, 뉴스, 점령), 그래픽 PNG
- 디스어셈블러(심볼/문자열 주석), UI 문자열 707개 추출
- 한글 지도 뷰어 프로토타입: 시나리오 전환, 점령지·전선, NATO식 부대 마커, 헥스/부대/장비 정보 패널
- **이동 시스템** (`docs/rules/movement.md`)
  - 규칙: MOVE_COST·NATIONAL_MOVEMENT_RATE·MOVE_UNIT 단계 루프·CAN_ENTRAIN·BUGOUT·REST_UP(턴 시작 이동력)을 디스어셈블로 확정, 매뉴얼과 다른 점 기록
  - 엔진: `src/engine/state.ts` (변경 가능한 GameState, 스택 = TERRAIN 바이트 3·4, 시드 RNG, 스냅샷), `src/engine/movement.ts` (헥스 비용과 내역, 다익스트라 도달 범위·경로, 한 칸씩 원작 규칙 적용, 되돌리기 1단계, 철도 이동, 버그아웃, 미 해병 하구 상륙 예외, 턴 시작 이동력 함수)
  - UI: 부대 클릭 → 도달 범위(남는 이동력 숫자) → 마우스 오버 경로 미리보기 → 클릭 고정(비용 내역) → 다시 클릭/Enter 이동. 오른쪽 클릭·Esc 취소, Ctrl+Z 되돌리기, 같은 헥스 재클릭으로 겹친 부대 전환, 철도 모드, 버그아웃 버튼, 적 부대 빨간 점선, 결빙 지역 표시, 이동력 다 쓴 부대는 흐리게
  - 테스트: `tests/movement.test.ts` 13개 (원본 DIST와 인접 일치, 지형별 비용, 폭풍·피란민·결빙, 혼잡·스택·적 점령지·이탈, 최소 1칸 이동, 되돌리기, 철도, 버그아웃, 상륙 예외)
- **지상전** (`docs/rules/combat.md`, `src/engine/combat.ts`): GET_STRENGTH 5개 모드, 돌파(OVERRUN), 공격 명령(MOVE 방향 코드)·취소,
  DO_GROUND_COMBAT(군별 실행, 중포병·함포 지원, 손실률, 장비 손실, 제거·회수 풀, 후퇴·버그아웃·막힘). UI: 인접 적 헥스 클릭 → 공격 미리보기(예상 손실률·후퇴 확률·돌파 가능) → 다시 클릭 명령, 지도에 공격 화살표, 상단 "전투 해결" → 결과 보고. 테스트 6개 (총 22개)
- **지명** (`docs/places.md`, `src/data/places.ts`): 아이콘이 있는 모든 헥스(도시·항구·비행장·공산군 보급 거점)에 현재 지명.
  헥스→위경도 아핀 보정(RMS 약 10km)과 전사 자료(K-site, 중공군 도하 지점)로 판정. 지도 "지명" 레이어, 헥스 패널에 옛 이름·원작 표기·추정 위경도
- 디스어셈블러: TDInfo에 없는 중첩 프로시저 구간도 출력 (`--all`의 `(unnamed before X)`, `--at <모듈> <시작> <끝>`)
- **턴 진행** (`docs/rules/turn.md`, `src/engine/turn.ts`, `endturn.ts`, `weather.ts`)
  - 주 루프 그대로: 1차 명령(두 플레이어) → PHASE 2(FORCE_SPOTTING, 지상전) → 2차 명령 → 정리 → NEXT_TURN.
    선공(비축 RND 200, 1차 단계 반전, 시나리오별 고정 턴), 유엔 1차 단계 없는 시작 턴, 2차 단계 제한과 이동 중 버그아웃(5.21)
  - 새 게임: LOAD_NEW_GAME의 날씨 4회 생성 + 첫 턴 강제 날씨, 정보 완전 옵션, INIT_GAME 0턴 사건(피란민, 1995 비축 감소)
  - 정리 단계: UNSPOT, REST_UP, GROUND_REINFORCEMENTS(비축 수송·수요, 증원 도착, 보충 풀·배분, 재편성), RED_AIR,
    CHECK_CHINA, MINE_WARFARE, DO_PATROLS(순찰+게릴라+평양·함흥 반환), DO_INTEL, CHECK_BIGHEXES(도시 뉴스), END_TEST
  - NEXT_TURN: 포로·매장지 뉴스, 1995 추가 미군, 피란민 판정(UN_HEXES, UTILITY_SPACE[7]), 날씨(월별 표, 예보 85/70/55%, 결빙선), 비행장 복구
  - 승리 수준 TERRITORY_BALANCE(기준 181/346, korea1 0 · korea4 +1 확인), GAME_OVER 뉴스, 계속 진행
  - UI: 상단 "단계 종료 ▶", 단계 표시, 단계 시작 알림 창(두 사람 교대, 증원·피란민·뉴스), 명령 단계 진영만 명령,
    전투 결과·턴 정리 결과 패널, 요약에 날씨·예보·비축·승리 수준·뉴스, 종료 알림(끝내기/계속)
  - 지도 조작: 휠 확대는 이벤트 수가 아니라 스크롤량 비례(눈금 한 칸 약 1.13배, 고해상도 휠·터치패드도 같음),
    방향키를 누르고 있는 동안 부드럽게 이동(700px/초, Shift 1600px/초, `mapView.ts`의 `bindKeys`). 시나리오 선택 후 포커스를 지도로 돌려줌
- **보급** (`docs/rules/supply.md`, `src/engine/supply.ts`)
  - DETERMINE_SUPPLY 보급망(원작의 2회 양방향 열 스위프 그대로), REST_UP 재보급(유엔 차단 수준 UNIL, 서울 조건, 비축 소모,
    배수, 공중 보급 0x80, 보급 두절 장비 손실), 턴 시작 이동력 연결(STATUS 0x40)
  - 검증: 기본 시나리오의 부대 MOVE 값이 이 보급망으로 계산한 값과 일치(파일당 예외 최대 1개, 수동 편집 부대 제외)
  - 지도 "보급망" 레이어(끊긴 아군 헥스 빗금), 헥스 패널에 보급망 상태
- 추출기 수정: STOCKPILE은 [0] 공산, [1] 유엔 (예전 JSON의 un/communist가 뒤바뀜 있었음), FIRSTUNUNIT/LASTUNUNIT, UTILITY_SPACE 추가. **재추출 필요**

검증된 사실
- `NKPA 50/15 Inf Rgt` 전투력 계산 = 매뉴얼 부록 F 예시 (생존력 234, 살상력 418)
- 시나리오 날짜: 1950-06-25 / 1950-09-15 / 1950-11-22 / 1995-06-25
- 도로 연결 604/611, 철도 460/480 일치 (나머지는 도시·항구·지도 밖 연결)
- 턴 시작 이동력 공식이 korea2·3·4의 모든 부대 MOVE 값과 일치 (korea1은 전방 국군 6개 연대만 제작자가 수동으로 전량 이동력 부여)
- 보급망까지 넣으면 korea1 35/36, korea3 64/65, korea4 74/74 부대가 보급 여부까지 일치
- 승리 수준 기준점: korea1 유엔 905 − 공산 724 = 181 (TERRITORY_BALANCE 기준값과 같음)
- 날씨 생성 표 = 매뉴얼 6.4 표의 누적값, 보충량 = 매뉴얼 6.21 표(1995 국군 4개만 다름)
- TERRAIN 바이트 3·4 = 그 헥스 첫째·둘째 부대 선두 유닛 번호 (모든 시나리오에서 부대 위치와 일치)

아직 없음
- 항공 작전(AIR_OPERATIONS, DO_AIR_COMBAT, 공습·차단·요격; 지금은 파일의 항공대 임무로 UNIL만 계산), 해상·공수 이동(상륙 공격 포함),
  정보(안개) 화면 표시(엔진의 정찰 단계 계산은 있음, UI는 완전 정보), 옵션 화면(역량·개입·정보·플레이 모드), AI, 저장/불러오기,
  보고서 화면(전략 보고, 비행장·항구), 전체 한글화, 새 그래픽/사운드
- 컴퓨터 진영을 고르면 AI가 없어 그 진영 단계가 그냥 지나감 (기본은 두 사람 대전)

## 3. 폴더 구조

```
korea/                                   ← Aside Project 루트 / Git 저장소 루트 권장
  AGENTS.md                              AI 코딩 에이전트용 요약 규칙
  .gitignore                             원본·생성물 제외
  .agents/skills/conflict-korea-remake/  Aside가 자동으로 읽는 프로젝트 스킬
  Conflict-Korea-...-DOS_EN/confkorea/   원본 게임 파일 (KOREA.EXE, *.DAT, *.LBM) ※ 비공개
  Conflict-Korea-...-DOS_EN.zip          원본 압축 파일 ※ 비공개
  Conflict_-_Korea_-...pdf               원본 매뉴얼 (규칙과 공식의 기준) ※ 비공개
  remake/
    README.md                            실행 방법
    docs/HANDOFF.md                      이 문서
    docs/original-format.md              원본 포맷/역공학 결과
    docs/rules/movement.md               이동 규칙 (근거 주소, 매뉴얼과 다른 점, 리메이크 결정)
    docs/rules/combat.md                 지상전 규칙 (전투력, 돌파, 공격 명령, 전투 해결)
    docs/rules/turn.md                   턴 진행 (단계, 선공, 정리 단계, 날씨, 종료·승리, UTILITY_SPACE)
    docs/rules/supply.md                 보급 (보급망, 재보급, 비축, 보충·재편성)
    docs/places.md                       지명 판정 방법과 근거
    index.html, src/                     웹 클라이언트
      data/types.ts                      추출 JSON 타입
      data/places.ts                     지명 데이터(자체 제작, 공개 가능)과 헥스→위경도 보정
      engine/                            규칙 엔진 (DOM 금지, 헤드리스)
        state.ts                         GameState (유닛, 스택, 점령, RNG, 스냅샷/되돌리기)
        movement.ts                      이동 규칙·도달 범위·명령 실행
        combat.ts                        전투력·돌파·공격 명령·전투 해결
        supply.ts                        보급망·재보급·턴 시작 이동력
        turn.ts                          단계 진행·선공·새 게임·END_TEST·NEXT_TURN
        endturn.ts                       정리 단계 (증원·보충·중공군·기뢰·순찰·게릴라·정보·도시 뉴스·승리 수준)
        weather.ts                       달력·날씨 생성·예보·결빙선
        hex.ts, strength.ts              헥스 수학, 전투력(부록 F)
      i18n/ko.ts                         한글 용어집·번역 규칙
      ui/                                지도 렌더러(Canvas 2D, 이동 오버레이), 정보·명령 패널
      main.ts                            화면 연결, 이동 명령 컨트롤러
    tests/                               node:test 단위 테스트 (data/extracted 필요)
    tools/
      extract/                           원본 → data/extracted (JSON, PNG)
      disasm/                            dis.cjs (디스어셈블), strings.cjs (문자열)
      vendor/iced-x86/                   x86 디코더 (MIT, npm 패키지 그대로)
      dev-server.mjs, build.mjs          무설치 개발 서버, 정적 빌드
    data/extracted/                      생성물 (git 제외, 언제든 재생성)
    dist/                                빌드 결과 (git 제외)
```

## 4. 환경과 실행

필요: **Node.js 24 LTS 이상** (최소 22.18). npm 패키지 설치는 필요 없습니다. Git, VS Code 권장.

```
cd korea/remake
node tools/extract/extract.ts      # 원본 → data/extracted
node tools/disasm/strings.cjs      # UI 문자열 → data/extracted/ui_strings.json
node tools/disasm/dis.cjs --all    # 모듈별 어셈블리 → data/extracted/asm/
node tools/dev-server.mjs          # http://localhost:5173
node tools/build.mjs               # dist/ + dist/standalone.html
node --test --test-isolation=none "tests/**/*.test.ts"   # 단위 테스트 (npm test와 같음)
```

추출이 정상이면 다음 줄이 보여야 합니다.

```
check: NKPA 50/15 Inf Rgt survivability 234 (manual 234), lethality 418 (manual 418) -> OK
korea1: 25-June-1950 turn 0, 250 units (...)
korea4s: 25-June-1995 turn 0, 202 units (...)
```

### Aside(샌드박스) 안에서 실행할 때

- Node는 드라이브 루트 접근이 막혀 있어서 반드시 `node --preserve-symlinks --preserve-symlinks-main <스크립트>` 형태로 실행
- 루프백 네트워크가 막혀 개발 서버에 브라우저가 접속하지 못함 → `node tools/build.mjs`로 만든 `dist/standalone.html`을
  `openTab('about:blank')` 후 `document.open(); document.write(html); document.close()`로 띄워 검증
- 디버그 훅: 페이지에서 `window.__app.view` (지도 뷰), `window.__app.load(id)` (시나리오 로드),
  `__app.game`, `__app.orders`, `__app.click(x, y)`, `__app.hover(x, y)`, `__app.cancel()`, `__app.undo()` (마우스 조작 흉내),
  `__app.endPhase()` (확인 없이 단계 종료), `__app.banner`, `__app.closeBanner()`, `__app.bannerAction('end-game' | 'override')`.
  알림 창이 떠 있으면 지도 클릭이 막히므로 먼저 `closeBanner()`
- standalone 번들러(`tools/build.mjs`)는 `export { a }` / `export default` / `export *`를 처리하지 못함 → 선언 앞에 `export`만 쓸 것
  (어기면 standalone.html 전체가 구문 오류로 아무것도 안 뜨고 오류도 안 보임)
- REPL에서 `node <절대경로>` 스크립트는 되지만 `cd`는 권한 오류. 테스트 glob은 작업 폴더 기준 상대경로(`"korea/remake/tests/**/*.test.ts"`)
- `node --test`는 기본(프로세스 격리)으로 돌리면 샌드박스에서 멈춤 → `--test-isolation=none` 필수
- 루트는 `AsideWorkspace:\` PowerShell 드라이브로 보일 수 있고 `cd`는 권한 오류가 날 수 있음. 작업 폴더가 이미 remake면 그대로 실행

## 5. 코드 규칙

- TypeScript는 **지울 수 있는 문법만** 사용 (Node 내장 타입 제거로 실행하기 때문): `enum`, `namespace`, 생성자 매개변수 속성 금지
- 타입만 가져올 때는 `import type`, 상대 경로 import는 `.ts` 확장자까지 표기
- 런타임 의존성 없음. 새 라이브러리가 꼭 필요하면 이유를 이 문서에 기록
- `src/engine/`은 DOM을 쓰지 않는 순수 로직 (나중에 Node에서 테스트·AI 자가대전)
- 화면에 보이는 문자열은 모두 `src/i18n/ko.ts`를 거침
- 웹 코드는 원본 바이너리를 직접 읽지 않고 `data/extracted`의 JSON만 사용
- 좌표: 위아래가 평평한 헥스, 짝수 열이 반 칸 아래(even-q). 방향 비트 N=1, NE=2, SE=4, S=8, SW=16, NW=32
- 원본 파일과 추출 데이터는 커밋 금지 (.gitignore 처리됨)

## 6. 역공학 작업 방법

1. 기능과 관련된 원본 프로시저를 찾는다: `data/extracted/symbols.json`의 `procedures` (모듈, 이름, 주소, 길이)
2. 디스어셈블을 읽는다: `node tools/disasm/dis.cjs MOVE_COST` 또는 `data/extracted/asm/<모듈>.asm`
   - 전역변수 접근은 `[FREEZE_LINE]`, `[TERRAIN + reg]`처럼, 호출은 `EURSUBS1.OCEAN_ADJACENT`처럼, 문자열은 `"..."`로 주석이 붙음
   - **중첩 프로시저는 심볼이 없다.** Turbo Pascal은 중첩 함수를 부모 앞에 두므로 바로 앞 프로시저의 길이에 섞여 보인다
     (예: CAN_ENTRAIN 11222바이트 안에 MOVE_UNIT의 이동 루프 전부). `push bp; call XXXXh`로 부르고 `[bp+4]`로 부모 프레임을 읽음.
     모듈 첫 프로시저 앞 구간은 `(unnamed before X)`로 나오며 `--at <모듈> <시작hex> <끝hex>`로 임의 구간을 볼 수 있다
   - 유닛 i의 필드 주소 = 0x7BF + 0x47·i + 필드 오프셋 (주석이 `ROUTE+471h`, `R+dh`처럼 엉뚱하게 붙음: 7BF SYMBOL, 7EC STATUS, 7ED READINESS, 7EF MOVE, 7F1 ATTACHED, 7F3 MAP_X, 7F5 MAP_Y)
3. 매뉴얼의 해당 절(부록 F 공식 포함)과 대조한다
4. 결론을 `docs/rules/<주제>.md`에 공식·조건·근거(프로시저 주소, 매뉴얼 절)와 함께 기록한다
5. 엔진에 구현하고, 매뉴얼 예시나 원본 데이터로 단위 테스트를 만든다

기능별 주요 프로시저

| 기능 | 프로시저 |
|---|---|
| 이동 | MOVEUNIT.MOVE_COST, MOVE_UNIT, OVERRUN, BUGOUT, AMPHIBIOUS, CAN_ENTRAIN, UNIT_ATTRITION, NEAR_THE_FRONT / EURSUBS1.NATIONAL_MOVEMENT_RATE, ENEMY_ADJACENT, TERRAIN_HELD |
| 지상전 | GRCMBT.DO_GROUND_COMBAT, CHECK_ELIM, NAVAL_GUNS, ELIMINATE_UNIT / EURSUBS1.GET_STRENGTH, GET_FORCE_STRENGTH |
| 항공 | OPSSUBS.AIR_OPERATIONS, EFFECTIVE_STRENGTH, DETERMINE_INTERDICTION, DETERMINE_INTERCEPTION, CHOOSE_BASES / AIRCMBT.DO_AIR_COMBAT |
| 보급 | SUPPLY.DETERMINE_SUPPLY, REST_UP |
| 턴 진행 | KOREA.PHASE_PULSE, PLAYER_PHASE / ENDTURN.NEXT_TURN, GROUND_REINFORCEMENTS, DO_INTEL, DO_PATROLS, MINE_WARFARE, CHECK_CHINA, GAME_OVER |
| AI | WARRIORS.KIM (공산), WALTON (유엔) / AISUBS.* |

원본 게임을 직접 돌려 비교하려면 DOSBox-X를 설치해 `confkorea/KOREA.EXE`를 실행하세요 (디버거로 메모리 덤프 가능).

## 7. 다음 작업: 항공 작전

목표: 항공대에 임무(제공권 0, 지상 공격 1, 차단 2)를 주고, 기지 배치·날씨 약화를 거쳐 전투 단계(PHASE 2)에서
제공권·차단 수준·공습을 원작 공식대로 해결. 지금 `turn.ts`의 PHASE 2는 FORCE_SPOTTING 다음 바로 지상전이고,
UNIL은 파일에 저장된 항공대 임무로만 계산한다 (`supply.ts`의 `interdictionLevel`).

1. 규칙 확정 → `docs/rules/air.md`
   - OPSSUBS.AIR_OPERATIONS(임무 화면, Projections), EFFECTIVE_STRENGTH(해독 완료: 하늘 코드, 전천후 −1, 기지 0이고 단거리면 ×2),
     DETERMINE_INTERDICTION, DETERMINE_INTERCEPTION, CHOOSE_BASES(비행장 등급 1 프로펠러 1개, 2 아무거나 1개, 3 두 개, 지원 구역)
   - AIRCMBT.DO_AIR_COMBAT: 제공권(1950년대 RED_AIR·미그 앨리, 1995 부록 F 식), INTERCEPTION/INTERDICTION DUAL 값, 공습 목표 선택과 손실
     ("players are given the opportunity to manage airstrikes ordered earlier", 매뉴얼 4.1~4.13), `CCF + 6 > TURN` 조건
   - 항공대 등장·철수(ENTRY/EXIT_TURN, 부록 H), NEXT_TURN 중첩 `1002`~`1197`("air force has been neutralized" 뉴스)와
     NEXT_TURN `11c0`의 1995 항공대 표시 호출 `1023`
   - REALITY[2](항공 작전 플레이어/프로그램 제어로 추정) 확정
2. 엔진: `src/engine/air.ts` (임무·기지·약화·제공권·차단·공습), `turn.ts` PHASE 2에 연결, 철도 차단(`railMove`)·UNIL이 새 값을 쓰도록
3. UI: 항공 작전 패널(항공대 목록, 임무 전환, 예상치), 전투 단계 공습 목표 지정, 결과 보고
4. 이어서: 해상·공수 이동(규칙은 movement.md 3.5, SEALIFT_DEMAND는 이미 정리 단계가 청구) → 정보(안개) 화면:
   정찰 단계로 적 부대 감추기, 되돌리기 제한, MOVE_UNIT `3a26`(공산군 12점 초과 이동 정찰), LOSS_INFLATOR → 옵션 화면 → 저장 → AI

## 8. 미해결 질문

- STATUS 0x10의 정확한 의미 (지상전이 해제하고 0x20을 설정). 나머지는 확정: 0x01 재보급, 0x02 후퇴, 0x04 이동, 0x08 제거, 0x40 준비도 75+, 0x80 공중 보급
- SCENARIO[1], [4], [7], REALITY[1]·[3], 점령값 3 (쓰는 코드 없음), UTILITY_SPACE[9](MOVEUNIT `23e8`)
- AIR_UNIT_TYPE.BASE 값 (0 = 일본으로 추정) → 항공 작업 때 확정
- TERRITORY_BALANCE의 중국 미개입 제한이 24턴(`384a`)에서만 걸리는데 END_TEST의 미개입 종료는 26턴: 원작 버그인지 의도인지 (지금은 원작대로)
- korea3 부대 205(미 2사단 9연대, 9,24)의 파일 MOVE가 보급망 계산과 다름: REST_UP 뒤 순찰·게릴라로 바뀐 점령인지 수동 편집인지 미확인
- 이동 중 버그아웃(`3070`)이 비교하는 두 헥스가 정확히 "출발·도착"인지 (MOVE_UNIT 프레임 `[di-12h]`/`[di-14h]`, 지금은 매뉴얼대로 두 헥스)
- 38선과 미그 앨리 표시 데이터의 위치
- 기본 DAT와 S DAT: 둘 다 새 게임으로 읽힌다(LOAD_NEW_GAME이 UTILITY_SPACE[11]을 0으로). S는 사단 단위 편성에 시작 시점의 이동·공격 명령이 미리 들어 있음(korea1s 북한군 공격 계획 등)
- 밀집 지역 부대 마커 겹침 (UI 개선 과제)

## 9. 참고 자료

- 원본 매뉴얼 PDF (korea 폴더). 부록 F 공식, 부록 C 전투서열, 부록 G 지도 좌표
- `docs/original-format.md`
- TDInfo 구조: https://github.com/ramikg/tdinfo-parser
- 공개 사료 (공개 배포용 데이터를 새로 만들 때): 미 육군 공간사 Appleman 『South to the Naktong, North to the Yalu』,
  미 의회도서관 AMS 1:250,000 한국 지도
