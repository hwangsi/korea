# 새 게임 옵션 (원본 코드 기준)

원작 시작 메뉴(매뉴얼 2.1, 2.11)를 디스어셈블과 대조해 정리했습니다. 엔진은 `src/engine/options.ts`와 `turn.ts`의 `startNewGame`,
화면은 `src/ui/newGame.ts`, 검증은 `tests/options.test.ts`입니다.

## 0. 근거가 된 프로시저

| 내용 | 위치 |
|---|---|
| 메뉴 틀 (제목, 버튼 1~7, 안내 문구, "(Current Game Mode)") | TACSUBS.SCENARIO_DISPLAY `231f:4153` |
| 현재 선택 표시 (시나리오·개입·역량·플레이 모드·항공·정보) | TACSUBS.S_DATA `446a` (문자열은 그 앞 `4361`~`4469`) |
| 기본값 설정, 메뉴 호출, 무작위 역량, 시나리오 파일 고르기 | LOAD_NEW_GAME의 중첩 프로시저 `49a2` |
| 메뉴 입력 루프 (키 1~7, 마우스, Esc) | `49a2`의 중첩 프로시저 `46fd` |
| 파일 읽기, SCENARIO[0..7]·REALITY[1..4] 기록, 날씨 4회, 첫 턴 날씨, 정보 완전이면 정찰 2 | TACSUBS.LOAD_NEW_GAME `4b62` |
| 문서 확인(복사 방지) | SET_ENVIRONMENT 안의 `2b41` ("Documentation Check:") |
| 게임 중 "Scenario Info" | REPORTS `005b`가 같은 S_DATA로 현재 설정을 보여 줌 |

## 1. 메뉴 항목과 값

메뉴 값은 LOAD_NEW_GAME 프레임의 지역 배열(SCENARIO 사본 `[bp−210h]`~, REALITY 사본 `[bp−214h]`~)에 있고, 시작하면 그대로 전역에 복사됩니다.

| 키 | 항목 | 저장 위치 | 값 (누를 때마다 순환) | 기본값 |
|---|---|---|---|---|
| 1 | Scenario | SCENARIO[0] | 1 The Dragon Wakes → 2 Operation Chromite → 3 Cold Steel → 4 Tomorrow's War | 1 |
| 2 | CCF Intervention | SCENARIO[6] | 0 Historical ↔ 1 Fixed. 시나리오 3이면 "In progress", 4면 "Not allowed"로만 표시(값은 그대로 바뀜) | 0 |
| 3 | Red Competence | SCENARIO[2] | 1 Pushover, 2 Moderate, 3 Challenging, 4 Hairy, 5 Hideous!, 6 Random? | 3 |
| 4 | Play Mode | SCENARIO[3] | 0 Two player, 1 UN Solitaire(컴퓨터가 공산군), 2 Red Solitaire(컴퓨터가 유엔군) | **1** |
| 5 | Air Campaign | REALITY[2] | 참 Player Control ↔ 거짓 Program Control | 참 |
| 6 | Intelligence | REALITY[4] | 참 Limited ↔ 거짓 Complete | 참 |
| 7 / Esc | Begin Game | | 메뉴를 닫고 시작 | |

- 마우스: 왼쪽 버튼 열 두 개(y = 50 + 9·k, 90 + 9·k)를 누르면 해당 키, 오른쪽 아래 영역은 Esc.
- 나머지 SCENARIO 바이트는 새 게임마다 [1] = 1, [4] = 0, [5] = 1(99면 게임 종료), [7]은 초기화되지 않은 지역 변수 그대로.
  REALITY[1]·[3]은 늘 참. REALITY[1]이 거짓이면 MAKE_MENUS(`21ac`)가 메뉴 세 칸을 "..."로 비우지만 새 게임과 GAME_OVER가 모두 참으로 두므로
  실제로는 영향 없음. REALITY[3]은 읽는 코드가 없음.
- 항공 표시: REALITY[2]가 거짓이거나, **1950년대이고 Red Solitaire**면 "Program Control"로 보임(공산군은 1950년대에 항공대가 없고
  유엔 항공대는 컴퓨터 몫이라 사람이 정할 것이 없음). 값 자체는 바뀌지 않음.

## 2. 시작할 때 (Begin Game 뒤)

1. 역량이 6(Random)이면 `RND(1,5)`로 바꿈. 이 난수는 시나리오 파일을 읽기 전에 굴림.
2. 시나리오 파일: **Play Mode가 1(UN Solitaire)** 이거나 디버그 플래그 TEST_BOTH_PLAYERS면 `koreaNs.dat`(편성 배치판), 아니면 `koreaN.dat`.
   편성 배치판은 사단 단위 편성에 공산군의 시작 이동·공격 명령이 미리 들어 있어, 컴퓨터가 공산군을 맡을 때 쓰는 파일입니다.
3. 파일을 읽고(GET_GAMEFILE) UTILITY_SPACE[11] = 0, 메뉴 값을 SCENARIO[0..7]·REALITY[1..4]에 씀.
4. 날씨 4회(DO_WEATHER, 크로마이트는 TURN −4부터 한 턴씩 올리며), 첫 턴 날씨 강제(20턴이면 추위·맑음과 결빙선 23, 아니면 온화·흐림),
   정보 완전이면 모든 헥스 정찰 2 (turn.md 3, intel.md 1).
5. 인자가 참이면 문서 확인(매뉴얼 단어 맞히기, `RND(1,13)`로 문제 고름). 틀리면 프로그램 종료.
6. KOREA.INIT_GAME: 0턴 사건. 1995는 컴퓨터가 공산군이 아닐 때만 침공 뉴스와 공산 특수부대의 유엔 비축 감소(RND(1,10)),
   용이 깨어나다는 피란민(뉴스는 컴퓨터가 공산군이 아닐 때만). 이후 주 루프 (turn.md 3).

게임 중 "Restart game?"(KOREA.NEW_GAME `0990`)은 같은 과정을 다시 밟습니다.

## 3. 옵션이 영향을 주는 곳 (이미 구현된 규칙)

| 옵션 | 영향 | 문서 |
|---|---|---|
| 역량 | 공산군 전투력 ±10%/단계, 재보급률(+7 기준), 공산 비축, 컴퓨터가 공산군이면 보충·손실 보정 | combat.md, supply.md |
| 플레이 모드 | 컴퓨터 진영의 명령 단계(AI), 컴퓨터 진영 손실 경감·보충 배수, 유엔 차단 수준 −5(컴퓨터 공산), 1995·1950 0턴 뉴스, 미 해병 하구 예외(컴퓨터 유엔이면 없음), 1950 3턴 날씨 보정 | turn.md, supply.md, combat.md, movement.md |
| Air Campaign | 거짓이면 두 진영 모두 프로그램이 임무와 공습 목표를 정함. 컴퓨터 진영은 늘 프로그램 | air.md 7 |
| 정보 | intel.md 전체. 매뉴얼: 컴퓨터는 늘 정보 제한으로 판단(AI 작업 때) | intel.md |
| 중공군 개입 | Fixed면 비국군 유엔 부대가 38선을 넘은 뒤 반드시 개입 | turn.md 4.3 |

## 4. 리메이크 결정

| 항목 | 결정 | 이유 |
|---|---|---|
| 메뉴 화면 | 처음 열 때와 상단 "새 게임" 버튼으로 여는 대화 상자. 시나리오 카드 4장 + 항목별 버튼(누를 때마다 순환하는 대신 값을 바로 고름) | 마우스 중심 |
| 기본 플레이 모드 | 두 사람(원작 기본은 UN Solitaire) | AI가 아직 없어 컴퓨터 진영은 움직이지 않음 |
| 기본 정보·항공·역량·개입 | 원작과 같음 (정보 제한, Player Control, Challenging, Historical) | |
| 시나리오 파일 | "자동"이면 원작 규칙(UN Solitaire면 편성 배치판). 고급 설정에서 기본판·편성 배치판을 직접 고를 수 있음 | 두 사람 대전에서도 편성 배치판을 볼 수 있게(예전 시나리오 목록 8종 유지) |
| 무작위 역량 | 시작할 때 게임 난수로 `RND(1,5)`. 결과는 시작 후 요약에 표시 | 원작은 메뉴에 "Random?"만 남김 |
| 문서 확인(복사 방지) | 없음 | |
| 게임 중 설정 확인 | 요약 패널의 시나리오 카드에 현재 설정(원작 Scenario Info) | |
| 컴퓨터 진영이 있을 때 교대 안내 | 교대 문구("자리를 바꾸세요")를 띄우지 않음 | 한 사람 게임 |
