# Conflict: Korea 리메이크 (개인 프로젝트)

SSI의 1992년 DOS 작전급 워게임 **Conflict: Korea – The First Year 1950-51** (Norm Koger 디자인)을
웹 기반으로 **현대적으로 재해석**하는 프로젝트입니다.

- 방향: 원작처럼 깊이 있는 작전급 시뮬레이션. 규칙은 원작 기준, UI/그래픽/편의 기능은 현대화 (규칙을 바꾸면 문서화)
- 플랫폼: 웹 브라우저
- 조작: 대부분 마우스 클릭만으로
- 언어: 한국어 우선 (한글화 필수)
- 성격: 개인 프로젝트. 원본 파일과 원본에서 추출한 데이터는 공개 저장소에 올리지 않습니다.

> 처음이거나 다른 PC·새 AI 세션에서 이어갈 때는 [`docs/HANDOFF.md`](docs/HANDOFF.md)부터 읽으세요.
> 무엇이 원작과 같고, 다르고, 아직 없는지는 저장소 맨 위 [`README.md`](../README.md)에 정리되어 있습니다.

## 준비물

- Node.js 24 LTS 이상 (최소 22.18). 별도 패키지 설치(npm install) 없이 동작합니다.
- 원본 게임 파일: 기본 위치는 `../Conflict-Korea-The-First-Year-1950-51_DOS_EN/confkorea`

## 사용법

```powershell
cd remake

# 1) 원본에서 데이터 추출 -> data/extracted/
node tools/extract/extract.ts            # 다른 위치면: node tools/extract/extract.ts <원본 폴더>

# 2-a) 개발 서버로 실행 -> http://localhost:5173
node tools/dev-server.mjs

# 2-b) 또는 정적 빌드 후 단일 파일로 실행 (서버 불필요, 더블클릭으로 열림)
node tools/build.mjs                      # dist/standalone.html

# 3) 단위 테스트 (추출 데이터 필요)
node --test --test-isolation=none "tests/**/*.test.ts"
```

리버스 엔지니어링 보조 도구:

```powershell
node tools/disasm/dis.cjs GET_TERRAIN     # 심볼 주석이 붙은 디스어셈블
node tools/disasm/dis.cjs --all           # 모듈별 전체 목록 -> data/extracted/asm/
node tools/disasm/strings.cjs             # 코드 안의 UI 문자열 707개 -> data/extracted/ui_strings.json
```

## 폴더 구조

```
remake/
  index.html, src/          웹 클라이언트 (TypeScript, 의존성 없음, Canvas 2D)
    engine/                 규칙 엔진 (UI와 분리된 순수 로직: state, movement, combat, supply, air, naval, intel, spotting,
                            options, turn, endturn, weather, hex, strength)
    data/places.ts          지명·산·호수 데이터(자체 제작)와 헥스→위경도 보정
    i18n/ko.ts              한글 용어집과 번역 규칙
    ui/                     지도 렌더러, 정보 패널
  tools/
    extract/                원본 -> JSON/PNG 추출기 (TDInfo 심볼, DAT, ILBM, 지형 해석)
    disasm/                 디스어셈블러, 문자열 추출 (vendor/iced-x86, MIT)
    dev-server.mjs          무설치 개발 서버 (Node 내장 TS 변환)
    build.mjs               정적 빌드 + standalone.html
  data/extracted/           추출 결과 (git 제외)
  docs/original-format.md   원본 포맷과 역공학 결과 정리
  docs/rules/               규칙 명세 (movement, combat, supply, turn, air, naval, intel, options)
  docs/places.md            지명 판정 방법과 근거
  tests/                    단위 테스트 (node:test)
```

## 진행 상황

자세한 현황(원작과 동일 / 다른 점 / 미구현)은 [`../README.md`](../README.md), 다음 작업은 `docs/HANDOFF.md` 7장.

- [x] 원본 분석: Turbo Pascal 6 실행 파일에 남은 디버그 심볼(TDInfo)로 프로시저 285개, 변수, 레코드 구조 복원
- [x] 시나리오/세이브 포맷 완전 해독 (전역변수 영역 덤프 33,792바이트)
- [x] 지도 의미 데이터: 34×66 헥스, 지형, 강/도로/철도 6방향 연결, 도시, 항구, 비행장
- [x] 유닛 250개(1995년 202개), 장비, 항공대, 보충, 뉴스 추출 및 매뉴얼 수치 검증
- [x] 한글 지도 뷰어 프로토타입 (시나리오 8종, 점령지/전선, 부대 정보, 장비표)
- [x] 이동 규칙 엔진 (원본 MOVE_COST 그대로, 철도 이동, 버그아웃, 되돌리기) + 단위 테스트 → [`docs/rules/movement.md`](docs/rules/movement.md)
- [x] 마우스 이동 UI (도달 범위, 경로·비용 미리보기, 클릭 확정, 우클릭 취소)
- [x] 지상전 (돌파, 공격 명령, 전투 해결, 후퇴·제거) + 공격 예상치 UI → [`docs/rules/combat.md`](docs/rules/combat.md)
- [x] 아이콘 헥스 전체에 현재 지명 → [`docs/places.md`](docs/places.md)
- [x] 턴 진행 (1차 명령 → 전투 → 2차 명령 → 정리, 선공, 두 사람 교대) + 보급망·재보급·턴 시작 이동력, 비축, 보충·재편성,
      증원 도착, 날씨·결빙선·예보, 순찰·게릴라, 기뢰, 중공군 개입, 피란민, 종료·승리 수준 → [`docs/rules/turn.md`](docs/rules/turn.md), [`docs/rules/supply.md`](docs/rules/supply.md)
- [x] 항공 작전 (임무·기지·날씨 약화, 1950년대 공산 요격 수준·미그 앨리, 1995 제공권 손실, 차단, 공습 목표 지정·해결)
      + 항공 작전 패널·전투 단계 공습 UI → [`docs/rules/air.md`](docs/rules/air.md)
- [x] 해상·공수 이동 (상륙, 상륙 공격, 일본 철수, 187공수 낙하) → [`docs/rules/naval.md`](docs/rules/naval.md)
- [x] 정보(안개) (정찰 단계, 보이는 정보만 표시, 이동 중 적 발견, 정보 제한/완전 선택) → [`docs/rules/intel.md`](docs/rules/intel.md)
- [x] 새 게임 옵션 (원작 시작 메뉴: 시나리오·중공군 개입·역량·플레이 방식·항공·정보) → [`docs/rules/options.md`](docs/rules/options.md)
- [ ] 저장/불러오기
- [ ] AI (원본 Kim/Walton 분석 후 재설계)
- [ ] 보고서 화면, 전략 개관 지도
- [ ] 전체 한글화 마무리, 새 그래픽과 사운드

## 다음 단계 제안

자세한 순서는 `docs/HANDOFF.md` 7장.

1. **저장/불러오기**
2. **AI**
3. 보고서 화면, 전략 개관 지도

## 저작권 주의

원작의 저작권은 현재 권리자(SSI 카탈로그는 Ubisoft로 넘어간 것으로 추정)에게 있습니다.
이 저장소에는 원본 파일과 추출 데이터를 포함하지 않으며, 개인 학습/개인 플레이 용도로만 사용합니다.
공개 배포를 원하면 지도, 전투서열, 그래픽, 문구를 공개 사료로 새로 만들어야 합니다.
