# 항공 작전 규칙 (원본 코드 기준)

원본 KOREA.EXE 디스어셈블과 매뉴얼 2.0, 2.1, 3.21, 4.1~4.13, 9.0(전략 조언), 부록 F(비행장 기지, 1995 제공권)를 대조해 정리했습니다.
엔진은 `src/engine/air.ts`, 단계 연결은 `src/engine/turn.ts`, 테스트는 `tests/air.test.ts`입니다. 주소는 `모듈 오프셋`
(OPSSUBS 세그먼트 `0f13`, AIRCMBT `0582`). AIRCMBT는 DO_AIR_COMBAT(`1efe`) 앞 7.9KB가 전부 그 중첩 프로시저입니다.

| 내용 | 위치 |
|---|---|
| 진영별 항공대 범위 | OPSSUBS.STARTFINISH `0000`, UNIT_AVAILABLE `005a`, 목록 작성 `03bc`(CHOOSE_BASES 중첩, 목록 DS:0322, 개수−1 DS:0320) |
| 약화·공대지 | EFFECTIVE_STRENGTH `0708`, GROUND_ATTACK_STRENGTH `00a3` |
| 차단·요격·공산 요격 수준 | DETERMINE_INTERDICTION `015f`, DETERMINE_INTERCEPTION `02ae`, DETERMINE_RED_AIR `01f9` |
| 기지 | CHOOSE_BASES `047f` |
| 항공 작전 화면 | AIR_OPERATIONS `1c9d`, 중첩: 화면 `1999`, 목록 `1058`, 부대 설명 `0889`, 임무 순환 `1b90`, 예상치 `166e`, 공습 가능 수 `035b` |
| 메뉴 조건 | KOREA `1a26` (메뉴 그리기), 호출 KOREA `0c7b` |
| 전투 단계 | AIRCMBT.DO_AIR_COMBAT `1efe`, 중첩: 자동 임무 `0294`(유엔 위기 판정 `01a5`), 차단 효과 `0051`, 공습 목표 있음 `1e1b`, 공습 있음 `04af`, 공습 진행 `1a84`, 공습 하나 `0b8e`(해병 인접 `0916`), 1995 제공권 손실 `1c7a` |
| 공군 무력화 | ENDTURN.NEXT_TURN `11b9` → 중첩 `1023` |
| 시작 옵션 | TACSUBS.S_DATA `4698`("Air Campaign: Player Control / Program Control"), LOAD_NEW_GAME `4c3a`(REALITY[1..4]) |

## 1. 데이터

AIR_UNIT_TYPE(36바이트): NAME string[24], ENTRY_TURN `+19h`, EXIT_TURN `+1Ah`, TYPE1·TYPE2(기종) `+1Bh`·`+1Ch`, AIR_TO_AIR `+1Dh`,
AIR_TO_GROUND `+1Eh`, MISSION `+1Fh`, BASE `+20h`, ALL_WEATHER `+21h`, LONG_RANGE `+22h`, POOR_RUNWAYS `+23h`. 배열은 1부터(`0x24·i + 4E9Ch`).

- MISSION: 0 제공권(Air Superiority), 1 지상 공격(Ground Attack), 2 차단(Interdiction)
- BASE: 0 일본, 1 한국, 2 항공모함 (부대 설명 화면 `0f8b`의 "Japan"/"Korea"/"Carrier"로 확정)
- POOR_RUNWAYS: 참이면 기지 요구 "Any"(프로펠러기, 열악한 활주로 가능), 거짓이면 "Improved"(제트기)
- 활동(UNIT_AVAILABLE): `ENTRY_TURN ≤ TURN < EXIT_TURN`. 격추로 두 전력이 0이 되면 EXIT_TURN = 0
- 진영별 범위(STARTFINISH): PLAYER 1(공산) 1~13, PLAYER 2(유엔) 1950년대 1~34(30~34는 빈 칸), 1995 14~34.
  1950년대 유엔으로 부를 때마다 INTERCEPTION[공산] = RED_AIR (전략 보고의 "공산 요격 수준" 표시용)
- 1950년대 공산군은 항공대가 없고 **공산 요격 수준(CIL) = RED_AIR** 하나로 추상화. 1950년대 공산 플레이어는 항공 작전을 쓰지 않음
- DUAL 배열 INTERCEPTION·INTERDICTION은 [0] 공산, [1] 유엔 (`[di−743Ch]`, `[di−7438h]`, di = 2·PLAYER)

## 2. 약화와 공대지 전력

**EFFECTIVE_STRENGTH**(나누는 값) `0708`:
1. d = WEATHER[0][0] mod 10 (1 맑음, 2 흐림, 3 폭풍)
2. 전천후이고 d > 1이면 d − 1
3. 기지가 일본(0)이고 장거리가 아니면 d × 2

**GROUND_ATTACK_STRENGTH(i, x, y)** `00a3`:
1. 1950년대이고 (임무가 차단이거나 목표가 **미그 앨리** x < 15, y < 27): s = 공대지 − (RED_AIR − 공대공), 0~공대지로 제한.
   즉 공대공이 RED_AIR 이상이면 감소 없음
2. 아니면 s = 공대지
3. 1950년대 장거리 부대가 지상 공격 임무면 s div 2
4. 결과 = s div 약화

## 3. 기지 CHOOSE_BASES `047f`

비행장 9곳의 현재 등급으로 자리 수를 셈: 등급 1 → 프로펠러 자리 1, 등급 2 → 아무 기종 자리 1, 등급 3 → 아무 기종 자리 2
(점령과 무관, 등급은 NEXT_TURN이 유엔 점령이 아니면 0으로 만듦). 목록은 진영의 활동 중 항공대, 번호 순.

1950년대:
1. 제트기 배치: BASE ≠ 2, 장거리 아님, POOR_RUNWAYS 아님 → 아무 자리가 남으면 BASE 1(한국), 아니면 0(일본)
2. 남은 아무 자리를 프로펠러 자리에 더함
3. 프로펠러기 배치: POOR_RUNWAYS, 장거리 아님, BASE ≠ 2(단 TURN > 11이면 11번도 포함) → 자리가 남으면 BASE 1,
   아니면 0(11번은 2로 되돌아감)
4. 11번(Marine Air Group 33)이 한국에 있으면 11번 = 타이거캣 추가(TYPE2 7), 공대공 9, 공대지 18, 그리고 24번(Marine Air Group 12) BASE 2.
   아니면 11번 TYPE2 0, 6/12, 24번 BASE 0(일본). (부록 F "MAG-33이 한국에 있으면 MAG-12는 항모, 아니면 일본")

1995(유엔만, PLAYER 2):
1. POOR_RUNWAYS가 아닌 부대(BASE ≠ 2): 아무 자리가 남고 (번호 < 24 또는 장거리 아님)이면 BASE 1, 아니면 0
2. 남은 자리를 프로펠러 자리에 더하고, POOR_RUNWAYS 부대에 BASE 1 / 0
3. 북한 항공대는 파일 값(BASE 1) 그대로

장거리 부대는 1950년대 항상 일본, 항모 부대(BASE 2)는 항상 항모. 호출: 항공 작전 화면에 들어갈 때(`1058`)와 전투 단계 시작(유엔).
매번 그때의 BASE에서 다시 배치하므로 연속 호출이 같은 결과를 내지 않을 수 있음(24번이 일본이면 1단계에서 자리를 차지했다가 4단계에서 덮어씀). 원작 그대로.

## 4. 항공 작전 화면 AIR_OPERATIONS (1차 명령 단계)

- 메뉴 조건(KOREA `1a26`): (유엔이거나 1995) **그리고** PHASE = 1 **그리고** REALITY[2](Air Campaign: Player Control)
  **그리고** UTILITY_SPACE[PLAYER + 11] = 0(그 진영 공군이 무력화되지 않음). 2차 명령 단계에서는 바꿀 수 없음
- 들어갈 때 CHOOSE_BASES. 왼쪽 버튼 A~U로 부대 선택, 선택된 부대를 다시 누르면 임무 순환 0 → 1 → 2 → 0
- 부대 설명(`0889`): 기종 그림, 공대공 = 공대공 div 약화(1950년대 장거리 부대가 제공권 임무면 약화 × 2),
  공대지 = 공대지 div 약화(장거리 부대가 지상 공격이면 × 2), 장거리·전천후 여부, 기지 요구(Any/Improved), 현재 기지, 임무.
  0이 되면 "0 (-)"로 표시
- 1950년대 유엔: 예정 철수(ENTRY ≤ TURN, EXIT < 99, EXIT > TURN)와 예정 증원(ENTRY > TURN)을 날짜와 함께 목록. 없으면 "No reinforcements or withdrawals are expected."
- **Projections**(`166e`): 현재 값을 저장하고 계산해 보인 뒤 되돌림
  - 공습 가능 수(`035b`): 활동 중이고 임무가 지상 공격인 부대 수
  - 차단 수준: DETERMINE_INTERDICTION
  - 1950년대: DETERMINE_RED_AIR 뒤의 RED_AIR = "이번 턴 공습 때 공산 요격 수준", 여기에 다음 정리 단계 증가(TURN > 8 +10, > 24 +5)를 더한 값 = "다음 턴 시작"
  - 1995: DETERMINE_INTERCEPTION = "아군 제공 전력"

## 5. 전투 단계 DO_AIR_COMBAT `1efe`

FORCE_SPOTTING 다음, DO_GROUND_COMBAT 앞. 이 동안 모든 공격 화살표를 보임(SHOW_ALL_PLOTS).

```
CHOOSE_BASES (유엔)
PLAYER 1, 2 중 (유엔, 또는 1995면 양쪽):
    시작 턴(0턴, 시나리오 2의 11턴, 시나리오 3의 20턴)이 아니고
    (컴퓨터 진영이거나 REALITY[2] 거짓)이면 자동 임무 0294
    1995면 DETERMINE_INTERCEPTION
1950년대: DETERMINE_RED_AIR
1995이고 양쪽 공군이 모두 살아 있으면(UTILITY_SPACE[12], [13] = 0):
    "Air superiority combat results:" 공산, 유엔 순으로 손실 1c7a → 양쪽 DETERMINE_INTERCEPTION 다시
PLAYER 1, 2 중 (유엔, 또는 1995면 양쪽):
    DETERMINE_INTERDICTION → 차단 효과 0051
    공습 목표가 있으면(1e1b) 그리고 지상 공격 부대가 있으면(04af) 공습 1a84
    목표가 없으면 "Airstrikes cancelled. No targets!"
```

### 5.1 자동 임무 `0294` (컴퓨터 진영, 또는 Air Campaign: Program Control)

1950년대(활동 중 부대마다, 번호 순):
1. 공대공 > 공대지 → 제공권
2. 아니면 장거리 → 차단
3. 아니면 `RND(1, RED_AIR) ≥ 10` → 제공권, 아니면 `RND(1,3) > 1` → 지상 공격, 아니면 차단
4. 유엔이고 **위기**(`01a5`)면 지상 공격으로 덮어씀. 위기: 유엔 점령 헥스 수를 세고, (23~28, 51~59) 구역(부산·대구)에
   공산 점령이면서 부대가 있는 헥스가 하나라도 있으면 0으로. `RND(1,100) > 그 수`이거나, 피란민이 있고 `RND(1,5) = 1`
   (유엔 헥스가 100개 미만인 부산 교두보 시기에 지상 공격을 늘림)

1995:
- 공산: 공대공 ≥ 공대지 → 제공권, 아니면 지상 공격
- 유엔, TURN < 6: 공대공 > 공대지이고 북한 공군이 살아 있으면 제공권, 아니면 `RND(1,2)`(지상 공격/차단)
- 유엔, TURN ≥ 6: 같은 조건이면 `RND(0,2)`, 아니면 `RND(1,2)`

### 5.2 1950년대 공산 요격 수준 (RED_AIR, 4.11)

- DETERMINE_RED_AIR `01f9`: 항공대 1~34 중 활동 중이고 **제공권 임무**인 부대의 `공대공 div 약화`(1950년대 장거리는 `div 2·약화`) 합계를
  5로 나눠 RED_AIR에서 뺌, 0~200으로 제한
- 정리 단계에서 TURN > 8이면 +10, TURN > 24이면 +5 더 (turn.md 1장)
- RED_AIR는 공대지 전력을 깎음(2장): 모든 차단 임무, 그리고 미그 앨리 안의 공습

### 5.3 1995 제공권 (4.12, 부록 F)

- DETERMINE_INTERCEPTION `02ae`: 진영의 활동 중 부대마다 제공권 임무면 `공대공 div 약화`, 아니면 `공대공 div (5·약화)` → INTERCEPTION[PLAYER]
- 손실 `1c7a`: `손실률 = 10 × 적 INTERCEPTION div 아군 INTERCEPTION` (아군이 0이면 90), 0~90. "<진영> air unit losses N%."
- 진영의 활동 중 부대마다 공대공 = 공대공 × (100 − 손실률) div 100, 공대지도 같게. 둘 다 0이면 EXIT_TURN = 0(제거)
- 두 진영 모두 먼저 계산한 INTERCEPTION으로 손실을 정한 뒤 INTERCEPTION을 다시 계산

### 5.4 차단 (4.11, 4.12)

- DETERMINE_INTERDICTION `015f`: 활동 중이고 **차단 임무**인 부대의 GROUND_ATTACK_STRENGTH(i, 0, 0) 합계 div 10 → INTERDICTION[PLAYER]
  (1950년대 유엔은 RED_AIR가 이미 줄어든 뒤의 값으로 깎임)
- 차단 효과 `0051`: v = INTERDICTION div 10이 0~1이면 "lightly", 2면 "moderately", 그 이상 "strongly".
  INTERDICTION > 0이면 뉴스 "<진영> aircraft <부사> interdict <상대> supply lines.", 그리고 **상대 비축 −RND(1, INTERDICTION)**, 0~255로 제한
- 이 INTERDICTION은 상대의 철도 이동 차단(movement.md 3.4)에 그대로 쓰임 (1차 명령 단계에는 지난 턴 값)
- 정리 단계 REST_UP의 UNIL(supply.md 2장)은 따로 계산: 차단 임무 부대의 `공대지 div 약화` 합계 div 10, **RED_AIR 감소 없음**

### 5.5 공습 (4.13)

**공습 진행 `1a84`**: 진영의 활동 중이고 지상 공격 임무이며 `GROUND_ATTACK_STRENGTH(i, 0, 99) > 0`인 부대마다 한 번(번호 순).
"Communist/U.N. Air Strikes — Begin". 컴퓨터 진영이거나 Program Control이면 프로그램이 목표를 고르고, 아니면 플레이어가 고름.
각 공습 전에 "Airstrikes: N available.", "Current Strike Lethality X%."(X = GROUND_ATTACK_STRENGTH(i, 0, 99), 미그 앨리 감소 없는 값).

**플레이어 목표 선택**: 아무 헥스나 고르되 만주(0x94)면 "You are not authorized to begin WW-III!", 적 점령이 아니면 "Friendly hex!".
빈 헥스도 고를 수 있음. 공습을 건너뛰는 방법은 없음.

**프로그램 목표 선택**(`0b8e`, 인자 참): 적 점령이고 정찰 > 0인 헥스의 부대(첫째, 둘째)마다 점수
1. `RND(1,8)`
2. 그 헥스가 전선(ENEMY_ADJACENT)이면: 도시 +1, 도로가 있는 개활지 코드(0x0B~0x57) +1, +2,
   1950년대에 공산 점령이고 항모 기지 부대이며 해병 인접이면 +2, 선두 유닛 준비도가 60·70·80·90을 넘을 때마다 +1
3. 유엔이고 x ≥ 23, y ≥ 51(부산 쪽)이면 +2
4. 선두 유닛 MOVE > 0이면 +1, 여러 유닛 부대(ATTACHED > 0)면 +1, 둘째 부대면 +1

가장 높은 점수(동점이면 먼저 찾은 것, x 0→33, y 0→65 순). 후보가 없으면 (14,10)에서 시작해 `RND(0,33)`, `RND(1,64)`로 적 점령 헥스를 최대 20번
찾고(만주도 걸릴 수 있음), 그래도 없으면 바다·만주가 아닌 적 점령 헥스 중 마지막 것.

**해결**(`131b`~`1987`):
1. 1950년대이고 `CCF_INTERVENTION + 6 > TURN`이고 첫째 부대가 중공군(GET_CORPS = 1)이면 정찰하지 못함. 아니면 정찰 0인 헥스를 정찰 1로
2. 부대가 없거나 정찰 0이면 "No target found."
3. 부대마다:
   - L = GROUND_ATTACK_STRENGTH(i, 목표 x, y)
   - 1950년대: 부대 이름에 "Marine" 또는 "Carrier"가 있고 목표에 인접한 헥스에 **선두 유닛이 미 해병 보병(SYMBOL 12)**인 부대가 있으면 L × 3 div 2
   - 지형 코드 0x58~0x93(험지·산악·도시 등)이면 L × 3 div 4
   - L0 = L, L을 1~100으로 제한 (화면의 살상률 %)
   - 유닛마다: STATUS 0x40(준비도 75+ 미이동 = 진지)이면 Lu = L × 3 div 4, 아니면 L.
     장비 칸마다 보유 n개 중 n − 1번: `RND(1,100) ≤ Lu`이고 `생존력 < RND(1,15)`이면 보유 −1.
     준비도 −Lu div 2, 50~100으로 제한
   - 피해 정도 = (RND(1,10) + L0) div 10, 1~3 → "slightly / moderately / heavily damaged." (정찰 2면 부대 이름, 아니면 "Enemy unit")
4. 폭발 그림 = 마지막 부대의 피해 정도 횟수
5. 대공 사격: `RND(1,10) < 맞은 유닛 수`이고 1995면 공대공 −1, 공대지 −1(0 아래로 안 감), 둘 다 0이면 EXIT_TURN = 0. "(Air unit hit by AA fire)"
6. 공습으로 장비를 잃어도 CHECK_ELIM은 부르지 않음 (칸마다 최소 1개 남음)

## 6. 1995 공군 무력화 (NEXT_TURN `11b9` → `1023`)

NEXT_TURN 맨 앞에서 1995만: 북한(항공대 1~13, UTILITY_SPACE[12]), 유엔(14~34, [13]) 순으로, 그 칸이 0이고 EXIT_TURN > 0인 부대가
하나도 없으면 칸 = 1, 뉴스 "North Korean / United Nations air force has been neutralized." 이후 그 진영은 항공 작전 메뉴가 없고
1995 제공권 손실 단계도 없어짐.

## 7. 시작 옵션 REALITY

LOAD_NEW_GAME이 시작 메뉴의 6개 선택 중 4개를 REALITY[1..4]에 씀. 화면 순서는 "4 Play Mode, 5 Air Campaign, 6 Intelligence".
**REALITY[2] = Air Campaign Player Control**(참이면 플레이어가 임무와 공습 목표를 정함, 거짓이면 프로그램). 1950년대 Red Solitaire(유엔이 컴퓨터)면 화면에 Program Control로 표시.
GAME_OVER는 REALITY[1..2] = 참, [3..4] = 거짓으로 둠.

## 8. 매뉴얼과 다른 점

- 약화 표: 매뉴얼은 일본 기지 단거리 부대가 흐림 33%·폭풍 25%라고 하지만 코드는 하늘 코드 × 2 → 50%/25%/17%
- CIL은 "날씨 영향 없음"이라고 하지만 DETERMINE_RED_AIR는 약화로 나눈 공대공을 씀
- 차단의 비축 감소는 "0~UNIL"이 아니라 `RND(1, IL)` (IL > 0일 때)
- 장비 파괴 확률은 `살상률% × (15 − 생존력) / 10`이 아니라 `살상률% × (15 − 생존력) / 15`, 그리고 장비 칸마다 최소 1개 남음
- 해병 ×1.5는 "USMC 보병 유닛을 포함한 부대"가 아니라 **선두 유닛이** 미 해병 보병인 인접 부대
- 1995 대공 사격 확률은 "적 유닛 수/10"이 아니라 `(맞은 유닛 수 − 1)/10`
- 1950년대 장거리 부대의 제공권 공대공 절반은 CIL 계산(DETERMINE_RED_AIR)과 화면에만 적용, 1995 요격 계산에는 없음
- 공습 목표 유무(`1e1b`)는 진영과 상관없이 "유엔 점령 육지 헥스가 하나라도 있는가"를 봄 (원작 그대로, 사실상 항상 참)

## 9. 리메이크 결정

| 항목 | 결정 |
|---|---|
| 항공 작전 화면 | 상단 "✈ 항공 작전" 버튼 → 오른쪽 패널. 임무는 버튼 셋(제공권·지상 공격·차단)으로 바로 고름(원작은 다시 눌러 순환). 예상치는 바꿀 때마다 다시 계산 |
| Air Campaign 옵션 | 새 게임 화면에서 고름(기본 Player Control). 1950년대 Red Solitaire의 "Program Control" 표시도 원작대로 (options.md 1) |
| 공습 목표 | 전투 단계에서 플레이어가 지도에서 적 헥스를 클릭. "컴퓨터가 고르기"(그 공습만 프로그램 목표), "남은 공습 맡기기"를 추가. 원작처럼 건너뛰기는 없음 |
| 단계 종료로 넘기기 | 공습이 남은 채 "단계 종료"를 누르면 남은 공습은 프로그램이 목표를 고름 |
| 결과 | 전투 결과 패널 위에 항공 결과(제공권 손실, 차단 수준과 상대 비축 감소, 공습별 결과, 대공 사격). 지도에 공습 헥스 표시 |
| 미그 앨리 | 1950년대 지도에 x ≤ 14, y ≤ 26 경계를 점선으로 표시(원작은 헥스 왼쪽 아래 제트기 그림) |
| 피해 보고 과장 | 없음. 원작도 LOSS_INFLATOR를 쓰기만 하고 읽지 않아 공습 결과는 실제 값 (intel.md 3.2) |

## 10. 아직 모르는 것

- 공습 진행 중 'O' 키(`10c4`)는 안내 문구를 다시 그리는 것으로 보임 (규칙 영향 없음)
- 프로그램 목표 선택의 무작위 탐색 시작 플래그 `[bp−26h]`는 초기화되지 않은 지역 변수 (리메이크는 0으로 봄)
- (해결) 공수 낙하(MOVEUNIT `2645`)의 RED_AIR·비행장 사용은 `naval.md` 5장: 미그 앨리(x ≤ 14, y ≤ 26)면 손실률 + RED_AIR, 원래 유엔 점령인 비행장 헥스면 0
