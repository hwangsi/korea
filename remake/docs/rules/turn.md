# 턴 진행 규칙 (원본 코드 기준)

원본 KOREA.EXE 디스어셈블과 매뉴얼 2.2, 3.0, 5.0~5.21, 6.0~6.9, 8.0, 부록 F를 대조해 정리했습니다.
엔진은 `src/engine/turn.ts`(단계 진행), `src/engine/endturn.ts`(정리 단계), `src/engine/weather.ts`(날짜·날씨),
테스트는 `tests/turn.test.ts`입니다. 보급·보충은 `supply.md`. 주소는 `모듈 오프셋`.

| 내용 | 위치 |
|---|---|
| 주 루프 | KOREA 본체 `1ff2`~`2103` |
| 명령 단계·선공 | KOREA.PHASE_PULSE `1e49`, PLAYER_PHASE `1add`, NEXT_PLAYER `077d`, FORCE_SPOTTING `1cf7` |
| 새 게임 | TACSUBS.LOAD_NEW_GAME `231f:4b62`(날씨 `4c58`), KOREA.INIT_GAME `0389`(0턴 사건 `06d9`) |
| 정리 단계 | ENDTURN.UNSPOT_EVERYTHING `1436`, GROUND_REINFORCEMENTS `06b3`, CHECK_CHINA `20bd`, MINE_WARFARE `1f97`, DO_PATROLS `1999`, DO_INTEL `15e9`, CHECK_BIGHEXES `017c` |
| 다음 턴 | ENDTURN.NEXT_TURN `1198`, TACSUBS.DO_WEATHER `3e1c`(날씨 생성 중첩 `3c51`) |
| 종료·승리 | KOREA.END_TEST `187b`, ENDTURN.GAME_OVER `1d66`, EURSUBS1.TERRAIN_HELD `3348`, TERRITORY_BALANCE `37a0` |

## 1. 턴 순서 (주 루프)

```
PHASE_PULSE(1)                 1차 명령: 두 플레이어가 차례로
PHASE 2                        FORCE_SPOTTING → DO_AIR_COMBAT(air.md 5장) → DO_GROUND_COMBAT
PHASE_PULSE(3)                 2차 명령: 두 플레이어가 차례로 (선공 다시 판정)
PHASE 4                        UNSPOT_EVERYTHING → REST_UP → GROUND_REINFORCEMENTS → RED_AIR 증가
                               → CHECK_CHINA → MINE_WARFARE → DO_PATROLS → DO_INTEL → CHECK_BIGHEXES → END_TEST
NEXT_TURN                      TURN + 1, 날씨, 비행장 복구 → 처음으로
```

- RED_AIR: TURN > 8이면 +10, TURN > 24이면 +5 더
- PLAYER: 1 공산, 2 유엔. SCENARIO[5] = 99이면 게임 종료 상태(단계 건너뜀)
- 정리 단계의 TURN은 방금 끝난 턴. NEXT_TURN에서 1 증가

## 2. 명령 단계 PHASE_PULSE

1. 선공: `p = (STOCKPILE[공산] + 100 − STOCKPILE[유엔] ≥ RND(1,200)) ? 1 : 2`.
   TURN 0이면 1, 크로마이트(시나리오 2) 11턴이면 2, 차가운 강철(3) 20턴이면 1. **1차 명령 단계는 뒤집어서** `3 − p`가 먼저.
   단계마다 새로 굴림. → 비축이 많은 쪽이 1차에서 나중, 2차에서 먼저 (부록 F와 확률이 같음)
2. 유엔은 시나리오 1·2·4의 0턴, 시나리오 3의 20턴까지 1차 명령 단계가 없음: "No U.N. first orders phase this turn."
   (크로마이트 11턴은 유엔 1차 단계 있음)
3. 각 플레이어 단계 직전에 FORCE_SPOTTING: 정찰 0인 점령 헥스가 적에 인접하면 정찰 1
4. PLAYER_PHASE: 컴퓨터 진영이면 AI(WARRIORS.KIM/WALTON), 사람이면 "Communist first phase. Begin" 알림 후 이벤트 루프.
   1차 단계에서 UTILITY_SPACE[20 − PLAYER]가 1이면 "Reinforcements have arrived."
5. NEXT_PLAYER("End your first phase?" → yes): PLAYER + 1로 루프 종료

2차 명령 단계 제한(5.1): 공격 명령 불가(적 헥스로 들어가면 돌파가 아니면 이동 종료, combat.md 2), 철도 불가(CAN_ENTRAIN),
해상 불가(AMPHIBIOUS가 PHASE 1만 허용), 공수는 UNIT_COCKED에 단계 검사가 없어 **가능**(매뉴얼과 다름, naval.md 5.1). **이동 중 급속패퇴(5.21)**: MOVE_UNIT `3a57` → 중첩 `3070`. 2차 단계의 유엔 부대가 적 인접 헥스에서
적 인접 헥스로 한 걸음 옮길 때마다, 이번 턴 후퇴한(STATUS 0x02) 신병 유닛은 `RND(1,100) > 준비도`이면 BUGOUT.

## 3. 새 게임 (LOAD_NEW_GAME, INIT_GAME)

- 시작 메뉴 값이 SCENARIO 바이트와 REALITY에 들어감: SCENARIO[2] 공산군 역량, [3] 컴퓨터 진영(0 두 사람, 1 공산, 2 유엔),
  [6] 중공군 개입(0 역사적, 1 고정), REALITY[4](1부터 센 번호) 정보 제한. UTILITY_SPACE[11] = 0
- 날씨: 시나리오 2는 TURN −4 후 4번 DO_WEATHER(매번 TURN+1), 나머지는 TURN 그대로 4번. 그 뒤 현재 날씨를 강제로
  온화·흐림(22), 결빙선 0. 시작 턴이 20(차가운 강철)이면 추위·맑음(11), 결빙선 23
- 정보 완전이면 모든 헥스 정찰 2
- 0턴 새 게임: 해상·공수·철도 수요 0. 1995이고 컴퓨터가 공산이 아니면 뉴스 2개 + 유엔 비축 −RND(1,10).
  시나리오 1은 피란민(REFUGEES) 켬 + 뉴스. UTILITY_SPACE[11] = 1

## 4. 정리 단계

### 4.1 UNSPOT_EVERYTHING

모든 헥스 정찰 0. (REST_UP은 정찰 바이트를 빌려 쓰고 되돌림)

### 4.2 REST_UP, GROUND_REINFORCEMENTS

`supply.md` 2~4장. 증원 도착은 GROUND_REINFORCEMENTS 안에서 비축 수송 직후:

- 대기 유닛: `MAP_X = −(도착 턴 × 100 + x 코드)`, MAP_Y = 목표 행. MAP_X < −1인 유닛만, **번호 큰 것부터**
- 도착 턴 = |MAP_X div 100|. 중공군은 CCF_INTERVENTION < 50일 때 `− (50 − (CCF − 보정))` (보정 = CCF > 20이면 (CCF−17) div 4).
  중공군 데이터는 50+오프셋이라 실제 도착은 개입 턴 기준. 개입 미정(99)·허세(88)면 도착하지 않음
- `TURN + 1 ≥ 도착 턴`이면 처리 (다음 턴 시작에 지도에 있음)
- x 코드: 0~33 지정 헥스, 99 공산 일반 목록 (2,20) (9,17) (14,10) (29,5) (33,6) (0,22) (17,24) (7,29),
  88 남한 도시(x 13~26, y 40~59, 위쪽부터), 77 일본 (33, 64→59). 목록에서는 **마지막으로 조건이 맞는 칸**(공산 점령·둘째 칸 빈)이 선택
- 중공군: 그 헥스 첫째 부대 칸이 비어 있으면 점령을 공산으로 바꿈(배치 실패해도 유지)
- 배치 조건: 지도 안, 점령이 있음, 자기 진영 점령(공산은 유엔 점령 불가, 유엔은 공산 점령 불가), 부대 칸 여유. 아니면 대기 유지
- 부대 선두만 배치하고 ATTACHED로 이어진 유닛을 같이 옮김, STATUS = 1, UTILITY_SPACE[18](유엔)/[19](공산) = 1

### 4.3 CHECK_CHINA (6.5)

CCF_INTERVENTION = 99(미정)일 때만. x 0~33, y 0~37(37행은 홀수 열만)의 육지에 **선두 번호 187 이상**(국군 아닌 유엔) 부대가 있으면:
고정 옵션이거나 `RND(1,3) > 1`이면 CCF = TURN > 16 ? TURN + 1 : TURN + RND(1,4), 아니면 88(허세).
UTILITY_SPACE[8] = TURN, 뉴스 "United Nations units enter North Korea." / "China pledges to halt imperialist aggression in Korea."
시나리오 시작값: 1·2 = 99, 3 = 15, 4 = 88.

### 4.4 MINE_WARFARE (6.7)

TURN ≤ 6이고 1995가 아니면 없음. 항구 18곳마다: 공산 점령이면 (y < 36 또는 TURN > 10)일 때 `RND(1,100) < TURN + 20`이면 기뢰,
1995는 무조건 기뢰(RND는 소비). 공산 점령이 아니면 `RND(1,2) = 1`이면 기뢰 제거. 기뢰 항구는 보급원·항구 배수에서 빠짐.

### 4.5 DO_PATROLS (6.31 순찰 + 6.6 게릴라)

대상 헥스(VALID): 바다 아님, 도시 아님, 만주 아님, (33, y > 7) 일본 열 아님.

1. 순찰(모든 시나리오): 점령이 1·2이고 **비어 있는** 헥스 옆에 "강한" 적 부대가 있으면 점령이 넘어감.
   강함 = 그 헥스 선두 유닛 하나의 GET_STRENGTH(모드 0) 살상력 ≥ 300(표시 30). 원작의 "상대 순찰 반경이면 제외" 판정은
   중앙 헥스 기준이라 사실상 항상 거짓(0열만 예외적으로 넘어가지 않음)
2. 게릴라(1950년대, x 우선 순서로 연쇄):
   - 유엔 헥스: `RND ≤ 10` 또는 (`RND ≤ 20`이고 공산 육지와 인접)이고, 7칸 안에 유엔 점령 헥스의 부대가 없고, 항구·비행장이 아니면 공산으로
   - 공산 헥스: `RND ≤ 50`이고 유엔 육지와 인접하고, 7칸 안에 공산 부대가 없고 유엔 부대가 있으면 유엔으로
   - 평양(7,29), 함흥(17,24)이 비어 있으면 공산 점령으로
   - 뉴스 "Communist guerrillas active behind U.N. lines." / "U.N. forces engaged in counter guerrilla operations."

### 4.6 DO_INTEL (6.32~6.34)

정보 완전이면 모든 헥스 2. 제한이면 헥스마다: 다른 점령의 부대에 인접하면 2, 1995는 공산 헥스 `RND(1,3) < 도로+3`이면 +1,
그 외 헥스 `TURN + 1 < RND(1,3) + 도로`이면 +1이고 도시는 2. 화면에서 무엇이 보이는지는 `intel.md`.

### 4.7 CHECK_BIGHEXES

서울·평양·함흥·대전·광주·대구·부산의 점령이 UTILITY_SPACE[0~6]과 다르면 "X forces occupy Y." 뉴스, 값 갱신.
유엔이 남쪽 도시를 되찾으면 UTILITY_SPACE[14] = 1 → 다음 NEXT_TURN에 민간인 학살 매장지 뉴스.

### 4.8 END_TEST

다음 중 하나면 "Peace talks have begun." → End game(GAME_OVER) 또는 OVERRIDE(계속, 승리 조건 무효 뉴스):
TURN = 44(1951-05-22), TURN = 26(1951-01-08)이고 CCF ≥ 88, 1995 TURN = 15(10-15), 공산 점령 헥스 없음, 유엔 점령 도시 없음.

## 5. NEXT_TURN과 날씨

1. 유엔 점수 = 100 × 유엔 도시 + 유엔 기타 헥스 (TERRAIN_HELD: 만주·가장자리·물 제외)
2. 점수 − UN_HEXES > 10이고 UTILITY_SPACE[10] = 0이면 포로 학살 뉴스(한 번). UTILITY_SPACE[14] = 1이면 매장지 뉴스
3. 1995 7턴: r = RND(0,9), UTILITY_SPACE[15] = r + 7, 유닛 198~202의 도착 턴을 4 − r만큼 당김. 도착 전 턴에 "Additional U.S. reinforcements due next week."
4. **피란민**: UN_HEXES − 점수 > 10(유엔이 10점 넘게 잃음, 도시 하나면 100점) 또는 UTILITY_SPACE[7] > 4(이번 턴 제거된 유엔 유닛 + 후퇴한 유엔 부대)면 REFUGEES = 1, 아니면 0
5. UN_HEXES = 점수, UTILITY_SPACE[7] = [9] = 0, 정보 제한이면 LOSS_INFLATOR = RND(0,3) ×2 (읽는 코드가 없음: intel.md 3.2)
6. PLAYER = 1, PHASE = 0, TURN + 1, DO_WEATHER
7. 비행장: 유엔 점령이면 등급 < 최고일 때 `RND(1,100) ≤ (4 − 등급) × 25`면 +1 (0→1 항상, 1→2 75%, 2→3 50%). 아니면 0

DO_WEATHER: WEATHER는 3행 × 4열(기온×10 + 하늘). 0행이 실제 날씨(이번 턴, +1, +2, +3), 1·2행이 공산·유엔의 예보.

1. 0행을 한 칸 당기고 0행 3열 = 날씨 생성(TURN + 3)
2. 이번 턴 기온: 추위 → 결빙선 +5(최소 21), 온화 −4, 더위 −9, 0~65 제한
3. 예보 행마다 0열 = 실제, k열(1~3)은 `RND(1,100) ≤ 15k`이면 새로 굴림, 아니면 실제 값 (정확도 85/70/55%)

날씨 생성(`3c51`): m = (턴 − 2) div 4 (0 = 7월 … 10 = 5월, 달력보다 한 턴 늦음).
RND 두 개로 기온(추위 → 온화 → 더위 경계)과 하늘(맑음 → 흐림 → 폭풍 경계)을 정함. 경계값은 매뉴얼 6.4 표의 누적값과 같음.
시나리오 1, 컴퓨터가 유엔, 3턴이면 폭풍 → 흐림.

## 6. 승리 수준 TERRITORY_BALANCE (8.0)

점수 = 100 × 도시 + 기타 헥스 (진영별). 1995는 기타 헥스에 각 진영 비축을 더함.
수준 = (유엔 점수 − 공산 점수 − 기준) div 200, −9~9. 기준 1950년대 181(1950-06-25 상태), 1995 346 (시작 시 유엔 +1, 매뉴얼의 핸디캡).
GAME_OVER 판정이 24턴(1950-12-22)에 일어났고 유엔이 이기고 있으면, 공산 도시가 있으면 2 + 공산이 쥔 보급 거점 수가 2 이상일 때 수준 0.
GAME_OVER 뉴스: Marginal(1~2)/Significant(3~4)/Decisive(5+) 승리, 유엔 3 이상 통일, 공산 2 이상 대통령 사임 요구, 3 이상 철수 요구·서울 개명.

## 7. UTILITY_SPACE (20바이트)

| 칸 | 의미 |
|---|---|
| 0~6 | 큰 도시 7곳의 마지막 점령 (CHECK_BIGHEXES) |
| 7 | 이번 턴 제거된 유엔 유닛 + 후퇴한 유엔 부대 수 (BURY, GRCMBT `1641`) → 피란민 |
| 8 | 중국이 결정한 턴 (읽는 곳 없음) |
| 9 | 이번 턴 바다에서 내린 상륙 공격 명령 수 (MOVEUNIT `22e3`의 `23e8`에서 +1, `243f`에서 1 이하일 때만 명령 가능 → 턴당 2개), NEXT_TURN에서 0 (naval.md 3) |
| 10 | 포로 학살 뉴스 표시함 |
| 11 | 게임 시작됨 (0턴 사건 처리 완료) |
| 12, 13 | 1995 북한/유엔 공군 무력화 (NEXT_TURN `1023`, air.md 6장). 그 진영은 항공 작전 메뉴(UTILITY_SPACE[PLAYER + 11])와 제공권 손실 단계가 없어짐 |
| 14 | 남쪽 도시 탈환 → 매장지 뉴스 대기 |
| 15 | 1995 추가 미군 도착 턴 |
| 16 | 중공군 첫 참전 뉴스 표시함 (GRCMBT `0031`, combat.md 5) |
| 18, 19 | 이번 정리 단계에 유엔/공산 증원 도착 |

## 8. 매뉴얼과 다른 점

- 순찰: 보급·준비도 조건 없음, 선두 유닛 하나의 살상력 ≥ 300만 봄. 상대 순찰 반경 예외는 사실상 없음. 항구·비행장도 넘어감, 1995에도 적용
- 게릴라: 공산 인접 시 확률 10% + 90%×20% = 28%. 소탕은 항구·비행장도 가능. 같은 정리 단계 안에서 연쇄
- 기뢰: 첫 부설 판정은 7턴 끝(8월 15일 턴), 남쪽 항구는 11턴 끝부터, 확률은 (TURN+19)%. 6턴까지는 제거도 없음
- 중공군 고정 개입: 1~4턴 뒤(매뉴얼 2~4), 16턴 이후면 다음 턴
- 승리: 중국 미개입 시 유엔 승리 제한은 24턴 GAME_OVER에서만 적용, "보급 거점 2개 이상"(매뉴얼은 2개 초과)
- 6.33 1995 정찰: 유엔 도시는 2, 일정표는 방금 끝난 TURN 기준
- 이동 중 급속패퇴(5.21): "후퇴가 막힌" 조건이 아니라 이번 턴에 후퇴한(STATUS 0x02) 신병 유닛

## 9. 리메이크 결정

| 항목 | 결정 |
|---|---|
| 진행 | 상단 "단계 종료 ▶" = NEXT_PLAYER. 상대 단계·전투·정리 단계를 엔진이 이어서 실행하고, 다음 사람 단계 시작(또는 전투 단계 공습)을 알림 창으로 띄움(두 사람 교대) |
| 진영 제한 | 명령 단계에서는 그 진영 부대만 선택·명령 가능. 상대 부대는 정보만 |
| 컴퓨터 진영 | AI가 없어 컴퓨터 진영 단계는 아무것도 하지 않고 지나감. 기본은 두 사람 대전(SCENARIO[3] = 0) |
| 시작 옵션 | 새 게임 대화 상자(원작 시작 메뉴)에서 고름. 기본값은 원작과 같되 플레이 방식만 두 사람 (options.md) |
| 항공 | DO_AIR_COMBAT 구현(air.md). 사람 플레이어의 공습 목표를 기다리는 동안 전투 단계가 멈추고(`airstrikes` 이벤트, GameState.air), "단계 종료"나 마지막 공습 뒤 이어서 지상전. 1995 공군 무력화는 NEXT_TURN 맨 앞 |
| 종료 | END_TEST가 걸리면 알림 창에서 "게임 끝내기"(GAME_OVER 결과) 또는 "계속 싸우기". 계속하면 이후 END_TEST는 묻지 않음(원작은 매번 물음) |
| 뉴스 | 원작은 최근 8줄만 보관, 리메이크는 전부 보관하고 한글로 표시 |
| 시드 | 브라우저는 시각 기반 시드, 테스트는 고정 시드 |
