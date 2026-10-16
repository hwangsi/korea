# 인계 문서 (HANDOFF)

새 환경이나 새 AI 세션에서 작업을 이어갈 때 **가장 먼저 읽는 문서**입니다.
작업을 마칠 때마다 2장(현재 상태)과 7장(다음 작업)을 갱신하세요.

- 마지막 갱신: 2026-10-16 저녁, 노트북(C:\Users\hwang\AIprojects\korea). 이동 시스템, 지명, 지상전 완료 (테스트 22개 통과, 사용자 브라우저 테스트 완료)
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

검증된 사실
- `NKPA 50/15 Inf Rgt` 전투력 계산 = 매뉴얼 부록 F 예시 (생존력 234, 살상력 418)
- 시나리오 날짜: 1950-06-25 / 1950-09-15 / 1950-11-22 / 1995-06-25
- 도로 연결 604/611, 철도 460/480 일치 (나머지는 도시·항구·지도 밖 연결)
- 턴 시작 이동력 공식이 korea2·3·4의 모든 부대 MOVE 값과 일치 (korea1은 전방 국군 6개 연대만 제작자가 수동으로 전량 이동력 부여)
- TERRAIN 바이트 3·4 = 그 헥스 첫째·둘째 부대 선두 유닛 번호 (모든 시나리오에서 부대 위치와 일치)

아직 없음
- 턴 진행, 보급, 항공, 해상·공수 이동(상륙 공격 포함), 정보(정찰), AI, 뉴스, 옵션 화면(공산군 역량 등), 전체 한글화, 새 그래픽/사운드
- 지금은 턴 구분이 없어 양쪽 부대를 모두 움직이고 "전투 해결"을 여러 번 누를 수 있음 (샌드박스)

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
    docs/places.md                       지명 판정 방법과 근거
    index.html, src/                     웹 클라이언트
      data/types.ts                      추출 JSON 타입
      data/places.ts                     지명 데이터(자체 제작, 공개 가능)과 헥스→위경도 보정
      engine/                            규칙 엔진 (DOM 금지, 헤드리스)
        state.ts                         GameState (유닛, 스택, 점령, RNG, 스냅샷/되돌리기)
        movement.ts                      이동 규칙·도달 범위·명령 실행
        combat.ts                        전투력·돌파·공격 명령·전투 해결
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
  `__app.game`, `__app.orders`, `__app.click(x, y)`, `__app.hover(x, y)`, `__app.cancel()`, `__app.undo()` (마우스 조작 흉내)
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

## 7. 다음 작업: 지상전 (공격 계획 → 전투 해결)

목표: 이동 중 적 부대 헥스(지금 빨간 점선)를 클릭하면 돌파(OVERRUN)를 판정하거나 공격 계획을 세우고,
예상 손실비를 보여주며, 전투 단계에서 원작 공식대로 해결.

1. 규칙 확정 → `docs/rules/combat.md`
   - 공격 계획: MOVE_COST가 돌려주는 100 → MOVE_UNIT 중첩 코드 `1915:40c6` 이후 (최소 6점, `MOVE += 방향코드×100 + 5`, 공격 비용 1,
     방향코드 함수 `1915:2075`, 보고 문구 "Force will attack to ..." `1915:2170`). CLEAR_PLOTS와 이미 맞물림 (`movement.ts`의 `clearPlots`)
   - OVERRUN `1915:0733`(실제 본문은 `0b57` 앞까지, 뒤는 MOVE_COST 중첩 함수), 매뉴얼 부록 F "OVERRUNS"
   - GRCMBT.DO_GROUND_COMBAT, CHECK_ELIM, NAVAL_GUNS, ELIMINATE_UNIT / EURSUBS1.GET_STRENGTH, GET_FORCE_STRENGTH (지형 효과 4.24, 참호 4.23, 후퇴·붕괴, 버그아웃 5.2)
   - STATUS 0x10/0x20 (GET_STRENGTH가 설정), 0x08, 0x80의 의미도 이때 확정
2. 엔진: `src/engine/combat.ts` (전투력 합산, 손실 계산, 후퇴 경로는 `movement.ts`의 `stepCost`/`enemyAdjacent` 재사용), 난수는 `state.ts`의 `rnd`
3. UI: 도달 범위 옆 적 헥스 클릭 → 공격 계획 화살표(원작처럼), 패널에 예상치, 계획 취소
4. 이어서: 턴 루프(PHASE_PULSE: 1차 명령 → 전투 → 2차 명령 → 정리, 선공 공식) → 보급(DETERMINE_SUPPLY + `turnStartMove` 연결)
   → 항공 → 해상·공수 이동(규칙은 movement.md 3.5에 이미 정리) → 정보(정찰 단계, 되돌리기 제한) → AI

## 8. 미해결 질문

- UNIT_TYPE.STATUS: 0x01 재보급됨, 0x04 이번 턴 이동함, 0x40 준비도 75 이상(미이동)은 확인. 0x08, 0x10, 0x20, 0x80은 미확정
- TERRAIN 바이트 2: 정찰 단계(0~2)로 보이며 REST_UP 중에는 보급 상태(진영 코드)로 잠시 쓰이는 것으로 추정 (정보·보급 작업 때 확정)
- SCENARIO[1], [4]~[7], 점령값 3의 의미 (ENEMY_ADJACENT가 예외 처리하지만 데이터에는 없음)
- 증원부대 도착 시점·위치 인코딩 (MAP_X 음수)
- 38선과 미그 앨리 표시 데이터의 위치
- REPLACEMENTS 2바이트, AIR_UNIT_TYPE.MISSION/BASE 값의 의미
- 기본 DAT와 S DAT의 정확한 용도 차이 (S는 사단 단위 편성 + 날씨 초기화 상태)
- 밀집 지역 부대 마커 겹침 (UI 개선 과제)

## 9. 참고 자료

- 원본 매뉴얼 PDF (korea 폴더). 부록 F 공식, 부록 C 전투서열, 부록 G 지도 좌표
- `docs/original-format.md`
- TDInfo 구조: https://github.com/ramikg/tdinfo-parser
- 공개 사료 (공개 배포용 데이터를 새로 만들 때): 미 육군 공간사 Appleman 『South to the Naktong, North to the Yalu』,
  미 의회도서관 AMS 1:250,000 한국 지도
