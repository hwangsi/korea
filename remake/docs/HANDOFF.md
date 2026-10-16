# 인계 문서 (HANDOFF)

새 환경이나 새 AI 세션에서 작업을 이어갈 때 **가장 먼저 읽는 문서**입니다.
작업을 마칠 때마다 2장(현재 상태)과 7장(다음 작업)을 갱신하세요.

- 마지막 갱신: 2026-10-16, 데스크톱(F:\korea)에서 노트북으로 옮기는 시점

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

검증된 사실
- `NKPA 50/15 Inf Rgt` 전투력 계산 = 매뉴얼 부록 F 예시 (생존력 234, 살상력 418)
- 시나리오 날짜: 1950-06-25 / 1950-09-15 / 1950-11-22 / 1995-06-25
- 도로 연결 604/611, 철도 460/480 일치 (나머지는 도시·항구·지도 밖 연결)

아직 없음
- 규칙 엔진(이동, 전투, 보급, 턴 진행), 명령 UI, AI, 전체 한글화, 새 그래픽/사운드

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
    index.html, src/                     웹 클라이언트
      data/types.ts                      추출 JSON 타입
      engine/                            규칙 엔진 (DOM 금지, 헤드리스)
      i18n/ko.ts                         한글 용어집·번역 규칙
      ui/                                지도 렌더러(Canvas 2D), 정보 패널
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
- 디버그 훅: 페이지에서 `window.__app.view` (지도 뷰), `window.__app.load(id)` (시나리오 로드)

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

## 7. 다음 작업: 이동 시스템

목표: 부대를 클릭하면 이동 가능 범위가 보이고, 목적지를 클릭하면 경로와 비용을 미리 본 뒤 확정하는 마우스 이동.

1. 규칙 확정 → `docs/rules/movement.md`
   - 매뉴얼 기준 값 (코드로 재확인 필요)
     - 지형 비용: 개활지·도시 2, 험지 3 (중공군 2), 산악 4 (중공군 3), 도로 1 (험지 도로 2, 1995년 1)
     - 강: 결빙 시 무시, 다리(도로+강) +1, 다리 없음 +4 (폭풍 6)
     - 추가 비용: 적 인접 헥스 이탈 +4, 아군 점유 헥스 진입 +1, 적 점령지 진입 +1, 공격 전개 +1
     - 한 헥스 최대 2개 부대, 이동력 1 사용마다 준비도 1 감소
     - 이동력: 준비도 0-50 / 51-74 / 75-100 기준 미군·유엔 0/12/24, 국군·북한 0/9/18, 중공군 9/9/12, 1995년 전원 0/12/24
   - MOVE_COST, NATIONAL_MOVEMENT_RATE 디스어셈블로 위 값과 예외(철도, 해상, 공수, 상륙)를 확인
2. 엔진: `src/engine/movement.ts` (부대 이동력, 헥스 진입 비용, 다익스트라 도달 범위, 경로)
3. 게임 상태: 시나리오 JSON → 변경 가능한 GameState (부대 위치, 남은 이동력, 준비도), 되돌리기 1단계
4. UI: 부대 선택 → 도달 가능 헥스 강조(남은 이동력 표시) → 마우스 오버 경로 미리보기 → 클릭 이동, 우클릭 취소
5. 이어서: 전투(공격 지정, 손실비, 후퇴/붕괴, 예상치 UI) → 턴 루프 → 보급 → 항공 → AI

## 8. 미해결 질문

- UNIT_TYPE.STATUS 비트 전체, TERRAIN 바이트 2-4의 의미
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
