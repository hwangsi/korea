# 인계 문서 (HANDOFF)

새 환경이나 새 AI 세션에서 작업을 이어갈 때 **가장 먼저 읽는 문서**입니다.
작업을 마칠 때마다 2장(현재 상태)과 7장(다음 작업)을 갱신하세요.

- 마지막 갱신: 2026-10-17 (오후), 노트북(C:\Users\hwang\AIprojects\korea). **작은 남은 과제 일괄 완료**: 중공군 첫 참전 뉴스, 표시 전투력 통일,
  진행 속도·이동 따라가기(+이동 애니메이션), 밀집 지역 마커 겹침, 한글화 마무리, 원작 .SAV 변환기. 테스트 109개 통과.
  **사용자 결정: 개선판 AI는 맨 마지막 과제.** 남은 것은 7장(원본 게임 비교, 새 그래픽, 그다음 개선판 AI)
  (같은 날 앞서 유엔군 컴퓨터 WALTON, 부대 편성 화면 FULL_HEX 완료)
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
- **산·호수** (`docs/places.md` "산과 호수", `places.ts`의 `NATURAL_FEATURES`): 원작 산악 헥스 43개·저수지 5개 전부에 실제 산·호수 이름과 해발(GeoNames),
  백두산, 전체 보기용 산맥·고원 이름 5개. "산·호수" 레이어, 헥스 패널. `hexToLatLon`에 북부 국소 보정 추가
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
  - 지도 조작: 더블클릭 확대는 없음(같은 헥스 두 번 클릭으로 이동·공격을 확정하면 브라우저가 dblclick도 보내 확대가 한 단계 올라가던 버그),
    휠 확대는 이벤트 수가 아니라 스크롤량 비례(눈금 한 칸 약 1.13배, 고해상도 휠·터치패드도 같음),
    방향키를 누르고 있는 동안 부드럽게 이동(700px/초, Shift 1600px/초, `mapView.ts`의 `bindKeys`). 시나리오 선택 후 포커스를 지도로 돌려줌
- **보급** (`docs/rules/supply.md`, `src/engine/supply.ts`)
  - DETERMINE_SUPPLY 보급망(원작의 2회 양방향 열 스위프 그대로), REST_UP 재보급(유엔 차단 수준 UNIL, 서울 조건, 비축 소모,
    배수, 공중 보급 0x80, 보급 두절 장비 손실), 턴 시작 이동력 연결(STATUS 0x40)
  - 검증: 기본 시나리오의 부대 MOVE 값이 이 보급망으로 계산한 값과 일치(파일당 예외 최대 1개, 수동 편집 부대 제외)
  - 지도 "보급망" 레이어(끊긴 아군 헥스 빗금), 헥스 패널에 보급망 상태
- 추출기 수정: STOCKPILE은 [0] 공산, [1] 유엔 (예전 JSON의 un/communist가 뒤바뀜 있었음), FIRSTUNUNIT/LASTUNUNIT, UTILITY_SPACE 추가 (재추출 완료)
- **항공 작전** (`docs/rules/air.md`, `src/engine/air.ts`, `tests/air.test.ts` 13개)
  - 규칙: OPSSUBS 전부(STARTFINISH, UNIT_AVAILABLE, EFFECTIVE_STRENGTH, GROUND_ATTACK_STRENGTH, DETERMINE_INTERDICTION/RED_AIR/INTERCEPTION,
    CHOOSE_BASES, AIR_OPERATIONS의 화면·예상치)와 AIRCMBT의 중첩 프로시저 전부(자동 임무 `0294`, 차단 효과 `0051`, 1995 제공권 손실 `1c7a`,
    공습 진행 `1a84`, 목표 선택·해결 `0b8e`, 해병 인접 `0916`), NEXT_TURN `1023` 1995 공군 무력화. BASE 0 일본/1 한국/2 항모,
    REALITY[2] = Air Campaign Player Control, 미그 앨리 x < 15·y < 27, UTILITY_SPACE[12]·[13] 확정. 매뉴얼과 다른 점 8가지 기록
  - 엔진: 전투 단계 = FORCE_SPOTTING → DO_AIR_COMBAT(`beginAirCombat`/`continueAirCombat`) → 지상전. 사람이 고를 공습이 있으면
    `airstrikes` 이벤트로 멈추고(GameState.air), `flyAirstrike`/`delegateAirstrikes` 뒤 `endPlayerPhase`로 이어짐. INTERDICTION은 매 턴 전투 단계에서
    다시 계산되어 철도 차단에 쓰이고, REST_UP의 UNIL은 임무·기지가 바뀐 항공대로 계산. GameState에 interception, airPlayerControl, air 추가
  - UI: 상단 "✈ 항공"(1차 명령 단계) → 항공대 목록(한글 부대명·기종·기지·장거리·전천후·활주로, 약화 반영 전력), 임무 버튼 3개,
    예상치(공습 가능·차단 수준·공산 요격 수준 이번/다음 턴 또는 1995 제공 전력), 증원·철수 예정. 전투 단계: 공습 알림 창 → 지도에서 적 헥스 클릭
    (마우스 오버 시 살상률, 조준선), "컴퓨터가 목표 선택"·"남은 공습 모두 맡기기", 결과 목록, 지도 폭발 표시, "지상전으로 ▶".
    1950년대는 미그 앨리 경계(보라색 점선). 전투 결과 패널 위에 항공 결과, 요약에 유엔 차단 수준·공산 요격(또는 차단) 수준, 항공 뉴스 한글화
- **해상·공수 이동** (`docs/rules/naval.md`, `src/engine/naval.ts`, `tests/naval.test.ts` 6개)
  - 규칙: AMPHIBIOUS(+중첩 `19a0` 출발 수송 점수), UNIT_COCKED, MOVE_UNIT 모드 시작(`46fd`~, SYMBOL 81/82, 수요 가산, 해안 승선 선두 BUGOUT),
    MOVE_COST 해상·공수 분기(거리 무관, 기뢰 항구, "Come ashore" = 비용 한도로 이동 종료, 육지→육지 불가), 한 걸음 처리(`3848` 바다 MOVE 0,
    `3a8f` 공수 헥스 건너뛰기), 멈춤 `2536`(바다에서 못 멈춤), 상륙 공격 `23f2`/`22e3`(UTILITY_SPACE[9] = 턴당 상륙 공격 명령 수, 2개까지),
    이동 끝 `44fd`(항구 상륙 수요 −1), 낙하 손실 `2645`, 적 부대 위 낙하 `274d`/`24a1`(MOVE 24라 OVERRUN이 늘 실패 → 전멸),
    GRCMBT 바다 위 공격 부대 `0105`, 일본 철수 `1e11`, 전진 `2458`/`2e7f`. 매뉴얼과 다른 점 7가지 기록(항구→항구는 턴당 3개, 2차 단계 공수 가능 등)
  - 엔진: `stepCost`에 'sea'/'air' 모드, `cannotMove`의 'atSea'. `naval.ts`: seaMoveBlock/seaReach/seaMove/seaAssaultPreview/seaAssault,
    airMoveBlock/airReach/airDrop/airdropLoss(Parts), orderReach/defaultMode. `combat.ts`: atSea, evacuateToJapan, advanceInto,
    estimateCombat(from), 바다에서 낸 공격 명령 취소 불가
  - UI: 이동 명령 카드에 모드 4개(일반·철도·해상·공수, 안 되는 모드는 이유 툴팁), 해상: 상륙 헥스 청록색·바다는 통과,
    승선→해상→상륙 경로와 수송 점수, 적 해안 클릭 = 상륙 공격 미리보기(출발 바다 헥스, 예상 전투, 돌파 가능, n/2).
    공수: 보라색 범위, 낙하 손실률과 내역(지형·흐림·미그 앨리), 적 부대 헥스 전멸 경고, 미그 앨리 경계 표시.
    바다 위 부대는 선택하면 바로 해상 모드, 지도 말에 배 배지. 전투 결과에 "상륙 실패: 일본으로 철수"·"전진"

- **정보(안개)** (`docs/rules/intel.md`, `src/engine/intel.ts`, `src/engine/spotting.ts`, `tests/intel.test.ts` 9개)
  - 규칙: SHOW_HEX(정찰 0이고 적 점령인 헥스의 부대만 숨김, 1과 2는 지도에서 같음), UNIT_INFORMATION(적 헥스: 정찰 1 "Enemy Infantry",
    2 부대 이름 + understrength/full strength), IDENTIFY_UNIT, 보는 쪽(컴퓨터 단계면 사람 쪽). **STATUS 0x10 = 이번 턴 전력 보고 거짓**(GET_STRENGTH
    모드 3이 처음 볼 때 0x20 + 1/3로 0x10, 지상전이 0x10 해제, 거짓이면 항상 "완편"). 이동 중 CHEK_HEX(들어간 헥스 주변 적 부대 정찰 1),
    공산군 12점 규칙(`RND(1,4) > 하늘`, movement.md의 부등호가 반대였던 것 정정), 후퇴 헥스 주변 +1(GRCMBT `14b3`), 되돌리기 제한
    NEAR_THE_FRONT(x, y, −PLAYER). LOSS_INFLATOR는 쓰기만 하고 EXE 어디서도 읽지 않음(매뉴얼의 "보고 과장" 미구현). 매뉴얼과 다른 점 5가지
  - 엔진: `viewerSide`, `forceIntel`/`knownForces`/`hexIntel`, `strengthReport`/`misreported`(게임 난수 대신 시드·턴·선두 해시, GameState.intelSeed),
    `perceivedState`(숨은 적 부대를 뺀 상태: 이동 범위 계산용), `dropRisk`. `moveForce`: 새 적을 발견하면 그 걸음에서 멈춤(`interrupted:'revealed'`),
    다음 헥스에 숨은 적이 있으면 앞에서 멈추고 정찰 1(`'bumped'`, 첫 걸음이면 `error:'enemyFound'`). `seaMove`: 상륙 헥스에 숨은 적이면 `enemyFound`
  - UI: 상단 "정보 제한 / 완전 정보"(기본 제한, 바꾸면 확인 후 새 게임). 지도: 숨은 적 없음, 정찰 1은 기호와 "?", 2는 편제와 "완편/약화",
    두 사람 대전의 교대 알림 창 동안 부대 안 그림, 명령 단계의 공격 화살표는 자기 것만, 적 부대 흐림(이동력 소진) 없음. 헥스 패널: 정찰 단계 줄,
    적 부대 카드(종류/이름·완편 여부, 유닛 목록 없음). 공격·상륙 공격 미리보기: 적 전력·예상 손실·후퇴·돌파 여부 감춤.
    공수: 정찰 0 적 점령지면 "숨어 있으면 전멸". 요약의 적 유닛 수 "?". 이동 메시지 "적 부대 발견"

- **새 게임 옵션** (`docs/rules/options.md`, `src/engine/options.ts`, `src/ui/newGame.ts`, `tests/options.test.ts` 5개)
  - 규칙: SCENARIO_DISPLAY/S_DATA/LOAD_NEW_GAME(`49a2` 기본값·메뉴 호출, `46fd` 입력 루프). 메뉴 값은 SCENARIO[0..7]·REALITY[1..4]의 지역 사본.
    원작 기본값: 용이 깨어나다, Historical, Challenging, **UN Solitaire**, Player Control, Limited. Random 역량은 시작 때 RND(1,5).
    **UN Solitaire(컴퓨터가 공산군)면 편성 배치판 koreaNs.dat**를 읽음. 개입 줄은 차가운 강철 "In progress", 1995 "Not allowed".
    1950년대 Red Solitaire는 항공이 "Program Control"로 보임. REALITY[1]은 늘 참(거짓이면 메뉴 세 칸이 "..."), [3]은 읽는 코드 없음.
    LOAD_NEW_GAME 끝의 `2b41`은 문서 확인(복사 방지)
  - 엔진: `GameOptions`, `ORIGINAL_DEFAULTS`/`REMAKE_DEFAULTS`(플레이 방식만 두 사람), `scenarioFileId`/`optionsForFile`, `ccfStatus`, `airShownAsProgram`,
    `toStartOptions`. `startNewGame`의 competence 6 = 무작위
  - UI: 처음 열면 새 게임 대화 상자(뒤에는 기본값 게임). 시나리오 카드 4장 + 개입·역량·플레이 방식·항공·정보 버튼, 고급(데이터: 자동/기본판/편성 배치판과 읽을 파일),
    Enter 시작·Esc 닫기. 상단은 "새 게임" 버튼 + 시나리오 이름. 요약 카드에 현재 설정 줄(원작 Scenario Info). 컴퓨터 진영이 있으면 교대 문구 없음
  - 기본 플레이 방식은 이제 원작과 같은 **UN Solitaire**(컴퓨터 공산군 KIM, 편성 배치판). 컴퓨터가 들어가면 "컴퓨터 AI: 원작 / 개선판(준비 중)" 줄

- **저장/불러오기** (`docs/rules/save.md`, `src/engine/save.ts`, `src/ui/saveDialog.ts`, `tests/save.test.ts` 3개)
  - 원작: 명령 단계 메뉴에서만(DO_ITEM 1Eh → GAME_SAVE `0a3a` → SAVE_GAME `1ee0`, 전역 영역 덤프). 불러오면 주 루프가 GOTO_SECONDPHASE·GOTO_PLAYERPHASE·SAVEORDER로
    저장한 플레이어의 명령 단계를 다시 시작(선공 재판정 없음, FORCE_SPOTTING 한 번). 난수 상태는 저장 안 함
  - 엔진: GameState를 통째로 JSON(Map·Uint8Array 태그, hexes·장비표·undo 제외, 형식 버전 1, 옵션·요약 포함). `saveBlocked`(명령 단계만),
    `saveGame`/`parseSave`/`loadGame`/`resumeGame`. **rng·intelSeed까지 저장**해 불러온 게임이 안 불러온 게임과 똑같이 진행(테스트). GameState에 필드를 더하면 자동으로 저장됨
  - UI: 상단 "저장" → 저장·불러오기 대화 상자(자동 저장 + 슬롯 5개, 덮어쓰기·지우기 확인, .json 내려받기·올리기). 새 게임 대화 상자에 "저장한 게임 불러오기".
    자동 저장은 사람의 명령 단계가 시작될 때마다(페이지를 열 때 뒤에 뜨는 기본 게임은 저장 안 함). 브라우저 저장소 키 `conflict-korea-remake/save/<auto|1..5>`

- **컴퓨터 플레이어** (`docs/rules/ai.md`, `src/engine/ai/`, `tests/ai.test.ts` 13개)
  - 원작 KIM(WARRIORS `29df`~`2c30` + 중첩 `0000`~`29de`)과 AISUBS 전부, 공용 경로 행군(`0278`)·경로 찾기(`0605`)·침공 경로 ROUTE(유닛 초기화 `5e4a`),
    REPORTS.SORT_FORCE, CLEAR_PLOTS 컴퓨터 분기를 해독해 그대로 옮김. 난수 호출 순서 일치, 같은 시드면 같은 게임
  - 구조: `ai/types.ts`(AiLevel 'original'|'improved', ComputerPlayer, AiReport), `ai/index.ts`(등록부 COMPUTER_PLAYERS, computerOrders),
    `ai/common.ts`(AISUBS·경로·합치기·MOVE_COST 적 분기의 돌파, **진영 무관**이라 WALTON·개선판이 재사용), `ai/kim.ts`(KIM)
  - 턴 진행: `advancePlayer`가 컴퓨터 차례에 `computerOrders` → `computerPhase` 이벤트(보고 포함). 첫 단계에 사람 차례가 없으면 `startNewGame`·`continuePastEnd`가
    다음 사람 단계까지 바로 진행. `combat.ts`에 `rollOverrun`(MOVE_COST 적 분기 OVERRUN) 분리, `endturn.ts`의 `strongNeighbour` export
  - 화면: 단계 알림 창에 "컴퓨터(공산군) 1차 명령 단계: 부대 N개 이동, 공격 M건 계획", 합친 수, 개막 알림(위치는 숨김)
  - **유엔군 WALTON**(`ai/walton.ts`, ai.md 8장): 본문 `5cf5`, 드라이버 `5b63`(군 2·3 × 패스 3회, 공세 여부 `5b3a` = 10 < TURN < 개입 턴),
    목표 `3c54`(점수·시나리오 스크립트 전부, 지형 끼임 17곳, 포위 후퇴 = 둘째 차례(`orderStep` 1) 또는 2차 단계), 상륙 `38ca`/`3828`/`3787`
    (216이 일본에 있으면 70% 인천, 70% 군산, 215·216 순간이동 또는 앞바다에서 공격 계획), 일본 수송 `39c9`, 순간이동·합치기·이름 `3b0e`,
    공격 계획 `53e9`(무작위 취소 없음, 바다 위 부대 제외), 합치기 `34fc`/`329b`/`2c85`(사단 이름, 1995 국군 군단 번호 UTILITY_SPACE[17], IV 건너뜀).
    WALTON은 개막 턴도 건너뛰지 않음. 게임 상태 밖 기억 없음(저장·불러오기 뒤 똑같이 진행, 테스트). 새 게임 대화 상자 "공산군으로"의 AI 없음 경고가 사라지고
    "컴퓨터 AI" 줄에 WALTON 설명(`OPTIONS_UI_KO.aiHint(player)`)

검증된 사실
- `NKPA 50/15 Inf Rgt` 전투력 계산 = 매뉴얼 부록 F 예시 (생존력 234, 살상력 418)
- 시나리오 날짜: 1950-06-25 / 1950-09-15 / 1950-11-22 / 1995-06-25
- 도로 연결 604/611, 철도 460/480 일치 (나머지는 도시·항구·지도 밖 연결)
- 턴 시작 이동력 공식이 korea2·3·4의 모든 부대 MOVE 값과 일치 (korea1은 전방 국군 6개 연대만 제작자가 수동으로 전량 이동력 부여)
- 보급망까지 넣으면 korea1 35/36, korea3 64/65, korea4 74/74 부대가 보급 여부까지 일치
- 승리 수준 기준점: korea1 유엔 905 − 공산 724 = 181 (TERRITORY_BALANCE 기준값과 같음)
- 날씨 생성 표 = 매뉴얼 6.4 표의 누적값, 보충량 = 매뉴얼 6.21 표(1995 국군 4개만 다름)
- TERRAIN 바이트 3·4 = 그 헥스 첫째·둘째 부대 선두 유닛 번호 (모든 시나리오에서 부대 위치와 일치)

- **보고서 화면** (`docs/rules/reports.md`, `src/engine/reports.ts`, `src/ui/reports.ts`, `tests/reports.test.ts` 3개)
  - 원작: 전략 보고(REPORTS `2f75`: 점령 헥스·비축·항공 수준은 양쪽 모두, 보충 풀과 중공군 개입 상태는 PLAYER 쪽만, 최근 소식 8줄),
    비행장·항구(`0356`, 배열 순서 고정 이름), 날씨(`3699`, PLAYER의 예보 행 + 실제 날씨 효과), 시나리오 정보(`0010`, S_DATA),
    보급망 표시(DETERMINE_SUPPLY(TRUE)), 전략 개관(EURSUBS1 `4421`, **38선은 36·37행 사이 직선으로 코드에 박혀 있음**). 모두 난수 없음·상태 변화 없음
  - 화면: 상단 "보고서" → 탭 5개(모달). 전략 개관은 미니맵(지형·부대 / 보급망 모드), 헥스 클릭 → 지도 이동. 점령 점수·승리 수준은 "리메이크 추가"
- **배경 음악·효과음** (`docs/audio.md`, `src/audio/`, `src/ui/soundPanel.ts`, `tests/audio.test.ts` 3개)
  - ABC 악보 읽기 → 행진 악대 편곡(FM 금관, 리드, 쿵짝 베이스·화음, 북) → Web Audio 합성. 파일 없이 합성, 효과음 24가지
  - 곡: 인터내셔널가, 보기 대령 행진곡, 포차는 굴러간다(저작권 만료, 저장소에), 6.25의 노래(저작권 있음 → `data/private/music.json`, git 제외)
  - 상단 "♪": 음악·효과음 켜기/끄기·음량, 메들리/진영별/한 곡. 설정은 브라우저 저장소. 첫 클릭 때 오디오 시작

- **부대 편성** (`docs/rules/forces.md`, `src/engine/forces.ts`, `src/ui/organize.ts`, `tests/forces.test.ts` 9개)
  - 원작: 헥스 메뉴(UNIT_INFORMATION, 자기 점령 헥스) "Report" → REPORTS.FULL_HEX `2c3c`, 중첩 `0a36`~`2c3b` 전부 해독. 옮기기 `232c`: 두 부대 **선두의 국적 묶음**
    (0~3 함께, 국군·북한·중공 각자), 받는 부대 6개·(보병이면) 보병 4개, 공격 계획 부대엔 이동력 6(둘 다 계획이고 MASK(유닛) ≥ MASK(선두)면 무조건 허용, sic),
    스미스 부대는 받지 않음, 바다 불가. 실행: 떼어 낸 유닛 NAME1 := NAME + '+' (`218d`), 합류는 받는 선두 MOVE를 받고 **더 쓴 이동력만큼 부대 전체 MOVE +**
    (공격 계획 −5/+1 보정), SORT_FORCE, 빈 첫째 칸 정리(`2888`). **스미스 특수임무부대(이름에 "Smith")는 첫 보병 유닛에 장비 1·2번 칸을 더하고
    (0,2)·STATUS 8**(korea2·3 파일의 (0,1)/(0,2)와 같은 처리). 이름 `203d`: 유닛 2개 이상, 20자, 끝 공백 제거. +Hex/−Hex: 열 단위 순회
  - 엔진: `organizeBlock`, `nextOrganizeHex`, `hexSlots`, `forcePresence`, `hexModifiers`, `transferCheck`(허용·이유·종류 split/join/merge·이동력 손실·공격 합류/취소),
    `transferUnit`, `canRename`, `renameForce`. 옮기면 `g.undo = null`, 이름은 되돌리기 저장본에도 반영. `combat.ts`의 `isClosed`·`isRiverCode` export
  - UI: 헥스 패널 "부대" 제목 옆 "편성"(명령 단계·사람 차례·자기 점령 헥스) → 모달: 지형 보정 3개, 두 부대 나란히(살상-생존·평균 준비도·남은 이동력+공격 계획),
    유닛마다 "부대 2로 →"/"← 부대 1로"/"새 부대로"(안 되면 꺼지고 짧은 이유, 되면 효과 줄), 이름 바꾸기(입력란 Enter/Esc), ◀ 이전/다음 헥스 ▶, Esc 닫기.
    닫으면 그 헥스가 선택된 상태(이동 명령은 다시 고름)

- **2026-10-17 오후에 더한 것**
  - 중공군 첫 참전 뉴스(`combat.md` 5, `combat.ts`의 `ccfFirstCombat`): GRCMBT `0031`(문자열은 모듈 맨 앞 `0000`). 공격·방어 부대 선두가
    중공군(SYMBOL div 10 = 6)인 첫 지상전, 1950년대만, UTILITY_SPACE[16]으로 한 번. 모든 파일이 [16] = 0이라 차가운 강철도 뛸(원작대로)
  - 표시 전투력 통일: 원작 화면(REPORTS `0b55`·`1751`)이 GET_STRENGTH 모드 0 합계 div 10임을 확인 → `combat.ts`의 `shownStrength`를 패널·지도·편성 창이 공유.
    매뉴얼 식 `strength.ts`는 지움(±1 차이 해소, 미해결 질문 하나 닫힘)
  - 진행 속도·이동 따라가기(`options.md` 5, `ui/playSettings.ts`): KOREA.SET_SPEED(DELAYVALUE 1/2/3, GAMEDELAY = ms × 값 div 2),
    TOGGLE_CENTERING(CENTER, MOVEUNIT `1c87`: 켜면 걸음마다 중앙, 끄면 화면 밖으로 나갈 때만, C 키). 리메이크에는 대기 화면이 없어 속도는
    **이동 애니메이션**(리메이크 추가, `mapView.animateMove`)에 씀. "♪ 설정" 메뉴의 "진행" 칸, 브라우저 저장소 `conflict-korea-remake/play`
  - 밀집 지역 마커: 겹친 헥스는 첫(또는 선택한) 부대를 가운데 온전히, 나머지는 오른쪽 위로 `STACK_STEP` 비켜 색 테두리만(숫자·배지 없음).
    말의 화면 사각형(`counterRects`)을 지명·산 이름이 피함(큰 도시 이름만 말 위 허용, 산 이름은 자리가 없으면 생략)
  - 한글화 마무리: 모든 시나리오의 부대·편성·항공대 이름과 6판 시뮬레이션 뉴스를 번역 함수에 넣어 누락 0건 확인.
    1995 기종 별칭(`AIRCRAFT_KO`), 원본 지형 코드 설명 `terrainCodeKo`, 조작 도움말을 `HELP_KO`로 옮김(컴퓨터 진영·KIM/WALTON 표시).
    남은 영어는 한글 옆 작은 원문 병기(일부러 둔 것)
  - 원작 .SAV 가져오기(`save.md` 4): `tools/extract/sav2json.ts` + `lib/sav.ts`. 세이브 = .DAT와 같은 덩어리, 재개 지점은
    UTILITY_SPACE[11]·GOTO_SECONDPHASE·SAVEORDER·GOTO_PLAYERPHASE(PLAYER·PHASE는 파일 밖). 시작 메뉴 값, NOTES → `GameState.notes`(새 필드,
    "최근 소식"이 이걸 씀). **KOREA1S·3S·4S.DAT는 실제 원작 세이브**(두 사람 대전, 공산군 1차 명령 단계)라 이 파일로 검증.
    저장 창에 .SAV를 올리면 변환 방법 안내

아직 없음
- 새 그래픽·전투/공습 연출(화풍 결정 필요), 원본 게임과의 직접 비교(DOSBox 필요)
- 개선판 AI (등록부와 선택 자리만 있음) ← 마지막 과제

## 3. 폴더 구조

```
korea/                                   ← Aside Project 루트 / Git 저장소 루트 권장
  README.md                              프로젝트 소개, 원작과 동일 / 다른 점 / 미구현 목록 (기능을 넣거나 규칙을 바꾸면 함께 갱신)
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
    docs/rules/air.md                    항공 (약화, 기지, 임무, 공산 요격 수준, 1995 제공권, 차단, 공습)
    docs/rules/naval.md                  해상·공수 이동 (자격, 수송 수요, 상륙, 상륙 공격, 일본 철수, 공수 낙하)
    docs/rules/intel.md                  정보(안개) (정찰 단계, 누가 무엇을 보는가, 정찰 갱신, 되돌리기 제한, 거짓 전력 보고)
    docs/rules/options.md                새 게임 옵션 (시작 메뉴 항목·기본값, 무작위 역량, 시나리오 파일 고르기) + 5장 진행 속도·이동 따라가기
    docs/rules/save.md                   저장/불러오기 (원작 저장 시점·재개, 리메이크 JSON 형식, 4장 원작 .SAV 변환)
    docs/rules/ai.md                     컴퓨터 플레이어 (원작 KIM·AISUBS·침공 경로, 리메이크 구조, 확장 계획)
    docs/rules/ai-walton.md              WALTON을 옮기기 전의 구조 조사(영문 메모, 맨 위에 옮기며 바로잡은 점) + ai-walton-script.txt. 기준은 ai.md 8장
    docs/rules/reports.md                보고서 (전략 보고, 비행장·항구, 날씨, 시나리오 정보, 보급망 표시, 전략 개관, FULL_HEX 요약)
    docs/rules/forces.md                 부대 편성 FULL_HEX (유닛 옮기기 허용 조건·이동력 맞추기·스미스 흡수, 부대 이름, +Hex/−Hex)
    docs/audio.md                        배경 음악·효과음 (리메이크 추가, 곡 목록과 저작권)
    docs/places.md                       지명 판정 방법과 근거
    index.html, src/                     웹 클라이언트
      data/types.ts                      추출 JSON 타입
      data/places.ts                     지명 데이터(자체 제작, 공개 가능)과 헥스→위경도 보정
      engine/                            규칙 엔진 (DOM 금지, 헤드리스)
        state.ts                         GameState (유닛, 스택, 점령, RNG, 스냅샷/되돌리기)
        movement.ts                      이동 규칙·도달 범위·명령 실행
        combat.ts                        전투력·돌파·공격 명령·전투 해결
        supply.ts                        보급망·재보급·턴 시작 이동력
        air.ts                           항공 작전 (기지·임무·예상치·DO_AIR_COMBAT·공습)
        naval.ts                         해상·공수 이동 명령 (자격·범위·상륙·상륙 공격·공수 낙하)
        intel.ts                         정보: 보는 쪽, 부대별 정찰 단계, 전력 보고, 아는 상태(perceivedState)
        options.ts                       새 게임 옵션 (메뉴 값, 기본값, 시나리오 파일, 표시 규칙)
        save.ts                          저장/불러오기 (GameState ↔ JSON, 저장 가능 여부, 재개)
        reports.ts                       보고서 데이터 (전략 보고, 비행장·항구, 날씨, 전략 개관 칸)
        forces.ts                        부대 편성 (옮기기 판정·실행, 이름, 화면 값, 헥스 순회)
        ai/                              컴퓨터 플레이어: types.ts(인터페이스), index.ts(등록부), common.ts(AISUBS·경로·합치기, 진영 무관), kim.ts(원작 공산군), walton.ts(원작 유엔군)
        spotting.ts                      이동·전투의 정찰 갱신 (CHEK_HEX, NEAR_THE_FRONT, 12점 규칙, 후퇴 주변)
        turn.ts                          단계 진행·선공·새 게임·END_TEST·NEXT_TURN
        endturn.ts                       정리 단계 (증원·보충·중공군·기뢰·순찰·게릴라·정보·도시 뉴스·승리 수준)
        weather.ts                       달력·날씨 생성·예보·결빙선
        hex.ts                           헥스 수학 (전투력은 combat.ts의 GET_STRENGTH·shownStrength 하나로)
      i18n/ko.ts                         한글 용어집·번역 규칙
      ui/                                지도 렌더러(Canvas 2D, 이동 오버레이), 정보·명령 패널, 새 게임 대화 상자(newGame.ts), 저장 대화 상자(saveDialog.ts),
                                         보고서(reports.ts), 소리·진행 메뉴(soundPanel.ts, 설정값 playSettings.ts), 부대 편성(organize.ts)
      audio/                             소리: abc.ts(악보 읽기), arrange.ts(편곡), synth.ts(FM 악기), sfx.ts(효과음), songs.ts(곡), index.ts(재생기)
      main.ts                            화면 연결, 이동 명령 컨트롤러
    tests/                               node:test 단위 테스트 (data/extracted 필요)
    tools/
      extract/                           원본 → data/extracted (JSON, PNG), sav2json.ts(원작 .SAV → 리메이크 저장 JSON, lib/sav.ts)
      disasm/                            dis.cjs (디스어셈블), strings.cjs (문자열)
      vendor/iced-x86/                   x86 디코더 (MIT, npm 패키지 그대로)
      dev-server.mjs, build.mjs          무설치 개발 서버, 정적 빌드
    data/extracted/                      생성물 (git 제외, 언제든 재생성)
    data/private/music.json              저작권이 남은 곡의 편곡(6.25의 노래) ※ git 제외, 다른 PC로는 직접 복사
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
node tools/extract/sav2json.ts GAME.SAV [out.json]     # 원작 세이브 → 저장 창 "파일 불러오기…"로 올릴 .json
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
  `__app.endPhase()` (확인 없이 단계 종료, 전투 단계에서는 남은 공습을 프로그램에 맡기고 지상전), `__app.banner`, `__app.closeBanner()`,
  `__app.bannerAction('end-game' | 'override')`, `__app.toggleAir()` (항공 작전 패널), `__app.airOpen`. 전투 단계 공습 중에는 `__app.click(x, y)`가 공습.
  `__app.setMode('tactical' | 'rail' | 'sea' | 'air')` (선택한 부대의 이동 모드). 해상 모드에서는 적 해안 `click` 두 번이 상륙 공격.
  새 게임: 페이지를 열면 새 게임 대화 상자가 떠 있고 그동안 지도 클릭·단계 종료가 막힘. `__app.newGame({ scenario: 2, playMode: 0, limitedIntel: false, ... })`
  (바로 시작), `__app.load('korea2s')`(파일 지정, 현재 옵션), `__app.closeNewGame()`, `__app.openNewGame()`, `__app.options`, `__app.draft`.
  정보: 기본이 "정보 제한"이라 적 부대 일부가 안 보임. `__app.newGame({ limitedIntel: false })`면 완전 정보, `__app.viewer`(지금 보는 쪽).
  두 사람 대전 + 정보 제한에서는 단계 알림 창이 떠 있는 동안 지도에 부대가 없음(`view.hideForces`)
  알림 창이 떠 있으면 지도 클릭이 막히므로 먼저 `closeBanner()`
  **기본 플레이 방식이 UN Solitaire(컴퓨터 공산군)** 로 바뀜: 두 사람 검증은 `__app.newGame({ playMode: 0 })`. 컴퓨터가 먼저면 새 게임이 사람 단계까지 진행된 채로 열림
  (용이 깨어나다는 0턴 유엔 2차 단계부터). 저장: `__app.openSave()`/`closeSave()`/`saveOpen`, `__app.saveSlot('1')`, `__app.loadSlot('auto')`,
  `__app.saveText()`(명령 단계가 아니면 null), `__app.loadText(text)`.
  보고서: `__app.openReports('strategic' | 'facilities' | 'weather' | 'scenario' | 'overview')`, `closeReports()`, `reportsOpen`, `setOverviewMode('terrain' | 'supply')`.
  컴퓨터 유엔군(WALTON) 검증: `__app.newGame({ scenario: 2, playMode: 2 })`(공산군으로) 후 `closeBanner()`·`endPhase()` → `__app.banner.lines`에 "컴퓨터(유엔군) …".
  엔진만 볼 때는 Node: `startNewGame(g, { computerSide: 2 })` → `endPlayerPhase` 반복(인천 상륙은 크로마이트 11턴 첫 유엔 단계).
  부대 편성: `__app.openOrganize(x, y)`(명령 단계의 자기 헥스만), `closeOrganize()`, `organizeAt`, `transfer(유닛 번호)`, `renameForce(칸 0|1, 이름)`, `organizeNav(1|-1)`.
  편성 창이 열려 있으면 모달이라 지도 클릭·단계 종료가 막힘.
  진행 설정: `__app.play`(speed 1|2|3, follow), `__app.setPlay({ speed, follow })`, `__app.animating`(이동 애니메이션 중), `__app.centerSelected()`(C 키).
  **자동화 탭은 requestAnimationFrame이 거의 멈춰 있어(1초에 0~3프레임)** 애니메이션은 스크린샷을 찍을 때만 진행됨.
  중간 프레임을 보려면 이동 직후 `page.screenshot()`을 몇 번. 게임 상태는 명령 즉시 끝나 있음(클릭·키는 애니메이션을 끝내고 처리)
  소리: `__app.audio`(settings, songs, `sfx(이름)`, `renderOffline(곡 id, 초)`·`renderSfx(이름)`은 OfflineAudioContext로 렌더링만). 자동화 탭은 렌더링이 느려 한 곡씩 비동기로 document.write로 띄운 about:blank 페이지는 localStorage가 막혀 있어
  ("브라우저 저장소를 쓸 수 없어요" 표시) 슬롯 저장은 검증 불가, saveText/loadText로 확인
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
| 해상·공수 | MOVEUNIT.AMPHIBIOUS, UNIT_COCKED, MOVE_UNIT(`46fd`, 중첩 `2536`·`23f2`·`22e3`·`2645`·`274d`), MOVE_COST `1588`~`1717` / GRCMBT `0105`·`1e11`·`2458` |
| 보급 | SUPPLY.DETERMINE_SUPPLY, REST_UP |
| 정보(안개) | EURSUBS1.SHOW_HEX, CHEK_HEX, IDENTIFY_UNIT, DO_OVERVIEW / HEXSTUFF.UNIT_INFORMATION / MOVEUNIT.NEAR_THE_FRONT / KOREA.FORCE_SPOTTING / ENDTURN.DO_INTEL |
| 옵션·새 게임 | TACSUBS.S_DATA `446a`(시작 메뉴, 문자열은 그 앞 중첩 구간 `4385`~), LOAD_NEW_GAME `4b62`, SCENARIO_DISPLAY `4153` / KOREA.NEW_GAME `0990`, INIT_GAME `0389` |
| 저장 | TACSUBS.SAVE_GAME `1ee0`, LOAD_OLD_GAME `3bf4` / KOREA.GAME_SAVE `0a3a` |
| 턴 진행 | KOREA.PHASE_PULSE, PLAYER_PHASE / ENDTURN.NEXT_TURN, GROUND_REINFORCEMENTS, DO_INTEL, DO_PATROLS, MINE_WARFARE, CHECK_CHINA, GAME_OVER |
| AI | WARRIORS.KIM (공산, 본문 `29df`~`2c30`, 중첩 `0000`~`29de`), WALTON (유엔, 본문 `5cf5`, 중첩 `2c85`~`5cf4`) / AISUBS.* / 유닛 초기화 `5e4a`(ROUTE). 심볼 길이는 믿지 말 것(ai.md 0) |
| 보고서 | REPORTS.STRATEGIC_REPORT `2f75`, PORTS_AIRFIELDS_REPORT `0356`, W_REPORT `3699`, SCENARIO_REPORT `0010` / EURSUBS1.DO_OVERVIEW `4421` / SUPPLY.DETERMINE_SUPPLY(TRUE) |
| 게임 중 설정 | KOREA.SET_SPEED `08f7`(DELAYVALUE), TOGGLE_CENTERING `087b`(CENTER) / TACSUBS.GAMEDELAY / MOVEUNIT `1c87`(중앙 이동, 호출 `3340`·`3460`·`3733`) |
| 원작 세이브 재개 | KOREA 주 루프 `1ffb`~, PHASE_PULSE `1e49`(GOTO_PLAYERPHASE·SAVEORDER), INIT_GAME `0600` / GLOBALS: GOTO_SECONDPHASE 8BFD, SAVEORDER 8BFE, GOTO_PLAYERPHASE 8C02 |
| 중공군 참전 뉴스 | GRCMBT 중첩 `0031`(문자열 `0000`), 호출 `1001`·`1c0d`. `--at GRCMBT 31 6c` |
| 부대 편성 | REPORTS.FULL_HEX `2c3c` + 중첩(입력 `2971`, 화면 `196c`, 옮기기 `232c`·`218d`·`2103`, 이름 `203d`·`1eab`, ±Hex `1cca`·`1d8f`, 스미스 `22cf`), SORT_FORCE `0727` / HEXSTUFF.UNIT_INFORMATION `0e43`(메뉴 조건) |

원본 게임을 직접 돌려 비교하려면 DOSBox-X를 설치해 `confkorea/KOREA.EXE`를 실행하세요 (디버거로 메모리 덤프 가능).

## 7. 다음 작업

순서(사용자 결정 2026-10-17): **7.1 원본 게임 비교 → 7.2 새 그래픽 → 7.3 개선판 AI(마지막)**. 7.1·7.2는 시작 전에 사용자에게 방식을 물을 것.

### 7.1 원본 게임과 직접 비교

코드만으로 결론을 못 낸 항목(README "원본 게임과 직접 비교해 확인할 것", 8장)을 원작을 실제로 돌려 확인.
- 방법 후보: (가) 사용자가 DOSBox-X를 설치해 직접 플레이(이 PC에는 DOSBox·winget 없음, 2026-10-17 확인),
  (나) 브라우저에서 js-dos(DOSBox WASM)로 confkorea를 띄워 AI가 키 입력·스크린샷으로 확인(인터넷에서 js-dos 스크립트를 받아야 함)
- 비교 기준 세이브: KOREA1S·3S·4S.DAT를 .SAV로 복사해 원작에서 "A saved game"으로 열면 리메이크(sav2json)와 같은 지점에서 시작할 수 있음
- 원작에서 저장한 .SAV를 sav2json으로 바꿔 두 게임을 같은 상태에서 비교하는 것이 가장 확실(난수는 다르므로 경향만)

### 7.2 새 그래픽·연출

지금은 Canvas 도형(지형 색, NATO 기호)과 이동 애니메이션만 있음. 화풍(원작 LBM 느낌의 픽셀, 종이 지도·지도책 느낌, 현대 플랫 등)을 먼저 정할 것.
후보: 지형 텍스처·산악 음영, 부대 말 디자인, 전투·공습 결과 연출(원작 GAMEDELAY 자리에 진행 속도 적용), 제목 화면. 원작 그래픽은 공개 불가

### 7.3 개선판 AI (마지막)

목표: 새 게임 대화 상자의 "컴퓨터 AI: 개선판(준비 중)"을 켜기. 원작 AI(KIM·WALTON)는 그대로 두고 `AiLevel` 'improved' 플레이어를 양 진영에 추가.
원작의 성격(침공 경로, 부산 교두보, 상륙)은 살리되, 원작 AI가 규칙을 어기거나(실제 적 위치를 읽음, 순간이동) 버그로 못 하는 것을 고친다.

1. 설계 먼저: `ai.md` 9장 "개선판"에 원칙을 적는다. 제안:
   - 사람과 같은 정보: 판단은 `intel.ts`의 `perceivedState`(정찰된 적만), 정보 완전 옵션이면 전부
   - 사람과 같은 규칙: 이동은 `movement.ts`의 `moveForce`/`railMove`, 해상·공수는 `naval.ts`, 공격은 `combat.ts`의 `assault` 경로를 써서 순간이동·규칙 우회 없음
     (원작 AI의 MOVE_COST 돌파·준비도 비용−1 같은 차이도 없어짐)
   - 판단 보강: 공격 전에 `estimateCombat`(예상 손실·후퇴 확률), 보급망(`supplyNet`)을 지키고 끊기, 도시·승리 점수(`territoryBalance`)
   - 원작 버그 고침: KIM WITHDRAW(+1) 빈 반복, 합칠 때 MOVE 반복문, 상륙 부대가 번호(215·216)에 묶임, 공격 계획이 1차 단계뿐
2. 엔진: `src/engine/ai/kim-improved.ts`, `walton-improved.ts`(필요하면 공용 `ai/improved.ts`), 등록부에 `level: 'improved'`. `common.ts` 재사용
3. 검증 도구: 컴퓨터끼리 대전(지금 `computerSide`는 한쪽만이라 테스트 전용 옵션 또는 `tools/selfplay.mjs`)으로
   원작 대 개선판 승리 수준 비교, 같은 시드 재현, 저장·불러오기 뒤 동일 진행
4. 화면: 개선판 버튼 활성화, 단계 알림 창에 개선판 표시
5. (예전 "다른 후보" 4가지는 2026-10-17에 모두 끝남)

## 8. 미해결 질문

- (결정) 편성: 둘 다 공격 계획이고 MASK(유닛) ≥ MASK(선두)면 남은 이동력과 상관없이 합류 허용(`232c` `254d`)과
  스미스 흡수·(0,2) 배치는 사용자 결정(2026-10-17)으로 원작 그대로 둠. (0,2)의 유닛을 REST_UP이 매 턴 처리하는 것도 원작 그대로
- (해결) 표시 전투력: 원작 화면이 GET_STRENGTH 모드 0 합계 div 10이라 패널·지도·편성 창 모두 그걸로(`shownStrength`, combat.md 4)
- 세이브: KOREA2S.DAT는 SAVEORDER·GOTO_PLAYERPHASE가 세이브처럼 차 있는데 UTILITY_SPACE[11]만 0(다른 S판은 1). 제작자가 손으로 끈 것인지 불명.
  sav2json은 [11] = 0이면 새 게임 데이터로 보고 거부함. 세이브 덩어리에 든 DELAYVALUE·BEEPS·CENTER를 원작 LOAD_OLD_GAME이 설정으로 쓰는지는 미확인(리메이크는 브라우저 설정)
- 뉴스: 중공군 첫 참전 뉴스는 모든 파일이 UTILITY_SPACE[16] = 0이라 차가운 강철(이미 개입) 첫 전투에도 뜨는데 원작 그대로 둠(원본 게임에서 확인 가능)

- (해결) STATUS 0x10 = 이번 턴 전력 보고 거짓, 0x20 = 전력 보고 정해짐(intel.md 2.4). 이제 모든 비트 확정
- 정보: 원작은 헥스 정보를 볼 때 GET_STRENGTH 모드 3이 RND(1,3)을 소비해 난수 순서가 화면 조작에 따라 달라짐. 리메이크는 시드 해시로 대신했으므로
  같은 시드라도 원작과 난수 순서가 일치하지 않음(원작도 조작마다 달라 비교 불가능). 모드 3을 부르는 다른 곳(보고서, AI)도 0x20을 세우는지 보고서·AI 작업 때 확인
- 정보: 공산군 12점 규칙이 철도 이동에도 걸리는지(걸음 코드는 공통이지만 철도 중 MOVE는 출발 값 그대로라 사실상 안 걸림). 지금은 일반 이동만 적용
- 정보: 원작은 적 점령 바다 헥스(점령값이 남은 곳)의 아군 함대도 정찰 0이면 숨김. 리메이크는 아군을 항상 표시(원본 게임에서 실제로 보이는지 확인해 볼 것)
- SCENARIO[1], [4], [7], 점령값 3 (쓰는 코드 없음. 새 게임은 [1] = 1, [4] = 0, [7]은 초기화 안 된 지역 변수). REALITY[1]·[3]은 확정(options.md 1).
  UTILITY_SPACE[9]는 확정: 턴당 상륙 공격 명령 수(naval.md 3)
- (해결) 기본 플레이 모드: KIM을 옮긴 뒤 원작과 같은 UN Solitaire(편성 배치판)로 되돌림(options.md 4)
- AI: KIM의 개막 진격 속도·수세 전환을 원본 게임(UN Solitaire)과 눈으로 비교할 것(난수가 달라 경향만). 유엔이 가만히 있으면
  테스트에서 서울 2턴, 대전 10턴에 함락. 크로마이트에서는 북한군이 부산 교두보보다 훨씬 약해 공격 계획이 모두 취소됨(1F3F 2부, 원작 그대로)
- AI: STRONGER의 13×13 상자가 헥스 거리 없는 사각형 오프셋(코드대로). 목표 고르기의 IDLE2 제외 조건(x ≤ 13이고 y ≥ 12)의 의도 불명
- AI: 정보 완전 옵션에서 KIM의 경로 행군이 정찰 바이트를 1로 쓰는데 원작 화면에 영향이 있는지(리메이크는 정보 완전이면 바이트를 안 봄)
- 저장: 원작 .SAV를 리메이크 저장 JSON으로 바꾸는 변환기는 없음(필요하면 `tools/extract`에, save.md 3)
- 해상: 바다 헥스에도 점령값(0/1/2)이 들어 있음(예: 11,41은 유엔). 해상 이동은 바꾸지 않지만 ENEMY_ADJACENT·순찰이 이 값을 읽음(원작 그대로 둠)
- 해상: 바다에서 턴을 시작한 부대는 정리 단계가 미리 1점 청구해 두고, 항구에 상륙하면 1점이 돌아옴(원작 그대로). 항구→항구는 턴당 3개(매뉴얼은 4개).
  상륙 공격이 막혀 바다에 남는 "드문 경우"는 테스트로만 확인(원본 게임 비교 필요)
- 공수: 적 부대 위 낙하가 늘 전멸하는 것(MOVE = 24 뒤 OVERRUN의 6점 검사)이 의도인지 버그인지. 매뉴얼은 "아주 약한 적이면 성공"
  (지금은 원작 코드대로, 원본 게임에서 187공수를 적 부대 위에 떨어뜨려 확인해 볼 것)
- 항공: 공습 목표 유무 검사(`1e1b`)가 진영과 상관없이 "유엔 점령 육지가 있는가"를 봄 (원작 그대로). 프로그램 목표 선택의 무작위 탐색 플래그 `[bp−26h]`는 초기화되지 않은 지역 변수(0으로 봄)
- 항공: CHOOSE_BASES는 연속 호출이 같은 결과를 내지 않을 수 있음(24번 MAG-12). 원작처럼 항공 작전 패널을 열 때와 전투 단계에서만 부름
- 시나리오 파일의 항공대 기지·INTERDICTION 값은 제작자가 손으로 넣은 것으로 보임(korea2·3의 제트기가 비행장이 있는데도 일본). korea2의 INTERDICTION 10은 직전 턴이 흐림·CIL 0이었다고 보면 계산값과 같음(미검증)
- TERRITORY_BALANCE의 중국 미개입 제한이 24턴(`384a`)에서만 걸리는데 END_TEST의 미개입 종료는 26턴: 원작 버그인지 의도인지 (지금은 원작대로)
- korea3 부대 205(미 2사단 9연대, 9,24)의 파일 MOVE가 보급망 계산과 다름: REST_UP 뒤 순찰·게릴라로 바뀐 점령인지 수동 편집인지 미확인
- 이동 중 버그아웃(`3070`)이 비교하는 두 헥스가 정확히 "출발·도착"인지 (MOVE_UNIT 프레임 `[di-12h]`/`[di-14h]`, 지금은 매뉴얼대로 두 헥스)
- (해결) 38선 표시: 데이터 표 없이 DO_OVERVIEW가 1950년대에만 36·37행 사이 직선으로 그림(reports.md 4). 미그 앨리는 x < 15, y < 27
- 기본 DAT와 S DAT: 둘 다 새 게임으로 읽힌다(LOAD_NEW_GAME이 UTILITY_SPACE[11]을 0으로). S는 사단 단위 편성에 시작 시점의 이동·공격 명령이 미리 들어 있음(korea1s 북한군 공격 계획 등)
- (해결) 밀집 지역 부대 마커 겹침: 겹친 부대는 테두리만, 지명은 말을 피함(2장). 더 많이 비켜야 하면 `mapView.ts`의 `STACK_STEP`

## 9. 참고 자료

- 원본 매뉴얼 PDF (korea 폴더). 부록 F 공식, 부록 C 전투서열, 부록 G 지도 좌표
- `docs/original-format.md`
- TDInfo 구조: https://github.com/ramikg/tdinfo-parser
- 공개 사료 (공개 배포용 데이터를 새로 만들 때): 미 육군 공간사 Appleman 『South to the Naktong, North to the Yalu』,
  미 의회도서관 AMS 1:250,000 한국 지도
