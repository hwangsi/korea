# 저장 / 불러오기 (원본 코드 기준)

원작의 저장·불러오기와 주 루프의 재개 방식을 디스어셈블로 확인하고, 리메이크의 저장 형식을 정리했습니다.
엔진은 `src/engine/save.ts`, 화면은 `src/ui/saveDialog.ts`와 `main.ts`, 검증은 `tests/save.test.ts`입니다.

## 0. 근거가 된 프로시저

| 내용 | 위치 |
|---|---|
| 명령 단계 메뉴의 "Save Game" 항목 (DO_ITEM 1Eh) | KOREA.DO_ITEM `0c20` → GAME_SAVE `0a3a` |
| "Save Game?" 확인 → 지도 화면을 비우고 저장 | KOREA.GAME_SAVE `0a3a` (LEAVE_MAP → SAVE_GAME → RETURN_MAP) |
| 파일 이름 받기(GET_NAME 화면, 확장자 .SAV), 쓰기, "Error saving game. Please check disk." | TACSUBS.SAVE_GAME `1ee0` (중첩 `1b1f` 이름, `1a1b` 쓰기) |
| 시작할 때 "Which do you wish to play? A saved game / A new game" | KOREA.INIT_GAME `04bc` |
| 저장 파일 고르기("Saved Game File Manager"), 읽기, 처음 실행이면 문서 확인 | TACSUBS.LOAD_OLD_GAME `3bf4` (중첩 `37ad`, GET_GAMEFILE `23cd`, `2b41`) |
| 불러온 뒤 재개 | 주 루프 `1ffb`~`2100`, PHASE_PULSE `1e49` |

## 1. 원작 동작

- **저장 시점**: 명령 단계(1차·2차)의 메뉴에서만. 전투 단계와 정리 단계는 IN_INTERPHASE라 메뉴가 없어 저장할 수 없음.
  컴퓨터 진영의 단계도 사람이 메뉴를 쓸 수 없으므로 결국 **사람 플레이어의 명령 단계 중**에만 저장됨.
- **저장 내용**: 전역 데이터 영역 전체(GAMEFILESIZE 바이트, 시나리오 .DAT와 같은 배치, `original-format.md`). 유닛, 지형 바이트(점령·정찰·스택),
  날씨, 비축, UTILITY_SPACE, TURN·PHASE·PLAYER, SAVEORDER, GOTO_PLAYERPHASE, GOTO_SECONDPHASE 등이 모두 들어 있음.
  난수 상태(Turbo Pascal RandSeed)는 이 영역 밖이라 저장되지 않음.
- **불러온 뒤 재개**: INIT_GAME → 주 루프.
  - GOTO_SECONDPHASE가 참(2차 명령 단계에 저장)이면 1차 명령 단계와 전투 단계를 건너뛰고 PHASE_PULSE(3)부터.
  - PHASE_PULSE는 GOTO_PLAYERPHASE > 0이면 **선공 판정을 다시 굴리지 않고** 저장된 SAVEORDER를 쓰며, 저장한 플레이어 순번부터
    루프를 돈다(`1e55`). 그 플레이어 단계를 시작할 때처럼 FORCE_SPOTTING을 다시 부른 뒤 PLAYER_PHASE.
  - 따라서 저장한 플레이어의 명령 단계가 **처음부터 다시** 시작되지만, 이미 내린 이동·공격 명령은 데이터에 남아 있음.
  - UTILITY_SPACE[11] = 1(게임 시작됨)이라 INIT_GAME의 0턴 사건(피란민 뉴스, 1995 비축 감소)은 다시 일어나지 않음.
- 기본 시나리오 DAT와 S DAT도 같은 형식이지만 LOAD_NEW_GAME이 UTILITY_SPACE[11]을 0으로 두므로 새 게임으로 읽힌다.

## 2. 리메이크 저장 형식 (`save.ts`)

JSON 한 덩어리입니다.

| 필드 | 내용 |
|---|---|
| `format` | `"conflict-korea-remake-save"` |
| `version` | 형식 버전(지금 1). 더 새 버전 파일은 거부 |
| `savedAt` | 저장 시각(ISO) |
| `scenarioId` | 바탕 시나리오 데이터(korea1 ~ korea4s). 불러올 때 이 JSON으로 지도·장비표를 다시 만듦 |
| `options` | 새 게임 대화 상자 값(시나리오, 개입, 역량, 플레이 방식, 항공, 정보, 데이터판) |
| `summary` | 목록 표시용: 시나리오, 턴, 단계, 플레이어, 컴퓨터 진영, 날짜 |
| `state` | GameState의 모든 필드. `Map`은 `{"$map": [[키, 값], ...]}`, `Uint8Array`는 `{"$u8": [...]}` |

- 저장하지 않는 필드: `hexes`(지도, 1995 변형 포함), `equipmentTypes`(장비표)는 시나리오에서 다시 만들고, `undo`(되돌리기 1단계)는 버림.
  나머지는 필드 이름을 하나하나 적지 않고 GameState를 통째로 직렬화하므로 **새 필드를 GameState에 추가해도 저장에 자동으로 들어감**
  (AI 기억 같은 것도). 의미가 바뀌면 `SAVE_VERSION`을 올리고 `loadGame`에서 옛 버전을 변환.
- **난수 상태(`rng`)와 정찰 시드(`intelSeed`)도 저장**: 불러온 게임은 저장하지 않고 계속한 게임과 결과가 똑같음(테스트로 확인).
  원작은 난수 상태를 저장하지 않으므로 불러온 뒤의 결과가 달라질 수 있었음(리메이크 차이).

## 3. 리메이크 결정

- **저장 시점**: 원작처럼 명령 단계에서만(`saveBlocked`: 전투·정리 단계, 공습 목표 고르는 중, 종료 질문 중에는 불가).
- **재개**: 원작처럼 저장한 플레이어의 명령 단계를 다시 시작(FORCE_SPOTTING 한 번, 난수는 쓰지 않음, 선공 판정 없음).
  화면은 그 단계의 시작 알림 창부터(두 사람 대전 + 정보 제한이면 교대 알림 창 동안 부대를 그리지 않음). 되돌리기는 불러온 뒤에는 없음.
- **저장소**: 브라우저 저장소(localStorage)에 슬롯 5개 + 자동 저장 1개. 자동 저장은 사람 플레이어의 명령 단계가 시작될 때마다 덮어씀.
  파일로 내려받기(.json)와 파일 올리기로 다른 브라우저·PC로 옮길 수 있음. 브라우저 저장소를 쓸 수 없는 환경이면 파일만 가능.
- **원작 .SAV 가져오기**: 지원하지 않음. 웹 코드는 원본 바이너리를 직접 읽지 않는 규칙(HANDOFF 5장)이라, 필요하면
  `tools/extract`에 .SAV → 저장 JSON 변환 명령을 추가하는 방식으로 할 것(세이브 형식은 시나리오 DAT와 같아 추출기를 재사용 가능).
- 원작의 "Save Game?" 확인과 파일 이름 입력 대신, 저장 대화 상자에서 슬롯을 누르면 바로 저장(덮어쓸 때만 확인).
