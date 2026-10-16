# AGENTS.md

Conflict: Korea (SSI 1992) 웹 리메이크, 개인 프로젝트. 원작처럼 깊이 있는 작전급 시뮬레이션을 웹·마우스 중심·한국어로 재해석합니다.

## 먼저 읽기

1. `remake/docs/HANDOFF.md`: 방향, 현재 상태, 다음 작업, 작업 방법
2. `remake/docs/original-format.md`: 원본 포맷과 역공학 결과
3. 규칙의 기준: 원본 매뉴얼 PDF (이 폴더) + `remake/data/extracted/asm/` 디스어셈블

## 명령 (remake/ 에서, Node.js 24 LTS+, npm 설치 불필요)

```
node tools/extract/extract.ts      # 원본 → data/extracted (처음 한 번)
node tools/disasm/dis.cjs <PROC>   # 심볼 주석 디스어셈블
node tools/dev-server.mjs          # http://localhost:5173
node tools/build.mjs               # dist/standalone.html
```

## 규칙

- TypeScript는 지울 수 있는 문법만 (enum, namespace, 생성자 매개변수 속성 금지), `import type` 사용, 상대 import에 `.ts` 표기
- 런타임 의존성 추가 금지 (필요하면 HANDOFF.md에 이유 기록)
- `src/engine/`은 DOM 없는 순수 로직, 화면 문자열은 전부 `src/i18n/ko.ts`
- 헥스 좌표는 flat-top, even-q (짝수 열이 반 칸 아래), 방향 비트 N=1 NE=2 SE=4 S=8 SW=16 NW=32
- 원본 게임 파일, 매뉴얼, `data/extracted`, `dist`는 커밋하지 않음
- 작업을 마치면 HANDOFF.md의 "현재 상태"와 "다음 작업"을 갱신
