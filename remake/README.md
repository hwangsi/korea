# Conflict: Korea 리메이크 (개인 프로젝트)

SSI의 1992년 DOS 작전급 워게임 **Conflict: Korea – The First Year 1950-51** (Norm Koger 디자인)을
웹 기반으로 **현대적으로 재해석**하는 프로젝트입니다.

- 방향: 원작처럼 깊이 있는 작전급 시뮬레이션. 규칙은 원작 기준, UI/그래픽/편의 기능은 현대화 (규칙을 바꾸면 문서화)
- 플랫폼: 웹 브라우저
- 조작: 대부분 마우스 클릭만으로
- 언어: 한국어 우선 (한글화 필수)
- 성격: 개인 프로젝트. 원본 파일과 원본에서 추출한 데이터는 공개 저장소에 올리지 않습니다.

> 처음이거나 다른 PC·새 AI 세션에서 이어갈 때는 [`docs/HANDOFF.md`](docs/HANDOFF.md)부터 읽으세요.

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
    engine/                 규칙 엔진 (UI와 분리된 순수 로직)
    i18n/ko.ts              한글 용어집과 번역 규칙
    ui/                     지도 렌더러, 정보 패널
  tools/
    extract/                원본 -> JSON/PNG 추출기 (TDInfo 심볼, DAT, ILBM, 지형 해석)
    disasm/                 디스어셈블러, 문자열 추출 (vendor/iced-x86, MIT)
    dev-server.mjs          무설치 개발 서버 (Node 내장 TS 변환)
    build.mjs               정적 빌드 + standalone.html
  data/extracted/           추출 결과 (git 제외)
  docs/original-format.md   원본 포맷과 역공학 결과 정리
```

## 진행 상황

- [x] 원본 분석: Turbo Pascal 6 실행 파일에 남은 디버그 심볼(TDInfo)로 프로시저 285개, 변수, 레코드 구조 복원
- [x] 시나리오/세이브 포맷 완전 해독 (전역변수 영역 덤프 33,792바이트)
- [x] 지도 의미 데이터: 34×66 헥스, 지형, 강/도로/철도 6방향 연결, 도시, 항구, 비행장
- [x] 유닛 250개(1995년 202개), 장비, 항공대, 보충, 뉴스 추출 및 매뉴얼 수치 검증
- [x] 한글 지도 뷰어 프로토타입 (시나리오 8종, 점령지/전선, 부대 정보, 장비표)
- [ ] 규칙 엔진: 이동 → 전투 → 보급 → 턴 진행
- [ ] 마우스 중심 명령 UI (부대 선택, 이동 경로 미리보기, 공격 예상치)
- [ ] AI (원본 Kim/Walton 분석 후 재설계)
- [ ] 전체 한글화 (UI 문자열, 이벤트 뉴스), 새 그래픽과 사운드

## 다음 단계 제안

1. **규칙 명세 작성**: 매뉴얼(부록 F 공식) + 디스어셈블 결과로 이동/전투/보급 규칙을 `docs/rules.md`로 정리
2. **이동 시스템**: 이동 비용, 도로/철도 이동, 적 인접 이탈 비용을 엔진에 구현하고 지도에서 이동 가능 범위 표시
3. **전투 시스템**: 공격 지정 → 손실비 계산 → 후퇴/붕괴 처리, 전투 예상치 UI
4. **턴 루프**: 1차 명령 → 전투 → 2차 명령 → 정리(보급, 증원, 날씨)

## 저작권 주의

원작의 저작권은 현재 권리자(SSI 카탈로그는 Ubisoft로 넘어간 것으로 추정)에게 있습니다.
이 저장소에는 원본 파일과 추출 데이터를 포함하지 않으며, 개인 학습/개인 플레이 용도로만 사용합니다.
공개 배포를 원하면 지도, 전투서열, 그래픽, 문구를 공개 사료로 새로 만들어야 합니다.
